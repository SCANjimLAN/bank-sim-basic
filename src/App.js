import React, { useState } from 'react';
import { generateScenario } from './logic/economicScenarios';
import { applyQuarterUpdate } from './logic/financialEngine';
import { getScorecard } from './logic/scorecard';
import { getCompetitors } from './logic/competitors';
import { generateFeedback } from './logic/boardroomFeedback';
import Dashboard from './components/Dashboard';

export default function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(0);
  const [decisions, setDecisions] = useState({
    rateChange: 0,
    expansion: 'no',
    riskTolerance: 'maintain',
    newLine: '',
    operatingCosts: 60,
  });
  const [financials, setFinancials] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [scorecard, setScorecard] = useState({});
  const [competitors, setCompetitors] = useState(getCompetitors());

  const handleLogin = () => {
    if (!username) return;
    const initial = {
      year: 2025,
      capital: 32,
      loans: 100,
      deposits: 120,
      interestRate: 4.0,
      operatingCostRatio: 60,
      provisionRatio: 1,
      riaFeeIncome: 1.5,
      tier1: 14.5,
      roe: 7.7,
      netIncome: 2.5,
      aum: 100,
      ibRevenue: 0,
      mbAssets: 0,
    };
    const firstScenario = generateScenario(0);
    setFinancials([initial]);
    setScenario(firstScenario);
    setIsLoggedIn(true);
    setScorecard(getScorecard([initial]));
  };

  const advanceQuarter = () => {
    const nextIndex = currentQuarter + 1;
    const nextScenario = generateScenario(nextIndex);

    const result = applyQuarterUpdate(
      { currentQuarter, history: financials },
      decisions,
      nextScenario
    );

    const newHistory = [...financials, result];
    setFinancials(newHistory);
    setScenario(nextScenario);
    setFeedback(generateFeedback(result, decisions));
    setCurrentQuarter(nextIndex);
    setScorecard(getScorecard(newHistory));
    setCompetitors(getCompetitors(nextIndex));
  };

  const handleDecisionChange = (field, value) => {
    setDecisions((prev) => ({ ...prev, [field]: value }));
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6 max-w-xl mx-auto">
        <div className="border p-4 rounded shadow space-y-4">
          <h2 className="text-xl font-bold">Bank Simulation Login</h2>
          <input
            className="border p-2 w-full"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleLogin}
          >
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  const latest = financials[financials.length - 1];
  const previous = financials.length > 1 ? financials[financials.length - 2] : null;

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* Quarter Narrative */}
      <div className="border p-4 rounded shadow space-y-2">
        <h2 className="text-2xl font-semibold">{scenario?.quarter}</h2>
        <p className="text-sm">{scenario?.narrative}</p>
      </div>

      {/* Dashboard */}
      <Dashboard data={latest} />

      {/* Strategic Decisions */}
      <div className="border p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-bold">Strategic Decisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block">Base Rate Change (±%)</label>
            <input
              className="border p-2 w-full"
              type="number"
              step="0.25"
              value={decisions.rateChange}
              onChange={(e) => handleDecisionChange('rateChange', parseFloat(e.target.value))}
            />
          </div>
          <div>
            <label className="block">Expansion</label>
            <select
              className="border p-2 w-full"
              value={decisions.expansion}
              onChange={(e) => handleDecisionChange('expansion', e.target.value)}
            >
              <option value="no">None</option>
              <option value="yes">Expand Branches</option>
            </select>
          </div>
          <div>
            <label className="block">Risk Appetite</label>
            <select
              className="border p-2 w-full"
              value={decisions.riskTolerance}
              onChange={(e) => handleDecisionChange('riskTolerance', e.target.value)}
            >
              <option value="maintain">Maintain</option>
              <option value="tighten">Tighten</option>
              <option value="loosen">Loosen</option>
            </select>
          </div>
          <div>
            <label className="block">New Business Line</label>
            <select
              className="border p-2 w-full"
              value={decisions.newLine}
              onChange={(e) => handleDecisionChange('newLine', e.target.value)}
            >
              <option value="">None</option>
              <option value="Wealth Management">Wealth Management</option>
              <option value="Investment Banking">Investment Banking</option>
              <option value="Merchant Banking">Merchant Banking</option>
            </select>
          </div>
          <div>
            <label className="block">Target Operating Cost Ratio (%)</label>
            <input
              className="border p-2 w-full"
              type="number"
              value={decisions.operatingCosts}
              onChange={(e) => handleDecisionChange('operatingCosts', parseFloat(e.target.value))}
            />
          </div>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded mt-4"
          onClick={advanceQuarter}
        >
          Advance to Next Quarter
        </button>
      </div>

      {/* Scorecard */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Performance Scorecard</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
          <li>Avg ROE: {scorecard.avgROE?.toFixed(2)}%</li>
          <li>Tier 1 Cap: {latest.tier1}%</li>
          <li>AUM: ${latest.aum}M</li>
          <li>IB Revenue: ${latest.ibRevenue}M</li>
          <li>MB Assets: ${latest.mbAssets}M</li>
        </ul>
      </div>

      {/* Boardroom Feedback */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Boardroom Feedback</h3>
        <p className="text-sm">{feedback}</p>
      </div>

      {/* Competitor Benchmarking */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Peer Bank Benchmarking</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="text-left">Bank</th>
              <th>ROE</th>
              <th>Tier 1</th>
              <th>Net Income</th>
              <th>AUM</th>
            </tr>
          </thead>
          <tbody>
            {competitors.map((bank, idx) => (
              <tr key={idx}>
                <td>{bank.name}</td>
                <td>{bank.roe}%</td>
                <td>{bank.tier1}%</td>
                <td>${bank.netIncome}M</td>
                <td>${bank.aum}M</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
