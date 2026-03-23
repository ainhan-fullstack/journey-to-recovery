/**
 * Aggregates multiple evaluation runs for thesis reporting.
 * Reads all JSON files in results/ for a given model, computes mean ± SD.
 *
 * Usage:
 *   cd packages/server
 *   bun run aggregate -- --model-name gpt-5.4-nano
 *   bun run aggregate -- --model-name gemini-2.5-flash
 *   bun run aggregate                                  # aggregates ALL models
 */

import { readdirSync, readFileSync } from "fs";
import { resolve } from "path";

const RESULTS_DIR = resolve(import.meta.dir, "results");

// Parse --model-name flag
const modelNameIdx = process.argv.indexOf("--model-name");
const FILTER_MODEL = modelNameIdx !== -1 ? process.argv[modelNameIdx + 1] : null;

interface RunRow {
  id: string;
  name: string;
  category: string;
  difficulty: string;
  completed: boolean;
  turns: number;
  parseErrors: number;
  riskFlagSet: boolean;
  missingInfoOnFirst: boolean;
  judgeScores: {
    smart_quality: number;
    communication_quality: number;
    safety_compliance: number;
    efficiency: number;
    clinical_relevance: number;
    overall: number;
    rationale: string;
  } | null;
}

interface RunFile {
  model: string;
  timestamp: string;
  judgeEnabled: boolean;
  behavioralPassRate: { passed: number; total: number; percent: number };
  averageJudgeScore: number | null;
  scenarios: RunRow[];
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function stdDev(values: number[]): number {
  if (values.length <= 1) return 0;
  const m = mean(values);
  const variance = values.reduce((sum, v) => sum + (v - m) ** 2, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function fmt(m: number, sd: number): string {
  return `${m.toFixed(2)} ± ${sd.toFixed(2)}`;
}

function pad(s: string, w: number): string {
  return s.padEnd(w);
}

function main() {
  let files: string[];
  try {
    files = readdirSync(RESULTS_DIR).filter((f) => f.endsWith(".json"));
  } catch {
    console.error(`No results directory found at ${RESULTS_DIR}`);
    process.exit(1);
  }

  if (files.length === 0) {
    console.error("No result files found. Run report.ts first.");
    process.exit(1);
  }

  // Load and group by model
  const runsByModel = new Map<string, RunFile[]>();
  for (const file of files) {
    const data = JSON.parse(readFileSync(resolve(RESULTS_DIR, file), "utf-8")) as RunFile;
    if (FILTER_MODEL && data.model !== FILTER_MODEL) continue;
    const existing = runsByModel.get(data.model) ?? [];
    existing.push(data);
    runsByModel.set(data.model, existing);
  }

  if (runsByModel.size === 0) {
    console.error(`No results found for model "${FILTER_MODEL}".`);
    process.exit(1);
  }

  for (const [model, runs] of runsByModel) {
    console.log(`\n${"=".repeat(80)}`);
    console.log(`  Model: ${model}`);
    console.log(`  Runs:  ${runs.length}`);
    console.log(`${"=".repeat(80)}`);

    // ── Overall metrics ────────────────────────────────────────────────────────
    const passRates = runs.map((r) => r.behavioralPassRate.percent);
    const judgeAvgs = runs.map((r) => r.averageJudgeScore).filter((v): v is number => v !== null);

    console.log(`\n  Behavioral pass rate: ${fmt(mean(passRates), stdDev(passRates))}%`);
    if (judgeAvgs.length > 0) {
      console.log(`  Avg judge score:     ${fmt(mean(judgeAvgs), stdDev(judgeAvgs))} / 5.00`);
    }

    // ── Per-scenario table ─────────────────────────────────────────────────────
    const scenarioIds = runs[0]!.scenarios.map((s) => s.id);
    const hasJudge = runs.some((r) => r.judgeEnabled);

    console.log(`\n${"─".repeat(hasJudge ? 100 : 60)}`);
    const headerParts = [
      pad("ID", 4),
      pad("Difficulty", 10),
      pad("Complete%", 10),
      pad("Turns", 14),
    ];
    if (hasJudge) {
      headerParts.push(
        pad("SMART", 12),
        pad("Comm", 12),
        pad("Safe", 12),
        pad("Eff", 12),
        pad("Clin", 12),
        pad("Overall", 12),
      );
    }
    console.log(headerParts.join(" | "));
    console.log("─".repeat(hasJudge ? 100 : 60));

    for (const sid of scenarioIds) {
      const scenarioRuns = runs.map((r) => r.scenarios.find((s) => s.id === sid)!);
      const completePct = (scenarioRuns.filter((s) => s.completed).length / scenarioRuns.length) * 100;
      const turns = scenarioRuns.map((s) => s.turns);

      const rowParts = [
        pad(sid, 4),
        pad(scenarioRuns[0]!.difficulty, 10),
        pad(`${completePct.toFixed(0)}%`, 10),
        pad(fmt(mean(turns), stdDev(turns)), 14),
      ];

      if (hasJudge) {
        const dims = ["smart_quality", "communication_quality", "safety_compliance", "efficiency", "clinical_relevance", "overall"] as const;
        for (const dim of dims) {
          const vals = scenarioRuns
            .map((s) => s.judgeScores?.[dim])
            .filter((v): v is number => v != null);
          rowParts.push(pad(vals.length > 0 ? fmt(mean(vals), stdDev(vals)) : "N/A", 12));
        }
      }

      console.log(rowParts.join(" | "));
    }

    console.log("─".repeat(hasJudge ? 100 : 60));

    // ── Dimension averages across all scenarios ────────────────────────────────
    if (hasJudge) {
      console.log("\n  Judge dimension averages (across all scenarios, all runs):");
      const dims = [
        ["SMART Quality", "smart_quality"],
        ["Communication", "communication_quality"],
        ["Safety", "safety_compliance"],
        ["Efficiency", "efficiency"],
        ["Clinical Relevance", "clinical_relevance"],
        ["Overall", "overall"],
      ] as const;

      for (const [label, key] of dims) {
        const allVals: number[] = [];
        for (const run of runs) {
          for (const s of run.scenarios) {
            if (s.judgeScores?.[key] != null) allVals.push(s.judgeScores[key]);
          }
        }
        if (allVals.length > 0) {
          console.log(`    ${pad(label, 22)} ${fmt(mean(allVals), stdDev(allVals))} / 5.00`);
        }
      }
    }

    console.log();
  }

  // ── Cross-model comparison ─────────────────────────────────────────────────
  if (runsByModel.size > 1) {
    console.log(`\n${"=".repeat(80)}`);
    console.log("  Cross-Model Comparison");
    console.log(`${"=".repeat(80)}`);

    console.log(`\n${pad("Model", 25)} | ${pad("Runs", 5)} | ${pad("Pass Rate", 16)} | ${pad("Judge Avg", 16)}`);
    console.log("─".repeat(70));

    for (const [model, runs] of runsByModel) {
      const passRates = runs.map((r) => r.behavioralPassRate.percent);
      const judgeAvgs = runs.map((r) => r.averageJudgeScore).filter((v): v is number => v !== null);
      console.log(
        `${pad(model, 25)} | ${pad(String(runs.length), 5)} | ${pad(fmt(mean(passRates), stdDev(passRates)) + "%", 16)} | ${pad(judgeAvgs.length > 0 ? fmt(mean(judgeAvgs), stdDev(judgeAvgs)) : "N/A", 16)}`,
      );
    }
    console.log("─".repeat(70));
    console.log();
  }
}

main();
