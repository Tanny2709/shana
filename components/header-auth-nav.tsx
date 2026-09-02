import Link from "next/link";
import { auth } from "@/lib/auth";
import { signOutAction } from "@/lib/actions/auth";

export async function HeaderAuthNav() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-sm text-fg-muted transition-colors hover:text-fg">
          Log in
        </Link>
        <Link
          href="/signup"
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-fg hover:opacity-90"
        >
          Sign up
        </Link>
      </div>
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
        <button type="submit" className="text-sm text-fg-muted transition-colors hover:text-fg">
          Log out
        </button>
      </form>
    </div>
  );
}
