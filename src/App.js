import React, { useState } from 'react';
import { generateScenario } from './logic/economicScenarios';
import { applyQuarterUpdate } from './logic/financialEngine';

function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(0);
  const [history, setHistory] = useState([]);
  const [scenario, setScenario] = useState(null);
  const [decisions, setDecisions] = useState({
    rateChange: 0,
    expansion: 'no',
    riskTolerance: 'neutral',
    newLine: 'None',
  });

  const startingFinancials = {
    year: 2025,
    capital: 32,
    loans: 100,
    deposits: 120,
    interestRate: 4.0,
    operatingCostRatio: 60,
    provisionRatio: 1,
    riaFeeIncome: 1.5,
    tier1: 14.5,
    roe: 7.8,
    netIncome: 2.5,
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
    const initialScenario = generateScenario(0);
    setScenario(initialScenario);
    setHistory([{ ...startingFinancials, quarter: initialScenario.quarter, scenario: initialScenario.narrative }]);
  };

  const advanceQuarter = () => {
    const nextQuarter = currentQuarter + 1;
    const nextScenario = generateScenario(nextQuarter);
    const prev = history[history.length - 1];
    const updated = applyQuarterUpdate({ currentQuarter }, decisions, nextScenario);
    setScenario(nextScenario);
    setCurrentQuarter(nextQuarter);
    setHistory([...history, { ...updated, quarter: nextScenario.quarter, scenario: nextScenario.narrative }]);
  };

  if (!isLoggedIn) {
    return (
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Welcome to the Bank Simulation</h1>
        <input
          className="border p-2"
          placeholder="Enter your name to begin"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogin}>
          Start Simulation
        </button>
      </div>
    );
  }

  const latest = history[history.length - 1];

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">{scenario?.narrative}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="font-bold">Decisions (Quarter {currentQuarter + 1})</h3>
          <label>
            Interest Rate Change (%):{' '}
            <input
              type="number"
              step="0.25"
              value={decisions.rateChange}
              onChange={(e) => setDecisions({ ...decisions, rateChange: parseFloat(e.target.value) })}
              className="border p-1 ml-2 w-20"
            />
          </label>
          <label>
            Expansion: {' '}
            <select
              value={decisions.expansion}
              onChange={(e) => setDecisions({ ...decisions, expansion: e.target.value })}
              className="border ml-2"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </label>
          <label>
            Risk Tolerance: {' '}
            <select
              value={decisions.riskTolerance}
              onChange={(e) => setDecisions({ ...decisions, riskTolerance: e.target.value })}
              className="border ml-2"
            >
              <option value="neutral">Neutral</option>
              <option value="loosen">Loosen</option>
              <option value="tighten">Tighten</option>
            </select>
          </label>
          <label>
            New Business Line:{' '}
            <select
              value={decisions.newLine}
              onChange={(e) => setDecisions({ ...decisions, newLine: e.target.value })}
              className="border ml-2"
            >
              <option value="None">None</option>
              <option value="Investment Banking">Investment Banking</option>
              <option value="Merchant Banking">Merchant Banking</option>
              <option value="Wealth Management">Wealth Management</option>
            </select>
          </label>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={advanceQuarter}
          >
            Advance to Next Quarter
          </button>
        </div>

        <div>
          <h3 className="font-bold">Quarterly Financial Summary</h3>
          <table className="border mt-2 w-full text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border px-2 py-1">Quarter</th>
                <th className="border px-2 py-1">Net Income</th>
                <th className="border px-2 py-1">ROE</th>
                <th className="border px-2 py-1">Tier 1</th>
                <th className="border px-2 py-1">Loans</th>
                <th className="border px-2 py-1">Deposits</th>
                <th className="border px-2 py-1">Capital</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, idx) => (
                <tr key={idx}>
                  <td className="border px-2 py-1">{h.quarter}</td>
                  <td className="border px-2 py-1">${h.netIncome}M</td>
                  <td className="border px-2 py-1">{h.roe}%</td>
                  <td className="border px-2 py-1">{h.tier1}%</td>
                  <td className="border px-2 py-1">${h.loans}M</td>
                  <td className="border px-2 py-1">${h.deposits}M</td>
                  <td className="border px-2 py-1">${h.capital}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
