import React, { useEffect, useRef, useState } from "react";
import ChatInput from "./ChatInput";
import { ChatBubble } from "./ChatBubble";
import { messageService, conversationService, type Message } from "~/services";
import { generateFakeObjectId } from "~/lib/utils";

const initialMessages = [
  {
    role: "assistant",
    author: "Template.net AI",
    timestamp: "Now",
    content:
      "Hi! Tell me what you want to create and I can turn it into a polished template draft.",
  },
];

export function ChatContainer() {
  const [messages, setMessages] = useState<any[]>(initialMessages);
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // scroll to bottom when messages change
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    // if we have a conversationId, load its messages
    async function loadMessages(id: string) {
      try {
        const msgs = await messageService.listMessages(id);
        const uiMsgs = msgs.map((m: Message) => ({
          id: m.id,
          role: m.role === "ASSISTANT" ? "assistant" : m.role === "USER" ? "user" : String(m.role).toLowerCase(),
          author: m.role === "ASSISTANT" ? "Template.net AI" : "You",
          timestamp: m.createdAt || undefined,
          content: m.content,
        }));
        setMessages(uiMsgs);
      } catch (err) {
        console.error("Failed to load messages", err);
      }
    }

    if (conversationId) {
      loadMessages(conversationId);
    }
  }, [conversationId]);

  const handleSend = async (prompt: string) => {
    if (!prompt || loading) return;
    setLoading(true);

    try {
      let convId = conversationId;

      if (!convId) {
        // create fake user id when there's no auth
        const fakeUserId = generateFakeObjectId();
        const conv = await conversationService.createConversation({ userId: fakeUserId, prompt });
        convId = conv._id;
        setConversationId(convId);
      }

      // create the user message
      const created = await messageService.createMessage({ conversationId: convId!, role: "USER", content: prompt });

      const userUi = {
        id: created.id,
        role: "user",
        author: "You",
        timestamp: created.createdAt,
        content: created.content,
      };

      setMessages((prev) => [...prev, userUi]);

      // request AI reply
      const generated = await messageService.generateMessage({ messageId: created.id });

      const assistant = generated.assistantMessage;
      const assistantUi = {
        id: assistant.id,
        role: "assistant",
        author: "Template.net AI",
        timestamp: assistant.createdAt,
        content: assistant.content,
      };

      setMessages((prev) => [...prev, assistantUi]);
    } catch (err) {
      console.error("Send failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="mx-auto flex w-full flex-col"
      aria-label="Template.net AI chat"
    >
      <div ref={containerRef} className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 md:px-6">
        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.id ?? message.role}-${index}`}
            role={message.role}
            author={message.author}
            timestamp={message.timestamp}
          >
            {message.content}
          </ChatBubble>
        ))}
      </div>

      <div className="px-3 py-3 md:px-6 md:py-4">
        <ChatInput onSubmit={handleSend} disabled={loading} />
      </div>
    </section>
  );
}
