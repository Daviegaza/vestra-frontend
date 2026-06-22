import { useState, useMemo } from 'react';
import { TrendingUp, TrendingDown, Wallet, Percent, Home, Calendar } from 'lucide-react';

interface ROICalculatorProps {
  defaultPrice?: number;
  defaultRent?: number;
  className?: string;
}

function formatKES(n: number): string {
  return `KES ${n.toLocaleString('en-KE')}`;
}

export default function ROICalculator({ defaultPrice = 5_000_000, defaultRent = 40_000, className = '' }: ROICalculatorProps) {
  const [price, setPrice] = useState(defaultPrice);
  const [monthlyRent, setMonthlyRent] = useState(defaultRent);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [interestRate, setInterestRate] = useState(13.5);
  const [loanTerm, setLoanTerm] = useState(20);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => {
    const downPayment = (price * downPaymentPct) / 100;
    const loanAmount = price - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    const monthlyMortgage =
      loanAmount > 0
        ? (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
          (Math.pow(1 + monthlyRate, numPayments) - 1)
        : 0;

    const monthlyExpenses = monthlyRent * 0.35;
    const monthlyCashflow = monthlyRent - monthlyMortgage - monthlyExpenses;
    const annualCashflow = monthlyCashflow * 12;
    const cashOnCash = downPayment > 0 ? (annualCashflow / downPayment) * 100 : 0;
    const capRate = price > 0 ? ((monthlyRent * 12 * 0.65) / price) * 100 : 0;
    const fiveYearReturn = downPayment > 0 ? ((annualCashflow * 5) / downPayment) * 100 : 0;
    const breakEvenMonths = monthlyCashflow > 0 ? Math.ceil(downPayment / monthlyCashflow) : Infinity;

    return { downPayment, loanAmount, monthlyMortgage, monthlyExpenses, monthlyCashflow, annualCashflow, cashOnCash, capRate, fiveYearReturn, breakEvenMonths };
  }, [price, monthlyRent, downPaymentPct, interestRate, loanTerm]);

  const isProfitable = result.monthlyCashflow > 0;
  const isExcellent = result.cashOnCash > 12;

  return (
    <div className={`space-y-5 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Purchase Price</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500/30 text-sm" min={500000} step={100000} />
          <p className="text-xs text-gray-400 mt-1">{formatKES(price)}</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Monthly Rent</label>
          <input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500/30 text-sm" min={5000} step={1000} />
          <p className="text-xs text-gray-400 mt-1">{formatKES(monthlyRent)}/mo</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Down Payment ({downPaymentPct}%)</label>
          <input type="range" value={downPaymentPct} onChange={(e) => setDownPaymentPct(Number(e.target.value))}
            min={5} max={100} step={5} className="w-full mt-2 accent-emerald-500" />
          <p className="text-xs text-gray-400 mt-1">{formatKES(result.downPayment)}</p>
        </div>
      </div>

      <button onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline font-medium">
        {showAdvanced ? 'Hide Advanced' : 'Show Advanced'}
      </button>

      {showAdvanced && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Interest Rate ({interestRate}%)</label>
            <input type="range" value={interestRate} onChange={(e) => setInterestRate(Number(e.target.value))}
              min={5} max={25} step={0.1} className="w-full accent-emerald-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Loan Term ({loanTerm} yrs)</label>
            <select value={loanTerm} onChange={(e) => setLoanTerm(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm">
              {[5, 10, 15, 20, 25, 30].map((y) => <option key={y} value={y}>{y} years</option>)}
            </select>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`p-4 rounded-xl border ${isProfitable ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800' : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'}`}>
          <div className="flex items-center gap-2 mb-2"><Wallet className={`w-4 h-4 ${isProfitable ? 'text-emerald-600' : 'text-red-500'}`} /><span className="text-xs font-medium text-gray-500">Monthly Cashflow</span></div>
          <p className={`text-xl font-bold ${isProfitable ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-600'}`}>
            {isProfitable ? '+' : ''}{formatKES(Math.round(result.monthlyCashflow))}
          </p>
          <div className="flex items-center gap-1 mt-1">{isProfitable ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}<span className="text-xs text-gray-400">per month</span></div>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-2"><Percent className="w-4 h-4 text-emerald-600" /><span className="text-xs font-medium text-gray-500">Cash-on-Cash</span></div>
          <p className={`text-xl font-bold ${isExcellent ? 'text-emerald-600' : 'text-gray-900 dark:text-gray-100'}`}>{result.cashOnCash.toFixed(1)}%</p>
          <span className="text-xs text-gray-400">{isExcellent ? 'Excellent' : isProfitable ? 'Good' : 'Negative'}</span>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-2"><Home className="w-4 h-4 text-emerald-600" /><span className="text-xs font-medium text-gray-500">Cap Rate</span></div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.capRate.toFixed(1)}%</p>
          <span className="text-xs text-gray-400">{result.capRate > 8 ? 'Above avg' : 'Below avg'}</span>
        </div>

        <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
          <div className="flex items-center gap-2 mb-2"><Calendar className="w-4 h-4 text-emerald-600" /><span className="text-xs font-medium text-gray-500">Break Even</span></div>
          <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{result.breakEvenMonths === Infinity ? 'N/A' : `${result.breakEvenMonths} mo`}</p>
          <span className="text-xs text-gray-400">{result.breakEvenMonths === Infinity ? 'Never with current rent' : `${(result.breakEvenMonths / 12).toFixed(1)} years`}</span>
        </div>
      </div>

      <div className={`p-4 rounded-xl border text-center text-sm font-semibold ${isExcellent ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-700 dark:text-emerald-300' : isProfitable ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 text-blue-700' : 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 text-amber-700'}`}>
        {isExcellent ? 'Excellent Investment — Strong positive cashflow' : isProfitable ? 'Good Investment — Positive cashflow' : 'Caution — Negative monthly cashflow. Consider a larger down payment.'}
      </div>
    </div>
  );
}
