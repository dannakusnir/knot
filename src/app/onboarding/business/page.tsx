"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select, KnotLogo } from "@/components/ui";
import { OFFER_CATEGORIES, GUARANTEE_CREDITS } from "@/lib/constants";

export default function BusinessOnboardingPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [businessName, setBusinessName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
      .from("business_profiles")
      .insert({
        id: user.id,
        business_name: businessName,
        description,
        category,
        address,
        city,
        website: website || null,
        avg_rating: 0,
        total_ratings: 0,
        total_knots: 0,
        guarantee_credits: GUARANTEE_CREDITS,
      });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/b/dashboard");
  }

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] flex flex-col">
      {/* Top */}
      <div className="flex items-center justify-between px-5 pt-14 pb-6">
        <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          SETUP
        </span>
        <KnotLogo variant="mark" size="sm" />
      </div>

      {/* Title */}
      <div className="px-5 mb-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          YOUR SPOT
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          Tell us about<br />your place.
        </h1>
        <p className="mt-3 font-serif italic text-[14.5px] leading-[1.5] text-[color:var(--ink-mid)]">
          Under two minutes. Creators see this first.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="px-5 pb-6 space-y-4 flex-1"
      >
        <Input
          label="Business name"
          placeholder="Mami Cresskill"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
        />

        <Textarea
          label="What's the vibe?"
          placeholder="Opened in March. Mom's still in the kitchen. Dinner-first Mediterranean spot with a soft spot for neighbors."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />

        <Select
          label="Category"
          placeholder="What kind of spot are you?"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          options={OFFER_CATEGORIES.map((cat) => ({
            value: cat,
            label: cat,
          }))}
          required
        />

        <Input
          label="Address"
          placeholder="15 E Madison Ave"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          label="City"
          placeholder="Cresskill, NJ"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />

        <Input
          label="Website (optional)"
          placeholder="https://yourplace.com"
          type="url"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />

        {error && (
          <div className="rounded-xl bg-[color:var(--destructive-soft)] border border-[color:var(--destructive)]/20 px-4 py-3">
            <p className="text-[13px] text-[color:var(--destructive)] text-center font-medium">
              {error}
            </p>
          </div>
        )}
      </form>

      <div className="px-5 pb-10 pt-4 border-t border-[color:var(--line)]">
        <Button
          type="submit"
          onClick={handleSubmit}
          loading={loading}
          variant="clay"
          className="w-full"
          size="lg"
        >
          Open the room
        </Button>
        <p className="mt-3 text-center font-mono text-[9.5px] font-bold tracking-[0.18em] uppercase text-[color:var(--ink-soft)]">
          2 GUARANTEE CREDITS ON US
        </p>
      </div>
    </div>
  );
}
