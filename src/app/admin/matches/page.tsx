import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Avatar, EmptyState } from "@/components/ui";
import { Megaphone } from "lucide-react";
import ManualMatchAction from "./ManualMatchAction";

export default async function AdminMatchesPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: offers } = await supabase
    .from("offers")
    .select("*, business:business_profiles(business_name, logo_url, city)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const { data: availableCreators } = await supabase
    .from("creator_profiles")
    .select("*, profile:profiles(full_name, avatar_url, email)")
    .eq("approval_status", "approved")
    .order("trust_score", { ascending: false });

  return (
    <div>
      <div className="mb-6">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          MATCHMAKING
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          Matches.
        </h1>
        <p className="mt-1.5 font-serif italic text-[14px] text-[color:var(--ink-soft)]">
          Play cupid — tie creators to offers.
        </p>
      </div>

      <section>
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          OPEN OFFERS · {offers?.length ?? 0}
        </span>

        <div className="mt-3 space-y-3">
          {!offers || offers.length === 0 ? (
            <EmptyState
              icon={Megaphone}
              tone="clay"
              title="Nothing to match."
              description="No active offers right now."
            />
          ) : (
            offers.map((offer, index) => {
              const bizRaw = offer.business as unknown;
              const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as {
                business_name?: string;
                logo_url?: string;
                city?: string;
              } | null;

              return (
                <article
                  key={offer.id}
                  className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={biz?.logo_url}
                      name={biz?.business_name ?? "Business"}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-[9px] font-bold tracking-[0.18em] text-[color:var(--ink-faint)]">
                          № {String(index + 1).padStart(2, "0")}
                        </span>
                        {offer.category && (
                          <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase bg-[color:var(--clay-soft)] text-[color:var(--clay-deep)] px-2 py-0.5 rounded-full">
                            {offer.category}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif text-[16px] font-medium text-[color:var(--ink)] leading-tight">
                        {offer.title}
                      </h3>
                      <p className="font-sans text-[12px] text-[color:var(--ink-soft)] mt-0.5">
                        {biz?.business_name}
                        {biz?.city ? ` · ${biz.city}` : ""}
                      </p>
                    </div>
                  </div>

                  {offer.description && (
                    <p className="font-serif italic text-[13px] leading-[1.5] text-[color:var(--ink-mid)] line-clamp-2">
                      {offer.description}
                    </p>
                  )}

                  <ManualMatchAction
                    offerId={offer.id}
                    businessId={offer.business_id}
                    creators={
                      availableCreators?.map((c) => {
                        const profileRaw = c.profile as unknown;
                        const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as {
                          full_name?: string;
                        } | null;
                        return {
                          id: c.id,
                          name: profile?.full_name ?? "Unknown",
                          instagram: c.instagram_handle,
                          trustScore: c.trust_score,
                        };
                      }) ?? []
                    }
                  />
                </article>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
