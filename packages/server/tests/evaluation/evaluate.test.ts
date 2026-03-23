/// <reference types="bun" />
/**
 * Tier 1 + Tier 2 evaluation — run with: cd packages/server && bun test
 *
 * Tier 1: Structural checks (JSON valid, schema fields present, state values legal)
 * Tier 2: Behavioral checks (easy goals complete, missing info flagged, SMART booleans accurate)
 *
 * Requires OPENAI_API_KEY in packages/server/.env (was GEMINI_API_KEY for Gemini)
 * Tests call the LLM directly — expect ~30-60s run time.
 */

import { describe, it, expect } from "bun:test";
import { config } from "dotenv";
import { resolve } from "path";
import { ChatSimulator } from "./ChatSimulator";
import { scenarios } from "./scenarios";
import type { SMARTGoalResponse } from "../../utilities/prompt.config";

config({ path: resolve(import.meta.dir, "../../.env") });

// const API_KEY = process.env.GEMINI_API_KEY ?? "";
const API_KEY = process.env.OPENAI_API_KEY ?? "";
const VALID_STATES = new Set([
  "gathering_info",
  "drafting_goal",
  "refining_goal",
  "goal_complete",
]);
const VALID_CATEGORIES = new Set([
  "mobility",
  "upper_limb",
  "balance",
  "adl",
  "strength",
  "communication",
  "other",
]);

function assertSchemaValid(parsed: SMARTGoalResponse, turnLabel: string) {
  // Top-level fields
  expect(typeof parsed.goal_summary, `${turnLabel}: goal_summary`).toBe(
    "string",
  );
  expect(
    VALID_STATES.has(parsed.conversation_state),
    `${turnLabel}: valid state`,
  ).toBe(true);
  expect(typeof parsed.risk_flag, `${turnLabel}: risk_flag`).toBe("boolean");
  expect(Array.isArray(parsed.missing_info), `${turnLabel}: missing_info`).toBe(
    true,
  );

  // user_communication
  expect(
    typeof parsed.user_communication.message,
    `${turnLabel}: message`,
  ).toBe("string");
  expect(
    parsed.user_communication.message.length,
    `${turnLabel}: message non-empty`,
  ).toBeGreaterThan(0);
  expect(
    typeof parsed.user_communication.question,
    `${turnLabel}: question`,
  ).toBe("string");

  // smart_data
  const sd = parsed.smart_data;
  expect(
    VALID_CATEGORIES.has(sd.goal_category),
    `${turnLabel}: valid category`,
  ).toBe(true);
  expect(typeof sd.target_activity, `${turnLabel}: target_activity`).toBe(
    "string",
  );
  expect(typeof sd.current_ability, `${turnLabel}: current_ability`).toBe(
    "string",
  );
  expect(typeof sd.frequency, `${turnLabel}: frequency`).toBe("string");
  expect(typeof sd.timeline_weeks, `${turnLabel}: timeline_weeks`).toBe(
    "number",
  );
  expect(
    [1, 2, 3, 4].includes(sd.assistance_level),
    `${turnLabel}: assistance_level`,
  ).toBe(true);

  // measurement
  const m = sd.measurement;
  expect(typeof m.metric, `${turnLabel}: metric`).toBe("string");
  expect(typeof m.unit, `${turnLabel}: unit`).toBe("string");
  const cvOk = m.current_value === null || typeof m.current_value === "number";
  const tvOk = m.target_value === null || typeof m.target_value === "number";
  expect(cvOk, `${turnLabel}: current_value`).toBe(true);
  expect(tvOk, `${turnLabel}: target_value`).toBe(true);

  // smart_assessment
  const sa = sd.smart_assessment;
  for (const key of [
    "is_specific",
    "is_measurable",
    "is_achievable",
    "is_relevant",
    "is_time_bound",
  ] as const) {
    expect(typeof sa[key], `${turnLabel}: ${key}`).toBe("boolean");
  }
}

// ── Tier 1: Structural checks (all 15 scenarios, first turn only) ─────────────

describe("Tier 1 — Structural: JSON and schema validity", () => {
  for (const scenario of scenarios) {
    it(`[${scenario.id}] ${scenario.name} — first turn parses and matches schema`, async () => {
      if (!API_KEY) {
        console.warn("OPENAI_API_KEY not set — skipping");
        return;
      }
      const sim = new ChatSimulator(API_KEY);
      const turn = await sim.sendMessage(scenario.messages[0]!, 1);

      expect(turn.parseSuccess, `${scenario.id}: JSON parse succeeded`).toBe(
        true,
      );
      expect(
        turn.parsedResponse,
        `${scenario.id}: parsedResponse not null`,
      ).not.toBeNull();

      if (turn.parsedResponse) {
        assertSchemaValid(turn.parsedResponse, scenario.id);
      }
    }, 30_000);
  }
});

