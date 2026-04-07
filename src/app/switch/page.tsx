"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Card, Badge, Avatar, KnotLogo } from "@/components/ui";
import {
  Users,
  Store,
  Shield,
  LogIn,
  CheckCircle,
  Loader2,
} from "lucide-react";

interface UserAccount {
  id: string;
  email: string;
  role: string;
  full_name: string;
  business_name?: string;
  avatar_url?: string;
}

export default function SwitchAccountPage() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [switching, setSwitching] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUser(user.id);

      // Fetch all profiles (admin view)
      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")
        .order("role");

      if (!profiles) {
        setLoading(false);
        return;
      }

      // Get business names
      const bizIds = profiles
        .filter((p) => p.role === "business")
        .map((p) => p.id);
      const { data: bizProfiles } = await supabase
        .from("business_profiles")
        .select("id, business_name")
        .in("id", bizIds.length > 0 ? bizIds : ["none"]);

      const bizMap = new Map(
        bizProfiles?.map((b) => [b.id, b.business_name]) || []
      );

      const accts: UserAccount[] = profiles.map((p) => ({
        id: p.id,
        email: p.email,
        role: p.role,
        full_name: p.full_name,
        business_name: bizMap.get(p.id),
        avatar_url: p.avatar_url,
      }));

      setAccounts(accts);
      setLoading(false);
    }
    load();
  }, []);

  async function switchTo(email: string, id: string) {
    setSwitching(id);

    // Sign out current
    await supabase.auth.signOut();

    // Sign in as selected user (all test accounts use same password)
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: "Knot2026!",
    });

    if (error) {
      alert("Login failed: " + error.message);
      setSwitching(null);
      return;
    }

    setCurrentUser(id);
    setSwitching(null);

    // Redirect based on role
    const acct = accounts.find((a) => a.id === id);
    if (acct?.role === "creator") router.push("/c/explore");
    else if (acct?.role === "business") router.push("/b/dashboard");
    else if (acct?.role === "admin") router.push("/admin/dashboard");
    router.refresh();
  }

  const roleIcon = (role: string) => {
    if (role === "creator") return Users;
    if (role === "business") return Store;
    return Shield;
  };

  const roleColor = (role: string) => {
    if (role === "creator") return "primary";
    if (role === "business") return "warning";
    return "info";
  } as (role: string) => "primary" | "warning" | "info";

  const creators = accounts.filter((a) => a.role === "creator");
  const businesses = accounts.filter((a) => a.role === "business");
  const admins = accounts.filter((a) => a.role === "admin");

  return (
    <div className="min-h-dvh bg-background px-4 py-8">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <KnotLogo size="sm" />
            <h1 className="text-2xl font-serif font-semibold mt-3">
              Switch Account
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Quick login to any account for testing
            </p>
          </div>
          <Badge variant="info" className="text-xs px-3 py-1">
            Dev Mode
          </Badge>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Businesses */}
            {businesses.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Businesses ({businesses.length})
                </p>
                <div className="space-y-2">
                  {businesses.map((acct) => {
                    const Icon = roleIcon(acct.role);
                    const isCurrent = acct.id === currentUser;
                    return (
                      <button
                        key={acct.id}
                        onClick={() => switchTo(acct.email, acct.id)}
                        disabled={switching !== null}
                        className="w-full text-left"
                      >
                        <Card
                          hoverable
                          className={`flex items-center gap-3 ${isCurrent ? "ring-2 ring-primary" : ""}`}
                        >
                          <div className="shrink-0 w-10 h-10 rounded-full bg-warning/15 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-warning" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {acct.business_name || acct.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {acct.email}
                            </p>
                          </div>
                          {isCurrent ? (
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          ) : switching === acct.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />
                          ) : (
                            <LogIn className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Creators */}
            {creators.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Creators ({creators.length})
                </p>
                <div className="space-y-2">
                  {creators.map((acct) => {
                    const Icon = roleIcon(acct.role);
                    const isCurrent = acct.id === currentUser;
                    return (
                      <button
                        key={acct.id}
                        onClick={() => switchTo(acct.email, acct.id)}
                        disabled={switching !== null}
                        className="w-full text-left"
                      >
                        <Card
                          hoverable
                          className={`flex items-center gap-3 ${isCurrent ? "ring-2 ring-primary" : ""}`}
                        >
                          <div className="shrink-0 w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary-hover" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {acct.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {acct.email}
                            </p>
                          </div>
                          {isCurrent ? (
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          ) : switching === acct.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />
                          ) : (
                            <LogIn className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Admins */}
            {admins.length > 0 && (
              <div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">
                  Admins ({admins.length})
                </p>
                <div className="space-y-2">
                  {admins.map((acct) => {
                    const isCurrent = acct.id === currentUser;
                    return (
                      <button
                        key={acct.id}
                        onClick={() => switchTo(acct.email, acct.id)}
                        disabled={switching !== null}
                        className="w-full text-left"
                      >
                        <Card
                          hoverable
                          className={`flex items-center gap-3 ${isCurrent ? "ring-2 ring-primary" : ""}`}
                        >
                          <div className="shrink-0 w-10 h-10 rounded-full bg-info/15 flex items-center justify-center">
                            <Shield className="h-5 w-5 text-info" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold truncate">
                              {acct.full_name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {acct.email}
                            </p>
                          </div>
                          {isCurrent ? (
                            <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                          ) : switching === acct.id ? (
                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground shrink-0" />
                          ) : (
                            <LogIn className="h-4 w-4 text-muted-foreground shrink-0" />
                          )}
                        </Card>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
