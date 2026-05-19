import { memo, type ReactNode } from "react";
import { cn, formatFileSize, formatMimeType } from "../../lib/utils";
import {
  FileAudio,
  File as FileIcon,
  FileImage,
  FileText,
  FileVideo,
  Copy,
  Check,
  Loader2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { FileRecord } from "~/services";
import RotatingText from "../ui/RotatingText";
import { useCopyToClipboard } from "~/hooks/useCopyToClipBoard";

export type ChatBubbleRole = "assistant" | "user";

type ChatBubbleProps = {
  role: ChatBubbleRole;
  children: ReactNode;
  author?: string;
  timestamp?: string;
  loading?: boolean;
  files?: FileRecord[];
};

type FileAttachmentProps = {
  file: FileRecord;
  isUser: boolean;
};

const markdownPlugins = [remarkGfm];
const loadingTexts = [
  "Analyzing your request",
  "Thinking",
  "Understanding your prompt",
  "Generating response",
  "Almost done",
  "Preparing the final response",
];
const rotatingTextInitial = { y: "100%" };
const rotatingTextAnimate = { y: 0 };
const rotatingTextExit = { y: "-100%" };
const rotatingTextTransition = {
  type: "spring" as const,
  damping: 30,
  stiffness: 400,
};

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return FileImage;
  if (mimeType.startsWith("audio/")) return FileAudio;
  if (mimeType.startsWith("video/")) return FileVideo;
  if (mimeType.startsWith("text/") || mimeType === "application/pdf") {
    return FileText;
  }

  return FileIcon;
}

const FileAttachment = memo(function FileAttachment({
  file,
  isUser,
}: FileAttachmentProps) {
  const Icon = getFileIcon(file.mimeType);
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
          {formatMimeType(file.mimeType)} - {formatFileSize(file.size)}
        </span>
      </span>
    </>
  );

  return (
    <div
      className={cn(
        "border-border-light flex max-w-full min-w-0 items-center gap-2 rounded-xl border px-3 py-2 text-left",
        isUser ? "bg-background text-foreground" : "bg-muted-surface",
      )}
    >
      {content}
    </div>
  );
});

export const ChatBubble = memo(function ChatBubble({
  role,
  children,
  author,
  timestamp,
  loading,
  files,
}: ChatBubbleProps) {
  const isUser = role === "user";
  const hasFiles = Boolean(files?.length);
  const content = typeof children === "string" ? children : "";
  const [copiedText, copy] = useCopyToClipboard();
  const isCopied = copiedText === content;

  const handleCopy = async () => {
    await copy(content);
  };

  return (
    <div
      className={cn(
        "group relative flex w-full flex-col gap-2 py-2",
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
          {files?.map((file) => (
            <FileAttachment key={file.id} file={file} isUser={isUser} />
          ))}
        </div>
      )}

      <div
        className={cn(
          "flex w-full flex-col gap-3 rounded-2xl py-3 text-sm leading-5 shadow-none",
          isUser
            ? "bg-primary text-background w-fit max-w-[80%] rounded-br-sm px-4"
            : "text-foreground pr-10",
        )}
      >
        {loading ? (
          <span className="text-foreground relative flex items-center gap-2 overflow-hidden">
            <Loader2
              aria-hidden="true"
              className="text-primary size-4 animate-spin"
            />
            <RotatingText
              texts={loadingTexts}
              initial={rotatingTextInitial}
              animate={rotatingTextAnimate}
              exit={rotatingTextExit}
              staggerDuration={0.025}
              splitLevelClassName="overflow-hidden"
              transition={rotatingTextTransition}
              rotationInterval={2000}
              splitBy="words"
              auto
              loop
            />
          </span>
        ) : (
          <div className="prose-sm prose-p:my-0 w-full">
            <ReactMarkdown remarkPlugins={markdownPlugins}>
              {children as string}
            </ReactMarkdown>
          </div>
        )}
      </div>
      {!loading && content && (
        <button
          type="button"
          aria-label="Copy message"
          className={cn(
            "border-border-light bg-background hover:bg-soft-background text-foreground flex size-10 cursor-pointer items-center justify-center rounded-full border opacity-0 shadow-sm transition-all duration-150 group-hover:opacity-100 hover:opacity-100 focus-visible:opacity-100",
          )}
          onClick={handleCopy}
        >
          {isCopied ? (
            <Check aria-hidden="true" className="size-4" />
          ) : (
            <Copy aria-hidden="true" className="size-4" />
          )}
        </button>
      )}
    </div>
  );
});
