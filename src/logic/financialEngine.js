// logic/financialEngine.js

export function applyQuarterUpdate({ currentQuarter, history }, decisions, scenario) {
  const last = history[history.length - 1];
  const interestRate = Math.max(0.25, last.interestRate + decisions.rateChange + scenario.interestDrift);

  // Business line revenue
  const wmMargin = decisions.newLine === 'Wealth Management' ? 0.15 : 0;
  const merchantCapitalDrain = decisions.newLine === 'Merchant Banking' ? 1 : 0;
  const invBankFeeBoost = decisions.newLine === 'Investment Banking' ? 0.5 : 0;

  const revenue = (last.loans * interestRate * 0.01) + 1.5 + invBankFeeBoost;
  const expenses = (last.deposits * 0.01) + (last.loans * (last.operatingCostRatio / 100)) + merchantCapitalDrain;
  const provisions = last.loans * (last.provisionRatio / 100);
  const netIncome = revenue - expenses - provisions + (last.riaFeeIncome || 0) + (last.capital * wmMargin);

  const capital = Math.max(0, last.capital + netIncome - (merchantCapitalDrain || 0));
  const tier1 = parseFloat(((capital / last.loans) * 100).toFixed(2));
  const roe = parseFloat(((netIncome / capital) * 100).toFixed(2));

  const year = 2025 + Math.floor((currentQuarter + 1) / 4);

  return {
    year,
    capital: parseFloat(capital.toFixed(2)),
    loans: last.loans + (decisions.expansion === 'yes' ? 5 : 0),
    deposits: last.deposits + 3,
    interestRate: parseFloat(interestRate.toFixed(2)),
    operatingCostRatio: last.operatingCostRatio,
    provisionRatio: last.provisionRatio,
    riaFeeIncome: last.riaFeeIncome + (decisions.newLine === 'Wealth Management' ? 0.3 : 0),
    tier1,
    roe,
    netIncome: parseFloat(netIncome.toFixed(2)),
    revenue: parseFloat(revenue.toFixed(2)),
    expenses: parseFloat(expenses.toFixed(2)),
    provisions: parseFloat(provisions.toFixed(2)),
    boardFeedback: generateBoardFeedback(roe, tier1),
    scenarioNotes: scenario.shock ? scenario.shockImpact : ''
  };
}

function generateBoardFeedback(roe, tier1) {
  if (roe > 12 && tier1 > 12) return "Excellent performance — ROE and capital strong. Keep this momentum.";
  if (roe < 4) return "Profitability is weak. Board suggests reassessing risk or operating costs.";
  if (tier1 < 8) return "Tier 1 capital is under pressure. Consider reducing loan growth or raising capital.";
  return "Performance is steady. Continue monitoring margins and capital trends.";
}
