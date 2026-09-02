"use client";

import { useActionState, useMemo, useState } from "react";
import {
  submitListingContribution,
  type ContributeFormState,
} from "@/lib/actions/contributions";
import { pricingModelLabel, authMethodLabel } from "@/lib/format";
import { pricingModelValues, authMethodValues } from "@/lib/schema/listing";
import type { ListingFull } from "@/lib/data";

const initialState: ContributeFormState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-fg outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-xs font-medium text-fg-muted";
const errorClass = "mt-1 text-xs text-red-500";

export function ContributeForm({
  domains,
  listings,
}: {
  domains: { name: string; slug: string }[];
  listings: ListingFull[];
}) {
  const [mode, setMode] = useState<"new" | "edit">("new");
  const [selectedId, setSelectedId] = useState<string>("");

  const selected = useMemo(
    () => listings.find((l) => l.id === selectedId) ?? null,
    [listings, selectedId],
  );

  const boundAction = useMemo(
    () => submitListingContribution.bind(null, mode === "edit" ? selectedId || null : null),
    [mode, selectedId],
  );

  const [state, formAction, pending] = useActionState(boundAction, initialState);

  if (state.status === "success") {
    return (
      <div className="rounded-lg border border-success/30 bg-success/10 px-6 py-8 text-center">
        <p className="text-sm font-medium text-fg">{state.message}</p>
      </div>
    );
  }

  return (
    <form key={mode === "edit" ? selectedId : "new"} action={formAction} className="flex flex-col gap-8">
      <div className="flex gap-1 rounded-md border border-border bg-bg-elevated p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("new")}
          className={`flex-1 rounded px-3 py-1.5 transition-colors ${
            mode === "new" ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
          }`}
        >
          Submit a new API
        </button>
        <button
          type="button"
          onClick={() => setMode("edit")}
          className={`flex-1 rounded px-3 py-1.5 transition-colors ${
            mode === "edit" ? "bg-accent text-accent-fg" : "text-fg-muted hover:text-fg"
          }`}
        >
          Edit an existing listing
        </button>
      </div>

      {mode === "edit" && (
        <div>
          <label className={labelClass} htmlFor="listing-select">
            Which API are you editing?
          </label>
          <select
            id="listing-select"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className={inputClass}
          >
            <option value="">Select an API...</option>
            {listings.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} — {l.provider.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {(mode === "new" || selected) && (
        <>
          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-sm font-medium text-fg">Provider</legend>
            <Field
              label="Provider name"
              name="providerName"
              defaultValue={selected?.provider.name}
              error={state.fieldErrors?.providerName}
            />
            <Field
              label="Provider slug (lowercase-with-hyphens)"
              name="providerSlug"
              defaultValue={selected?.provider.slug}
              error={state.fieldErrors?.providerSlug}
            />
            <Field
              label="Provider website"
              name="providerWebsite"
              type="url"
              defaultValue={selected?.provider.website}
              error={state.fieldErrors?.providerWebsite}
            />
            <Field
              label="Provider description (optional)"
              name="providerDescription"
              defaultValue={selected?.provider.description ?? undefined}
            />
            <Field
              label="Provider logo URL (optional)"
              name="providerLogoUrl"
              type="url"
              defaultValue={selected?.provider.logoUrl ?? undefined}
            />
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-sm font-medium text-fg">API listing</legend>
            <Field label="API name" name="name" defaultValue={selected?.name} error={state.fieldErrors?.name} />
            <Field
              label="Listing slug (lowercase-with-hyphens)"
              name="slug"
              defaultValue={selected?.slug}
              error={state.fieldErrors?.slug}
            />
            <Field
              label="Short description (one line)"
              name="shortDescription"
              defaultValue={selected?.shortDescription}
              error={state.fieldErrors?.shortDescription}
            />
            <Field
              label="Use cases (comma-separated)"
              name="useCases"
              defaultValue={selected?.useCases.join(", ")}
              error={state.fieldErrors?.useCases}
            />
            <Field
              label="Docs URL"
              name="docsUrl"
              type="url"
              defaultValue={selected?.docsUrl}
              error={state.fieldErrors?.docsUrl}
            />
            <Field
              label="Signup / key-generation URL"
              name="signupUrl"
              type="url"
              defaultValue={selected?.signupUrl}
              error={state.fieldErrors?.signupUrl}
            />

            <div>
              <label className={labelClass} htmlFor="authMethod">
                Auth method
              </label>
              <select
                id="authMethod"
                name="authMethod"
                defaultValue={selected?.authMethod ?? ""}
                className={inputClass}
              >
                <option value="" disabled>
                  Select...
                </option>
                {authMethodValues.map((m) => (
                  <option key={m} value={m}>
                    {authMethodLabel(m)}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.authMethod && <p className={errorClass}>{state.fieldErrors.authMethod}</p>}
            </div>

            <label className="flex items-center gap-2 text-sm text-fg">
              <input
                type="checkbox"
                name="freeTierAvailable"
                defaultChecked={selected?.freeTierAvailable}
                className="h-3.5 w-3.5 accent-accent"
              />
              Free tier available
            </label>

            <Field
              label="Free tier details (optional)"
              name="freeTierDetails"
              defaultValue={selected?.freeTierDetails ?? undefined}
            />

            <div>
              <label className={labelClass} htmlFor="pricingModel">
                Pricing model
              </label>
              <select
                id="pricingModel"
                name="pricingModel"
                defaultValue={selected?.pricingModel ?? ""}
                className={inputClass}
              >
                <option value="" disabled>
                  Select...
                </option>
                {pricingModelValues.map((m) => (
                  <option key={m} value={m}>
                    {pricingModelLabel(m)}
                  </option>
                ))}
              </select>
              {state.fieldErrors?.pricingModel && (
                <p className={errorClass}>{state.fieldErrors.pricingModel}</p>
              )}
            </div>

            <Field
              label="Pricing summary (short, human-readable)"
              name="pricingSummary"
              defaultValue={selected?.pricingSummary}
              error={state.fieldErrors?.pricingSummary}
            />
            <Field
              label="Rate limits (optional)"
              name="rateLimits"
              defaultValue={selected?.rateLimits ?? undefined}
            />
            <Field
              label="How to get a key — ordered steps (comma-separated)"
              name="howToGetKey"
              defaultValue={selected?.howToGetKey.join(", ")}
              error={state.fieldErrors?.howToGetKey}
            />

            <div>
              <span className={labelClass}>Domains</span>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {domains.map((d) => (
                  <label key={d.slug} className="flex items-center gap-1.5 text-sm text-fg">
                    <input
                      type="checkbox"
                      name="domainSlugs"
                      value={d.slug}
                      defaultChecked={selected?.domains.some((sd) => sd.domain.slug === d.slug)}
                      className="h-3.5 w-3.5 accent-accent"
                    />
                    {d.name}
                  </label>
                ))}
              </div>
              {state.fieldErrors?.domainSlugs && <p className={errorClass}>{state.fieldErrors.domainSlugs}</p>}
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-4">
            <legend className="mb-2 text-sm font-medium text-fg">About you (optional)</legend>
            <Field label="Your name" name="submitterName" />
            <Field label="Your email" name="submitterEmail" type="email" />
            <div>
              <label className={labelClass} htmlFor="notes">
                Notes for the reviewer
              </label>
              <textarea id="notes" name="notes" rows={3} className={inputClass} />
            </div>
          </fieldset>

          {state.status === "error" && state.message && (
            <p className="text-sm text-red-500">{state.message}</p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="self-start rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {pending ? "Submitting..." : "Submit for review"}
          </button>
        </>
      )}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <div>
      <label className={labelClass} htmlFor={name}>
        {label}
      </label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} className={inputClass} />
      {error && <p className={errorClass}>{error}</p>}
    </div>
  );
}
