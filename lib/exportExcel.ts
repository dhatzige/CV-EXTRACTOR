// ============================================================
// Single-row .xlsx generation for download
// ============================================================

import ExcelJS from "exceljs";
import { ResourceEntry, COLUMN_ORDER, COLUMN_LABELS } from "./schema";

export async function generateExcelRow(entry: ResourceEntry): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Resource");

  // Header row with exact Excel column names
  const headers = COLUMN_ORDER.map((key) => COLUMN_LABELS[key]);
  sheet.addRow(headers);

  // Data row
  const values = COLUMN_ORDER.map((key) => String(entry[key] ?? ""));
  sheet.addRow(values);

  // Style header row to match PP tracker (navy background, white text)
  const headerRow = sheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 10 };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF243B60" },
    };
    cell.alignment = { horizontal: "center", wrapText: true };
  });

  // Auto-width columns
  sheet.columns.forEach((column) => {
    column.width = 20;
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
}
