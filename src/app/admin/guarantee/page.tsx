import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { ShieldAlert, Shield } from "lucide-react";
import type { KnotStatus } from "@/types";

export default async function AdminGuaranteePage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: guaranteeKnots } = await supabase
    .from("knots")
    .select("*, offer:offers(title), creator:creator_profiles(profile:profiles(full_name, avatar_url)), business:business_profiles(business_name, logo_url, guarantee_credits)")
    .eq("is_guarantee_redo", true)
    .order("created_at", { ascending: false });

  // Also get businesses with low-rated completed knots that might need guarantee
  const { data: lowRatedKnots } = await supabase
    .from("knots")
    .select("*, offer:offers(title), creator:creator_profiles(profile:profiles(full_name)), business:business_profiles(business_name, guarantee_credits), ratings:ratings(score)")
    .eq("status", "completed")
    .eq("is_guarantee_redo", false)
    .order("completed_at", { ascending: false })
    .limit(20);

  const knotsNeedingGuarantee = lowRatedKnots?.filter((knot) => {
    const ratings = knot.ratings as { score: number }[];
    return ratings?.some((r) => r.score <= 2);
  }) ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Guarantee Claims</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage guarantee redo assignments
        </p>
      </div>

      {/* Active guarantee redos */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <ShieldAlert className="h-4 w-4" />
          Active Guarantee Redos ({guaranteeKnots?.length ?? 0})
        </h2>

        {!guaranteeKnots || guaranteeKnots.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="No guarantee claims"
            description="No active guarantee redo knots at this time"
          />
        ) : (
          guaranteeKnots.map((knot) => (
            <Card key={knot.id} className="space-y-2">
              <div className="flex items-start gap-3">
                <Avatar
                  src={knot.business?.logo_url}
                  name={knot.business?.business_name ?? "Business"}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {knot.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {knot.business?.business_name} &rarr;{" "}
                    {knot.creator?.profile?.full_name ?? "Creator"}
                  </p>
                </div>
                <Badge variant={knot.status === "completed" ? "success" : "destructive"}>
                  {KNOT_STATUSES[knot.status as KnotStatus]}
                </Badge>
              </div>
              {knot.admin_notes && (
                <p className="text-xs text-muted-foreground bg-muted/50 rounded p-2">
                  {knot.admin_notes}
                </p>
              )}
            </Card>
          ))
        )}
      </section>

      {/* Potential guarantee needs */}
      {knotsNeedingGuarantee.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Potential Guarantee Claims ({knotsNeedingGuarantee.length})
          </h2>
          <p className="text-xs text-muted-foreground">
            Completed knots with low ratings that may need a guarantee redo
          </p>
          {knotsNeedingGuarantee.map((knot) => (
            <Card key={knot.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">
                    {knot.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {knot.business?.business_name} &rarr;{" "}
                    {knot.creator?.profile?.full_name ?? "Creator"}
                  </p>
                </div>
                <Badge variant="destructive">Low Rating</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Business has {knot.business?.guarantee_credits ?? 0} guarantee
                credits remaining
              </p>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
