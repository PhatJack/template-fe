import { useParams } from "react-router";
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
    <section className="relative flex h-screen flex-col pl-0 md:pl-17 w-full">
      <header className="fixed left-4 top-4 z-50 md:left-32">
        <div className="container">
          <a
            href="/"
            className="text-xs font-bold uppercase leading-none text-primary"
          >
            <img
              src="/new_logo.svg"
              alt="Template.net logo"
              className="h-6 w-auto"
            />
          </a>
        </div>
      </header>
      <div className="mx-auto flex h-full min-h-0 w-full overflow-hidden pt-20 md:pt-24">
        <ConversationContainer />
        <ChatContainer conversationId={id} />
      </div>
    </section>
  );
}
