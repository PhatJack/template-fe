import { useState } from "react";
import { Sidebar } from "../Sidebar";
import { Outlet } from "react-router";
import { AuthModal } from "../AuthModal";

const DefaultLayout = () => {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <main className="min-h-screen bg-muted-surface font-sans text-foreground">
      <Sidebar onSignInClick={() => setAuthOpen(true)} />
      <Outlet />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </main>
  );
};

export default DefaultLayout;