// ── Tier 2: Behavioral checks ─────────────────────────────────────────────────

describe("Tier 2 — Behavioral: easy scenarios complete within max turns", () => {
  const easyScenarios = scenarios.filter((s) => s.category === "easy");

  for (const scenario of easyScenarios) {
    it(`[${scenario.id}] ${scenario.name} — reaches goal_complete`, async () => {
      if (!API_KEY) {
        console.warn("OPENAI_API_KEY not set — skipping");
        return;
      }
      const sim = new ChatSimulator(API_KEY);
      const result = await sim.runScenario(
        scenario.id,
        scenario.messages,
        scenario.maxTurns,
      );

      expect(
        result.reachedGoalComplete,
        `${scenario.id}: reached goal_complete`,
      ).toBe(true);
      expect(
        result.totalTurns,
        `${scenario.id}: turns ≤ maxTurns`,
      ).toBeLessThanOrEqual(scenario.maxTurns);
      expect(result.errors, `${scenario.id}: no errors`).toHaveLength(0);

      // Final state category should match expected
      if (scenario.expectedBehavior.expectedCategory) {
        const lastParsed =
          result.turns[result.turns.length - 1]?.parsedResponse;
        expect(
          lastParsed?.smart_data.goal_category,
          `${scenario.id}: correct category`,
        ).toBe(scenario.expectedBehavior.expectedCategory);
      }
    }, 60_000);
  }
});

describe("Tier 2 — Behavioral: missing-info scenarios flag missing fields on first turn", () => {
  const missingInfoScenarios = scenarios.filter(
    (s) => s.expectedBehavior.shouldHaveMissingInfo,
  );

  for (const scenario of missingInfoScenarios) {
    it(`[${scenario.id}] ${scenario.name} — first response has non-empty missing_info`, async () => {
      if (!API_KEY) {
        console.warn("OPENAI_API_KEY not set — skipping");
        return;
      }
      const sim = new ChatSimulator(API_KEY);
      const turn = await sim.sendMessage(scenario.messages[0]!, 1);

      expect(turn.parseSuccess).toBe(true);
      expect(
        (turn.parsedResponse?.missing_info ?? []).length,
        `${scenario.id}: has missing_info`,
      ).toBeGreaterThan(0);
      expect(
        turn.parsedResponse?.conversation_state,
        `${scenario.id}: stays in gathering_info`,
      ).toBe("gathering_info");
    }, 30_000);
  }
});

describe("Tier 2 — Behavioral: safety scenarios set risk_flag", () => {
  const safetyScenarios = scenarios.filter(
    (s) => s.expectedBehavior.shouldSetRiskFlag,
  );

  for (const scenario of safetyScenarios) {
    it(`[${scenario.id}] ${scenario.name} — sets risk_flag on first turn`, async () => {
      if (!API_KEY) {
        console.warn("OPENAI_API_KEY not set — skipping");
        return;
      }
      const sim = new ChatSimulator(API_KEY);
      const turn = await sim.sendMessage(scenario.messages[0]!, 1);

      expect(turn.parseSuccess).toBe(true);
      expect(
        turn.parsedResponse?.risk_flag,
        `${scenario.id}: risk_flag is true`,
      ).toBe(true);
    }, 30_000);
  }
});

describe("Tier 2 — Behavioral: SMART booleans — no timeline means is_time_bound false", () => {
  it("Vague first message 'I want to get better' sets is_time_bound=false", async () => {
    if (!API_KEY) {
      console.warn("OPENAI_API_KEY not set — skipping");
      return;
    }
    const sim = new ChatSimulator(API_KEY);
    const turn = await sim.sendMessage("I want to get better.", 1);
    expect(turn.parseSuccess).toBe(true);
    expect(turn.parsedResponse?.smart_data.smart_assessment.is_time_bound).toBe(
      false,
    );
    expect(turn.parsedResponse?.smart_data.timeline_weeks).toBe(0);
  }, 30_000);
});

describe("Tier 2 — Behavioral: goal_complete not set without explicit confirmation", () => {
  it("[E1-partial] First message alone does not complete the goal", async () => {
    if (!API_KEY) {
      console.warn("OPENAI_API_KEY not set — skipping");
      return;
    }
    const sim = new ChatSimulator(API_KEY);
    const turn = await sim.sendMessage(
      "I want to walk to the park, it is about 100 metres away. I can walk 20 metres now with a cane. I want to get there in 4 weeks.",
      1,
    );
    expect(turn.parseSuccess).toBe(true);
    expect(turn.parsedResponse?.conversation_state).not.toBe("goal_complete");
  }, 30_000);
});
