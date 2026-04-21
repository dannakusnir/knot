import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { Link2 } from "lucide-react";
import type { KnotStatus } from "@/types";

export default async function AdminKnotsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: knots } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title), creator:creator_profiles(profile:profiles(full_name)), business:business_profiles(business_name)"
    )
    .order("created_at", { ascending: false });

  const statusTone = (status: KnotStatus): string => {
    switch (status) {
      case "completed":
        return "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]";
      case "proof_submitted":
        return "bg-[color:var(--peach)] text-[color:var(--peach-ink)]";
      case "revision_requested":
      case "cancelled":
        return "bg-[color:var(--destructive-soft)] text-[color:var(--destructive)]";
      default:
        return "bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)]";
    }
  };

  return (
    <div>
      <div className="mb-6">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          EVERY KNOT
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          The ledger.
        </h1>
        <p className="mt-1.5 font-serif italic text-[14px] text-[color:var(--ink-soft)]">
          Every knot, in order of birth.
        </p>
      </div>

      {!knots || knots.length === 0 ? (
        <EmptyState
          icon={Link2}
          tone="sage"
          title="No knots yet."
          description="Creators and businesses haven't connected yet. Give it time."
        />
      ) : (
        <div className="space-y-2">
          {knots.map((knot, index) => {
            const offerRaw = knot.offer as unknown;
            const offer = (Array.isArray(offerRaw) ? offerRaw[0] : offerRaw) as { title?: string } | null;
            const creatorRaw = knot.creator as unknown;
            const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as {
              profile?: { full_name?: string };
            } | null;
            const businessRaw = knot.business as unknown;
            const business = (Array.isArray(businessRaw) ? businessRaw[0] : businessRaw) as {
              business_name?: string;
            } | null;

            const status = knot.status as KnotStatus;

            return (
              <article
                key={knot.id}
                className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-[color:var(--ink-faint)]">
                        № {String(knots.length - index).padStart(3, "0")}
                      </span>
                      <span className="font-mono text-[9px] font-bold tracking-[0.12em] uppercase text-[color:var(--ink-soft)]">
                        {new Date(knot.created_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="font-serif text-[16px] font-medium text-[color:var(--ink)] leading-tight truncate">
                      {offer?.title}
                    </p>
                    <p className="font-sans text-[12px] text-[color:var(--ink-mid)] mt-1">
                      <span className="font-semibold">
                        {creator?.profile?.full_name ?? "Creator"}
                      </span>
                      <span className="text-[color:var(--ink-faint)] mx-1.5">→</span>
                      <span className="font-semibold">
                        {business?.business_name ?? "Business"}
                      </span>
                    </p>
                  </div>
                  <span
                    className={`font-mono text-[9px] font-bold tracking-[0.15em] uppercase px-2 py-1 rounded-full shrink-0 ${statusTone(status)}`}
                  >
                    {KNOT_STATUSES[status]}
                  </span>
                </div>

                {(knot.is_guarantee_redo || knot.admin_assigned) && (
                  <div className="flex gap-1.5 mt-3">
                    {knot.is_guarantee_redo && (
                      <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase bg-[color:var(--destructive-soft)] text-[color:var(--destructive)] px-2 py-0.5 rounded-full">
                        Guarantee
                      </span>
                    )}
                    {knot.admin_assigned && (
                      <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase bg-[color:var(--paper)] border border-[color:var(--line)] text-[color:var(--ink-soft)] px-2 py-0.5 rounded-full">
                        Admin matched
                      </span>
                    )}
                  </div>
                )}

                {knot.admin_notes && (
                  <p className="mt-3 font-serif italic text-[12.5px] text-[color:var(--ink-mid)] bg-[color:var(--paper)] rounded-[8px] px-3 py-2">
                    &ldquo;{knot.admin_notes}&rdquo;
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
