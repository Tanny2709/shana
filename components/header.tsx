import Link from "next/link";
import { SearchBar } from "@/components/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { HeaderAuthNav } from "@/components/header-auth-nav";
import { HeaderNav } from "@/components/header-nav";
import { LogoMark } from "@/components/logo-mark";

export function Header() {
  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="mx-auto flex max-w-6xl items-center gap-3 rounded-2xl border border-border bg-bg-elevated/90 px-3 py-2.5 shadow-lg shadow-black/10 backdrop-blur sm:gap-4 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark size={30} />
          <span className="hidden items-baseline gap-1.5 sm:flex">
            <span className="text-base font-semibold tracking-tight text-fg">Shana</span>
            <span className="hidden text-xs text-fg-subtle xl:inline">· The API Directory</span>
          </span>
        </Link>

        <div id="onboarding-search" className="hidden max-w-sm flex-1 xl:block">
          <SearchBar showShortcut />
        </div>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <HeaderNav />
          <ThemeToggle />
          <div className="hidden sm:block">
            <HeaderAuthNav />
          </div>
          <Link
            href="/browse"
            className="hidden shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90 sm:inline-flex"
            style={{ background: "var(--landing-gradient)" }}
          >
            Explore APIs →
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-6xl xl:hidden">
        <SearchBar />
      </div>
    </header>
  );
}
