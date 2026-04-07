import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar } from "@/components/ui";
import { MapPin, Globe, Star, Link2, Shield } from "lucide-react";

export default async function BusinessProfilePage() {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: businessProfile } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !businessProfile) return null;

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Profile header */}
      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={businessProfile.logo_url}
            name={businessProfile.business_name}
            size="xl"
          />
          <div className="flex-1">
            <h1 className="text-lg font-serif font-semibold">
              {businessProfile.business_name}
            </h1>
            {businessProfile.category && (
              <Badge variant="secondary">{businessProfile.category}</Badge>
            )}
            {businessProfile.city && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {businessProfile.city}
              </p>
            )}
          </div>
        </div>

        {businessProfile.description && (
          <p className="text-sm text-muted-foreground">
            {businessProfile.description}
          </p>
        )}

        {businessProfile.website && (
          <a
            href={businessProfile.website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-hover flex items-center gap-1"
          >
            <Globe className="h-3.5 w-3.5" />
            {businessProfile.website}
          </a>
        )}

        {businessProfile.address && (
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {businessProfile.address}
          </p>
        )}
      </Card>

      {/* Stats */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium">Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold">{businessProfile.total_knots}</p>
            <p className="text-xs text-muted-foreground">Knots</p>
          </div>
          <div>
            <p className="text-xl font-semibold">
              {businessProfile.avg_rating > 0
                ? businessProfile.avg_rating.toFixed(1)
                : "--"}
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div>
            <p className="text-xl font-semibold">
              {businessProfile.guarantee_credits}
            </p>
            <p className="text-xs text-muted-foreground">Guarantee Credits</p>
          </div>
        </div>
      </Card>

      {/* Account */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Name</span>
            <span>{profile.full_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{profile.email}</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
