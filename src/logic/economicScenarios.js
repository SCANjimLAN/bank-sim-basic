// src/logic/economicScenarios.js

export function generateScenario(quarter) {
  const year = 2025 + Math.floor(quarter / 4);
  const q = (quarter % 4) + 1;

  const scenarios = [
    {
      gdpGrowth: 2.0,
      inflation: 3.0,
      interestRate: 4.0,
      riskEnvironment: 'stable',
      narrative: `Q${q} ${year}: The economy is growing steadily. Inflation is under control and consumer confidence remains strong.`,
    },
    {
      gdpGrowth: -1.0,
      inflation: 4.2,
      interestRate: 5.5,
      riskEnvironment: 'elevated',
      narrative: `Q${q} ${year}: The economy has contracted slightly. Inflation remains stubborn and central banks are holding rates high.`,
    },
    {
      gdpGrowth: 3.5,
      inflation: 2.1,
      interestRate: 3.25,
      riskEnvironment: 'improving',
      narrative: `Q${q} ${year}: A surprise boost in productivity and consumer spending is accelerating the recovery.`,
    },
    {
      gdpGrowth: 0.5,
      inflation: 5.8,
      interestRate: 6.0,
      riskEnvironment: 'uncertain',
      narrative: `Q${q} ${year}: Inflation is climbing again, creating policy uncertainty. Growth is sluggish.`,
    },
    {
      gdpGrowth: -2.0,
      inflation: 1.8,
      interestRate: 2.75,
      riskEnvironment: 'recessionary',
      narrative: `Q${q} ${year}: A mild recession is underway. Rates are falling, but loan demand is weakening.`,
    },
  ];

  const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
  return {
    ...chosen,
    year,
    quarter: `Q${q} ${year}`,
  };
}
