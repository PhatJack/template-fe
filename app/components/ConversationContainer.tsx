import { useQuery } from "@tanstack/react-query";
import { BadgePlus, MessageSquareText } from "lucide-react";
import { Link, useLocation } from "react-router";
import { conversationService, type Conversation } from "~/services";
import { useAuth } from "~/state/auth-context";
import { cn } from "~/lib/utils";

const ConversationContainer = () => {
  const {
    state: { currentUser },
  } = useAuth();
  const location = useLocation();
  const { data: conversations = [], isLoading } = useQuery<Conversation[]>({
    queryKey: ["conversations", currentUser?.id],
    queryFn: () => conversationService.listConversations(currentUser!.id),
    enabled: !!currentUser,
  });

  if (!currentUser) {
    return null;
  }

  return (
    <aside className="border-border-light bg-muted-surface hidden h-full w-64 shrink-0 border-r px-3 pb-4 md:block">
      <div className="mb-3 flex items-center justify-between px-2">
        <h2 className="text-foreground text-sm font-semibold">Conversations</h2>
        <Link
          to={"/"}
          className="text-foreground hover:bg-primary-hover hover:text-surface flex size-8 items-center justify-center rounded-md p-1"
        >
          <span className="sr-only">New conversation</span>
          <BadgePlus className="size-4" />
        </Link>
      </div>

      <div className="flex flex-col gap-1">
        {isLoading && (
          <p className="text-muted px-2 py-2 text-xs">Loading...</p>
        )}

        {!isLoading && conversations.length === 0 && (
          <p className="text-muted px-2 py-2 text-xs leading-5">
            No conversations yet.
          </p>
        )}

        {conversations.map((conversation) => {
          const href = `/conversation/${conversation.id}`;
          const active = location.pathname === href;

          return (
            <Link
              key={conversation.id}
              to={href}
              title={conversation.title?.trim() || "Untitled conversation"}
              className={cn(
                "group flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-left text-sm",
                active
                  ? "bg-secondary text-surface"
                  : "text-foreground hover:bg-primary-hover",
              )}
            >
              <MessageSquareText
                aria-hidden="true"
                className={cn(
                  "size-4 shrink-0",
                  active
                    ? "text-surface"
                    : "text-foreground group-hover:text-surface",
                )}
                strokeWidth={1.8}
              />
              <span className="group-hover:text-surface truncate">
                {conversation.title?.trim() || "Untitled conversation"}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};

export default ConversationContainer;
