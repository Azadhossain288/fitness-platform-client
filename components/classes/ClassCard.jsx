import Link from 'next/link';

export default function ClassCard({ cls }) {
  return (
    <div
      className="bg-surface border border-border rounded-2xl overflow-hidden transition flex flex-col h-full group"
      style={{ transition: 'border-color 0.2s, box-shadow 0.2s' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#00c896';
        e.currentTarget.style.boxShadow = '0 0 24px rgba(0,200,150,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#1e2736';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img
          src={cls.image}
          alt={cls.className}
          className="h-44 w-full object-cover transition duration-300 group-hover:scale-105"
        />
        {/* Category badge */}
        <span
          className="absolute top-3 left-3 text-white text-xs font-bold px-3 py-1 rounded-full"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
        >
          {cls.category}
        </span>
        {/* Booking count */}
        <span className="absolute bottom-3 left-3 bg-black/60 backdrop-blur text-xs text-gray-200 px-2 py-1 rounded-full flex items-center gap-1">
          👤 {cls.bookingCount || 0} booked
        </span>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-1">{cls.className}</h3>
        <p className="text-sm text-gray-400 mb-4">by {cls.trainerName}</p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <span className="text-sm text-gray-400 flex items-center gap-1">
            🕐 {cls.duration}
          </span>
          <span
            className="font-extrabold text-lg"
            style={{
              background: 'linear-gradient(135deg, #00c896, #00a8ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ${cls.price}
          </span>
        </div>

        <Link
          href={`/class-details/${cls._id}`}
          className="mt-4 w-full text-center py-2.5 rounded-lg border border-border font-bold text-sm transition text-gray-300"
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #00c896, #00a8ff)';
            e.currentTarget.style.borderColor = 'transparent';
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.borderColor = '#1e2736';
            e.currentTarget.style.color = '#d1d5db';
          }}
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
