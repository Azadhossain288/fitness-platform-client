// app/dashboard/layout.js
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0d1117] text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-[#1e2736] p-6 space-y-6">
        <h2 className="text-xl font-bold text-[#00c896]">Iron Pulse</h2>
        <nav className="space-y-4">
          <Link href="/dashboard" className="block p-2 hover:bg-[#161b27] rounded">Overview</Link>
          <Link href="/dashboard/booked-classes" className="block p-2 hover:bg-[#161b27] rounded">Booked Classes</Link>
          <Link href="/dashboard/favorites" className="block p-2 hover:bg-[#161b27] rounded">Favorites</Link>
          <Link href="/dashboard/apply" className="block p-2 hover:bg-[#161b27] rounded">Apply as Trainer</Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}