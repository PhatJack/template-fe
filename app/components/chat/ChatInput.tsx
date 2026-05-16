import { Plus, Sparkles } from "lucide-react";

const ChatInput = () => {
  return (
    <form className="mx-auto w-full" aria-label="Template generation prompt">
      <div className="flex min-h-19.5 flex-col rounded-2xl border border-border bg-surface shadow-[0_1px_3px_rgba(31,33,36,0.08)] transition-colors focus-within:border-primary">
        <label htmlFor="prompt" className="sr-only">
          Ask template.net
        </label>
        <textarea
          id="prompt"
          rows={4}
          placeholder="Ask template.net"
          className="min-h-10 resize-none rounded-t-lg bg-transparent px-3 pt-3 text-sm leading-4.5 text-input outline-none placeholder:text-muted-light"
        />

        <div className="flex items-center justify-between px-3 pb-3">
          <button
            type="button"
            aria-label="Add attachment"
            className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-soft-background cursor-pointer"
          >
            <Plus aria-hidden="true" className="h-4 w-4" strokeWidth={2} />
          </button>

          <button
            type="submit"
            className="flex h-10 items-center gap-1 rounded-full bg-primary px-3 text-xs font-semibold leading-none text-background shadow-[0_4px_12px_rgba(30,13,255,0.2)] transition hover:bg-primary-hover hover:shadow-[0_6px_16px_rgba(30,13,255,0.3)]"
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
