import Link from "next/link";
import {
  Bell,
  Link2,
  Megaphone,
  Star,
  AlertCircle,
  Sparkles,
  MessageSquare,
  type LucideIcon,
} from "lucide-react";

type Tone = "sage" | "clay" | "sand" | "peach" | "neutral";

interface NotifItemProps {
  type: string;
  title: string;
  body: string | null;
  timeAgo: string;
  href: string | null;
  unread: boolean;
}

const typeMap: Record<string, { icon: LucideIcon; tone: Tone }> = {
  knot_connected: { icon: Link2, tone: "sage" },
  new_application: { icon: Megaphone, tone: "clay" },
  proof_submitted: { icon: Sparkles, tone: "sand" },
  revision_requested: { icon: AlertCircle, tone: "clay" },
  knot_completed: { icon: Star, tone: "sage" },
  new_message: { icon: MessageSquare, tone: "peach" },
};

const toneStyles: Record<Tone, { bg: string; fg: string }> = {
  sage: { bg: "bg-[color:var(--sage-tint)]", fg: "text-[color:var(--sage-deep)]" },
  clay: { bg: "bg-[color:var(--clay-soft)]", fg: "text-[color:var(--clay-deep)]" },
  sand: { bg: "bg-[color:var(--sand)]", fg: "text-[color:var(--sand-ink)]" },
  peach: { bg: "bg-[color:var(--peach)]", fg: "text-[color:var(--peach-ink)]" },
  neutral: { bg: "bg-[color:var(--line-soft)]", fg: "text-[color:var(--ink-mid)]" },
};

export default function NotifItem({
  type,
  title,
  body,
  timeAgo,
  href,
  unread,
}: NotifItemProps) {
  const meta = typeMap[type] ?? { icon: Bell, tone: "neutral" as Tone };
  const t = toneStyles[meta.tone];
  const Icon = meta.icon;

  const content = (
    <div
      className={`flex gap-3 px-4 py-4 transition-colors active:bg-[color:var(--paper)] ${
        unread
          ? "bg-[color:var(--paper)] border-l-[3px] border-[color:var(--sage)]"
          : "border-l-[3px] border-transparent"
      }`}
    >
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${t.bg}`}
      >
        <Icon className={`h-[19px] w-[19px] ${t.fg}`} strokeWidth={1.6} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-sans text-[13.5px] font-bold text-[color:var(--ink)] leading-[1.4]">
          {title}
        </p>
        {body && (
          <p className="font-sans text-[12.5px] text-[color:var(--ink-mid)] mt-1 leading-[1.45] font-medium line-clamp-2">
            {body}
          </p>
        )}
        <p className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-[color:var(--ink-faint)] mt-1.5 font-bold">
          {timeAgo}
        </p>
      </div>
      {unread && (
        <span className="w-2 h-2 rounded-full bg-[color:var(--clay)] shrink-0 mt-2" />
      )}
    </div>
  );

  return href ? <Link href={href}>{content}</Link> : content;
}
