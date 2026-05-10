import { ShieldCheck } from "lucide-react";

export function PrivacyBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
      <ShieldCheck className="h-3.5 w-3.5 text-[color:var(--success)]" />
      100% private — files never leave your browser
    </div>
  );
}
