'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import axios from 'axios';
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({ children }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [role, setRole] = useState('user');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      router.push('/login?redirect=/dashboard/overview');
      return;
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/role/${session.user.email}`, {
        withCredentials: true,
      })
      .then((res) => setRole(res.data.role || 'user'))
      .catch(() => setRole('user'));
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-lime border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 h-full z-10">
            <Sidebar role={role} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-4 px-6 py-4 border-b border-border">
          <button onClick={() => setSidebarOpen(true)} className="text-lime text-xl">☰</button>
          <span className="font-bold">Dashboard</span>
        </div>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
