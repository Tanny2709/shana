import { PrismaClient, PricingModel, AuthMethod, ListingStatus } from "@prisma/client";

const prisma = new PrismaClient();

const DOMAINS = [
  { name: "AI/ML", slug: "ai-ml", description: "Language models, embeddings, vision, and other AI/ML inference APIs." },
  { name: "Payments", slug: "payments", description: "Payment processing, billing, and financial infrastructure APIs." },
  { name: "Maps & Geolocation", slug: "maps-geolocation", description: "Mapping, geocoding, routing, and location intelligence APIs." },
  { name: "Communication", slug: "communication", description: "Email, SMS, voice, video, and messaging APIs." },
] as const;

type Domain = (typeof DOMAINS)[number]["slug"];

interface SeedListing {
  provider: {
    name: string;
    slug: string;
    website: string;
    description: string;
    logoUrl?: string;
  };
  slug: string;
  name: string;
  shortDescription: string;
  useCases: string[];
  docsUrl: string;
  signupUrl: string;
  authMethod: AuthMethod;
  freeTierAvailable: boolean;
  freeTierDetails?: string;
  pricingModel: PricingModel;
  pricingSummary: string;
  rateLimits?: string;
  howToGetKey: string[];
  domains: Domain[];
  status?: ListingStatus;
}

interface DeveloperSupport {
  officialSdks?: string[];
  supportedLanguages?: string[];
  restSupport?: boolean;
  graphqlSupport?: boolean;
  webhookSupport?: boolean;
  websocketSupport?: boolean;
}

