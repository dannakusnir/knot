"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface ApplicantActionsProps {
  applicationId: string;
  offerId: string;
}

export default function ApplicantActions({
  applicationId,
  offerId,
}: ApplicantActionsProps) {
  const [loading, setLoading] = useState<"connect" | "decline" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleAction(action: "connect" | "decline") {
    setLoading(action);

    const status = action === "connect" ? "approved" : "declined";

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      setLoading(null);
      return;
    }

    // If connecting, create a knot
    if (action === "connect") {
      const { data: app } = await supabase
        .from("applications")
        .select("creator_id, offer_id, offer:offers(business_id)")
        .eq("id", applicationId)
        .single();

      if (app) {
        await supabase.from("knots").insert({
          application_id: applicationId,
          offer_id: app.offer_id,
          creator_id: app.creator_id,
          business_id: (app.offer as unknown as { business_id: string }).business_id,
          status: "connected",
          proof_urls: [],
          is_guarantee_redo: false,
          admin_assigned: false,
        });
      }
    }

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleAction("connect")}
        loading={loading === "connect"}
        disabled={loading !== null}
        className="flex-1"
        size="sm"
      >
        Connect
      </Button>
      <Button
        variant="outline"
        onClick={() => handleAction("decline")}
        loading={loading === "decline"}
        disabled={loading !== null}
        className="flex-1"
        size="sm"
      >
        Decline
      </Button>
    </div>
  );
}
