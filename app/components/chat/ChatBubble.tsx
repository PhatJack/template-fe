import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
export type ChatBubbleRole = "assistant" | "user";

type ChatBubbleProps = {
  role: ChatBubbleRole;
  children: React.ReactNode;
  author?: string;
  timestamp?: string;
  loading?: boolean;
};

export function ChatBubble({
  role,
  children,
  author,
  timestamp,
  loading,
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
            "flex max-w-[85%] items-center gap-2 text-sm leading-4.5 text-muted-surface",
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
          "w-full rounded-2xl py-3 text-sm leading-5 shadow-none",
          isUser
            ? "px-4 rounded-br-sm bg-primary text-background w-fit max-w-[80%]"
            : "pr-4 text-foreground",
        )}
      >
        {loading ? (
          <span className="flex items-center gap-2 text-foreground">
            <Loader2
              aria-hidden="true"
              className="size-4 animate-spin text-primary"
            />
            AI is thinking
          </span>
        ) : (
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {children as string}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
}
