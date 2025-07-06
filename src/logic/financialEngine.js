export function applyQuarterUpdate(state, decisions, scenario) {
  const prev = state.history[state.history.length - 1];
  const q = state.currentQuarter + 1;

  const rateDelta = decisions.rateChange || 0;
  const baseRate = Math.max(0, prev.interestRate + rateDelta + scenario.rateAdjustment);

  const riskFactor =
    decisions.riskTolerance === 'tighten' ? 0.95 :
    decisions.riskTolerance === 'loosen' ? 1.05 : 1.0;

  const loanGrowth =
    (decisions.expansion === 'yes' ? 1.03 : 1.00) *
    riskFactor *
    (1 + (scenario.loanDemandShock || 0));

  const loans = Math.round(prev.loans * loanGrowth);
  const deposits = Math.round(prev.deposits * (1 + scenario.depositShift));
  const capital = prev.capital + prev.netIncome * 0.75;

  // Cost management
  const costAdjustment =
    decisions.costStrategy === 'tighten' ? -2 :
    decisions.costStrategy === 'loosen' ? 2 : 0;

  const operatingCostRatio = Math.min(90, Math.max(40, prev.operatingCostRatio + costAdjustment));

  // Fee income from RIA, Wealth Mgmt, Investment Banking, etc.
  const riaFeeIncome = prev.riaFeeIncome * (1 + (scenario.riaGrowth || 0.02));
  const ibRevenue = decisions.newLine === 'Investment Banking' ? 1.0 : (prev.ibRevenue || 0);
  const wmRevenue = decisions.newLine === 'Wealth Management' ? 0.8 : (prev.wmRevenue || 0.5);
  const mbAssets = decisions.newLine === 'Merchant Banking'
    ? (prev.mbAssets || 0) + 5
    : (prev.mbAssets || 0);

  const totalIncome =
    loans * (baseRate / 100) +
    deposits * (0.01) +
    riaFeeIncome +
    ibRevenue +
    wmRevenue +
    mbAssets * 0.04;

  const operatingCosts = (operatingCostRatio / 100) * totalIncome;
  const provisions = (prev.provisionRatio / 100) * loans;
  const netIncome = Math.max(0, totalIncome - operatingCosts - provisions);
  const tier1 = (capital / loans) * 100;
  const roe = Math.min(20, ((netIncome / capital) * 100).toFixed(1));

  return {
    year: 2025 + Math.floor(q / 4),
    quarter: q,
    capital: parseFloat(capital.toFixed(1)),
    loans,
    deposits,
    interestRate: parseFloat(baseRate.toFixed(2)),
    operatingCostRatio,
    provisionRatio: prev.provisionRatio,
    riaFeeIncome: parseFloat(riaFeeIncome.toFixed(2)),
    ibRevenue,
    wmRevenue,
    mbAssets,
    tier1: parseFloat(tier1.toFixed(1)),
    roe: parseFloat(roe),
    netIncome: parseFloat(netIncome.toFixed(2)),
    feedback: generateQuarterlyFeedback(decisions, scenario, netIncome, roe, tier1),
  };
}

function generateQuarterlyFeedback(decisions, scenario, netIncome, roe, tier1) {
  const comments = [];

  if (decisions.newLine && netIncome > 1.5) {
    comments.push(`Your launch of ${decisions.newLine} is contributing to growth.`);
  }

  if (scenario.externalShock) {
    comments.push(`⚠️ External shock: ${scenario.externalShock}`);
  }

  if (roe < 5) {
    comments.push("ROE is soft — profitability may become a concern.");
  } else if (roe > 10) {
    comments.push("Strong ROE performance this quarter.");
  }

  if (tier1 < 8) {
    comments.push("Tier 1 Capital ratio is below minimum standards — immediate action required.");
  }

  return comments.join(" ");
}
