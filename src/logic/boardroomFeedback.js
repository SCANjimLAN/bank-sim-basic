export function generateBoardroomFeedback(current, previous) {
  const feedback = [];

  // Profitability
  if (current.roe > previous.roe + 1) {
    feedback.push("ROE has improved — shareholders will be pleased.");
  } else if (current.roe < previous.roe - 1) {
    feedback.push("ROE has slipped — the board is concerned about earnings sustainability.");
  }

  // Capital Adequacy
  if (current.tier1 < 8) {
    feedback.push("Tier 1 Capital is critically low — regulators may intervene.");
  } else if (current.tier1 < 10) {
    feedback.push("Tier 1 Capital is below peer average — board recommends strengthening capital.");
  } else {
    feedback.push("Tier 1 Capital remains healthy and above peer average.");
  }

  // Expansion strategy
  if (current.loans > previous.loans * 1.03) {
    feedback.push("Loan growth is accelerating — ensure underwriting discipline is maintained.");
  }

  // New business lines
  if (current.ibRevenue > 0 && previous.ibRevenue === 0) {
    feedback.push("Investment banking revenues are contributing — board encourages deeper talent build-out.");
  }

  if (current.mbAssets > previous.mbAssets) {
    feedback.push("Merchant banking activity has expanded — risk management teams should monitor exposures.");
  }

  // Cost discipline
  if (current.operatingCostRatio > previous.operatingCostRatio) {
    feedback.push("Operating cost ratio has risen — board urges review of staffing and expenses.");
  }

  return feedback;
}
