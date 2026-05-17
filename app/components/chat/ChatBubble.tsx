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
            "text-muted-surface flex max-w-[85%] items-center gap-2 text-sm leading-4.5",
            isUser ? "justify-end" : "justify-start",
          )}
        >
          {author && !isUser && (
            <span className="text-foreground font-medium">{author}</span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full rounded-2xl py-3 text-sm leading-5 shadow-none",
          isUser
            ? "bg-primary text-background w-fit max-w-[80%] rounded-br-sm px-4"
            : "text-foreground pr-4",
        )}
      >
        {loading ? (
          <span className="text-foreground flex items-center gap-2">
            <Loader2
              aria-hidden="true"
              className="text-primary size-4 animate-spin"
            />
            AI is thinking
          </span>
        ) : (
          <div className="prose-sm prose-p:my-0 w-full">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {children as string}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
