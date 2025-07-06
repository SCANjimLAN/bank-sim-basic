import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const initialInputs = {
  loanGrowthRate: 5,
  depositGrowthRate: 3,
  interestRate: 4,
  riaFeeIncome: 1.5,
  operatingCostRatio: 60,
  provisionRatio: 1,
  capital: 10,
};

const simulateBank = (inputs) => {
  const {
    loanGrowthRate,
    depositGrowthRate,
    interestRate,
    riaFeeIncome,
    operatingCostRatio,
    provisionRatio,
    capital: startCapital,
  } = inputs;

  let years = [2025, 2026, 2027, 2028, 2029];
  let baseLoans = 100;
  let baseDeposits = 120;
  let capital = startCapital;
  let rwaFactor = 0.75;

  return years.map((year) => {
    baseLoans *= 1 + loanGrowthRate / 100;
    baseDeposits *= 1 + depositGrowthRate / 100;
    let interestIncome = baseLoans * (interestRate / 100);
    let interestExpense = baseDeposits * ((interestRate - 1.5) / 100);
    let netInterest = interestIncome - interestExpense;
    let feeIncome = riaFeeIncome * (baseDeposits / 100);
    let provisions = baseLoans * (provisionRatio / 100);
    let operatingCost = (netInterest + feeIncome) * (operatingCostRatio / 100);
    let netIncome = netInterest + feeIncome - provisions - operatingCost;
    capital += netIncome;
    let rwa = baseLoans * rwaFactor;
    let tier1 = (capital / rwa) * 100;
    let roe = (netIncome / capital) * 100;

    return {
      year,
      netIncome: netIncome.toFixed(2),
      ROE: roe.toFixed(2),
      Tier1: tier1.toFixed(2),
      loans: baseLoans.toFixed(0),
      deposits: baseDeposits.toFixed(0),
      capital: capital.toFixed(2),
    };
  });
};

export default function App() {
  const [inputs, setInputs] = useState(() => {
    const saved = localStorage.getItem('bankInputs');
    return saved ? JSON.parse(saved) : initialInputs;
  });
  const [results, setResults] = useState(simulateBank(inputs));

  useEffect(() => {
    localStorage.setItem('bankInputs', JSON.stringify(inputs));
  }, [inputs]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: parseFloat(value) }));
  };

  const handleSimulate = () => {
    const sim = simulateBank(inputs);
    setResults(sim);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>🏦 Bank Simulation (Round 1)</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', maxWidth: '600px' }}>
        <label>
          Loan Growth Rate (%)
          <input type="number" name="loanGrowthRate" value={inputs.loanGrowthRate} onChange={handleChange} />
        </label>
        <label>
          Deposit Growth Rate (%)
          <input type="number" name="depositGrowthRate" value={inputs.depositGrowthRate} onChange={handleChange} />
        </label>
        <label>
          Interest Rate (%)
          <input type="number" name="interestRate" value={inputs.interestRate} onChange={handleChange} />
        </label>
        <label>
          RIA Fee Income (% of deposits)
          <input type="number" name="riaFeeIncome" value={inputs.riaFeeIncome} onChange={handleChange} />
        </label>
        <label>
          Operating Cost Ratio (%)
          <input type="number" name="operatingCostRatio" value={inputs.operatingCostRatio} onChange={handleChange} />
        </label>
        <label>
          Loan Loss Provision Ratio (%)
          <input type="number" name="provisionRatio" value={inputs.provisionRatio} onChange={handleChange} />
        </label>
        <label>
          Starting Capital ($M)
          <input type="number" name="capital" value={inputs.capital} onChange={handleChange} />
        </label>
      </div>
      <button style={{ marginTop: '20px', padding: '10px 20px' }} onClick={handleSimulate}>
        Run Simulation
      </button>

      <div style={{ marginTop: '40px', width: '100%', height: '400px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={results}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Line yAxisId="left" type="monotone" dataKey="netIncome" stroke="#8884d8" name="Net Income" />
            <Line yAxisId="right" type="monotone" dataKey="ROE" stroke="#82ca9d" name="ROE (%)" />
            <Line yAxisId="right" type="monotone" dataKey="Tier1" stroke="#ff7300" name="Tier 1 Capital (%)" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
