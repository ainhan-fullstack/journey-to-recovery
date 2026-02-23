import type { SMARTGoalResponse } from "./prompt.config";

export interface RiskAssessment {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH";
  requires_approval: boolean;
}

export function calculateRisk(
  goalData: SMARTGoalResponse["smart_data"]
): RiskAssessment {
  // Improvement ratio: how ambitious is the change from current to target
  const current = goalData.measurement.current_value;
  const target = goalData.measurement.target_value;
  let improvementRatio = 1;

  if (current !== null && current > 0 && target !== null && target > 0) {
    improvementRatio = target / current; // e.g. 100m / 20m = 5x
  } else if ((current === null || current === 0) && target !== null && target > 0) {
    improvementRatio = 10; // going from nothing to something = very ambitious
  }
  const improvementScore = Math.min(improvementRatio, 10); // cap at 10

  // Shorter timeline = higher risk score (range: 1 to 10)
  const weeks = Math.max(1, Math.min(goalData.timeline_weeks || 24, 24));
  const timeScore = (9 * (24 - weeks)) / 22 + 1;

  // Higher independence target = more ambitious goal = higher risk score
  let assistanceScore = 1;
  if (goalData.assistance_level === 4) assistanceScore = 10;
  else if (goalData.assistance_level === 3) assistanceScore = 7;
  else if (goalData.assistance_level === 2) assistanceScore = 4;

  // Category modifier: activities with fall risk score higher
  const categoryRisk: Record<string, number> = {
    balance: 1.5,   // highest fall risk
    mobility: 1.3,  // fall risk
    strength: 0.9,
    upper_limb: 0.8,
    adl: 0.7,       // lower physical risk
    other: 1.0,
    communication: 0.4, // no physical risk
  };
  const categoryModifier = categoryRisk[goalData.goal_category] ?? 1.0;

  // Total risk = Ambition × Urgency × Independence target × Activity risk
  const totalRiskScore =
    (improvementScore * timeScore * assistanceScore * categoryModifier) / 10;

  let level: RiskAssessment["level"] = "LOW";
  let requires_approval = false;

  if (totalRiskScore > 25) {
    level = "HIGH";
    requires_approval = true;
  } else if (totalRiskScore > 10) {
    level = "MODERATE";
    requires_approval = false;
  }

  return {
    score: parseFloat(totalRiskScore.toFixed(2)),
    level,
    requires_approval,
  };
}
