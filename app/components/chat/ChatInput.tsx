import React, {
  memo,
  useState,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Plus,
  Sparkles,
} from "lucide-react";
import FileItem from "../ui/FileItem";

const supportedGeminiMimeTypes = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "text/html",
  "text/xml",
  "application/xml",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/heic",
  "image/heif",
  "audio/wav",
  "audio/mp3",
  "audio/mpeg",
  "audio/aiff",
  "audio/aac",
  "audio/ogg",
  "audio/flac",
  "video/mp4",
  "video/mpeg",
  "video/mov",
  "video/avi",
  "video/x-flv",
  "video/mpg",
  "video/webm",
  "video/wmv",
  "video/3gpp",
];

const supportedGeminiMimeTypeSet = new Set(supportedGeminiMimeTypes);

type ChatInputProps = {
  onSubmit?: (prompt: string, files?: File[]) => Promise<void>;
  disabled?: boolean;
};

const ChatInput = memo(function ChatInput({
  onSubmit,
  disabled,
}: ChatInputProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>("");
  const [isShowExpandIcon, setIsShowExpandIcon] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const checkLines = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const styles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(styles.lineHeight);

    const lines = textarea.scrollHeight / lineHeight;

    setIsShowExpandIcon(lines > 4);
  }, []);

  const sendPrompt = useCallback(async () => {
    const value = prompt.trim();
    if (!value || disabled) return;

    setPrompt("");

    try {
      setSelectedFiles([]);
      await onSubmit?.(value, selectedFiles);
      setFileError(null);
    } catch (err) {
      console.error(err);
      setPrompt(value);
    }
  }, [prompt, disabled, onSubmit, selectedFiles]);

  const handleSubmit = useCallback(
    async (e: React.SubmitEvent<HTMLFormElement>) => {
      e.preventDefault();
      await sendPrompt();
    },
    [sendPrompt],
  );

  const resizeTextarea = useCallback((height: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = `${height}px`;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPrompt(e.target.value);

      requestAnimationFrame(() => {
        checkLines();
      });
    },
    [checkLines],
  );

  useLayoutEffect(() => {
    if (isExpanded) {
      resizeTextarea(300);
    } else {
      resizeTextarea(60);
    }
  }, [isExpanded, resizeTextarea]);

  // Submit on Enter (without Shift) when textarea is focused
  useHotkeys(
    "enter",
    (e: KeyboardEvent) => {
      if (
        document.activeElement === textareaRef.current &&
        !e.shiftKey &&
        !disabled
      ) {
        e.preventDefault();
        void sendPrompt();
      }
    },
    {
      enableOnFormTags: ["TEXTAREA"],
    },
    [sendPrompt, disabled],
  );

  const onRemoveFile = useCallback((index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const incomingFiles = Array.from(event.target.files ?? []);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      if (incomingFiles.length === 0) {
        return;
      }

      const unsupportedFiles = incomingFiles.filter(
        (file) => !supportedGeminiMimeTypeSet.has(file.type),
      );
      const supportedFiles = incomingFiles.filter((file) =>
        supportedGeminiMimeTypeSet.has(file.type),
      );

      setSelectedFiles((prev) => [...prev, ...supportedFiles]);
      setFileError(
        unsupportedFiles.length
          ? `${unsupportedFiles.map((file) => file.name).join(", ")} is not supported.`
          : null,
      );
    },
    [],
  );

  return (
    <form
      className="mx-auto w-full max-w-4xl"
      aria-label="Template generation prompt"
      onSubmit={handleSubmit}
    >
      <div className="border-border bg-surface focus-within:border-primary relative flex min-h-17 flex-col rounded-2xl border pt-2 shadow-[0_1px_3px_rgba(31,33,36,0.08)] transition-colors">
        <label htmlFor="prompt" className="sr-only">
          Ask template.net
        </label>
        {selectedFiles.length > 0 && (
          <div className="flex items-center gap-2 px-3 py-2">
            {selectedFiles.map((file, index) => (
              <FileItem
                key={index}
                file={file}
                onRemove={() => onRemoveFile(index)}
              />
            ))}
          </div>
        )}
        {fileError && (
          <p className="text-error px-3 pb-1 text-xs">{fileError}</p>
        )}
        <div className="w-full px-3 py-2">
          <textarea
            id="prompt"
            ref={textareaRef}
            rows={3}
            value={prompt}
            onChange={handleChange}
            placeholder="Ask template.net"
            className="custom-scrollbar text-input placeholder:text-muted-light max-h-60 min-h-10 w-full resize-none overflow-y-auto bg-transparent text-sm leading-4.5 transition-[height] duration-200 ease-out outline-none"
          />
        </div>

        {isShowExpandIcon && (
          <button
            type="button"
            aria-label={isExpanded ? "Collapse textarea" : "Expand textarea"}
            className="text-foreground hover:bg-soft-background absolute top-2 right-2 flex size-8 cursor-pointer items-center justify-center rounded-full p-2"
            onClick={() => setIsExpanded((prev) => !prev)}
          >
            {!isExpanded ? (
              <ChevronsLeftRight className="size-4 -rotate-45" />
            ) : (
              <ChevronsRightLeft className="size-4 -rotate-45" />
            )}
          </button>
        )}

        <div className="flex items-center justify-between px-3 pb-3">
          <button
            type="button"
            aria-label="Add attachment"
            className="text-foreground hover:bg-soft-background relative flex size-10 items-center justify-center rounded-full transition-colors"
            disabled={disabled}
          >
            <Plus
              aria-hidden="true"
              className="size-5 cursor-pointer"
              strokeWidth={2}
            />
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={supportedGeminiMimeTypes.join(",")}
              className="absolute inset-0 cursor-pointer opacity-0"
              onChange={handleFileChange}
            />
          </button>

          <button
            type="submit"
            disabled={disabled || prompt.trim().length === 0}
            className="bg-primary text-background hover:bg-primary-hover flex h-10 cursor-pointer items-center gap-1 rounded-full px-3 text-xs leading-none font-semibold shadow-[0_4px_12px_rgba(30,13,255,0.2)] transition hover:shadow-[0_6px_16px_rgba(30,13,255,0.3)] disabled:opacity-60"
          >
            <Sparkles aria-hidden="true" className="size-4" strokeWidth={2} />
            Generate Free
          </button>
        </div>
      </div>
    </form>
  );
});

export default ChatInput;
