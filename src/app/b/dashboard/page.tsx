import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { Link2, Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { KnotStatus } from "@/types";

export default async function BusinessDashboardPage() {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { count: activeOffersCount } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true })
    .eq("business_id", user.id)
    .eq("status", "active");

  const { count: pendingAppsCount } = await supabase
    .from("applications")
    .select("*, offer:offers!inner(business_id)", { count: "exact", head: true })
    .eq("offer.business_id", user.id)
    .eq("status", "pending");

  const { data: activeKnots } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title), creator:creator_profiles(id, profile:profiles(full_name, avatar_url))"
    )
    .eq("business_id", user.id)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: false })
    .limit(5);

  const today = new Date();
  const weekday = today
    .toLocaleDateString("en-US", { weekday: "short" })
    .toUpperCase();
  const dayMonth = today
    .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
    .toUpperCase();

  const needsAttention = (pendingAppsCount ?? 0) + (activeKnots?.filter((k) => k.status === "proof_submitted").length ?? 0);

  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      {/* Masthead */}
      <div className="px-5 pt-7 pb-3 flex items-start justify-between">
        <div>
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            {weekday} · {dayMonth}
          </span>
          <p className="font-sans text-[14px] font-semibold text-[color:var(--ink)] mt-1">
            {businessProfile?.city || "Your board"}
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="px-5 pt-2">
        <h1 className="font-serif italic text-[40px] font-normal leading-[0.95] tracking-[-0.025em] text-[color:var(--ink)]">
          {businessProfile?.business_name ?? "Your board"}.
        </h1>
        <p className="mt-1.5 font-serif italic text-[15px] font-normal text-[color:var(--clay-deep)]">
          {needsAttention > 0
            ? `${needsAttention} ${needsAttention === 1 ? "thing needs" : "things need"} your eye.`
            : "All caught up."}
        </p>
      </div>

      <div className="px-4 pb-28 pt-5 space-y-5">
        {/* Stats grid — clay/sage/sand tiles */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[14px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] px-4 py-4">
            <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)]">
              ACTIVE OFFERS
            </div>
            <p className="font-serif text-[32px] font-medium text-[color:var(--ink)] mt-1 leading-none">
              {activeOffersCount ?? 0}
            </p>
          </div>
          <div className="rounded-[14px] bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] px-4 py-4">
            <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--clay-deep)]">
              PENDING APPS
            </div>
            <p className="font-serif text-[32px] font-medium text-[color:var(--ink)] mt-1 leading-none">
              {pendingAppsCount ?? 0}
            </p>
          </div>
          <div className="rounded-[14px] bg-[color:var(--sand)] border border-[color:var(--line)] px-4 py-4">
            <div
              className="font-mono text-[8.5px] font-bold tracking-[0.18em]"
              style={{ color: "var(--sand-ink)" }}
            >
              TOTAL KNOTS
            </div>
            <p className="font-serif text-[32px] font-medium text-[color:var(--ink)] mt-1 leading-none">
              {businessProfile?.total_knots ?? 0}
            </p>
          </div>
          <div className="rounded-[14px] bg-[color:var(--peach)] border border-[color:var(--clay-tint)] px-4 py-4">
            <div
              className="font-mono text-[8.5px] font-bold tracking-[0.18em]"
              style={{ color: "var(--peach-ink)" }}
            >
              RATING
            </div>
            <p className="font-serif italic text-[32px] font-medium text-[color:var(--ink)] mt-1 leading-none">
              {businessProfile?.avg_rating
                ? businessProfile.avg_rating.toFixed(1)
                : "—"}
            </p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-2.5">
          <Link href="/b/offers/new" className="flex-1">
            <div className="rounded-full bg-[color:var(--clay)] hover:bg-[color:var(--clay-deep)] px-5 h-12 flex items-center gap-2.5 transition-all active:scale-[0.98]">
              <Plus className="h-4 w-4 text-white" strokeWidth={2.5} />
              <span className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-white">
                New Trade
              </span>
            </div>
          </Link>
          <Link href="/b/offers" className="flex-1">
            <div className="rounded-full bg-[color:var(--surface)] border border-[color:var(--line)] px-5 h-12 flex items-center gap-2 transition-all active:scale-[0.98]">
              <span className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-[color:var(--ink)] flex-1">
                My offers
              </span>
              <ArrowRight className="h-4 w-4 text-[color:var(--ink-faint)]" />
            </div>
          </Link>
        </div>

        {/* Active knots */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
              ACTIVE KNOTS
            </span>
            {activeKnots && activeKnots.length > 0 && (
              <span className="font-mono text-[9.5px] font-bold tracking-[0.15em] text-[color:var(--sage-deep)]">
                {activeKnots.length} IN FLIGHT
              </span>
            )}
          </div>

          {!activeKnots || activeKnots.length === 0 ? (
            <EmptyState
              icon={Link2}
              tone="clay"
              title="No knots yet"
              description="Post your first trade and watch creators apply."
            />
          ) : (
            <div className="space-y-2">
              {activeKnots.map((knot) => {
                const creatorRaw = knot.creator as unknown;
                const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as { profile?: { full_name?: string } } | null;
                const offerRaw = knot.offer as unknown;
                const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as { title?: string } | null;
                const status = knot.status as KnotStatus;
                const needsAction = status === "proof_submitted";

                return (
                  <Link key={knot.id} href={`/b/knots/${knot.id}`}>
                    <div
                      className={`rounded-[14px] px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform border ${
                        needsAction
                          ? "bg-[color:var(--clay-soft)] border-[color:var(--clay-tint)]"
                          : "bg-[color:var(--surface)] border-[color:var(--line)]"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                          needsAction
                            ? "bg-[color:var(--clay)]/15"
                            : "bg-[color:var(--sage-tint)]"
                        }`}
                      >
                        <Link2
                          className={`h-4 w-4 ${
                            needsAction
                              ? "text-[color:var(--clay-deep)]"
                              : "text-[color:var(--sage-deep)]"
                          }`}
                          strokeWidth={1.6}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13.5px] font-bold text-[color:var(--ink)] truncate">
                          {offer?.title}
                        </p>
                        <p className="font-sans text-[12px] text-[color:var(--ink-soft)] font-medium">
                          {creator?.profile?.full_name ?? "Creator"}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full shrink-0 ${
                          needsAction
                            ? "text-[color:var(--clay-deep)] bg-white"
                            : "text-[color:var(--sage-deep)] bg-[color:var(--sage-tint)]"
                        }`}
                      >
                        {KNOT_STATUSES[status]}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
