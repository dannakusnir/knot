import { requireAdmin } from "@/lib/auth";
import { KnotLogo } from "@/components/ui";
import AdminNav from "./AdminNav";
import AdminShell from "./AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <AdminShell>
      <div className="min-h-dvh bg-[color:var(--cream)]">
        <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-[color:var(--cream)]/95 backdrop-blur-sm border-b border-[color:var(--line)]">
          <div className="flex items-center gap-2.5">
            <KnotLogo variant="mark" size="sm" />
            <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase bg-[color:var(--ink)] text-[color:var(--cream)] px-2 py-0.5 rounded-sm">
              Admin
            </span>
          </div>
        </header>
        <AdminNav />
        <main className="px-5 py-6">{children}</main>
      </div>
    </AdminShell>
  );
}
