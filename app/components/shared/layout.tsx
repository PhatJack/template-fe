import React from "react";
import { Sidebar } from "../Sidebar";

const DefaultLayout = () => {
  return (
    <main className="min-h-screen bg-muted-surface font-sans text-foreground">
      <Sidebar />
    </main>
  );
};

export default DefaultLayout;
