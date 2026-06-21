import Link from 'next/link';

export default function MembershipCTA() {
  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <div className="bg-surface border border-border rounded-3xl text-center py-16 px-8 relative overflow-hidden">
        <div className="w-12 h-12 rounded-xl bg-lime/15 text-lime flex items-center justify-center text-2xl mx-auto mb-6">
          🔥
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Ready to <span className="text-lime">Ignite</span> Your Journey?
        </h2>
        <p className="text-gray-500 max-w-xl mx-auto mb-8 leading-relaxed">
          Join thousands of members who transformed their bodies and lives with IronPulse. Your
          first class is a booking away.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-lime text-bg font-bold hover:bg-limeDark transition"
          >
            Start Free Today
          </Link>
          <Link
            href="/all-classes"
            className="px-6 py-3 rounded-lg bg-bg border border-border font-bold hover:border-lime transition"
          >
            Browse Classes
          </Link>
        </div>
      </div>
    </section>
  );
}
