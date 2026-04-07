"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

interface CreatorApprovalActionsProps {
  creatorId: string;
}

export default function CreatorApprovalActions({
  creatorId,
}: CreatorApprovalActionsProps) {
  const [loading, setLoading] = useState<"approve" | "reject" | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleAction(action: "approve" | "reject") {
    setLoading(action);

    const status = action === "approve" ? "approved" : "rejected";

    const { error } = await supabase
      .from("creator_profiles")
      .update({ approval_status: status })
      .eq("id", creatorId);

    if (error) {
      setLoading(null);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => handleAction("approve")}
        loading={loading === "approve"}
        disabled={loading !== null}
        className="flex-1"
        size="sm"
      >
        Approve
      </Button>
      <Button
        variant="outline"
        onClick={() => handleAction("reject")}
        loading={loading === "reject"}
        disabled={loading !== null}
        className="flex-1"
        size="sm"
      >
        Reject
      </Button>
    </div>
  );
}
