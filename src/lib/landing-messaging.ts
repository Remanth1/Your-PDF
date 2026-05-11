export type MessagingVariant = "trust" | "speed" | "quality";

export interface MessagingCopy {
  heroLine1: string;
  heroLine2: string;
  body: string;
}

const COPY: Record<MessagingVariant, MessagingCopy> = {
  trust: {
    heroLine1: "Private file tools.",
    heroLine2: "Your files stay with you.",
    body: "Convert and edit files in the browser first. When server processing is required, files are automatically cleaned up."
  },
  speed: {
    heroLine1: "Fast file conversion.",
    heroLine2: "Results in seconds.",
    body: "Low-friction workflows and immediate processing keep you moving, without queues or account walls."
  },
  quality: {
    heroLine1: "High-fidelity file conversion.",
    heroLine2: "Formatting preserved.",
    body: "Built for documents and media that need reliable output quality, not just quick format changes."
  }
};

export function getMessagingVariant(raw: string | undefined): MessagingVariant {
  if (raw === "speed" || raw === "quality") return raw;
  return "trust";
}

export function getMessagingCopy(variant: MessagingVariant): MessagingCopy {
  return COPY[variant];
}
