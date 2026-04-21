import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { Bell, ArrowLeft } from "lucide-react";
import Link from "next/link";
import MarkReadButton from "./MarkReadButton";
import NotifItem from "@/components/notifications/NotifItem";

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

export default async function NotificationsPage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const unreadIds = (notifications || [])
    .filter((n) => !n.read)
    .map((n) => n.id);

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-24">
      {/* Top */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <Link
          href="/c/explore"
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </Link>
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          INBOX
        </span>
        {unreadIds.length > 0 ? (
          <MarkReadButton ids={unreadIds} />
        ) : (
          <div className="w-10 h-10" />
        )}
      </div>

      {/* Title */}
      <div className="px-5">
        <h1 className="font-serif italic text-[40px] font-normal leading-[0.95] tracking-[-0.025em] text-[color:var(--ink)]">
          Mail.
        </h1>
        <p className="mt-1.5 font-serif italic text-[14px] font-normal text-[color:var(--sage-deep)]">
          {unreadIds.length > 0
            ? `${unreadIds.length} new from the neighborhood.`
            : "All caught up."}
        </p>
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="px-5 pt-8">
          <EmptyState
            icon={Bell}
            tone="sage"
            title="Nothing new yet"
            description="Updates about your knots and applications will show up here."
          />
        </div>
      ) : (
        <div className="mt-6 divide-y divide-[color:var(--line-soft)] border-y border-[color:var(--line)]">
          {notifications.map((notif) => {
            const href = notif.knot_id
              ? `/c/knots/${notif.knot_id}`
              : notif.offer_id
              ? `/c/offers/${notif.offer_id}`
              : null;
            return (
              <NotifItem
                key={notif.id}
                type={notif.type}
                title={notif.title}
                body={notif.body}
                timeAgo={timeAgo(notif.created_at)}
                href={href}
                unread={!notif.read}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
