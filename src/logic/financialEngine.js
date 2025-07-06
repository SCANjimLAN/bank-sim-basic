export function applyQuarterUpdate({ currentQuarter, history }, decisions, scenario) {
  const last = history[history.length - 1];

  const baseGrowth = scenario.gdpGrowth / 100;
  const rateAdj = decisions.rateChange * 0.1;
  const loanGrowth = baseGrowth + (decisions.expansion === 'yes' ? 0.01 : 0);
  const provisionAdj =
    decisions.riskTolerance === 'loosen' ? 0.5 : decisions.riskTolerance === 'tighten' ? 1.5 : 1;
  const newOperatingCostRatio = decisions.operatingCosts;

  // Business line updates
  let wmGrowth = 0;
  let ibRevenue = last.ibRevenue;
  let mbAssets = last.mbAssets;
  let riaFeeIncome = last.riaFeeIncome;

  if (decisions.newLine === 'Wealth Management') {
    wmGrowth = 0.05;
    riaFeeIncome *= 1.1;
  } else if (decisions.newLine === 'Investment Banking') {
    ibRevenue += 0.5 + Math.random() * 0.5;
  } else if (decisions.newLine === 'Merchant Banking') {
    mbAssets += 2;
  }

  const newLoans = last.loans * (1 + loanGrowth);
  const newDeposits = last.deposits * (1 + baseGrowth * 0.75);
  const netInterestMargin = (last.interestRate + rateAdj - scenario.inflation / 100) * 0.9;
  const interestIncome = newLoans * netInterestMargin * 0.01;

  const provisions = (newLoans * 0.01 * provisionAdj);
  const operatingCosts = (newDeposits + newLoans) * (newOperatingCostRatio / 100) * 0.01;

  const totalIncome =
    interestIncome + riaFeeIncome + ibRevenue + mbAssets * 0.01;

  const netIncome = totalIncome - operatingCosts - provisions;
  const newCapital = last.capital + netIncome;

  const newROE = newCapital > 0 ? (netIncome / newCapital) * 100 : 0;
  const tier1Ratio = (newCapital / (newLoans + mbAssets)) * 100;

  return {
    year: 2025 + Math.floor((currentQuarter + 1) / 4),
    capital: round(newCapital),
    loans: round(newLoans),
    deposits: round(newDeposits),
    interestRate: round(last.interestRate + decisions.rateChange),
    operatingCostRatio: round(newOperatingCostRatio),
    provisionRatio: round(provisionAdj),
    riaFeeIncome: round(riaFeeIncome),
    tier1: round(tier1Ratio),
    roe: round(newROE),
    netIncome: round(netIncome),
    aum: round(last.aum * (1 + wmGrowth)),
    ibRevenue: round(ibRevenue),
    mbAssets: round(mbAssets),
  };
}

function round(val) {
  return Math.round(val * 10) / 10;
}