// Developer/integration support per listing, keyed by slug — kept separate
// from the main listing objects below so it can be maintained/reviewed on
// its own. Conservative by design: only official, well-documented SDKs and
// capabilities are listed; anything uncertain is left off rather than
// guessed. Absence here means "not documented," never "confirmed absent."
const DEVELOPER_SUPPORT: Record<string, DeveloperSupport> = {
  "openai-api": {
    officialSdks: ["Python", "Node.js"],
    supportedLanguages: ["Python", "JavaScript", "Node.js"],
    webhookSupport: true,
    websocketSupport: true, // Realtime API
  },
  "claude-api": {
    officialSdks: ["Python", "TypeScript"],
    supportedLanguages: ["Python", "TypeScript", "JavaScript"],
  },
  "cohere-api": {
    officialSdks: ["Python", "TypeScript", "Go", "Java"],
    supportedLanguages: ["Python", "TypeScript", "JavaScript", "Go", "Java"],
  },
  "gemini-api": {
    officialSdks: ["Python", "Node.js", "Go"],
    supportedLanguages: ["Python", "JavaScript", "Go"],
    websocketSupport: true, // Live API
  },
  "mistral-api": {
    officialSdks: ["Python", "TypeScript"],
    supportedLanguages: ["Python", "TypeScript", "JavaScript"],
  },
  "elevenlabs-api": {
    officialSdks: ["Python", "Node.js"],
    supportedLanguages: ["Python", "JavaScript", "Node.js"],
    websocketSupport: true, // streaming TTS
  },
  "replicate-api": {
    officialSdks: ["Python", "Node.js", "Go"],
    supportedLanguages: ["Python", "JavaScript", "Go"],
    webhookSupport: true,
  },
  "stripe-api": {
    officialSdks: ["Python", "Node.js", "Ruby", "PHP", "Java", "Go", ".NET"],
    supportedLanguages: ["Python", "JavaScript", "Ruby", "PHP", "Java", "Go", "C#"],
    webhookSupport: true,
  },
  "paypal-api": {
    officialSdks: ["Node.js", "Python", "PHP", "Java", ".NET"],
    supportedLanguages: ["JavaScript", "Python", "PHP", "Java", "C#"],
    webhookSupport: true,
  },
  "square-api": {
    officialSdks: ["Node.js", "Python", "Java", "PHP", "Ruby", ".NET", "Go"],
    supportedLanguages: ["JavaScript", "Python", "Java", "PHP", "Ruby", "C#", "Go"],
    webhookSupport: true,
  },
  "adyen-api": {
    officialSdks: ["Java", "Node.js", "PHP", "Python", ".NET", "Ruby", "Go"],
    supportedLanguages: ["Java", "JavaScript", "PHP", "Python", "C#", "Ruby", "Go"],
    webhookSupport: true,
  },
  "razorpay-api": {
    officialSdks: ["Node.js", "Python", "PHP", "Java", ".NET", "Ruby", "Go"],
    supportedLanguages: ["JavaScript", "Python", "PHP", "Java", "C#", "Ruby", "Go"],
    webhookSupport: true,
  },
  "plaid-api": {
    officialSdks: ["Node.js", "Python", "Java", "Go", "Ruby"],
    supportedLanguages: ["JavaScript", "Python", "Java", "Go", "Ruby"],
    webhookSupport: true,
  },
  "google-maps-platform-api": {
    officialSdks: ["JavaScript", "Python", "Java", "Go", "Node.js"],
    supportedLanguages: ["JavaScript", "Python", "Java", "Go"],
  },
  "mapbox-api": {
    officialSdks: ["JavaScript", "Node.js"],
    supportedLanguages: ["JavaScript"],
  },
  "radar-api": {
    officialSdks: ["Node.js", "JavaScript"],
    supportedLanguages: ["JavaScript", "Python"],
    webhookSupport: true,
  },
  "twilio-api": {
    officialSdks: ["Python", "Node.js", "Java", "PHP", "Ruby", "C#", "Go"],
    supportedLanguages: ["Python", "JavaScript", "Java", "PHP", "Ruby", "C#", "Go"],
    webhookSupport: true,
  },
  "sendgrid-api": {
    officialSdks: ["Node.js", "Python", "Java", "PHP", "Ruby", "C#", "Go"],
    supportedLanguages: ["JavaScript", "Python", "Java", "PHP", "Ruby", "C#", "Go"],
    webhookSupport: true,
  },
  "vonage-api": {
    officialSdks: ["Node.js", "Python", "Java", "PHP", "Ruby", ".NET", "Go"],
    supportedLanguages: ["JavaScript", "Python", "Java", "PHP", "Ruby", "C#", "Go"],
    webhookSupport: true,
  },
  "messagebird-api": {
    officialSdks: ["Node.js", "Python", "Java", "PHP", "Ruby", ".NET", "Go"],
    supportedLanguages: ["JavaScript", "Python", "Java", "PHP", "Ruby", "C#", "Go"],
    webhookSupport: true,
  },
  "postmark-api": {
    officialSdks: [".NET", "PHP", "Python", "Ruby", "Node.js"],
    supportedLanguages: ["C#", "PHP", "Python", "Ruby", "JavaScript"],
    webhookSupport: true,
  },
  "agora-api": {
    officialSdks: ["JavaScript", "Node.js", "Python", "Java", "PHP", "Go"],
    supportedLanguages: ["JavaScript", "Python", "Java", "PHP", "Go"],
  },
  "stream-chat-api": {
    officialSdks: ["Node.js", "Python", "Java", "Go", "PHP", "Ruby"],
    supportedLanguages: ["JavaScript", "Python", "Java", "Go", "PHP", "Ruby"],
    webhookSupport: true,
    websocketSupport: true,
  },
};

