// financialEngine.js
export function applyQuarterUpdate(context, decisions, scenario) {
  const prev = context.history[context.history.length - 1];
  const quarterIndex = context.currentQuarter + 1;

  // Apply decision impacts
  const rateAdj = decisions.rateChange || 0;
  const riskMultiplier = decisions.riskTolerance === 'loosen' ? 1.1 :
                         decisions.riskTolerance === 'tighten' ? 0.9 : 1.0;
  const expansionCost = decisions.expansion === 'yes' ? 1.0 : 0.0;
  const newLineRevenue = decisions.newLine ? 0.5 : 0.0;

  const loanGrowth = (scenario.loanDemandMultiplier + rateAdj * scenario.rateSensitivity) * riskMultiplier;
  const depositGrowth = scenario.depositFlowModifier + (rateAdj * 0.3);
  const provisionAdjustment = scenario.provisionPressure * riskMultiplier;
  const costInflation = scenario.expensePressure + (expansionCost * 0.5);

  const newLoans = prev.loans * (1 + loanGrowth / 100);
  const newDeposits = prev.deposits * (1 + depositGrowth / 100);
  const newProvisionRatio = prev.provisionRatio + provisionAdjustment;
  const newOperatingCostRatio = prev.operatingCostRatio + costInflation;
  const newInterestRate = Math.max(prev.interestRate + rateAdj, 0);
  const newCapital = prev.capital + prev.netIncome - (expansionCost * 1.0);
  const newIncome = ((newLoans * newInterestRate / 100) - (newDeposits * (newInterestRate * 0.6) / 100)) * 0.25
                    - (newOperatingCostRatio / 100 * newCapital)
                    - (newProvisionRatio / 100 * newLoans / 4)
                    + newLineRevenue;
  const newTier1 = ((newCapital / newLoans) * 100).toFixed(2);
  const newROE = ((newIncome / newCapital) * 100).toFixed(1);

  // Construct feedback narrative
  let feedback = `You maintained ${decisions.riskTolerance} risk levels`;
  if (decisions.expansion === 'yes') {
    feedback += ` and pursued operational expansion, increasing your cost base.`;
  }
  if (decisions.newLine) {
    feedback += ` You launched a new business line: ${decisions.newLine}, contributing additional income.`;
  }
  feedback += ` Interest rates moved to ${newInterestRate}%, which affected both income and deposit flows.`;

  return {
    year: 2025 + Math.floor(quarterIndex / 4),
    capital: parseFloat(newCapital.toFixed(2)),
    loans: parseFloat(newLoans.toFixed(2)),
    deposits: parseFloat(newDeposits.toFixed(2)),
    interestRate: parseFloat(newInterestRate.toFixed(2)),
    operatingCostRatio: parseFloat(newOperatingCostRatio.toFixed(2)),
    provisionRatio: parseFloat(newProvisionRatio.toFixed(2)),
    riaFeeIncome: prev.riaFeeIncome + newLineRevenue,
    tier1: parseFloat(newTier1),
    roe: parseFloat(newROE),
    netIncome: parseFloat(newIncome.toFixed(2)),
    feedback,
  };
}
