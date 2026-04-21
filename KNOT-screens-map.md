# KNOT — Complete Screen Map
**For handoff to designer — all screens, current + planned, including states**

---

## 📱 0. SHARED / SYSTEM SCREENS

### 0.1 Splash screen
- Full-screen warm cream background
- Animated knot logo (two loops tying together, 1.5s loop)
- Shows on PWA launch before first render

### 0.2 Loading states
- **Skeleton loader** — shimmer on cards (Explore, Dashboard lists)
- **Inline spinner** — for button actions (sending app, uploading proof)
- **Page fade-in** — 200ms ease-in on every route change

### 0.3 Empty states (needed for every list)
- **No offers yet** (Explore)
- **No knots yet** (Dashboard)
- **No notifications** (bell)
- **No applications** (Business offer applicants)
- **No messages yet** (Chat)
- **No creators** (Admin)
- **No offers on map** (Map)

### 0.4 Error states
- **Network error** — "We can't reach you right now"
- **404** — "This knot doesn't exist"
- **403** — "Not allowed here"
- **Generic error** — with retry button

### 0.5 Offline indicator
- Thin banner top — "You're offline. Some features may not work."

### 0.6 Toast notifications
- Success (green), Error (coral), Info (sand) — top-right, 3s auto-dismiss

### 0.7 Celebration modal
- Confetti + knot icon when:
  - Application sent
  - Knot completed
  - First rating received
  - Reached verified status
  - 10 knots milestone

---

## 🚪 1. AUTH FLOW

### 1.1 Landing page `/`
- Hero: headline "Collaborations that feel like connections"
- Photo grid (3 images of businesses)
- 5-step "How it works"
- Full-width editorial photo
- "Built on trust" statement block
- Split card: "For Businesses" / "For Creators"
- Final CTA
- Footer

### 1.2 Login `/login`
- Logo + "Welcome back"
- Email + Password inputs
- "Sign In" button
- Link to signup
- **Error state** (wrong password)
- **Loading state** (button spinner)

### 1.3 Signup — Role selection `/signup`
- Logo + "Join KNOT"
- 2 big tiles: "I'm a Creator" / "I'm a Business"
- Link to login

### 1.4 Signup — Details `/signup` (step 2)
- Selected role pill at top
- Name, Email, Password
- "Create Account" button
- Back to role selection

### 1.5 Email verification *(future)*
- "Check your inbox"
- Illustration
- Resend button
- Skip for now (dev mode)

### 1.6 Forgot password *(future)*
- Email input
- Reset link sent confirmation

### 1.7 Reset password *(future)*
- New password + confirm
- Success state

---

## 📝 2. ONBOARDING

### 2.1 Creator onboarding `/onboarding/creator`
**Multi-step flow:**
- Step 1: Bio + city (with map pin location)
- Step 2: Categories (tags — food, beauty, lifestyle, fashion…)
- Step 3: Instagram handle + follower count + TikTok (optional)
- Step 4: Portfolio — 1-3 links
- Step 5: Profile photo upload
- Final: "We'll review and let you know!" confirmation

### 2.2 Business onboarding `/onboarding/business`
- Step 1: Business name + category
- Step 2: Description + website
- Step 3: Address + map pin
- Step 4: Logo upload
- Step 5: Social handles (Instagram)
- Final: "Let's create your first offer" CTA

### 2.3 Creator awaiting approval (creator logged in but pending)
- Lock icon
- "Your profile is under review"
- Timeline: submitted → reviewing → approved
- Share social to speed up?

### 2.4 Creator rejected *(future)*
- Reason + appeal button

---

## 🧭 3. CREATOR EXPERIENCE

### 3.1 Explore `/c/explore`
- Header + search bar *(future)*
- Filter chips: category, distance, compensation type *(future)*
- Feed of business cards with:
  - Image slider (swipeable)
  - Business name + category pill
  - Location + rating
  - Offers list inside card (tap to open)
- Pull to refresh
- **Empty state** — "No offers yet, check back soon"

### 3.2 Map `/c/map`
- Full-screen Mapbox
- Green pins with offer count per business
- Geolocate button
- Tap pin → bottom card with offer
- Filter button (by category, distance) *(future)*
- Search bar *(future)*

### 3.3 Offer detail `/c/offers/[id]`
- Hero image slider
- Business name + offer title overlay
- About the offer
- Deliverables, Compensation, Usage rights
- Location + map preview *(future)*
- Deadline countdown
- Business rating + recent reviews *(future)*
- "Create Knot" CTA (sticky bottom)
- Applied state — "You've already applied" with status

### 3.4 Apply / Create Knot (modal within offer detail)
- Message textarea
- Portfolio link preview *(future)*
- "Send Application" button
- Celebration on success

