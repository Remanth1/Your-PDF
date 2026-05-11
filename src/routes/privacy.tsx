import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Fileforge" },
      { name: "description", content: "How Fileforge handles your files, analytics, and privacy." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>The short version</h2>
      <p>
        Fileforge is built to keep document work private. Most tools run <strong>entirely in your browser</strong>, so your files stay on your device unless a specific workflow explicitly needs a server-assisted step.
      </p>
      <h2>What we don't collect</h2>
      <ul>
        <li>Your documents, images, or any of their contents.</li>
        <li>Account information — there are no accounts.</li>
      </ul>
      <h2>What we may collect</h2>
      <p>
        Basic, anonymized website analytics such as page views and referrers to understand how the site is used. We do not include document contents in analytics.
      </p>
      <h2>Cookies</h2>
      <p>We use only essential cookies required for the site to function and, where needed, to remember lightweight preferences.</p>
      <h2>Contact</h2>
      <p>Questions about privacy? Reach out through the footer links on the site.</p>
    </article>
  );
}
