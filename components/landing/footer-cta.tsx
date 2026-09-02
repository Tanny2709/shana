import Link from "next/link";

// GITHUB_REPO ("owner/repo") is optional — this project has no public repo
// configured yet. When unset, this renders a generic open-source callout
// with no link rather than a fabricated repo URL or an invented star count.
async function getStarCount(repo: string): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      next: { revalidate: 3600 },
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
  } catch {
    return null;
  }
}

export async function FooterCTA() {
  const repo = process.env.GITHUB_REPO;
  const stars = repo ? await getStarCount(repo) : null;

  return (
    <div className="flex flex-col items-center gap-6 rounded-lg border border-border bg-bg-elevated px-6 py-16 text-center">
      <h2 className="text-2xl font-semibold tracking-tight text-fg">
        Find your next API key in seconds
      </h2>
      <Link
        href="/search"
        className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-fg transition-opacity hover:opacity-90"
      >
        Start searching
      </Link>
      <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-fg-muted">
        {repo ? (
          <a
            href={`https://github.com/${repo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-fg"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 5.02 3.26 9.27 7.77 10.77.57.1.78-.25.78-.55v-1.94c-3.16.69-3.83-1.52-3.83-1.52-.52-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.73 2.65 1.23 3.3.94.1-.73.4-1.23.72-1.51-2.52-.29-5.17-1.26-5.17-5.6 0-1.24.44-2.25 1.17-3.04-.12-.29-.51-1.45.11-3.02 0 0 .96-.31 3.14 1.16a10.9 10.9 0 0 1 5.72 0c2.18-1.47 3.14-1.16 3.14-1.16.62 1.57.23 2.73.11 3.02.73.79 1.17 1.8 1.17 3.04 0 4.35-2.65 5.31-5.18 5.59.41.35.77 1.04.77 2.1v3.11c0 .3.2.66.79.55 4.5-1.5 7.76-5.76 7.76-10.77C23.25 5.48 18.27.5 12 .5z" />
            </svg>
            {stars !== null ? `${stars.toLocaleString()} stars on GitHub` : "Open source on GitHub"}
          </a>
        ) : (
          <span>Open source</span>
        )}
        <span className="text-fg-subtle">·</span>
        <Link href="/contribute" className="hover:text-fg">
          Contribute an API
        </Link>
      </div>
    </div>
  );
}
