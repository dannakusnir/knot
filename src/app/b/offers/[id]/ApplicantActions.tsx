"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";

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
  const { toast } = useToast();

  async function handleAction(action: "connect" | "decline") {
    setLoading(action);

    const status = action === "connect" ? "approved" : "declined";

    const { error } = await supabase
      .from("applications")
      .update({ status })
      .eq("id", applicationId);

    if (error) {
      toast("error", `Failed to ${action} application`);
      setLoading(null);
      return;
    }

    toast("success", action === "connect" ? "Creator connected!" : "Application declined");
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
