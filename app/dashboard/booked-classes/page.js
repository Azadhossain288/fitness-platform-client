'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function BookedClassesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ['userBookings', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/user/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Booked Classes</h1>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-surface border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">📅</p>
          <p className="text-gray-400">No classes booked yet</p>
          <Link href="/all-classes"
            className="inline-block mt-4 px-6 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
            Browse Classes
          </Link>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase tracking-wide">
                <th className="text-left px-6 py-4">Class Name</th>
                <th className="text-left px-6 py-4 hidden md:table-cell">Trainer</th>
                <th className="text-left px-6 py-4 hidden lg:table-cell">Schedule</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b, i) => (
                <tr key={b._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold">{b.className}</td>
                  <td className="px-6 py-4 text-gray-400 hidden md:table-cell">{b.trainerName || '—'}</td>
                  <td className="px-6 py-4 text-gray-400 hidden lg:table-cell">{b.schedule || '—'}</td>
                  <td className="px-6 py-4">
                    <Link href={`/class-details/${b.classId}`}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
                      View
                    </Link>
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
