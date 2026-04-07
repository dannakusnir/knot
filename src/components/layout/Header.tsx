"use client";

import { KnotLogo } from "@/components/ui";
import { Bell } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  notificationCount?: number;
}

export default function Header({ notificationCount = 0 }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-5 bg-[#EDE8E2]/95 backdrop-blur-sm border-b border-[#DDD7D0]/50">
      <KnotLogo size="sm" />
      <Link
        href="/switch"
        className="relative rounded-full p-2 hover:bg-[#E8E3DD] transition-colors"
      >
        <Bell className="h-5 w-5 text-[#6B705C]" />
        {notificationCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#CB997E] text-[10px] font-bold text-white">
            {notificationCount > 9 ? "9+" : notificationCount}
          </span>
        )}
      </Link>
    </header>
  );
}
