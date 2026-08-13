// entities/cow/ui/cow-row.tsx
import type { Cow } from "../model/types";

export function CowRow({ cow, herdName }: { cow: Cow; herdName: string }) {
  return (
    <tr className="border-b border-rufo-border last:border-0">
      <td className="py-2.5 pr-4 text-sm font-medium text-rufo-text">
        {cow.visualTag || cow.rfidTag || `#${cow.id}`}
      </td>
      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{cow.category}</td>
      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{cow.sex === "F" ? "Hembra" : "Macho"}</td>
      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{cow.breed || "-"}</td>
      <td className="py-2.5 pr-4 text-sm text-rufo-text-muted">{herdName}</td>
      <td className="py-2.5 text-sm text-rufo-text-muted">{cow.birthDate ?? "-"}</td>
    </tr>
  );
}
