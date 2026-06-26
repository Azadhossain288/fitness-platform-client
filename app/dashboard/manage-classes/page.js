'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ManageClassesPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['allClassesAdmin'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classes/all`, { withCredentials: true });
      return res.data;
    },
  });

  const classes = data?.classes || [];

  const mutation = useMutation({
    mutationFn: async ({ id, action }) => {
      if (action === 'delete') {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/classes/${id}`, { withCredentials: true });
      } else {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/classes/${id}`,
          { status: action === 'approve' ? 'approved' : 'rejected' },
          { withCredentials: true });
      }
    },
    onSuccess: () => {
      toast.success('Done!');
      queryClient.invalidateQueries(['allClassesAdmin']);
    },
    onError: () => toast.error('Action failed'),
  });

  const statusColor = (s) => s === 'approved' ? '#00c896' : s === 'rejected' ? '#ef4444' : '#f59e0b';

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Manage Classes</h1>
      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">Class</th>
                <th className="text-left px-6 py-4">Trainer</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, i) => (
                <tr key={cls._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold">{cls.className}</td>
                  <td className="px-6 py-4 text-gray-400">{cls.trainerName}</td>
                  <td className="px-6 py-4">{cls.category}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full capitalize"
                      style={{ color: statusColor(cls.status), background: `${statusColor(cls.status)}20` }}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {cls.status !== 'approved' && (
                        <button onClick={() => mutation.mutate({ id: cls._id, action: 'approve' })}
                          className="px-3 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400">
                          Approve
                        </button>
                      )}
                      {cls.status !== 'rejected' && (
                        <button onClick={() => mutation.mutate({ id: cls._id, action: 'reject' })}
                          className="px-3 py-1 rounded text-xs font-bold bg-yellow-500/20 text-yellow-400">
                          Reject
                        </button>
                      )}
                      <button onClick={() => mutation.mutate({ id: cls._id, action: 'delete' })}
                        className="px-3 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400">
                        Delete
                      </button>
                    </div>
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
