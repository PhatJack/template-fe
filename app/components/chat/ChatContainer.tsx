import { useCallback, useEffect, useRef, useState } from "react";
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
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(
    initialConversationId,
  );
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamRef = useRef<EventSource | null>(null);

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
    if (loading) return;

    async function loadMessages(id: string) {
      try {
        const msgs = await messageService.listMessages(id);
        setMessages(mapMessagesToUiMessages(msgs));
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }

    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId, loading]);

  useEffect(() => {
    return () => {
      streamRef.current?.close();
    };
  }, []);

  const handleSend = useCallback(
    async (prompt: string, files?: File[]) => {
      if (!prompt || loading) return;
      setLoading(true);

      const userPlaceholderId = generateFakeObjectId();
      const userCreatedAt = new Date().toISOString();
      const userUi: UiMessage = {
        id: userPlaceholderId,
        role: "user",
        author: "You",
        timestamp: userCreatedAt,
        content: prompt,
        files: createPreviewFileRecords(
          files,
          conversationId,
          userPlaceholderId,
          userCreatedAt,
        ),
      };

      const assistantPlaceholderId = generateFakeObjectId();
      const assistantUi: UiMessage = {
        id: assistantPlaceholderId,
        role: "assistant",
        author: "Template.net AI",
        timestamp: new Date().toISOString(),
        content: "",
        status: "loading",
      };

      setMessages((prev) => [...prev, userUi, assistantUi]);

      try {
        let convId = conversationId;

        if (!convId) {
          const conv = await conversationService.createConversation({
            userId: currentUserId ?? generateFakeObjectId(),
            prompt,
          });
          convId = conv.id;
          setConversationId(convId);
        }

        // create the user message
        const created = await messageService.createMessage({
          conversationId: convId!,
          role: "USER",
          content: prompt,
        });
        if (files?.length) {
          const uploadedFiles = await fileService.uploadFiles({
            conversationId: convId!,
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
              setLoading(false);
            },
            onError: (error) => {
              console.error("Message stream failed", error);
              setMessages((prev) =>
                prev.filter((message) => message.id !== assistantPlaceholderId),
              );
              streamRef.current = null;
              setLoading(false);
            },
          },
        );
      } catch (err) {
        console.error("Send failed", err);
        setMessages((prev) =>
          prev.filter(
            (message) =>
              message.id !== userPlaceholderId &&
              message.id !== assistantPlaceholderId,
          ),
        );
        streamRef.current?.close();
        streamRef.current = null;
        setLoading(false);
      }
    },
    [conversationId, currentUserId, loading],
  );

  return (
    <section
      className="mx-auto flex h-full min-h-0 w-full max-w-4xl flex-col px-4"
      aria-label="Template.net AI chat"
    >
      <div
        ref={containerRef}
        className="custom-scrollbar flex min-h-0 w-full flex-1 flex-col gap-4 overflow-y-auto scroll-smooth py-6"
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
        <ChatInput onSubmit={handleSend} disabled={loading} />
      </div>
    </section>
  );
}
