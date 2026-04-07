"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Card, Textarea, Badge } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import Celebration from "@/components/ui/Celebration";
import { APPLICATION_STATUSES } from "@/lib/constants";
import type { ApplicationStatus } from "@/types";

interface CreateKnotButtonProps {
  offerId: string;
  hasApplied: boolean;
  applicationStatus: string | null;
}

export default function CreateKnotButton({
  offerId,
  hasApplied,
  applicationStatus,
}: CreateKnotButtonProps) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  async function handleApply() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      toast("error", "You must be logged in to apply");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("applications").insert({
      offer_id: offerId,
      creator_id: user.id,
      message: message || null,
      status: "pending",
    });

    if (error) {
      toast("error", "Failed to submit application");
      setLoading(false);
      return;
    }

    setCelebrate(true);
    setTimeout(() => router.refresh(), 2500);
  }

  if (hasApplied) {
    return (
      <Card className="text-center space-y-2">
        <p className="text-sm font-medium">You&apos;ve already applied</p>
        <Badge variant="secondary">
          {APPLICATION_STATUSES[(applicationStatus ?? "pending") as ApplicationStatus]}
        </Badge>
      </Card>
    );
  }

  if (!showForm) {
    return (
      <>
        <Celebration
          trigger={celebrate}
          title="Application Sent!"
          subtitle="Fingers crossed 🤞"
          emoji="🚀"
        />
        <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
          Create Knot
        </Button>
      </>
    );
  }

  return (
    <>
    <Celebration
      trigger={celebrate}
      title="Application Sent!"
      subtitle="Fingers crossed 🤞"
      emoji="🚀"
    />
    <Card className="space-y-4">
      <h3 className="text-sm font-medium">Create Knot</h3>
      <Textarea
        label="Message (optional)"
        placeholder="Tell the business why you're a great fit..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={3}
      />
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => setShowForm(false)}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button onClick={handleApply} loading={loading} className="flex-1">
          Send Application
        </Button>
      </div>
    </Card>
    </>
  );
}
