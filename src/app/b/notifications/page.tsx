import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { Bell, Link2, Megaphone, Star, AlertCircle } from "lucide-react";
import Link from "next/link";
import MarkReadButton from "./MarkReadButton";

const typeIcons: Record<string, typeof Bell> = {
  new_application: Megaphone,
  proof_submitted: Star,
  knot_completed: Link2,
  revision_requested: AlertCircle,
};

const typeColors: Record<string, string> = {
  new_application: "bg-[#CB997E]/20 text-[#CB997E]",
  proof_submitted: "bg-[#A5A58D]/20 text-[#A5A58D]",
  knot_completed: "bg-[#7FC8A9]/20 text-[#7FC8A9]",
  revision_requested: "bg-[#E07A5F]/20 text-[#E07A5F]",
};

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

export default async function BusinessNotificationsPage() {
  const user = await requireRole("business");
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
    <div className="min-h-dvh bg-[#EDE8E2]">
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
            Notifications
          </h1>
          <p className="text-base text-[#8A8078] mt-1">
            {unreadIds.length > 0
              ? `${unreadIds.length} unread`
              : "All caught up"}
          </p>
        </div>
        {unreadIds.length > 0 && <MarkReadButton ids={unreadIds} />}
      </div>

      {!notifications || notifications.length === 0 ? (
        <div className="px-5 pt-8">
          <EmptyState
            icon={Bell}
            title="No notifications"
            description="You'll see updates about applications and knots here"
          />
        </div>
      ) : (
        <div className="px-4 pb-24 space-y-2">
          {notifications.map((notif) => {
            const Icon = typeIcons[notif.type] || Bell;
            const colorClass = typeColors[notif.type] || "bg-[#E8E3DD] text-[#8A8078]";
            const href = notif.knot_id
              ? `/b/knots/${notif.knot_id}`
              : notif.offer_id
              ? `/b/offers/${notif.offer_id}`
              : null;

            const content = (
              <div
                className={`flex items-start gap-3 rounded-2xl px-4 py-4 transition-transform active:scale-[0.98] ${
                  notif.read ? "bg-white" : "bg-white ring-2 ring-[#7FC8A9]/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${colorClass}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[15px] font-semibold text-[#3D3229]">
                    {notif.title}
                  </p>
                  {notif.body && (
                    <p className="text-sm text-[#8A8078] mt-0.5 line-clamp-2">
                      {notif.body}
                    </p>
                  )}
                  <p className="text-xs text-[#C4BBB2] mt-1.5">
                    {timeAgo(notif.created_at)}
                  </p>
                </div>
                {!notif.read && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#7FC8A9] shrink-0 mt-2" />
                )}
              </div>
            );

            return href ? (
              <Link key={notif.id} href={href}>
                {content}
              </Link>
            ) : (
              <div key={notif.id}>{content}</div>
            );
          })}
        </div>
      )}
    </div>
  );
}
