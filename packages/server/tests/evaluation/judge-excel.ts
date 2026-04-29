/**
 * Reads all 5 scenarios-filled-Nth.xlsx files, aggregates the 5 runs per
 * scenario, judges each with GPT and Gemini in parallel, and saves results
 * as both JSON and Excel (models interleaved side by side).
 *
 * Usage:
 *   cd packages/server
 *   bun run judge-excel
 */
import { config } from "dotenv";
import * as XLSX from "xlsx";
import { resolve } from "path";
import { mkdirSync, writeFileSync } from "fs";
import { judgeWithGPT, judgeWithGemini } from "./llmJudge";
import type { JudgeScores } from "./llmJudge";

config({ path: resolve(import.meta.dir, "../../.env") });

const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? "";
const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const RESULTS_DIR = resolve(import.meta.dir, "results");

if (!OPENAI_API_KEY || !GEMINI_API_KEY) {
  console.error("Error: OPENAI_API_KEY and GEMINI_API_KEY must both be set in .env");
  process.exit(1);
}

// Shape of each row in the filled Excel files
interface ExcelRow {
  ID: string;
  Name: string;
  Turn: number;
  "User Message": string;
  "Chatbot Response": string;
}

// ExcelRow tagged with which run file it came from (1–5)
interface TaggedTurn extends ExcelRow {
  runIndex: number;
}

// Final result stored per scenario
interface ScenarioResult {
  id: string;
  name: string;
  gpt: JudgeScores | null;
  gemini: JudgeScores | null;
}

// Builds a single prompt containing all 5 runs for the judge to evaluate
function buildAggregatedPrompt(scenarioName: string, turns: TaggedTurn[]): string {
  // Group turns by run index
  const byRun = new Map<number, TaggedTurn[]>();
  for (const t of turns) {
    if (!byRun.has(t.runIndex)) byRun.set(t.runIndex, []);
    byRun.get(t.runIndex)!.push(t);
  }

  // Format each run as a labelled block, turns sorted by Turn number
  const runBlocks = [...byRun.entries()]
    .sort(([a], [b]) => a - b)
    .map(([runIdx, runTurns]) => {
      const lines = runTurns
        .sort((a, b) => a.Turn - b.Turn)
        .map((t) => `User: ${t["User Message"]}\nCamay: ${t["Chatbot Response"]}`)
        .join("\n\n");
      return `Run ${runIdx}:\n${lines}`;
    })
    .join("\n\n---\n\n");

  return `Scenario: ${scenarioName}\n\n${runBlocks}`;
}

async function main() {
  // Step 1: Read all 5 filled Excel files and tag each row with its run number
  const runLabels = ["1st", "2nd", "3rd", "4th", "5th"];
  const allTurns: TaggedTurn[] = [];

  for (const [i, label] of runLabels.entries()) {
    const filePath = resolve(import.meta.dir, `scenarios-filled-${label}.xlsx`);
    const wb = XLSX.readFile(filePath);
    const rows = XLSX.utils.sheet_to_json<ExcelRow>(wb.Sheets["Scenarios"]!);
    for (const row of rows) {
      allTurns.push({ ...row, runIndex: i + 1 });
    }
  }

  // Step 2: Group all turns by scenario ID
  const byScenario = new Map<string, TaggedTurn[]>();
  for (const t of allTurns) {
    if (!byScenario.has(t.ID)) byScenario.set(t.ID, []);
    byScenario.get(t.ID)!.push(t);
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log(`  Judging ${byScenario.size} scenarios across 5 runs`);
  console.log(`  Models: gpt-5.4-nano + gemini-2.5-flash (parallel)`);
  console.log(`${"=".repeat(70)}\n`);

  // Step 3: Judge each scenario with both models simultaneously
  const results: ScenarioResult[] = [];

  for (const [id, turns] of byScenario) {
    const name = turns[0]!.Name;
    const prompt = buildAggregatedPrompt(name, turns);

    process.stdout.write(`[${id}] ${name}… `);

    // Both models run at the same time — total wait ≈ slower of the two
    const [gpt, gemini] = await Promise.all([
      judgeWithGPT(OPENAI_API_KEY, prompt),
      judgeWithGemini(GEMINI_API_KEY, prompt),
    ]);

    results.push({ id, name, gpt, gemini });
    console.log(`GPT=${gpt?.overall ?? "FAILED"} | Gemini=${gemini?.overall ?? "FAILED"}`);
  }

  mkdirSync(RESULTS_DIR, { recursive: true });

  // Step 4: Save JSON
  const jsonPath = resolve(RESULTS_DIR, "judge-results.json");
  writeFileSync(
    jsonPath,
    JSON.stringify({ runsAggregated: 5, scenarios: results }, null, 2),
  );
  console.log(`\nJSON  → ${jsonPath}`);

  // Step 5: Save Excel — GPT and Gemini columns interleaved per metric
  const excelRows = results.map((r) => ({
    "ID":                r.id,
    "Name":              r.name,
    // Summary columns side by side
    "GPT Consistent":    r.gpt?.summary.consistent ?? "",
    "Gemini Consistent": r.gemini?.summary.consistent ?? "",
    "GPT Anomalies":     r.gpt?.summary.anomalies ?? "",
    "Gemini Anomalies":  r.gemini?.summary.anomalies ?? "",
    // Score columns side by side
    "GPT SMART":         r.gpt?.smart_quality ?? "",
    "Gemini SMART":      r.gemini?.smart_quality ?? "",
    "GPT Comm":          r.gpt?.communication_quality ?? "",
    "Gemini Comm":       r.gemini?.communication_quality ?? "",
    "GPT Safety":        r.gpt?.safety_compliance ?? "",
    "Gemini Safety":     r.gemini?.safety_compliance ?? "",
    "GPT Eff":           r.gpt?.efficiency ?? "",
    "Gemini Eff":        r.gemini?.efficiency ?? "",
    "GPT Avg":           r.gpt?.overall ?? "",
    "Gemini Avg":        r.gemini?.overall ?? "",
    // Rationale columns side by side
    "GPT Rationale":     r.gpt?.rationale ?? "",
    "Gemini Rationale":  r.gemini?.rationale ?? "",
  }));

  const sheet = XLSX.utils.json_to_sheet(excelRows);

  // Column widths matching content type
  sheet["!cols"] = [
    { wch: 6  },  // ID
    { wch: 40 },  // Name
    { wch: 60 },  // GPT Consistent
    { wch: 60 },  // Gemini Consistent
    { wch: 50 },  // GPT Anomalies
    { wch: 50 },  // Gemini Anomalies
    { wch: 11 },  // GPT SMART
    { wch: 13 },  // Gemini SMART
    { wch: 11 },  // GPT Comm
    { wch: 13 },  // Gemini Comm
    { wch: 11 },  // GPT Safety
    { wch: 13 },  // Gemini Safety
    { wch: 11 },  // GPT Eff
    { wch: 13 },  // Gemini Eff
    { wch: 11 },  // GPT Avg
    { wch: 13 },  // Gemini Avg
    { wch: 60 },  // GPT Rationale
    { wch: 60 },  // Gemini Rationale
  ];

  // Freeze ID + Name columns so they stay visible when scrolling right
  sheet["!freeze"] = { xSplit: 2, ySplit: 1 };

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, sheet, "Results");
  const excelPath = resolve(RESULTS_DIR, "judge-results.xlsx");
  XLSX.writeFile(wb, excelPath);
  console.log(`Excel → ${excelPath}\n`);
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
