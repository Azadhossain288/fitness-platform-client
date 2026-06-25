'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

const userLinks = [
  { href: '/dashboard/overview', label: 'Overview', icon: '📊' },
  { href: '/dashboard/booked-classes', label: 'Booked Classes', icon: '📅' },
  { href: '/dashboard/favorites', label: 'Favorites', icon: '❤️' },
  { href: '/dashboard/apply-trainer', label: 'Apply as Trainer', icon: '🏋️' },
];

const trainerLinks = [
  { href: '/dashboard/overview', label: 'Overview', icon: '📊' },
  { href: '/dashboard/add-class', label: 'Add Class', icon: '➕' },
  { href: '/dashboard/my-classes', label: 'My Classes', icon: '📋' },
  { href: '/dashboard/add-post', label: 'Add Forum Post', icon: '✍️' },
  { href: '/dashboard/my-posts', label: 'My Posts', icon: '📝' },
];

const adminLinks = [
  { href: '/dashboard/overview', label: 'Overview', icon: '📊' },
  { href: '/dashboard/manage-users', label: 'Manage Users', icon: '👥' },
  { href: '/dashboard/applied-trainers', label: 'Applied Trainers', icon: '📨' },
  { href: '/dashboard/manage-trainers', label: 'Manage Trainers', icon: '🏅' },
  { href: '/dashboard/manage-classes', label: 'Manage Classes', icon: '🗂️' },
  { href: '/dashboard/add-post', label: 'Add Forum Post', icon: '✍️' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '💳' },
  { href: '/dashboard/manage-posts', label: 'Manage Posts', icon: '🛡️' },
];

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const links =
    role === 'admin' ? adminLinks
    : role === 'trainer' ? trainerLinks
    : userLinks;

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
  };

  return (
    <aside
      className="w-64 shrink-0 min-h-screen border-r border-border flex flex-col"
      style={{ background: '#0d1117' }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2 text-lg font-extrabold">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white"
            style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
          >
            ⚡
          </span>
          Iron
          <span
            style={{
              background: 'linear-gradient(135deg, #00c896, #00a8ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Pulse
          </span>
        </Link>
      </div>

      {/* Role badge */}
      <div className="px-6 py-4 border-b border-border">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full text-white capitalize"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
        >
          {role}
        </span>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition"
              style={
                isActive
                  ? {
                      background:
                        'linear-gradient(135deg, rgba(0,200,150,0.15), rgba(0,168,255,0.15))',
                      color: '#00c896',
                      borderLeft: '3px solid #00c896',
                    }
                  : { color: '#9ca3af' }
              }
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 mb-3">
          <img
            src={session?.user?.image || '/default-avatar.png'}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover border border-border"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold truncate">{session?.user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2 rounded-lg border border-border text-sm text-gray-400 hover:border-red-500 hover:text-red-400 transition"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}