### 3.5 My Knots / Dashboard `/c/dashboard`
- Quick stats: total knots, avg rating, completion rate
- **Pending applications** (cards)
- **Active knots** (with status badges)
- **Completed knots** (faded)
- Filter tabs *(future)* — all / active / completed

### 3.6 Knot detail `/c/knots/[id]`
- Business header + status badge
- **Timeline** — visual progress (connected → in progress → proof → complete)
- Offer details recap
- **Revision notes** (if requested)
- **Submitted proof** (if exists)
- **Proof upload** component (if active)
- **Chat** with business (real-time)
- Cancel knot (with reason) *(future)*

### 3.7 Proof upload (within knot detail)
- Add multiple links (Instagram, TikTok, Drive)
- Notes textarea
- File upload *(future)* — images/video direct
- "Complete your Knot" button

### 3.8 Rate Business modal
- Stars
- Comment
- "Would you work with them again?" toggle *(future)*
- Submit

### 3.9 My Profile `/c/profile`
- Gradient header with avatar, name, city
- Verified badge (if verified)
- Bio + categories
- **Stats cards** (knots, rating, completion)
- **Trust score bar** with gradient
- Social handles
- Portfolio links *(future)*
- Edit profile button *(future)* → edit page
- Sign out

### 3.10 Edit profile `/c/profile/edit` *(future)*
- Same fields as onboarding, prefilled
- Save button

### 3.11 Notifications `/c/notifications`
- List of notifications with icons + colors by type
- Unread indicator (dot)
- "Mark all read"
- Tap → go to related knot/offer
- **Empty state** — "All caught up"

### 3.12 Saved offers `/c/saved` *(future)*
- Bookmark offers for later
- Cards same as Explore

### 3.13 Earnings history `/c/earnings` *(future — post-launch)*
- Total earned + breakdown
- List of completed knots with compensation
- Export CSV

### 3.14 Settings `/c/settings` *(future)*
- Account (email, password)
- Notifications preferences
- Privacy
- Language
- Delete account
- Help + Contact

---

## 🏪 4. BUSINESS EXPERIENCE

### 4.1 Dashboard `/b/dashboard`
- Stats grid (4 cards): active offers, pending apps, total knots, avg rating
- Quick actions: New Offer + My Offers
- Active knots list (last 5)
- **Empty state** — "Create your first offer"

### 4.2 My Offers `/b/offers`
- List of all offers with status
- Application count badge
- Filter: all / active / paused / closed *(future)*
- Floating "+" button to new offer

### 4.3 New Offer `/b/offers/new`
- Title, description, deliverables
- Compensation (free text or template)
- Usage rights dropdown
- Category, location (map)
- Deadline date picker
- Max creators slider
- Image upload *(future)* — for offer card
- Preview button *(future)*
- Publish button

### 4.4 Offer detail `/b/offers/[id]`
- Offer info (same as new form, editable)
- Stats: views, applications, knots created *(future)*
- Applicants section — see who applied
- Active knots for this offer
- Actions: pause / close / duplicate *(future)*

### 4.5 Applicants `/b/offers/[id]/applicants`
- List of creators who applied
- For each: avatar, name, trust score, Instagram link, message
- Quick preview of their portfolio *(future)*
- Connect / Decline buttons

### 4.6 Knots `/b/knots` *(future — currently part of dashboard)*
- All knots this business has
- Tabs: active / completed / cancelled
- Same card style

### 4.7 Knot detail `/b/knots/[id]`
- Creator header
- Timeline
- Deliverables recap
- **Submitted proof** (if any)
- **Review actions**: Approve / Request revision
- **Chat** with creator
- After approve → Rating modal

### 4.8 Rate Creator modal
- Stars + comment
- Submit

### 4.9 Business Profile `/b/profile`
- Business header with logo + address
- Bio + category
- Stats (knots done, avg rating)
- Guarantee credits *(future — visualize)*
- Social handles
- Edit profile button *(future)*
- Sign out

### 4.10 Edit business profile *(future)*

### 4.11 Notifications `/b/notifications`
- Same as creator notifications, business-focused events

### 4.12 Analytics `/b/analytics` *(future — post-launch)*
- Reach metrics from creator content
- Application quality trends
- Top performing offers
- ROI calculator *(future)*

### 4.13 Campaigns `/b/campaigns` *(future — bundles of offers)*
- Group offers into a campaign
- Goal setting
- Overall budget

### 4.14 Billing `/b/billing` *(future — when monetization starts)*
- Plan (free / pro)
- Payment method
- Invoices
- Usage

---

## 🛠 5. ADMIN PANEL

### 5.1 Admin dashboard `/admin/dashboard`
- Platform stats: total users, creators pending, active knots, completed today
- Quick actions
- Alerts (low-rated knots, guarantee claims)

