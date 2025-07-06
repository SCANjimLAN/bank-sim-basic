// src/logic/financialEngine.js

export function applyQuarterUpdate({ currentQuarter, history }, decisions, scenario) {
  const prev = history[history.length - 1];
  const year = 2025 + Math.floor((currentQuarter + 1) / 4);
  const q = (currentQuarter + 1) % 4 + 1;

  const {
    rateChange,
    expansion,
    riskTolerance,
    newLine,
    costAdjustment = 0,
  } = decisions;

  // Modify loan growth
  let loanGrowth = 2;
  if (riskTolerance === 'loosen') loanGrowth += 2;
  if (riskTolerance === 'tighten') loanGrowth -= 1;

  if (expansion === 'yes') loanGrowth += 1;

  const newLoans = prev.loans * (1 + loanGrowth / 100);
  const newDeposits = prev.deposits * (1 + 1.5 / 100);
  const newCapital = prev.capital + prev.netIncome;

  const updatedRate = prev.interestRate + rateChange;
  const netInterestMargin = updatedRate - 1.5; // assume 1.5% deposit cost baseline
  const interestIncome = newLoans * (netInterestMargin / 100) / 4;

  // Adjust costs
  const baseCost = prev.operatingCostRatio;
  const newCostRatio = Math.min(Math.max(baseCost + costAdjustment, 30), 80);
  const opExpenses = (newDeposits + newLoans) * (newCostRatio / 1000);

  // RIA income boost
  const newRIA = newLine ? prev.riaFeeIncome + 0.25 : prev.riaFeeIncome;

  // Provision based on economic stress
  const provRate = scenario.stress > 1 ? prev.provisionRatio + 0.2 : prev.provisionRatio;
  const provision = newLoans * (provRate / 1000);

  const netIncome = interestIncome + newRIA - opExpenses - provision;
  const roe = ((netIncome * 4) / newCapital) * 100;

  // Board feedback logic
  let boardroom = "Stable quarter.";
  if (roe > 12) boardroom = "Strong profitability applauded by the board.";
  else if (roe < 4) boardroom = "Board concerned about declining ROE.";
  if (scenario.event === 'bank run') boardroom = "Emergency board meeting convened: deposit flight detected.";
  if (scenario.event === 'regulator inquiry') boardroom = "Regulatory audit in progress. Tread cautiously.";

  return {
    quarter: `Q${q} ${year}`,
    year,
    capital: Math.round(newCapital * 100) / 100,
    loans: Math.round(newLoans * 100) / 100,
    deposits: Math.round(newDeposits * 100) / 100,
    interestRate: Math.round(updatedRate * 100) / 100,
    operatingCostRatio: Math.round(newCostRatio * 10) / 10,
    provisionRatio: Math.round(provRate * 10) / 10,
    riaFeeIncome: Math.round(newRIA * 100) / 100,
    netIncome: Math.round(netIncome * 100) / 100,
    roe: Math.round(roe * 10) / 10,
    tier1: 14 + Math.random() - 0.5,
    feedback: scenario.narrative,
    boardroom,
    competitors: [
      { name: "Elm Street Bank", roe: 6.2, netIncome: 1.8 },
      { name: "Charter Grove Financial", roe: 9.1, netIncome: 3.4 },
      { name: "First Oak Capital", roe: 5.4, netIncome: 2.1 },
    ],
  };
}
