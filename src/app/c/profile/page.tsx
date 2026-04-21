import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Avatar, ErrorState } from "@/components/ui";
import { AtSign, CheckCircle, Settings } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";
import Image from "next/image";
import Link from "next/link";
import { getBusinessImages } from "@/lib/business-images";

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

  if (!profile || !creatorProfile) {
    return (
      <ErrorState
        title="We couldn't load your profile."
        description="Something on our end hiccuped. Try again — if it keeps happening, sign out and back in."
        action={{ label: "Try again", href: "/c/profile" }}
      />
    );
  }

  // Find completed knots to show as "recent work"
  const { data: completedKnots } = await supabase
    .from("knots")
    .select("id, business:business_profiles(business_name)")
    .eq("creator_id", user.id)
    .eq("status", "completed")
    .order("completed_at", { ascending: false })
    .limit(3);

  const recentWork = (completedKnots || [])
    .map((k) => {
      const bizRaw = k.business as unknown;
      const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as { business_name: string } | null;
      const imageSet = biz ? getBusinessImages(biz.business_name) : null;
      return {
        id: k.id,
        image: imageSet?.hero?.[0] || null,
        name: biz?.business_name,
      };
    })
    .filter((w) => w.image);

  const stats = [
    {
      value: creatorProfile.total_knots,
      label: "KNOTS TIED",
      bg: "var(--sage-tint)",
      fg: "var(--sage-deep)",
    },
    {
      value:
        creatorProfile.avg_rating > 0
          ? creatorProfile.avg_rating.toFixed(1)
          : "—",
      label: "RATING",
      bg: "var(--clay-soft)",
      fg: "var(--clay-deep)",
    },
    {
      value:
        creatorProfile.completion_rate > 0
          ? `${Math.round(creatorProfile.completion_rate * 100)}%`
          : "—",
      label: "COMPLETE",
      bg: "var(--sand)",
      fg: "var(--sand-ink)",
    },
  ];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-24">
      {/* Cover */}
      <div className="relative h-[200px] overflow-hidden">
        {recentWork[0]?.image ? (
          <Image
            src={recentWork[0].image}
            alt="Cover"
            fill
            className="object-cover"
            sizes="100vw"
          />
        ) : (
          <div className="absolute inset-0 bg-[color:var(--paper)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[color:var(--cream)]" />
        <div className="absolute top-14 left-5 right-5 flex justify-between items-center">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-white/95">
            CREATOR
          </span>
          <button className="w-10 h-10 flex items-center justify-center">
            <Settings className="h-5 w-5 text-white/95" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Identity block (overlapping) */}
      <div className="px-5 -mt-14 relative">
        <div className="flex items-end gap-4">
          <div className="relative">
            <Avatar
              src={profile.avatar_url}
              name={profile.full_name}
              size="xl"
            />
            {creatorProfile.verified && (
              <div className="absolute -bottom-0.5 -right-0.5 w-7 h-7 rounded-full bg-[color:var(--sage)] flex items-center justify-center ring-[3px] ring-[color:var(--cream)]">
                <CheckCircle className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </div>
            )}
          </div>
        </div>

        <h1 className="mt-4 font-serif italic text-[32px] font-medium text-[color:var(--ink)] leading-[1] tracking-[-0.015em]">
          {profile.full_name}
        </h1>

        <p className="mt-2 font-sans text-[13px] font-medium text-[color:var(--ink-soft)]">
          {creatorProfile.instagram_handle && `@${creatorProfile.instagram_handle}`}
          {creatorProfile.instagram_handle && creatorProfile.city ? " · " : ""}
          {creatorProfile.city}
        </p>

        {creatorProfile.bio && (
          <p className="mt-3 font-serif italic text-[14.5px] leading-[1.5] text-[color:var(--ink-mid)]">
            {creatorProfile.bio}
          </p>
        )}

        {creatorProfile.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {creatorProfile.categories.map((cat: string) => (
              <span
                key={cat}
                className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[color:var(--sage-deep)] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] px-2.5 py-1 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Stat grid */}
      <div className="px-5 mt-7 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] px-3 py-3.5 text-center"
            style={{ background: `rgb(from ${s.bg} r g b)`, backgroundColor: `var(--${s.bg.replace(/var\(--|\)/g, "")})` }}
          >
            <div
              className="font-serif text-[26px] font-medium leading-none"
              style={{ color: s.fg.startsWith("var") ? `var(--${s.fg.replace(/var\(--|\)/g, "")})` : s.fg }}
            >
              {s.value}
            </div>
            <div
              className="font-mono text-[9px] font-bold tracking-[0.18em] mt-1.5 opacity-80"
              style={{ color: s.fg.startsWith("var") ? `var(--${s.fg.replace(/var\(--|\)/g, "")})` : s.fg }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Trust Score */}
      <div className="px-5 mt-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          TRUST SCORE
        </span>
        <div className="mt-3 flex items-baseline gap-3">
          <span className="font-serif italic text-[56px] font-normal leading-none text-[color:var(--ink)]">
            {creatorProfile.trust_score.toFixed(1)}
          </span>
          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--ink-soft)]">
            / 5.0 earned
          </span>
        </div>
        <div className="mt-3 h-[3px] bg-[color:var(--line)]">
          <div
            className="h-full bg-[color:var(--sage-deep)] transition-all"
            style={{
              width: `${Math.min(creatorProfile.trust_score * 20, 100)}%`,
            }}
          />
        </div>
      </div>

      {/* Recent work */}
      {recentWork.length > 0 && (
        <div className="px-5 mt-8">
          <div className="flex justify-between items-center mb-3">
            <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
              RECENT WORK
            </span>
            <Link
              href="/c/dashboard"
              className="font-sans text-[11px] font-bold tracking-[0.08em] uppercase text-[color:var(--sage-deep)]"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {recentWork.map((work) => (
              <Link key={work.id} href={`/c/knots/${work.id}`}>
                <div className="aspect-square rounded-xl overflow-hidden relative">
                  {work.image && (
                    <Image
                      src={work.image}
                      alt={work.name || ""}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 33vw, 140px"
                    />
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Presence */}
      <div className="px-5 mt-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          PRESENCE
        </span>
        <div className="mt-3 border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
          {creatorProfile.instagram_handle && (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[color:var(--clay-soft)] flex items-center justify-center">
                  <AtSign className="h-4 w-4 text-[color:var(--clay-deep)]" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-sans text-[13.5px] font-semibold text-[color:var(--ink)]">
                    @{creatorProfile.instagram_handle}
                  </p>
                  {creatorProfile.follower_count > 0 && (
                    <p className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-[color:var(--sage-deep)] mt-0.5">
                      {creatorProfile.follower_count.toLocaleString()} FOLLOWERS
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
          {creatorProfile.tiktok_handle && (
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[color:var(--line-soft)] flex items-center justify-center">
                  <AtSign className="h-4 w-4 text-[color:var(--ink-mid)]" strokeWidth={1.6} />
                </div>
                <div>
                  <p className="font-sans text-[13.5px] font-semibold text-[color:var(--ink)]">
                    @{creatorProfile.tiktok_handle}
                  </p>
                  <p className="font-mono text-[9.5px] font-bold tracking-[0.12em] text-[color:var(--ink-soft)] mt-0.5">
                    TIKTOK
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="px-5 mt-10">
        <SignOutButton />
      </div>
    </div>
  );
}
