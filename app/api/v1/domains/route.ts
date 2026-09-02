import { getDomains } from "@/lib/data";
import { jsonResponse, corsPreflight } from "@/lib/api-response";

export async function OPTIONS() {
  return corsPreflight();
}

export async function GET() {
  const domains = await getDomains();
  return jsonResponse(
    domains.map((d) => ({
      name: d.name,
      slug: d.slug,
      description: d.description,
      listingCount: d._count.listings,
    })),
  );
}
