import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { Megaphone, Link2, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import type { KnotStatus } from "@/types";

export default async function BusinessDashboardPage() {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Active offers count
  const { count: activeOffersCount } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true })
    .eq("business_id", user.id)
    .eq("status", "active");

  // Pending applications count
  const { count: pendingAppsCount } = await supabase
    .from("applications")
    .select("*, offer:offers!inner(business_id)", { count: "exact", head: true })
    .eq("offer.business_id", user.id)
    .eq("status", "pending");

  // Active knots
  const { data: activeKnots } = await supabase
    .from("knots")
    .select("*, offer:offers(title), creator:creator_profiles(id, profile:profiles(full_name, avatar_url))")
    .eq("business_id", user.id)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {businessProfile?.business_name ?? "Your business"} overview
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center space-y-1">
          <Megaphone className="h-5 w-5 text-primary mx-auto" />
          <p className="text-2xl font-semibold">{activeOffersCount ?? 0}</p>
          <p className="text-xs text-muted-foreground">Active Offers</p>
        </Card>
        <Card className="text-center space-y-1">
          <Link2 className="h-5 w-5 text-primary mx-auto" />
          <p className="text-2xl font-semibold">{pendingAppsCount ?? 0}</p>
          <p className="text-xs text-muted-foreground">Pending Applications</p>
        </Card>
        <Card className="text-center space-y-1">
          <TrendingUp className="h-5 w-5 text-primary mx-auto" />
          <p className="text-2xl font-semibold">{businessProfile?.total_knots ?? 0}</p>
          <p className="text-xs text-muted-foreground">Total Knots</p>
        </Card>
        <Card className="text-center space-y-1">
          <Star className="h-5 w-5 text-primary mx-auto" />
          <p className="text-2xl font-semibold">
            {businessProfile?.avg_rating
              ? businessProfile.avg_rating.toFixed(1)
              : "--"}
          </p>
          <p className="text-xs text-muted-foreground">Avg Rating</p>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link href="/b/offers/new" className="flex-1">
          <Card className="text-center py-4 active:scale-[0.98] transition-transform">
            <p className="text-sm font-medium text-primary">+ New Offer</p>
          </Card>
        </Link>
        <Link href="/b/offers" className="flex-1">
          <Card className="text-center py-4 active:scale-[0.98] transition-transform">
            <p className="text-sm font-medium">My Offers</p>
          </Card>
        </Link>
      </div>

      {/* Active knots */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">Active Knots</h2>
        {!activeKnots || activeKnots.length === 0 ? (
          <EmptyState
            icon={Link2}
            title="No active knots"
            description="Create an offer to start connecting with creators"
          />
        ) : (
          activeKnots.map((knot) => (
            <Link key={knot.id} href={`/b/knots/${knot.id}`}>
              <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {knot.offer?.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {knot.creator?.profile?.full_name ?? "Creator"}
                  </p>
                </div>
                <Badge>
                  {KNOT_STATUSES[knot.status as KnotStatus]}
                </Badge>
              </Card>
            </Link>
          ))
        )}
      </section>
    </div>
  );
}
