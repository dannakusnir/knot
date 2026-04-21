"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MarkReadButtonProps {
  ids: string[];
}

export default function MarkReadButton({ ids }: MarkReadButtonProps) {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  async function handleMarkAll() {
    setLoading(true);
    await supabase
      .from("notifications")
      .update({ read: true })
      .in("id", ids);
    router.refresh();
  }

  return (
    <button
      onClick={handleMarkAll}
      disabled={loading}
      className="font-mono text-[10px] font-bold tracking-[0.18em] uppercase text-[color:var(--clay-deep)] hover:text-[color:var(--ink)] transition-colors disabled:opacity-50"
    >
      Mark all read
    </button>
  );
}
