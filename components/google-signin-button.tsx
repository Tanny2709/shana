// Visual placeholder only — no Google OAuth provider is wired up yet.
// Swapping this in for real Google sign-in later just means adding a
// Google provider to lib/auth.ts and pointing this button at
// signIn("google"); nothing else in the auth flow needs to change.
export function GoogleSignInButton() {
  return (
    <button
      type="button"
      disabled
      title="Coming soon"
      className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-md border border-border bg-bg-elevated px-4 py-2.5 text-sm font-medium text-fg-subtle opacity-60"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        />
        <path
          fill="currentColor"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
        />
        <path
          fill="currentColor"
          d="M5.84 14.09A6.6 6.6 0 0 1 5.5 12c0-.73.12-1.43.34-2.09V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93z"
        />
        <path
          fill="currentColor"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1a11 11 0 0 0-9.82 6.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
        />
      </svg>
      Continue with Google
      <span className="ml-1 rounded-full bg-bg px-1.5 py-0.5 text-[10px] text-fg-subtle">Soon</span>
    </button>
  );
}
