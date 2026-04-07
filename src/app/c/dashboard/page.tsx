import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, EmptyState, Avatar } from "@/components/ui";
import { KNOT_STATUSES, APPLICATION_STATUSES } from "@/lib/constants";
import { Link2, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";
import type { KnotStatus, ApplicationStatus } from "@/types";

export default async function CreatorDashboardPage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  // Fetch active knots
  const { data: knots } = await supabase
    .from("knots")
    .select("*, offer:offers(title, business_id), business:business_profiles(business_name, logo_url)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

  // Fetch pending applications
  const { data: applications } = await supabase
    .from("applications")
    .select("*, offer:offers(title, business_id, business:business_profiles(business_name, logo_url))")
    .eq("creator_id", user.id)
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  const activeKnots = knots?.filter((k) => !["completed", "cancelled"].includes(k.status)) ?? [];
  const completedKnots = knots?.filter((k) => k.status === "completed") ?? [];

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
      default:
        return "default" as const;
    }
  };

  return (
    <div className="px-4 py-6 space-y-8">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Your Knots</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your active collaborations
        </p>
      </div>

      {/* Pending Applications */}
      {applications && applications.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Pending ({applications.length})
          </h2>
          {applications.map((app) => (
            <Link key={app.id} href={`/c/offers/${app.offer_id}`}>
              <Card className="flex items-center gap-3">
                <Avatar
                  src={app.offer?.business?.logo_url}
                  name={app.offer?.business?.business_name ?? ""}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {app.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {app.offer?.business?.business_name}
                  </p>
                </div>
                <Badge variant="secondary">
                  {APPLICATION_STATUSES[app.status as ApplicationStatus]}
                </Badge>
              </Card>
            </Link>
          ))}
        </section>
      )}

      {/* Active Knots */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Link2 className="h-4 w-4" />
          Active ({activeKnots.length})
        </h2>
        {activeKnots.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No active knots"
            description="Browse offers and create your first knot!"
          />
        ) : (
          activeKnots.map((knot) => (
            <Link key={knot.id} href={`/c/knots/${knot.id}`}>
              <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                <Avatar
                  src={knot.business?.logo_url}
                  name={knot.business?.business_name ?? ""}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {knot.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {knot.business?.business_name}
                  </p>
                </div>
                <Badge variant={statusVariant(knot.status)}>
                  {KNOT_STATUSES[knot.status as KnotStatus]}
                </Badge>
              </Card>
            </Link>
          ))
        )}
      </section>

      {/* Completed Knots */}
      {completedKnots.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Completed ({completedKnots.length})
          </h2>
          {completedKnots.map((knot) => (
            <Link key={knot.id} href={`/c/knots/${knot.id}`}>
              <Card className="flex items-center gap-3 opacity-75">
                <Avatar
                  src={knot.business?.logo_url}
                  name={knot.business?.business_name ?? ""}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {knot.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {knot.business?.business_name}
                  </p>
                </div>
                <Badge variant="success">Completed</Badge>
              </Card>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
