import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Badge, EmptyState } from "@/components/ui";
import { MapPin, Briefcase, Megaphone, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface BusinessWithOffers {
  id: string;
  business_name: string;
  logo_url: string | null;
  city: string | null;
  category: string | null;
  description: string | null;
  avg_rating: number;
  offers: {
    id: string;
    title: string;
    deliverables: string;
    compensation: string | null;
    category: string | null;
  }[];
}

export default async function ExplorePage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("approval_status")
    .eq("id", user.id)
    .single();

  if (creatorProfile?.approval_status === "pending") {
    return (
      <div className="px-4 py-8">
        <div className="mx-auto max-w-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto">
            <Briefcase className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-serif font-semibold">
            Profile Under Review
          </h1>
          <p className="text-sm text-muted-foreground">
            Your creator profile is being reviewed. You&apos;ll be able to
            browse offers once approved.
          </p>
        </div>
      </div>
    );
  }

  // Get all businesses with their active offers
  const { data: businesses } = await supabase
    .from("business_profiles")
    .select("id, business_name, logo_url, city, category, description, avg_rating")
    .order("business_name");

  const { data: offers } = await supabase
    .from("offers")
    .select("id, title, deliverables, compensation, category, business_id")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Group offers by business
  const businessesWithOffers: BusinessWithOffers[] = (businesses || [])
    .map((biz) => ({
      ...biz,
      offers: (offers || []).filter((o) => o.business_id === biz.id),
    }))
    .filter((biz) => biz.offers.length > 0);

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-semibold">Discover</h1>
        <p className="text-base text-muted-foreground mt-1">
          Local businesses looking for creators
        </p>
      </div>

      {businessesWithOffers.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No offers yet"
          description="New offers are posted regularly. Check back soon!"
        />
      ) : (
        <div className="space-y-5">
          {businessesWithOffers.map((biz) => (
            <div key={biz.id} className="rounded-[1.5rem] overflow-hidden bg-card border border-border/40">
              {/* Business hero image */}
              <div className="relative aspect-[16/9] overflow-hidden">
                {biz.logo_url ? (
                  <Image
                    src={biz.logo_url}
                    alt={biz.business_name}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Megaphone className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                )}
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Business name on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h2 className="text-xl font-serif font-semibold text-white">
                    {biz.business_name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    {biz.city && (
                      <span className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {biz.city}
                      </span>
                    )}
                    {biz.category && (
                      <Badge variant="secondary" className="bg-white/20 text-white border-none text-xs">
                        {biz.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Offers list */}
              <div className="p-3">
                <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium px-1 mb-2">
                  {biz.offers.length} offer{biz.offers.length !== 1 ? "s" : ""}
                </p>
                <div className="space-y-1.5">
                  {biz.offers.map((offer) => (
                    <Link key={offer.id} href={`/c/offers/${offer.id}`}>
                      <div className="flex items-center gap-3 rounded-xl bg-background/60 px-4 py-3 active:scale-[0.98] transition-transform">
                        <div className="flex-1 min-w-0">
                          <p className="text-[15px] font-semibold text-foreground truncate">
                            {offer.title}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm text-muted-foreground">
                              {offer.deliverables}
                            </span>
                            {offer.compensation && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-sm text-primary font-medium">
                                  {offer.compensation}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
