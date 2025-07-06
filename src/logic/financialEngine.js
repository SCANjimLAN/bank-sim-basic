export function applyQuarterUpdate(state, decisions, scenario) {
  const last = state.history[state.history.length - 1];

  // Base numbers
  let capital = last.capital;
  let loans = last.loans;
  let deposits = last.deposits;
  let interestRate = last.interestRate + decisions.rateChange;
  let operatingCostRatio = last.operatingCostRatio;
  let provisionRatio = last.provisionRatio;
  let riaFeeIncome = last.riaFeeIncome;
  let tier1 = last.tier1;

  // Adjustments
  const expansionEffect = decisions.expansion === 'yes' ? 1.05 : 1.0;
  const riskEffect = decisions.riskTolerance === 'loosen' ? 1.08 : decisions.riskTolerance === 'tighten' ? 0.95 : 1.0;
  const loanGrowth = 1.02 * expansionEffect * riskEffect;
  const depositGrowth = 1.01 * expansionEffect;

  // Update values
  loans *= loanGrowth;
  deposits *= depositGrowth;

  // New business line revenue
  let businessLineIncome = 0;
  if (decisions.newLine === 'Wealth Management') businessLineIncome = 0.5;
  if (decisions.newLine === 'Investment Banking') businessLineIncome = 0.75;
  if (decisions.newLine === 'Merchant Banking') businessLineIncome = 0.6;

  const interestIncome = (loans * (interestRate / 100)) / 4;
  const interestExpense = (deposits * ((interestRate - 1) / 100)) / 4;
  const feeIncome = riaFeeIncome + businessLineIncome;
  const revenue = interestIncome - interestExpense + feeIncome;

  const expenses = (operatingCostRatio / 100) * revenue;
  const provisions = (provisionRatio / 100) * loans;

  const netIncome = revenue - expenses - provisions;
  capital += netIncome;
  tier1 = (capital / riskWeight(loans)) * 100;
  const roe = (netIncome / capital) * 100;

  const feedback = generateFeedback(netIncome, roe, tier1);
  const scenarioNotes = scenario.shock || '';

  return {
    year: 2025 + Math.floor((state.currentQuarter + 1) / 4),
    capital: round(capital),
    loans: round(loans),
    deposits: round(deposits),
    interestRate: round(interestRate),
    operatingCostRatio,
    provisionRatio,
    riaFeeIncome: round(riaFeeIncome + businessLineIncome),
    tier1: round(tier1),
    roe: round(roe),
    netIncome: round(netIncome),
    revenue: round(revenue),
    expenses: round(expenses),
    provisions: round(provisions),
    boardFeedback: feedback,
    scenarioNotes,
  };
}

function riskWeight(loans) {
  return loans * 0.65;
}

function round(x) {
  return Math.round(x * 10) / 10;
}

function generateFeedback(income, roe, tier1) {
  if (roe > 12 && tier1 > 10) {
    return "Exceptional quarter — profitability is strong and capital ratios are healthy.";
  }
  if (roe < 5) {
    return "Profitability is concerningly low. The board is watching closely.";
  }
  if (tier1 < 8) {
    return "Capital ratios are dangerously low. Regulatory pressure may follow.";
  }
  return "Performance was solid. Consider balancing growth and risk management.";
}
