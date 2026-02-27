// ============================================================
// Tab-separated values export for clipboard → Excel paste
// ============================================================

import { ResourceEntry, COLUMN_ORDER } from "./schema";

export function toTSV(entry: ResourceEntry): string {
  return COLUMN_ORDER.map((key) => {
    const value = String(entry[key] ?? "");
    // Escape tabs and newlines so Excel treats each as a single cell
    return value.replace(/\t/g, " ").replace(/\n/g, " ");
  }).join("\t");
}
