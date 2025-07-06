import React from 'react';
import { generateScorecard } from '../logic/scorecard';
import { generateCompetitorBenchmarks } from '../logic/competitors';
import { generateBoardroomFeedback } from '../logic/boardroomFeedback';

export default function Dashboard({ financials }) {
  if (!financials || financials.length < 2) return null;

  const latest = financials[financials.length - 1];
  const previous = financials[financials.length - 2];
  const scorecard = generateScorecard(financials);
  const competitors = generateCompetitorBenchmarks(financials.length - 1);
  const boardFeedback = generateBoardroomFeedback(latest, previous);

  return (
    <div className="space-y-6 border p-4 mt-6 rounded shadow">
      <h3 className="text-xl font-bold">📊 Executive Dashboard</h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="border p-3 rounded shadow-sm">
          <h4 className="font-semibold mb-1">📈 Scorecard</h4>
          <ul className="text-sm space-y-1">
            <li>Avg. ROE: {scorecard.averageROE}%</li>
            <li>Avg. Tier 1: {scorecard.averageTier1}%</li>
            <li>Cumulative Net Income: ${scorecard.cumulativeNetIncome}M</li>
            <li>Overall Health: {scorecard.overallHealth}</li>
          </ul>
        </div>

        <div className="border p-3 rounded shadow-sm">
          <h4 className="font-semibold mb-1">📋 Peer Benchmarking</h4>
          <ul className="text-sm space-y-1">
            {competitors.map((bank, idx) => (
              <li key={idx}>
                {bank.name}: ROE {bank.roe}%, Tier 1 {bank.tier1}%
              </li>
            ))}
          </ul>
        </div>

        <div className="border p-3 rounded shadow-sm">
          <h4 className="font-semibold mb-1">🏛️ Boardroom Feedback</h4>
          <ul className="text-sm list-disc pl-5 space-y-1">
            {boardFeedback.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-2">🧾 Quarter-over-Quarter Comparison</h4>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th>Metric</th>
              <th>Previous</th>
              <th>Current</th>
              <th>Change</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['Net Income', 'netIncome'],
              ['ROE (%)', 'roe'],
              ['Tier 1 (%)', 'tier1'],
              ['Loans ($M)', 'loans'],
              ['Deposits ($M)', 'deposits'],
              ['Operating Cost %', 'operatingCostRatio'],
            ].map(([label, key]) => (
              <tr key={key} className="border-t">
                <td>{label}</td>
                <td>{formatValue(previous[key])}</td>
                <td>{formatValue(latest[key])}</td>
                <td>{formatChange(latest[key] - previous[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function formatValue(val) {
  return typeof val === 'number' ? val.toFixed(1) : val;
}

function formatChange(diff) {
  const sign = diff > 0 ? '+' : '';
  return `${sign}${diff.toFixed(1)}`;
}
