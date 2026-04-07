import { requireAdmin } from "@/lib/auth";
import { KnotLogo } from "@/components/ui";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-2">
          <KnotLogo size="sm" />
          <span className="text-xs font-medium bg-foreground text-background px-2 py-0.5 rounded">
            Admin
          </span>
        </div>
      </header>
      <AdminNav />
      <main className="px-4 py-6">{children}</main>
    </div>
  );
}
