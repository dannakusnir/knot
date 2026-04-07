import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { notFound } from "next/navigation";
import KnotTimeline from "@/components/knots/KnotTimeline";
import ProofUpload from "@/components/knots/ProofUpload";
import type { KnotStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CreatorKnotDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: knot } = await supabase
    .from("knots")
    .select("*, offer:offers(title, description, deliverables, compensation, address), business:business_profiles(business_name, logo_url, city)")
    .eq("id", id)
    .eq("creator_id", user.id)
    .single();

  if (!knot) notFound();

  const canUploadProof = ["connected", "in_progress", "revision_requested"].includes(knot.status);

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar
            src={knot.business?.logo_url}
            name={knot.business?.business_name ?? "Business"}
            size="md"
          />
          <div className="flex-1">
            <h1 className="text-lg font-serif font-semibold">
              {knot.offer?.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {knot.business?.business_name}
            </p>
          </div>
          <Badge>
            {KNOT_STATUSES[knot.status as KnotStatus]}
          </Badge>
        </div>

        <KnotTimeline status={knot.status as KnotStatus} />
      </Card>

      {/* Offer details */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium">Deliverables</h2>
        <p className="text-sm text-muted-foreground">{knot.offer?.deliverables}</p>

        {knot.offer?.compensation && (
          <>
            <h2 className="text-sm font-medium">Compensation</h2>
            <p className="text-sm text-muted-foreground">{knot.offer.compensation}</p>
          </>
        )}

        {knot.offer?.address && (
          <>
            <h2 className="text-sm font-medium">Location</h2>
            <p className="text-sm text-muted-foreground">{knot.offer.address}</p>
          </>
        )}

        {knot.deadline && (
          <>
            <h2 className="text-sm font-medium">Deadline</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(knot.deadline).toLocaleDateString()}
            </p>
          </>
        )}
      </Card>

      {/* Revision notes */}
      {knot.status === "revision_requested" && knot.admin_notes && (
        <Card className="border-destructive/30 bg-destructive/5 space-y-2">
          <h2 className="text-sm font-medium text-destructive">Revision Requested</h2>
          <p className="text-sm text-muted-foreground">{knot.admin_notes}</p>
        </Card>
      )}

      {/* Existing proof */}
      {knot.proof_urls && knot.proof_urls.length > 0 && (
        <Card className="space-y-2">
          <h2 className="text-sm font-medium">Submitted Proof</h2>
          <ul className="space-y-1">
            {knot.proof_urls.map((url: string, i: number) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-hover underline break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
          {knot.proof_notes && (
            <p className="text-sm text-muted-foreground">{knot.proof_notes}</p>
          )}
        </Card>
      )}

      {/* Upload proof */}
      {canUploadProof && (
        <ProofUpload knotId={knot.id} existingProofs={knot.proof_urls ?? []} />
      )}
    </div>
  );
}
