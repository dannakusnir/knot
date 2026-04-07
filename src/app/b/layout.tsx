import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import BusinessShell from "@/components/layout/BusinessShell";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return (
    <BusinessShell notificationCount={count ?? 0}>
      {children}
    </BusinessShell>
  );
}
