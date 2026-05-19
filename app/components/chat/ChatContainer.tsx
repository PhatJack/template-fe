import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import ChatInput from "./ChatInput";
import { ChatBubble } from "./ChatBubble";
import {
  fileService,
  messageService,
  conversationService,
  type FileRecord,
  type Message,
} from "~/services";
import { generateFakeObjectId } from "~/lib/utils";
import { useAuth } from "~/state/auth-context";
import { getQueryClient } from "~/lib/query-client";

type UiMessage = {
  id: string;
  role: "assistant" | "user";
  author: string;
  timestamp?: string;
  content: string;
  files?: FileRecord[];
  status?: "loading" | "streaming";
};

type ChatContainerProps = {
  conversationId?: string;
};

type SendMessageInput = {
  prompt: string;
  files?: File[];
};

function mapMessageToUiMessage(message: Message): UiMessage {
  const isAssistant = message.role === "ASSISTANT";

  return {
    id: message.id,
    role: isAssistant ? "assistant" : "user",
    author: isAssistant ? "Template.net AI" : "You",
    timestamp: message.createdAt || undefined,
    content: message.content,
    files: message.files ?? [],
  };
}

function mapMessagesToUiMessages(messages: Message[]): UiMessage[] {
  return [...messages]
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
    .map(mapMessageToUiMessage);
}

function createPreviewFileRecords(
  files: File[] | undefined,
  conversationId: string | undefined,
  messageId: string,
  createdAt: string,
): FileRecord[] {
  return (files ?? []).map((file) => ({
    id: generateFakeObjectId(),
    conversationId: conversationId ?? messageId,
    messageId,
    originalName: file.name,
    fileName: file.name,
    mimeType: file.type || "application/octet-stream",
    size: file.size,
    url: `preview:${file.name}`,
    createdAt,
    updatedAt: createdAt,
  }));
}

