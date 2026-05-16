import ChatInput from "./ChatInput";
import { ChatBubble } from "./ChatBubble";

const messages = [
  {
    role: "assistant" as const,
    author: "Template.net AI",
    timestamp: "Now",
    content:
      "Hi! Tell me what you want to create and I can turn it into a polished template draft.",
  },
  {
    role: "user" as const,
    author: "You",
    content: "Create a modern project proposal for a creative agency.",
  },
  {
    role: "assistant" as const,
    author: "Template.net AI",
    content:
      "Great. I can prepare a structured proposal with scope, timeline, pricing, and a clean visual direction.",
  },
];

export function ChatContainer() {
  return (
    <section
      className="mx-auto flex w-full flex-col"
      aria-label="Template.net AI chat"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-6 md:px-6">
        {messages.map((message, index) => (
          <ChatBubble
            key={`${message.role}-${index}`}
            role={message.role}
            author={message.author}
            timestamp={message.timestamp}
          >
            {message.content}
          </ChatBubble>
        ))}
      </div>

      <div className="px-3 py-3 md:px-6 md:py-4">
        <ChatInput />
      </div>
    </section>
  );
}
