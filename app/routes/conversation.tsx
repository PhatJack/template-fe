import { Link, redirect, useParams } from "react-router";
import { ChatContainer } from "~/components/chat/ChatContainer";
import ConversationContainer from "~/components/ConversationContainer";
import { useAuth } from "~/state/auth-context";

export function meta() {
  return [
    { title: "Conversation | Template.net" },
    { name: "description", content: "Template.net AI conversation" },
  ];
}

export default function ConversationRoute() {
  const {
    state: { currentUser },
  } = useAuth();
  const { id } = useParams();

  // if (!currentUser) {
  //   return redirect("/");
  // }

  return (
    <section className="relative flex h-screen flex-col pl-0 md:pl-17 w-full">
      <header className="fixed left-4 top-4 z-50 md:left-32">
        <div className="container">
          <Link
            to="/"
            className="text-xs font-bold uppercase leading-none text-primary"
          >
            <img
              src="/new_logo.svg"
              alt="Template.net logo"
              className="h-6 w-auto"
            />
          </Link>
        </div>
      </header>
      <div className="mx-auto flex h-full min-h-0 w-full overflow-hidden pt-20 md:pt-24">
        <ConversationContainer />
        <ChatContainer conversationId={id} />
      </div>
    </section>
  );
}
