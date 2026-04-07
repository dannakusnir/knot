import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { OFFER_STATUSES, APPLICATION_STATUSES } from "@/lib/constants";
import { Users, MapPin, Calendar, FileText } from "lucide-react";
import { notFound } from "next/navigation";
import ApplicantActions from "./ApplicantActions";
import type { OfferStatus, ApplicationStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BusinessOfferDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: offer } = await supabase
    .from("offers")
    .select("*")
    .eq("id", id)
    .eq("business_id", user.id)
    .single();

  if (!offer) notFound();

  const { data: applications } = await supabase
    .from("applications")
    .select("*, creator:creator_profiles(id, bio, instagram_handle, follower_count, avg_rating, city, categories, profile:profiles(full_name, avatar_url))")
    .eq("offer_id", id)
    .order("created_at", { ascending: false });

  const pendingApps = applications?.filter((a) => a.status === "pending") ?? [];
  const connectedApps = applications?.filter((a) => a.status === "approved") ?? [];
  const declinedApps = applications?.filter((a) => a.status === "declined") ?? [];

  return (
    <div className="px-4 py-6 space-y-6">
      {/* Offer header */}
      <Card className="space-y-3">
        <div className="flex items-start justify-between">
          <h1 className="text-lg font-serif font-semibold">{offer.title}</h1>
          <Badge variant={offer.status === "active" ? "success" : "secondary"}>
            {OFFER_STATUSES[offer.status as OfferStatus]}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{offer.description}</p>

        <div className="space-y-2 text-sm text-muted-foreground">
          {offer.deliverables && (
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{offer.deliverables}</span>
            </div>
          )}
          {offer.address && (
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{offer.address}</span>
            </div>
          )}
          {offer.deadline && (
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{new Date(offer.deadline).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </Card>

      {/* Applicants */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          <Users className="h-4 w-4" />
          Pending Applicants ({pendingApps.length})
        </h2>

        {pendingApps.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No pending applicants"
            description="Applicants will appear here when creators apply"
          />
        ) : (
          pendingApps.map((app) => (
            <Card key={app.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar
                  src={app.creator?.profile?.avatar_url}
                  name={app.creator?.profile?.full_name ?? "Creator"}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {app.creator?.profile?.full_name}
                  </p>
                  {app.creator?.instagram_handle && (
                    <p className="text-xs text-muted-foreground">
                      @{app.creator.instagram_handle}
                    </p>
                  )}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    {app.creator?.follower_count > 0 && (
                      <span>{app.creator.follower_count.toLocaleString()} followers</span>
                    )}
                    {app.creator?.avg_rating > 0 && (
                      <span>{app.creator.avg_rating.toFixed(1)} rating</span>
                    )}
                    {app.creator?.city && <span>{app.creator.city}</span>}
                  </div>
                </div>
              </div>

              {app.message && (
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {app.message}
                </p>
              )}

              <ApplicantActions applicationId={app.id} offerId={offer.id} />
            </Card>
          ))
        )}
      </section>

      {/* Connected */}
      {connectedApps.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Connected ({connectedApps.length})
          </h2>
          {connectedApps.map((app) => (
            <Card key={app.id} className="flex items-center gap-3">
              <Avatar
                src={app.creator?.profile?.avatar_url}
                name={app.creator?.profile?.full_name ?? "Creator"}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {app.creator?.profile?.full_name}
                </p>
              </div>
              <Badge variant="success">Connected</Badge>
            </Card>
          ))}
        </section>
      )}

      {/* Declined */}
      {declinedApps.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Declined ({declinedApps.length})
          </h2>
          {declinedApps.map((app) => (
            <Card key={app.id} className="flex items-center gap-3 opacity-60">
              <Avatar
                src={app.creator?.profile?.avatar_url}
                name={app.creator?.profile?.full_name ?? "Creator"}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {app.creator?.profile?.full_name}
                </p>
              </div>
              <Badge variant="destructive">Declined</Badge>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
