import { cn } from "../../lib/utils";
import {
  ExternalLink,
  FileAudio,
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { FileRecord } from "~/services";
import RotatingText from "../ui/RotatingText";

export type ChatBubbleRole = "assistant" | "user";

type ChatBubbleProps = {
  role: ChatBubbleRole;
  children: React.ReactNode;
  author?: string;
  timestamp?: string;
  loading?: boolean;
  files?: FileRecord[];
};

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatMimeType(mimeType: string) {
  const [, subtype] = mimeType.split("/");
  return (subtype || mimeType || "file").toUpperCase();
}

function isWebUrl(url: string) {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("text/") || mimeType === "application/pdf") {
    return FileText;
  }

  return FileIcon;
}

export function ChatBubble({
  role,
  children,
  author,
  timestamp,
  loading,
  files,
}: ChatBubbleProps) {
  const isUser = role === "user";
  const hasFiles = Boolean(files?.length);

  return (
    <div
      className={cn(
        "flex w-full flex-col gap-2",
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

      {!loading && hasFiles && (
        <div
          className={cn(
            "flex w-full max-w-full flex-col gap-2",
            isUser ? "items-end" : "items-start",
          )}
        >
          {files?.map((file) => {
            const Icon = getFileIcon(file.mimeType);
            const canOpen = isWebUrl(file.url);
            const content = (
              <>
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    isUser
                      ? "bg-primary text-background"
                      : "bg-muted-surface text-muted-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className="size-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="text-foreground block truncate text-sm font-medium">
                    {file.originalName}
                  </span>
                  <span
                    className={cn(
                      "block truncate text-xs",
                      isUser ? "text-muted" : "text-muted-foreground",
                    )}
                  >
                    {formatMimeType(file.mimeType)} -{" "}
                    {formatFileSize(file.size)}
                  </span>
                </span>
              </>
            );

            return canOpen ? (
              <a
                key={file.id}
                href={file.url}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  "flex max-w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left transition-colors",
                  isUser
                    ? "border-border-light bg-background hover:bg-soft-background text-foreground"
                    : "border-border-light bg-muted-surface hover:bg-soft-background",
                )}
              >
                {content}
              </a>
            ) : (
              <div
                key={file.id}
                className={cn(
                  "flex max-w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left",
                  isUser
                    ? "border-border-light bg-background text-foreground"
                    : "border-border-light bg-muted-surface",
                )}
              >
                {content}
              </div>
            );
          })}
        </div>
      )}

      <div
        className={cn(
          "flex w-full flex-col gap-3 rounded-2xl py-3 text-sm leading-5 shadow-none",
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
            <RotatingText
              texts={["AI is thinking", "AI is generating"]}
              animate={{ y: 0 }}
              exit={{ y: "-120%" }}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
              transition={{ type: "spring", damping: 30, stiffness: 400 }}
              rotationInterval={1200}
              splitBy="characters"
              auto
              loop
            />
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