export function ChatContainer({
  conversationId: initialConversationId,
}: ChatContainerProps) {
  const {
    state: { currentUser },
  } = useAuth();
  const currentUserId = currentUser?.id;
  const queryClient = getQueryClient();
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<EventSource | null>(null);
  const previousUserIdRef = useRef<string | undefined>(currentUserId);

  const messagesQuery = useQuery({
    queryKey: ["messages", conversationId],
    queryFn: () => messageService.listMessages(conversationId!),
    enabled: !!conversationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ prompt, files }: SendMessageInput) => {
      let convId = conversationId;
      const userPlaceholderId = generateFakeObjectId();
      const assistantPlaceholderId = generateFakeObjectId();
      const userCreatedAt = new Date().toISOString();
      const assistantCreatedAt = new Date().toISOString();

      try {
        if (!convId) {
          const conversation = await conversationService.createConversation({
            userId: currentUserId ?? generateFakeObjectId(),
            prompt,
          });
          convId = conversation.id;
          setConversationId(convId);
        }

        setMessages((prev) => [
          ...prev,
          {
            id: userPlaceholderId,
            role: "user",
            author: "You",
            timestamp: userCreatedAt,
            content: prompt,
            files: createPreviewFileRecords(
              files,
              convId,
              userPlaceholderId,
              userCreatedAt,
            ),
          },
          {
            id: assistantPlaceholderId,
            role: "assistant",
            author: "Template.net AI",
            timestamp: assistantCreatedAt,
            content: "",
            status: "loading",
          },
        ]);

        const created = await messageService.createMessage({
          conversationId: convId,
          role: "USER",
          content: prompt,
        });

        if (files?.length) {
          const uploadedFiles = await fileService.uploadFiles({
            conversationId: convId,
            messageId: created.id,
            files,
          });

          setMessages((prev) =>
            prev.map((message) =>
              message.id === userPlaceholderId
                ? {
                    ...message,
                    files: uploadedFiles,
                  }
                : message,
            ),
          );
        }

        setMessages((prev) =>
          prev.map((message) =>
            message.id === userPlaceholderId
              ? {
                  ...message,
                  id: created.id,
                  timestamp: created.createdAt,
                }
              : message,
          ),
        );

        streamRef.current?.close();

        await new Promise<void>((resolve, reject) => {
          streamRef.current = messageService.streamMessage(
            { messageId: created.id },
            {
              onChunk: (text) => {
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantPlaceholderId
                      ? {
                          ...message,
                          content: `${message.content}${text}`,
                          status: "streaming",
                        }
                      : message,
                  ),
                );
              },
              onDone: ({ assistantMessage }) => {
                setMessages((prev) =>
                  prev.map((message) =>
                    message.id === assistantPlaceholderId
                      ? {
                          id: assistantMessage.id,
                          role: "assistant",
                          author: "Template.net AI",
                          timestamp: assistantMessage.createdAt,
                          content: assistantMessage.content,
                          files: assistantMessage.files ?? [],
                        }
                      : message,
                  ),
                );
                streamRef.current = null;
                resolve();
              },
              onError: (error) => {
                console.error("Message stream failed", error);
                setMessages((prev) =>
                  prev.filter(
                    (message) => message.id !== assistantPlaceholderId,
                  ),
                );
                streamRef.current = null;
                reject(error);
              },
            },
          );
        });

        return convId;
      } catch (error) {
        if (userPlaceholderId || assistantPlaceholderId) {
          setMessages((prev) =>
            prev.filter(
              (message) =>
                message.id !== userPlaceholderId &&
                message.id !== assistantPlaceholderId,
            ),
          );
        }

        streamRef.current?.close();
        streamRef.current = null;
        throw error;
      }
    },
    onSuccess: async (convId) => {
      if (convId) {
        await queryClient.invalidateQueries({
          queryKey: ["messages", convId],
        });
      }

      if (currentUserId) {
        await queryClient.invalidateQueries({
          queryKey: ["conversations", currentUserId],
        });
      }
    },
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, [messages]);

  useEffect(() => {
    streamRef.current?.close();
    streamRef.current = null;
    setConversationId(initialConversationId);
    setMessages([]);
  }, [initialConversationId]);

  useEffect(() => {
    const previousUserId = previousUserIdRef.current;

    if (previousUserId && previousUserId !== currentUserId) {
      streamRef.current?.close();
      streamRef.current = null;
      setConversationId(undefined);
      setMessages([]);
    }

    previousUserIdRef.current = currentUserId;
  }, [currentUserId]);

  useEffect(() => {
    if (sendMessageMutation.isPending) {
      return;
    }

    if (!messagesQuery.data) {
      setMessages([]);
      return;
    }

    setMessages(mapMessagesToUiMessages(messagesQuery.data));
  }, [messagesQuery.data, sendMessageMutation.isPending]);

  useEffect(() => {
    return () => {
      streamRef.current?.close();
    };
  }, []);

  const handleSend = useCallback(
    async (prompt: string, files?: File[]) => {
      if (!prompt || sendMessageMutation.isPending) return;

      await sendMessageMutation.mutateAsync({ prompt, files });
    },
    [sendMessageMutation],
  );

  return (
    <section
      className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col px-4"
      aria-label="Template.net AI chat"
    >
      <div
        ref={containerRef}
        className="custom-scrollbar flex min-h-0 w-full flex-1 flex-col overflow-y-auto scroll-smooth py-6"
      >
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            role={message.role}
            author={message.author}
            timestamp={message.timestamp}
            loading={message.status === "loading"}
            files={message.files}
          >
            {message.content}
          </ChatBubble>
        ))}
      </div>

      <div className="bg-muted-surface sticky right-0 bottom-0 left-0 z-40 pt-10 pb-4">
        <ChatInput
          onSubmit={handleSend}
          disabled={sendMessageMutation.isPending}
        />
      </div>
    </section>
  );
}
