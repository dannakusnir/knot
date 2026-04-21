"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select } from "@/components/ui";
import { OFFER_CATEGORIES, USAGE_RIGHTS } from "@/lib/constants";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewOfferPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deliverables, setDeliverables] = useState("");
  const [compensation, setCompensation] = useState("");
  const [usageRights, setUsageRights] = useState("");
  const [category, setCategory] = useState("");
  const [address, setAddress] = useState("");
  const [deadline, setDeadline] = useState("");
  const [maxCreators, setMaxCreators] = useState("1");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim() || !description.trim() || !deliverables.trim()) {
      setError("Title, description, and what you give are all required.");
      return;
    }

    if (deadline && new Date(deadline) < new Date()) {
      setError("Deadline must be in the future.");
      return;
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("offers").insert({
      business_id: user.id,
      title,
      description,
      deliverables,
      compensation: compensation || null,
      usage_rights: usageRights || null,
      category: category || null,
      address: address || null,
      deadline: deadline || null,
      max_creators: parseInt(maxCreators) || 1,
      status: "active",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/b/offers");
  }

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-10">
      {/* Top */}
      <div className="flex items-center justify-between px-5 pt-14 pb-6">
        <Link
          href="/b/offers"
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </Link>
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          NEW TRADE
        </span>
        <div className="w-10 h-10" />
      </div>

      {/* Title */}
      <div className="px-5 mb-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
          POST A TRADE
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          What are<br />you offering?
        </h1>
        <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--ink-mid)] font-medium">
          Creators see this card first. Keep it honest, keep it warm.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="px-5 space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Dinner for two in exchange for a reel"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          label="Your pitch"
          placeholder="Tell creators what the vibe is. Why should they come?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <div className="rounded-[14px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] p-4">
              <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)] mb-3">
                YOU GIVE
              </div>
              <Input
                placeholder="e.g. Dinner for two · $80 value"
                value={compensation}
                onChange={(e) => setCompensation(e.target.value)}
              />
            </div>
          </div>

          <div className="col-span-2">
            <div className="rounded-[14px] bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] p-4">
              <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--clay-deep)] mb-3">
                YOU GET
              </div>
              <Textarea
                placeholder="e.g. 1 Instagram Reel + 3 Stories"
                value={deliverables}
                onChange={(e) => setDeliverables(e.target.value)}
                rows={2}
                required
              />
            </div>
          </div>
        </div>

        <Select
          label="Usage rights"
          placeholder="How can you use their content?"
          value={usageRights}
          onChange={(e) => setUsageRights(e.target.value)}
          options={USAGE_RIGHTS.map((r) => ({ value: r, label: r }))}
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
        />

        <Input
          label="Location"
          placeholder="123 Main St, Cresskill NJ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
          <Input
            label="Max creators"
            type="number"
            min="1"
            value={maxCreators}
            onChange={(e) => setMaxCreators(e.target.value)}
          />
        </div>

        {error && (
          <div className="rounded-xl bg-[color:var(--destructive-soft)] border border-[color:var(--destructive)]/20 px-4 py-3">
            <p className="text-[13px] text-[color:var(--destructive)] text-center font-medium">
              {error}
            </p>
          </div>
        )}

        <div className="pt-3">
          <Button
            type="submit"
            loading={loading}
            variant="clay"
            className="w-full"
            size="lg"
          >
            Post this trade
          </Button>
        </div>
      </form>
    </div>
  );
}
