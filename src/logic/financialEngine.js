// src/logic/financialEngine.js

export function applyQuarterUpdate(prevState, decisions, scenario) {
  const { financials } = prevState;

  // Destructure economic inputs
  const { gdpGrowth, inflation, interestRate, riskEnvironment } = scenario;

  // Apply decision effects
  const rateChange = parseFloat(decisions.rateChange || 0);
  const launchedLine = decisions.newLine;
  const expanded = decisions.expansion || false;
  const risk = decisions.riskTolerance || 'maintain';

  // New financials (copied from prior quarter)
  const next = { ...financials };

  // --- Simulate Income Statement ---
  let incomeDelta = 0;
  let costDelta = 0;

  // Interest income effect
  next.interestRate = financials.interestRate + rateChange;
  incomeDelta += rateChange * 2; // Simplified: 25bps = +0.5M

  // Business line adds fee income
  if (launchedLine && launchedLine !== 'None') {
    incomeDelta += 1.0;
  }

  // Expansion increases both income and cost
  if (expanded === 'yes') {
    incomeDelta += 0.5;
    costDelta += 0.3;
  }

  // Risk tolerance may affect provisions
  if (risk === 'tighten') {
    next.provisionRatio = financials.provisionRatio - 0.2;
  } else if (risk === 'loosen') {
    next.provisionRatio = financials.provisionRatio + 0.3;
  }

  // GDP effect on loan growth
  next.loans += Math.max(0, gdpGrowth / 2); // eg: 2% GDP = +1M loans

  // Expense changes
  next.operatingCostRatio += costDelta;

  // Net income update (simplified)
  next.netIncome = parseFloat((financials.netIncome + incomeDelta - costDelta).toFixed(2));

  // ROE updated
  next.roe = parseFloat((next.netIncome / (next.capital || 1) * 100).toFixed(2));

  // Tier 1 changes slightly with earnings
  next.tier1 = parseFloat((financials.tier1 + (next.netIncome * 0.1)).toFixed(2));

  // Capital increases with retained earnings
  next.capital = parseFloat((financials.capital + next.netIncome * 0.5).toFixed(2));

  // Save quarter tag
  next.quarter = scenario.quarter;

  return next;
}
