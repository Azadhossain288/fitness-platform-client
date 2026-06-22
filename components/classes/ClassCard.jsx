import Link from 'next/link';

export default function ClassCard({ cls }) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden transition flex flex-col h-full hover:border-[#00c896]/50" style={{ boxShadow: '0 0 0 0 transparent' }} onMouseEnter={e => e.currentTarget.style.boxShadow='0 0 20px rgba(0,200,150,0.08)'} onMouseLeave={e => e.currentTarget.style.boxShadow='none'}>
      <div className="relative">
        <img src={cls.image} alt={cls.className} className="h-44 w-full object-cover" />
        <span className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
          {cls.category}
        </span>
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-xs text-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
          👤 {cls.bookingCount || 0} booked
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-1">{cls.className}</h3>
        <p className="text-sm text-gray-400 mb-3">by {cls.trainerName}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="text-sm text-gray-400 flex items-center gap-1">
            🕐 {cls.duration}
          </div>
          <p className="font-bold" style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>${cls.price}</p>
        </div>

        <Link
          href={`/classes/${cls._id}`}
          
          className="mt-4 w-full text-center py-2.5 rounded-lg border border-border font-bold text-sm transition hover:text-white hover:border-transparent"
style={{ ':hover': {} }}
onMouseEnter={e => e.currentTarget.style.background='linear-gradient(135deg, #00c896, #00a8ff)'}
onMouseLeave={e => e.currentTarget.style.background='transparent'}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
