import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState, Avatar } from "@/components/ui";
import { KNOT_STATUSES, APPLICATION_STATUSES } from "@/lib/constants";
import { Clock, Compass } from "lucide-react";
import Link from "next/link";
import type { KnotStatus, ApplicationStatus } from "@/types";

export default async function CreatorDashboardPage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("total_knots, avg_rating, completion_rate, trust_score, verified")
    .eq("id", user.id)
    .single();

  const { data: knots } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title, business_id), business:business_profiles(business_name, logo_url)"
    )
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  const { data: applications } = await supabase
    .from("applications")
    .select(
      "*, offer:offers(title, business_id, business:business_profiles(business_name, logo_url))"
    )
    .eq("creator_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const activeKnots =
    knots?.filter((k) => !["completed", "cancelled"].includes(k.status)) ?? [];
  const completedKnots = knots?.filter((k) => k.status === "completed") ?? [];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      <div className="px-5 pt-7 pb-3">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          YOUR BOARD
        </span>
        <h1 className="mt-2 font-serif italic text-[40px] font-normal leading-[0.95] tracking-[-0.025em] text-[color:var(--ink)]">
          Knots.
        </h1>
        <p className="mt-1.5 font-serif italic text-[15px] font-normal text-[color:var(--sage-deep)]">
          {activeKnots.length === 0 && (!applications || applications.length === 0)
            ? "No active collaborations yet."
            : `${activeKnots.length} in flight${
                applications && applications.length
                  ? `, ${applications.length} pending`
                  : ""
              }.`}
        </p>
      </div>

      <div className="px-4 pt-5 pb-28 space-y-6">
        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2">
          <div className="rounded-[14px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] px-3 py-3.5 text-center">
            <p className="font-serif text-[26px] font-medium text-[color:var(--ink)] leading-none">
              {creatorProfile?.total_knots ?? 0}
            </p>
            <p className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[color:var(--sage-deep)] mt-1.5">
              Knots
            </p>
          </div>
          <div className="rounded-[14px] bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] px-3 py-3.5 text-center">
            <p className="font-serif italic text-[26px] font-medium text-[color:var(--ink)] leading-none">
              {creatorProfile?.avg_rating
                ? creatorProfile.avg_rating.toFixed(1)
                : "—"}
            </p>
            <p className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[color:var(--clay-deep)] mt-1.5">
              Rating
            </p>
          </div>
          <div className="rounded-[14px] bg-[color:var(--sand)] border border-[color:var(--line)] px-3 py-3.5 text-center">
            <p
              className="font-serif text-[26px] font-medium leading-none"
              style={{ color: "var(--sand-ink)" }}
            >
              {creatorProfile?.completion_rate
                ? `${Math.round(creatorProfile.completion_rate * 100)}%`
                : "—"}
            </p>
            <p
              className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase mt-1.5"
              style={{ color: "var(--sand-ink)" }}
            >
              Complete
            </p>
          </div>
        </div>

        {/* Pending Applications */}
        {applications && applications.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <Clock className="h-3.5 w-3.5 text-[color:var(--clay-deep)]" strokeWidth={2} />
              <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
                PENDING · {applications.length}
              </span>
            </div>
            <div className="space-y-2">
              {applications.map((app) => {
                const offerRaw = app.offer as unknown;
                const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as {
                  title?: string;
                  business?: { business_name?: string; logo_url?: string };
                } | null;

                return (
                  <Link key={app.id} href={`/c/offers/${app.offer_id}`}>
                    <div className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
                      <Avatar
                        src={offer?.business?.logo_url}
                        name={offer?.business?.business_name ?? ""}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13.5px] font-bold text-[color:var(--ink)] truncate">
                          {offer?.title}
                        </p>
                        <p className="font-sans text-[12px] text-[color:var(--ink-soft)] font-medium">
                          {offer?.business?.business_name}
                        </p>
                      </div>
                      <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)]">
                        {APPLICATION_STATUSES[app.status as ApplicationStatus]}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Active Knots */}
        <section>
          <div className="flex items-center gap-1.5 mb-3 px-1">
            <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
              ACTIVE · {activeKnots.length}
            </span>
          </div>
          {activeKnots.length === 0 ? (
            <EmptyState
              icon={Compass}
              tone="sage"
              title="No active knots"
              description="Browse offers and tie your first knot."
            />
          ) : (
            <div className="space-y-2">
              {activeKnots.map((knot) => {
                const status = knot.status as KnotStatus;
                const needsAction = status === "revision_requested";
                const offerRaw = knot.offer as unknown;
                const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as { title?: string } | null;
                const bizRaw = knot.business as unknown;
                const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as { business_name?: string; logo_url?: string } | null;

                return (
                  <Link key={knot.id} href={`/c/knots/${knot.id}`}>
                    <div
                      className={`rounded-[14px] px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform border ${
                        needsAction
                          ? "bg-[color:var(--clay-soft)] border-[color:var(--clay-tint)]"
                          : "bg-[color:var(--surface)] border-[color:var(--line)]"
                      }`}
                    >
                      <Avatar
                        src={biz?.logo_url}
                        name={biz?.business_name ?? ""}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13.5px] font-bold text-[color:var(--ink)] truncate">
                          {offer?.title}
                        </p>
                        <p className="font-sans text-[12px] text-[color:var(--ink-soft)] font-medium">
                          {biz?.business_name}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full ${
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
        </section>

        {/* Completed Knots */}
        {completedKnots.length > 0 && (
          <section>
            <div className="flex items-center gap-1.5 mb-3 px-1">
              <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
                COMPLETED · {completedKnots.length}
              </span>
            </div>
            <div className="space-y-2 opacity-80">
              {completedKnots.map((knot) => {
                const offerRaw = knot.offer as unknown;
                const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as { title?: string } | null;
                const bizRaw = knot.business as unknown;
                const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as { business_name?: string; logo_url?: string } | null;

                return (
                  <Link key={knot.id} href={`/c/knots/${knot.id}`}>
                    <div className="rounded-[14px] bg-[color:var(--paper)] border border-[color:var(--line)] px-4 py-3.5 flex items-center gap-3">
                      <Avatar
                        src={biz?.logo_url}
                        name={biz?.business_name ?? ""}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-[13.5px] font-bold text-[color:var(--ink)] truncate">
                          {offer?.title}
                        </p>
                        <p className="font-sans text-[12px] text-[color:var(--ink-soft)] font-medium">
                          {biz?.business_name}
                        </p>
                      </div>
                      <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full text-[color:var(--sage-deep)] bg-[color:var(--sage-tint)]">
                        Completed
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
