import { Suspense } from 'react';
import PaymentSuccessContent from './PaymentSuccessContent';

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-[#00c896]">
        <div className="animate-pulse tracking-widest uppercase">Loading...</div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  );
}