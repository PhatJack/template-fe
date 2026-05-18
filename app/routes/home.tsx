import HomePage from "~/pages/home";

export function meta() {
  return [
    { title: "Template.net | AI Generator for Fully Editable Assets" },
    {
      name: "description",
      content:
        "Generate free templates, designs, documents, presentations, charts, whiteboards, and more in an all-in-one AI-powered editor. Turn prompts into fully editable, branded assets instantly. No signup needed",
    },
  ];
}

export default function Home() {
  return <HomePage />;
}
