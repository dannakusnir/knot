"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, KnotLogo } from "@/components/ui";
import { Users, Briefcase, ArrowLeft } from "lucide-react";
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
        setError("This email is already registered. Try signing in.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        full_name: name,
        email: email.trim(),
      });

      if (profileError) {
        console.log("Profile insert:", profileError.message);
      }

      router.push(`/onboarding/${role}`);
      router.refresh();
    } else {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  if (step === "role") {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-8">
            <KnotLogo size="lg" />
          </div>
          <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
            Join KNOT
          </h1>
          <p className="text-base text-[#8A8078]">
            How would you like to use KNOT?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setRole("creator");
              setStep("details");
            }}
            className="w-full flex items-center gap-4 rounded-2xl border-2 border-[#E8E3DD] p-5 text-left transition-all hover:border-[#A5A58D] hover:bg-[#A5A58D]/5 active:scale-[0.98]"
          >
            <div className="rounded-xl bg-[#7FC8A9]/15 p-3">
              <Users className="h-6 w-6 text-[#5BA88A]" />
            </div>
            <div>
              <p className="font-semibold text-[#3D3229]">I&apos;m a Creator</p>
              <p className="text-sm text-[#8A8078]">
                I create content for local businesses
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setRole("business");
              setStep("details");
            }}
            className="w-full flex items-center gap-4 rounded-2xl border-2 border-[#E8E3DD] p-5 text-left transition-all hover:border-[#CB997E] hover:bg-[#CB997E]/5 active:scale-[0.98]"
          >
            <div className="rounded-xl bg-[#DDBEA9]/25 p-3">
              <Briefcase className="h-6 w-6 text-[#CB997E]" />
            </div>
            <div>
              <p className="font-semibold text-[#3D3229]">I&apos;m a Business</p>
              <p className="text-sm text-[#8A8078]">
                I want creators to make content for my business
              </p>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-[#8A8078]">
          Already have an account?{" "}
          <Link href="/login" className="text-[#6B705C] font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-8">
          <KnotLogo size="lg" />
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#A5A58D]/12 px-4 py-1.5 mb-2">
          {role === "creator" ? (
            <Users className="h-4 w-4 text-[#5BA88A]" />
          ) : (
            <Briefcase className="h-4 w-4 text-[#CB997E]" />
          )}
          <span className="text-sm font-medium text-[#3D3229]">
            {role === "creator" ? "Creator" : "Business"}
          </span>
        </div>
        <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
          Create your account
        </h1>
      </div>

      <form onSubmit={handleSignup} className="space-y-4">
        <Input
          label="Full Name"
          placeholder={
            role === "creator" ? "Your name" : "Your name or business name"
          }
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
          <div className="rounded-xl bg-[#E07A5F]/10 px-4 py-3">
            <p className="text-sm text-[#E07A5F] text-center">{error}</p>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <button
        onClick={() => setStep("role")}
        className="flex items-center gap-2 mx-auto text-sm text-[#8A8078] hover:text-[#3D3229] transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to role selection
      </button>
    </div>
  );
}
