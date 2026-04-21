export const KNOT_STATUSES = {
  connected: "Tied",
  in_progress: "In motion",
  proof_submitted: "Awaiting review",
  revision_requested: "Revision",
  completed: "Complete",
  cancelled: "Cancelled",
} as const;

export const APPLICATION_STATUSES = {
  pending: "Pending",
  approved: "Tied",
  declined: "Passed",
} as const;

export const OFFER_STATUSES = {
  active: "Open",
  paused: "Paused",
  closed: "Closed",
} as const;

export const CREATOR_APPROVAL_STATUSES = {
  pending: "Under review",
  approved: "Approved",
  rejected: "Passed",
} as const;

export const ACTION_LABELS = {
  apply: "Apply for this knot",
  approve: "Tie the knot",
  decline: "Pass",
  submit_proof: "Submit proof",
  approve_proof: "Approve",
  request_revision: "Ask for a revision",
} as const;

export const OFFER_CATEGORIES = [
  "Restaurant",
  "Cafe",
  "Salon & Spa",
  "Fitness",
  "Fashion",
  "Retail",
  "Hotel & Travel",
  "Health & Wellness",
  "Entertainment",
  "Other",
] as const;

export const DELIVERABLE_TYPES = [
  "Instagram Stories",
  "Instagram Reel",
  "Instagram Post",
  "TikTok Video",
  "Google Review",
  "Blog Post",
  "Photo Package",
  "Video Package",
] as const;

export const USAGE_RIGHTS = [
  "Organic only",
  "Organic + Ads",
  "Full usage rights",
] as const;

export const MIN_FOLLOWERS = 500;
export const MIN_PORTFOLIO_ITEMS = 3;
export const KNOTS_TO_VERIFY = 3;
export const GUARANTEE_CREDITS = 2;
export const LOW_RATING_THRESHOLD = 3;
