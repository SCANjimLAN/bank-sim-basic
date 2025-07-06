import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      feedback: 'Welcome to National Iron Bank. You begin the decade with a strong balance sheet and moderate profitability.',
    };
    setFinancials([initial]);
  };

  const advanceQuarter = () => {
    const nextIndex = currentQuarter + 1;
    const nextScenario = generateScenario(nextIndex);
    const newData = applyQuarterUpdate(
      {
        currentQuarter,
        history: financials,
      },
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
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Bank Simulation Login</h2>
            <Input
              placeholder="Enter your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleLogin}>Start Simulation</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const latest = financials[financials.length - 1];

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-2xl font-semibold">{scenario?.quarter}</h2>
          <p className="text-sm">{scenario?.narrative}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-xl font-bold">Strategic Decisions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Change Base Interest Rate (±1%)</label>
              <Input
                type="number"
                step="0.25"
                min="-2"
                max="2"
                value={decisions.rateChange}
                onChange={(e) =>
                  handleDecisionChange('rateChange', parseFloat(e.target.value))
                }
              />
            </div>
            <div>
              <label>Expansion Strategy</label>
              <select
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
                value={decisions.riskTolerance}
                onChange={(e) => handleDecisionChange('riskTolerance', e.target.value)}
              >
                <option value="maintain">Maintain</option>
                <option value="loosen">Loosen</option>
                <option value="tighten">Tighten</option>
              </select>
            </div>
            <div>
              <label>Launch New Business Line</label>
              <select
                value={decisions.newLine}
                onChange={(e) => handleDecisionChange('newLine', e.target.value)}
              >
                <option value="">None</option>
                <option value="Wealth Management">Wealth Management</option>
                <option value="Investment Banking">Investment Banking</option>
                <option value="Merchant Banking">Merchant Banking</option>
              </select>
            </div>
          </div>
          <Button onClick={advanceQuarter}>Advance to Next Quarter</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4">
          <h3 className="text-xl font-semibold">Quarterly Financial Summary</h3>
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <li>Capital: ${latest.capital}M</li>
            <li>Loans: ${latest.loans}M</li>
            <li>Deposits: ${latest.deposits}M</li>
            <li>Interest Rate: {latest.interestRate}%</li>
            <li>Operating Ratio: {latest.operatingCostRatio}%</li>
            <li>Provision Ratio: {latest.provisionRatio}%</li>
            <li>RIA Fee Income: ${latest.riaFeeIncome}M</li>
            <li>Tier 1 Ratio: {latest.tier1}%</li>
            <li>ROE: {latest.roe}%</li>
            <li>Net Income: ${latest.netIncome}M</li>
          </ul>
          <div>
            <strong>Quarterly Narrative:</strong>
            <p className="text-sm">{feedback}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-xl font-semibold mb-2">Historical Financials</h3>
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th>Q</th>
                <th>Capital</th>
                <th>Loans</th>
                <th>Deposits</th>
                <th>Net Income</th>
                <th>ROE</th>
              </tr>
            </thead>
            <tbody>
              {financials.map((row, idx) => (
                <tr key={idx} className="border-t">
                  <td>{`Q${(idx % 4) + 1} ${2025 + Math.floor(idx / 4)}`}</td>
                  <td>${row.capital}</td>
                  <td>${row.loans}</td>
                  <td>${row.deposits}</td>
                  <td>${row.netIncome}</td>
                  <td>{row.roe}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
