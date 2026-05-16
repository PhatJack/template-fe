import React from "react";
import { ChatContainer } from "~/components/chat/ChatContainer";
import { Sidebar } from "~/components/Sidebar";

const HomePage = () => {
  return (
    <main className="min-h-screen bg-muted-surface font-sans text-foreground">
      <Sidebar />

      <section className="relative min-h-screen pl-0 md:pl-17">
        <header className="absolute left-4 top-4 md:left-32">
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
        <div className="mx-auto flex min-h-screen w-full max-w-5xl px-3 pb-5 pt-16 md:px-6 md:pt-20">
          <ChatContainer />
        </div>
      </section>
    </main>
  );
};

export default HomePage;
