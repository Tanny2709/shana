// Lightweight intent parsing for queries like "free AI API", "cheap maps
// API", or "payment API with free tier" — pattern-matches against the
// domains/keywords that actually exist in the data (no ML, no external
// search service), then combines the parsed filters with the existing
// ranked text search on whatever's left of the query.

const DOMAIN_KEYWORDS: Record<string, string[]> = {
  "ai-ml": ["ai", "artificial intelligence", "ml", "machine learning", "llm", "gpt", "chatbot", "language model"],
  payments: ["payment", "payments", "billing", "checkout", "invoicing"],
  "maps-geolocation": ["maps", "map", "geo", "geolocation", "location", "geocoding"],
  communication: ["sms", "communication", "messaging", "email", "voice", "chat", "whatsapp"],
};

const FREE_KEYWORDS = ["free", "no cost", "freemium"];
const CHEAP_KEYWORDS = ["cheap", "cheapest", "affordable", "budget", "low cost", "inexpensive"];

export interface ParsedIntent {
  domainSlugs: string[];
  freeTierOnly: boolean;
  preferCheap: boolean;
  residualQuery: string;
}

export function parseSearchIntent(rawQuery: string): ParsedIntent {
  let residual = ` ${rawQuery.toLowerCase().trim()} `;
  const domainSlugs: string[] = [];

  for (const [slug, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const kw of keywords) {
      if (residual.includes(` ${kw} `)) {
        if (!domainSlugs.includes(slug)) domainSlugs.push(slug);
        residual = residual.replace(` ${kw} `, " ");
      }
    }
  }

  let freeTierOnly = false;
  for (const kw of FREE_KEYWORDS) {
    if (residual.includes(` ${kw} `)) {
      freeTierOnly = true;
      residual = residual.replace(` ${kw} `, " ");
    }
  }

  let preferCheap = false;
  for (const kw of CHEAP_KEYWORDS) {
    if (residual.includes(` ${kw} `)) {
      preferCheap = true;
      residual = residual.replace(` ${kw} `, " ");
    }
  }

  // Strip filler words that don't carry search meaning once the intent
  // signals above are extracted, so "free AI API" doesn't get re-searched
  // as the literal leftover text "api".
  residual = residual.replace(/\b(api|apis|with|a|an|the|for|tier)\b/g, " ").replace(/\s+/g, " ").trim();

  return { domainSlugs, freeTierOnly, preferCheap, residualQuery: residual };
}

export function hasIntentSignal(intent: ParsedIntent): boolean {
  return intent.domainSlugs.length > 0 || intent.freeTierOnly || intent.preferCheap;
}
