// logic/financialEngine.js

export function applyQuarterUpdate(state, decisions, scenario) {
  const prev = state.history[state.history.length - 1];

  // Adjust interest rate based on user decision and scenario drift
  const interestRate = Math.max(0.1, prev.interestRate + decisions.rateChange + scenario.interestDrift);

  // Loan growth factor
  let loanGrowth = 0.01;
  if (decisions.expansion === 'yes') loanGrowth += 0.02;
  if (decisions.riskTolerance === 'loosen') loanGrowth += 0.015;
  if (decisions.riskTolerance === 'tighten') loanGrowth -= 0.01;

  const newLoans = prev.loans * (1 + loanGrowth);
  const newDeposits = prev.deposits * (1 + 0.005); // modest deposit growth
  const operatingCostRatio = prev.operatingCostRatio + (decisions.expansion === 'yes' ? 1 : 0); // costs rise with expansion

  // Fee income effect from new line
  let riaFeeIncome = prev.riaFeeIncome;
  if (decisions.newLine === 'Wealth Management') riaFeeIncome += 0.2;
  if (decisions.newLine === 'Investment Banking') riaFeeIncome += 0.3;
  if (decisions.newLine === 'Merchant Banking') riaFeeIncome += 0.25;

  // Income estimate
  const interestIncome = newLoans * (interestRate / 100) / 4; // quarterly
  const interestExpense = newDeposits * ((interestRate - 1) / 100) / 4;
  const netInterestIncome = interestIncome - interestExpense;
  const netIncome = parseFloat((netInterestIncome + riaFeeIncome - (operatingCostRatio / 100) * newLoans / 4).toFixed(2));

  const capital = parseFloat((prev.capital + netIncome * 0.8).toFixed(2)); // assume 20% dividend payout
  const tier1 = parseFloat(((capital / newLoans) * 100).toFixed(2));
  const roe = parseFloat(((netIncome / capital) * 100).toFixed(1)); // assume net income is quarterly annualized

  // Generate feedback
  let feedback = '';
  if (roe > 10) {
    feedback = 'Strong performance this quarter, driven by effective strategy and margin expansion.';
  } else if (roe < 5) {
    feedback = 'Returns are under pressure. Consider cost controls or strategic repositioning.';
  } else {
    feedback = 'Steady quarter. Results were solid but not exceptional.';
  }

  if (scenario.shock) {
    feedback += ` ${scenario.shockImpact}`;
  }

  return {
    year: 2025 + Math.floor((state.currentQuarter + 1) / 4),
    capital,
    loans: parseFloat(newLoans.toFixed(1)),
    deposits: parseFloat(newDeposits.toFixed(1)),
    interestRate: parseFloat(interestRate.toFixed(2)),
    operatingCostRatio,
    provisionRatio: prev.provisionRatio,
    riaFeeIncome: parseFloat(riaFeeIncome.toFixed(2)),
    tier1,
    roe,
    netIncome,
    feedback,
  };
}
