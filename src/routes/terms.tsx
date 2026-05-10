import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Fileforge" },
      { name: "description", content: "Terms of service for using Fileforge file conversion tools." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Last updated: {new Date().toLocaleDateString()}</p>
      <h2>Use of the service</h2>
      <p>
        Fileforge is provided free of charge, "as is", without warranties of any kind. You are
        responsible for the files you process and for ensuring you have the rights to do so.
      </p>
      <h2>No upload, no storage</h2>
      <p>
        File conversions run in your browser. We do not store your files or transmit them to a
        server. Output quality may vary by file type and complexity.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Don't use Fileforge to process content that's illegal, infringes others' rights, or
        attempts to abuse or overload the service.
      </p>
      <h2>Liability</h2>
      <p>
        We are not liable for data loss, conversion errors, or other damages arising from use of
        the service. Always keep backups of important files.
      </p>
    </article>
  );
}
