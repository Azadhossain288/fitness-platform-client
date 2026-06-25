import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="text-8xl font-extrabold mb-4"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          404
        </div>
        <h1 className="text-3xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/"
          className="inline-block px-8 py-3 rounded-lg font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
          Back to Home
        </Link>
      </div>
    </div>
  );
}
