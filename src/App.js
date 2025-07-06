import React, { useState } from 'react';
import economicScenarios from './data/economicScenarios';
import { applyQuarterUpdate } from './logic/financialEngine';

export default function App() {
  const [username, setUsername] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentQuarter, setCurrentQuarter] = useState(0);
  const [financialsHistory, setFinancialsHistory] = useState([]);
  const [decisions, setDecisions] = useState({
    rateChange: '0.0',
    newLine: 'None',
    expansion: 'no',
    riskTolerance: 'maintain',
  });

  const handleLogin = () => {
    if (username.trim()) {
      const initialFinancials = {
        capital: 10,
        loans: 100,
        deposits: 120,
        interestRate: 4.0,
        operatingCostRatio: 60,
        provisionRatio: 1.0,
        riaFeeIncome: 1.5,
        tier1: 14.5,
        roe: 7.8,
        netIncome: 2.5,
        quarter: 'Q0',
      };
      setFinancialsHistory([initialFinancials]);
      setIsLoggedIn(true);
    }
  };

  const handleDecisionChange = (e) => {
    const { name, value } = e.target;
    setDecisions({ ...decisions, [name]: value });
  };

  const handleSubmitQuarter = () => {
    const scenario = economicScenarios[currentQuarter];
    const latestFinancials = financialsHistory[financialsHistory.length - 1];
    const updated = applyQuarterUpdate({ financials: latestFinancials }, decisions, scenario);
    setFinancialsHistory([...financialsHistory, updated]);
    setCurrentQuarter(currentQuarter + 1);

    // Reset choices
    setDecisions({
      rateChange: '0.0',
      newLine: 'None',
      expansion: 'no',
      riskTolerance: 'maintain',
    });
  };

  if (!isLoggedIn) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Welcome to National Iron Bank Simulation</h2>
        <input
          type="text"
          placeholder="Enter your name"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button onClick={handleLogin}>Start Simulation</button>
      </div>
    );
  }

  if (currentQuarter >= economicScenarios.length) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Simulation Complete</h2>
        <p>You've completed a decade of decision-making at National Iron Bank!</p>
        <h3>Final Summary:</h3>
        <pre>{JSON.stringify(financialsHistory[financialsHistory.length - 1], null, 2)}</pre>
      </div>
    );
  }

  const currentScenario = economicScenarios[currentQuarter];
  const latestFinancials = financialsHistory[financialsHistory.length - 1];

  return (
    <div style={{ padding: 20 }}>
      <h2>{currentScenario.quarter} - Economic Update</h2>
      <p>{currentScenario.commentary}</p>
      <ul>
        <li>GDP Growth: {currentScenario.gdpGrowth}%</li>
        <li>Inflation: {currentScenario.inflation}%</li>
        <li>Interest Rate: {currentScenario.interestRate}%</li>
        <li>Risk Environment: {currentScenario.riskEnvironment}</li>
      </ul>

      <hr />

      <h3>Make Your Strategic Decisions</h3>
      <form>
        <label>Adjust Loan Interest Rate (%): </label>
        <input
          type="number"
          step="0.1"
          name="rateChange"
          value={decisions.rateChange}
          onChange={handleDecisionChange}
        />
        <br /><br />

        <label>Launch a New Business Line: </label>
        <select name="newLine" value={decisions.newLine} onChange={handleDecisionChange}>
          <option value="None">None</option>
          <option value="Wealth Management">Wealth Management</option>
          <option value="Merchant Banking">Merchant Banking</option>
          <option value="Asset Management">Asset Management</option>
        </select>
        <br /><br />

        <label>Geographic Expansion? </label>
        <select name="expansion" value={decisions.expansion} onChange={handleDecisionChange}>
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
        <br /><br />

        <label>Risk Tolerance: </label>
        <select name="riskTolerance" value={decisions.riskTolerance} onChange={handleDecisionChange}>
          <option value="maintain">Maintain</option>
          <option value="tighten">Tighten</option>
          <option value="loosen">Loosen</option>
        </select>
      </form>
      <br />
      <button onClick={handleSubmitQuarter}>Submit Decisions & Advance</button>

      <hr />
      <h3>Latest Financials</h3>
      <ul>
        <li>Capital: ${latestFinancials.capital}M</li>
        <li>Loans: ${latestFinancials.loans}M</li>
        <li>Deposits: ${latestFinancials.deposits}M</li>
        <li>Interest Rate: {latestFinancials.interestRate}%</li>
        <li>Operating Cost Ratio: {latestFinancials.operatingCostRatio}%</li>
        <li>Provision Ratio: {latestFinancials.provisionRatio}%</li>
        <li>Tier 1 Capital Ratio: {latestFinancials.tier1}%</li>
        <li>ROE: {latestFinancials.roe}%</li>
        <li>Net Income: ${latestFinancials.netIncome}M</li>
      </ul>

      <hr />
      <h3>Financial History</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Quarter</th>
            <th>Capital</th>
            <th>Loans</th>
            <th>Deposits</th>
            <th>Interest Rate</th>
            <th>Net Income</th>
            <th>ROE</th>
            <th>Tier 1</th>
          </tr>
        </thead>
        <tbody>
          {financialsHistory.map((f, i) => (
            <tr key={i}>
              <td>{f.quarter}</td>
              <td>${f.capital}</td>
              <td>${f.loans}</td>
              <td>${f.deposits}</td>
              <td>{f.interestRate}%</td>
              <td>${f.netIncome}</td>
              <td>{f.roe}%</td>
              <td>{f.tier1}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
