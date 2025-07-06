import React, { useState } from 'react';
import { generateScenario } from './logic/economicScenarios';
import { applyQuarterUpdate } from './logic/financialEngine';

export default function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(0);
  const [decisions, setDecisions] = useState({
    rateChange: 0,
    expansion: 'no',
    riskTolerance: 'maintain',
    newLine: '',
    costAdjustment: 0,
  });
  const [financials, setFinancials] = useState([]);
  const [feedback, setFeedback] = useState('');
  const [scenario, setScenario] = useState(null);

  const handleLogin = () => {
    if (!username) return;
    const firstScenario = generateScenario(0);
    setScenario(firstScenario);
    setIsLoggedIn(true);

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
      revenue: 5.2,
      expenses: 2.7,
      assets: 132,
      liabilities: 100,
      boardroom: 'The board is optimistic about a strong start.',
      competitors: [
        { name: 'MetroBank', roe: 8.1 },
        { name: 'Founders Capital', roe: 6.5 }
      ],
      feedback: 'You begin the decade with a strong foundation and steady economic conditions.',
    };
    setFinancials([initial]);
  };

  const advanceQuarter = () => {
    const nextIndex = currentQuarter + 1;
    const nextScenario = generateScenario(nextIndex);
    const newData = applyQuarterUpdate(
      { currentQuarter, history: financials },
      decisions,
      nextScenario
    );

    setFinancials([...financials, newData]);
    setScenario(nextScenario);
    setFeedback(newData.feedback);
    setCurrentQuarter(nextIndex);
  };

  const handleDecisionChange = (field, value) => {
    setDecisions(prev => ({ ...prev, [field]: value }));
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
      {/* Economic Narrative */}
      <div className="border p-4 rounded shadow space-y-2">
        <h2 className="text-2xl font-semibold">{scenario?.quarter}</h2>
        <p className="text-sm">{scenario?.narrative}</p>
      </div>

      {/* Strategic Controls */}
      <div className="border p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-bold">Strategic Decisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label>Change Base Interest Rate (±2%)</label>
            <input
              className="border p-2 w-full"
              type="number"
              step="0.25"
              value={decisions.rateChange}
              onChange={(e) =>
                handleDecisionChange('rateChange', parseFloat(e.target.value))
              }
            />
          </div>
          <div>
            <label>Expansion Strategy</label>
            <select
              className="border p-2 w-full"
              value={decisions.expansion}
              onChange={(e) => handleDecisionChange('expansion', e.target.value)}
            >
              <option value="no">No Expansion</option>
              <option value="yes">Expand Operations</option>
            </select>
          </div>
          <div>
            <label>Risk Appetite</label>
            <select
              className="border p-2 w-full"
              value={decisions.riskTolerance}
              onChange={(e) => handleDecisionChange('riskTolerance', e.target.value)}
            >
              <option value="maintain">Maintain</option>
              <option value="loosen">Loosen</option>
              <option value="tighten">Tighten</option>
            </select>
          </div>
          <div>
            <label>New Business Line</label>
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
            <label>Cost Structure Adjustment (±10%)</label>
            <input
              className="border p-2 w-full"
              type="number"
              step="1"
              value={decisions.costAdjustment}
              onChange={(e) =>
                handleDecisionChange('costAdjustment', parseFloat(e.target.value))
              }
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

      {/* Boardroom Feedback */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold">Boardroom Feedback</h3>
        <p className="text-sm">{latest.boardroom}</p>
      </div>

      {/* KPI & Financials */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold">Key Financials</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <li>Capital: ${latest.capital}M</li>
          <li>Loans: ${latest.loans}M</li>
          <li>Deposits: ${latest.deposits}M</li>
          <li>Net Income: ${latest.netIncome}M</li>
          <li>ROE: {latest.roe}%</li>
          <li>Tier 1 Capital: {latest.tier1}%</li>
          <li>Operating Ratio: {latest.operatingCostRatio}%</li>
          <li>Provision Ratio: {latest.provisionRatio}%</li>
        </ul>
      </div>

      {/* Income Statement & Balance Sheet */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold">Income Statement</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <li>Revenue: ${latest.revenue}M</li>
          <li>Expenses: ${latest.expenses}M</li>
          <li>Net Income: ${latest.netIncome}M</li>
        </ul>
        <h3 className="text-xl font-bold mt-4">Balance Sheet</h3>
        <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <li>Assets: ${latest.assets}M</li>
          <li>Liabilities: ${latest.liabilities}M</li>
          <li>Equity: ${latest.capital}M</li>
        </ul>
      </div>

      {/* Quarter-over-Quarter Comparison */}
      {previous && (
        <div className="border p-4 rounded shadow">
          <h3 className="text-xl font-bold">Quarter-over-Quarter Comparison</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <li>
              ROE Change: {(latest.roe - previous.roe).toFixed(2)}%
            </li>
            <li>
              Net Income Change: ${(latest.netIncome - previous.netIncome).toFixed(2)}M
            </li>
            <li>
              Deposit Growth: ${(latest.deposits - previous.deposits).toFixed(2)}M
            </li>
            <li>
              Loan Growth: ${(latest.loans - previous.loans).toFixed(2)}M
            </li>
          </ul>
        </div>
      )}

      {/* Competitor Benchmarking */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold">Competitor Benchmarking</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left">Bank</th>
              <th className="text-left">ROE</th>
            </tr>
          </thead>
          <tbody>
            {latest.competitors.map((comp, idx) => (
              <tr key={idx} className="border-t">
                <td>{comp.name}</td>
                <td>{comp.roe}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Feedback */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold">Narrative Feedback</h3>
        <p className="text-sm">{feedback}</p>
      </div>
    </div>
  );
}