### 5.2 Creators approval `/admin/creators`
- Tabs: pending / approved / rejected
- Creator cards with:
  - Profile info
  - Instagram preview *(future)*
  - Reason for approval/rejection
- Approve / Reject buttons

### 5.3 All Knots `/admin/knots`
- Every knot on platform
- Filter by status, date, city
- Tap into any knot for detail view

### 5.4 Manual Matching `/admin/matches`
- Offers with zero/low applications
- Suggest creator dropdown
- Manual match button

### 5.5 Guarantee Claims `/admin/guarantee`
- Knots flagged for redo
- Businesses with credits
- Assign replacement creator

### 5.6 Users `/admin/users` *(future)*
- All users, search, suspend

### 5.7 Reports `/admin/reports` *(future)*
- Abuse reports
- Disputes

### 5.8 Platform settings `/admin/settings` *(future)*
- Fee structures
- Featured offers management
- Announcements

---

## 🔮 6. FUTURE SCREENS (Year 1 Roadmap)

### 6.1 Messages inbox `/c/messages` + `/b/messages`
- List of all knot chats
- Unread counts
- Last message preview
- Search conversations

### 6.2 Search global `/search`
- Search creators / businesses / offers
- Filters + sort

### 6.3 Creator discovery for businesses `/b/discover`
- Browse creators
- Invite to apply to offer
- Filter by niche, followers, location

### 6.4 Reviews + testimonials page `/c/[username]` *(public creator profile)*
- Portfolio showcase
- All past knots with visible ratings
- "Work with me" CTA

### 6.5 Public business page `/b/[slug]`
- Business showcase
- Past knots gallery
- Current offers

### 6.6 Referral program `/referrals`
- Invite friends, earn credits

### 6.7 Onboarding tutorial (overlay)
- 4-step walkthrough on first login
- Skip option

### 6.8 Help center `/help`
- FAQs, articles, contact

### 6.9 Verification flow `/verify`
- Upload ID, selfie
- Instagram oauth
- Get blue check

### 6.10 Creator portfolio `/c/portfolio`
- Upload past work
- Case studies format
- Shareable link

### 6.11 Campaign page (for multi-creator campaigns)
- Grid of all creators on a campaign
- Progress tracking

### 6.12 Calendar view `/c/calendar` *(future)*
- See upcoming deadlines
- Schedule content

### 6.13 Community / Feed *(future — v2)*
- Creator success stories
- Featured collabs
- Industry tips

### 6.14 Templates library `/b/templates` *(future)*
- Pre-built offer templates for quick creation

### 6.15 AI-assisted offer writing *(future)*
- Autofill offer details
- Tone suggestions

### 6.16 Payments / escrow *(future — when monetization)*
- Stripe integration for paid collabs
- Escrow for cash compensation

### 6.17 Brand guidelines upload *(future)*
- Business uploads brand assets
- Creators see them in knot detail

---

## 📐 7. RESPONSIVE BEHAVIOR

### Mobile-first priorities
- All screens designed for 375px width (iPhone SE / min)
- Max content width 512px on larger screens
- Bottom nav fixed on mobile
- Side nav on desktop *(future)*

### Desktop version *(future — v2)*
- Split view on knot detail (info + chat)
- Side panel instead of bottom nav
- Larger map with list beside it

---

## 🎨 8. DESIGN SYSTEM COMPONENTS NEEDED

- Button (primary, secondary, outline, ghost, destructive)
- Input (text, email, password, textarea, select, date)
- Card (default, elevated, flat)
- Badge (status variants)
- Avatar (sm/md/lg/xl)
- StarRating (interactive + display)
- Toast
- Modal
- Skeleton loader
- EmptyState
- Timeline (knot progress)
- ImageSlider
- MapView
- Chat bubble
- Notification item
- Tab bar (bottom nav)
- Header bar
- Celebration overlay
- Filter chip
- Search bar *(future)*
- Date picker
- File uploader
- Progress bar
- Tooltip
- Dropdown menu

---

## 📊 PRIORITY FOR DESIGNER

### Phase 1 (for launch — design these first)
1. Landing page — full editorial treatment
2. Login + Signup — first impression
3. Creator onboarding — make it feel special
4. Explore — the hero screen
5. Offer detail — the decision moment
6. Knot detail (creator + business) — the wow moment with chat
7. Profile (creator + business)
8. All empty states
9. Celebration moments
10. Notifications

### Phase 2 (post-MVP)
11. Map detail
12. Search + filters
13. Business analytics
14. Public creator/business profiles
15. Tutorial overlays

### Phase 3 (Year 1)
16. Campaigns
17. Community
18. Payments
19. Verification
