'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';

export default function ForumPage() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['forumPosts', page],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts?page=${page}&limit=6`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const posts = data?.posts || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="text-xs font-bold tracking-widest mb-3" style={{ color: '#00c896' }}>
          COMMUNITY
        </p>
        <h1 className="text-4xl font-extrabold mb-3">Community Forum</h1>
        <p className="text-gray-400 max-w-xl mx-auto">
          Expert tips, fitness guides, and inspiring stories shared by our elite trainers and admins.
        </p>
      </div>

      {/* Posts Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-80 bg-surface border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-gray-400 text-lg">No posts yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <ForumCard key={post._id} post={post} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-12">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-semibold disabled:opacity-40 hover:border-lime transition"
          >
            ← Prev
          </button>
          {[...Array(totalPages)].map((_, i) => {
            const p = i + 1;
            return (
              <button
                key={p}
                onClick={() => setPage(p)}
                className="w-10 h-10 rounded-lg text-sm font-bold border transition"
                style={
                  page === p
                    ? { background: 'linear-gradient(135deg, #00c896, #00a8ff)', border: 'none', color: 'white' }
                    : { background: 'transparent', borderColor: '#1e2736', color: '#9ca3af' }
                }
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 rounded-lg bg-surface border border-border text-sm font-semibold disabled:opacity-40 hover:border-lime transition"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}

function ForumCard({ post }) {
  const short = post.description?.length > 100
    ? post.description.slice(0, 100) + '...'
    : post.description;

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col hover:border-[#00c896]/50 transition">
      <div className="relative">
        <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
        <span className="absolute top-3 left-3 bg-black/70 text-xs font-bold px-3 py-1 rounded-full">
          {post.authorRole === 'admin' ? 'Admin' : 'Trainer'}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-2 leading-snug">{post.title}</h3>
        <p className="text-sm text-gray-500 flex-1 mb-4">{short}</p>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
            >
              {post.authorName?.[0] || 'A'}
            </div>
            <span className="text-xs text-gray-400">{post.authorName}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span>👍 {post.likes?.length || 0}</span>
            <span>💬 {post.commentCount || 0}</span>
          </div>
        </div>

        <Link
          href={`/forum/${post._id}`}
          className="mt-4 w-full text-center py-2.5 rounded-lg border border-border text-sm font-bold text-gray-300 hover:text-white transition"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #00c896, #00a8ff)';
            e.currentTarget.style.borderColor = 'transparent';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#1e2736';
          }}
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
