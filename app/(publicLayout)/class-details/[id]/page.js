"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client"; 

export default function ClassDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  // Fetch session data from Better Auth
  const { data: session, isPending } = authClient.useSession();
  
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Validation and button states
  const [isBooked, setIsBooked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [actionLoading, setActionLoading] = useState({ book: false, fav: false });

  useEffect(() => {
    // 1. Wait until the session check is fully completed
    if (isPending) return;

    // 2. If user is not logged in, redirect them immediately to the login page
    if (!session?.user) {
      toast.error("Please login first to view the class details!");
      router.push("/login");
      return;
    }

    if (!id) return;

    const userId = session.user.id;

    // 3. Fetch primary class details (FIXED URL: Removed '/api')
    axios.get(`http://localhost:5000/classes/${id}`, { withCredentials: true })
      .then((res) => {
        setClassData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching class details:", err);
        toast.error("Failed to load class details. Please check server console.");
        setLoading(false);
      });

    // 4. Check if already booked (FIXED URL: Removed '/api')
    axios.get(`http://localhost:5000/bookings/check?userId=${userId}&classId=${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.booked) setIsBooked(true);
      })
      .catch((err) => {
        console.warn("Booking check API offline or un-routed:", err.message);
      });

    // 5. Check if already in favorites (FIXED URL: Removed '/api')
    axios.get(`http://localhost:5000/favorites/check?userId=${userId}&classId=${id}`, { withCredentials: true })
      .then((res) => {
        if (res.data && res.data.favorite) setIsFavorite(true);
      })
      .catch((err) => {
        console.warn("Favorites check API offline or un-routed:", err.message);
      });

  }, [id, session, isPending, router]);

  // Handle Book Now button action
  const handleBooking = () => {
    if (isBooked) {
      toast.error("You have already booked this class!");
      return;
    }
    router.push(`/payment/${id}`);
  };

  // Handle Add/Remove Favorite toggle action
  const handleFavorite = async () => {
    if (!session?.user) return;
    const userId = session.user.id;
    
    setActionLoading((prev) => ({ ...prev, fav: true }));
    try {
      if (isFavorite) {
        // FIXED URL: Removed '/api'
        await axios.delete(`http://localhost:5000/favorites?userId=${userId}&classId=${id}`, { withCredentials: true });
        setIsFavorite(false);
        toast.success("Successfully removed from your favorites!");
      } else {
        // FIXED URL: Removed '/api'
        await axios.post(`http://localhost:5000/favorites`, { userId, classId: id }, { withCredentials: true });
        setIsFavorite(true);
        toast.success("Successfully added to your favorites!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setActionLoading((prev) => ({ ...prev, fav: false }));
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#00c896] font-medium">
        <div className="animate-pulse tracking-widest uppercase">Verifying Session & Loading Details...</div>
      </div>
    );
  }

  if (!classData) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-red-500">
        Class details could not be retrieved.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e5e7eb]">
      
      {/* 📸 Hero Banner Section */}
      <div className="relative h-[450px] w-full bg-slate-900">
        <img 
          src={classData.image || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd"} 
          alt={classData.className || classData.name} 
          className="w-full h-full object-cover opacity-40 object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1117] via-transparent to-transparent" />
        
        <div className="absolute bottom-10 left-4 max-w-7xl mx-auto w-full px-6 sm:px-12">
          <div className="flex gap-2 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider bg-red-600/20 text-red-400 px-3 py-1 rounded">
              Cardio
            </span>
            <span className="text-xs font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 px-3 py-1 rounded">
              {classData.category || "Intermediate"}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            {classData.className || classData.name || "Class Title"}
          </h1>
          <p className="text-sm text-gray-400 mt-2">by <span className="text-[#00c896] font-medium">{classData.trainerName || "Expert Trainer"}</span></p>
        </div>
      </div>

      {/* 📊 Main Layout */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#161b27] border border-[#1e2736] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
              📖 About This Class
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {classData.description || "An intense cardio-focused bootcamp designed to challenge endurance, speed, and stamina."}
            </p>
          </div>

          <div className="bg-[#161b27] border border-[#1e2736] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
              ⭐ Class Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#0d1117] border border-[#1e2736] p-4 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">⏱️ Duration</span>
                <span className="text-sm text-white font-semibold">{classData.duration || "N/A"}</span>
              </div>
              <div className="bg-[#0d1117] border border-[#1e2736] p-4 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">📅 Schedule</span>
                <span className="text-xs text-white font-semibold">
                  {Array.isArray(classData.scheduleDays) ? classData.scheduleDays.join(", ") : classData.schedule || "Mon, Wed, Thu"}
                </span>
              </div>
              <div className="bg-[#0d1117] border border-[#1e2736] p-4 rounded-xl">
                <span className="text-xs text-gray-500 uppercase font-bold block mb-1">👥 Enrolled</span>
                <span className="text-sm text-white font-semibold">{classData.bookingCount || 0} students</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#161b27] border border-[#1e2736] p-6 rounded-2xl shadow-xl sticky top-6">
            <div className="mb-6">
              <span className="text-3xl font-black text-[#00c896]">${classData.price}</span>
              <span className="text-xs text-gray-400 block mt-1">per session</span>
            </div>

            <div className="flex gap-4 text-xs text-gray-400 bg-[#0d1117] p-3 rounded-xl border border-[#1e2736] mb-6">
              <span>👤 {classData.bookingCount || 0} booked</span>
              <span>•</span>
              <span>⏱️ {classData.duration || "N/A"}</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleBooking}
                disabled={isBooked}
                className={`w-full py-3 rounded-xl font-bold transition-all duration-300 text-sm cursor-pointer ${
                  isBooked 
                    ? "bg-gray-800 text-gray-500 border border-gray-700 cursor-not-allowed" 
                    : "bg-[#00c896] hover:bg-[#00a87e] text-[#0d1117] shadow-lg shadow-[#00c896]/10"
                }`}
              >
                {isBooked ? "Already Booked" : `Book Now — $${classData.price}`}
              </button>

              <button
                onClick={handleFavorite}
                disabled={actionLoading.fav}
                className={`w-full py-3 rounded-xl font-bold border transition-all duration-300 text-sm cursor-pointer ${
                  isFavorite 
                    ? "bg-transparent border-red-500 text-red-500 hover:bg-red-500/5" 
                    : "bg-transparent border-[#1e2736] text-gray-400 hover:border-[#00c896] hover:text-[#00c896]"
                }`}
              >
                {actionLoading.fav ? "Processing..." : isFavorite ? "❤️ Saved to Favorites" : "🖤 Add to Favorites"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}