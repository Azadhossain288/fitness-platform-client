'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function FavoritesPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['userFavorites', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/user/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const removeMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/favorites/${id}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success('Removed from favorites');
      queryClient.invalidateQueries(['userFavorites', user?.email]);
    },
    onError: () => toast.error('Failed to remove'),
  });

  return (
    <div>
      <h1 className="text-3xl font-extrabold mb-8">Favorite Classes</h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-surface border border-border rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">❤️</p>
          <p className="text-gray-400">No favorites yet</p>
          <Link href="/all-classes"
            className="inline-block mt-4 px-6 py-2 rounded-lg text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
            Browse Classes
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div key={fav._id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <img src={fav.image} alt={fav.className} className="h-36 w-full object-cover" />
              <div className="p-4">
                <h3 className="font-bold mb-1">{fav.className}</h3>
                <p className="text-sm text-gray-400 mb-1">by {fav.trainerName}</p>
                <p className="font-bold mb-4"
                  style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  ${fav.price}
                </p>
                <button
                  onClick={() => removeMutation.mutate(fav._id)}
                  className="w-full py-2 rounded-lg border border-red-500/30 text-red-400 text-sm font-semibold hover:bg-red-500/10 transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
