"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Chip, KnotLogo } from "@/components/ui";
import { OFFER_CATEGORIES } from "@/lib/constants";

type Step = "profile" | "social" | "portfolio" | "review";

const STEPS: { key: Step; label: string; title: string; kicker: string }[] = [
  { key: "profile", label: "You", title: "Who are you?", kicker: "ABOUT YOU" },
  { key: "social", label: "Where", title: "Where can we find you?", kicker: "YOUR WORK" },
  { key: "portfolio", label: "Proof", title: "Show us three.", kicker: "PORTFOLIO" },
  { key: "review", label: "Send", title: "Ready to submit?", kicker: "REVIEW" },
];

export default function CreatorOnboardingPage() {
  const [step, setStep] = useState<Step>("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [instagramHandle, setInstagramHandle] = useState("");
  const [tiktokHandle, setTiktokHandle] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [portfolioUrls, setPortfolioUrls] = useState(["", "", ""]);

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function updatePortfolioUrl(index: number, value: string) {
    setPortfolioUrls((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function handleSubmit() {
    setError("");
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { error: insertError } = await supabase
      .from("creator_profiles")
      .insert({
        id: user.id,
        bio,
        city,
        categories,
        instagram_handle: instagramHandle || null,
        tiktok_handle: tiktokHandle || null,
        follower_count: parseInt(followerCount) || 0,
        portfolio_urls: portfolioUrls.filter(Boolean),
        approval_status: "pending",
        verified: false,
        avg_rating: 0,
        total_ratings: 0,
        total_knots: 0,
        completion_rate: 0,
        trust_score: 0,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/c/explore");
  }

  const currentIndex = STEPS.findIndex((s) => s.key === step);
  const current = STEPS[currentIndex];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] flex flex-col">
      {/* Top */}
      <div className="flex items-center justify-between px-5 pt-14 pb-5">
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          {currentIndex + 1} / {STEPS.length}
        </span>
        <KnotLogo variant="mark" size="sm" />
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-6">
        <div className="flex gap-1.5">
          {STEPS.map((s, i) => (
            <div
              key={s.key}
              className={`flex-1 h-[3px] rounded-full transition-all ${
                i <= currentIndex
                  ? "bg-[color:var(--sage-deep)]"
                  : "bg-[color:var(--line)]"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="px-5 mb-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
          {current.kicker}
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1.02] tracking-[-0.02em] text-[color:var(--ink)]">
          {current.title}
        </h1>
      </div>

      {/* Steps */}
      <div className="px-5 pb-8 flex-1">
        {step === "profile" && (
          <div className="space-y-5">
            <Textarea
              label="Your voice, in a line or two"
              placeholder="Food stylist with a soft spot for neighborhood kitchens."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />

            <Input
              label="Where are you based?"
              placeholder="Cresskill, NJ"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <div className="space-y-2.5">
              <label className="block font-sans text-[11.5px] font-semibold tracking-[0.02em] text-[color:var(--ink-mid)]">
                What do you cover?
              </label>
              <div className="flex flex-wrap gap-2">
                {OFFER_CATEGORIES.map((cat) => (
                  <Chip
                    key={cat}
                    label={cat}
                    active={categories.includes(cat)}
                    onClick={() => toggleCategory(cat)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {step === "social" && (
          <div className="space-y-5">
            <Input
              label="Instagram handle"
              placeholder="@maya.makes"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
            />

            <Input
              label="TikTok handle (optional)"
              placeholder="@yourhandle"
              value={tiktokHandle}
              onChange={(e) => setTiktokHandle(e.target.value)}
            />

            <Input
              label="Roughly how many followers?"
              type="number"
              placeholder="4300"
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
            />

            <p className="font-serif italic text-[13px] leading-[1.5] text-[color:var(--ink-mid)]">
              Don&apos;t stress the number. We care more about who you bring than
              how many.
            </p>
          </div>
        )}

        {step === "portfolio" && (
          <div className="space-y-5">
            <p className="font-serif italic text-[15px] leading-[1.5] text-[color:var(--ink-mid)] -mt-4">
              Pick the three that look most like you.
            </p>

            {portfolioUrls.map((url, i) => (
              <Input
                key={i}
                label={i === 0 ? "Link one" : i === 1 ? "Link two" : "Link three (optional)"}
                placeholder="https://instagram.com/p/…"
                value={url}
                onChange={(e) => updatePortfolioUrl(i, e.target.value)}
                required={i === 0}
              />
            ))}
          </div>
        )}

        {step === "review" && (
          <div className="space-y-5">
            <p className="font-serif italic text-[15px] leading-[1.55] text-[color:var(--ink-mid)] -mt-4">
              One quick look before we send it over.
            </p>

            <div className="rounded-[14px] bg-[color:var(--surface)] border border-[color:var(--line)] divide-y divide-[color:var(--line-soft)]">
              {[
                { label: "BIO", value: bio || "—" },
                { label: "CITY", value: city || "—" },
                { label: "CATEGORIES", value: categories.join(", ") || "—" },
                { label: "INSTAGRAM", value: instagramHandle || "—" },
                { label: "FOLLOWERS", value: followerCount || "—" },
                {
                  label: "PORTFOLIO",
                  value: `${portfolioUrls.filter(Boolean).length} ${
                    portfolioUrls.filter(Boolean).length === 1 ? "link" : "links"
                  }`,
                },
              ].map((row) => (
                <div key={row.label} className="px-4 py-3">
                  <p className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-[color:var(--ink-soft)]">
                    {row.label}
                  </p>
                  <p className="mt-1 text-[13.5px] text-[color:var(--ink)] font-medium break-words">
                    {row.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-[14px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] p-4">
              <p className="font-mono text-[9px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
                WHAT HAPPENS NEXT
              </p>
              <p className="mt-2 font-serif italic text-[14.5px] leading-[1.5] text-[color:var(--ink)]">
                We review every creator before the first knot — usually within
                24–48 hours. You&apos;ll get an email when you&apos;re in.
              </p>
            </div>

            {error && (
              <div className="rounded-xl bg-[color:var(--destructive-soft)] border border-[color:var(--destructive)]/20 px-4 py-3">
                <p className="text-[13px] text-[color:var(--destructive)] text-center font-medium">
                  {error}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CTA footer */}
      <div className="px-5 pb-10 pt-4 flex gap-3 border-t border-[color:var(--line)] bg-[color:var(--cream)]">
        {currentIndex > 0 && (
          <Button
            variant="outline"
            onClick={() => setStep(STEPS[currentIndex - 1].key)}
            className="flex-1"
            size="lg"
          >
            Back
          </Button>
        )}
        {step !== "review" ? (
          <Button
            onClick={() => setStep(STEPS[currentIndex + 1].key)}
            className="flex-1"
            size="lg"
          >
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            loading={loading}
            className="flex-1"
            size="lg"
          >
            Submit
          </Button>
        )}
      </div>
    </div>
  );
}
