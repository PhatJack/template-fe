import React, { useState, useRef, useCallback, useLayoutEffect } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import {
  ChevronsLeftRight,
  ChevronsRightLeft,
  Plus,
  Sparkles,
} from "lucide-react";

type ChatInputProps = {
  onSubmit?: (prompt: string) => Promise<void>;
  disabled?: boolean;
};

const ChatInput = ({ onSubmit, disabled }: ChatInputProps) => {
  const [prompt, setPrompt] = useState<string>("");
  const [isShowExpandIcon, setIsShowExpandIcon] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const checkLines = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const styles = window.getComputedStyle(textarea);
    const lineHeight = parseFloat(styles.lineHeight);

    const lines = textarea.scrollHeight / lineHeight;

    setIsShowExpandIcon(lines > 4);
  };

  const sendPrompt = useCallback(async () => {
    const value = prompt.trim();
    if (!value || disabled) return;

    setPrompt("");

    try {
      await onSubmit?.(value);
    } catch (err) {
      console.error(err);
      setPrompt(value);
    }
  }, [prompt, disabled, onSubmit]);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendPrompt();
  };

  const resizeTextarea = (height: number) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = `${height}px`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);

    requestAnimationFrame(() => {
      checkLines();
    });
  };
  useLayoutEffect(() => {
    if (isExpanded) {
      resizeTextarea(300);
    } else {
      resizeTextarea(60);
    }
  }, [isExpanded]);

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
            className="text-foreground hover:bg-soft-background flex size-10 cursor-pointer items-center justify-center rounded-full transition-colors"
            disabled={disabled}
          >
            <Plus aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>

          <button
            type="submit"
            disabled={disabled || prompt.trim().length === 0}
            className="bg-primary text-background hover:bg-primary-hover flex h-10 items-center gap-1 rounded-full px-3 text-xs leading-none font-semibold shadow-[0_4px_12px_rgba(30,13,255,0.2)] transition hover:shadow-[0_6px_16px_rgba(30,13,255,0.3)] disabled:opacity-60"
          >
            <Sparkles aria-hidden="true" className="size-4" strokeWidth={2} />
            Generate Free
          </button>
        </div>
      </div>
    </form>
  );
};

export default ChatInput;
