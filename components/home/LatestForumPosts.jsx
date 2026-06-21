'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import PostCard from '@/components/forum/PostCard';

export default function LatestForumPosts() {
  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['latestPosts'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/latest`);
      return res.data;
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <p className="text-lime text-xs font-bold tracking-widest mb-3">COMMUNITY</p>
        <h2 className="text-4xl font-extrabold mb-3">Latest From Our Forum</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          Expert tips, fitness guides, and inspiring stories shared by our elite trainers and admins.
        </p>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.slice(0, 3).map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <div className="text-center mt-10">
        <Link
          href="/forum"
          className="inline-block px-6 py-3 rounded-lg bg-surface border border-border font-bold text-sm hover:border-lime hover:text-lime transition"
        >
          View All Posts →
        </Link>
      </div>
    </section>
  );
}
