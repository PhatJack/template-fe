import React, { useState, useRef, useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { Plus, Sparkles } from "lucide-react";

type ChatInputProps = {
  onSubmit?: (prompt: string) => Promise<void>;
  disabled?: boolean;
};

const ChatInput = ({ onSubmit, disabled }: ChatInputProps) => {
  const [prompt, setPrompt] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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
      <div className="flex min-h-17 flex-col rounded-2xl border border-border bg-surface shadow-[0_1px_3px_rgba(31,33,36,0.08)] transition-colors focus-within:border-primary">
        <label htmlFor="prompt" className="sr-only">
          Ask template.net
        </label>
        <textarea
          id="prompt"
          ref={textareaRef}
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ask template.net"
          className="min-h-10 resize-none rounded-t-lg bg-transparent px-3 pt-3 text-sm leading-4.5 text-input outline-none placeholder:text-muted-light"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-soft-background cursor-pointer"
            disabled={disabled}
          >
            <Plus aria-hidden="true" className="size-5" strokeWidth={2} />
          </button>

          <button
            type="submit"
            disabled={disabled || prompt.trim().length === 0}
            className="flex h-10 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold leading-none text-background shadow-[0_4px_12px_rgba(30,13,255,0.2)] transition hover:bg-primary-hover hover:shadow-[0_6px_16px_rgba(30,13,255,0.3)] disabled:opacity-60"
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
