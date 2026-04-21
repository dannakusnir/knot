"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, KnotLogo } from "@/components/ui";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
  }

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] flex flex-col">
      <div className="flex items-center justify-between px-6 pt-14">
        <Link
          href="/"
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </Link>
        <KnotLogo variant="mark" size="sm" />
      </div>

      <div className="px-6 mt-14">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage)]">
          WELCOME BACK
        </span>
        <h1 className="mt-2.5 font-serif italic text-[40px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          Pull up a<br />chair.
        </h1>
        <p className="mt-3.5 text-[13.5px] leading-[1.5] text-[color:var(--ink-mid)] font-medium">
          Sign back in to manage your collaborations.
        </p>
      </div>

      <form onSubmit={handleLogin} className="px-6 mt-10 flex flex-col gap-3.5">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {error && (
          <div className="rounded-xl bg-[color:var(--destructive-soft)] px-4 py-3 border border-[color:var(--destructive)]/20">
            <p className="text-[13px] text-[color:var(--destructive)] text-center">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <Button
            type="submit"
            loading={loading}
            className="w-full"
            size="lg"
          >
            Sign in
          </Button>
        </div>
      </form>

      <div className="mt-auto px-6 pb-10 pt-6">
        <p className="text-center text-[12.5px] text-[color:var(--ink-mid)] font-medium">
          New here?{" "}
          <Link
            href="/signup"
            className="text-[color:var(--ink)] font-bold underline underline-offset-[3px]"
          >
            Create a profile
          </Link>
        </p>
      </div>
    </div>
  );
}
