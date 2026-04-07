import { requireRole } from "@/lib/auth";
import CreatorShell from "@/components/layout/CreatorShell";

export default async function CreatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("creator");

  return <CreatorShell>{children}</CreatorShell>;
}
