/**
 * Automatically fills the "Chatbot Response" column in scenarios.xlsx
 * by replaying each scenario through ChatSimulator.
 *
 * Output: scenarios-filled.xlsx (original template is preserved)
 *
 * Usage:
 *   cd packages/server
 *   bun run fill-excel
 *
 * Requires OPENAI_API_KEY (or GEMINI_API_KEY if EVAL_MODEL=gemini) in .env
 */

import { config } from "dotenv";
import * as XLSX from "xlsx";
import { resolve } from "path";
import { ChatSimulator } from "./ChatSimulator";
import { scenarios } from "./scenarios";

config({ path: resolve(import.meta.dir, "../../.env") });

const isGemini = process.env.EVAL_MODEL === "gemini-2.5-flash";
const API_KEY = isGemini
  ? (process.env.GEMINI_API_KEY ?? "")
  : (process.env.OPENAI_API_KEY ?? "");

if (!API_KEY) {
  const keyName = isGemini ? "GEMINI_API_KEY" : "OPENAI_API_KEY";
  console.error(`Error: ${keyName} not set in packages/server/.env`);
  process.exit(1);
}

const INPUT_PATH  = resolve(import.meta.dir, "scenarios.xlsx");
const OUTPUT_PATH = resolve(import.meta.dir, "scenarios-filled.xlsx");

interface Row {
  ID: string;
  Name: string;
  Category: string;
  "Goal Type": string;
  Turn: number;
  "User Message": string;
  "Chatbot Response": string;
}

async function main() {
  const workbook = XLSX.readFile(INPUT_PATH);
  const sheet = workbook.Sheets["Scenarios"]!;
  const rows = XLSX.utils.sheet_to_json<Row>(sheet);

  console.log(`\n${"=".repeat(70)}`);
  console.log(`  Filling ${rows.length} rows across ${scenarios.length} scenarios`);
  console.log(`  Model: ${isGemini ? "gemini-2.5-flash" : "gpt-5.4-nano"}`);
  console.log(`${"=".repeat(70)}\n`);

  let totalTurns = 0;
  let parseErrors = 0;

  for (const scenario of scenarios) {
    const scenarioRows = rows.filter((r) => r.ID === scenario.id);
    if (scenarioRows.length === 0) continue;

    const simulator = new ChatSimulator(API_KEY);

    for (let i = 0; i < scenarioRows.length; i++) {
      const row = scenarioRows[i]!;
      process.stdout.write(`  [${scenario.id}] Turn ${i + 1}/${scenarioRows.length} … `);

      try {
        const turn = await simulator.sendMessage(row["User Message"], i + 1);

        if (turn.parsedResponse) {
          const msg = turn.parsedResponse.user_communication.message ?? "";
          const q   = turn.parsedResponse.user_communication.question ?? "";
          row["Chatbot Response"] = q ? `${msg}\n\n${q}` : msg;
        } else {
          row["Chatbot Response"] = turn.rawResponse;
          parseErrors++;
        }

        const state = turn.parsedResponse?.conversation_state ?? "parse_error";
        console.log(`✓  [${state}]`);
      } catch (err: any) {
        row["Chatbot Response"] = `ERROR: ${err?.message ?? String(err)}`;
        console.log(`✗  ERROR: ${err?.message ?? String(err)}`);
      }

      totalTurns++;
    }
  }

  // ── Write output workbook ──────────────────────────────────────────────────
  const newSheet = XLSX.utils.json_to_sheet(rows);

  newSheet["!cols"] = [
    { wch: 6 },   // ID
    { wch: 45 },  // Name
    { wch: 10 },  // Category
    { wch: 16 },  // Goal Type
    { wch: 6 },   // Turn
    { wch: 80 },  // User Message
    { wch: 80 },  // Chatbot Response
  ];

  newSheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const newWorkbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(newWorkbook, newSheet, "Scenarios");
  XLSX.writeFile(newWorkbook, OUTPUT_PATH);

  console.log(`\n${"=".repeat(70)}`);
  console.log(`  Done — ${totalTurns} turns processed, ${parseErrors} parse error(s)`);
  console.log(`  Saved → ${OUTPUT_PATH}`);
  console.log(`${"=".repeat(70)}\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
