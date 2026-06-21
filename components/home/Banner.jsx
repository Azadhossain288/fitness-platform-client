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
  hidden: { opacity: 0, y: 22 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

export default function Banner() {
  return (
    <section className="relative overflow-hidden">
      <motion.div
        animate={{ opacity: [0.2, 0.35, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-lime/10 rounded-full blur-[120px] pointer-events-none"
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-20 relative">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.1 } } }}
          >
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full bg-lime/10 border border-lime/30 text-lime text-xs font-bold tracking-wide"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-lime" />
              PREMIUM FITNESS PLATFORM
            </motion.span>

            <motion.h1
              variants={fadeUp}
              className="text-5xl md:text-6xl font-extrabold leading-[1.08] tracking-tight mb-6"
            >
              Forge Your <span className="text-lime">Strongest</span> Self.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-gray-400 max-w-md leading-relaxed mb-9"
            >
              Join IronPulse — where certified trainers, dynamic classes, and a driven
              community push you beyond your limits every single day.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4 mb-14">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/all-classes"
                  className="px-7 py-3.5 rounded-lg bg-lime text-bg font-bold text-sm hover:bg-limeDark transition inline-block shadow-[0_0_0_0_rgba(212,245,72,0)] hover:shadow-[0_0_24px_2px_rgba(212,245,72,0.25)]"
                >
                  ⚡ Explore Classes
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/register"
                  className="px-7 py-3.5 rounded-lg bg-surface border border-border font-bold text-sm hover:border-lime hover:text-lime transition inline-block"
                >
                  Join Free →
                </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={fadeUp} className="grid grid-cols-4 gap-2">
              {stats.map((s, i) => (
                <div key={s.label} className={`${i !== 0 ? 'border-l border-border pl-4' : ''}`}>
                  <p className="text-lime font-extrabold text-xl leading-none">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-2 leading-tight">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: refined 4-photo collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid grid-cols-5 grid-rows-2 gap-4 h-[28rem]"
          >
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.4 }} className="col-span-3 row-span-2 relative rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700" alt="gym" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-bg/70 via-transparent to-transparent" />
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.4 }} className="col-span-2 row-span-1 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600" alt="training" className="w-full h-full object-cover" />
            </motion.div>

            <motion.div whileHover={{ scale: 1.04 }} transition={{ duration: 0.4 }} className="col-span-2 row-span-1 rounded-2xl overflow-hidden">
              <img src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600" alt="lifting" className="w-full h-full object-cover" />
            </motion.div>

            {/* floating badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: [0, -8, 0] }}
              transition={{
                opacity: { duration: 0.5, delay: 0.9 },
                y: { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.2 },
              }}
              className="absolute -bottom-5 left-4 bg-surface/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 z-10"
            >
              <span className="w-9 h-9 rounded-full bg-lime/20 text-lime flex items-center justify-center text-base">
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
