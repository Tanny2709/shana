import { getDomains, getAllListingsFull } from "@/lib/data";
import { ContributeForm } from "@/components/contribute-form";

export const metadata = {
  title: "Contribute",
};

export default async function ContributePage() {
  const [domains, listings] = await Promise.all([getDomains(), getAllListingsFull()]);

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-semibold tracking-tight text-fg">Contribute</h1>
      <p className="mt-1 text-sm text-fg-muted">
        Submit a new API or propose an edit to an existing listing. Every submission is reviewed
        before it goes live.
      </p>

      <div className="mt-8">
        <ContributeForm
          domains={domains.map((d) => ({ name: d.name, slug: d.slug }))}
          listings={listings}
        />
      </div>

      <p className="mt-8 text-xs text-fg-subtle">
        Prefer to contribute via a pull request instead? See{" "}
        <code className="rounded bg-bg-elevated px-1 py-0.5">CONTRIBUTING.md</code> in the repo
        for the JSON file format.
      </p>
    </main>
  );
}
