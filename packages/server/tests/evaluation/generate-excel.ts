/**
 * Generates an Excel workbook from scenarios.ts for manual annotation.
 *
 * Layout — one row per conversation turn:
 *   ID | Name | Category | Goal Type | Turn | User Message | Chatbot Response
 *
 * The "Chatbot Response" column is intentionally left blank for manual entry.
 *
 * Usage:
 *   cd packages/server
 *   bun run tests/evaluation/generate-excel.ts
 */

import * as XLSX from "xlsx";
import { resolve } from "path";
import { scenarios } from "./scenarios";

interface Row {
  ID: string;
  Name: string;
  Category: string;
  "Goal Type": string;
  Turn: number | string;
  "User Message": string;
  "Chatbot Response": string;
}

const rows: Row[] = [];

for (const scenario of scenarios) {
  scenario.messages.forEach((msg, index) => {
    rows.push({
      ID: scenario.id,
      Name: scenario.name,
      Category: scenario.category,
      "Goal Type": scenario.goalType,
      Turn: index + 1,
      "User Message": msg,
      "Chatbot Response": "",
    });
  });
}

const worksheet = XLSX.utils.json_to_sheet(rows);

// ── Column widths ──────────────────────────────────────────────────────────────
worksheet["!cols"] = [
  { wch: 6 },   // ID
  { wch: 45 },  // Name
  { wch: 10 },  // Category
  { wch: 16 },  // Goal Type
  { wch: 6 },   // Turn
  { wch: 80 },  // User Message
  { wch: 80 },  // Chatbot Response
];

// ── Freeze header row ──────────────────────────────────────────────────────────
worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Scenarios");

const outputPath = resolve(import.meta.dir, "scenarios.xlsx");
XLSX.writeFile(workbook, outputPath);

console.log(`Exported ${rows.length} rows (${scenarios.length} scenarios) → ${outputPath}`);
