import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, EmptyState } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { Megaphone, Link2, Star, TrendingUp, Plus, ArrowRight } from "lucide-react";
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

  const { count: activeOffersCount } = await supabase
    .from("offers")
    .select("*", { count: "exact", head: true })
    .eq("business_id", user.id)
    .eq("status", "active");

  const { count: pendingAppsCount } = await supabase
    .from("applications")
    .select("*, offer:offers!inner(business_id)", { count: "exact", head: true })
    .eq("offer.business_id", user.id)
    .eq("status", "pending");

  const { data: activeKnots } = await supabase
    .from("knots")
    .select("*, offer:offers(title), creator:creator_profiles(id, profile:profiles(full_name, avatar_url))")
    .eq("business_id", user.id)
    .not("status", "in", "(completed,cancelled)")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="min-h-dvh bg-[#EDE8E2]">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
          {businessProfile?.business_name ?? "Dashboard"}
        </h1>
        <p className="text-base text-[#8A8078] mt-1">
          Here&apos;s what&apos;s happening
        </p>
      </div>

      <div className="px-4 pb-24 space-y-4">
        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-[#A5A58D]/15 p-4 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#A5A58D]/20 flex items-center justify-center">
              <Megaphone className="h-4 w-4 text-[#6B705C]" />
            </div>
            <p className="text-3xl font-semibold text-[#3D3229]">{activeOffersCount ?? 0}</p>
            <p className="text-sm text-[#6B705C] font-medium">Active Offers</p>
          </div>
          <div className="rounded-2xl bg-[#CB997E]/12 p-4 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#CB997E]/20 flex items-center justify-center">
              <Link2 className="h-4 w-4 text-[#CB997E]" />
            </div>
            <p className="text-3xl font-semibold text-[#3D3229]">{pendingAppsCount ?? 0}</p>
            <p className="text-sm text-[#CB997E] font-medium">Pending Apps</p>
          </div>
          <div className="rounded-2xl bg-[#7FC8A9]/12 p-4 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#7FC8A9]/20 flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-[#5BA88A]" />
            </div>
            <p className="text-3xl font-semibold text-[#3D3229]">{businessProfile?.total_knots ?? 0}</p>
            <p className="text-sm text-[#5BA88A] font-medium">Total Knots</p>
          </div>
          <div className="rounded-2xl bg-[#DDBEA9]/20 p-4 space-y-2">
            <div className="w-9 h-9 rounded-full bg-[#DDBEA9]/30 flex items-center justify-center">
              <Star className="h-4 w-4 text-[#CB997E]" />
            </div>
            <p className="text-3xl font-semibold text-[#3D3229]">
              {businessProfile?.avg_rating
                ? businessProfile.avg_rating.toFixed(1)
                : "--"}
            </p>
            <p className="text-sm text-[#CB997E] font-medium">Avg Rating</p>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex gap-3">
          <Link href="/b/offers/new" className="flex-1">
            <div className="rounded-2xl bg-[#6B705C] px-5 py-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Plus className="h-4 w-4 text-white" />
              </div>
              <span className="text-[15px] font-semibold text-white">New Offer</span>
            </div>
          </Link>
          <Link href="/b/offers" className="flex-1">
            <div className="rounded-2xl bg-white px-5 py-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <span className="text-[15px] font-semibold text-[#3D3229] flex-1">My Offers</span>
              <ArrowRight className="h-4 w-4 text-[#C4BBB2]" />
            </div>
          </Link>
        </div>

        {/* Active knots */}
        <div className="space-y-3">
          <p className="text-[11px] text-[#8A8078] uppercase tracking-[0.15em] font-semibold px-1">
            Active Knots
          </p>
          {!activeKnots || activeKnots.length === 0 ? (
            <EmptyState
              icon={Link2}
              title="No active knots"
              description="Create an offer to start connecting with creators"
            />
          ) : (
            activeKnots.map((knot) => (
              <Link key={knot.id} href={`/b/knots/${knot.id}`}>
                <div className="rounded-2xl bg-white px-4 py-4 flex items-center gap-3 active:scale-[0.98] transition-transform">
                  <div className="w-10 h-10 rounded-full bg-[#A5A58D]/15 flex items-center justify-center shrink-0">
                    <Link2 className="h-4 w-4 text-[#A5A58D]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-[#3D3229] truncate">
                      {knot.offer?.title}
                    </p>
                    <p className="text-sm text-[#8A8078]">
                      {knot.creator?.profile?.full_name ?? "Creator"}
                    </p>
                  </div>
                  <Badge>
                    {KNOT_STATUSES[knot.status as KnotStatus]}
                  </Badge>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
