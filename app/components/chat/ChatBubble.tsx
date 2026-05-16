import { cn } from "../../lib/utils";

export type ChatBubbleRole = "assistant" | "user";

type ChatBubbleProps = {
  role: ChatBubbleRole;
  children: React.ReactNode;
  author?: string;
  timestamp?: string;
};

export function ChatBubble({
  role,
  children,
  author,
  timestamp,
}: ChatBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-1",
        isUser ? "items-end" : "items-start",
      )}
    >
      {(author || timestamp) && (
        <div
          className={cn(
            "flex max-w-[82%] items-center gap-2 text-sm leading-4.5 text-muted-surface",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          {author && !isUser && (
            <span className="font-medium text-foreground">{author}</span>
          )}
        </div>
      )}

      <div
        className={cn(
          "max-w-[82%] rounded-2xl py-3 text-sm leading-5 shadow-none",
          isUser
            ? "px-4 rounded-br-sm bg-primary text-background"
            : "pr-4 text-foreground",
        )}
      >
        {children}
      </div>
    </div>
  );
}
