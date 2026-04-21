import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { OFFER_STATUSES } from "@/lib/constants";
import { Plus, Users, Megaphone, ChevronRight } from "lucide-react";
import Link from "next/link";
import type { OfferStatus } from "@/types";

export default async function BusinessOffersPage() {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: offers } = await supabase
    .from("offers")
    .select("*, applications:applications(count)")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  const activeCount = offers?.filter((o) => o.status === "active").length ?? 0;

  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      {/* Masthead */}
      <div className="px-5 pt-7 pb-3">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          YOUR TRADES
        </span>
        <h1 className="mt-2 font-serif italic text-[40px] font-normal leading-[0.95] tracking-[-0.025em] text-[color:var(--ink)]">
          Offers.
        </h1>
        <p className="mt-1.5 font-serif italic text-[15px] font-normal text-[color:var(--clay-deep)]">
          {activeCount === 0
            ? "Nothing posted yet."
            : `${activeCount} ${activeCount === 1 ? "trade is" : "trades are"} open.`}
        </p>
      </div>

      {/* New button */}
      <div className="px-4 pt-3">
        <Link href="/b/offers/new">
          <div className="rounded-full bg-[color:var(--clay)] hover:bg-[color:var(--clay-deep)] h-12 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            <Plus className="h-4 w-4 text-white" strokeWidth={2.5} />
            <span className="font-sans text-[12.5px] font-bold tracking-[0.14em] uppercase text-white">
              Post a new trade
            </span>
          </div>
        </Link>
      </div>

      {/* List */}
      <div className="px-4 pt-5 pb-28">
        {!offers || offers.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            tone="clay"
            title="Zero trades posted"
            description="Your first trade unlocks the whole network."
          />
        ) : (
          <div className="space-y-2">
            {offers.map((offer, index) => {
              const appCount = offer.applications?.[0]?.count ?? 0;
              const serial = String(index + 1).padStart(2, "0");
              const status = offer.status as OfferStatus;
              const isActive = status === "active";

              return (
                <Link key={offer.id} href={`/b/offers/${offer.id}`}>
                  <article className="rounded-[16px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4 active:scale-[0.98] transition-transform">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-[color:var(--ink-faint)]">
                            № {serial}
                          </span>
                          <span
                            className={`font-mono text-[9px] font-bold tracking-[0.18em] uppercase px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]"
                                : "bg-[color:var(--line-soft)] text-[color:var(--ink-soft)]"
                            }`}
                          >
                            {OFFER_STATUSES[status]}
                          </span>
                        </div>
                        <h3 className="mt-2 font-serif text-[18px] font-medium text-[color:var(--ink)] tracking-[-0.005em] leading-[1.25]">
                          {offer.title}
                        </h3>
                        {offer.description && (
                          <p className="mt-1 font-sans text-[12.5px] text-[color:var(--ink-mid)] font-medium line-clamp-1">
                            {offer.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-3">
                          <span className="flex items-center gap-1.5 font-mono text-[10px] font-bold tracking-[0.12em] text-[color:var(--clay-deep)]">
                            <Users className="h-3 w-3" strokeWidth={2} />
                            {appCount} {appCount === 1 ? "APPLICANT" : "APPLICANTS"}
                          </span>
                          {offer.compensation && (
                            <span className="font-serif italic text-[12.5px] text-[color:var(--sage-deep)]">
                              {offer.compensation}
                            </span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[color:var(--ink-faint)] shrink-0 mt-1" strokeWidth={1.6} />
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
