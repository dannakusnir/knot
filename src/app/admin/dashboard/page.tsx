import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";

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
    supabase
      .from("creator_profiles")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "pending"),
    supabase.from("offers").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase
      .from("knots")
      .select("*", { count: "exact", head: true })
      .not("status", "in", "(completed,cancelled)"),
    supabase.from("knots").select("*", { count: "exact", head: true }).eq("status", "completed"),
    supabase
      .from("knots")
      .select("*", { count: "exact", head: true })
      .eq("is_guarantee_redo", true),
  ]);

  const stats = [
    { label: "CREATORS", value: totalCreators ?? 0, tone: "sage" },
    { label: "PENDING", value: pendingCreators ?? 0, tone: "clay" },
    { label: "ACTIVE OFFERS", value: totalOffers ?? 0, tone: "sand" },
    { label: "KNOTS IN FLIGHT", value: activeKnots ?? 0, tone: "peach" },
    { label: "COMPLETED", value: completedKnots ?? 0, tone: "sage" },
    { label: "GUARANTEE CLAIMS", value: guaranteeClaims ?? 0, tone: "clay" },
  ];

  const toneClasses: Record<string, { bg: string; fg: string }> = {
    sage: { bg: "var(--sage-tint)", fg: "var(--sage-deep)" },
    clay: { bg: "var(--clay-soft)", fg: "var(--clay-deep)" },
    sand: { bg: "var(--sand)", fg: "var(--sand-ink)" },
    peach: { bg: "var(--peach)", fg: "var(--peach-ink)" },
  };

  return (
    <div>
      <div className="mb-6">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          OVERVIEW
        </span>
        <h1 className="mt-2 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          The board.
        </h1>
        <p className="mt-1.5 font-serif italic text-[14px] text-[color:var(--ink-soft)]">
          Platform at a glance.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {stats.map((stat) => {
          const t = toneClasses[stat.tone];
          return (
            <div
              key={stat.label}
              className="rounded-[14px] border border-[color:var(--line-soft)] px-4 py-4"
              style={{ background: t.bg }}
            >
              <div
                className="font-mono text-[8.5px] font-bold tracking-[0.18em]"
                style={{ color: t.fg }}
              >
                {stat.label}
              </div>
              <p
                className="font-serif text-[32px] font-medium mt-1 leading-none"
                style={{ color: "var(--ink)" }}
              >
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
