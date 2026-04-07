import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { notFound } from "next/navigation";
import KnotTimeline from "@/components/knots/KnotTimeline";
import BusinessKnotActions from "./BusinessKnotActions";
import type { KnotStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BusinessKnotDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: knot } = await supabase
    .from("knots")
    .select("*, offer:offers(title, description, deliverables), creator:creator_profiles(id, instagram_handle, profile:profiles(full_name, avatar_url))")
    .eq("id", id)
    .eq("business_id", user.id)
    .single();

  if (!knot) notFound();

  const canReview = knot.status === "proof_submitted";

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Header */}
      <Card className="space-y-3">
        <div className="flex items-start gap-3">
          <Avatar
            src={knot.creator?.profile?.avatar_url}
            name={knot.creator?.profile?.full_name ?? "Creator"}
            size="md"
          />
          <div className="flex-1">
            <h1 className="text-lg font-serif font-semibold">
              {knot.offer?.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {knot.creator?.profile?.full_name}
              {knot.creator?.instagram_handle
                ? ` (@${knot.creator.instagram_handle})`
                : ""}
            </p>
          </div>
          <Badge>
            {KNOT_STATUSES[knot.status as KnotStatus]}
          </Badge>
        </div>

        <KnotTimeline status={knot.status as KnotStatus} />
      </Card>

      {/* Deliverables */}
      <Card className="space-y-2">
        <h2 className="text-sm font-medium">Deliverables</h2>
        <p className="text-sm text-muted-foreground">{knot.offer?.deliverables}</p>
      </Card>

      {/* Submitted proof */}
      {knot.proof_urls && knot.proof_urls.length > 0 && (
        <Card className="space-y-3">
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
            <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              {knot.proof_notes}
            </p>
          )}
        </Card>
      )}

      {/* Actions */}
      {canReview && (
        <BusinessKnotActions
          knotId={knot.id}
          creatorId={knot.creator_id}
          creatorName={knot.creator?.profile?.full_name ?? "Creator"}
        />
      )}
    </div>
  );
}
