'use client';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import ClassCard from '@/components/classes/ClassCard';

export default function FeaturedClasses() {
  const { data: classes = [], isLoading } = useQuery({
    queryKey: ['featuredClasses'],
    queryFn: async () => {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/classes/featured`);
      return res.data;
    },
  });

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="text-4xl font-extrabold text-center mb-3">Featured Classes</h2>
      <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
        Our most popular classes ranked by member bookings. Jump in and find your next obsession.
      </p>

      {isLoading ? (
        <p className="text-center text-gray-500">Loading classes...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <ClassCard key={cls._id} cls={cls} />
          ))}
        </div>
      )}
    </section>
  );
}
