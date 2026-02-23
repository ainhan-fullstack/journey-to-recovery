/**
 * Evaluation report generator — runs all 15 scenarios, collects Tier 1+2 results,
 * optionally runs the LLM judge (Tier 3), and outputs a thesis-ready summary table.
 *
 * Usage:
 *   cd packages/server
 *   bun run tests/evaluation/report.ts
 *   bun run tests/evaluation/report.ts --judge   (adds Tier 3 LLM scoring — slower + costs API calls)
 */

import { config } from "dotenv";
import { resolve } from "path";
import { ChatSimulator } from "./ChatSimulator";
import { scenarios } from "./scenarios";
import { judgeConversation } from "./llmJudge";
import type { SimulationResult } from "./ChatSimulator";
import type { JudgeScores } from "./llmJudge";

config({ path: resolve(import.meta.dir, "../../.env") });

const API_KEY = process.env.GEMINI_API_KEY ?? "";
const RUN_JUDGE = process.argv.includes("--judge");

interface ReportRow {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  completed: boolean;
  turns: number;
  parseErrors: number;
  riskFlagSet: boolean;
  missingInfoOnFirst: boolean;
  judgeScores: JudgeScores | null;
}

function pad(s: string | number, width: number): string {
  return String(s).padEnd(width);
}

async function main() {
  if (!API_KEY) {
    console.error("Error: GEMINI_API_KEY not set in packages/server/.env");
    process.exit(1);
  }

  console.log(`\n${"=".repeat(70)}`);
  console.log("  RehabLeo Evaluation Report");
  console.log(`  ${new Date().toLocaleString()}`);
  console.log(`  LLM Judge: ${RUN_JUDGE ? "enabled" : "disabled (use --judge to enable)"}`);
  console.log(`${"=".repeat(70)}\n`);

  const rows: ReportRow[] = [];
  const sim = new ChatSimulator(API_KEY);

  for (const scenario of scenarios) {
    process.stdout.write(`Running [${scenario.id}] ${scenario.name}... `);

    const result: SimulationResult = await sim.runScenario(
      scenario.id,
      scenario.messages,
      scenario.maxTurns,
    );

    const firstTurn = result.turns[0];
    const riskFlagSet = firstTurn?.parsedResponse?.risk_flag ?? false;
    const missingInfoOnFirst =
      (firstTurn?.parsedResponse?.missing_info ?? []).length > 0;
    const parseErrors = result.turns.filter((t) => !t.parseSuccess).length;

    let judgeScores: JudgeScores | null = null;
    if (RUN_JUDGE && result.turns.length > 0) {
      judgeScores = await judgeConversation(API_KEY, scenario.name, result.turns);
    }

    rows.push({
      id: scenario.id,
      name: scenario.name,
      category: scenario.goalType,
      difficulty: scenario.category,
      completed: result.reachedGoalComplete,
      turns: result.totalTurns,
      parseErrors,
      riskFlagSet,
      missingInfoOnFirst,
      judgeScores,
    });

    const status = result.reachedGoalComplete ? "✓ complete" : `✗ ${result.finalState}`;
    console.log(
      `${status} | ${result.totalTurns} turn(s)${parseErrors > 0 ? ` | ${parseErrors} parse error(s)` : ""}`,
    );
  }

  // ── Summary table ─────────────────────────────────────────────────────────────
  console.log(`\n${"─".repeat(RUN_JUDGE ? 110 : 80)}`);
  const header = [
    pad("ID", 4),
    pad("Difficulty", 10),
    pad("Goal Type", 15),
    pad("Complete?", 10),
    pad("Turns", 6),
    pad("ParseErr", 9),
    pad("RiskFlag", 9),
    pad("MissingInfo", 12),
    ...(RUN_JUDGE
      ? [pad("SMART", 6), pad("Comm", 5), pad("Safe", 5), pad("Eff", 4), pad("Clin", 5), pad("Avg", 5)]
      : []),
  ].join(" | ");
  console.log(header);
  console.log("─".repeat(RUN_JUDGE ? 110 : 80));

  let passCount = 0;
  let totalOverall = 0;
  let judgeCount = 0;

  for (const row of rows) {
    const scenario = scenarios.find((s) => s.id === row.id)!;
    const passExpected =
      scenario.expectedBehavior.shouldComplete === row.completed ||
      (scenario.expectedBehavior.shouldNotComplete && !row.completed);
    if (passExpected) passCount++;

    const judgeRow = row.judgeScores
      ? [
          pad(row.judgeScores.smart_quality, 6),
          pad(row.judgeScores.communication_quality, 5),
          pad(row.judgeScores.safety_compliance, 5),
          pad(row.judgeScores.efficiency, 4),
          pad(row.judgeScores.clinical_relevance, 5),
          pad(row.judgeScores.overall, 5),
        ]
      : RUN_JUDGE
        ? [pad("N/A", 6), pad("N/A", 5), pad("N/A", 5), pad("N/A", 4), pad("N/A", 5), pad("N/A", 5)]
        : [];

    if (row.judgeScores) {
      totalOverall += row.judgeScores.overall;
      judgeCount++;
    }

    console.log(
      [
        pad(row.id, 4),
        pad(row.difficulty, 10),
        pad(row.category, 15),
        pad(row.completed ? "YES" : "NO", 10),
        pad(row.turns, 6),
        pad(row.parseErrors, 9),
        pad(row.riskFlagSet ? "YES" : "no", 9),
        pad(row.missingInfoOnFirst ? "YES" : "no", 12),
        ...judgeRow,
      ].join(" | "),
    );
  }

  console.log(`${"─".repeat(RUN_JUDGE ? 110 : 80)}`);
  console.log(
    `\nBehavioral pass rate: ${passCount}/${rows.length} (${Math.round((passCount / rows.length) * 100)}%)`,
  );
  if (RUN_JUDGE && judgeCount > 0) {
    console.log(
      `Average LLM-judge overall score: ${(totalOverall / judgeCount).toFixed(2)} / 5.00`,
    );
  }
  console.log();

  // ── Per-scenario judge rationale ──────────────────────────────────────────────
  if (RUN_JUDGE) {
    console.log("\nLLM Judge Rationale:");
    for (const row of rows) {
      if (row.judgeScores?.rationale) {
        console.log(`  [${row.id}] ${row.judgeScores.rationale}`);
      }
    }
    console.log();
  }
}

main().catch((err) => {
  console.error("Report generation failed:", err);
  process.exit(1);
});
