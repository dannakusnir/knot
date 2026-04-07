"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea, Card } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import { Upload, Link as LinkIcon, X } from "lucide-react";

interface ProofUploadProps {
  knotId: string;
  existingProofs: string[];
}

export default function ProofUpload({
  knotId,
  existingProofs,
}: ProofUploadProps) {
  const [proofLinks, setProofLinks] = useState<string[]>(
    existingProofs.length > 0 ? existingProofs : [""]
  );
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  function addLink() {
    setProofLinks((prev) => [...prev, ""]);
  }

  function updateLink(index: number, value: string) {
    setProofLinks((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function removeLink(index: number) {
    setProofLinks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit() {
    const validLinks = proofLinks.filter(Boolean);
    if (validLinks.length === 0) {
      toast("error", "Add at least one proof link");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("knots")
      .update({
        proof_urls: validLinks,
        proof_notes: notes || null,
        status: "proof_submitted",
      })
      .eq("id", knotId);

    if (error) {
      toast("error", "Failed to submit proof");
      setLoading(false);
      return;
    }

    toast("success", "Proof submitted!");
    router.refresh();
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Upload className="h-4 w-4 text-primary" />
        Upload Proof
      </div>

      <p className="text-xs text-muted-foreground">
        Add links to your content (Instagram posts, Reels, TikToks, or Google
        Drive links for raw files)
      </p>

      <div className="space-y-2">
        {proofLinks.map((link, i) => (
          <div key={i} className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="https://instagram.com/p/..."
                value={link}
                onChange={(e) => updateLink(i, e.target.value)}
              />
            </div>
            {proofLinks.length > 1 && (
              <button
                type="button"
                onClick={() => removeLink(i)}
                className="rounded-lg p-2 hover:bg-muted"
              >
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="text-sm text-primary font-medium flex items-center gap-1"
      >
        <LinkIcon className="h-3.5 w-3.5" />
        Add another link
      </button>

      <Textarea
        label="Notes (optional)"
        placeholder="Any additional details about the content..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
      />

      <Button
        onClick={handleSubmit}
        loading={loading}
        className="w-full"
        size="lg"
      >
        Complete your Knot
      </Button>
    </Card>
  );
}
