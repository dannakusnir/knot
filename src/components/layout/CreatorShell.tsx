"use client";

import BottomNav from "./BottomNav";
import Header from "./Header";
import { ToastProvider } from "@/components/ui/Toast";
import { Compass, MapPin, Link2, User } from "lucide-react";

const creatorTabs = [
  { label: "Explore", href: "/c/explore", icon: Compass },
  { label: "Map", href: "/c/map", icon: MapPin },
  { label: "My Knots", href: "/c/dashboard", icon: Link2 },
  { label: "Profile", href: "/c/profile", icon: User },
];

interface CreatorShellProps {
  children: React.ReactNode;
  notificationCount?: number;
}

export default function CreatorShell({
  children,
  notificationCount = 0,
}: CreatorShellProps) {
  return (
    <ToastProvider>
      <div className="min-h-dvh bg-background">
        <Header
          notificationCount={notificationCount}
          notificationHref="/c/notifications"
        />
        <main className="pb-20">{children}</main>
        <BottomNav tabs={creatorTabs} />
      </div>
    </ToastProvider>
  );
}
