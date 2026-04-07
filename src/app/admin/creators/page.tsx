import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth";
import { Card, Badge, Avatar, EmptyState } from "@/components/ui";
import { Users } from "lucide-react";
import { CREATOR_APPROVAL_STATUSES } from "@/lib/constants";
import type { CreatorApprovalStatus } from "@/types";
import CreatorApprovalActions from "./CreatorApprovalActions";

export default async function AdminCreatorsPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: creators } = await supabase
    .from("creator_profiles")
    .select("*, profile:profiles(full_name, avatar_url, email)")
    .order("created_at", { ascending: false });

  const pendingCreators = creators?.filter((c) => c.approval_status === "pending") ?? [];
  const approvedCreators = creators?.filter((c) => c.approval_status === "approved") ?? [];
  const rejectedCreators = creators?.filter((c) => c.approval_status === "rejected") ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-semibold">Creator Management</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review and approve creator profiles
        </p>
      </div>

      {/* Pending queue */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium text-muted-foreground">
          Pending Approval ({pendingCreators.length})
        </h2>

        {pendingCreators.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No pending creators"
            description="All creator applications have been reviewed"
          />
        ) : (
          pendingCreators.map((creator) => (
            <Card key={creator.id} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar
                  src={creator.profile?.avatar_url}
                  name={creator.profile?.full_name ?? "Creator"}
                  size="md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold">
                    {creator.profile?.full_name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {creator.profile?.email}
                  </p>
                </div>
                <Badge variant="secondary">
                  {CREATOR_APPROVAL_STATUSES[creator.approval_status as CreatorApprovalStatus]}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {creator.instagram_handle && (
                  <div>
                    <span className="text-muted-foreground">Instagram: </span>
                    @{creator.instagram_handle}
                  </div>
                )}
                {creator.follower_count > 0 && (
                  <div>
                    <span className="text-muted-foreground">Followers: </span>
                    {creator.follower_count.toLocaleString()}
                  </div>
                )}
                {creator.city && (
                  <div>
                    <span className="text-muted-foreground">City: </span>
                    {creator.city}
                  </div>
                )}
                {creator.categories && creator.categories.length > 0 && (
                  <div>
                    <span className="text-muted-foreground">Categories: </span>
                    {creator.categories.join(", ")}
                  </div>
                )}
              </div>

              {creator.bio && (
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {creator.bio}
                </p>
              )}

              {creator.portfolio_urls && creator.portfolio_urls.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium">Portfolio</p>
                  {creator.portfolio_urls.map((url: string, i: number) => (
                    <a
                      key={i}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-xs text-primary-hover underline truncate"
                    >
                      {url}
                    </a>
                  ))}
                </div>
              )}

              <CreatorApprovalActions creatorId={creator.id} />
            </Card>
          ))
        )}
      </section>

      {/* Approved creators */}
      {approvedCreators.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Approved ({approvedCreators.length})
          </h2>
          {approvedCreators.map((creator) => (
            <Card key={creator.id} className="flex items-center gap-3">
              <Avatar
                src={creator.profile?.avatar_url}
                name={creator.profile?.full_name ?? "Creator"}
                size="sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {creator.profile?.full_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {creator.instagram_handle ? `@${creator.instagram_handle}` : creator.profile?.email}
                </p>
              </div>
              <Badge variant="success">Approved</Badge>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
}
