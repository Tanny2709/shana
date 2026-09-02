"use client";

import { useActionState } from "react";
import Link from "next/link";
import { GoogleSignInButton } from "@/components/google-signin-button";
import type { AuthFormState } from "@/lib/actions/auth";

const initialState: AuthFormState = { status: "idle" };

const inputClass =
  "w-full rounded-md border border-border bg-bg-elevated px-3 py-2 text-sm text-fg outline-none focus:border-accent";
const labelClass = "mb-1.5 block text-xs font-medium text-fg-muted";

export function AuthForm({
  mode,
  action,
}: {
  mode: "login" | "signup";
  action: (state: AuthFormState, formData: FormData) => Promise<AuthFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">
        {mode === "login" ? "Log in" : "Create an account"}
      </h1>
      <p className="mt-1 text-sm text-fg-muted">
        {mode === "login" ? "Bookmark domains and APIs across visits." : "Save bookmarks and pick up where you left off."}
      </p>

      <form action={formAction} className="mt-6 flex flex-col gap-4">
        <div>
          <label className={labelClass} htmlFor="email">
            Email
          </label>
          <input id="email" name="email" type="email" required autoComplete="email" className={inputClass} />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : undefined}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            className={inputClass}
          />
        </div>
        {mode === "signup" && (
          <div>
            <label className={labelClass} htmlFor="confirmPassword">
              Confirm password
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className={inputClass}
            />
          </div>
        )}

        {state.status === "error" && state.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>

        <div className="flex items-center gap-3 text-xs text-fg-subtle">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <GoogleSignInButton />
      </form>

      <p className="mt-6 text-center text-sm text-fg-muted">
        {mode === "login" ? (
          <>
            Don&rsquo;t have an account?{" "}
            <Link href="/signup" className="text-accent hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent hover:underline">
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
