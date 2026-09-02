import { prisma } from "@/lib/prisma";
import { AdminContributionCard } from "@/components/admin-contribution-card";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const [pending, recent] = await Promise.all([
    prisma.contribution.findMany({
      where: { status: "pending" },
      orderBy: { createdAt: "asc" },
      include: { apiListing: { include: { provider: true } } },
    }),
    prisma.contribution.findMany({
      where: { status: { not: "pending" } },
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: { apiListing: { include: { provider: true } } },
    }),
  ]);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Review queue</h1>
      <p className="mt-1 text-sm text-fg-muted">
        {pending.length} pending contribution{pending.length === 1 ? "" : "s"}
      </p>

      <div className="mt-6 flex flex-col gap-3">
        {pending.length === 0 ? (
          <p className="rounded-lg border border-border bg-bg-elevated px-4 py-8 text-center text-sm text-fg-muted">
            Nothing pending review.
          </p>
        ) : (
          pending.map((c) => <AdminContributionCard key={c.id} contribution={c} />)
        )}
      </div>

      {recent.length > 0 && (
        <div className="mt-10">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-fg-subtle">
            Recently reviewed
          </h2>
          <div className="flex flex-col gap-3">
            {recent.map((c) => (
              <AdminContributionCard key={c.id} contribution={c} />
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
