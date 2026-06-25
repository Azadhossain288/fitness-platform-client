'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const specialties = ['Yoga', 'Weights', 'Cardio', 'HIIT', 'Boxing', 'Functional', 'Pilates', 'CrossFit'];

export default function ApplyTrainerPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [form, setForm] = useState({ experience: '', specialty: '' });

  const { data: roleData } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/role/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async () => {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/trainer-applications`,
        {
          name: user.name,
          email: user.email,
          image: user.image,
          experience: form.experience,
          specialty: form.specialty,
        },
        { withCredentials: true }
      );
    },
    onSuccess: () => toast.success('Application submitted successfully!'),
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to submit'),
  });

  const status = roleData?.trainerApplicationStatus;

  if (status === 'pending') {
    return (
      <div className="max-w-md">
        <h1 className="text-3xl font-extrabold mb-8">Apply as Trainer</h1>
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 text-center">
          <p className="text-3xl mb-3">⏳</p>
          <p className="font-bold text-yellow-400">Application Pending</p>
          <p className="text-sm text-gray-400 mt-2">Your application is under review. We'll notify you once it's processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md">
      <h1 className="text-3xl font-extrabold mb-2">Apply as Trainer</h1>
      <p className="text-gray-400 mb-8">Share your expertise and start teaching on IronPulse.</p>

      {status === 'rejected' && (
        <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
          <p className="text-sm text-red-400 font-semibold">Previous application was rejected</p>
          <p className="text-xs text-gray-400 mt-1">{roleData.trainerFeedback || 'No feedback provided'}</p>
        </div>
      )}

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">EXPERIENCE (YEARS)</label>
          <input
            type="number"
            min="0"
            value={form.experience}
            onChange={(e) => setForm({ ...form, experience: e.target.value })}
            placeholder="e.g. 3"
            className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">SPECIALTY</label>
          <select
            value={form.specialty}
            onChange={(e) => setForm({ ...form, specialty: e.target.value })}
            className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm"
          >
            <option value="">Select specialty</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => applyMutation.mutate()}
          disabled={!form.experience || !form.specialty || applyMutation.isPending}
          className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50 transition"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
        >
          {applyMutation.isPending ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
