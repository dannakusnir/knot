import { requireRole } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card, EmptyState } from "@/components/ui";
import { MapPin } from "lucide-react";
import MapView from "@/components/map/MapView";

export default async function MapPage() {
  await requireRole("creator");
  const supabase = await createClient();

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

  if (!mapboxToken) {
    return (
      <div className="px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-semibold">Map</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover offers near you
          </p>
        </div>
        <Card className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center">
            <MapPin className="h-7 w-7 text-primary" />
          </div>
          <EmptyState
            icon={MapPin}
            title="Map coming soon"
            description="We're building an interactive map to help you find offers near you. Stay tuned!"
          />
        </Card>
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
    <div className="fixed inset-0 top-14 bottom-16 bg-[#EDE8E2]">
      {mapOffers.length === 0 ? (
        <div className="flex items-center justify-center h-full px-4">
          <EmptyState
            icon={MapPin}
            title="No offers on map"
            description="Businesses need to add their location for offers to show on the map"
          />
        </div>
      ) : (
        <MapView offers={mapOffers} token={mapboxToken} />
      )}
    </div>
  );
}
