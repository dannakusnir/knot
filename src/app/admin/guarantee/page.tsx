import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Avatar, EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { Shield } from "lucide-react";
import type { KnotStatus } from "@/types";

export default async function AdminGuaranteePage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: guaranteeKnots } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title), creator:creator_profiles(profile:profiles(full_name, avatar_url)), business:business_profiles(business_name, logo_url, guarantee_credits)"
    )
    .eq("is_guarantee_redo", true)
    .order("created_at", { ascending: false });

  const { data: lowRatedKnots } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title), creator:creator_profiles(profile:profiles(full_name)), business:business_profiles(business_name, guarantee_credits), ratings:ratings(score)"
    )
    .eq("status", "completed")
    .eq("is_guarantee_redo", false)
    .order("completed_at", { ascending: false })
    .limit(20);

  const knotsNeedingGuarantee =
    lowRatedKnots?.filter((knot) => {
      const ratings = knot.ratings as { score: number }[];
      return ratings?.some((r) => r.score <= 2);
    }) ?? [];

  return (
    <div>
      <div className="mb-6">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          SAFETY NET
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          Guarantee.
        </h1>
        <p className="mt-1.5 font-serif italic text-[14px] text-[color:var(--ink-soft)]">
          Make it right when things go sideways.
        </p>
      </div>

      <section>
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          ACTIVE REDOS · {guaranteeKnots?.length ?? 0}
        </span>

        <div className="mt-3 space-y-3">
          {!guaranteeKnots || guaranteeKnots.length === 0 ? (
            <EmptyState
              icon={Shield}
              tone="sage"
              title="All steady."
              description="No guarantee redos in flight."
            />
          ) : (
            guaranteeKnots.map((knot) => {
              const bizRaw = knot.business as unknown;
              const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as {
                business_name?: string;
                logo_url?: string;
              } | null;
              const creatorRaw = knot.creator as unknown;
              const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as {
                profile?: { full_name?: string };
              } | null;
              const offerRaw = knot.offer as unknown;
              const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as { title?: string } | null;
              const status = knot.status as KnotStatus;

              return (
                <article
                  key={knot.id}
                  className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={biz?.logo_url}
                      name={biz?.business_name ?? "Business"}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[15px] font-medium text-[color:var(--ink)] leading-tight truncate">
                        {offer?.title}
                      </p>
                      <p className="font-sans text-[12px] text-[color:var(--ink-mid)] mt-0.5">
                        <span className="font-semibold">{biz?.business_name}</span>
                        <span className="text-[color:var(--ink-faint)] mx-1.5">→</span>
                        <span className="font-semibold">
                          {creator?.profile?.full_name ?? "Creator"}
                        </span>
                      </p>
                    </div>
                    <span
                      className={`font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full shrink-0 ${
                        status === "completed"
                          ? "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]"
                          : "bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)]"
                      }`}
                    >
                      {KNOT_STATUSES[status]}
                    </span>
                  </div>
                  {knot.admin_notes && (
                    <p className="font-serif italic text-[12.5px] text-[color:var(--ink-mid)] bg-[color:var(--paper)] rounded-[8px] px-3 py-2 border-l-2 border-[color:var(--clay)]">
                      &ldquo;{knot.admin_notes}&rdquo;
                    </p>
                  )}
                </article>
              );
            })
          )}
        </div>
      </section>

      {knotsNeedingGuarantee.length > 0 && (
        <section className="mt-8">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--destructive)]">
            MAYBE · {knotsNeedingGuarantee.length}
          </span>
          <p className="mt-2 font-serif italic text-[13px] text-[color:var(--ink-mid)]">
            Completed knots with low ratings — a redo might be due.
          </p>
          <div className="mt-3 space-y-3">
            {knotsNeedingGuarantee.map((knot) => {
              const bizRaw = knot.business as unknown;
              const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as {
                business_name?: string;
                guarantee_credits?: number;
              } | null;
              const creatorRaw = knot.creator as unknown;
              const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as {
                profile?: { full_name?: string };
              } | null;
              const offerRaw = knot.offer as unknown;
              const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as { title?: string } | null;

              return (
                <article
                  key={knot.id}
                  className="rounded-[14px] bg-[color:var(--destructive-soft)] border border-[color:var(--destructive)]/20 p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[15px] font-medium text-[color:var(--ink)] leading-tight truncate">
                        {offer?.title}
                      </p>
                      <p className="font-sans text-[12px] text-[color:var(--ink-mid)] mt-0.5">
                        <span className="font-semibold">{biz?.business_name}</span>
                        <span className="text-[color:var(--ink-faint)] mx-1.5">→</span>
                        <span className="font-semibold">
                          {creator?.profile?.full_name ?? "Creator"}
                        </span>
                      </p>
                    </div>
                    <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full bg-[color:var(--destructive)]/15 text-[color:var(--destructive)]">
                      Low rating
                    </span>
                  </div>
                  <p className="mt-2 font-mono text-[9.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--ink-mid)]">
                    {biz?.guarantee_credits ?? 0} CREDITS LEFT
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
