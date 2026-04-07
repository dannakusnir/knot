import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { MapPin, Calendar, Briefcase, Megaphone } from "lucide-react";
import Link from "next/link";
import type { Offer } from "@/types";

export default async function ExplorePage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("approval_status, categories")
    .eq("id", user.id)
    .single();

  if (creatorProfile?.approval_status === "pending") {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <Briefcase className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-serif font-semibold">Profile Under Review</h1>
          <p className="text-sm text-muted-foreground">
            Your creator profile is being reviewed. You&apos;ll be able to browse
            offers once approved.
          </p>
        </div>
      </div>
    );
  }

  const { data: offers } = await supabase
    .from("offers")
    .select("*, business:business_profiles(business_name, logo_url, city, avg_rating)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Explore Offers</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Find the perfect collaboration for you
        </p>
      </div>

      {!offers || offers.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No offers yet"
          description="New offers are posted regularly. Check back soon!"
        />
      ) : (
        <div className="space-y-3">
          {offers.map((offer: Offer & { business: { business_name: string; logo_url: string | null; city: string | null; avg_rating: number } }) => (
            <Link key={offer.id} href={`/c/offers/${offer.id}`}>
              <Card className="space-y-3 active:scale-[0.98] transition-transform">
                <div className="flex items-start gap-3">
                  <Avatar
                    src={offer.business?.logo_url}
                    name={offer.business?.business_name ?? "Business"}
                    size="md"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {offer.title}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {offer.business?.business_name}
                    </p>
                  </div>
                  {offer.category && (
                    <Badge variant="secondary">{offer.category}</Badge>
                  )}
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">
                  {offer.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {offer.business?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {offer.business.city}
                    </span>
                  )}
                  {offer.deadline && (
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(offer.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>

                {offer.compensation && (
                  <p className="text-sm font-medium text-primary">
                    {offer.compensation}
                  </p>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
