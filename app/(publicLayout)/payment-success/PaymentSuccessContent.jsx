'use client';

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [saving, setSaving] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const paymentProcessed = useRef(false);

  useEffect(() => {
    if (!saving && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (!saving && countdown === 0) {
      router.push("/dashboard/booked-classes");
    }
  }, [saving, countdown, router]);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");
    const classId = searchParams.get("classId");

    if (!sessionId || !classId) {
      router.push("/dashboard/booked-classes");
      return;
    }

    if (paymentProcessed.current) return;
    paymentProcessed.current = true;

    const paymentInfo = {
      transactionId: sessionId,
      userEmail: searchParams.get("email"),
      classId,
      className: decodeURIComponent(searchParams.get("className") || ""),
      price: parseFloat(searchParams.get("price") || "0"),
    };

    axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/payments`,
      paymentInfo,
      { withCredentials: true }
    )
      .then(() => {
        setSaving(false);
        toast.success("Enrollment Successful!");
      })
      .catch(() => {
        setSaving(false);
        router.push("/dashboard/booked-classes");
      });
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-[#161b27] border border-[#1e2736] p-8 rounded-2xl max-w-md w-full text-center space-y-6 shadow-2xl">
        {saving ? (
          <>
            <div className="w-12 h-12 border-4 border-[#00c896] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h1 className="text-xl font-bold text-gray-300">Verifying Payment...</h1>
            <p className="text-xs text-gray-500">Please do not close or refresh this page.</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-[#00c896]/10 border border-[#00c896] text-[#00c896] rounded-full flex items-center justify-center text-3xl mx-auto animate-bounce">
              ✓
            </div>
            <h1 className="text-2xl font-black text-white">Payment Successful!</h1>
            <p className="text-sm text-gray-400">
              Your enrollment has been processed. Redirecting to your dashboard in{" "}
              <span className="text-[#baff39] font-bold text-lg">{countdown}</span> seconds...
            </p>
            <div className="pt-2">
              <button
                onClick={() => router.push("/dashboard/booked-classes")}
                className="text-xs text-[#00c896] underline hover:text-[#00b084] cursor-pointer"
              >
                Click here if you are not redirected automatically
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}