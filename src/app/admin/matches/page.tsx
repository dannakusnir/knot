import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { Megaphone } from "lucide-react";
import ManualMatchAction from "./ManualMatchAction";

export default async function AdminMatchesPage() {
  await requireAdmin();
  const supabase = await createClient();

  // Get active offers
  const { data: offers } = await supabase
    .from("offers")
    .select("*, business:business_profiles(business_name, logo_url, city)")
    .eq("status", "active")
    .order("created_at", { ascending: false });

  // Get approved creators without active knots
  const { data: availableCreators } = await supabase
    .from("creator_profiles")
    .select("*, profile:profiles(full_name, avatar_url, email)")
    .eq("approval_status", "approved")
    .order("trust_score", { ascending: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Manual Matching</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Match creators to offers manually
        </p>
      </div>

      {/* Active offers */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Active Offers ({offers?.length ?? 0})
        </h2>

        {!offers || offers.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title="No active offers"
            description="There are no offers available for matching"
          />
        ) : (
          offers.map((offer) => (
            <Card key={offer.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar
                  src={offer.business?.logo_url}
                  name={offer.business?.business_name ?? "Business"}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold">{offer.title}</h3>
                  <p className="text-xs text-muted-foreground">
                    {offer.business?.business_name}
                    {offer.business?.city ? ` - ${offer.business.city}` : ""}
                  </p>
                </div>
                {offer.category && (
                  <Badge variant="secondary">{offer.category}</Badge>
                )}
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {offer.description}
              </p>

              <ManualMatchAction
                offerId={offer.id}
                businessId={offer.business_id}
                creators={
                  availableCreators?.map((c) => ({
                    id: c.id,
                    name: c.profile?.full_name ?? "Unknown",
                    instagram: c.instagram_handle,
                    trustScore: c.trust_score,
                  })) ?? []
                }
              />
            </Card>
          ))
        )}
      </section>
    </div>
  );
}
