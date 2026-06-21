import Link from 'next/link';

export default function PostCard({ post }) {
  const shortDescription =
    post.description?.length > 100 ? post.description.slice(0, 100) + '...' : post.description;

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-lime/40 transition flex flex-col h-full">
      <div className="relative">
        <img src={post.image} alt={post.title} className="h-44 w-full object-cover" />
        <span className="absolute top-3 left-3 bg-black/70 text-xs font-bold px-3 py-1 rounded-full">
          {post.authorRole === 'admin' ? 'Admin' : 'Trainer'}
        </span>
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-lg mb-3 leading-snug">{post.title}</h3>
        <p className="text-sm text-gray-500 flex-1">{shortDescription}</p>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-border text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-lime/20 text-lime flex items-center justify-center font-bold">
              {post.authorName?.[0] || 'A'}
            </span>
            {post.authorName}
          </div>
          <div className="flex items-center gap-3">
            <span>👍 {post.likes?.length || 0}</span>
            <span>💬 {post.commentCount || 0}</span>
          </div>
        </div>

        <Link
          href={`/forum/${post._id}`}
          className="mt-4 w-full text-center py-2.5 rounded-lg bg-bg border border-border font-bold text-sm hover:border-lime hover:text-lime transition"
        >
          Read More
        </Link>
      </div>
    </div>
  );
}
