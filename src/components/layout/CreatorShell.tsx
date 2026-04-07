"use client";

import BottomNav from "./BottomNav";
import Header from "./Header";
import { Compass, MapPin, Link2, User } from "lucide-react";

const creatorTabs = [
  { label: "Explore", href: "/c/explore", icon: Compass },
  { label: "Map", href: "/c/map", icon: MapPin },
  { label: "My Knots", href: "/c/dashboard", icon: Link2 },
  { label: "Profile", href: "/c/profile", icon: User },
];

export default function CreatorShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-dvh bg-background">
      <Header />
      <main className="pb-20">{children}</main>
      <BottomNav tabs={creatorTabs} />
    </div>
  );
}
