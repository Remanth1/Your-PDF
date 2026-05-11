import { createFileRoute } from "@tanstack/react-router";
import { SeoToolPage } from "@/components/SeoToolPage";

export const Route = createFileRoute("/mp4-to-mp3")({
  head: () => ({
    meta: [
      { title: "MP4 to MP3 — Extract audio from video | Fileforge" },
      { name: "description", content: "Convert MP4 to MP3 with secure processing and fast delivery." },
    ],
  }),
  component: Mp4ToMp3Page,
});

function Mp4ToMp3Page() {
  return (
    <SeoToolPage
      title="MP4 to MP3"
      tagline="Extract MP3 audio from MP4 files."
      description="Great for lectures, interviews, and podcasts captured as video files."
      faqs={[
        { q: "Will quality be preserved?", a: "Bitrate controls are being added for custom output quality." },
        { q: "Can I trim audio?", a: "Trimming support is planned in the next iteration." },
        { q: "Is this private?", a: "Files are handled with secure temporary processing and cleanup." },
      ]}
    />
  );
}
