import React, { useState } from 'react';
import { generateScenario } from './logic/economicScenarios';
import { applyQuarterUpdate } from './logic/financialEngine';

const initialState = {
  isLoggedIn: false,
  currentQuarter: 0,
  totalQuarters: 40,
  economicNarrative: '',
  financials: null,
  history: [],
  decisions: [],
  showSimulation: false,
};

const nationalIronInitialFinancials = {
  year: 2024,
  capital: 10,
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

function BankSimulationApp() {
  const [state, setState] = useState(initialState);
  const [username, setUsername] = useState('');
  const [decisionInputs, setDecisionInputs] = useState({
    rateChange: '0',
    newLine: 'None',
    expansion: 'no',
    riskTolerance: 'maintain',
  });

  const handleLogin = () => {
    if (username.trim()) {
      const initialScenario = generateScenario(0);
      setState({
        ...state,
        isLoggedIn: true,
        economicNarrative: initialScenario.narrative,
        financials: nationalIronInitialFinancials,
        history: [nationalIronInitialFinancials],
      });
    }
  };

  const handleDecisionChange = (e) => {
    const { name, value } = e.target;
    setDecisionInputs({
      ...decisionInputs,
      [name]: value,
    });
  };

  const advanceQuarter = () => {
    const nextQuarter = state.currentQuarter + 1;
    if (nextQuarter >= state.totalQuarters) {
      alert('Simulation complete! You have finished 10 years.');
      return;
    }

    const scenario = generateScenario(nextQuarter);
    const updatedFinancials = applyQuarterUpdate(state, decisionInputs, scenario);

    setState({
      ...state,
      currentQuarter: nextQuarter,
      economicNarrative: scenario.narrative,
      financials: updatedFinancials,
      history: [...state.history, updatedFinancials],
      decisions: [...state.decisions, decisionInputs],
    });

    // Reset form
    setDecisionInputs({
      rateChange: '0',
      newLine: 'None',
      expansion: 'no',
      riskTolerance: 'maintain',
    });
  };

  if (!state.isLoggedIn) {
    return (
      <div className="p-6 space-y-4">
        <div className="bg-white shadow p-4 rounded-md">
          <h2 className="text-xl font-bold mb-2">Bank Simulation Login</h2>
          <input
            className="border p-2 w-full"
            placeholder="Enter your name to begin"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button onClick={handleLogin} className="bg-blue-600 text-white mt-2 px-4 py-2 rounded">
            Start Simulation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white shadow p-4 rounded-md">
        <h2 className="text-xl font-semibold mb-2">Quarter {state.currentQuarter + 1} Economic Narrative</h2>
        <p>{state.economicNarrative}</p>
      </div>

      <div className="bg-white shadow p-4 rounded-md">
        <h3 className="text-lg font-bold mb-2">National Iron Bank KPIs</h3>
        <ul className="list-disc list-inside">
          <li>Capital: ${state.financials.capital}M</li>
          <li>Loans: ${state.financials.loans}M</li>
          <li>Deposits: ${state.financials.deposits}M</li>
          <li>Interest Rate: {state.financials.interestRate}%</li>
          <li>Operating Cost Ratio: {state.financials.operatingCostRatio}%</li>
          <li>Provision Ratio: {state.financials.provisionRatio}%</li>
          <li>Tier 1 Capital Ratio: {state.financials.tier1}%</li>
          <li>Return on Equity (ROE): {state.financials.roe}%</li>
          <li>Net Income (Annualized): ${state.financials.netIncome}M</li>
        </ul>
      </div>

      <div className="bg-white shadow p-4 rounded-md space-y-4">
        <h3 className="text-lg font-semibold">Make Strategic Decisions</h3>
        <label>
          Interest Rate Change (%):
          <input
            type="number"
            name="rateChange"
            value={decisionInputs.rateChange}
            onChange={handleDecisionChange}
            className="border ml-2 p-1 w-20"
          />
        </label>

        <label>
          New Business Line:
          <select name="newLine" value={decisionInputs.newLine} onChange={handleDecisionChange} className="ml-2 p-1 border">
            <option value="None">None</option>
            <option value="Wealth Management">Wealth Management</option>
            <option value="Investment Banking">Investment Banking</option>
            <option value="Insurance">Insurance</option>
            <option value="Merchant Banking">Merchant Banking</option>
          </select>
        </label>

        <label>
          Expansion:
          <select name="expansion" value={decisionInputs.expansion} onChange={handleDecisionChange} className="ml-2 p-1 border">
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
        </label>

        <label>
          Risk Tolerance:
          <select name="riskTolerance" value={decisionInputs.riskTolerance} onChange={handleDecisionChange} className="ml-2 p-1 border">
            <option value="tighten">Tighten</option>
            <option value="maintain">Maintain</option>
            <option value="loosen">Loosen</option>
          </select>
        </label>

        <button onClick={advanceQuarter} className="bg-green-600 text-white px-4 py-2 rounded">
          Advance to Next Quarter
        </button>
      </div>
    </div>
  );
}

export default BankSimulationApp;
