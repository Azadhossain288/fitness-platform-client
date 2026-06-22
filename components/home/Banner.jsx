'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const stats = [
  { value: '12,000+', label: 'Active Members' },
  { value: '150+', label: 'Expert Trainers' },
  { value: '80+', label: 'Classes Available' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Banner() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">

      {/* ── Background gradients (reference style) ── */}
      {/* Bottom center teal glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at bottom, rgba(0,200,150,0.18) 0%, rgba(0,120,255,0.1) 40%, transparent 70%)' }}
      />
      {/* Top-right blue glow */}
      <div className="absolute -top-20 right-0 w-[500px] h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at top right, rgba(59,130,246,0.12) 0%, transparent 65%)' }}
      />
      {/* Left edge subtle glow */}
      <motion.div
        animate={{ opacity: [0.06, 0.14, 0.06] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 -left-32 -translate-y-1/2 w-96 h-96 pointer-events-none rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,200,150,0.2) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* ── Left: Text ── */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.p variants={fadeUp} className="text-gray-400 text-sm mb-4 tracking-wide">
              Premium fitness & training platform.
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight mb-5"
            >
              Train smarter,{' '}
              <span
                style={{ background: 'linear-gradient(135deg, #00c896 0%, #00a8ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
              >
                get stronger
              </span>{' '}
              every day.
            </motion.h1>

            <motion.p variants={fadeUp} className="text-gray-400 leading-relaxed mb-8 max-w-md">
              Join IronPulse — book expert-led classes, track your progress, and grow with a
              community that pushes you beyond your limits.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/all-classes"
                  className="px-7 py-3.5 rounded-lg font-bold text-sm text-white inline-block"
                  style={{ background: 'linear-gradient(135deg, #00c896 0%, #00a8ff 100%)' }}
                >
                  Explore Classes
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="px-7 py-3.5 rounded-lg bg-surface border border-border font-bold text-sm hover:border-lime transition inline-block"
                >
                  Join Free →
                </Link>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={fadeUp} className="grid grid-cols-4 gap-2">
              {stats.map((s, i) => (
                <div key={s.label} className={i !== 0 ? 'border-l border-border pl-4' : ''}>
                  <p className="font-extrabold text-xl leading-none"
                    style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 leading-tight">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: 4-photo collage with glow frame ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* Glow behind images */}
            <div className="absolute inset-0 rounded-3xl pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at center, rgba(0,200,150,0.12) 0%, rgba(0,168,255,0.08) 50%, transparent 75%)' }}
            />

            <div className="grid grid-cols-5 grid-rows-2 gap-3 h-[28rem] relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="col-span-3 row-span-2 rounded-2xl overflow-hidden relative"
                style={{ boxShadow: '0 0 30px rgba(0,200,150,0.1)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700"
                  alt="gym"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.7) 0%, transparent 60%)' }}
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 row-span-1 rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(0,168,255,0.08)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600"
                  alt="training"
                  className="w-full h-full object-cover"
                />
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
                className="col-span-2 row-span-1 rounded-2xl overflow-hidden"
                style={{ boxShadow: '0 0 20px rgba(0,200,150,0.08)' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600"
                  alt="yoga"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>

            {/* Floating live badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -7, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 1 },
                y: { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.3 },
              }}
              className="absolute -bottom-4 left-4 rounded-xl px-4 py-3 flex items-center gap-3 z-10 border border-border"
              style={{ background: 'rgba(22,27,39,0.95)', backdropFilter: 'blur(12px)' }}
            >
              <span className="w-9 h-9 rounded-full flex items-center justify-center text-base"
                style={{ background: 'rgba(0,200,150,0.15)', color: '#00c896' }}>
                🔥
              </span>
              <div>
                <p className="text-sm font-bold leading-none">Live Now</p>
                <p className="text-xs text-gray-500 mt-1">24 classes running</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
