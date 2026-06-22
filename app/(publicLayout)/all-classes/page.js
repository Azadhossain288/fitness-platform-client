'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ClassCard from '@/components/classes/ClassCard';

const categories = ['All', 'Cardio', 'Weights', 'Yoga', 'Functional', 'Boxing', 'HIIT'];

export default function AllClassesPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['allClasses', search, category, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page,
        limit: 6,
        ...(search && { search }),
        ...(category !== 'all' && { category }),
      });
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/classes?${params}`
      );
      return res.data;
    },
    keepPreviousData: true,
  });

  const classes = data?.classes || [];
  const totalPages = data?.totalPages || 1;

  // reset to page 1 when search/filter changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCategory = (cat) => {
    setCategory(cat === 'All' ? 'all' : cat);
    setPage(1);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold mb-2">All Classes</h1>
        <p className="text-gray-400">Find the perfect class for your fitness goals</p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            type="text"
            placeholder="Search classes..."
            value={search}
            onChange={handleSearch}
            className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-3 outline-none focus:border-lime text-sm"
          />
        </div>

        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const isActive =
              cat === 'All' ? category === 'all' : category === cat;
            return (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-2.5 rounded-lg text-sm font-semibold border transition ${
                  isActive
                    ? 'text-white border-transparent'
                    : 'bg-surface border-border text-gray-400 hover:border-lime hover:text-lime'
                }`}
                style={
                  isActive
                    ? { background: 'linear-gradient(135deg, #00c896, #00a8ff)', border: 'none' }
                    : {}
                }
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Classes Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : classes.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">🏋️</p>
          <p className="text-gray-400 text-lg">No classes found</p>
          <p className="text-gray-600 text-sm mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls._id} cls={cls} />
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
                className={`w-10 h-10 rounded-lg text-sm font-bold border transition ${
                  page === p
                    ? 'text-white border-transparent'
                    : 'bg-surface border-border text-gray-400 hover:border-lime'
                }`}
                style={
                  page === p
                    ? { background: 'linear-gradient(135deg, #00c896, #00a8ff)' }
                    : {}
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
