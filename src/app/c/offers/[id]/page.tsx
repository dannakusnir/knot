import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { getBusinessImages } from "@/lib/business-images";
import ImageSlider from "@/components/ui/ImageSlider";
import { ArrowLeft, Bookmark, Send, MapPin, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import CreateKnotButton from "./CreateKnotButton";

interface Props {
  params: Promise<{ id: string }>;
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
      <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" stroke="currentColor" />
      <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" stroke="currentColor" />
    </svg>
  );
}

export default async function OfferDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: offer } = await supabase
    .from("offers")
    .select(
      "*, business:business_profiles(business_name, logo_url, city, avg_rating, description, category)"
    )
    .eq("id", id)
    .single();

  if (!offer) notFound();

  const { data: existingApp } = await supabase
    .from("applications")
    .select("id, status")
    .eq("offer_id", id)
    .eq("creator_id", user.id)
    .maybeSingle();

  const hasApplied = !!existingApp;

  const businessName = offer.business?.business_name ?? "Business";
  const imageSet = getBusinessImages(businessName);
  const heroImages = imageSet?.hero ?? [];
  const category = offer.category || offer.business?.category || "Local";
  const city = offer.business?.city || "";

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-36">
      {/* Hero image */}
      <div className="relative aspect-[4/3]">
        {heroImages.length > 0 ? (
          <ImageSlider images={heroImages} alt={businessName} aspectRatio="aspect-[4/3]" />
        ) : (
          <div className="absolute inset-0 bg-[color:var(--paper)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-[color:var(--cream)]" />

        {/* Top controls */}
        <div className="absolute top-14 left-5 right-5 flex justify-between pointer-events-none">
          <Link
            href="/c/explore"
            className="pointer-events-auto w-10 h-10 rounded-full bg-[color:var(--paper)]/85 backdrop-blur-md border border-[color:var(--line)]/60 flex items-center justify-center"
          >
            <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
          </Link>
          <div className="flex gap-2 pointer-events-auto">
            <button className="w-10 h-10 rounded-full bg-[color:var(--paper)]/85 backdrop-blur-md border border-[color:var(--line)]/60 flex items-center justify-center">
              <Bookmark className="h-[17px] w-[17px] text-[color:var(--ink)]" strokeWidth={1.6} />
            </button>
            <button className="w-10 h-10 rounded-full bg-[color:var(--paper)]/85 backdrop-blur-md border border-[color:var(--line)]/60 flex items-center justify-center">
              <Send className="h-4 w-4 text-[color:var(--ink)]" strokeWidth={1.6} />
            </button>
          </div>
        </div>

        {/* Caption serial */}
        <span className="absolute bottom-24 left-5 font-mono text-[9.5px] font-bold tracking-[0.22em] text-white/95">
          № 001 · {category.toUpperCase()}
          {city ? ` · ${city.toUpperCase()}` : ""}
        </span>
      </div>

      {/* Title card overlapping */}
      <div className="px-5 -mt-14 relative">
        <div className="bg-[color:var(--surface)] border border-[color:var(--line)] rounded-[18px] p-5 shadow-[0_1px_2px_rgba(61,50,41,0.04),0_4px_12px_-4px_rgba(61,50,41,0.10)]">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="font-serif text-[28px] font-medium leading-[1] tracking-[-0.015em] text-[color:var(--ink)]">
                {businessName}
              </h1>
              <p className="mt-1.5 text-[12px] text-[color:var(--ink-soft)] font-medium">
                {category}
                {city ? ` · ${city}` : ""}
                {offer.business?.avg_rating > 0 && (
                  <>
                    <span className="mx-1.5">·</span>
                    <span className="text-[color:var(--clay)] font-semibold">
                      ★ {offer.business.avg_rating.toFixed(1)}
                    </span>
                  </>
                )}
              </p>
            </div>
            <span className="font-sans text-[11px] font-bold tracking-[0.02em] text-[color:var(--clay-deep)] bg-[color:var(--clay-soft)] px-2.5 py-1.5 rounded-full shrink-0">
              {offer.max_creators > 1 ? `${offer.max_creators} spots` : "1 spot"}
            </span>
          </div>

          <p className="mt-4 font-serif text-[16px] font-semibold leading-[1.3] text-[color:var(--ink)]">
            {offer.title}
          </p>
        </div>
      </div>

      {/* THE TRADE */}
      <section className="px-5 mt-8">
        <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
          THE TRADE
        </span>

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] gap-2 items-stretch">
          <div className="bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] rounded-[14px] p-3.5">
            <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)]">
              YOU GET
            </div>
            <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
              {offer.compensation || "Local experience"}
            </p>
            {offer.usage_rights && (
              <p className="font-sans text-[10.5px] text-[color:var(--sage-deep)] font-semibold mt-1.5">
                {offer.usage_rights}
              </p>
            )}
          </div>

          <div className="flex items-center justify-center px-1">
            <KnotGlyph className="h-6 w-6 text-[color:var(--clay)]" />
          </div>

          <div className="bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] rounded-[14px] p-3.5">
            <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--clay-deep)]">
              YOU GIVE
            </div>
            <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
              {offer.deliverables}
            </p>
            {offer.deadline && (
              <p className="font-sans text-[10.5px] text-[color:var(--clay-deep)] font-semibold mt-1.5">
                by {new Date(offer.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* About */}
      {offer.description && (
        <section className="px-5 mt-8">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            ABOUT
          </span>
          <p className="mt-3 font-serif italic text-[15px] leading-[1.55] text-[color:var(--ink-mid)]">
            &ldquo;{offer.description}&rdquo;
          </p>
          <p className="mt-3 font-mono text-[9.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
            — {businessName.toUpperCase()}
          </p>
        </section>
      )}

      {/* Logistics */}
      <section className="px-5 mt-8">
        <div className="border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
          {offer.address && (
            <div className="flex items-center gap-3 px-4 py-3">
              <MapPin className="h-4 w-4 text-[color:var(--ink-soft)] shrink-0" strokeWidth={1.6} />
              <div className="flex-1">
                <p className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                  LOCATION
                </p>
                <p className="text-[13.5px] text-[color:var(--ink)] font-medium mt-0.5">
                  {offer.address}
                </p>
              </div>
            </div>
          )}
          {offer.deadline && (
            <div className="flex items-center gap-3 px-4 py-3">
              <Calendar className="h-4 w-4 text-[color:var(--ink-soft)] shrink-0" strokeWidth={1.6} />
              <div className="flex-1">
                <p className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--ink-soft)]">
                  DEADLINE
                </p>
                <p className="text-[13.5px] text-[color:var(--ink)] font-medium mt-0.5">
                  {new Date(offer.deadline).toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 pt-6 pb-8 px-5 bg-gradient-to-t from-[color:var(--cream)] via-[color:var(--cream)] to-transparent">
        <div className="max-w-md mx-auto">
          <CreateKnotButton
            offerId={offer.id}
            hasApplied={hasApplied}
            applicationStatus={existingApp?.status ?? null}
          />
        </div>
      </div>
    </div>
  );
}
