"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { pricingModelLabel, authMethodLabel } from "@/lib/format";

const PRICING_MODELS = ["free", "freemium", "pay_as_you_go", "subscription", "credit_based"];
const AUTH_METHODS = ["api_key", "oauth", "both", "none"];

export function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null || value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  const pricingModel = searchParams.get("pricing") ?? "";
  const authMethod = searchParams.get("auth") ?? "";
  const freeOnly = searchParams.get("free") === "1";
  const sort = searchParams.get("sort") ?? "name";

  const hasActiveFilters = pricingModel || authMethod || freeOnly;

  return (
    <div className="flex flex-col gap-6 text-sm">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-medium uppercase tracking-wide text-fg-subtle">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={() => router.push(pathname)}
              className="text-xs text-accent hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={freeOnly}
          onChange={(e) => setParam("free", e.target.checked ? "1" : null)}
          className="h-3.5 w-3.5 accent-accent"
        />
        <span className="text-fg">Free tier only</span>
      </label>

      <div>
        <h4 className="mb-2 text-xs font-medium text-fg-muted">Pricing model</h4>
        <div className="flex flex-col gap-1">
          {PRICING_MODELS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setParam("pricing", pricingModel === m ? null : m)}
              aria-pressed={pricingModel === m}
              className={`rounded-md px-2 py-1 text-left transition-colors ${
                pricingModel === m ? "bg-accent/10 text-accent" : "text-fg hover:bg-bg-hover"
              }`}
            >
              {pricingModelLabel(m)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-medium text-fg-muted">Auth method</h4>
        <div className="flex flex-col gap-1">
          {AUTH_METHODS.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setParam("auth", authMethod === m ? null : m)}
              aria-pressed={authMethod === m}
              className={`rounded-md px-2 py-1 text-left transition-colors ${
                authMethod === m ? "bg-accent/10 text-accent" : "text-fg hover:bg-bg-hover"
              }`}
            >
              {authMethodLabel(m)}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-2 text-xs font-medium text-fg-muted">Sort by</h4>
        <select
          value={sort}
          onChange={(e) => setParam("sort", e.target.value === "name" ? null : e.target.value)}
          className="w-full rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-fg outline-none focus:border-accent"
        >
          <option value="name">Name (A–Z)</option>
          <option value="recent">Recently verified</option>
        </select>
      </div>
    </div>
  );
}
