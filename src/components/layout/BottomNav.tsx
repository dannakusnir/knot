"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";

interface Tab {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface BottomNavProps {
  tabs: Tab[];
}

export default function BottomNav({ tabs }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#DDD7D0] bg-white/95 backdrop-blur-sm pb-safe">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || pathname.startsWith(tab.href + "/");
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all",
                isActive
                  ? "text-[#6B705C] bg-[#A5A58D]/12"
                  : "text-[#B5ADA5] hover:text-[#8A8078]"
              )}
            >
              <Icon
                className={cn(
                  "h-5 w-5 transition-transform",
                  isActive && "stroke-[2.5] scale-110"
                )}
              />
              <span
                className={cn(
                  "text-[11px] font-semibold transition-all",
                  isActive && "text-[#6B705C]"
                )}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