const listings: SeedListing[] = [
  // ---------- AI / ML ----------
  {
    provider: {
      name: "OpenAI",
      slug: "openai",
      website: "https://openai.com",
      description: "AI research and deployment company behind GPT, DALL-E, and Whisper.",
    },
    slug: "openai-api",
    name: "OpenAI API",
    shortDescription: "GPT language models, embeddings, image generation, and speech APIs.",
    useCases: ["Chatbots", "Text generation", "Code assistance", "Image generation", "Speech-to-text"],
    docsUrl: "https://platform.openai.com/docs",
    signupUrl: "https://platform.openai.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: false,
    freeTierDetails: "New accounts may receive limited trial credits, subject to change.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per token, varies by model (e.g. GPT-4o ~$2.50/1M input tokens).",
    rateLimits: "Tiered by usage/spend history; ranges from a few RPM on free tier to thousands on higher tiers.",
    howToGetKey: [
      "Create an OpenAI account and verify your phone number",
      "Go to platform.openai.com/api-keys",
      "Click 'Create new secret key' and copy it immediately",
      "Add a payment method under Billing to activate paid usage",
    ],
    domains: ["ai-ml"],
  },
  {
    provider: {
      name: "Anthropic",
      slug: "anthropic",
      website: "https://anthropic.com",
      description: "AI safety company building the Claude family of models.",
    },
    slug: "claude-api",
    name: "Claude API",
    shortDescription: "Claude language models for reasoning, coding, and long-context tasks.",
    useCases: ["Agents", "Coding assistants", "Document analysis", "Chatbots"],
    docsUrl: "https://docs.claude.com",
    signupUrl: "https://console.anthropic.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: false,
    freeTierDetails: "Small free credit grant for new accounts in some regions.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per token, varies by model (e.g. Sonnet ~$3/1M input tokens).",
    rateLimits: "Tiered by usage tier; requests/tokens per minute scale with spend history.",
    howToGetKey: [
      "Sign up at console.anthropic.com",
      "Navigate to Settings → API Keys",
      "Click 'Create Key' and store it securely",
      "Add billing details to raise rate limits",
    ],
    domains: ["ai-ml"],
  },
  {
    provider: {
      name: "Cohere",
      slug: "cohere",
      website: "https://cohere.com",
      description: "Enterprise AI platform for language models and retrieval.",
    },
    slug: "cohere-api",
    name: "Cohere API",
    shortDescription: "Command language models, embeddings, and rerank for enterprise search.",
    useCases: ["Semantic search", "RAG pipelines", "Classification", "Summarization"],
    docsUrl: "https://docs.cohere.com",
    signupUrl: "https://dashboard.cohere.com/welcome/register",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free trial key with rate-limited access for evaluation.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per request/token; production keys billed by usage.",
    rateLimits: "Trial keys limited to ~20 calls/min; production keys scale with plan.",
    howToGetKey: [
      "Create a Cohere account",
      "Go to the API Keys section of the dashboard",
      "Copy the auto-generated trial key or create a production key",
    ],
    domains: ["ai-ml"],
  },
  {
    provider: {
      name: "Google DeepMind",
      slug: "google-deepmind",
      website: "https://ai.google.dev",
      description: "Google's AI research lab, provider of the Gemini model family.",
    },
    slug: "gemini-api",
    name: "Gemini API",
    shortDescription: "Google's Gemini multimodal models for text, vision, and audio.",
    useCases: ["Multimodal chat", "Document understanding", "Code generation", "Agents"],
    docsUrl: "https://ai.google.dev/gemini-api/docs",
    signupUrl: "https://aistudio.google.com/apikey",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Generous free tier in Google AI Studio with daily request caps.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier for low volume; pay-as-you-go pricing via Vertex AI at scale.",
    rateLimits: "Free tier: ~15 RPM depending on model; paid tiers scale higher.",
    howToGetKey: [
      "Open Google AI Studio and sign in with a Google account",
      "Click 'Get API key' → 'Create API key'",
      "Select or create a Google Cloud project",
    ],
    domains: ["ai-ml"],
  },
  {
    provider: {
      name: "Mistral AI",
      slug: "mistral-ai",
      website: "https://mistral.ai",
      description: "European AI lab building open and commercial language models.",
    },
    slug: "mistral-api",
    name: "Mistral API",
    shortDescription: "Open-weight and commercial LLMs for chat, code, and embeddings.",
    useCases: ["Chatbots", "Code generation", "Embeddings", "Function calling"],
    docsUrl: "https://docs.mistral.ai",
    signupUrl: "https://console.mistral.ai/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free experimental tier with rate limits for testing.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per token; open models also downloadable for self-hosting.",
    rateLimits: "Free tier limited to 1 request/sec; paid tiers scale with spend.",
    howToGetKey: [
      "Create a La Plateforme account",
      "Go to API Keys and click 'Create new key'",
      "Enable billing to move beyond the experimental rate limit",
    ],
    domains: ["ai-ml"],
  },
  {
    provider: {
      name: "ElevenLabs",
      slug: "elevenlabs",
      website: "https://elevenlabs.io",
      description: "AI voice generation and speech synthesis platform.",
    },
    slug: "elevenlabs-api",
    name: "ElevenLabs API",
    shortDescription: "Realistic text-to-speech and voice cloning API.",
    useCases: ["Voiceovers", "Audiobooks", "IVR voices", "Dubbing"],
    docsUrl: "https://elevenlabs.io/docs",
    signupUrl: "https://elevenlabs.io/sign-up",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free tier with limited monthly character quota.",
    pricingModel: PricingModel.credit_based,
    pricingSummary: "Character/credit-based subscription tiers, from free to enterprise.",
    rateLimits: "Concurrency limits scale by subscription tier.",
    howToGetKey: [
      "Sign up for an ElevenLabs account",
      "Open your profile settings",
      "Copy the API key from the 'API Keys' tab",
    ],
    domains: ["ai-ml"],
  },
  {
    provider: {
      name: "Replicate",
      slug: "replicate",
      website: "https://replicate.com",
      description: "Platform for running open-source machine learning models via API.",
    },
    slug: "replicate-api",
    name: "Replicate API",
    shortDescription: "Run thousands of open-source ML models (image, video, audio) via a single API.",
    useCases: ["Image generation", "Video generation", "Model hosting", "Fine-tuning"],
    docsUrl: "https://replicate.com/docs",
    signupUrl: "https://replicate.com/signin",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Small free credit grant for new accounts.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per second of compute, billed per model/hardware type.",
    rateLimits: "Default concurrency limits per account; can request increases.",
    howToGetKey: [
      "Sign up at replicate.com",
      "Go to Account Settings → API Tokens",
      "Copy the default token or create a new one",
    ],
    domains: ["ai-ml"],
  },
  // ---------- Payments ----------
  {
    provider: {
      name: "Stripe",
      slug: "stripe",
      website: "https://stripe.com",
      description: "Payments infrastructure for online businesses.",
    },
    slug: "stripe-api",
    name: "Stripe API",
    shortDescription: "Full-stack payment processing, billing, and financial infrastructure.",
    useCases: ["Checkout", "Subscriptions", "Marketplaces", "Invoicing", "Fraud prevention"],
    docsUrl: "https://docs.stripe.com",
    signupUrl: "https://dashboard.stripe.com/register",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "No monthly fees; free to integrate, fees apply per transaction.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "2.9% + $0.30 per successful card charge (US), varies by region/method.",
    rateLimits: "~100 read + 100 write requests/sec in live mode by default.",
    howToGetKey: [
      "Create a Stripe account",
      "Go to Developers → API keys in the Dashboard",
      "Copy the publishable and secret test keys",
      "Complete account activation to get live keys",
    ],
    domains: ["payments"],
  },
  {
    provider: {
      name: "PayPal",
      slug: "paypal",
      website: "https://paypal.com",
      description: "Global online payments platform.",
    },
    slug: "paypal-api",
    name: "PayPal REST API",
    shortDescription: "Accept PayPal, cards, and Venmo payments via REST API.",
    useCases: ["Checkout", "Subscriptions", "Payouts", "Invoicing"],
    docsUrl: "https://developer.paypal.com/docs/api/overview",
    signupUrl: "https://developer.paypal.com/dashboard/",
    authMethod: AuthMethod.oauth,
    freeTierAvailable: true,
    freeTierDetails: "Free sandbox environment; production fees per transaction.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Standard rate ~3.49% + fixed fee per transaction (US), varies by volume.",
    rateLimits: "Varies by endpoint; sandbox has stricter throttling than live.",
    howToGetKey: [
      "Log in to the PayPal Developer Dashboard",
      "Create a new App under 'Apps & Credentials'",
      "Copy the Client ID and Secret (sandbox or live)",
    ],
    domains: ["payments"],
  },
  {
    provider: {
      name: "Square",
      slug: "square",
      website: "https://squareup.com",
      description: "Commerce platform for payments, point-of-sale, and business tools.",
    },
    slug: "square-api",
    name: "Square API",
    shortDescription: "Payments, POS, orders, and inventory APIs for online and in-person commerce.",
    useCases: ["In-person payments", "E-commerce checkout", "Inventory management", "Invoicing"],
    docsUrl: "https://developer.squareup.com/docs",
    signupUrl: "https://developer.squareup.com/us/en",
    authMethod: AuthMethod.oauth,
    freeTierAvailable: true,
    freeTierDetails: "Free sandbox; no fees to integrate, per-transaction fees on live payments.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "~2.6% + $0.10 per in-person swipe (US); online rates vary.",
    rateLimits: "Standard tier ~10-30 requests/sec depending on endpoint.",
    howToGetKey: [
      "Create a Square Developer account",
      "Create an application in the Developer Dashboard",
      "Copy the Sandbox Access Token to start testing",
    ],
    domains: ["payments"],
  },
  {
    provider: {
      name: "Adyen",
      slug: "adyen",
      website: "https://adyen.com",
      description: "Global payments platform for enterprise merchants.",
    },
    slug: "adyen-api",
    name: "Adyen API",
    shortDescription: "Unified global payments platform for online, in-store, and mobile.",
    useCases: ["Global checkout", "In-store payments", "Risk management", "Payouts"],
    docsUrl: "https://docs.adyen.com",
    signupUrl: "https://www.adyen.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: false,
    freeTierDetails: "Test account available; commercial agreement required for production.",
    pricingModel: PricingModel.subscription,
    pricingSummary: "Custom pricing: per-transaction fee + processing costs, negotiated per merchant.",
    rateLimits: "Contractual limits set per merchant account.",
    howToGetKey: [
      "Request a test account via adyen.com",
      "In the Customer Area, go to Developers → API credentials",
      "Generate an API key for the test environment",
    ],
    domains: ["payments"],
    status: ListingStatus.active,
  },
  {
    provider: {
      name: "Razorpay",
      slug: "razorpay",
      website: "https://razorpay.com",
      description: "Payments and business banking platform focused on India.",
    },
    slug: "razorpay-api",
    name: "Razorpay API",
    shortDescription: "Payments, payment links, subscriptions, and route (marketplace) APIs for India.",
    useCases: ["Checkout", "UPI payments", "Subscriptions", "Marketplace payouts"],
    docsUrl: "https://razorpay.com/docs/api/",
    signupUrl: "https://dashboard.razorpay.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free to integrate; per-transaction fees apply (test mode is free).",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "~2% per domestic transaction, varies by payment method.",
    rateLimits: "Default API rate limits vary by endpoint, generally a few hundred req/min.",
    howToGetKey: [
      "Sign up on the Razorpay Dashboard",
      "Go to Settings → API Keys",
      "Generate Test Key (or Live Key after KYC approval)",
    ],
    domains: ["payments"],
  },
  {
    provider: {
      name: "Plaid",
      slug: "plaid",
      website: "https://plaid.com",
      description: "Financial data network connecting apps to users' bank accounts.",
    },
    slug: "plaid-api",
    name: "Plaid API",
    shortDescription: "Bank account linking, balance, transaction, and identity verification APIs.",
    useCases: ["Bank linking", "Transaction data", "Income verification", "ACH payments"],
    docsUrl: "https://plaid.com/docs",
    signupUrl: "https://dashboard.plaid.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free Sandbox and limited Development environment for testing.",
    pricingModel: PricingModel.subscription,
    pricingSummary: "Usage-based pricing per product (e.g. Auth, Transactions), custom at scale.",
    rateLimits: "Sandbox/Development have lower caps than contracted Production limits.",
    howToGetKey: [
      "Create a Plaid account",
      "Go to Team Settings → Keys in the Dashboard",
      "Copy the client_id and Sandbox secret",
    ],
    domains: ["payments"],
  },
  // ---------- Maps & Geolocation ----------
  {
    provider: {
      name: "Google Maps Platform",
      slug: "google-maps-platform",
      website: "https://mapsplatform.google.com",
      description: "Google's suite of mapping, places, and routing APIs.",
    },
    slug: "google-maps-platform-api",
    name: "Google Maps Platform",
    shortDescription: "Maps, geocoding, places, routes, and street view APIs.",
    useCases: ["Store locators", "Route optimization", "Geocoding addresses", "Static/dynamic maps"],
    docsUrl: "https://developers.google.com/maps/documentation",
    signupUrl: "https://console.cloud.google.com/google/maps-apis/start",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "$200 monthly credit covers substantial free usage across APIs.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per 1,000 requests, varies by API (e.g. Geocoding ~$5/1000).",
    rateLimits: "Default QPS caps per API; can request quota increases in Cloud Console.",
    howToGetKey: [
      "Create a Google Cloud project",
      "Enable the Maps Platform APIs you need",
      "Go to APIs & Services → Credentials → Create API key",
      "Restrict the key to your app/domain",
    ],
    domains: ["maps-geolocation"],
  },
  {
    provider: {
      name: "Mapbox",
      slug: "mapbox",
      website: "https://mapbox.com",
      description: "Custom mapping and location platform for developers.",
    },
    slug: "mapbox-api",
    name: "Mapbox API",
    shortDescription: "Customizable maps, geocoding, navigation, and satellite imagery.",
    useCases: ["Custom map styling", "Turn-by-turn navigation", "Geocoding", "Data visualization"],
    docsUrl: "https://docs.mapbox.com",
    signupUrl: "https://account.mapbox.com/auth/signup/",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Generous free monthly tier across most APIs (e.g. 50k map loads).",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier, then pay-as-you-go per 1,000 requests/loads.",
    rateLimits: "Rate limits vary per API, typically requests/minute per token.",
    howToGetKey: [
      "Create a Mapbox account",
      "Go to your Account page",
      "Copy the default public token or create a new one",
    ],
    domains: ["maps-geolocation"],
  },
  {
    provider: {
      name: "HERE Technologies",
      slug: "here-technologies",
      website: "https://here.com",
      description: "Location data and mapping platform for enterprise applications.",
    },
    slug: "here-api",
    name: "HERE APIs",
    shortDescription: "Maps, routing, geocoding, and traffic data APIs.",
    useCases: ["Fleet routing", "Geocoding", "Traffic-aware navigation", "Indoor mapping"],
    docsUrl: "https://www.here.com/docs",
    signupUrl: "https://platform.here.com/portal/",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Freemium plan with monthly transaction allowance.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier, then tiered pay-as-you-go plans per transaction.",
    rateLimits: "Free plan limited requests/month; paid plans scale higher.",
    howToGetKey: [
      "Create a HERE Developer account",
      "Go to Projects → Manage Apps in the Developer Portal",
      "Generate a REST API key",
    ],
    domains: ["maps-geolocation"],
  },
  {
    provider: {
      name: "TomTom",
      slug: "tomtom",
      website: "https://tomtom.com",
      description: "Location technology company providing maps and traffic APIs.",
    },
    slug: "tomtom-api",
    name: "TomTom Maps API",
    shortDescription: "Maps, routing, traffic, and geocoding APIs for navigation apps.",
    useCases: ["Navigation", "Traffic incidents", "Geocoding", "EV routing"],
    docsUrl: "https://developer.tomtom.com/",
    signupUrl: "https://developer.tomtom.com/user/register",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free tier with 2,500 daily requests across most APIs.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free daily quota, then pay-as-you-go per 1,000 transactions.",
    rateLimits: "Free tier capped at requests/day; paid plans raise the ceiling.",
    howToGetKey: [
      "Register for a TomTom Developer account",
      "Go to 'My Dashboard' → 'Apps'",
      "Create an app to generate an API key",
    ],
    domains: ["maps-geolocation"],
  },
  {
    provider: {
      name: "OpenCage",
      slug: "opencage",
      website: "https://opencagedata.com",
      description: "Forward and reverse geocoding API built on open data.",
    },
    slug: "opencage-api",
    name: "OpenCage Geocoding API",
    shortDescription: "Forward/reverse geocoding API built on OpenStreetMap and other open data.",
    useCases: ["Address geocoding", "Reverse geocoding", "Timezone lookup"],
    docsUrl: "https://opencagedata.com/api",
    signupUrl: "https://opencagedata.com/users/sign_up",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free tier: 2,500 requests/day, no credit card required.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier, then subscription plans by requests/day.",
    rateLimits: "Free tier limited to 1 request/second.",
    howToGetKey: [
      "Sign up for a free OpenCage account",
      "Your API key is shown on the dashboard immediately",
    ],
    domains: ["maps-geolocation"],
  },
  {
    provider: {
      name: "Radar",
      slug: "radar",
      website: "https://radar.com",
      description: "Location platform for geofencing, geocoding, and trip tracking.",
    },
    slug: "radar-api",
    name: "Radar API",
    shortDescription: "Geocoding, geofencing, and real-time location tracking APIs.",
    useCases: ["Geofencing", "Delivery tracking", "Store locators", "Fraud prevention"],
    docsUrl: "https://radar.com/documentation",
    signupUrl: "https://radar.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free tier up to 100,000 API calls/month.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier, then usage-based pricing per 1,000 calls.",
    rateLimits: "Rate limits vary by plan and endpoint.",
    howToGetKey: [
      "Create a Radar account",
      "Go to Settings in the Radar dashboard",
      "Copy the test or live publishable/secret keys",
    ],
    domains: ["maps-geolocation"],
  },
  // ---------- Communication ----------
  {
    provider: {
      name: "Twilio",
      slug: "twilio",
      website: "https://twilio.com",
      description: "Cloud communications platform for SMS, voice, and video.",
    },
    slug: "twilio-api",
    name: "Twilio API",
    shortDescription: "SMS, voice, video, and WhatsApp messaging APIs.",
    useCases: ["OTP verification", "Notifications", "Call routing", "WhatsApp messaging"],
    docsUrl: "https://www.twilio.com/docs",
    signupUrl: "https://www.twilio.com/try-twilio",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Trial account with free credit for testing (sends to verified numbers only).",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per message/minute, varies by country and channel (e.g. SMS from $0.0079).",
    rateLimits: "Default 1 message/sec on long codes; higher throughput via short codes/messaging service.",
    howToGetKey: [
      "Sign up for a Twilio account",
      "Verify your email and phone number",
      "Copy the Account SID and Auth Token from the Console dashboard",
    ],
    domains: ["communication"],
  },
  {
    provider: {
      name: "Twilio",
      slug: "twilio",
      website: "https://twilio.com",
      description: "Cloud communications platform for SMS, voice, and video.",
    },
    slug: "sendgrid-api",
    name: "SendGrid Email API",
    shortDescription: "Transactional and marketing email delivery API (part of Twilio).",
    useCases: ["Transactional email", "Marketing campaigns", "Email deliverability analytics"],
    docsUrl: "https://www.twilio.com/docs/sendgrid",
    signupUrl: "https://signup.sendgrid.com/",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free tier: 100 emails/day forever.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier, then tiered plans by monthly email volume.",
    rateLimits: "API rate limits vary by endpoint and plan.",
    howToGetKey: [
      "Create a SendGrid account",
      "Go to Settings → API Keys",
      "Click 'Create API Key' and choose Full Access or Restricted",
    ],
    domains: ["communication"],
  },
  {
    provider: {
      name: "Vonage",
      slug: "vonage",
      website: "https://vonage.com",
      description: "Communications APIs for SMS, voice, video, and verification.",
    },
    slug: "vonage-api",
    name: "Vonage Communications APIs",
    shortDescription: "SMS, voice, video, and number verification APIs.",
    useCases: ["SMS notifications", "Two-factor authentication", "Voice IVR", "Video calling"],
    docsUrl: "https://developer.vonage.com/en/documentation",
    signupUrl: "https://ui.idp.vonage.com/ui/auth/registration",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free trial credit for new accounts.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per message/minute, varies by destination country.",
    rateLimits: "Default throughput ~30 requests/sec, higher on request.",
    howToGetKey: [
      "Sign up for a Vonage API account",
      "Find your API key and secret on the Dashboard homepage",
    ],
    domains: ["communication"],
  },
  {
    provider: {
      name: "MessageBird (Bird)",
      slug: "messagebird",
      website: "https://bird.com",
      description: "Omnichannel messaging platform for SMS, WhatsApp, email, and voice.",
    },
    slug: "messagebird-api",
    name: "Bird (MessageBird) API",
    shortDescription: "Omnichannel messaging API for SMS, WhatsApp, voice, and email.",
    useCases: ["Customer notifications", "WhatsApp business messaging", "Conversations API", "OTP"],
    docsUrl: "https://docs.bird.com/",
    signupUrl: "https://bird.com/signup",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free trial credit for evaluation.",
    pricingModel: PricingModel.pay_as_you_go,
    pricingSummary: "Pay per message, varies by channel and destination.",
    rateLimits: "Default API rate limits apply per account/plan.",
    howToGetKey: [
      "Create a Bird account",
      "Go to Developer settings → API access",
      "Generate an access key",
    ],
    domains: ["communication"],
  },
  {
    provider: {
      name: "Postmark",
      slug: "postmark",
      website: "https://postmarkapp.com",
      description: "Fast, reliable transactional email delivery service.",
    },
    slug: "postmark-api",
    name: "Postmark API",
    shortDescription: "Transactional email API focused on speed and deliverability.",
    useCases: ["Password resets", "Receipts", "App notifications", "Email templates"],
    docsUrl: "https://postmarkapp.com/developer",
    signupUrl: "https://account.postmarkapp.com/sign_up",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free trial with 100 test emails; no free ongoing production tier.",
    pricingModel: PricingModel.subscription,
    pricingSummary: "Plans start around $15/mo for 10,000 emails, pay-as-you-go available.",
    rateLimits: "No hard rate limit; throughput scales with account reputation.",
    howToGetKey: [
      "Create a Postmark account",
      "Create a Server within a Project",
      "Copy the Server API Token from the Server's 'API Tokens' tab",
    ],
    domains: ["communication"],
  },
  {
    provider: {
      name: "Agora",
      slug: "agora",
      website: "https://agora.io",
      description: "Real-time voice and video engagement platform.",
    },
    slug: "agora-api",
    name: "Agora API",
    shortDescription: "Real-time video, voice, and interactive live streaming SDKs/APIs.",
    useCases: ["Video conferencing", "Live streaming", "Voice chat", "Interactive whiteboards"],
    docsUrl: "https://docs.agora.io",
    signupUrl: "https://console.agora.io/",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free tier: 10,000 minutes/month across core products.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free monthly minutes, then pay-as-you-go per minute by product.",
    rateLimits: "Concurrency limits vary by plan.",
    howToGetKey: [
      "Sign up for an Agora account",
      "Create a project in the Agora Console",
      "Copy the App ID (and App Certificate for token auth)",
    ],
    domains: ["communication"],
  },
  {
    provider: {
      name: "Stream",
      slug: "stream",
      website: "https://getstream.io",
      description: "APIs for chat, activity feeds, and video calling.",
    },
    slug: "stream-chat-api",
    name: "Stream Chat API",
    shortDescription: "Scalable in-app chat messaging API and SDKs.",
    useCases: ["In-app messaging", "Customer support chat", "Community/social chat"],
    docsUrl: "https://getstream.io/chat/docs/",
    signupUrl: "https://getstream.io/try-for-free/",
    authMethod: AuthMethod.api_key,
    freeTierAvailable: true,
    freeTierDetails: "Free 'Maker' plan for small projects with usage caps.",
    pricingModel: PricingModel.freemium,
    pricingSummary: "Free tier, then per-MAU (monthly active user) pricing.",
    rateLimits: "Rate limits vary per endpoint and plan tier.",
    howToGetKey: [
      "Sign up for a Stream account",
      "Create an app in the Dashboard",
      "Copy the API Key and Secret from the app's settings",
    ],
    domains: ["communication"],
  },
];

