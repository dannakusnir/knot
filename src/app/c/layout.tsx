import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import CreatorShell from "@/components/layout/CreatorShell";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { count } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("read", false);

  return (
    <CreatorShell notificationCount={count ?? 0}>
      {children}
    </CreatorShell>
  );
}
