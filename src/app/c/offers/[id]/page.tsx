import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar } from "@/components/ui";
import { MapPin, Calendar, FileText, Camera, Shield } from "lucide-react";
import { notFound } from "next/navigation";
import CreateKnotButton from "./CreateKnotButton";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OfferDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: offer } = await supabase
    .from("offers")
    .select("*, business:business_profiles(business_name, logo_url, city, avg_rating, description, category)")
    .eq("id", id)
    .single();

  if (!offer) notFound();

  // Check if creator already applied
  const { data: existingApp } = await supabase
    .from("applications")
    .select("id, status")
    .eq("offer_id", id)
    .eq("creator_id", user.id)
    .maybeSingle();

  const hasApplied = !!existingApp;

  return (
    <div className="px-4 py-6 space-y-4">
      {/* Business info */}
      <Card className="space-y-4">
        <div className="flex items-start gap-3">
          <Avatar
            src={offer.business?.logo_url}
            name={offer.business?.business_name ?? "Business"}
            size="lg"
          />
          <div className="flex-1">
            <h1 className="text-lg font-serif font-semibold">{offer.title}</h1>
            <p className="text-sm text-muted-foreground">
              {offer.business?.business_name}
            </p>
            {offer.business?.avg_rating > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {offer.business.avg_rating.toFixed(1)} avg rating
              </p>
            )}
          </div>
        </div>

        {offer.category && <Badge variant="secondary">{offer.category}</Badge>}
      </Card>

      {/* Details */}
      <Card className="space-y-4">
        <div>
          <h2 className="text-sm font-medium mb-1">About this offer</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {offer.description}
          </p>
        </div>

        <div className="space-y-2">
          {offer.deliverables && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Deliverables</p>
                <p className="text-sm text-muted-foreground">{offer.deliverables}</p>
              </div>
            </div>
          )}

          {offer.compensation && (
            <div className="flex items-start gap-2">
              <Camera className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Compensation</p>
                <p className="text-sm text-muted-foreground">{offer.compensation}</p>
              </div>
            </div>
          )}

          {offer.usage_rights && (
            <div className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Usage Rights</p>
                <p className="text-sm text-muted-foreground">{offer.usage_rights}</p>
              </div>
            </div>
          )}

          {offer.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Location</p>
                <p className="text-sm text-muted-foreground">{offer.address}</p>
              </div>
            </div>
          )}

          {offer.deadline && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium">Deadline</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(offer.deadline).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Apply section */}
      <CreateKnotButton
        offerId={offer.id}
        hasApplied={hasApplied}
        applicationStatus={existingApp?.status ?? null}
      />
    </div>
  );
}
