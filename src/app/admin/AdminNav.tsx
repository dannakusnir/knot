"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/creators", label: "Creators" },
  { href: "/admin/matches", label: "Matches" },
  { href: "/admin/knots", label: "Knots" },
  { href: "/admin/guarantee", label: "Guarantee" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div className="flex gap-1 px-5 py-3 overflow-x-auto border-b border-[color:var(--line)]">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "px-3 py-1.5 rounded-full font-mono text-[10px] font-bold tracking-[0.15em] uppercase whitespace-nowrap transition-colors",
              active
                ? "bg-[color:var(--ink)] text-[color:var(--cream)]"
                : "text-[color:var(--ink-soft)] hover:text-[color:var(--ink)] hover:bg-[color:var(--paper)]"
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
