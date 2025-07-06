// logic/financialEngine.js

export function applyQuarterUpdate(state, decisions, scenario) {
  const prev = state.history[state.history.length - 1];

  const baseRate = prev.interestRate + decisions.rateChange;
  const loanGrowth = decisions.expansion === 'yes' ? 1.03 : 1.00;
  const riskFactor = decisions.riskTolerance === 'loosen' ? 1.05 : decisions.riskTolerance === 'tighten' ? 0.95 : 1.00;
  const loanProvisionRatio = decisions.provisionRatio ?? prev.provisionRatio;
  const opCostRatio = decisions.operatingCostRatio ?? prev.operatingCostRatio;

  const loans = prev.loans * loanGrowth * riskFactor;
  const deposits = prev.deposits * (1 + (Math.random() * 0.02 - 0.01));

  const interestIncome = loans * (baseRate / 100);
  const interestExpense = deposits * (scenario.macroRate / 100);
  const netInterestIncome = interestIncome - interestExpense;

  const feeIncome = prev.riaFeeIncome + (decisions.newLine ? 0.5 : 0);
  const revenue = netInterestIncome + feeIncome;

  const expenses = revenue * (opCostRatio / 100);
  const provisions = revenue * (loanProvisionRatio / 100);
  const netIncome = revenue - expenses - provisions;

  const newCapital = prev.capital + netIncome;
  const tier1 = (newCapital / loans) * 10;
  const roe = ((netIncome / newCapital) * 100).toFixed(1);

  const feedback = generateFeedback(netIncome, roe, decisions, scenario);

  return {
    year: 2025 + Math.floor((state.currentQuarter + 1) / 4),
    capital: round(newCapital),
    loans: round(loans),
    deposits: round(deposits),
    interestRate: round(baseRate),
    operatingCostRatio: round(opCostRatio),
    provisionRatio: round(loanProvisionRatio),
    riaFeeIncome: round(feeIncome),
    revenue: round(revenue),
    expenses: round(expenses),
    provisions: round(provisions),
    netIncome: round(netIncome),
    tier1: round(tier1),
    roe: isFinite(roe) ? roe : 0,
    feedback,
  };
}

function generateFeedback(ni, roe, decisions, scenario) {
  const lines = [];

  if (ni > 3) {
    lines.push("Strong earnings this quarter — your strategy is paying off.");
  } else if (ni < 1) {
    lines.push("Earnings are under pressure; review your cost structure and risk.");
  }

  if (decisions.expansion === 'yes') {
    lines.push("Expansion increased loan growth, but monitor capital adequacy.");
  }

  if (scenario.shock === 'Bank Run') {
    lines.push("Deposits declined sharply due to loss of market confidence.");
  } else if (scenario.shock === 'Regulatory Action') {
    lines.push("New compliance rules may increase operating costs.");
  } else if (scenario.shock === 'M&A Opportunity') {
    lines.push("You may explore acquisition opportunities or partnerships.");
  }

  return lines.join(' ');
}

function round(n) {
  return Math.round(n * 10) / 10;
}
