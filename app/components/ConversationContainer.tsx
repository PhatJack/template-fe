import { useEffect, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { useLocation, useNavigate } from "react-router";
import { conversationService, type Conversation } from "~/services";
import { useAuth } from "~/state/auth-context";
import { cn } from "~/lib/utils";

const ConversationContainer = () => {
  const {
    state: { currentUser },
  } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setConversations([]);
      return;
    }

    let ignore = false;

    async function loadConversations() {
      try {
        setLoading(true);
        const items = await conversationService.listConversations(
          currentUser!.id,
        );

        if (!ignore) {
          setConversations(items);
        }
      } catch (error) {
        console.error("Failed to load conversations", error);

        if (!ignore) {
          setConversations([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    void loadConversations();

    return () => {
      ignore = true;
    };
  }, [currentUser]);

  if (!currentUser) {
    return null;
  }

  return (
    <aside className="hidden h-full w-64 shrink-0 border-r border-border-light bg-muted-surface px-3 py-4 md:block">
      <div className="mb-3 px-2">
        <h2 className="text-sm font-semibold text-foreground">Conversations</h2>
      </div>

      <div className="flex flex-col gap-1">
        {loading && <p className="px-2 py-2 text-xs text-muted">Loading...</p>}

        {!loading && conversations.length === 0 && (
          <p className="px-2 py-2 text-xs leading-5 text-muted">
            No conversations yet.
          </p>
        )}

        {conversations.map((conversation) => {
          const href = `/conversation/${conversation.id}`;
          const active = location.pathname === href;

          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => navigate(href)}
							title={conversation.title?.trim() || "Untitled conversation"}
              className={cn(
                "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors cursor-pointer",
                active
                  ? "bg-secondary text-surface"
                  : "text-foreground hover:bg-muted-surface",
              )}
            >
              <MessageSquareText
                aria-hidden="true"
                className="size-4 shrink-0 text-surface"
                strokeWidth={1.8}
              />
              <span className="truncate">
                {conversation.title?.trim() || "Untitled conversation"}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
};

export default ConversationContainer;
