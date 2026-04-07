import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Button, EmptyState } from "@/components/ui";
import { OFFER_STATUSES } from "@/lib/constants";
import { Plus, Users, Megaphone } from "lucide-react";
import Link from "next/link";
import type { OfferStatus } from "@/types";

export default async function BusinessOffersPage() {
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: offers } = await supabase
    .from("offers")
    .select("*, applications:applications(count)")
    .eq("business_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-semibold">My Offers</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your offers and view applicants
          </p>
        </div>
        <Link href="/b/offers/new">
          <Button size="sm">
            <Plus className="h-4 w-4 mr-1" />
            New
          </Button>
        </Link>
      </div>

      {!offers || offers.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="No offers yet"
          description="Create your first offer to start connecting with creators"
        />
      ) : (
        <div className="space-y-3">
          {offers.map((offer) => {
            const appCount = offer.applications?.[0]?.count ?? 0;
            return (
              <Link key={offer.id} href={`/b/offers/${offer.id}`}>
                <Card className="space-y-2 active:scale-[0.98] transition-transform">
                  <div className="flex items-start justify-between">
                    <h3 className="text-sm font-semibold">{offer.title}</h3>
                    <Badge
                      variant={offer.status === "active" ? "success" : "secondary"}
                    >
                      {OFFER_STATUSES[offer.status as OfferStatus]}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {offer.description}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    {appCount} applicant{appCount !== 1 ? "s" : ""}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
