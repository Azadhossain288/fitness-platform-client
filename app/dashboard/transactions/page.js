'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export default function TransactionsPage() {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['allPayments'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { withCredentials: true });
      return res.data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Transactions</h1>
      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">User Email</th>
                <th className="text-left px-6 py-4">Class</th>
                <th className="text-left px-6 py-4">Amount</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Transaction ID</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p, i) => (
                <tr key={p._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 text-xs text-gray-400">{p.userEmail || p.email}</td>
                  <td className="px-6 py-4">{p.className}</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#00c896' }}>${p.price || p.amount}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(p.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-xs text-gray-500 truncate max-w-[150px]">{p.transactionId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
