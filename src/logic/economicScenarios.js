// logic/economicScenarios.js

export function generateScenario(index) {
  const quarter = `Q${(index % 4) + 1} ${2025 + Math.floor(index / 4)}`;

  const baseNarratives = [
    "The Fed holds rates steady amid soft-landing hopes.",
    "Volatility rises on global trade tensions.",
    "Strong job growth fuels moderate inflation.",
    "Consumer confidence declines as credit tightens.",
    "Markets stabilize following energy price shocks.",
    "Liquidity improves with easing Fed policy.",
    "Regional banks face pressure on deposits.",
    "Technology sector rallies, boosting equities.",
    "Commercial real estate worries resurface.",
    "Inflation fears mount with rising wages.",
  ];

  const shocks = [
    null,
    {
      label: "Interest Rate Spike",
      shockImpact: "Unexpected rate hike by the Fed impacts borrowing demand.",
      interestDrift: 1.0,
    },
    {
      label: "Deposit Flight",
      shockImpact: "Depositors move to money markets, straining funding.",
      interestDrift: -0.5,
    },
    {
      label: "Regulatory Crackdown",
      shockImpact: "Increased compliance costs affect profitability.",
      interestDrift: 0.1,
    },
    null,
    null,
  ];

  const shockEvent = shocks[Math.floor(Math.random() * shocks.length)];

  return {
    quarter,
    narrative: baseNarratives[index % baseNarratives.length],
    interestDrift: shockEvent?.interestDrift || (Math.random() - 0.5) * 0.4, // ±0.2 typical drift
    shock: !!shockEvent,
    shockImpact: shockEvent?.shockImpact || '',
  };
}
