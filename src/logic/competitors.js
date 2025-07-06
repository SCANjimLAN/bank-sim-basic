export function generateCompetitorBenchmarks(quarterIndex) {
  const competitors = [
    {
      name: 'Summit Federal',
      roe: baseFluctuation(6, quarterIndex),
      tier1: baseFluctuation(11.5, quarterIndex),
    },
    {
      name: 'Coastal Bankcorp',
      roe: baseFluctuation(8.2, quarterIndex),
      tier1: baseFluctuation(10.8, quarterIndex),
    },
    {
      name: 'Ironclad Trust',
      roe: baseFluctuation(10.4, quarterIndex),
      tier1: baseFluctuation(12.7, quarterIndex),
    },
  ];

  return competitors;
}

function baseFluctuation(base, i) {
  const seasonal = Math.sin(i / 2) * 0.5;
  const noise = (Math.random() - 0.5) * 1.0;
  return round(base + seasonal + noise);
}

function round(val) {
  return Math.round(val * 10) / 10;
}
