import Link from "next/link";
import { getUseCaseCounts } from "@/lib/data";

export const metadata = {
  title: "Browse by use case",
};

export default async function UseCasesPage() {
  const useCases = await getUseCaseCounts();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Browse by use case</h1>
      <p className="mt-1 text-sm text-fg-muted">
        A second way into the directory, cutting across domains — pick what you&rsquo;re trying
        to build instead of a category.
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {useCases.map(({ useCase, count }) => (
          <Link
            key={useCase}
            href={`/search?q=${encodeURIComponent(useCase)}`}
            className="flex items-center gap-1.5 rounded-full border border-border bg-bg-elevated px-3 py-1.5 text-sm text-fg transition-colors hover:border-border-strong"
          >
            {useCase}
            <span className="text-xs text-fg-subtle">{count}</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
