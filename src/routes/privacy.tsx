import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Fileforge" },
      { name: "description", content: "Fileforge processes files entirely in your browser. We do not collect or store your documents." },
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
        Fileforge does its conversions <strong>entirely in your browser</strong>. Your files
        are never uploaded to our servers. There are no accounts, no logins, and no file storage.
      </p>
      <h2>What we don't collect</h2>
      <ul>
        <li>Your documents, images, or any of their contents.</li>
        <li>Account information — there are no accounts.</li>
      </ul>
      <h2>What we may collect</h2>
      <p>
        Basic, anonymized website analytics (page views, country, referrer) to understand how
        the site is used. No personal data and no document data is included.
      </p>
      <h2>Cookies</h2>
      <p>We use only essential cookies required for the site to function.</p>
      <h2>Contact</h2>
      <p>Questions about privacy? Reach out via the contact link in the footer.</p>
    </article>
  );
}
