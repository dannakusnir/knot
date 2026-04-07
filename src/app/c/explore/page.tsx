import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { getBusinessImages, getOfferImage } from "@/lib/business-images";
import ImageSlider from "@/components/ui/ImageSlider";
import { MapPin, Briefcase, Megaphone, ChevronRight, Star } from "lucide-react";
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
      <div className="px-5 py-12">
        <div className="mx-auto max-w-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#DDBEA9]/30 flex items-center justify-center mx-auto">
            <Briefcase className="h-7 w-7 text-[#CB997E]" />
          </div>
          <h1 className="text-2xl font-serif font-medium">
            Profile Under Review
          </h1>
          <p className="text-base text-[#8A8078]">
            Your creator profile is being reviewed. You&apos;ll be able to
            browse offers once approved.
          </p>
        </div>
      </div>
    );
  }

  const { data: businesses } = await supabase
    .from("business_profiles")
    .select("id, business_name, logo_url, city, category, description, avg_rating")
    .order("business_name");

  const { data: offers } = await supabase
    .from("offers")
    .select("id, title, deliverables, compensation, category, business_id")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  const businessesWithOffers: BusinessWithOffers[] = (businesses || [])
    .map((biz) => ({
      ...biz,
      offers: (offers || []).filter((o) => o.business_id === biz.id),
    }))
    .filter((biz) => biz.offers.length > 0);

  return (
    <div className="min-h-dvh bg-[#EDE8E2]">
      <div className="px-5 pt-6 pb-4">
        <h1 className="text-3xl font-serif font-medium text-[#3D3229]">
          Discover
        </h1>
        <p className="text-base text-[#8A8078] mt-1">
          Local businesses looking for you ✨
        </p>
      </div>

      {businessesWithOffers.length === 0 ? (
        <div className="px-5">
          <EmptyState
            icon={Megaphone}
            title="No offers yet"
            description="New offers are posted regularly. Check back soon!"
          />
        </div>
      ) : (
        <div className="px-4 pb-24 space-y-4">
          {businessesWithOffers.map((biz) => (
            <div
              key={biz.id}
              className="rounded-[1.5rem] overflow-hidden bg-white"
            >
              {/* Business hero image slider */}
              <div className="relative">
                {(() => {
                  const imageSet = getBusinessImages(biz.business_name);
                  const images = imageSet?.hero || (biz.logo_url ? [biz.logo_url] : []);

                  return images.length > 0 ? (
                    <ImageSlider
                      images={images}
                      alt={biz.business_name}
                    />
                  ) : (
                    <div className="aspect-[3/2] bg-[#E8E3DD] flex items-center justify-center">
                      <Megaphone className="h-10 w-10 text-[#C4BBB2]" />
                    </div>
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />

                {/* Category pill */}
                {biz.category && (
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-[#3D3229] text-xs font-semibold">
                      {biz.category}
                    </span>
                  </div>
                )}

                {/* Business info on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                  <h2 className="text-2xl font-serif font-medium text-white leading-tight">
                    {biz.business_name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    {biz.city && (
                      <span className="flex items-center gap-1 text-sm text-white/80">
                        <MapPin className="h-3.5 w-3.5" />
                        {biz.city}
                      </span>
                    )}
                    {biz.avg_rating > 0 && (
                      <span className="flex items-center gap-1 text-sm text-white/80">
                        <Star className="h-3.5 w-3.5 fill-[#DDBEA9] text-[#DDBEA9]" />
                        {biz.avg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Offers */}
              <div className="p-4 space-y-2">
                <p className="text-[11px] text-[#CB997E] uppercase tracking-[0.15em] font-semibold mb-1">
                  {biz.offers.length} offer{biz.offers.length !== 1 ? "s" : ""} available
                </p>
                {biz.offers.map((offer) => {
                  const offerImg = getOfferImage(biz.business_name, offer.title);
                  return (
                  <Link key={offer.id} href={`/c/offers/${offer.id}`}>
                    <div className="flex items-center gap-3 rounded-2xl bg-[#F7F4F0] px-4 py-3.5 active:scale-[0.98] transition-transform">
                      {offerImg ? (
                        <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
                          <Image
                            src={offerImg}
                            alt={offer.title}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#A5A58D]/15 flex items-center justify-center shrink-0">
                          <Megaphone className="h-4 w-4 text-[#A5A58D]" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-[#3D3229] truncate">
                          {offer.title}
                        </p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-sm text-[#8A8078]">
                            {offer.deliverables}
                          </span>
                          {offer.compensation && (
                            <>
                              <span className="text-[#C4BBB2]">·</span>
                              <span className="text-sm text-[#6B705C] font-medium">
                                {offer.compensation}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-[#C4BBB2] shrink-0" />
                    </div>
                  </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
