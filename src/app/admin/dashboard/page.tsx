import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Card } from "@/components/ui";
import { Users, Megaphone, Link2, ShieldAlert, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const supabase = await createClient();

  const [
    { count: totalCreators },
    { count: pendingCreators },
    { count: totalOffers },
    { count: activeKnots },
    { count: completedKnots },
    { count: guaranteeClaims },
  ] = await Promise.all([
    supabase.from("creator_profiles").select("*", { count: "exact", head: true }),
    supabase.from("creator_profiles").select("*", { count: "exact", head: true }).eq("approval_status", "pending"),
    supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("knots").select("*", { count: "exact", head: true }).not("status", "in", "(completed,cancelled)"),
    supabase.from("knots").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase.from("knots").select("*", { count: "exact", head: true }).eq("is_guarantee_redo", true),
  ]);

  const stats = [
    { label: "Total Creators", value: totalCreators ?? 0, icon: Users },
    { label: "Pending Approval", value: pendingCreators ?? 0, icon: Clock },
    { label: "Active Offers", value: totalOffers ?? 0, icon: Megaphone },
    { label: "Active Knots", value: activeKnots ?? 0, icon: Link2 },
    { label: "Completed Knots", value: completedKnots ?? 0, icon: Link2 },
    { label: "Guarantee Claims", value: guaranteeClaims ?? 0, icon: ShieldAlert },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Admin Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Platform statistics at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat) => (
          <Card key={stat.label} className="text-center space-y-1">
            <stat.icon className="h-5 w-5 text-primary mx-auto" />
            <p className="text-2xl font-semibold">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
