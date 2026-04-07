export type UserRole = "creator" | "business" | "admin";

export type CreatorApprovalStatus = "pending" | "approved" | "rejected";

export type OfferStatus = "active" | "paused" | "closed";

export type ApplicationStatus = "pending" | "approved" | "declined";

export type KnotStatus =
  | "connected"
  | "in_progress"
  | "proof_submitted"
  | "revision_requested"
  | "completed"
  | "cancelled";

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  avatar_url: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreatorProfile {
  id: string;
  bio: string | null;
  instagram_handle: string | null;
  tiktok_handle: string | null;
  portfolio_url: string | null;
  portfolio_urls: string[];
  categories: string[];
  follower_count: number;
  location_lat: number | null;
  location_lng: number | null;
  city: string | null;
  completion_rate: number;
  avg_rating: number;
  total_ratings: number;
  total_knots: number;
  verified: boolean;
  trust_score: number;
  approval_status: CreatorApprovalStatus;
  profile?: Profile;
}

export interface BusinessProfile {
  id: string;
  business_name: string;
  description: string | null;
  category: string | null;
  website: string | null;
  address: string | null;
  location_lat: number | null;
  location_lng: number | null;
  city: string | null;
  logo_url: string | null;
  avg_rating: number;
  total_ratings: number;
  total_knots: number;
  guarantee_credits: number;
  profile?: Profile;
}

export interface Offer {
  id: string;
  business_id: string;
  title: string;
  description: string;
  deliverables: string;
  compensation: string | null;
  usage_rights: string | null;
  deadline: string | null;
  category: string | null;
  location_lat: number | null;
  location_lng: number | null;
  address: string | null;
  max_creators: number;
  status: OfferStatus;
  created_at: string;
  updated_at: string;
  business?: BusinessProfile;
  _count?: { applications: number };
}

export interface Application {
  id: string;
  offer_id: string;
  creator_id: string;
  message: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  offer?: Offer;
  creator?: CreatorProfile;
}

export interface Knot {
  id: string;
  application_id: string;
  offer_id: string;
  creator_id: string;
  business_id: string;
  status: KnotStatus;
  proof_urls: string[];
  proof_notes: string | null;
  deadline: string | null;
  completed_at: string | null;
  is_guarantee_redo: boolean;
  admin_assigned: boolean;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  offer?: Offer;
  creator?: CreatorProfile;
  business?: BusinessProfile;
}

export interface Rating {
  id: string;
  knot_id: string;
  rater_id: string;
  rated_id: string;
  score: number;
  comment: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string | null;
  knot_id: string | null;
  offer_id: string | null;
  read: boolean;
  created_at: string;
}
