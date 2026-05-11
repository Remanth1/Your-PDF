import Link from "next/link";

const tools = [
  "pdf-to-word",
  "word-to-pdf",
  "merge-pdf",
  "split-pdf",
  "compress-pdf",
  "jpg-to-png",
  "png-to-jpg",
  "mp4-to-mp3"
] as const;

export default function HomePage() {
  return (
    <main>
      <h1>Privacy-first File Converter</h1>
      <p>Local processing when possible, secure queued conversion when needed.</p>

      <section className="upload-card">
        <h2>Popular tools</h2>
        <ul>
          {tools.map((t) => (
            <li key={t}>
              <Link href={`/${t}`}>{t.replaceAll("-", " ")}</Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
