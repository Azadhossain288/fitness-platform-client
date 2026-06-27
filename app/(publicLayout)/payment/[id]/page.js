"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import axiosSecure from "@/lib/axios"; 
import Image from "next/image";

export default function PaymentPage() {
  const { id: classId } = useParams();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      toast.error("Please login to proceed with the payment.");
      router.push("/login");
      return;
    }

    
    axiosSecure.get(`/classes/${classId}`)
      .then((res) => {
        setClassData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching class:", err);
        toast.error("Failed to load order summary.");
        setLoading(false);
      });
  }, [classId, session, isPending, router]);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      
      const response = await axiosSecure.post("/payments/create-checkout-session", {
        className: classData.className,
        price: classData.price,
        classId: classData._id,
        userEmail: session.user.email,
      });

      if (response.data.url) {
        window.location.href = response.data.url; 
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      toast.error("Failed to initiate payment.");
      setProcessing(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#00c896]">
        <div className="animate-pulse tracking-widest uppercase">Loading Order Summary...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e5e7eb] py-12">
      <div className="max-w-5xl mx-auto px-6">
        <button onClick={() => router.back()} className="text-sm text-gray-400 hover:text-white mb-6 flex items-center gap-1 cursor-pointer">
          ← Back to Class
        </button>

        <h1 className="text-3xl font-black text-white mb-2">Complete Booking</h1>
        <p className="text-xs text-gray-400 mb-8">Review your order details below and proceed to our secure Stripe checkout.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* order summary */}
          <div className="bg-[#161b27] border border-[#1e2736] p-6 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-white border-b border-[#1e2736] pb-3">Order Summary</h3>
            <div className="flex gap-4">
              <div className="relative w-24 h-20">
                <Image src={classData.image} alt={classData.className} fill className="object-cover rounded-xl border border-[#1e2736]" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">{classData.className}</h4>
                <p className="text-xs text-gray-400 mt-1">Trainer: <span className="text-[#00c896]">{classData.trainerName}</span></p>
              </div>
            </div>
            <div className="pt-4 border-t border-[#1e2736] flex justify-between items-center">
              <span className="text-sm text-gray-400">Total Due</span>
              <span className="text-2xl font-black text-[#00c896]">${classData.price}</span>
            </div>
          </div>

          <div className="bg-[#161b27] border border-[#1e2736] p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-white border-b border-[#1e2736] pb-3 mb-6">Payment Method</h3>
            <p className="text-sm text-gray-400 mb-6">You will be redirected to Stripe to complete your purchase securely.</p>
            
            <button 
              onClick={handleCheckout} 
              disabled={processing}
              className="w-full py-3 rounded-xl font-bold bg-[#baff39] text-[#0d1117] hover:bg-[#a6e62d] transition-all"
            >
              {processing ? "Redirecting..." : `Proceed to Checkout — $${classData.price}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}