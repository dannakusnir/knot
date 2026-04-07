"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Card, Textarea } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import RatingModal from "@/components/knots/RatingModal";
import Celebration from "@/components/ui/Celebration";

interface BusinessKnotActionsProps {
  knotId: string;
  creatorId: string;
  creatorName: string;
}

export default function BusinessKnotActions({
  knotId,
  creatorId,
  creatorName,
}: BusinessKnotActionsProps) {
  const [loading, setLoading] = useState<"approve" | "revise" | null>(null);
  const [showRevisionForm, setShowRevisionForm] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [showRating, setShowRating] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  async function handleApprove() {
    setLoading("approve");

    const { error } = await supabase
      .from("knots")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", knotId);

    if (error) {
      toast("error", "Failed to approve knot");
      setLoading(null);
      return;
    }

    setCelebrate(true);
    setTimeout(() => setShowRating(true), 2000);
  }

  async function handleRequestRevision() {
    if (!revisionNotes.trim()) return;
    setLoading("revise");

    const { error } = await supabase
      .from("knots")
      .update({
        status: "revision_requested",
        admin_notes: revisionNotes,
      })
      .eq("id", knotId);

    if (error) {
      toast("error", "Failed to send revision request");
      setLoading(null);
      return;
    }

    toast("success", "Revision request sent");
    router.refresh();
  }

  return (
    <>
      <Celebration
        trigger={celebrate}
        title="Knot Complete!"
        subtitle={`Great collab with ${creatorName}!`}
        emoji="🎉"
      />
      <Card className="space-y-4">
        <h2 className="text-sm font-medium">Review Proof</h2>

        {showRevisionForm ? (
          <div className="space-y-3">
            <Textarea
              label="Revision Notes"
              placeholder="Describe what needs to be changed..."
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowRevisionForm(false)}
                className="flex-1"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleRequestRevision}
                loading={loading === "revise"}
                className="flex-1"
                size="sm"
              >
                Send Revision Request
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleApprove}
              loading={loading === "approve"}
              disabled={loading !== null}
              className="flex-1"
            >
              Approve Knot
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowRevisionForm(true)}
              disabled={loading !== null}
              className="flex-1"
            >
              Request Revision
            </Button>
          </div>
        )}
      </Card>

      <RatingModal
        open={showRating}
        onClose={() => {
          setShowRating(false);
          router.refresh();
        }}
        knotId={knotId}
        ratedId={creatorId}
        ratedName={creatorName}
      />
    </>
  );
}
