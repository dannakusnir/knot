import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Avatar, EmptyState } from "@/components/ui";
import { Users, ExternalLink } from "lucide-react";
import CreatorApprovalActions from "./CreatorApprovalActions";

export default async function AdminCreatorsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: creators } = await supabase
    .from("creator_profiles")
    .select("*, profile:profiles(full_name, avatar_url, email)")
    .order("created_at", { ascending: false });

  const pendingCreators = creators?.filter((c) => c.approval_status === "pending") ?? [];
  const approvedCreators = creators?.filter((c) => c.approval_status === "approved") ?? [];
  const rejectedCreators = creators?.filter((c) => c.approval_status === "rejected") ?? [];

  return (
    <div>
      <div className="mb-6">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          GATEKEEPING
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          Creators.
        </h1>
        <p className="mt-1.5 font-serif italic text-[14px] text-[color:var(--ink-soft)]">
          Review and approve.
        </p>
      </div>

      {/* Pending queue */}
      <section>
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          PENDING · {pendingCreators.length}
        </span>
        <div className="mt-3 space-y-3">
          {pendingCreators.length === 0 ? (
            <EmptyState
              icon={Users}
              tone="sage"
              title="Queue's clear."
              description="No creators waiting for review."
            />
          ) : (
            pendingCreators.map((creator) => {
              const profileRaw = creator.profile as unknown;
              const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as {
                full_name?: string;
                avatar_url?: string;
                email?: string;
              } | null;

              return (
                <article
                  key={creator.id}
                  className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4 space-y-4"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={profile?.avatar_url}
                      name={profile?.full_name ?? "Creator"}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[17px] font-medium text-[color:var(--ink)] leading-tight">
                        {profile?.full_name}
                      </p>
                      <p className="font-sans text-[12px] text-[color:var(--ink-mid)] mt-0.5 truncate">
                        {profile?.email}
                      </p>
                    </div>
                  </div>

                  <div className="border border-[color:var(--line)] rounded-[10px] bg-[color:var(--paper)] divide-y divide-[color:var(--line-soft)]">
                    {creator.instagram_handle && (
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                          INSTAGRAM
                        </span>
                        <span className="font-sans text-[12.5px] text-[color:var(--ink)] font-semibold">
                          @{creator.instagram_handle}
                        </span>
                      </div>
                    )}
                    {creator.follower_count > 0 && (
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                          FOLLOWERS
                        </span>
                        <span className="font-sans text-[12.5px] text-[color:var(--ink)] font-semibold">
                          {creator.follower_count.toLocaleString()}
                        </span>
                      </div>
                    )}
                    {creator.city && (
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                          CITY
                        </span>
                        <span className="font-sans text-[12.5px] text-[color:var(--ink)] font-medium">
                          {creator.city}
                        </span>
                      </div>
                    )}
                    {creator.categories && creator.categories.length > 0 && (
                      <div className="flex justify-between px-3 py-2">
                        <span className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                          CATEGORIES
                        </span>
                        <span className="font-sans text-[12.5px] text-[color:var(--ink)] font-medium max-w-[60%] text-right">
                          {creator.categories.join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  {creator.bio && (
                    <p className="font-serif italic text-[14px] leading-[1.55] text-[color:var(--ink-mid)] border-l-2 border-[color:var(--sage)] pl-3">
                      &ldquo;{creator.bio}&rdquo;
                    </p>
                  )}

                  {creator.portfolio_urls && creator.portfolio_urls.length > 0 && (
                    <div>
                      <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)] mb-2">
                        PORTFOLIO
                      </p>
                      <div className="space-y-1.5">
                        {creator.portfolio_urls.map((url: string, i: number) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 font-sans text-[12px] text-[color:var(--sage-deep)] font-medium underline underline-offset-2 truncate"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" strokeWidth={1.8} />
                            <span className="truncate">{url}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <CreatorApprovalActions creatorId={creator.id} />
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Approved creators */}
      {approvedCreators.length > 0 && (
        <section className="mt-8">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
            APPROVED · {approvedCreators.length}
          </span>
          <div className="mt-3 space-y-2">
            {approvedCreators.map((creator) => {
              const profileRaw = creator.profile as unknown;
              const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as {
                full_name?: string;
                avatar_url?: string;
                email?: string;
              } | null;

              return (
                <div
                  key={creator.id}
                  className="rounded-[14px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] p-3.5 flex items-center gap-3"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    name={profile?.full_name ?? "Creator"}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-sans text-[13.5px] font-bold text-[color:var(--ink)] truncate">
                      {profile?.full_name}
                    </p>
                    <p className="font-mono text-[9.5px] font-bold tracking-[0.12em] uppercase text-[color:var(--sage-deep)] mt-0.5">
                      {creator.instagram_handle
                        ? `@${creator.instagram_handle}`
                        : profile?.email}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Rejected */}
      {rejectedCreators.length > 0 && (
        <section className="mt-8">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            REJECTED · {rejectedCreators.length}
          </span>
          <div className="mt-3 space-y-2 opacity-70">
            {rejectedCreators.map((creator) => {
              const profileRaw = creator.profile as unknown;
              const profile = (Array.isArray(profileRaw) ? profileRaw[0] : profileRaw) as {
                full_name?: string;
                avatar_url?: string;
                email?: string;
              } | null;
              return (
                <div
                  key={creator.id}
                  className="rounded-[14px] bg-[color:var(--paper)] border border-[color:var(--line)] p-3.5 flex items-center gap-3"
                >
                  <Avatar
                    src={profile?.avatar_url}
                    name={profile?.full_name ?? "Creator"}
                    size="sm"
                  />
                  <p className="flex-1 font-sans text-[13.5px] font-medium text-[color:var(--ink-mid)] truncate">
                    {profile?.full_name}
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
