import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Avatar, Timeline, type TimelineStep } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { notFound } from "next/navigation";
import BusinessKnotActions from "./BusinessKnotActions";
import KnotChat from "@/components/chat/KnotChat";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import type { KnotStatus } from "@/types";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_ORDER: KnotStatus[] = [
  "connected",
  "in_progress",
  "proof_submitted",
  "completed",
];

function activeIndex(status: KnotStatus): number {
  if (status === "revision_requested") return 2;
  if (status === "cancelled") return 0;
  const i = STATUS_ORDER.indexOf(status);
  return i === -1 ? 0 : i;
}

export default async function BusinessKnotDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("business");
  const supabase = await createClient();

  const { data: knot } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title, description, deliverables, compensation, deadline), creator:creator_profiles(id, instagram_handle, profile:profiles(full_name, avatar_url))"
    )
    .eq("id", id)
    .eq("business_id", user.id)
    .single();

  if (!knot) notFound();

  const canReview = knot.status === "proof_submitted";
  const status = knot.status as KnotStatus;
  const active = activeIndex(status);
  const creatorName = knot.creator?.profile?.full_name ?? "Creator";

  const steps: TimelineStep[] = [
    {
      label: "Applied",
      meta: new Date(knot.created_at).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      }),
    },
    { label: "Connected", meta: active >= 1 ? "You approved" : "Pending" },
    { label: "Content in progress", meta: active >= 2 ? "Done" : "Pending" },
    {
      label: "Proof submitted",
      meta: status === "proof_submitted" ? "Waiting on you" : active >= 2 ? "Submitted" : "",
    },
    {
      label: "Completed",
      meta: knot.completed_at
        ? new Date(knot.completed_at).toLocaleDateString()
        : "",
    },
  ];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)] pb-24">
      {/* Top */}
      <div className="flex items-center gap-3 px-5 pt-14">
        <Link
          href="/b/dashboard"
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </Link>
        <div className="flex-1 text-center">
          <div className="font-mono text-[9px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            KNOT № {String(knot.id).slice(0, 4).toUpperCase()}
          </div>
          <div className="font-serif text-[17px] font-semibold text-[color:var(--ink)] mt-0.5 truncate">
            {creatorName}
          </div>
        </div>
        <div className="w-10 h-10" />
      </div>

      {/* Header card */}
      <div className="px-5 mt-6">
        <div className="flex items-center gap-3">
          <Avatar
            src={knot.creator?.profile?.avatar_url}
            name={creatorName}
            size="lg"
          />
          <div className="flex-1 min-w-0">
            <h1 className="font-serif italic text-[24px] font-medium text-[color:var(--ink)] leading-[1.1] tracking-[-0.01em] truncate">
              {creatorName}
            </h1>
            {knot.creator?.instagram_handle && (
              <p className="font-sans text-[12.5px] text-[color:var(--ink-mid)] font-medium mt-0.5">
                @{knot.creator.instagram_handle}
              </p>
            )}
          </div>
          <span className="font-mono text-[9px] font-bold tracking-[0.18em] uppercase text-[color:var(--sage-deep)] bg-[color:var(--sage-tint)] px-2.5 py-1 rounded-full">
            {KNOT_STATUSES[status]}
          </span>
        </div>

        <p className="mt-4 font-serif italic text-[15px] leading-[1.5] text-[color:var(--ink-mid)]">
          &ldquo;{knot.offer?.title}&rdquo;
        </p>
      </div>

      <div className="px-5 mt-8 space-y-6">
        {/* Action tile */}
        {canReview && (
          <div className="bg-[color:var(--clay-tint)] border border-[color:var(--clay-soft)] rounded-[18px] p-5">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
              YOUR MOVE
            </span>
            <p className="mt-2 font-serif italic text-[20px] leading-[1.25] text-[color:var(--ink)]">
              Review the proof below and approve or request a revision.
            </p>
          </div>
        )}

        {/* Timeline */}
        <section>
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            PROGRESS
          </span>
          <div className="mt-4">
            <Timeline steps={steps} active={active} />
          </div>
        </section>

        {/* Trade */}
        <section>
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            THE TRADE
          </span>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] rounded-[14px] p-3.5">
              <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)]">
                YOU GIVE
              </div>
              <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
                {knot.offer?.compensation || "—"}
              </p>
            </div>
            <div className="bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] rounded-[14px] p-3.5">
              <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--clay-deep)]">
                YOU GET
              </div>
              <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
                {knot.offer?.deliverables || "—"}
              </p>
            </div>
          </div>
        </section>

        {/* Submitted proof */}
        {knot.proof_urls && knot.proof_urls.length > 0 && (
          <section>
            <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
              PROOF SUBMITTED
            </span>
            <div className="mt-3 border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
              {knot.proof_urls.map((url: string, i: number) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 active:opacity-60 transition-opacity"
                >
                  <ExternalLink className="h-4 w-4 text-[color:var(--sage-deep)] shrink-0" strokeWidth={1.6} />
                  <span className="font-sans text-[13px] text-[color:var(--sage-deep)] font-medium truncate underline underline-offset-2">
                    {url}
                  </span>
                </a>
              ))}
            </div>
            {knot.proof_notes && (
              <p className="mt-3 font-serif italic text-[14px] leading-[1.55] text-[color:var(--ink-mid)]">
                &ldquo;{knot.proof_notes}&rdquo;
              </p>
            )}
          </section>
        )}

        {/* Actions */}
        {canReview && (
          <BusinessKnotActions
            knotId={knot.id}
            creatorId={knot.creator_id}
            creatorName={creatorName}
          />
        )}

        {/* Chat */}
        {status !== "cancelled" && (
          <section>
            <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
              CONVERSATION
            </span>
            <div className="mt-3">
              <KnotChat
                knotId={knot.id}
                currentUserId={user.id}
                otherName={creatorName}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
