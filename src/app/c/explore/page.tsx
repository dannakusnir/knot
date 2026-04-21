import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { EmptyState } from "@/components/ui";
import { getBusinessImages, getOfferImage } from "@/lib/business-images";
import ImageSlider from "@/components/ui/ImageSlider";
import { Briefcase, Megaphone, ChevronRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ExploreFilters from "./ExploreFilters";

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

function KnotGlyph({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path
        d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"
        stroke="currentColor"
      />
      <path
        d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"
        stroke="currentColor"
      />
    </svg>
  );
}

export default async function ExplorePage() {
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: creatorProfile } = await supabase
    .from("creator_profiles")
    .select("approval_status, city")
    .eq("id", user.id)
    .single();

  if (creatorProfile?.approval_status === "pending") {
    return (
      <div className="px-6 py-16">
        <div className="mx-auto max-w-sm text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[color:var(--clay-soft)] flex items-center justify-center mx-auto">
            <Briefcase className="h-6 w-6 text-[color:var(--clay-deep)]" strokeWidth={1.5} />
          </div>
          <span className="font-mono text-[10px] font-bold tracking-[0.22em] uppercase text-[color:var(--clay-deep)]">
            Under Review
          </span>
          <h1 className="font-serif italic text-[32px] font-normal leading-[1] text-[color:var(--ink)]">
            Almost there.
          </h1>
          <p className="font-serif italic text-[14.5px] text-[color:var(--ink-mid)]">
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

  const totalOffers = businessesWithOffers.reduce(
    (sum, biz) => sum + biz.offers.length,
    0
  );

  const today = new Date();
  const weekday = today.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dayMonth = today
    .toLocaleDateString("en-US", { day: "2-digit", month: "short" })
    .toUpperCase();

  const categories = Array.from(
    new Set(businessesWithOffers.map((b) => b.category).filter(Boolean))
  ) as string[];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      {/* Masthead — date + city */}
      <div className="px-5 pt-7 pb-3 flex items-start justify-between">
        <div>
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            {weekday} · {dayMonth}
          </span>
          <p className="font-sans text-[14px] font-semibold text-[color:var(--ink)] mt-1">
            {creatorProfile?.city || "Near you"}
          </p>
        </div>
      </div>

      {/* Headline */}
      <div className="px-5 pt-2">
        <h1 className="font-serif italic text-[44px] font-normal leading-[0.95] tracking-[-0.035em] text-[color:var(--ink)]">
          Discover.
        </h1>
        <p className="mt-1.5 font-serif italic text-[15px] font-normal text-[color:var(--sage-deep)]">
          {totalOffers === 0
            ? "New offers arriving."
            : `${totalOffers} ${totalOffers === 1 ? "place wants" : "places want"} you this week.`}
        </p>
      </div>

      {/* Filters */}
      <ExploreFilters categories={categories} />

      {/* Feed */}
      {businessesWithOffers.length === 0 ? (
        <div className="px-5 py-10">
          <EmptyState
            icon={Megaphone}
            title="No offers yet"
            description="New offers are posted regularly. Check back soon!"
          />
        </div>
      ) : (
        <div className="px-4 pb-28 pt-5 space-y-4">
          {businessesWithOffers.map((biz, index) => {
            const imageSet = getBusinessImages(biz.business_name);
            const images = imageSet?.hero || (biz.logo_url ? [biz.logo_url] : []);
            const serial = String(index + 1).padStart(2, "0");
            const firstOffer = biz.offers[0];

            return (
              <article
                key={biz.id}
                className="overflow-hidden bg-[color:var(--surface)] border border-[color:var(--line)] rounded-[18px]"
              >
                {/* Hero image */}
                <div className="relative">
                  {images.length > 0 ? (
                    <div className="aspect-[16/9]">
                      <ImageSlider images={images} alt={biz.business_name} />
                    </div>
                  ) : (
                    <div className="aspect-[16/9] bg-[color:var(--paper)] flex items-center justify-center">
                      <Megaphone className="h-10 w-10 text-[color:var(--ink-faint)]" strokeWidth={1.2} />
                    </div>
                  )}

                  <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
                    <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-white bg-[rgba(61,50,41,0.55)] backdrop-blur-sm px-2.5 py-1 rounded-full">
                      № {serial}
                      {biz.category && ` · ${biz.category}`}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="font-sans text-[10.5px] font-bold tracking-[0.03em] text-[color:var(--ink)] bg-[color:var(--clay-soft)] px-2.5 py-1 rounded-full">
                      {biz.offers.length}{" "}
                      {biz.offers.length === 1 ? "spot" : "spots"}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-4 pt-3.5 pb-4">
                  <div className="flex justify-between items-baseline">
                    <div className="min-w-0">
                      <h2 className="font-serif text-[20px] font-medium text-[color:var(--ink)] tracking-[-0.01em] truncate">
                        {biz.business_name}
                      </h2>
                      <p className="font-sans text-[11.5px] text-[color:var(--ink-soft)] font-medium mt-0.5">
                        {biz.category || "Local"}
                        {biz.city ? ` · ${biz.city}` : ""}
                      </p>
                    </div>
                    {firstOffer?.compensation && (
                      <div className="text-right shrink-0 pl-3">
                        <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-faint)]">
                          VALUE
                        </div>
                        <div className="font-serif italic text-[16px] font-medium text-[color:var(--sage-deep)] truncate max-w-[140px]">
                          {firstOffer.compensation}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Trade chip */}
                  {firstOffer && (
                    <Link href={`/c/offers/${firstOffer.id}`}>
                      <div className="mt-3 flex items-center justify-between px-3 py-2.5 bg-[color:var(--paper)] rounded-[12px] active:scale-[0.98] transition-transform">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <KnotGlyph className="h-4 w-4 shrink-0 text-[color:var(--sage)]" />
                          <span className="font-sans text-[12.5px] font-semibold text-[color:var(--ink)] truncate">
                            {firstOffer.title}
                          </span>
                        </div>
                        <span className="font-sans text-[10.5px] font-bold tracking-[0.12em] uppercase text-[color:var(--sage-deep)] shrink-0 pl-2">
                          Apply →
                        </span>
                      </div>
                    </Link>
                  )}

                  {/* Additional offers, compact */}
                  {biz.offers.length > 1 && (
                    <div className="mt-2 divide-y divide-[color:var(--line-soft)]">
                      {biz.offers.slice(1).map((offer) => {
                        const offerImg = getOfferImage(biz.business_name, offer.title);
                        return (
                          <Link key={offer.id} href={`/c/offers/${offer.id}`}>
                            <div className="flex items-center gap-3 py-2.5 active:opacity-60 transition-opacity">
                              {offerImg ? (
                                <div className="w-9 h-9 rounded-lg overflow-hidden shrink-0">
                                  <Image
                                    src={offerImg}
                                    alt={offer.title}
                                    width={72}
                                    height={72}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-9 h-9 rounded-lg bg-[color:var(--paper)] flex items-center justify-center shrink-0">
                                  <Megaphone className="h-3.5 w-3.5 text-[color:var(--ink-faint)]" strokeWidth={1.5} />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-sans text-[13px] font-semibold text-[color:var(--ink)] truncate">
                                  {offer.title}
                                </p>
                                {offer.compensation && (
                                  <p className="font-mono text-[9.5px] tracking-[0.15em] uppercase text-[color:var(--sage-deep)] font-bold mt-0.5">
                                    {offer.compensation}
                                  </p>
                                )}
                              </div>
                              <ChevronRight className="h-4 w-4 text-[color:var(--ink-faint)] shrink-0" strokeWidth={1.6} />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
