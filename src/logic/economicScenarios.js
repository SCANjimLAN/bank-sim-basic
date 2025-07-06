const scenarios = [
  {
    quarterIndex: 0,
    quarter: 'Q1 2025',
    narrative: `The economy is stabilizing after a turbulent 2024. GDP growth is modest at 1.2%, inflation is cooling, and the Fed is holding rates steady. Regulatory pressure is moderate.`,
    loanDemandMultiplier: 1.05,
    depositFlowModifier: 1.01,
    provisionPressure: 1.0,
    rateSensitivity: 1.0,
    expensePressure: 1.0,
  },
  {
    quarterIndex: 1,
    quarter: 'Q2 2025',
    narrative: `Unexpected inflation data spooks markets. Bond yields jump, depositors begin chasing yield, and lending slows. Regulators begin warning banks about liquidity.`,
    loanDemandMultiplier: 0.96,
    depositFlowModifier: 0.97,
    provisionPressure: 1.2,
    rateSensitivity: 1.1,
    expensePressure: 1.05,
  },
  {
    quarterIndex: 2,
    quarter: 'Q3 2025',
    narrative: `Economic optimism rebounds after strong tech earnings and a dovish Fed statement. Lending activity picks up, and deposit flows stabilize.`,
    loanDemandMultiplier: 1.08,
    depositFlowModifier: 1.02,
    provisionPressure: 0.95,
    rateSensitivity: 0.95,
    expensePressure: 0.98,
  },
  {
    quarterIndex: 3,
    quarter: 'Q4 2025',
    narrative: `A surprise geopolitical event causes a spike in oil prices. The yield curve inverts again. Regulators emphasize stress testing.`,
    loanDemandMultiplier: 0.92,
    depositFlowModifier: 1.05,
    provisionPressure: 1.3,
    rateSensitivity: 1.2,
    expensePressure: 1.1,
  },
  // More quarters to be filled in later — this starts us off.
];

export function generateScenario(quarterIndex) {
  const base = scenarios.find(s => s.quarterIndex === quarterIndex);
  if (base) return base;

  // Default/fallback
  const year = 2025 + Math.floor(quarterIndex / 4);
  const quarter = `Q${(quarterIndex % 4) + 1} ${year}`;
  return {
    quarter,
    narrative: `${quarter}: A typical quarter with no major shocks.`,
    loanDemandMultiplier: 1.0,
    depositFlowModifier: 1.0,
    provisionPressure: 1.0,
    rateSensitivity: 1.0,
    expensePressure: 1.0,
  };
}
