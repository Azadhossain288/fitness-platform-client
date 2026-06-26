"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import axiosSecure from "@/lib/axios"; 
import Image from "next/image";

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
   
    if (isPending || !id) return;

    const fetchData = async () => {
      try {
        const classRes = await axiosSecure.get(`/classes/${id}`);
        setClassData(classRes.data);

       
        if (session?.user?.email) {
          const email = session.user.email;
          const [enrollRes, favRes] = await Promise.all([
            axiosSecure.get(`/bookings/check-enrollment`, { params: { email, classId: id } }),
            axiosSecure.get(`/favorites/check/${id}`, { params: { email } })
          ]);
          setIsEnrolled(enrollRes.data.enrolled);
          setIsFavorite(favRes.data.isFavorite);
        }
      } catch (err) {
        console.error("Fetch Error:", err);
       
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, session?.user?.email, isPending]); 

  const handleFavorite = async () => {
    if (!session?.user) {
      toast.error("Please login to bookmark!");
      router.push("/login");
      return;
    }
    
    setActionLoading(true);
    try {
      if (isFavorite) {
        await axiosSecure.delete(`/favorites/${id}`, { params: { email: session.user.email } });
        setIsFavorite(false);
        toast.success("Removed from favorites!");
      } else {
        await axiosSecure.post(`/favorites`, { 
          email: session.user.email,
          userEmail: session.user.email,
          classId: id,
          className: classData.className,
          image: classData.image,
          price: classData.price,
          trainerName: classData.trainerName,
        });
        setIsFavorite(true);
        toast.success("Added to favorites!");
      }
    } catch (err) {
      toast.error("Action failed.");
    } finally {
      setActionLoading(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#00c896]">
        <div className="animate-pulse tracking-widest uppercase">Loading Details...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e5e7eb] pb-20">
      {/* Hero Section */}
      <div className="relative h-[400px] w-full bg-slate-900">
        <Image 
     src={classData?.image || "/placeholder.jpg"} 
     alt={classData?.className || "Class"} 
     fill 
     priority
     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
     className="object-cover opacity-50"
     onError={(e) => {
    e.currentTarget.src = "/placeholder.jpg"; 
  }}
/>
        <div className="absolute bottom-10 left-0 w-full px-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-5xl font-black text-white">{classData?.className}</h1>
            <p className="text-[#00c896] mt-2 font-medium text-xl">by {classData?.trainerName}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#161b27] p-8 rounded-2xl border border-[#1e2736]">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">📖 About This Class</h2>
            <p className="text-gray-400 leading-relaxed">{classData?.description}</p>
          </div>

          <div className="bg-[#161b27] p-8 rounded-2xl border border-[#1e2736]">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">⭐ Class Details</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div><p className="text-gray-500 text-xs uppercase">Duration</p><p className="text-white font-medium">{classData?.duration}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Schedule</p><p className="text-white font-medium">{classData?.schedule}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Category</p><p className="text-white font-medium">{classData?.category}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Difficulty</p><p className="text-white font-medium">{classData?.difficulty}</p></div>
              <div><p className="text-gray-500 text-xs uppercase">Trainer</p><p className="text-white font-medium">{classData?.trainerName}</p></div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="bg-[#161b27] p-6 rounded-2xl border border-[#1e2736] h-fit sticky top-6">
          <div className="text-4xl font-bold text-white mb-2">${classData?.price}</div>
          <p className="text-gray-500 mb-6">per session</p>
          <div className="space-y-4">
            {isEnrolled ? (
              <button disabled className="w-full py-3 rounded-lg bg-gray-800 text-green-600 cursor-not-allowed font-bold">Already Booked</button>
            ) : (
              <button onClick={() => router.push(`/payment/${id}`)} className="w-full py-3 rounded-lg bg-[#baff39] text-[#0d1117] font-bold hover:bg-[#a6e62d] transition">Book Now — ${classData?.price}</button>
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