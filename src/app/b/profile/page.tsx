import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Avatar, ErrorState } from "@/components/ui";
import { MapPin, Globe, Settings } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";

export default async function BusinessProfilePage() {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !businessProfile) {
    return (
      <ErrorState
        title="We couldn't load your business profile."
        description="Something on our end hiccuped. Try again — if it keeps happening, sign out and back in."
        action={{ label: "Try again", href: "/b/profile" }}
      />
    );
  }

  const stats = [
    {
      value: businessProfile.total_knots,
      label: "KNOTS TIED",
      bg: "sage-tint",
      fg: "sage-deep",
    },
    {
      value:
        businessProfile.avg_rating > 0
          ? businessProfile.avg_rating.toFixed(1)
          : "—",
      label: "RATING",
      bg: "clay-soft",
      fg: "clay-deep",
    },
    {
      value: businessProfile.guarantee_credits,
      label: "CREDITS",
      bg: "sand",
      fg: "sand-ink",
    },
  ];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-24">
      {/* Masthead */}
      <div className="px-5 pt-7 pb-3 flex items-center justify-between">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          BUSINESS
        </span>
        <button className="w-10 h-10 flex items-center justify-center">
          <Settings className="h-5 w-5 text-[color:var(--ink-soft)]" strokeWidth={1.5} />
        </button>
      </div>

      {/* Identity */}
      <div className="px-5 mt-3">
        <Avatar
          src={businessProfile.logo_url}
          name={businessProfile.business_name}
          size="xl"
        />

        <h1 className="mt-4 font-serif italic text-[32px] font-medium text-[color:var(--ink)] leading-[1] tracking-[-0.015em]">
          {businessProfile.business_name}
        </h1>

        {businessProfile.category && (
          <p className="mt-2 font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[color:var(--clay-deep)]">
            {businessProfile.category}
            {businessProfile.city ? ` · ${businessProfile.city}` : ""}
          </p>
        )}

        {businessProfile.description && (
          <p className="mt-3 font-serif italic text-[14.5px] leading-[1.55] text-[color:var(--ink-mid)]">
            {businessProfile.description}
          </p>
        )}
      </div>

      {/* Stat grid */}
      <div className="px-5 mt-7 grid grid-cols-3 gap-2">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] px-3 py-3.5 text-center border border-[color:var(--line-soft)]"
            style={{ background: `var(--${s.bg})` }}
          >
            <div
              className="font-serif text-[26px] font-medium leading-none"
              style={{ color: `var(--${s.fg})` }}
            >
              {s.value}
            </div>
            <div
              className="font-mono text-[9px] font-bold tracking-[0.18em] mt-1.5 opacity-80"
              style={{ color: `var(--${s.fg})` }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Contact */}
      <div className="px-5 mt-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          CONTACT
        </span>
        <div className="mt-3 border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
          {businessProfile.address && (
            <div className="flex items-center gap-3 px-4 py-3">
              <MapPin className="h-4 w-4 text-[color:var(--ink-soft)] shrink-0" strokeWidth={1.6} />
              <div className="flex-1">
                <p className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                  ADDRESS
                </p>
                <p className="text-[13.5px] text-[color:var(--ink)] font-medium mt-0.5">
                  {businessProfile.address}
                </p>
              </div>
            </div>
          )}
          {businessProfile.website && (
            <a
              href={businessProfile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 active:opacity-60"
            >
              <Globe className="h-4 w-4 text-[color:var(--ink-soft)] shrink-0" strokeWidth={1.6} />
              <div className="flex-1">
                <p className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                  WEBSITE
                </p>
                <p className="text-[13.5px] text-[color:var(--sage-deep)] font-medium mt-0.5 underline underline-offset-2 truncate">
                  {businessProfile.website}
                </p>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Account */}
      <div className="px-5 mt-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          ACCOUNT
        </span>
        <div className="mt-3 border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-mono text-[9.5px] font-bold tracking-[0.18em] uppercase text-[color:var(--ink-soft)]">
              Name
            </span>
            <span className="text-[13.5px] text-[color:var(--ink)] font-medium">
              {profile.full_name}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-mono text-[9.5px] font-bold tracking-[0.18em] uppercase text-[color:var(--ink-soft)]">
              Email
            </span>
            <span className="text-[13.5px] text-[color:var(--ink)] font-medium truncate max-w-[180px]">
              {profile.email}
            </span>
          </div>
        </div>
      </div>

      <div className="px-5 mt-10">
        <SignOutButton />
      </div>
    </div>
  );
}
