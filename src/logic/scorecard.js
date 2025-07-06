export function generateScorecard(financials) {
  const latest = financials[financials.length - 1];
  const avgROE =
    financials.reduce((sum, row) => sum + row.roe, 0) / financials.length;
  const avgTier1 =
    financials.reduce((sum, row) => sum + row.tier1, 0) / financials.length;
  const cumulativeNetIncome = financials.reduce(
    (sum, row) => sum + row.netIncome,
    0
  );

  let health = 'Stable';
  if (avgTier1 < 8 || avgROE < 5) health = 'Weak';
  if (avgTier1 > 12 && avgROE > 10) health = 'Strong';

  return {
    averageROE: round(avgROE),
    averageTier1: round(avgTier1),
    cumulativeNetIncome: round(cumulativeNetIncome),
    overallHealth: health,
  };
}

function round(val) {
  return Math.round(val * 10) / 10;
}
