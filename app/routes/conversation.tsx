import { Link, useParams } from "react-router";
import { ChatContainer } from "~/components/chat/ChatContainer";
import ConversationContainer from "~/components/ConversationContainer";

export function meta() {
  return [
    { title: "Conversation | Template.net" },
    { name: "description", content: "Template.net AI conversation" },
  ];
}

export default function ConversationRoute() {
  const { id } = useParams();

  return (
    <section className="relative flex h-screen w-full flex-col pl-0 md:pl-17">
      <header className="fixed top-4 left-4 z-50 md:left-32">
        <div className="container">
          <Link
            to="/"
            className="text-primary text-xs leading-none font-bold uppercase"
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
