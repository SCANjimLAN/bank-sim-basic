export function applyQuarterUpdate({ currentQuarter, history }, decisions, scenario) {
  const prev = history[history.length - 1];

  // Apply rate change
  const newRate = Math.max(0, prev.interestRate + decisions.rateChange);

  // Adjust cost ratio
  const costRatioAdjustment = Math.max(-20, Math.min(20, decisions.costAdjustment || 0));
  const newOperatingCostRatio = Math.max(30, prev.operatingCostRatio + costRatioAdjustment);

  // Economic multipliers from scenario
  const growthFactor = scenario.gdpGrowth > 2 ? 1.05 : scenario.gdpGrowth < 0 ? 0.95 : 1;
  const loanGrowth = decisions.expansion === 'yes' ? 1.05 * growthFactor : 1.02 * growthFactor;
  const depositGrowth = 1.01 * growthFactor;
  const provisionRatio = decisions.riskTolerance === 'loosen' ? 1.5 : decisions.riskTolerance === 'tighten' ? 0.8 : 1;

  // Business line effect
  const newFeeIncome = decisions.newLine
    ? prev.riaFeeIncome + 0.5
    : prev.riaFeeIncome;

  const newLoans = parseFloat((prev.loans * loanGrowth).toFixed(1));
  const newDeposits = parseFloat((prev.deposits * depositGrowth).toFixed(1));

  const revenue = parseFloat(
    ((newLoans * (newRate / 100)) + newFeeIncome).toFixed(2)
  );

  const expenses = parseFloat(
    ((newOperatingCostRatio / 100) * revenue + (provisionRatio / 100) * newLoans).toFixed(2)
  );

  const netIncome = parseFloat((revenue - expenses).toFixed(2));
  const capital = parseFloat((prev.capital + netIncome * 0.8).toFixed(1));
  const tier1 = parseFloat(((capital / newLoans) * 100).toFixed(1));
  const roe = parseFloat(((netIncome / capital) * 100).toFixed(1));

  const assets = parseFloat((newLoans + capital).toFixed(1));
  const liabilities = parseFloat((assets - capital).toFixed(1));

  // Narrative feedback generator
  const feedback = generateNarrativeFeedback(decisions, netIncome, scenario);
  const boardroom = generateBoardroomFeedback(netIncome, prev.netIncome);
  const competitors = generateCompetitorBenchmarks(roe);

  return {
    year: 2025 + Math.floor((currentQuarter + 1) / 4),
    capital,
    loans: newLoans,
    deposits: newDeposits,
    interestRate: newRate,
    operatingCostRatio: newOperatingCostRatio,
    provisionRatio,
    riaFeeIncome: newFeeIncome,
    tier1,
    roe,
    netIncome,
    revenue,
    expenses,
    assets,
    liabilities,
    feedback,
    boardroom,
    competitors
  };
}

function generateNarrativeFeedback(decisions, income, scenario) {
  let text = '';

  if (income > 3) {
    text += `Your strategies are producing strong profits. `;
  } else if (income < 1) {
    text += `Earnings were weaker this quarter. Re-evaluate your decisions. `;
  }

  if (decisions.newLine) {
    text += `The new ${decisions.newLine} business line is being integrated. `;
  }

  if (scenario.shock) {
    text += `An external shock occurred: ${scenario.shock}. `;
  }

  return text.trim();
}

function generateBoardroomFeedback(current, previous) {
  if (!previous) return 'The board is watching your first moves carefully.';

  const delta = current - previous;

  if (delta > 0.5) return 'The board is pleased with growing profits.';
  if (delta < -0.5) return 'The board expresses concern over declining returns.';
  return 'The board sees steady results.';
}

function generateCompetitorBenchmarks(playerROE) {
  return [
    { name: 'MetroBank', roe: parseFloat((playerROE + (Math.random() * 2 - 1)).toFixed(1)) },
    { name: 'Founders Capital', roe: parseFloat((playerROE + (Math.random() * 2 - 1)).toFixed(1)) }
  ];
}
