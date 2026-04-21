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
    <div className="min-h-dvh bg-background px-4 py-8">
      <div className="mx-auto max-w-sm">
        <div className="flex justify-center mb-8">
          <KnotLogo size="md" />
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-serif font-semibold">
            Set up your business
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quick setup — takes less than 2 minutes
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Business Name"
            placeholder="e.g. Daily Grind Cafe"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            required
          />

          <Textarea
            label="Description"
            placeholder="What does your business do? What kind of content are you looking for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Select
            label="Category"
            placeholder="Select a category"
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
            placeholder="123 Main St"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Input
            label="City"
            placeholder="e.g. Hoboken, NJ"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />

          <Input
            label="Website (optional)"
            placeholder="https://yourbusiness.com"
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

          <Button type="submit" loading={loading} className="w-full" size="lg">
            Complete Setup
          </Button>
        </form>
      </div>
    </div>
  );
}
