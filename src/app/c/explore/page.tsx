import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState, LivePulse, SectionEyebrow } from "@/components/ui";
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
      <div className="px-6 py-16">
        <div className="mx-auto max-w-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[color:var(--clay-soft)] flex items-center justify-center mx-auto">
            <Briefcase className="h-6 w-6 text-[color:var(--clay)]" strokeWidth={1.5} />
          </div>
          <SectionEyebrow label="Under Review" accent className="text-center" />
          <h1 className="font-serif text-3xl font-medium text-ink leading-tight">
            <em className="italic text-[color:var(--sage-deep)]">Almost</em> there.
          </h1>
          <p className="font-serif italic text-base text-[color:var(--ink-mid)]">
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

  const totalOffers = businessesWithOffers.reduce((sum, biz) => sum + biz.offers.length, 0);

  return (
    <div className="min-h-dvh bg-[color:var(--background)]">
      {/* Editorial header */}
      <div className="px-5 pt-7 pb-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <SectionEyebrow num="01" label="Discover" accent />
            <h1 className="mt-3 font-serif text-[40px] font-normal tracking-[-0.015em] text-ink leading-[1]">
              Discover<span className="text-[color:var(--clay)]">.</span>
            </h1>
            <p className="mt-2 font-serif italic text-[15px] text-[color:var(--ink-mid)]">
              Local businesses looking for you.
            </p>
          </div>
          {totalOffers > 0 && (
            <div className="mt-2">
              <LivePulse count={totalOffers} label="offers" />
            </div>
          )}
        </div>
      </div>

      <div className="hairline" />

      {businessesWithOffers.length === 0 ? (
        <div className="px-5 py-10">
          <EmptyState
            icon={Megaphone}
            title="No offers yet"
            description="New offers are posted regularly. Check back soon!"
          />
        </div>
      ) : (
        <div className="px-4 pt-5 pb-28 space-y-5">
          {businessesWithOffers.map((biz, index) => (
            <article
              key={biz.id}
              className="rounded-[20px] overflow-hidden bg-[color:var(--paper)] border border-[color:var(--line)]"
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
                    <div className="aspect-[3/2] bg-[color:var(--muted)] flex items-center justify-center">
                      <Megaphone className="h-10 w-10 text-[color:var(--ink-faint)]" strokeWidth={1.2} />
                    </div>
                  );
                })()}
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent pointer-events-none" />

                {/* Serial number + category */}
                <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                  <span className="font-mono text-[9px] font-bold tracking-[0.2em] uppercase text-white bg-black/30 backdrop-blur-sm px-2 py-1 rounded-sm">
                    № {String(index + 1).padStart(2, "0")}
                  </span>
                  {biz.category && (
                    <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase bg-white/90 text-ink px-2 py-1 rounded-sm">
                      {biz.category}
                    </span>
                  )}
                </div>

                {/* Business info on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-10 pointer-events-none">
                  <h2 className="font-serif text-[26px] font-medium italic text-white leading-[1.05]">
                    {biz.business_name}
                  </h2>
                  <div className="flex items-center gap-3 mt-1.5">
                    {biz.city && (
                      <span className="flex items-center gap-1 font-mono text-[10px] tracking-[0.15em] uppercase text-white/85">
                        <MapPin className="h-3 w-3" strokeWidth={2} />
                        {biz.city}
                      </span>
                    )}
                    {biz.avg_rating > 0 && (
                      <span className="flex items-center gap-1 font-mono text-[10px] tracking-[0.15em] text-white/85">
                        <Star className="h-3 w-3 fill-white text-white" />
                        {biz.avg_rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Offers */}
              <div className="px-4 py-4">
                <div className="flex items-center justify-between pb-3 border-b border-[color:var(--line)]">
                  <span className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase text-[color:var(--sage-deep)]">
                    § {biz.offers.length} offer{biz.offers.length !== 1 ? "s" : ""}
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-[color:var(--ink-soft)]">
                    Open
                  </span>
                </div>

                <div className="divide-y divide-[color:var(--line)]">
                  {biz.offers.map((offer) => {
                    const offerImg = getOfferImage(biz.business_name, offer.title);
                    return (
                      <Link key={offer.id} href={`/c/offers/${offer.id}`}>
                        <div className="flex items-center gap-3 py-3.5 active:opacity-60 transition-opacity">
                          {offerImg ? (
                            <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-[color:var(--line)]">
                              <Image
                                src={offerImg}
                                alt={offer.title}
                                width={88}
                                height={88}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-lg bg-[color:var(--muted)] flex items-center justify-center shrink-0">
                              <Megaphone className="h-4 w-4 text-[color:var(--ink-faint)]" strokeWidth={1.5} />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="font-serif text-[16px] font-medium text-ink truncate leading-tight">
                              {offer.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-1">
                              <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[color:var(--ink-soft)]">
                                {offer.deliverables}
                              </span>
                              {offer.compensation && (
                                <>
                                  <span className="text-[color:var(--ink-faint)]">·</span>
                                  <span className="font-mono text-[10px] tracking-[0.12em] uppercase text-[color:var(--sage-deep)] font-semibold">
                                    {offer.compensation}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-[color:var(--ink-faint)] shrink-0" strokeWidth={1.5} />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
