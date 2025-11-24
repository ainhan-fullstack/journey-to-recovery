import type { SMARTGoalResponse } from "./prompt.config";

export interface RiskAssessment {
  score: number;
  level: "LOW" | "MODERATE" | "HIGH";
  requires_approval: boolean;
}

export function calculateRisk(
  goalData: SMARTGoalResponse["smart_data"]
): RiskAssessment {
  //Long distance = higher risk score
  const dist = goalData.distance_meters || 0;
  const distanceScore = dist / 50;

  // Shorter duration = Higher risk score
  const weeks = Math.max(1, Math.min(goalData.timeline_weeks || 24, 24));
  const timeScore = (9 * (24 - weeks)) / 22 + 1;

  // Higher independence (4) = Higher risk score
  let assistanceScore = 1;
  if (goalData.assistance_level === 4) assistanceScore = 10;
  else if (goalData.assistance_level === 3) assistanceScore = 7;
  else if (goalData.assistance_level === 2) assistanceScore = 4;

  // Calculate total risk (Distance * Urgency * Load)
  const totalRiskScore = (distanceScore * timeScore * assistanceScore) / 10;

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
