import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar, StarRating } from "@/components/ui";
import { AtSign, MapPin, CheckCircle, Shield } from "lucide-react";

export default async function CreatorProfilePage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile || !creatorProfile) return null;

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Profile header */}
      <Card className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar
            src={profile.avatar_url}
            name={profile.full_name}
            size="xl"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-serif font-semibold">
                {profile.full_name}
              </h1>
              {creatorProfile.verified && (
                <CheckCircle className="h-4 w-4 text-primary" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
            {creatorProfile.city && (
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="h-3 w-3" />
                {creatorProfile.city}
              </p>
            )}
          </div>
        </div>

        {creatorProfile.bio && (
          <p className="text-sm text-muted-foreground">{creatorProfile.bio}</p>
        )}

        <div className="flex flex-wrap gap-2">
          {creatorProfile.categories?.map((cat: string) => (
            <Badge key={cat} variant="secondary">{cat}</Badge>
          ))}
        </div>
      </Card>

      {/* Stats */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium">Stats</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-xl font-semibold">{creatorProfile.total_knots}</p>
            <p className="text-xs text-muted-foreground">Knots</p>
          </div>
          <div>
            <p className="text-xl font-semibold">
              {creatorProfile.avg_rating > 0
                ? creatorProfile.avg_rating.toFixed(1)
                : "--"}
            </p>
            <p className="text-xs text-muted-foreground">Rating</p>
          </div>
          <div>
            <p className="text-xl font-semibold">
              {creatorProfile.completion_rate > 0
                ? `${Math.round(creatorProfile.completion_rate * 100)}%`
                : "--"}
            </p>
            <p className="text-xs text-muted-foreground">Completion</p>
          </div>
        </div>
      </Card>

      {/* Social */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium">Social</h2>
        {creatorProfile.instagram_handle && (
          <div className="flex items-center gap-2 text-sm">
            <AtSign className="h-4 w-4 text-muted-foreground" />
            <span>@{creatorProfile.instagram_handle}</span>
          </div>
        )}
        {creatorProfile.tiktok_handle && (
          <div className="flex items-center gap-2 text-sm">
            <AtSign className="h-4 w-4 text-muted-foreground" />
            <span>@{creatorProfile.tiktok_handle} (TikTok)</span>
          </div>
        )}
        {creatorProfile.follower_count > 0 && (
          <p className="text-sm text-muted-foreground">
            {creatorProfile.follower_count.toLocaleString()} followers
          </p>
        )}
      </Card>

      {/* Trust */}
      <Card className="space-y-3">
        <h2 className="text-sm font-medium flex items-center gap-2">
          <Shield className="h-4 w-4 text-primary" />
          Trust Score
        </h2>
        <div className="flex items-center gap-4">
          <div className="text-2xl font-semibold">{creatorProfile.trust_score}</div>
          <div className="flex-1">
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all"
                style={{ width: `${Math.min(creatorProfile.trust_score, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
