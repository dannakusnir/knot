"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, KnotLogo } from "@/components/ui";
import Link from "next/link";

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
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-8">
          <KnotLogo size="lg" />
        </div>
        <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
          Welcome back
        </h1>
        <p className="text-base text-[#8A8078]">
          Sign in to manage your collaborations
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
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
          <div className="rounded-xl bg-[#E07A5F]/10 px-4 py-3">
            <p className="text-sm text-[#E07A5F] text-center">{error}</p>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-[#8A8078]">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-[#6B705C] font-semibold hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
