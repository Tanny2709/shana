"use client";

import { useActionState, useState } from "react";
import { submitReport, type ReportFormState } from "@/lib/actions/contributions";

const initialState: ReportFormState = { status: "idle" };

export function ReportOutdatedButton({ apiListingId }: { apiListingId: string }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(
    submitReport.bind(null, apiListingId),
    initialState,
  );

  if (state.status === "success") {
    return <p className="text-xs text-success">{state.message}</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs text-fg-subtle underline decoration-dotted underline-offset-2 hover:text-fg"
      >
        Report outdated info
      </button>
    );
  }

  return (
    <form action={formAction} className="flex max-w-sm flex-col gap-2">
      <label htmlFor="report-notes" className="text-xs font-medium text-fg-muted">
        What&rsquo;s outdated?
      </label>
      <textarea
        id="report-notes"
        name="notes"
        rows={2}
        required
        className="w-full rounded-md border border-border bg-bg-elevated px-2.5 py-1.5 text-sm text-fg outline-none focus:border-accent"
      />
      {state.status === "error" && state.message && (
        <p className="text-xs text-red-500">{state.message}</p>
      )}
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg disabled:opacity-50"
        >
          {pending ? "Sending..." : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-md px-3 py-1.5 text-xs text-fg-muted hover:text-fg"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
