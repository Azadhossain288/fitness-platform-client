'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AppliedTrainersPage() {
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');

  const { data: applications = [], isLoading } = useQuery({
    queryKey: ['trainerApplications'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trainer-applications`, { withCredentials: true });
      return res.data;
    },
  });

  const actionMutation = useMutation({
    mutationFn: async ({ id, action }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/trainer-applications/${action}/${id}`,
        { feedback },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success('Done!');
      setSelected(null);
      setFeedback('');
      queryClient.invalidateQueries(['trainerApplications']);
    },
    onError: () => toast.error('Action failed'),
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Applied Trainers</h1>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No pending applications</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">Name</th>
                <th className="text-left px-6 py-4">Email</th>
                <th className="text-left px-6 py-4">Specialty</th>
                <th className="text-left px-6 py-4">Experience</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app, i) => (
                <tr key={app._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold">{app.name}</td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{app.email}</td>
                  <td className="px-6 py-4">{app.specialty}</td>
                  <td className="px-6 py-4">{app.experience} yrs</td>
                  <td className="px-6 py-4">
                    <button onClick={() => setSelected(app)}
                      className="px-3 py-1.5 rounded text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center px-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Application Details</h2>
            <div className="space-y-2 mb-4 text-sm">
              <p><span className="text-gray-400">Name:</span> {selected.name}</p>
              <p><span className="text-gray-400">Email:</span> {selected.email}</p>
              <p><span className="text-gray-400">Specialty:</span> {selected.specialty}</p>
              <p><span className="text-gray-400">Experience:</span> {selected.experience} years</p>
            </div>
            <div className="mb-4">
              <label className="text-xs text-gray-400 font-bold tracking-wide">FEEDBACK</label>
              <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)}
                rows={3} placeholder="Write feedback (required for rejection)..."
                className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-2 text-sm outline-none focus:border-lime resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => actionMutation.mutate({ id: selected._id, action: 'approve' })}
                className="flex-1 py-2 rounded-lg font-bold text-white text-sm"
                style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
                Approve
              </button>
              <button onClick={() => actionMutation.mutate({ id: selected._id, action: 'reject' })}
                className="flex-1 py-2 rounded-lg font-bold text-sm bg-red-500/20 text-red-400 border border-red-500/30">
                Reject
              </button>
              <button onClick={() => setSelected(null)}
                className="px-4 py-2 rounded-lg text-sm border border-border text-gray-400">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
