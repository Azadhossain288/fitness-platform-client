'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ManageUsersPage() {
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, { withCredentials: true });
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async ({ id, action }) => {
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL}/users/${action}/${id}`, {}, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success('Updated!');
      queryClient.invalidateQueries(['allUsers']);
    },
    onError: () => toast.error('Action failed'),
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Manage Users</h1>
      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold">{u.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{ background: u.role === 'admin' ? 'rgba(239,68,68,0.2)' : u.role === 'trainer' ? 'rgba(245,158,11,0.2)' : 'rgba(0,200,150,0.2)',
                        color: u.role === 'admin' ? '#ef4444' : u.role === 'trainer' ? '#f59e0b' : '#00c896' }}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${u.status === 'blocked' ? 'text-red-400' : 'text-green-400'}`}>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2 flex-wrap">
                      {u.status === 'blocked' ? (
                        <button onClick={() => mutation.mutate({ id: u._id, action: 'unblock' })}
                          className="px-3 py-1 rounded text-xs font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 transition">
                          Unblock
                        </button>
                      ) : (
                        <button onClick={() => mutation.mutate({ id: u._id, action: 'block' })}
                          className="px-3 py-1 rounded text-xs font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition">
                          Block
                        </button>
                      )}
                      {u.role === 'user' && (
                        <button onClick={() => mutation.mutate({ id: u._id, action: 'make-admin' })}
                          className="px-3 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition">
                          Make Admin
                        </button>
                      )}
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
