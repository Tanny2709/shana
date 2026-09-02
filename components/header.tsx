import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderAuthNav } from "@/components/header-auth-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 text-sm font-semibold tracking-tight text-fg">
          API Directory
        </Link>
        <div id="onboarding-search" className="hidden max-w-sm flex-1 sm:block">
          <SearchBar />
        </div>
        <div className="ml-auto flex items-center gap-3">
          <nav className="hidden items-center gap-3 md:flex">
            <Link href="/use-cases" className="text-sm text-fg-muted transition-colors hover:text-fg">
              Use cases
            </Link>
            <Link href="/collections" className="text-sm text-fg-muted transition-colors hover:text-fg">
              Collections
            </Link>
            <Link href="/contribute" className="text-sm text-fg-muted transition-colors hover:text-fg">
              Contribute
            </Link>
          </nav>
          <kbd
            id="onboarding-cmdk"
            className="hidden rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-subtle sm:inline-block"
          >
            ⌘K
          </kbd>
          <ThemeToggle />
          <div className="hidden sm:block">
            <HeaderAuthNav />
          </div>
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
