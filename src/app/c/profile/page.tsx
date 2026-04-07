import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Badge, Avatar } from "@/components/ui";
import { AtSign, MapPin, CheckCircle, Shield, Star, Link2, TrendingUp } from "lucide-react";
import SignOutButton from "@/components/layout/SignOutButton";

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
    <div className="min-h-dvh bg-[#EDE8E2]">
      {/* Profile header with gradient */}
      <div className="bg-gradient-to-b from-[#A5A58D]/20 to-[#EDE8E2] px-5 pt-8 pb-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar
              src={profile.avatar_url}
              name={profile.full_name}
              size="xl"
            />
            {creatorProfile.verified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#7FC8A9] flex items-center justify-center ring-2 ring-[#EDE8E2]">
                <CheckCircle className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-serif font-medium text-[#3D3229]">
              {profile.full_name}
            </h1>
            <p className="text-sm text-[#8A8078]">{profile.email}</p>
            {creatorProfile.city && (
              <p className="text-sm text-[#8A8078] flex items-center gap-1 mt-0.5">
                <MapPin className="h-3.5 w-3.5" />
                {creatorProfile.city}
              </p>
            )}
          </div>
        </div>

        {creatorProfile.bio && (
          <p className="text-[15px] text-[#6B6560] mt-4 leading-relaxed">{creatorProfile.bio}</p>
        )}

        {creatorProfile.categories?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {creatorProfile.categories.map((cat: string) => (
              <span key={cat} className="px-3 py-1 rounded-full bg-white/70 text-[#6B705C] text-xs font-semibold">
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pb-24 space-y-4">
        {/* Stats */}
        <div className="flex gap-3">
          <div className="flex-1 rounded-2xl bg-[#7FC8A9]/12 p-4 text-center">
            <Link2 className="h-4 w-4 text-[#5BA88A] mx-auto mb-1.5" />
            <p className="text-2xl font-semibold text-[#3D3229]">{creatorProfile.total_knots}</p>
            <p className="text-xs text-[#5BA88A] font-medium">Knots</p>
          </div>
          <div className="flex-1 rounded-2xl bg-[#DDBEA9]/20 p-4 text-center">
            <Star className="h-4 w-4 text-[#CB997E] mx-auto mb-1.5" />
            <p className="text-2xl font-semibold text-[#3D3229]">
              {creatorProfile.avg_rating > 0 ? creatorProfile.avg_rating.toFixed(1) : "--"}
            </p>
            <p className="text-xs text-[#CB997E] font-medium">Rating</p>
          </div>
          <div className="flex-1 rounded-2xl bg-[#A5A58D]/12 p-4 text-center">
            <TrendingUp className="h-4 w-4 text-[#6B705C] mx-auto mb-1.5" />
            <p className="text-2xl font-semibold text-[#3D3229]">
              {creatorProfile.completion_rate > 0
                ? `${Math.round(creatorProfile.completion_rate * 100)}%`
                : "--"}
            </p>
            <p className="text-xs text-[#6B705C] font-medium">Complete</p>
          </div>
        </div>

        {/* Trust Score */}
        <div className="rounded-2xl bg-white p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[#6B705C]" />
            <p className="text-sm font-semibold text-[#3D3229]">Trust Score</p>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-3xl font-semibold text-[#3D3229]">
              {creatorProfile.trust_score.toFixed(1)}
            </p>
            <div className="flex-1">
              <div className="h-3 rounded-full bg-[#EDE8E2] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#A5A58D] to-[#7FC8A9] transition-all"
                  style={{ width: `${Math.min(creatorProfile.trust_score * 20, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social */}
        <div className="rounded-2xl bg-white p-5 space-y-3">
          <p className="text-sm font-semibold text-[#3D3229]">Social</p>
          {creatorProfile.instagram_handle && (
            <div className="flex items-center gap-3 text-[15px]">
              <div className="w-8 h-8 rounded-full bg-[#DDBEA9]/20 flex items-center justify-center">
                <AtSign className="h-4 w-4 text-[#CB997E]" />
              </div>
              <span className="text-[#3D3229]">@{creatorProfile.instagram_handle}</span>
            </div>
          )}
          {creatorProfile.tiktok_handle && (
            <div className="flex items-center gap-3 text-[15px]">
              <div className="w-8 h-8 rounded-full bg-[#A5A58D]/15 flex items-center justify-center">
                <AtSign className="h-4 w-4 text-[#6B705C]" />
              </div>
              <span className="text-[#3D3229]">@{creatorProfile.tiktok_handle}</span>
              <span className="text-xs text-[#8A8078]">TikTok</span>
            </div>
          )}
          {creatorProfile.follower_count > 0 && (
            <p className="text-sm text-[#8A8078] pl-11">
              {creatorProfile.follower_count.toLocaleString()} followers
            </p>
          )}
        </div>

        {/* Sign Out */}
        <SignOutButton />
      </div>
    </div>
  );
}
