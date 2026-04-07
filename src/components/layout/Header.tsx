"use client";

import { KnotLogo } from "@/components/ui";
import { Bell } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  notificationCount?: number;
}

export default function Header({ notificationCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-background/95 backdrop-blur-sm border-b border-border/50">
      <KnotLogo size="sm" />
      <Link
        href="/notifications"
        className="relative rounded-full p-2 hover:bg-muted transition-colors"
      >
        <Bell className="h-5 w-5" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Link>
    </header>
  );
}
