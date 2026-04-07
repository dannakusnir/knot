import { requireRole } from "@/lib/auth";
import BusinessShell from "@/components/layout/BusinessShell";

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireRole("business");

  return <BusinessShell>{children}</BusinessShell>;
}
