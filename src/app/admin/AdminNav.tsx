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
    <div className="flex gap-1 px-4 py-2 overflow-x-auto border-b border-border/50">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
            pathname === link.href
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
