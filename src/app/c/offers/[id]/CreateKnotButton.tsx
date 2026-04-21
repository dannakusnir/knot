"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Textarea } from "@/components/ui";
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
      toast("error", "You need to be signed in to apply.");
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
      toast("error", "Couldn't send your application. Try again.");
      setLoading(false);
      return;
    }

    setCelebrate(true);
    setTimeout(() => router.refresh(), 1800);
  }

  if (hasApplied) {
    const label =
      APPLICATION_STATUSES[(applicationStatus ?? "pending") as ApplicationStatus];
    return (
      <div className="rounded-[18px] bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] px-5 py-4 text-center">
        <p className="font-serif italic text-[16px] text-[color:var(--ink)]">
          You&apos;ve applied.
        </p>
        <p className="mt-1 font-mono text-[9.5px] font-bold tracking-[0.22em] uppercase text-[color:var(--sage-deep)]">
          {label}
        </p>
      </div>
    );
  }

  if (!showForm) {
    return (
      <>
        <Celebration
          trigger={celebrate}
          title="On its way."
          subtitle="Fingers crossed."
        />
        <Button
          onClick={() => setShowForm(true)}
          className="w-full"
          size="lg"
        >
          Apply for this knot
        </Button>
      </>
    );
  }

  return (
    <>
      <Celebration
        trigger={celebrate}
        title="On its way."
        subtitle="Fingers crossed."
      />
      <div className="rounded-[18px] bg-[color:var(--surface)] border border-[color:var(--line)] p-4 space-y-4">
        <div>
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
            WHY YOU
          </span>
          <p className="mt-1 font-serif italic text-[15px] text-[color:var(--ink-mid)] leading-[1.5]">
            A line or two is plenty. Skip if you&apos;d rather.
          </p>
        </div>
        <Textarea
          placeholder="I cook dinner here every Friday. I'd love to tell this story."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setShowForm(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            loading={loading}
            className="flex-1"
          >
            Send
          </Button>
        </div>
      </div>
    </>
  );
}
