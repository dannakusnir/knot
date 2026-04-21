import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Avatar, EmptyState } from "@/components/ui";
import { OFFER_STATUSES } from "@/lib/constants";
import { Users, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ApplicantActions from "./ApplicantActions";
import type { OfferStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

function KnotGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" stroke="currentColor" />
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" />
    </svg>
  );
}

export default async function BusinessOfferDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: offer } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .eq("business_id", user.id)
    .single();

  if (!offer) notFound();

  const { data: applications } = await supabase
    .from("applications")
    .select(
      "*, creator:creator_profiles(id, bio, instagram_handle, follower_count, avg_rating, city, categories, profile:profiles(full_name, avatar_url))"
    )
    .eq("offer_id", id)
    .order("created_at", { ascending: false });

  const pendingApps = applications?.filter((a) => a.status === "pending") ?? [];
  const connectedApps = applications?.filter((a) => a.status === "approved") ?? [];
  const declinedApps = applications?.filter((a) => a.status === "declined") ?? [];

  const status = offer.status as OfferStatus;

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-24">
      {/* Top */}
      <div className="flex items-center justify-between px-5 pt-14 pb-5">
        <Link
          href="/b/offers"
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </Link>
        <span
          className={`font-mono text-[9px] font-bold tracking-[0.22em] uppercase px-2.5 py-1 rounded-full ${
            status === "active"
              ? "bg-[color:var(--sage-tint)] text-[color:var(--sage-deep)]"
              : "bg-[color:var(--line-soft)] text-[color:var(--ink-soft)]"
          }`}
        >
          {OFFER_STATUSES[status]}
        </span>
      </div>

      {/* Header */}
      <div className="px-5">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          YOUR TRADE · № {String(offer.id).slice(0, 4).toUpperCase()}
        </span>
        <h1 className="mt-2 font-serif italic text-[32px] font-normal leading-[1.05] tracking-[-0.015em] text-[color:var(--ink)]">
          {offer.title}
        </h1>
        {offer.description && (
          <p className="mt-3 font-serif italic text-[15px] leading-[1.55] text-[color:var(--ink-mid)]">
            {offer.description}
          </p>
        )}
      </div>

      {/* THE TRADE */}
      <section className="px-5 mt-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          THE TRADE
        </span>
        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
          <div className="bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] rounded-[14px] p-3.5">
            <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)]">
              YOU GIVE
            </div>
            <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
              {offer.compensation || "—"}
            </p>
          </div>
          <div className="flex items-center justify-center px-1">
            <KnotGlyph className="h-6 w-6 text-[color:var(--clay)]" />
          </div>
          <div className="bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] rounded-[14px] p-3.5">
            <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--clay-deep)]">
              YOU GET
            </div>
            <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
              {offer.deliverables}
            </p>
          </div>
        </div>
      </section>

      {/* Logistics */}
      {(offer.address || offer.deadline) && (
        <section className="px-5 mt-6">
          <div className="border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
            {offer.address && (
              <div className="flex items-center gap-3 px-4 py-3">
                <MapPin className="h-4 w-4 text-[color:var(--ink-soft)] shrink-0" strokeWidth={1.6} />
                <div className="flex-1">
                  <p className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                    LOCATION
                  </p>
                  <p className="text-[13.5px] text-[color:var(--ink)] font-medium mt-0.5">
                    {offer.address}
                  </p>
                </div>
              </div>
            )}
            {offer.deadline && (
              <div className="flex items-center gap-3 px-4 py-3">
                <Calendar className="h-4 w-4 text-[color:var(--ink-soft)] shrink-0" strokeWidth={1.6} />
                <div className="flex-1">
                  <p className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                    DEADLINE
                  </p>
                  <p className="text-[13.5px] text-[color:var(--ink)] font-medium mt-0.5">
                    {new Date(offer.deadline).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Pending applicants */}
      <section id="applicants" className="px-5 mt-8 scroll-mt-20">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
            PENDING · {pendingApps.length}
          </span>
          <Users className="h-4 w-4 text-[color:var(--ink-faint)]" strokeWidth={1.6} />
        </div>

        <div className="mt-3 space-y-3">
          {pendingApps.length === 0 ? (
            <EmptyState
              icon={Users}
              tone="clay"
              title="No applicants yet"
              description="Creators will show up here when they apply."
            />
          ) : (
            pendingApps.map((app) => {
              const creatorRaw = app.creator as unknown;
              const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as {
                profile?: { full_name?: string; avatar_url?: string };
                instagram_handle?: string;
                follower_count?: number;
                avg_rating?: number;
                city?: string;
              } | null;

              return (
                <article
                  key={app.id}
                  className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4 space-y-3"
                >
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={creator?.profile?.avatar_url}
                      name={creator?.profile?.full_name ?? "Creator"}
                      size="md"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif text-[16px] font-medium text-[color:var(--ink)] leading-tight">
                        {creator?.profile?.full_name}
                      </p>
                      {creator?.instagram_handle && (
                        <p className="font-sans text-[12px] text-[color:var(--ink-mid)] font-medium mt-0.5">
                          @{creator.instagram_handle}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {(creator?.follower_count ?? 0) > 0 && (
                          <span className="font-mono text-[9.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--sage-deep)]">
                            {creator?.follower_count?.toLocaleString()} FOLLOWERS
                          </span>
                        )}
                        {(creator?.avg_rating ?? 0) > 0 && (
                          <span className="font-mono text-[9.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--clay-deep)]">
                            ★ {creator?.avg_rating?.toFixed(1)}
                          </span>
                        )}
                        {creator?.city && (
                          <span className="font-mono text-[9.5px] font-bold tracking-[0.15em] uppercase text-[color:var(--ink-soft)]">
                            {creator.city}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {app.message && (
                    <p className="font-serif italic text-[14px] leading-[1.5] text-[color:var(--ink-mid)] bg-[color:var(--paper)] rounded-[12px] px-3.5 py-3 border border-[color:var(--line)]">
                      &ldquo;{app.message}&rdquo;
                    </p>
                  )}

                  <ApplicantActions applicationId={app.id} offerId={offer.id} />
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Connected */}
      {connectedApps.length > 0 && (
        <section className="px-5 mt-8">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
            CONNECTED · {connectedApps.length}
          </span>
          <div className="mt-3 space-y-2">
            {connectedApps.map((app) => {
              const creatorRaw = app.creator as unknown;
              const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as {
                profile?: { full_name?: string; avatar_url?: string };
              } | null;
              return (
                <div
                  key={app.id}
                  className="rounded-[14px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] p-3.5 flex items-center gap-3"
                >
                  <Avatar
                    src={creator?.profile?.avatar_url}
                    name={creator?.profile?.full_name ?? "Creator"}
                    size="sm"
                  />
                  <p className="flex-1 font-sans text-[13.5px] font-semibold text-[color:var(--ink)] truncate">
                    {creator?.profile?.full_name}
                  </p>
                  <span className="font-mono text-[9px] font-bold tracking-[0.15em] uppercase text-[color:var(--sage-deep)]">
                    Tied
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Declined */}
      {declinedApps.length > 0 && (
        <section className="px-5 mt-8">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            DECLINED · {declinedApps.length}
          </span>
          <div className="mt-3 space-y-2 opacity-70">
            {declinedApps.map((app) => {
              const creatorRaw = app.creator as unknown;
              const creator = (Array.isArray(creatorRaw) ? creatorRaw[0] : creatorRaw) as {
                profile?: { full_name?: string; avatar_url?: string };
              } | null;
              return (
                <div
                  key={app.id}
                  className="rounded-[14px] bg-[color:var(--paper)] border border-[color:var(--line)] p-3.5 flex items-center gap-3"
                >
                  <Avatar
                    src={creator?.profile?.avatar_url}
                    name={creator?.profile?.full_name ?? "Creator"}
                    size="sm"
                  />
                  <p className="flex-1 font-sans text-[13.5px] font-medium text-[color:var(--ink-mid)] truncate">
                    {creator?.profile?.full_name}
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
