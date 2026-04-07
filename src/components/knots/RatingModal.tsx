"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Modal, StarRating, Textarea } from "@/components/ui";

interface RatingModalProps {
  open: boolean;
  onClose: () => void;
  knotId: string;
  ratedId: string;
  ratedName: string;
}

export default function RatingModal({
  open,
  onClose,
  knotId,
  ratedId,
  ratedName,
}: RatingModalProps) {
  const [score, setScore] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (score === 0) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("ratings").insert({
      knot_id: knotId,
      rater_id: user.id,
      rated_id: ratedId,
      score,
      comment: comment || null,
    });

    if (error) {
      setLoading(false);
      return;
    }

    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Rate ${ratedName}`}>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          How was your experience working with {ratedName}?
        </p>

        <div className="flex justify-center py-2">
          <StarRating value={score} onChange={setScore} size="lg" />
        </div>

        <Textarea
          label="Comment (optional)"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />

        <Button
          onClick={handleSubmit}
          loading={loading}
          disabled={score === 0}
          className="w-full"
          size="lg"
        >
          Submit Rating
        </Button>
      </div>
    </Modal>
  );
}
