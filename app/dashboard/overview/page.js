'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { authClient } from '@/lib/auth-client';

function StatCard({ icon, label, value, gradient }) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
        style={{ background: gradient || 'linear-gradient(135deg, rgba(0,200,150,0.15), rgba(0,168,255,0.15))' }}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-extrabold">{value ?? '—'}</p>
        <p className="text-xs text-gray-500 mt-1">{label}</p>
      </div>
    </div>
  );
}

export default function OverviewPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

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

  const role = roleData?.role || 'user';

  const { data: bookings = [] } = useQuery({
    queryKey: ['userBookings', user?.email],
    enabled: !!user?.email && role === 'user',
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/bookings/user/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['userFavorites', user?.email],
    enabled: !!user?.email && role === 'user',
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const { data: myClasses = [] } = useQuery({
    queryKey: ['trainerClasses', user?.email],
    enabled: !!user?.email && role === 'trainer',
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classes/trainer/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const { data: adminStats } = useQuery({
    queryKey: ['adminStats'],
    enabled: role === 'admin',
    queryFn: async () => {
      const [users, classes, bookingsAll] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classes`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { withCredentials: true }),
      ]);
      return {
        totalUsers: users.data.length,
        totalClasses: classes.data.total || 0,
        totalBookings: bookingsAll.data.length,
      };
    },
  });

  const totalEnrolled = myClasses.reduce((sum, c) => sum + (c.bookingCount || 0), 0);

  const roleBadgeColor = role === 'admin' ? '#ef4444' : role === 'trainer' ? '#f59e0b' : '#00c896';

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Dashboard Overview</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
        {role === 'user' && (
          <>
            <StatCard icon="📅" label="Booked Classes" value={bookings.length} />
            <StatCard icon="❤️" label="Favorite Classes" value={favorites.length} />
            <StatCard icon="🎯" label="Application Status"
              value={roleData?.trainerApplicationStatus || 'None'} />
          </>
        )}
        {role === 'trainer' && (
          <>
            <StatCard icon="📋" label="Classes Created" value={myClasses.length} />
            <StatCard icon="👥" label="Students Enrolled" value={totalEnrolled} />
          </>
        )}
        {role === 'admin' && (
          <>
            <StatCard icon="👥" label="Total Users" value={adminStats?.totalUsers} />
            <StatCard icon="📋" label="Total Classes" value={adminStats?.totalClasses} />
            <StatCard icon="💳" label="Total Bookings" value={adminStats?.totalBookings} />
          </>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-2xl p-6 max-w-md">
        <h2 className="text-lg font-bold mb-4">Profile Details</h2>
        <div className="flex items-center gap-4">
          <img
            src={user?.image || '/default-avatar.png'}
            alt="avatar"
            className="w-16 h-16 rounded-full object-cover border-2"
            style={{ borderColor: '#00c896' }}
          />
          <div>
            <p className="font-bold text-lg">{user?.name}</p>
            <p className="text-sm text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-xs font-bold text-white capitalize"
              style={{ backgroundColor: roleBadgeColor }}>
              {role}
            </span>
          </div>
        </div>

        {role === 'user' && roleData?.trainerApplicationStatus === 'rejected' && (
          <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-xs text-red-400 font-semibold">Application Rejected</p>
            <p className="text-xs text-gray-400 mt-1">{roleData.trainerFeedback || 'No feedback provided'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
