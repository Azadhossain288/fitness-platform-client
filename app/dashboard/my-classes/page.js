'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function MyClassesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const [attendeesModal, setAttendeesModal] = useState(null);

  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['trainerClasses', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/trainer/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const { data: attendees = [] } = useQuery({
    queryKey: ['attendees', attendeesModal],
    enabled: !!attendeesModal,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/${attendeesModal}/attendees`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/classes/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success('Class deleted');
      queryClient.invalidateQueries(['trainerClasses', user?.email]);
    },
    onError: () => toast.error('Delete failed'),
  });

  const statusColor = (s) => s === 'approved' ? '#00c896' : s === 'rejected' ? '#ef4444' : '#f59e0b';

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">My Classes</h1>

      {isLoading ? (
        <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : classes.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No classes yet</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">Class</th>
                <th className="text-left px-6 py-4">Category</th>
                <th className="text-left px-6 py-4">Price</th>
                <th className="text-left px-6 py-4">Status</th>
                <th className="text-left px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, i) => (
                <tr key={cls._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold">{cls.className}</td>
                  <td className="px-6 py-4 text-gray-400">{cls.category}</td>
                  <td className="px-6 py-4 font-bold" style={{ color: '#00c896' }}>${cls.price}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-full capitalize"
                      style={{ color: statusColor(cls.status), background: `${statusColor(cls.status)}20` }}>
                      {cls.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => setAttendeesModal(cls._id)}
                        className="px-3 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400">
                        Students
                      </button>
                      <button onClick={() => { if (confirm('Delete this class?')) deleteMutation.mutate(cls._id); }}
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

      {/* Attendees Modal */}
      {attendeesModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Enrolled Students</h2>
            {attendees.length === 0 ? (
              <p className="text-gray-400 text-center py-4">No students enrolled yet</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {attendees.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-bg rounded-lg">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
                      {(a.studentName || a.userName || 'U')[0]}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{a.studentName || a.userName || 'Unknown'}</p>
                      <p className="text-xs text-gray-400">{a.studentEmail || a.userEmail}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setAttendeesModal(null)}
              className="mt-4 w-full py-2 rounded-lg border border-border text-sm text-gray-400">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
