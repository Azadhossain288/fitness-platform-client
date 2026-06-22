// app/dashboard/page.js
export default function OverviewPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">User Dashboard</h1>
      
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b27] p-6 rounded-xl border border-[#1e2736]">
          <h3 className="text-gray-400">Total Booked Classes</h3>
          <p className="text-4xl font-bold mt-2">2</p>
        </div>
        <div className="bg-[#161b27] p-6 rounded-xl border border-[#1e2736]">
          <h3 className="text-gray-400">Total Favorites</h3>
          <p className="text-4xl font-bold mt-2">1</p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-[#161b27] p-6 rounded-xl border border-[#1e2736]">
        <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
          <div>
            <p className="font-bold">User Name</p>
            <p className="text-sm text-gray-400">user@ironpulse.com</p>
            <span className="bg-[#00c896]/20 text-[#00c896] text-xs px-2 py-1 rounded">Member</span>
          </div>
        </div>
      </div>
    </div>
  );
}