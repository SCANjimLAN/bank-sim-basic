export function applyQuarterUpdate(state, decisions, scenario) {
  const last = state.history ? state.history[state.history.length - 1] : null;

  // Baseline values
  let capital = last ? last.capital : 32;
  let loans = last ? last.loans : 100;
  let deposits = last ? last.deposits : 120;
  let interestRate = last ? last.interestRate : 4.0;
  let operatingCostRatio = last ? last.operatingCostRatio : 60;
  let provisionRatio = last ? last.provisionRatio : 1;
  let riaFeeIncome = last ? last.riaFeeIncome : 1.5;

  // Apply user decisions
  if (decisions.rateChange) {
    interestRate += decisions.rateChange * scenario.rateSensitivity;
  }

  let loanGrowth = 0.01 * scenario.loanDemandMultiplier;
  let depositGrowth = 0.01 * scenario.depositFlowModifier;

  if (decisions.expansion === 'yes') {
    loanGrowth += 0.02;
    depositGrowth += 0.01;
    operatingCostRatio += 2 * scenario.expensePressure;
  }

  if (decisions.riskTolerance === 'loosen') {
    loanGrowth += 0.015;
    provisionRatio += 0.5 * scenario.provisionPressure;
  } else if (decisions.riskTolerance === 'tighten') {
    loanGrowth -= 0.01;
    provisionRatio -= 0.25;
  }

  if (decisions.newLine === 'Investment Banking') {
    riaFeeIncome += 0.5;
    operatingCostRatio += 1.5 * scenario.expensePressure;
  } else if (decisions.newLine === 'Merchant Banking') {
    riaFeeIncome += 0.4;
    provisionRatio += 0.3 * scenario.provisionPressure;
    operatingCostRatio += 1.0 * scenario.expensePressure;
  } else if (decisions.newLine === 'Wealth Management') {
    riaFeeIncome += 0.3;
    operatingCostRatio += 0.8 * scenario.expensePressure;
  }

  // Apply growth
  loans *= 1 + loanGrowth;
  deposits *= 1 + depositGrowth;

  // Interest income/expense
  const interestIncome = loans * (interestRate / 100);
  const interestExpense = deposits * ((interestRate - 1.25) / 100);
  const netInterestIncome = interestIncome - interestExpense;

  const provisionExpense = (provisionRatio / 100) * loans;
  const operatingExpense = (operatingCostRatio / 100) * (loans + deposits) / 2;
  const netIncome = netInterestIncome + riaFeeIncome - provisionExpense - operatingExpense;

  const newCapital = capital + netIncome;
  const tier1 = parseFloat(((newCapital / riskWeightedAssets(loans)) * 100).toFixed(2));
  const roe = parseFloat(((netIncome / newCapital) * 100).toFixed(1));

  // Build narrative feedback
  const feedback = generateFeedback(decisions, scenario, {
    netIncome,
    loanGrowth,
    depositGrowth,
    provisionRatio,
  });

  return {
    year: 2025 + Math.floor((state.currentQuarter + 1) / 4),
    capital: parseFloat(newCapital.toFixed(2)),
    loans: parseFloat(loans.toFixed(2)),
    deposits: parseFloat(deposits.toFixed(2)),
    interestRate: parseFloat(interestRate.toFixed(2)),
    operatingCostRatio: parseFloat(operatingCostRatio.toFixed(1)),
    provisionRatio: parseFloat(provisionRatio.toFixed(1)),
    riaFeeIncome: parseFloat(riaFeeIncome.toFixed(2)),
    tier1,
    roe,
    netIncome: parseFloat(netIncome.toFixed(2)),
    feedback,
  };
}

function riskWeightedAssets(loans) {
  return loans * 0.65;
}

function generateFeedback(decisions, scenario, outcome) {
  const { loanGrowth, netIncome, provisionRatio } = outcome;
  const lines = [];

  lines.push(`You entered the quarter with plans to ${decisions.expansion === 'yes' ? "expand operations" : "maintain a stable footprint"}.`);
  
  if (decisions.riskTolerance === 'loosen') {
    lines.push("Your loosened credit standards boosted loan growth, but also increased provisioning costs.");
  } else if (decisions.riskTolerance === 'tighten') {
    lines.push("By tightening risk tolerance, you lowered credit losses but sacrificed some growth.");
  }

  if (decisions.newLine) {
    lines.push(`You launched a new business line: ${decisions.newLine}. Early results show ${netIncome > 0 ? "positive income contribution" : "strain on expenses"}.`);
  }

  if (provisionRatio > 1.5) {
    lines.push("Provisioning costs are becoming elevated. Consider tightening credit or reducing exposure.");
  }

  lines.push(`You earned ${netIncome >= 0 ? `$${netIncome.toFixed(2)}M in profit` : `a loss of $${Math.abs(netIncome).toFixed(2)}M`} this quarter.`);

  return lines.join(' ');
}
