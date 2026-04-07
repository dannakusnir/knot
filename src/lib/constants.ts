export const KNOT_STATUSES = {
  connected: "Connected",
  in_progress: "In Progress",
  proof_submitted: "Proof Submitted",
  revision_requested: "Revision Requested",
  completed: "Completed",
  cancelled: "Cancelled",
} as const;

export const APPLICATION_STATUSES = {
  pending: "Pending",
  approved: "Connected",
  declined: "Declined",
} as const;

export const OFFER_STATUSES = {
  active: "Active",
  paused: "Paused",
  closed: "Closed",
} as const;

export const CREATOR_APPROVAL_STATUSES = {
  pending: "Under Review",
  approved: "Approved",
  rejected: "Rejected",
} as const;

export const ACTION_LABELS = {
  apply: "Create Knot",
  approve: "Connect",
  decline: "Decline",
  submit_proof: "Complete your Knot",
  approve_proof: "Approve Knot",
  request_revision: "Request Revision",
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
