import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Badge, EmptyState, Avatar } from "@/components/ui";
import { KNOT_STATUSES, APPLICATION_STATUSES } from "@/lib/constants";
import { Link2, Clock, CheckCircle, Compass } from "lucide-react";
import Link from "next/link";
import type { KnotStatus, ApplicationStatus } from "@/types";

export default async function CreatorDashboardPage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("total_knots, avg_rating, completion_rate, trust_score, verified")
    .eq("id", user.id)
    .single();

  const { data: knots } = await supabase
    .from("knots")
    .select("*, offer:offers(title, business_id), business:business_profiles(business_name, logo_url)")
    .eq("creator_id", user.id)
    .order("created_at", { ascending: false });

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
    <div className="min-h-dvh bg-[#EDE8E2]">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
          Your Knots
        </h1>
        <p className="text-base text-[#8A8078] mt-1">
          Track your collaborations
        </p>
      </div>

      <div className="px-4 pb-24 space-y-5">
        {/* Quick stats */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl bg-[#7FC8A9]/12 p-4 text-center">
            <p className="text-2xl font-semibold text-[#3D3229]">{creatorProfile?.total_knots ?? 0}</p>
            <p className="text-xs text-[#5BA88A] font-medium mt-0.5">Knots</p>
          </div>
          <div className="flex-1 rounded-2xl bg-[#DDBEA9]/20 p-4 text-center">
            <p className="text-2xl font-semibold text-[#3D3229]">
              {creatorProfile?.avg_rating ? creatorProfile.avg_rating.toFixed(1) : "--"}
            </p>
            <p className="text-xs text-[#CB997E] font-medium mt-0.5">Rating</p>
          </div>
          <div className="flex-1 rounded-2xl bg-[#A5A58D]/12 p-4 text-center">
            <p className="text-2xl font-semibold text-[#3D3229]">
              {creatorProfile?.completion_rate ? `${Math.round(creatorProfile.completion_rate * 100)}%` : "--"}
            </p>
            <p className="text-xs text-[#6B705C] font-medium mt-0.5">Complete</p>
          </div>
        </div>

        {/* Pending Applications */}
        {applications && applications.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#CB997E] uppercase tracking-[0.15em] font-semibold px-1 flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Pending ({applications.length})
            </p>
            {applications.map((app) => (
              <Link key={app.id} href={`/c/offers/${app.offer_id}`}>
                <div className="rounded-2xl bg-white px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
                  <Avatar
                    src={app.offer?.business?.logo_url}
                    name={app.offer?.business?.business_name ?? ""}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#3D3229] truncate">
                      {app.offer?.title}
                    </p>
                    <p className="text-sm text-[#8A8078]">
                      {app.offer?.business?.business_name}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {APPLICATION_STATUSES[app.status as ApplicationStatus]}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Active Knots */}
        <div className="space-y-2">
          <p className="text-[11px] text-[#6B705C] uppercase tracking-[0.15em] font-semibold px-1 flex items-center gap-1.5">
            <Link2 className="h-3.5 w-3.5" />
            Active ({activeKnots.length})
          </p>
          {activeKnots.length === 0 ? (
            <EmptyState
              icon={Compass}
              title="No active knots"
              description="Browse offers and create your first knot!"
            />
          ) : (
            activeKnots.map((knot) => (
              <Link key={knot.id} href={`/c/knots/${knot.id}`}>
                <div className="rounded-2xl bg-white px-4 py-3.5 flex items-center gap-3 active:scale-[0.98] transition-transform">
                  <Avatar
                    src={knot.business?.logo_url}
                    name={knot.business?.business_name ?? ""}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#3D3229] truncate">
                      {knot.offer?.title}
                    </p>
                    <p className="text-sm text-[#8A8078]">
                      {knot.business?.business_name}
                    </p>
                  </div>
                  <Badge variant={statusVariant(knot.status)}>
                    {KNOT_STATUSES[knot.status as KnotStatus]}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </div>

        {/* Completed Knots */}
        {completedKnots.length > 0 && (
          <div className="space-y-2">
            <p className="text-[11px] text-[#7FC8A9] uppercase tracking-[0.15em] font-semibold px-1 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              Completed ({completedKnots.length})
            </p>
            {completedKnots.map((knot) => (
              <Link key={knot.id} href={`/c/knots/${knot.id}`}>
                <div className="rounded-2xl bg-white/70 px-4 py-3.5 flex items-center gap-3">
                  <Avatar
                    src={knot.business?.logo_url}
                    name={knot.business?.business_name ?? ""}
                    size="sm"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#3D3229] truncate">
                      {knot.offer?.title}
                    </p>
                    <p className="text-sm text-[#8A8078]">
                      {knot.business?.business_name}
                    </p>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
