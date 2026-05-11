import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us | Fileforge" },
      { name: "description", content: "Learn what Fileforge does and why it focuses on private document tools." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>About Us</h1>
      <p>Fileforge helps people work with documents quickly without unnecessary friction.</p>
      <p>
        Our focus is simple: make everyday PDF and file conversion tasks easy, private, and fast.
        We design the product around browser-first workflows wherever possible so users can get
        results without creating an account or handing files off to a third party.
      </p>
      <h2>What we care about</h2>
      <ul>
        <li>Privacy first document handling</li>
        <li>Clear and honest file workflows</li>
        <li>Fast tools that remove repetitive manual work</li>
      </ul>
      <h2>Why Fileforge exists</h2>
      <p>
        Most people just want to merge a PDF, compress a file, or convert a document without a
        complicated setup. Fileforge exists to make that feel direct and dependable.
      </p>
    </article>
  );
}