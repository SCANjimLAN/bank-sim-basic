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
  });
  const [financials, setFinancials] = useState([]);
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
      revenue: 8,
      expenses: 5,
      provisions: 0.5,
      boardFeedback: "Welcome to National Iron Bank. You begin the decade with a strong balance sheet and moderate profitability.",
      scenarioNotes: '',
    };
    setFinancials([initial]);
  };

  const advanceQuarter = () => {
    const nextIndex = currentQuarter + 1;
    const nextScenario = generateScenario(nextIndex);
    const newData = applyQuarterUpdate({ currentQuarter, history: financials }, decisions, nextScenario);
    setFinancials([...financials, newData]);
    setScenario(nextScenario);
    setCurrentQuarter(nextIndex);
  };

  const handleDecisionChange = (field, value) => {
    setDecisions(prev => ({ ...prev, [field]: value }));
  };

  const latest = financials[financials.length - 1];
  const previous = financials[financials.length - 2];

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

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div className="border p-4 rounded shadow space-y-2">
        <h2 className="text-2xl font-semibold">{scenario?.quarter}</h2>
        <p className="text-sm">{scenario?.narrative}</p>
        {latest.scenarioNotes && <p className="text-red-700">{latest.scenarioNotes}</p>}
      </div>

      <div className="border p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-bold">Boardroom Feedback</h3>
        <p className="italic text-gray-700">{latest.boardFeedback}</p>
      </div>

      <div className="border p-4 rounded shadow space-y-4">
        <h3 className="text-xl font-bold">Strategic Decisions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {['rateChange', 'expansion', 'riskTolerance', 'newLine'].map((field, i) => (
            <div key={i}>
              <label className="block capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
              {field === 'rateChange' ? (
                <input
                  className="border p-2 w-full"
                  type="number"
                  value={decisions[field]}
                  onChange={e => handleDecisionChange(field, parseFloat(e.target.value))}
                />
              ) : (
                <select
                  className="border p-2 w-full"
                  value={decisions[field]}
                  onChange={e => handleDecisionChange(field, e.target.value)}
                >
                  {field === 'expansion' && <>
                    <option value="no">No Expansion</option>
                    <option value="yes">Expand Operations</option>
                  </>}
                  {field === 'riskTolerance' && <>
                    <option value="maintain">Maintain</option>
                    <option value="tighten">Tighten</option>
                    <option value="loosen">Loosen</option>
                  </>}
                  {field === 'newLine' && <>
                    <option value="">None</option>
                    <option value="Wealth Management">Wealth Management</option>
                    <option value="Investment Banking">Investment Banking</option>
                    <option value="Merchant Banking">Merchant Banking</option>
                  </>}
                </select>
              )}
            </div>
          ))}
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded" onClick={advanceQuarter}>
          Advance to Next Quarter
        </button>
      </div>

      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold">Quarterly Financials</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>Net Income: ${latest.netIncome}M</div>
          <div>ROE: {latest.roe}%</div>
          <div>Revenue: ${latest.revenue}M</div>
          <div>Expenses: ${latest.expenses}M</div>
          <div>Provisions: ${latest.provisions}M</div>
          <div>Tier 1 Ratio: {latest.tier1}%</div>
        </div>
        {previous && (
          <div className="mt-4 text-sm text-gray-600">
            <strong>QoQ Changes:</strong><br />
            Net Income: {(latest.netIncome - previous.netIncome).toFixed(2)}M &nbsp;
            ROE: {(latest.roe - previous.roe).toFixed(2)}% &nbsp;
            Tier 1: {(latest.tier1 - previous.tier1).toFixed(2)}%
          </div>
        )}
      </div>

      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Income Statement & Balance Sheet</h3>
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b">
              <th>Q</th><th>Revenue</th><th>Expenses</th><th>Provisions</th><th>Net Income</th><th>Capital</th><th>Loans</th><th>Deposits</th>
            </tr>
          </thead>
          <tbody>
            {financials.map((q, i) => (
              <tr key={i} className="border-t">
                <td>{`Q${(i % 4) + 1} ${2025 + Math.floor(i / 4)}`}</td>
                <td>${q.revenue}</td>
                <td>${q.expenses}</td>
                <td>${q.provisions}</td>
                <td>${q.netIncome}</td>
                <td>${q.capital}</td>
                <td>${q.loans}</td>
                <td>${q.deposits}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Performance Trends</h3>
        <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
          {financials.map((q, i) => (
            <div key={i} style={{ height: `${q.roe * 5}px`, background: 'steelblue', width: '10px' }} title={`ROE: ${q.roe}%`} />
          ))}
        </div>
        <div className="text-sm mt-2">ROE Trend (each bar = one quarter)</div>
      </div>
    </div>
  );
}
