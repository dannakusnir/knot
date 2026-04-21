"use client";

import { KnotLogo } from "@/components/ui";
import { Bell } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  notificationCount?: number;
  notificationHref?: string;
}

export default function Header({
  notificationCount = 0,
  notificationHref = "/c/notifications",
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-[color:var(--background)]/95 backdrop-blur-sm border-b border-[color:var(--line)]">
      <KnotLogo size="sm" />
      <Link
        href={notificationHref}
        className="relative rounded-full p-2 hover:bg-[color:var(--paper)] transition-colors"
      >
        <Bell className="h-[18px] w-[18px] text-[color:var(--ink-mid)]" strokeWidth={1.5} />
        {notificationCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[color:var(--clay)] text-[9px] font-mono font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Link>
    </header>
  );
}
