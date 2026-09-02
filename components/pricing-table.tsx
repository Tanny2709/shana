import { pricingModelLabel } from "@/lib/format";

export function PricingTable({
  pricingModel,
  pricingSummary,
  freeTierAvailable,
  freeTierDetails,
  rateLimits,
}: {
  pricingModel: string;
  pricingSummary: string;
  freeTierAvailable: boolean;
  freeTierDetails?: string | null;
  rateLimits?: string | null;
}) {
  const rows: { label: string; value: string }[] = [
    { label: "Model", value: pricingModelLabel(pricingModel) },
    { label: "Pricing", value: pricingSummary },
    { label: "Free tier", value: freeTierAvailable ? freeTierDetails || "Available" : "Not available" },
  ];
  if (rateLimits) rows.push({ label: "Rate limits", value: rateLimits });

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <table className="w-full text-sm">
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i !== 0 ? "border-t border-border" : ""}>
              <td className="w-40 shrink-0 bg-bg-elevated px-4 py-3 align-top font-medium text-fg-muted">
                {row.label}
              </td>
              <td className="px-4 py-3 text-fg">{row.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
