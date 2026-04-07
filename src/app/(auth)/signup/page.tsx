"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button, Input, KnotLogo } from "@/components/ui";
import { Users, Briefcase } from "lucide-react";
import Link from "next/link";
import type { UserRole } from "@/types";
import { cn } from "@/lib/utils";

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
      email,
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
      // If email confirmation is required, user won't be fully authenticated yet
      if (data.user.identities?.length === 0) {
        setError("This email is already registered. Try signing in.");
        setLoading(false);
        return;
      }

      // Create profile
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        role,
        full_name: name,
        email,
      });

      if (profileError) {
        // Profile might already exist if user re-signed up
        console.log("Profile insert:", profileError.message);
      }

      // Redirect to onboarding
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
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
            <KnotLogo size="lg" />
          </div>
          <h1 className="text-2xl font-serif font-semibold">Join KNOT</h1>
          <p className="text-sm text-muted-foreground">
            How would you like to use KNOT?
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              setRole("creator");
              setStep("details");
            }}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all",
              "border-border hover:border-primary hover:bg-primary/5"
            )}
          >
            <div className="rounded-xl bg-primary/15 p-3">
              <Users className="h-6 w-6 text-primary-hover" />
            </div>
            <div>
              <p className="font-semibold">I&apos;m a Creator</p>
              <p className="text-sm text-muted-foreground">
                I create content for local businesses
              </p>
            </div>
          </button>

          <button
            onClick={() => {
              setRole("business");
              setStep("details");
            }}
            className={cn(
              "w-full flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-all",
              "border-border hover:border-primary hover:bg-primary/5"
            )}
          >
            <div className="rounded-xl bg-secondary/50 p-3">
              <Briefcase className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="font-semibold">I&apos;m a Business</p>
              <p className="text-sm text-muted-foreground">
                I want creators to make content for my business
              </p>
            </div>
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-hover font-medium">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <div className="flex justify-center mb-6">
          <KnotLogo size="lg" />
        </div>
        <h1 className="text-2xl font-serif font-semibold">
          {role === "creator" ? "Creator" : "Business"} Sign Up
        </h1>
        <p className="text-sm text-muted-foreground">
          Create your account to get started
        </p>
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
          <p className="text-sm text-destructive text-center">{error}</p>
        )}

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create Account
        </Button>
      </form>

      <button
        onClick={() => setStep("role")}
        className="block w-full text-center text-sm text-muted-foreground hover:text-foreground"
      >
        Back to role selection
      </button>
    </div>
  );
}
