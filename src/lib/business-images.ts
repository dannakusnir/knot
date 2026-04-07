// Maps business names to their local images
// Used in Explore page slider and offer detail pages

export interface BusinessImageSet {
  hero: string[];       // All images for the slider
  offerImages: Record<string, string>; // offer title keyword → specific image
}

const businessImages: Record<string, BusinessImageSet> = {
  "mami": {
    hero: [
      "/images/mami/TUBEAV-8-14-27.jpg",       // restaurant interior
      "/images/mami/0V8A4710.jpg",              // coffee & pastries spread
      "/images/mami/Mami-vibes-9-28-25-69.jpg", // food spread
      "/images/mami/0V8A9601.jpg",              // wrap plate
      "/images/mami/0V8A4757.jpg",              // croissant & coffee
    ],
    offerImages: {
      "coffee":  "/images/mami/0V8A4710.jpg",
      "pastry":  "/images/mami/0V8A4757.jpg",
      "lunch":   "/images/mami/0V8A9601.jpg",
      "brunch":  "/images/mami/Mami-vibes-9-28-25-69.jpg",
      "dinner":  "/images/mami/TUBEAV-8-14-27.jpg",
      "default": "/images/mami/TUBEAV-8-14-27.jpg",
    },
  },
  "shawarma": {
    hero: [
      "/images/shawarma/0V8A0359.jpg", // neon sign
      "/images/shawarma/0V8A0364.jpg", // interior seating
      "/images/shawarma/0V8A0409.jpg", // grill fire
      "/images/shawarma/0V8A0553.jpg", // shawarma spit
      "/images/shawarma/0V8A0641.jpg", // wrapped shawarma
    ],
    offerImages: {
      "solo":    "/images/shawarma/0V8A0641.jpg",
      "lunch":   "/images/shawarma/0V8A0553.jpg",
      "family":  "/images/shawarma/0V8A0409.jpg",
      "default": "/images/shawarma/0V8A0359.jpg",
    },
  },
  "livela": {
    hero: [
      "/images/livela/0V8A0885.jpg", // logo wall
      "/images/livela/0V8A1568.jpg", // gold mask facial
      "/images/livela/0V8A3289.jpg", // brow treatment
      "/images/livela/0V8A3711.jpg", // laser treatment
      "/images/livela/0V8A0874.jpg", // spa headband
    ],
    offerImages: {
      "brows":   "/images/livela/0V8A3289.jpg",
      "nails":   "/images/livela/0V8A0874.jpg",
      "facial":  "/images/livela/0V8A1568.jpg",
      "laser":   "/images/livela/0V8A3711.jpg",
      "default": "/images/livela/0V8A0885.jpg",
    },
  },
};

/**
 * Find images for a business by matching its name
 */
export function getBusinessImages(businessName: string): BusinessImageSet | null {
  const name = businessName.toLowerCase();
  for (const [key, images] of Object.entries(businessImages)) {
    if (name.includes(key)) return images;
  }
  return null;
}

/**
 * Find the best image for a specific offer based on its title
 */
export function getOfferImage(businessName: string, offerTitle: string): string | null {
  const imageSet = getBusinessImages(businessName);
  if (!imageSet) return null;

  const title = offerTitle.toLowerCase();
  for (const [keyword, image] of Object.entries(imageSet.offerImages)) {
    if (keyword !== "default" && title.includes(keyword)) return image;
  }
  return imageSet.offerImages["default"] || imageSet.hero[0] || null;
}
