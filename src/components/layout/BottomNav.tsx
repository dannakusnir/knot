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
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[color:var(--line)] bg-[color:var(--cream)]/95 backdrop-blur-sm pb-safe">
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
                "flex flex-col items-center gap-1 px-4 py-1.5 rounded-2xl transition-all",
                isActive
                  ? "text-[color:var(--sage-deep)]"
                  : "text-[color:var(--ink-faint)] hover:text-[color:var(--ink-soft)]"
              )}
            >
              <Icon
                className={cn(
                  "h-[19px] w-[19px] transition-all",
                  isActive ? "stroke-[2]" : "stroke-[1.5]"
                )}
              />
              <span
                className={cn(
                  "font-mono text-[9px] tracking-[0.15em] uppercase transition-all",
                  isActive ? "font-bold" : "font-semibold"
                )}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 h-0.5 w-5 rounded-full bg-[color:var(--sage-deep)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
