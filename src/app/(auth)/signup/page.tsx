"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, KnotLogo } from "@/components/ui";
import { Users, Briefcase, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/types";

export default function SignupPage() {
  const [step, setStep] = useState<"role" | "details">("role");
  const [role, setRole] = useState<UserRole | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!role) return;
    setError("");
    setLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: name,
          role,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      if (data.user.identities?.length === 0) {
        setError("This email is already here — try signing in instead.");
        setLoading(false);
        return;
      }

      // Check if profile already exists (user signed up before but didn't finish)
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!existingProfile) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert({
            id: data.user.id,
            role,
            full_name: name,
            email: email.trim(),
          });

        if (profileError) {
          setError("We couldn't finish setting up your account. Try again.");
          setLoading(false);
          return;
        }
      }

      // Route based on role: creators to onboarding, businesses to onboarding
      const destination = existingProfile
        ? existingProfile.role === "creator"
          ? "/c/explore"
          : "/b/dashboard"
        : `/onboarding/${role}`;

      router.push(destination);
      router.refresh();
    } else {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (step === "role") {
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
            WELCOME
          </span>
          <h1 className="mt-2.5 font-serif italic text-[40px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
            Pull up a<br />chair.
          </h1>
          <p className="mt-3.5 text-[13.5px] leading-[1.5] text-[color:var(--ink-mid)] font-medium">
            Tell us who you are. We&apos;ll shape the room around you.
          </p>
        </div>

        <div className="px-6 mt-10 space-y-3">
          <button
            onClick={() => {
              setRole("creator");
              setStep("details");
            }}
            className="w-full flex items-center gap-4 rounded-[18px] bg-[color:var(--surface)] border border-[color:var(--line)] p-5 text-left transition-all hover:border-[color:var(--sage)] active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-[color:var(--sage-tint)] flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-[color:var(--sage-deep)]" strokeWidth={1.6} />
            </div>
            <div className="flex-1">
              <p className="font-serif text-[18px] font-semibold text-[color:var(--ink)] leading-tight">
                I&apos;m a Creator
              </p>
              <p className="text-[12.5px] text-[color:var(--ink-mid)] mt-1">
                I make content for local spots.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-[color:var(--ink-faint)]" />
          </button>

          <button
            onClick={() => {
              setRole("business");
              setStep("details");
            }}
            className="w-full flex items-center gap-4 rounded-[18px] bg-[color:var(--surface)] border border-[color:var(--line)] p-5 text-left transition-all hover:border-[color:var(--clay)] active:scale-[0.98]"
          >
            <div className="w-11 h-11 rounded-xl bg-[color:var(--clay-soft)] flex items-center justify-center shrink-0">
              <Briefcase className="h-5 w-5 text-[color:var(--clay-deep)]" strokeWidth={1.6} />
            </div>
            <div className="flex-1">
              <p className="font-serif text-[18px] font-semibold text-[color:var(--ink)] leading-tight">
                I&apos;m a Business
              </p>
              <p className="text-[12.5px] text-[color:var(--ink-mid)] mt-1">
                I want creators to visit my place.
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-[color:var(--ink-faint)]" />
          </button>
        </div>

        <div className="mt-auto px-6 pb-10 pt-6">
          <p className="text-center text-[12.5px] text-[color:var(--ink-mid)] font-medium">
            Already here?{" "}
            <Link
              href="/login"
              className="text-[color:var(--ink)] font-bold underline underline-offset-[3px]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] flex flex-col">
      <div className="flex items-center justify-between px-6 pt-14">
        <button
          onClick={() => setStep("role")}
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </button>
        <KnotLogo variant="mark" size="sm" />
      </div>

      <div className="px-6 mt-14">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage)]">
          {role === "creator" ? "FOR CREATORS" : "FOR BUSINESSES"}
        </span>
        <h1 className="mt-2.5 font-serif italic text-[36px] font-normal leading-[1] tracking-[-0.02em] text-[color:var(--ink)]">
          A few details<br />and you&apos;re in.
        </h1>
        <p className="mt-3 text-[13px] leading-[1.5] text-[color:var(--ink-mid)] font-medium">
          No CV, no portfolio required — we&apos;ll build it as you go.
        </p>
      </div>

      <form onSubmit={handleSignup} className="px-6 mt-8 flex flex-col gap-3.5">
        <Input
          label="Full Name"
          placeholder={role === "creator" ? "Maya Levin" : "Your name or business"}
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
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
          placeholder="At least 6 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={6}
          required
        />

        {error && (
          <div className="rounded-xl bg-[color:var(--destructive-soft)] px-4 py-3 border border-[color:var(--destructive)]/20">
            <p className="text-[13px] text-[color:var(--destructive)] text-center">{error}</p>
          </div>
        )}
      </form>

      <div className="mt-auto px-6 pb-10 pt-6">
        <Button
          type="submit"
          onClick={handleSignup}
          loading={loading}
          className="w-full"
          size="lg"
        >
          Continue
        </Button>
        <p className="mt-4 text-center text-[11.5px] text-[color:var(--ink-soft)] font-medium leading-[1.5]">
          By continuing you agree to{" "}
          <span className="text-[color:var(--ink)] underline underline-offset-2">Terms</span>{" "}
          &{" "}
          <span className="text-[color:var(--ink)] underline underline-offset-2">Privacy</span>.
        </p>
      </div>
    </div>
  );
}
