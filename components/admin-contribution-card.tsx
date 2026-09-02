"use client";

import { useState } from "react";
import { approveContribution, rejectContribution } from "@/lib/actions/contributions";
import { formatDateTime } from "@/lib/format";
import type { Contribution, ApiListing, Provider } from "@prisma/client";

type ContributionWithListing = Contribution & {
  apiListing: (ApiListing & { provider: Provider }) | null;
};

export function AdminContributionCard({ contribution }: { contribution: ContributionWithListing }) {
  const [showReject, setShowReject] = useState(false);

  const payload = contribution.payload as Record<string, unknown> | null;

  const title =
    contribution.type === "report"
      ? `Report: ${contribution.apiListing?.name ?? "unknown listing"}`
      : contribution.type === "edit"
        ? `Edit: ${(payload?.name as string) ?? contribution.apiListing?.name}`
        : `New listing: ${(payload?.name as string) ?? "untitled"}`;

  return (
    <div className="rounded-lg border border-border bg-bg-elevated p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded border border-border px-1.5 py-0.5 text-[11px] uppercase tracking-wide text-fg-subtle">
              {contribution.type.replace("_", " ")}
            </span>
            <h3 className="text-sm font-medium text-fg">{title}</h3>
          </div>
          {(contribution.submitterName || contribution.submitterEmail) && (
            <p className="mt-1 text-xs text-fg-subtle">
              From {contribution.submitterName || "anonymous"}
              {contribution.submitterEmail ? ` <${contribution.submitterEmail}>` : ""}
            </p>
          )}
          <p className="mt-1 text-xs text-fg-subtle">
            Submitted {formatDateTime(contribution.createdAt)}
          </p>
        </div>
      </div>

      {contribution.notes && (
        <p className="mt-3 rounded bg-bg px-3 py-2 text-sm text-fg-muted">{contribution.notes}</p>
      )}

      {contribution.type !== "report" && payload && (
        <details className="mt-3">
          <summary className="cursor-pointer text-xs text-accent">View proposed data</summary>
          <pre className="mt-2 max-h-64 overflow-auto rounded bg-bg px-3 py-2 text-xs text-fg-muted">
            {JSON.stringify(payload, null, 2)}
          </pre>
        </details>
      )}

      {contribution.status === "pending" ? (
        <div className="mt-4 flex items-center gap-2">
          <form action={approveContribution.bind(null, contribution.id)}>
            <button
              type="submit"
              className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90"
            >
              Approve
            </button>
          </form>
          {!showReject ? (
            <button
              type="button"
              onClick={() => setShowReject(true)}
              className="rounded-md border border-border px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
            >
              Reject
            </button>
          ) : (
            <form
              action={rejectContribution.bind(null, contribution.id)}
              className="flex items-center gap-2"
            >
              <input
                name="reviewNotes"
                placeholder="Reason (optional)"
                className="rounded-md border border-border bg-bg px-2 py-1.5 text-xs text-fg outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="rounded-md border border-red-500/40 px-3 py-1.5 text-xs text-red-500 hover:bg-red-500/10"
              >
                Confirm reject
              </button>
            </form>
          )}
        </div>
      ) : (
        <p className="mt-4 text-xs text-fg-subtle">
          {contribution.status === "approved" ? "Approved" : "Rejected"}
          {contribution.reviewNotes ? ` — ${contribution.reviewNotes}` : ""}
        </p>
      )}
    </div>
  );
}
