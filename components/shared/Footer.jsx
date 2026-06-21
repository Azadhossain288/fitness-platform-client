import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 text-xl font-extrabold mb-3">
            <span className="w-8 h-8 rounded-lg bg-lime/20 text-lime flex items-center justify-center">⚡</span>
            Iron<span className="text-lime">Pulse</span>
          </div>
          <p className="text-sm text-gray-500 leading-relaxed">
            Elevate your body, mind, and spirit with premium trainers, classes, and community
            support at IronPulse.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-wide mb-4">QUICK LINKS</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link href="/" className="hover:text-lime">Home</Link></li>
            <li><Link href="/all-classes" className="hover:text-lime">All Classes</Link></li>
            <li><Link href="/forum" className="hover:text-lime">Community Forum</Link></li>
            <li><Link href="/login" className="hover:text-lime">Portal Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-wide mb-4">CONTACT US</h4>
          <ul className="space-y-3 text-sm text-gray-400">
            <li>📍 Zindabazar, Sylhet, Bangladesh</li>
            <li>📞 +880 1628893299</li>
            <li>✉️ azadhossain016288@gmail.com</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-sm tracking-wide mb-4">STAY UPDATED</h4>
          <p className="text-sm text-gray-500 mb-4">
            Subscribe to get expert fitness tips, workout guides, and announcements.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter email"
              className="flex-1 bg-surface border border-border rounded-l-lg px-3 py-2 text-sm outline-none focus:border-lime"
            />
            <button className="bg-lime text-bg px-4 rounded-r-lg font-bold text-sm">→</button>
          </div>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© {new Date().getFullYear()} IronPulse. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" aria-label="X" className="hover:text-lime">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-lime">📷</a>
            <a href="#" aria-label="Youtube" className="hover:text-lime">▶️</a>
            <a href="#" aria-label="Facebook" className="hover:text-lime">📘</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