async function main() {
  console.log("Seeding domains...");
  const domainRecords = new Map<Domain, string>();
  for (const d of DOMAINS) {
    const rec = await prisma.domain.upsert({
      where: { slug: d.slug },
      update: { name: d.name, description: d.description },
      create: d,
    });
    domainRecords.set(d.slug, rec.id);
  }

  console.log(`Seeding ${listings.length} API listings...`);
  for (const item of listings) {
    const provider = await prisma.provider.upsert({
      where: { slug: item.provider.slug },
      update: item.provider,
      create: item.provider,
    });

    const devSupport = DEVELOPER_SUPPORT[item.slug] ?? {};
    const devSupportData = {
      officialSdks: devSupport.officialSdks ?? [],
      supportedLanguages: devSupport.supportedLanguages ?? [],
      restSupport: devSupport.restSupport ?? true,
      graphqlSupport: devSupport.graphqlSupport ?? false,
      webhookSupport: devSupport.webhookSupport ?? false,
      websocketSupport: devSupport.websocketSupport ?? false,
    };

    const listing = await prisma.apiListing.upsert({
      where: { slug: item.slug },
      update: {
        providerId: provider.id,
        name: item.name,
        shortDescription: item.shortDescription,
        useCases: item.useCases,
        docsUrl: item.docsUrl,
        signupUrl: item.signupUrl,
        authMethod: item.authMethod,
        freeTierAvailable: item.freeTierAvailable,
        freeTierDetails: item.freeTierDetails,
        pricingModel: item.pricingModel,
        pricingSummary: item.pricingSummary,
        rateLimits: item.rateLimits,
        howToGetKey: item.howToGetKey,
        status: item.status ?? ListingStatus.active,
        lastVerifiedAt: new Date(),
        ...devSupportData,
      },
      create: {
        slug: item.slug,
        providerId: provider.id,
        name: item.name,
        shortDescription: item.shortDescription,
        useCases: item.useCases,
        docsUrl: item.docsUrl,
        signupUrl: item.signupUrl,
        authMethod: item.authMethod,
        freeTierAvailable: item.freeTierAvailable,
        freeTierDetails: item.freeTierDetails,
        pricingModel: item.pricingModel,
        pricingSummary: item.pricingSummary,
        rateLimits: item.rateLimits,
        howToGetKey: item.howToGetKey,
        status: item.status ?? ListingStatus.active,
        ...devSupportData,
      },
    });

    await prisma.apiListingDomain.deleteMany({ where: { apiListingId: listing.id } });
    for (const domainSlug of item.domains) {
      const domainId = domainRecords.get(domainSlug)!;
      await prisma.apiListingDomain.create({
        data: { apiListingId: listing.id, domainId },
      });
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
