'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ManagePostsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['allPosts'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts?limit=100`, { withCredentials: true });
      return res.data;
    },
  });

  const posts = data?.posts || [];

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries(['allPosts']);
    },
    onError: () => toast.error('Delete failed'),
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Manage Forum Posts</h1>
      {isLoading ? (
        <div className="space-y-3">{[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-surface border border-border rounded-xl animate-pulse" />)}</div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-gray-400 text-xs uppercase">
                <th className="text-left px-6 py-4">Title</th>
                <th className="text-left px-6 py-4">Author</th>
                <th className="text-left px-6 py-4">Role</th>
                <th className="text-left px-6 py-4">Date</th>
                <th className="text-left px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p._id} className={`border-b border-border ${i % 2 === 0 ? 'bg-bg/30' : ''}`}>
                  <td className="px-6 py-4 font-semibold max-w-[200px] truncate">{p.title}</td>
                  <td className="px-6 py-4 text-gray-400">{p.authorName}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs px-2 py-1 rounded-full capitalize"
                      style={{ background: p.authorRole === 'admin' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)',
                        color: p.authorRole === 'admin' ? '#ef4444' : '#f59e0b' }}>
                      {p.authorRole}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400 text-xs">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => {
                      if (confirm('Delete this post?')) deleteMutation.mutate(p._id);
                    }}
                      className="px-3 py-1.5 rounded text-xs font-bold bg-red-500/20 text-red-400">
                      Delete
                    </button>
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
