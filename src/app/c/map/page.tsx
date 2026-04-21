import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { EmptyState } from "@/components/ui";
import { MapPin } from "lucide-react";
import MapView from "@/components/map/MapView";

export default async function MapPage() {
  await requireRole("creator");
  const supabase = await createClient();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="min-h-dvh bg-[color:var(--cream)]">
        <div className="px-5 pt-7 pb-3">
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            NEARBY
          </span>
          <h1 className="mt-2 font-serif italic text-[40px] font-normal leading-[0.95] tracking-[-0.025em] text-[color:var(--ink)]">
            Map.
          </h1>
        </div>
        <div className="pt-4">
          <EmptyState
            icon={MapPin}
            tone="sage"
            title="Soon."
            description="The map is on the way. For now, browse offers in Discover."
          />
        </div>
      </div>
    );
  }

  // Fetch offers with business location data
  const { data: offers } = await supabase
    .from("offers")
    .select("id, title, compensation, category, business_id, business:business_profiles(business_name, city, location_lat, location_lng, address)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Group by business and filter ones with coordinates
  const businessMap = new Map<string, {
    id: string;
    title: string;
    compensation: string | null;
    category: string | null;
    business_name: string;
    city: string | null;
    lat: number;
    lng: number;
    offer_count: number;
  }>();

  (offers || []).forEach((offer) => {
    const bizRaw = offer.business as unknown;
    const biz = (Array.isArray(bizRaw) ? bizRaw[0] : bizRaw) as { business_name: string; city: string | null; location_lat: number | null; location_lng: number | null } | null;
    if (!biz?.location_lat || !biz?.location_lng) return;

    const existing = businessMap.get(offer.business_id);
    if (existing) {
      existing.offer_count += 1;
    } else {
      businessMap.set(offer.business_id, {
        id: offer.id,
        title: offer.title,
        compensation: offer.compensation,
        category: offer.category,
        business_name: biz.business_name,
        city: biz.city,
        lat: biz.location_lat,
        lng: biz.location_lng,
        offer_count: 1,
      });
    }
  });

  const mapOffers = Array.from(businessMap.values());

  return (
    <div className="fixed inset-0 top-14 bottom-16 bg-[color:var(--cream)]">
      {mapOffers.length === 0 ? (
        <div className="flex items-center justify-center h-full px-4">
          <EmptyState
            icon={MapPin}
            tone="sage"
            title="No pins yet"
            description="Businesses need to add their location before offers show on the map."
          />
        </div>
      ) : (
        <MapView offers={mapOffers} token={mapboxToken} />
      )}
    </div>
  );
}
