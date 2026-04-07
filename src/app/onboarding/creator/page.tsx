"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select, KnotLogo } from "@/components/ui";
import { OFFER_CATEGORIES, MIN_FOLLOWERS } from "@/lib/constants";
import { Camera, CheckCircle } from "lucide-react";

type Step = "profile" | "social" | "portfolio" | "review";

export default function CreatorOnboardingPage() {
  const [step, setStep] = useState<Step>("profile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  // Form data
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

  const steps: { key: Step; label: string }[] = [
    { key: "profile", label: "Profile" },
    { key: "social", label: "Social" },
    { key: "portfolio", label: "Portfolio" },
    { key: "review", label: "Review" },
  ];

  const currentIndex = steps.findIndex((s) => s.key === step);

  return (
    <div className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto max-w-sm">
        <div className="flex justify-center mb-8">
          <KnotLogo size="md" />
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.key} className="flex-1">
              <div
                className={`h-1 rounded-full transition-colors ${
                  i <= currentIndex ? "bg-primary" : "bg-border"
                }`}
              />
              <p
                className={`text-xs mt-1 ${
                  i <= currentIndex
                    ? "text-foreground font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {step === "profile" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif font-semibold">
                Tell us about yourself
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                This helps businesses find the right creator
              </p>
            </div>

            <Textarea
              label="Bio"
              placeholder="Tell businesses what makes your content unique..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />

            <Input
              label="City"
              placeholder="e.g. Hoboken, NJ"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />

            <div className="space-y-1.5">
              <label className="block text-sm font-medium">
                Content Categories
              </label>
              <div className="flex flex-wrap gap-2">
                {OFFER_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                      categories.includes(cat)
                        ? "bg-primary text-white"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={() => setStep("social")}
              className="w-full"
              size="lg"
            >
              Continue
            </Button>
          </div>
        )}

        {step === "social" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif font-semibold">
                Your social presence
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                We use this to verify your profile (min {MIN_FOLLOWERS}{" "}
                followers)
              </p>
            </div>

            <Input
              label="Instagram Handle"
              placeholder="@yourhandle"
              value={instagramHandle}
              onChange={(e) => setInstagramHandle(e.target.value)}
            />

            <Input
              label="TikTok Handle (optional)"
              placeholder="@yourhandle"
              value={tiktokHandle}
              onChange={(e) => setTiktokHandle(e.target.value)}
            />

            <Input
              label="Approximate Follower Count"
              type="number"
              placeholder="e.g. 5000"
              value={followerCount}
              onChange={(e) => setFollowerCount(e.target.value)}
            />

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("profile")}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("portfolio")}
                className="flex-1"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "portfolio" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif font-semibold">
                Show your best work
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Share 3 links to your best content (Instagram posts, Reels, or
                TikToks)
              </p>
            </div>

            {portfolioUrls.map((url, i) => (
              <Input
                key={i}
                label={`Content Link ${i + 1}${i === 0 ? " (required)" : ""}`}
                placeholder="https://instagram.com/p/..."
                value={url}
                onChange={(e) => updatePortfolioUrl(i, e.target.value)}
                required={i === 0}
              />
            ))}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("social")}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={() => setStep("review")}
                className="flex-1"
                size="lg"
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "review" && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-serif font-semibold">
                Almost there!
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                Review your profile before submitting
              </p>
            </div>

            <div className="rounded-2xl bg-card border border-border/50 p-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Bio</p>
                <p className="text-sm">{bio || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">City</p>
                <p className="text-sm">{city || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Categories</p>
                <p className="text-sm">
                  {categories.join(", ") || "None selected"}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Instagram</p>
                <p className="text-sm">{instagramHandle || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Followers</p>
                <p className="text-sm">{followerCount || "Not provided"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Portfolio</p>
                <p className="text-sm">
                  {portfolioUrls.filter(Boolean).length} links
                </p>
              </div>
            </div>

            <div className="rounded-2xl bg-primary/10 border border-primary/20 p-4">
              <div className="flex items-start gap-3">
                <Camera className="h-5 w-5 text-primary-hover mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Quality Review</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your profile will be reviewed before you can access offers.
                    This ensures the best experience for everyone.
                  </p>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep("portfolio")}
                className="flex-1"
                size="lg"
              >
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                loading={loading}
                className="flex-1"
                size="lg"
              >
                Submit Profile
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
