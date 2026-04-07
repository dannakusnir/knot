import { requireRole } from "@/lib/auth";
import { Card, EmptyState } from "@/components/ui";
import { MapPin } from "lucide-react";

export default async function MapPage() {
  await requireRole("creator");

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
