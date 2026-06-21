'use client';

import { motion } from 'framer-motion';

const features = [
  { icon: '🏅', title: 'Certified Trainers', desc: 'All our trainers are internationally certified with years of hands-on experience.' },
  { icon: '🕐', title: 'Flexible Schedules', desc: 'Morning, afternoon, or evening — find a class that fits perfectly into your day.' },
  { icon: '🛡️', title: 'Safe & Supportive', desc: 'A welcoming community where every fitness level is respected and uplifted.' },
  { icon: '🎯', title: 'Goal-Oriented Plans', desc: "Personalized training paths whether you're cutting, bulking, or building endurance." },
  { icon: '💚', title: 'Holistic Wellness', desc: 'Mind and body training integrating nutrition guidance, yoga, and recovery science.' },
  { icon: '📈', title: 'Track Progress', desc: 'Log your sessions, monitor bookings, and celebrate every milestone in your dashboard.' },
];

export default function WhyChooseUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="text-center mb-14">
        <p className="text-lime text-xs font-bold tracking-widest mb-3">WHY CHOOSE US</p>
        <h2 className="text-4xl font-extrabold mb-3">Built for Champions</h2>
        <p className="text-gray-500 max-w-xl mx-auto">
          More than a gym — a complete ecosystem designed to help every athlete train smarter,
          recover faster, and grow stronger.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-lime/40 transition"
          >
            <div className="w-11 h-11 rounded-xl bg-lime/15 text-lime flex items-center justify-center text-xl mb-4">
              {f.icon}
            </div>
            <h3 className="font-bold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
