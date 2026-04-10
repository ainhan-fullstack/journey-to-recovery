/**
 * ChatSimulator — calls the LLM directly (bypasses Express) for fast, deterministic evaluation.
 * Uses temperature: 0.0 so responses are reproducible.
 */
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import {
  CAMAY_SYSTEM_PROMPT,
  type SMARTGoalResponse,
} from "../../utilities/prompt.config";
import "dotenv/config";

export interface SimulationTurn {
  turnNumber: number;
  userMessage: string;
  rawResponse: string;
  parsedResponse: SMARTGoalResponse | null;
  parseSuccess: boolean;
}

export interface SimulationResult {
  scenarioId: string;
  turns: SimulationTurn[];
  finalState: string;
  reachedGoalComplete: boolean;
  totalTurns: number;
  errors: string[];
}

export class ChatSimulator {
  private ai: GoogleGenAI | OpenAI;
  private history: any;

  constructor(apiKey: string) {
    if (process.env.EVAL_MODEL === "gemini") {
      this.ai = new GoogleGenAI({ apiKey });
    } else {
      this.ai = new OpenAI({ apiKey });
    }
    this.history = [];
  }

  async sendMessage(
    userMessage: string,
    turnNumber: number,
  ): Promise<SimulationTurn> {
    let rawText = "";

    if (process.env.EVAL_MODEL === "gemini" && this.ai instanceof GoogleGenAI) {
      this.history.push({ role: "user", parts: [{ text: userMessage }] });
      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: this.history,
        config: {
          temperature: 0.0,
          maxOutputTokens: 3000,
          systemInstruction: CAMAY_SYSTEM_PROMPT,
          responseMimeType: "application/json",
        },
      });

      rawText = response.text ?? "";
      this.history.push({ role: "model", parts: [{ text: rawText }] });
    } else if (this.ai instanceof OpenAI) {
      this.history.push({ role: "user", content: userMessage });
      const response = await this.ai.chat.completions.create({
        model: "gpt-5.4-nano",
        messages: [
          { role: "system", content: CAMAY_SYSTEM_PROMPT },
          ...this.history,
        ],
        temperature: 0.0,
        //max_tokens: 3000,
        max_completion_tokens: 500,
        response_format: { type: "json_object" },
      });

      rawText = response.choices[0]?.message?.content ?? "";
      this.history.push({ role: "assistant", content: rawText });
    }

    let parsedResponse: SMARTGoalResponse | null = null;
    let parseSuccess = false;

    try {
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1) {
        parsedResponse = JSON.parse(
          rawText.substring(firstBrace, lastBrace + 1),
        ) as SMARTGoalResponse;
        parseSuccess = true;
      }
    } catch {
      // parse failed — rawText captured for inspection
    }

    return {
      turnNumber,
      userMessage,
      rawResponse: rawText,
      parsedResponse,
      parseSuccess,
    };
  }

  async runScenario(
    scenarioId: string,
    messages: string[],
    maxTurns = 10,
  ): Promise<SimulationResult> {
    this.reset();
    const turns: SimulationTurn[] = [];
    const errors: string[] = [];

    for (let i = 0; i < messages.length && turns.length < maxTurns; i++) {
      try {
        const turn = await this.sendMessage(messages[i]!, turns.length + 1);
        turns.push(turn);
        if (!turn.parseSuccess) {
          errors.push(`Turn ${turn.turnNumber}: JSON parse failed`);
        }
        if (turn.parsedResponse?.conversation_state === "goal_complete") {
          break;
        }
      } catch (err: any) {
        errors.push(`Turn ${turns.length + 1}: API error — ${err?.message}`);
        break;
      }
    }

    const lastTurn = turns[turns.length - 1];
    const finalState =
      lastTurn?.parsedResponse?.conversation_state ?? "unknown";

    return {
      scenarioId,
      turns,
      finalState,
      reachedGoalComplete: finalState === "goal_complete",
      totalTurns: turns.length,
      errors,
    };
  }

  reset() {
    this.history = [];
  }
}
