import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { Timeline, type TimelineStep } from "@/components/ui";
import { KNOT_STATUSES } from "@/lib/constants";
import { notFound } from "next/navigation";
import ProofUpload from "@/components/knots/ProofUpload";
import KnotChat from "@/components/chat/KnotChat";
import { ArrowLeft, MessageSquare, Upload } from "lucide-react";
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

function timeLeft(deadline: string | null): string | null {
  if (!deadline) return null;
  const diffMs = new Date(deadline).getTime() - Date.now();
  if (diffMs <= 0) return "overdue";
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24);
  if (days > 0) return `${days}d ${hours}h LEFT`;
  return `${hours}h LEFT`;
}

export default async function CreatorKnotDetailPage({ params }: Props) {
  const { id } = await params;
  const user = await requireRole("creator");
  const supabase = await createClient();

  const { data: knot } = await supabase
    .from("knots")
    .select(
      "*, offer:offers(title, description, deliverables, compensation, address, deadline), business:business_profiles(business_name, logo_url, city)"
    )
    .eq("id", id)
    .eq("creator_id", user.id)
    .single();

  if (!knot) notFound();

  const canUploadProof = ["connected", "in_progress", "revision_requested"].includes(
    knot.status
  );

  const status = knot.status as KnotStatus;
  const active = activeIndex(status);
  const remaining = timeLeft(knot.offer?.deadline ?? knot.deadline);

  const steps: TimelineStep[] = [
    {
      label: "Applied",
      meta: new Date(knot.created_at).toLocaleString("en-US", {
        weekday: "short",
        hour: "numeric",
        minute: "2-digit",
      }),
    },
    {
      label: `Accepted by ${knot.business?.business_name ?? "Business"}`,
      meta: active >= 1 ? "Confirmed" : "Waiting",
    },
    {
      label: "Visit & shoot",
      meta: active >= 2 ? "Done" : "Pending",
    },
    {
      label: "Submit content",
      meta:
        status === "proof_submitted"
          ? "Submitted"
          : knot.offer?.deadline
          ? `Due ${new Date(knot.offer.deadline).toLocaleDateString("en-US", {
              weekday: "short",
              hour: "numeric",
            })}`
          : "",
    },
    {
      label: "Completed",
      meta: knot.completed_at
        ? new Date(knot.completed_at).toLocaleDateString()
        : "",
    },
  ];

  return (
    <div className="min-h-dvh bg-[color:var(--cream)]">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-5 pt-14">
        <Link
          href="/c/dashboard"
          className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center"
        >
          <ArrowLeft className="h-[18px] w-[18px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </Link>
        <div className="flex-1 text-center">
          <div className="font-mono text-[9px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            KNOT № {String(knot.id).slice(0, 4).toUpperCase()}
          </div>
          <div className="font-serif text-[17px] font-semibold text-[color:var(--ink)] mt-0.5">
            {knot.business?.business_name}
          </div>
        </div>
        <div className="w-10 h-10 rounded-full bg-[color:var(--paper)] border border-[color:var(--line)] flex items-center justify-center">
          <MessageSquare className="h-[17px] w-[17px] text-[color:var(--ink)]" strokeWidth={1.6} />
        </div>
      </div>

      <div className="px-5 pt-6 pb-28 space-y-6">
        {/* Action tile */}
        {canUploadProof && (
          <div className="bg-[color:var(--clay-tint)] border border-[color:var(--clay-soft)] rounded-[18px] p-5">
            <div className="flex justify-between items-center">
              <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[color:var(--clay-deep)]">
                {status === "revision_requested" ? "REVISION NEEDED" : "ACTION NEEDED"}
              </span>
              {remaining && (
                <span className="font-mono text-[10px] font-bold tracking-[0.15em] text-[color:var(--clay-deep)]">
                  {remaining}
                </span>
              )}
            </div>
            <p className="mt-2 font-serif italic text-[20px] leading-[1.25] text-[color:var(--ink)]">
              {status === "revision_requested"
                ? knot.admin_notes || "Please revise and resubmit your content."
                : `Submit your ${knot.offer?.deliverables || "content"}${
                    knot.offer?.deadline
                      ? ` by ${new Date(knot.offer.deadline).toLocaleDateString("en-US", {
                          weekday: "long",
                        })}.`
                      : "."
                  }`}
            </p>
          </div>
        )}

        {/* Status (non-actionable) */}
        {!canUploadProof && (
          <div className="bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] rounded-[18px] p-5">
            <span className="font-mono text-[10px] font-bold tracking-[0.22em] text-[color:var(--sage-deep)]">
              {KNOT_STATUSES[status]?.toUpperCase()}
            </span>
            <p className="mt-2 font-serif italic text-[20px] leading-[1.25] text-[color:var(--ink)]">
              {status === "completed" && "Knot tied. Great work."}
              {status === "proof_submitted" && "Submitted. Waiting for review."}
              {status === "cancelled" && "This knot was cancelled."}
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

        {/* The Trade */}
        <section>
          <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
            THE TRADE
          </span>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-[color:var(--sage-tint)] border border-[color:var(--sage-soft)] rounded-[14px] p-3.5">
              <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--sage-deep)]">
                YOU GET
              </div>
              <p className="font-serif italic text-[15px] text-[color:var(--ink)] mt-1 leading-[1.2]">
                {knot.offer?.compensation || "—"}
              </p>
            </div>
            <div className="bg-[color:var(--clay-soft)] border border-[color:var(--clay-tint)] rounded-[14px] p-3.5">
              <div className="font-mono text-[8.5px] font-bold tracking-[0.18em] text-[color:var(--clay-deep)]">
                YOU GIVE
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
            <span className="font-mono text-[9.5px] font-bold tracking-[0.22em] text-[color:var(--ink-soft)]">
              SUBMITTED
            </span>
            <div className="mt-3 border border-[color:var(--line)] rounded-[14px] bg-[color:var(--surface)] divide-y divide-[color:var(--line-soft)]">
              {knot.proof_urls.map((url: string, i: number) => (
                <a
                  key={i}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-3 text-[13px] text-[color:var(--sage-deep)] underline underline-offset-2 truncate"
                >
                  <Upload className="h-4 w-4 shrink-0" strokeWidth={1.6} />
                  <span className="truncate">{url}</span>
                </a>
              ))}
            </div>
            {knot.proof_notes && (
              <p className="mt-2 text-[13px] text-[color:var(--ink-mid)] font-medium">
                {knot.proof_notes}
              </p>
            )}
          </section>
        )}

        {/* Upload */}
        {canUploadProof && (
          <ProofUpload knotId={knot.id} existingProofs={knot.proof_urls ?? []} />
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
                otherName={knot.business?.business_name ?? "Business"}
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
