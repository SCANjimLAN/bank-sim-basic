// src/logic/financialEngine.js

export function applyQuarterUpdate(state, decisions, scenario) {
  const prev = state.financials;

  // --- Base financials ---
  let capital = prev.capital;
  let loans = prev.loans;
  let deposits = prev.deposits;
  let interestRate = parseFloat(prev.interestRate);
  let riaFeeIncome = prev.riaFeeIncome;
  let operatingCostRatio = prev.operatingCostRatio;
  let provisionRatio = prev.provisionRatio;

  // --- Adjust interest rate if changed ---
  const rateDelta = parseFloat(decisions.rateChange || 0);
  interestRate = Math.max(0, interestRate + rateDelta);

  // --- Apply business line expansion ---
  if (decisions.newLine && decisions.newLine !== 'None') {
    riaFeeIncome += 0.2; // modest boost for fee income
    operatingCostRatio += 1.5; // cost to stand up new line
  }

  // --- Expansion effects ---
  if (decisions.expansion === 'yes') {
    loans *= 1.025;
    deposits *= 1.015;
    operatingCostRatio += 0.5;
  }

  // --- Risk tolerance adjustments ---
  if (decisions.riskTolerance === 'loosen') {
    loans *= 1.03;
    provisionRatio += 0.3;
  } else if (decisions.riskTolerance === 'tighten') {
    loans *= 0.985;
    provisionRatio -= 0.3;
  }

  // --- Economic conditions ---
  const macroMultiplier = 1 + scenario.gdpGrowth / 100;
  loans *= macroMultiplier;
  deposits *= macroMultiplier;

  // --- Simplified income calculation ---
  const interestIncome = loans * (interestRate / 100) * 0.25;
  const interestExpense = deposits * ((interestRate - 1) / 100) * 0.25;
  const netInterestIncome = interestIncome - interestExpense;

  const fees = riaFeeIncome;
  const provisions = (provisionRatio / 100) * loans;
  const operatingCosts = (operatingCostRatio / 100) * (loans + deposits) * 0.01;
  const netIncome = parseFloat((netInterestIncome + fees - provisions - operatingCosts).toFixed(2));

  // --- Capital grows with net income (retained) ---
  capital += netIncome * 0.25;

  // --- Ratios ---
  const tier1 = parseFloat(((capital / riskWeightedAssets(loans)) * 100).toFixed(2));
  const roe = parseFloat(((netIncome / capital) * 100).toFixed(1));

  return {
    year: 2025 + Math.floor((state.currentQuarter + 1) / 4),
    capital: parseFloat(capital.toFixed(2)),
    loans: parseFloat(loans.toFixed(2)),
    deposits: parseFloat(deposits.toFixed(2)),
    interestRate: parseFloat(interestRate.toFixed(2)),
    operatingCostRatio: parseFloat(operatingCostRatio.toFixed(1)),
    provisionRatio: parseFloat(provisionRatio.toFixed(1)),
    riaFeeIncome: parseFloat(riaFeeIncome.toFixed(2)),
    tier1,
    roe,
    netIncome,
  };
}

function riskWeightedAssets(loans) {
  return loans * 0.85; // Simplified RWA factor
}
