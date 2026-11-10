import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Trash2,
  Calendar,
  PieChart,
  FileText,
  AlertCircle
} from 'lucide-react';
import { ExpenseData, PaymentData } from '../../types/index.ts';

interface FinancialManagementProps {
  expenses: ExpenseData[];
  payments: PaymentData[];
  currencySymbol: string;
  onRefresh: () => void;
}

export const FinancialManagement: React.FC<FinancialManagementProps> = ({
  expenses,
  payments,
  currencySymbol,
  onRefresh
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseData['category']>('rent');
  const [amount, setAmount] = useState<number>(10000);
  const [notes, setNotes] = useState('');

  const totalRevenue = payments
    .filter((p) => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const marginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : '0';

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
  });

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          category,
          amount: Number(amount),
          date: new Date().toISOString().split('T')[0],
          notes
        })
      });
      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setNotes('');
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      const res = await fetch(`/api/expenses/${id}`, { method: 'DELETE' });
      if (res.ok) {
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div>
          <h2 className="font-heading font-bold text-xl sm:text-2xl text-white">Financial Statement & P&L</h2>
          <p className="text-xs text-[#A1A99E] mt-0.5">
            Operating revenue, facility leases, coach payroll, utility overheads, and net operating profit.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 rounded-xl bg-[#C7FF3D] text-black font-heading font-bold text-xs hover:bg-[#A5D92F] transition-all flex items-center gap-1.5 shadow-lg shadow-[#C7FF3D]/15"
        >
          <Plus className="w-4 h-4" />
          <span>Record Facility Expense</span>
        </button>
      </div>

      {/* P&L Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Captured Revenue */}
        <div className="p-5 rounded-2xl bg-[#171C18] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A99E]">
            <span>Captured Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#C7FF3D]" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-[#C7FF3D]">
            {currencySymbol}{totalRevenue.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#A1A99E] font-mono">From active memberships & PT</span>
        </div>

        {/* Total Operational Overhead */}
        <div className="p-5 rounded-2xl bg-[#171C18] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A99E]">
            <span>Total Operational Expenses</span>
            <TrendingDown className="w-4 h-4 text-red-400" />
          </div>
          <p className="font-heading font-extrabold text-2xl text-red-400">
            {currencySymbol}{totalExpenses.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-[#A1A99E] font-mono">Rent, payroll, power, maintenance</span>
        </div>

        {/* Net Operating Profit */}
        <div className="p-5 rounded-2xl bg-[#171C18] border border-white/5 space-y-2">
          <div className="flex items-center justify-between text-xs text-[#A1A99E]">
            <span>Net Operating Margin</span>
            <span className="text-xs font-mono font-bold text-white">{marginPercent}% Margin</span>
          </div>
          <p className={`font-heading font-extrabold text-2xl ${netProfit >= 0 ? 'text-white' : 'text-red-400'}`}>
            {currencySymbol}{netProfit.toLocaleString('en-IN')}
          </p>
          <span className="text-[11px] text-emerald-400 font-mono">Sustainable operating margin</span>
        </div>
      </div>

      {/* Expense by Category Breakdown */}
      <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-white">Expense Distribution by Category</h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {Object.entries(categoryTotals).map(([cat, total]) => (
            <div key={cat} className="p-3.5 rounded-xl bg-[#111512] border border-white/5 space-y-1">
              <span className="text-[#A1A99E] uppercase font-mono text-[10px]">{cat}</span>
              <p className="font-mono text-white font-bold text-sm">
                {currencySymbol}{total.toLocaleString('en-IN')}
              </p>
              <div className="text-[10px] text-[#A1A99E]">
                {((total / (totalExpenses || 1)) * 100).toFixed(0)}% of total cost
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl bg-[#171C18] border border-white/[0.08] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111512] text-[#A1A99E] font-mono uppercase text-[10px] border-b border-white/5">
              <tr>
                <th className="p-3.5 pl-5">Expense Title</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Amount</th>
                <th className="p-3.5">Notes</th>
                <th className="p-3.5 text-right pr-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {expenses.map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.02]">
                  <td className="p-3.5 pl-5 font-semibold text-white">{e.title}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white/5 text-[#A1A99E]">
                      {e.category}
                    </span>
                  </td>
                  <td className="p-3.5 font-mono text-[#A1A99E]">{e.date}</td>
                  <td className="p-3.5 font-mono text-red-400 font-bold">
                    {currencySymbol}{e.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-[#A1A99E]">{e.notes || '—'}</td>
                  <td className="p-3.5 text-right pr-5">
                    <button
                      onClick={() => handleDeleteExpense(e.id)}
                      className="p-1 rounded hover:bg-red-500/10 text-[#A1A99E] hover:text-red-400 transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-[#171C18] border border-white/10 p-6 shadow-2xl">
            <h3 className="font-heading font-bold text-base text-white mb-4">Record Facility Expense</h3>
            <form onSubmit={handleCreateExpense} className="space-y-4 text-xs">
              <div>
                <label className="text-[#A1A99E] block mb-1">Expense Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Steam room boiler servicing"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[#A1A99E] block mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  >
                    <option value="rent">Facility Rent / Lease</option>
                    <option value="salary">Trainer Payroll</option>
                    <option value="electricity">Power & HVAC</option>
                    <option value="equipment">Weight / Plate Purchases</option>
                    <option value="maintenance">Sanitization / Maintenance</option>
                    <option value="marketing">Digital Ads</option>
                    <option value="misc">Miscellaneous</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#A1A99E] block mb-1">Amount (INR)</label>
                  <input
                    type="number"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                  />
                </div>
              </div>
              <div>
                <label className="text-[#A1A99E] block mb-1">Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Paid via NEFT from gym current account"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 rounded-lg bg-[#111512] border border-white/10 text-white focus:outline-none focus:border-[#C7FF3D]"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#111512] text-[#A1A99E] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#C7FF3D] text-black font-semibold"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
