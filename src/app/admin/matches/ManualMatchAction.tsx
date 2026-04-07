"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Select } from "@/components/ui";

interface Creator {
  id: string;
  name: string;
  instagram: string | null;
  trustScore: number;
}

interface ManualMatchActionProps {
  offerId: string;
  businessId: string;
  creators: Creator[];
}

export default function ManualMatchAction({
  offerId,
  businessId,
  creators,
}: ManualMatchActionProps) {
  const [selectedCreator, setSelectedCreator] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleMatch() {
    if (!selectedCreator) return;
    setLoading(true);

    // Create application
    const { data: app, error: appError } = await supabase
      .from("applications")
      .insert({
        offer_id: offerId,
        creator_id: selectedCreator,
        message: "Matched by admin",
        status: "approved",
      })
      .select()
      .single();

    if (appError || !app) {
      setLoading(false);
      return;
    }

    // Create knot
    const { error: knotError } = await supabase.from("knots").insert({
      application_id: app.id,
      offer_id: offerId,
      creator_id: selectedCreator,
      business_id: businessId,
      status: "connected",
      proof_urls: [],
      is_guarantee_redo: false,
      admin_assigned: true,
      admin_notes: "Manually matched by admin",
    });

    if (knotError) {
      setLoading(false);
      return;
    }

    setSelectedCreator("");
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Select
          label="Match Creator"
          placeholder="Select a creator"
          value={selectedCreator}
          onChange={(e) => setSelectedCreator(e.target.value)}
          options={creators.map((c) => ({
            value: c.id,
            label: `${c.name}${c.instagram ? ` (@${c.instagram})` : ""} - Score: ${c.trustScore}`,
          }))}
        />
      </div>
      <Button
        onClick={handleMatch}
        loading={loading}
        disabled={!selectedCreator}
        size="sm"
      >
        Match
      </Button>
    </div>
  );
}
