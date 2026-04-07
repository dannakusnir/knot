"use client";

import BottomNav from "./BottomNav";
import Header from "./Header";
import { LayoutDashboard, Megaphone, Link2, User } from "lucide-react";

const businessTabs = [
  { label: "Dashboard", href: "/b/dashboard", icon: LayoutDashboard },
  { label: "My Offers", href: "/b/offers", icon: Megaphone },
  { label: "Knots", href: "/b/knots", icon: Link2 },
  { label: "Profile", href: "/b/profile", icon: User },
];

export default function BusinessShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="pb-20">{children}</main>
      <BottomNav tabs={businessTabs} />
    </div>
  );
}
