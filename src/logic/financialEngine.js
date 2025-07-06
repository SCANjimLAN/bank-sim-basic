export function applyQuarterUpdate(state, decisions, scenario) {
  const last = state.history ? state.history[state.history.length - 1] : null;

  // Start from either last quarter's numbers or starting baseline
  const capital = last ? last.capital : 32;
  let loans = last ? last.loans : 100;
  let deposits = last ? last.deposits : 120;
  let interestRate = last ? last.interestRate : 4.0;
  let operatingCostRatio = last ? last.operatingCostRatio : 60;
  let provisionRatio = last ? last.provisionRatio : 1;
  let riaFeeIncome = last ? last.riaFeeIncome : 1.5;

  // Adjust interest rate
  interestRate += decisions.rateChange || 0;

  // Loan/deposit growth logic
  let loanGrowth = 0.01;
  let depositGrowth = 0.01;

  if (decisions.expansion === 'yes') {
    loanGrowth += 0.02;
    depositGrowth += 0.01;
    operatingCostRatio += 2;
  }

  if (decisions.riskTolerance === 'loosen') {
    loanGrowth += 0.015;
    provisionRatio += 0.5;
  } else if (decisions.riskTolerance === 'tighten') {
    loanGrowth -= 0.01;
    provisionRatio -= 0.25;
  }

  // New business line impact
  if (decisions.newLine === 'Investment Banking') {
    riaFeeIncome += 0.5;
    operatingCostRatio += 1.5;
  } else if (decisions.newLine === 'Merchant Banking') {
    riaFeeIncome += 0.4;
    provisionRatio += 0.3;
    operatingCostRatio += 1.0;
  } else if (decisions.newLine === 'Wealth Management') {
    riaFeeIncome += 0.3;
    operatingCostRatio += 0.8;
  }

  // Apply loan and deposit growth
  loans *= 1 + loanGrowth;
  deposits *= 1 + depositGrowth;

  // Net interest income: simple approximation
  const interestIncome = loans * (interestRate / 100);
  const interestExpense = deposits * ((interestRate - 1.25) / 100);
  const netInterestIncome = interestIncome - interestExpense;

  // Net income calculation
  const provisionExpense = (provisionRatio / 100) * loans;
  const operatingExpense = (operatingCostRatio / 100) * (loans + deposits) / 2;
  const netIncome = netInterestIncome + riaFeeIncome - provisionExpense - operatingExpense;

  // Capital and metrics
  const newCapital = capital + netIncome;
  const tier1 = parseFloat(((newCapital / riskWeightedAssets(loans)) * 100).toFixed(2));
  const roe = parseFloat(((netIncome / newCapital) * 100).toFixed(1));

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
  };
}

// Simple placeholder for RWA based on loan book size
function riskWeightedAssets(loans) {
  return loans * 0.65; // Approximation
}
