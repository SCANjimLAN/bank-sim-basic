// src/logic/financialEngine.js

export function applyQuarterUpdate(prevState, decisions, scenario) {
  const { financials } = prevState;

  // Destructure economic inputs
  const { gdpGrowth, inflation, interestRate, riskEnvironment } = scenario;

  // Decisions
  const rateChange = parseFloat(decisions.rateChange || 0);
  const launchedLine = decisions.newLine;
  const expanded = decisions.expansion || false;
  const risk = decisions.riskTolerance || 'maintain';

  // Clone financials for update
  const next = { ...financials };

  // === Simulate Economic Impact ===
  let incomeDelta = 0;
  let costDelta = 0;

  // Interest income impact
  next.interestRate = financials.interestRate + rateChange;
  incomeDelta += rateChange * 2; // 0.25% = $0.5M (example scaling)

  // New business line
  if (launchedLine && launchedLine !== 'None') {
    incomeDelta += 1.0; // Basic assumed $1M annualized contribution
  }

  // Expansion increases both income and cost
  if (expanded === 'yes') {
    incomeDelta += 0.5;
    costDelta += 0.3;
  }

  // Risk tolerance adjusts provisioning
  if (risk === 'tighten') {
    next.provisionRatio = Math.max(0, financials.provisionRatio - 0.2);
  } else if (risk === 'loosen') {
    next.provisionRatio = financials.provisionRatio + 0.3;
  }

  // GDP impact on loan growth
  next.loans += Math.max(0, gdpGrowth / 2); // +1M for 2% GDP

  // Update net income (assumed annualized)
  next.netIncome = parseFloat((financials.netIncome + incomeDelta - costDelta).toFixed(2));

  // ROE — based on capital, assuming net income is already annualized
  next.roe = parseFloat((next.netIncome / (next.capital || 1) * 100).toFixed(2));

  // Tier 1 adjustment from retained earnings
  next.tier1 = parseFloat((financials.tier1 + (next.netIncome * 0.1)).toFixed(2));

  // Capital increases with retained earnings
  next.capital = parseFloat((financials.capital + next.netIncome * 0.5).toFixed(2));

  // Quarter label
  next.quarter = scenario.quarter;

  return next;
}
