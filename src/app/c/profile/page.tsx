import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Avatar, SectionEyebrow } from "@/components/ui";
import { AtSign, MapPin, CheckCircle, Shield } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";

export default async function CreatorProfilePage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !creatorProfile) return null;

  const trustPct = Math.min(creatorProfile.trust_score * 20, 100);

  return (
    <div className="min-h-dvh bg-[color:var(--background)]">
      {/* Editorial masthead */}
      <div className="px-5 pt-7 pb-6 border-b border-[color:var(--line)]">
        <div className="flex items-center justify-between mb-5">
          <SectionEyebrow num="01" label="Profile" accent />
          <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[color:var(--ink-soft)]">
            MEMBER · MMXXVI
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={profile.avatar_url}
              name={profile.full_name}
              size="xl"
            />
            {creatorProfile.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[color:var(--sage-deep)] flex items-center justify-center ring-2 ring-[color:var(--background)]">
                <CheckCircle className="h-3.5 w-3.5 text-white" strokeWidth={2} />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="font-serif text-[32px] font-normal text-ink leading-[1] tracking-[-0.01em]">
              {profile.full_name}
              <span className="text-[color:var(--clay)]">.</span>
            </h1>
            {creatorProfile.city && (
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--ink-soft)] flex items-center gap-1 mt-2">
                <MapPin className="h-3 w-3" strokeWidth={2} />
                {creatorProfile.city}
              </p>
            )}
          </div>
        </div>

        {creatorProfile.bio && (
          <p className="font-serif italic text-[17px] text-[color:var(--ink-mid)] mt-5 leading-relaxed">
            {creatorProfile.bio}
          </p>
        )}

        {creatorProfile.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {creatorProfile.categories.map((cat: string) => (
              <span
                key={cat}
                className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[color:var(--sage-deep)] border border-[color:var(--sage)]/30 bg-[color:var(--sage-soft)] px-2.5 py-1"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pt-7 pb-24 space-y-8">
        {/* Stats — definition list, not pills */}
        <section>
          <SectionEyebrow num="02" label="Stats" />
          <dl className="mt-4 grid grid-cols-3 divide-x divide-[color:var(--line)] border-y border-[color:var(--line)]">
            <div className="py-5 px-2 text-center">
              <dd className="font-serif text-[36px] font-normal text-ink leading-none tracking-[-0.02em]">
                {creatorProfile.total_knots}
              </dd>
              <dt className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)] mt-2">
                Knots
              </dt>
            </div>
            <div className="py-5 px-2 text-center">
              <dd className="font-serif text-[36px] font-normal text-ink leading-none tracking-[-0.02em]">
                {creatorProfile.avg_rating > 0 ? creatorProfile.avg_rating.toFixed(1) : "—"}
              </dd>
              <dt className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)] mt-2">
                Rating
              </dt>
            </div>
            <div className="py-5 px-2 text-center">
              <dd className="font-serif text-[36px] font-normal text-ink leading-none tracking-[-0.02em]">
                {creatorProfile.completion_rate > 0
                  ? `${Math.round(creatorProfile.completion_rate * 100)}%`
                  : "—"}
              </dd>
              <dt className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)] mt-2">
                Complete
              </dt>
            </div>
          </dl>
        </section>

        {/* Trust Score — hero italic numeral */}
        <section>
          <SectionEyebrow num="03" label="Trust Score" accent />
          <div className="mt-4">
            <div className="flex items-baseline gap-4">
              <Shield className="h-5 w-5 text-[color:var(--sage-deep)] mb-1" strokeWidth={1.5} />
              <p className="font-serif italic text-[64px] font-normal text-ink leading-none tracking-[-0.03em]">
                {creatorProfile.trust_score.toFixed(1)}
              </p>
              <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--ink-soft)] mb-2">
                / 5.0 earned
              </p>
            </div>
            <div className="mt-4 h-[2px] bg-[color:var(--line)]">
              <div
                className="h-full bg-[color:var(--sage-deep)] transition-all"
                style={{ width: `${trustPct}%` }}
              />
            </div>
          </div>
        </section>

        {/* Social */}
        <section>
          <SectionEyebrow num="04" label="Presence" />
          <dl className="mt-4 border-y border-[color:var(--line)] divide-y divide-[color:var(--line)]">
            {creatorProfile.instagram_handle && (
              <div className="flex items-center justify-between py-4">
                <dt className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)] flex items-center gap-2">
                  <AtSign className="h-3 w-3" strokeWidth={2} />
                  Instagram
                </dt>
                <dd className="font-serif italic text-[17px] text-ink">
                  @{creatorProfile.instagram_handle}
                </dd>
              </div>
            )}
            {creatorProfile.tiktok_handle && (
              <div className="flex items-center justify-between py-4">
                <dt className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)] flex items-center gap-2">
                  <AtSign className="h-3 w-3" strokeWidth={2} />
                  TikTok
                </dt>
                <dd className="font-serif italic text-[17px] text-ink">
                  @{creatorProfile.tiktok_handle}
                </dd>
              </div>
            )}
            {creatorProfile.follower_count > 0 && (
              <div className="flex items-center justify-between py-4">
                <dt className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)]">
                  Followers
                </dt>
                <dd className="font-serif text-[17px] text-ink">
                  {creatorProfile.follower_count.toLocaleString()}
                </dd>
              </div>
            )}
          </dl>
        </section>

        {/* Sign Out */}
        <SignOutButton />
      </div>
    </div>
  );
}
