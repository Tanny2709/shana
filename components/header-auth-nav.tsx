import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";

export async function HeaderAuthNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <Link
        href="/login"
        className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
      >
        Log in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        id="onboarding-bookmarks"
        href="/bookmarks"
        className="text-sm text-fg-muted transition-colors hover:text-fg"
      >
        Bookmarks
      </Link>
      <form action={signOutAction}>
        <button
          type="submit"
          className="rounded-full border border-border px-4 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
        >
          Log out
        </button>
      </form>
    </div>
  );
}
