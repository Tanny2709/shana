// Hand-curated collections. Each is just editorial copy plus an ordered
// list of ApiListing slugs — add a new entry here to publish a new
// collection at /collections/<slug>. No database table yet by design:
// these are editorial picks a maintainer curates, not user-generated data.
//
// `reasons` is optional per-listing "why this made the cut" copy, keyed by
// listing slug — every reason here states something the data actually
// shows (free tier, score, pricing model), never an unverifiable claim
// like "great docs" with nothing backing it up.

export interface Collection {
  slug: string;
  title: string;
  description: string;
  intro: string;
  listingSlugs: string[];
  reasons?: Record<string, string>;
}

export const collections: Collection[] = [
  {
    slug: "best-free-ai-apis",
    title: "Best free AI APIs",
    description:
      "AI/ML APIs with a genuinely usable free tier — enough to prototype against before you need a credit card.",
    intro:
      "Every API here has a real, documented free tier — not a time-limited trial that silently expires. Picked from the AI/ML domain, ranked by Directory Score among free-tier listings.",
    listingSlugs: ["gemini-api", "cohere-api", "mistral-api", "elevenlabs-api", "replicate-api"],
    reasons: {
      "gemini-api": "Generous free tier in Google AI Studio with daily request caps — no credit card to start.",
      "cohere-api": "Free trial key with rate-limited access, no time bomb on the trial itself.",
      "mistral-api": "Free experimental tier across their open and commercial models.",
      "elevenlabs-api": "Free tier with a real monthly character quota, not just a one-time credit.",
      "replicate-api": "Small free credit grant that covers real experimentation across thousands of models.",
    },
  },
  {
    slug: "sms-and-messaging-apis",
    title: "SMS & messaging APIs",
    description: "APIs for sending SMS, WhatsApp, and other messaging channels programmatically.",
    intro:
      "Three messaging APIs from the Communication domain, each with broad official SDK coverage and webhook support for delivery events.",
    listingSlugs: ["twilio-api", "vonage-api", "messagebird-api"],
    reasons: {
      "twilio-api": "The broadest official SDK coverage in the directory (7 languages) plus webhooks.",
      "vonage-api": "Covers SMS, voice, and video from one account with a free trial credit.",
      "messagebird-api": "Omnichannel — SMS, WhatsApp, and voice through a single API.",
    },
  },
  {
    slug: "best-payment-apis",
    title: "Best payment APIs",
    description: "Payment processors ranked by Directory Score, for teams choosing their first payments provider.",
    intro:
      "Every payments-domain listing, ordered by Directory Score. This is the same transparent scoring shown on every detail page — not a sponsored ranking.",
    listingSlugs: ["stripe-api", "razorpay-api", "paypal-api", "square-api", "plaid-api", "adyen-api"],
  },
  {
    slug: "cheap-maps-apis",
    title: "Cheap maps & geocoding APIs",
    description: "Maps and geocoding APIs with free or freemium pricing — no enterprise sales call required.",
    intro:
      "Filtered to the Maps & Geolocation domain's free and freemium listings — the ones you can start using and paying for with just a credit card, not a procurement process.",
    listingSlugs: ["opencage-api", "mapbox-api", "here-api", "tomtom-api", "radar-api"],
    reasons: {
      "opencage-api": "Free tier: 2,500 requests/day, no credit card required to start.",
      "mapbox-api": "Free tier covers 50k map loads/month before billing kicks in.",
      "radar-api": "Free tier up to 100,000 API calls/month.",
    },
  },
  {
    slug: "apis-for-startups",
    title: "APIs for startups",
    description: "A cross-domain starter kit: free tier available, simple API-key auth, no enterprise sales call.",
    intro:
      "A hand-picked subset across domains that all share one property you can verify on each detail page: a free tier plus plain API-key auth — no OAuth setup, no sales-assisted onboarding to get started.",
    listingSlugs: [
      "stripe-api",
      "razorpay-api",
      "twilio-api",
      "sendgrid-api",
      "mapbox-api",
      "opencage-api",
      "gemini-api",
      "cohere-api",
    ],
  },
];

export function getCollection(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

export function getRelatedCollections(slug: string, limit = 3): Collection[] {
  const current = getCollection(slug);
  if (!current) return [];
  const currentSlugs = new Set(current.listingSlugs);

  return collections
    .filter((c) => c.slug !== slug)
    .map((c) => ({ collection: c, overlap: c.listingSlugs.filter((s) => currentSlugs.has(s)).length }))
    .filter((r) => r.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((r) => r.collection);
}
