'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ManageTrainersPage() {
  const queryClient = useQueryClient();

  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ['allTrainers'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trainer-applications/trainers`, { withCredentials: true });
      return res.data;
    },
  });

  const demoteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/demote/${id}`, {}, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success('Trainer demoted to user');
      queryClient.invalidateQueries(['allTrainers']);
    },
    onError: () => toast.error('Failed to demote'),
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Manage Trainers</h1>
      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No trainers found</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {trainers.map((t, i) => (
                <tr key={t._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold">{t.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{t.email}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => {
                      if (confirm('Demote this trainer to user?')) demoteMutation.mutate(t._id);
                    }}
                      className="px-3 py-1.5 rounded text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                      Demote to User
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
