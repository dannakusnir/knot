"use client";

import BottomNav from "./BottomNav";
import Header from "./Header";
import { ToastProvider } from "@/components/ui/Toast";
import { LayoutDashboard, Megaphone, Link2, User } from "lucide-react";

const businessTabs = [
  { label: "Dashboard", href: "/b/dashboard", icon: LayoutDashboard },
  { label: "My Offers", href: "/b/offers", icon: Megaphone },
  { label: "Knots", href: "/b/knots", icon: Link2 },
  { label: "Profile", href: "/b/profile", icon: User },
];

interface BusinessShellProps {
  children: React.ReactNode;
  notificationCount?: number;
}

export default function BusinessShell({
  children,
  notificationCount = 0,
}: BusinessShellProps) {
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-background">
        <Header
          notificationCount={notificationCount}
          notificationHref="/b/notifications"
        />
        <main className="pb-20">{children}</main>
        <BottomNav tabs={businessTabs} />
      </div>
    </ToastProvider>
  );
}
