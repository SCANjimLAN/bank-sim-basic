const baseScenarios = [
  {
    quarter: 'Q1 2025',
    gdpGrowth: 2.1,
    inflation: 3.0,
    unemployment: 4.2,
    shock: null,
    narrative: 'The economy begins the year with steady growth and controlled inflation. Consumer confidence is high.'
  },
  {
    quarter: 'Q2 2025',
    gdpGrowth: 2.8,
    inflation: 3.5,
    unemployment: 4.0,
    shock: 'Inverted Yield Curve',
    narrative: 'Yield curve inversion causes investor caution. Long-term rates dip unexpectedly.'
  },
  {
    quarter: 'Q3 2025',
    gdpGrowth: 1.5,
    inflation: 4.1,
    unemployment: 4.5,
    shock: null,
    narrative: 'Growth moderates as inflation ticks up. Some volatility in capital markets.'
  },
  {
    quarter: 'Q4 2025',
    gdpGrowth: -0.8,
    inflation: 2.9,
    unemployment: 5.2,
    shock: 'Geopolitical Crisis',
    narrative: 'A geopolitical event rattles markets and consumer sentiment. Lending slows.'
  },
  {
    quarter: 'Q1 2026',
    gdpGrowth: 0.2,
    inflation: 2.0,
    unemployment: 5.5,
    shock: null,
    narrative: 'The economy teeters near recession. Central bank signals dovish stance.'
  },
  {
    quarter: 'Q2 2026',
    gdpGrowth: 3.0,
    inflation: 1.9,
    unemployment: 5.0,
    shock: 'Regulatory Overhaul',
    narrative: 'New banking regulations increase capital requirements. Margins tighten temporarily.'
  },
  {
    quarter: 'Q3 2026',
    gdpGrowth: 3.5,
    inflation: 2.5,
    unemployment: 4.4,
    shock: null,
    narrative: 'The economy rebounds sharply. Loan demand rises and credit quality improves.'
  },
  {
    quarter: 'Q4 2026',
    gdpGrowth: 4.0,
    inflation: 2.7,
    unemployment: 4.1,
    shock: 'Tech Bubble Correction',
    narrative: 'A sharp correction in tech stocks causes temporary panic in markets.'
  },
  {
    quarter: 'Q1 2027',
    gdpGrowth: 2.3,
    inflation: 3.0,
    unemployment: 4.3,
    shock: null,
    narrative: 'Stabilization continues. Corporate borrowing remains strong.'
  },
  {
    quarter: 'Q2 2027',
    gdpGrowth: -1.0,
    inflation: 2.2,
    unemployment: 5.6,
    shock: 'Regional Bank Run',
    narrative: 'A sudden bank run hits a peer bank, triggering liquidity stress industry-wide.'
  },
  // Add more if desired
];

export function generateScenario(index) {
  return baseScenarios[index % baseScenarios.length];
}
