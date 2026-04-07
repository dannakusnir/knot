import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Card, Badge, EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { Link2 } from "lucide-react";
import Link from "next/link";
import type { KnotStatus } from "@/types";

export default async function AdminKnotsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: knots } = await supabase
    .from("knots")
    .select("*, offer:offers(title), creator:creator_profiles(profile:profiles(full_name)), business:business_profiles(business_name)")
    .order("created_at", { ascending: false });

  const statusVariant = (status: KnotStatus) => {
    switch (status) {
      case "connected":
      case "in_progress":
        return "default" as const;
      case "proof_submitted":
        return "secondary" as const;
      case "completed":
        return "success" as const;
      case "revision_requested":
        return "destructive" as const;
      case "cancelled":
        return "destructive" as const;
      default:
        return "default" as const;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">All Knots</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of all knots on the platform
        </p>
      </div>

      {!knots || knots.length === 0 ? (
        <EmptyState
          icon={Link2}
          title="No knots yet"
          description="Knots will appear here when creators connect with businesses"
        />
      ) : (
        <div className="space-y-3">
          {knots.map((knot) => (
            <Card key={knot.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {knot.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {knot.creator?.profile?.full_name ?? "Creator"} &rarr;{" "}
                    {knot.business?.business_name ?? "Business"}
                  </p>
                </div>
                <Badge variant={statusVariant(knot.status as KnotStatus)}>
                  {KNOT_STATUSES[knot.status as KnotStatus]}
                </Badge>
              </div>

              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Created {new Date(knot.created_at).toLocaleDateString()}
                </span>
                {knot.is_guarantee_redo && (
                  <Badge variant="destructive">Guarantee</Badge>
                )}
                {knot.admin_assigned && (
                  <Badge variant="secondary">Admin Matched</Badge>
                )}
              </div>

              {knot.admin_notes && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  {knot.admin_notes}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
