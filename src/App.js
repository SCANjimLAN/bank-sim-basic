// bank_simulation_app: Game Version - Robust Simulation

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const initialState = {
  isLoggedIn: false,
  currentQuarter: 0,
  totalQuarters: 40,
  economicNarrative: '',
  financials: null,
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

export default function BankSimulationApp() {
  const [state, setState] = useState(initialState);
  const [username, setUsername] = useState('');

  const handleLogin = () => {
    if (username.trim()) {
      setState({
        ...state,
        isLoggedIn: true,
        economicNarrative: `Welcome to Q1 2025. The economy is showing moderate growth. Inflation has cooled to 3.2% and interest rates remain elevated. As the CEO of National Iron Bank, your challenge is to navigate an evolving financial landscape.`,
        financials: nationalIronInitialFinancials,
      });
    }
  };

  const advanceQuarter = () => {
    if (state.currentQuarter < state.totalQuarters - 1) {
      const nextQuarter = state.currentQuarter + 1;
      setState({
        ...state,
        currentQuarter: nextQuarter,
        economicNarrative: `Q${(nextQuarter % 4) + 1} ${2025 + Math.floor(nextQuarter / 4)}: Economic scenario evolves (randomized). Make strategic decisions to grow or defend.`,
        // Future: update financials based on decisions
      });
    } else {
      alert('Simulation complete! You have finished 10 years.');
    }
  };

  if (!state.isLoggedIn) {
    return (
      <div className="p-6 space-y-4">
        <Card>
          <CardContent className="p-4 space-y-4">
            <h2 className="text-xl font-bold">Bank Simulation Login</h2>
            <Input
              placeholder="Enter your name to begin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={handleLogin}>Start Simulation</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">{state.economicNarrative}</h2>
          <div>
            <h3 className="font-bold">National Iron Bank KPIs (Quarter {state.currentQuarter + 1})</h3>
            <ul className="list-disc list-inside">
              <li>Capital: ${state.financials.capital}M</li>
              <li>Loans: ${state.financials.loans}M</li>
              <li>Deposits: ${state.financials.deposits}M</li>
              <li>Interest Rate: {state.financials.interestRate}%</li>
              <li>Operating Cost Ratio: {state.financials.operatingCostRatio}%</li>
              <li>Provision Ratio: {state.financials.provisionRatio}%</li>
              <li>Tier 1 Capital Ratio: {state.financials.tier1}%</li>
              <li>Return on Equity (ROE): {state.financials.roe}%</li>
              <li>Net Income: ${state.financials.netIncome}M</li>
            </ul>
          </div>
          <Button onClick={advanceQuarter}>Advance to Next Quarter</Button>
        </CardContent>
      </Card>
    </div>
  );
}
