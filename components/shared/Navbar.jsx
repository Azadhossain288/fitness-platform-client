'use client';

import Link from 'next/link';
import { useState } from 'react';
import useAuth from '@/hooks/useAuth';
import useUserRole from '@/hooks/useUserRole';

export default function Navbar() {
  const { user, logOut } = useAuth();
  const { role } = useUserRole();
  const [open, setOpen] = useState(false);

  const navLinks = (
    <>
      <Link href="/" className="hover:text-lime transition">Home</Link>
      <Link href="/all-classes" className="hover:text-lime transition">All Classes</Link>
      <Link href="/forum" className="hover:text-lime transition">Community Forum</Link>
      {user && (
        <Link href="/dashboard/overview" className="hover:text-lime transition">
          Dashboard {role !== 'user' && <span className="text-xs opacity-60">({role})</span>}
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 border-b border-border" style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold">
          <span className="w-8 h-8 rounded-lg bg-lime/20 text-lime flex items-center justify-center">⚡</span>
          Iron<span className="text-lime">Pulse</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm uppercase tracking-wide text-gray-300">
          {navLinks}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button className="w-9 h-9 rounded-lg bg-surface border border-border flex items-center justify-center text-lime">
            ☀
          </button>
          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.image || '/default-avatar.png'}
                alt={user.name}
                className="w-9 h-9 rounded-full object-cover border border-border"
              />
              <button
                onClick={logOut}
                className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-medium hover:border-lime"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-lime">
                Login
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-lg bg-lime text-bg text-sm font-bold hover:bg-limeDark transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button className="md:hidden text-lime" onClick={() => setOpen(!open)}>☰</button>
      </div>

      {open && (
        <div className="md:hidden flex flex-col gap-4 px-6 pb-6 text-gray-300">
          {navLinks}
          {user ? (
            <button onClick={logOut} className="text-left text-red-400">Logout</button>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register" className="text-lime font-bold">Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
