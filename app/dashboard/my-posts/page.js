'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function MyPostsPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['myPosts', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts/author/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/forum-posts/${id}`, { withCredentials: true });
    },
    onSuccess: () => {
      toast.success('Post deleted');
      queryClient.invalidateQueries(['myPosts', user?.email]);
    },
    onError: () => toast.error('Delete failed'),
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">My Forum Posts</h1>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-48 bg-surface border border-border rounded-2xl animate-pulse" />)}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No posts yet</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div key={post._id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <img src={post.image} alt={post.title} className="h-36 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-2 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-gray-500 mb-4">{new Date(post.createdAt).toLocaleDateString()}</p>
                <button onClick={() => { if (confirm('Delete this post?')) deleteMutation.mutate(post._id); }}
                  className="w-full py-2 rounded-lg text-sm font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
