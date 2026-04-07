"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Select, Card } from "@/components/ui";
import {
  OFFER_CATEGORIES,
  DELIVERABLE_TYPES,
  USAGE_RIGHTS,
} from "@/lib/constants";
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
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

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
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/b/offers"
          className="rounded-lg p-2 hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-xl font-serif font-semibold">Create Offer</h1>
          <p className="text-sm text-muted-foreground">
            Describe what you&apos;re looking for
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Instagram Reel for our new menu"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Textarea
          label="Description"
          placeholder="Describe the collaboration in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
        />

        <Textarea
          label="Deliverables"
          placeholder="e.g. 1 Instagram Reel (30-60s) + 3 Instagram Stories"
          value={deliverables}
          onChange={(e) => setDeliverables(e.target.value)}
          rows={2}
          required
        />

        <Input
          label="Compensation"
          placeholder="e.g. Free dinner for 2 + $50"
          value={compensation}
          onChange={(e) => setCompensation(e.target.value)}
        />

        <Select
          label="Usage Rights"
          placeholder="Select usage rights"
          value={usageRights}
          onChange={(e) => setUsageRights(e.target.value)}
          options={USAGE_RIGHTS.map((r) => ({ value: r, label: r }))}
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
        />

        <Input
          label="Location / Address"
          placeholder="123 Main St, Hoboken NJ"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        <Input
          label="Deadline"
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <Input
          label="Max Creators"
          type="number"
          min="1"
          value={maxCreators}
          onChange={(e) => setMaxCreators(e.target.value)}
        />

        {error && (
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Publish Offer
        </Button>
      </form>
    </div>
  );
}
