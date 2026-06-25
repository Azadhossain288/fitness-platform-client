"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      toast.error("Please login first!");
      router.push("/login");
      return;
    }
    if (!id) return;

    const fetchData = async () => {
      try {
        const email = session.user.email;
        const [classRes, enrollRes, favRes] = await Promise.all([
          axios.get(`http://localhost:5000/classes/${id}`, { withCredentials: true }),
          axios.get(`http://localhost:5000/bookings/check-enrollment`, { params: { email, classId: id }, withCredentials: true }),
          axios.get(`http://localhost:5000/favorites/check/${id}`, { params: { email }, withCredentials: true })
        ]);
        
        setClassData(classRes.data);
        setIsEnrolled(enrollRes.data.enrolled);
        setIsFavorite(favRes.data.isFavorite);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to load class details");
        setLoading(false);
      }
    };
    fetchData();
  }, [id, session, isPending, router]);

  const handleFavorite = async () => {
    if (!session?.user) return;
    setActionLoading(true);
    try {
      if (isFavorite) {
        await axios.delete(`http://localhost:5000/favorites/${id}`, { params: { email: session.user.email }, withCredentials: true });
        setIsFavorite(false);
        toast.success("Removed from favorites!");
      } else {
        await axios.post(`http://localhost:5000/favorites`, { email: session.user.email, classId: id }, { withCredentials: true });
        setIsFavorite(true);
        toast.success("Added to favorites!");
      }
    } catch (err) {
      toast.error("Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isPending || loading || !classData) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#00c896]">
        <div className="animate-pulse tracking-widest uppercase">Loading Details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e5e7eb] pb-20">
      <div className="relative h-[400px] w-full bg-slate-900">
        <img src={classData.image} alt={classData.className} className="w-full h-full object-cover opacity-50" />
        <div className="absolute bottom-10 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-black text-white">{classData.className}</h1>
            <p className="text-[#00c896] mt-2 font-medium text-xl">by {classData.trainerName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#161b27] p-8 rounded-2xl border border-[#1e2736]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">📖 About This Class</h2>
            <p className="text-gray-400 leading-relaxed">{classData.description}</p>
          </div>

          <div className="bg-[#161b27] p-8 rounded-2xl border border-[#1e2736]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">⭐ Class Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div><p className="text-gray-500 text-xs uppercase">Duration</p><p className="text-white font-medium">{classData.duration}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Schedule</p><p className="text-white font-medium">{classData.schedule}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Enrolled</p><p className="text-white font-medium">0 students</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Category</p><p className="text-white font-medium">{classData.category}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Difficulty</p><p className="text-white font-medium">{classData.difficulty}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Trainer</p><p className="text-white font-medium">{classData.trainerName}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-[#161b27] p-6 rounded-2xl border border-[#1e2736] h-fit sticky top-6">
          <div className="text-4xl font-bold text-white mb-2">${classData.price}</div>
          <p className="text-gray-500 mb-6">per session</p>
          <div className="space-y-4">
            {isEnrolled ? (
              <button disabled className="w-full py-3 rounded-lg bg-gray-800 text-green-600 cursor-not-allowed font-bold">Already Booked</button>
            ) : (
              <button onClick={() => router.push(`/payment/${id}`)} className="w-full py-3 rounded-lg bg-[#baff39] text-[#0d1117] font-bold hover:bg-[#a6e62d] transition">Book Now — ${classData.price}</button>
            )}
            <button onClick={handleFavorite} disabled={actionLoading} className="w-full py-3 rounded-lg border border-[#1e2736] text-gray-400 font-bold hover:border-gray-500 transition">
              {isFavorite ? "❤️ Bookmarked" : "🤍 Add to Favorites"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}