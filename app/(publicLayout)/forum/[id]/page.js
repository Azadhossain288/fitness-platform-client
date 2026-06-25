'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function ForumPostDetailsPage() {
  const { id } = useParams();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const { data: post, isLoading } = useQuery({
    queryKey: ['forumPost', id],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts/${id}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', id],
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${id}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const voteMutation = useMutation({
    mutationFn: async (type) => {
      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts/vote/${id}`,
        { email: user.email, type },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries(['forumPost', id]),
    onError: () => toast.error('Vote failed'),
  });

  const commentMutation = useMutation({
    mutationFn: async ({ text, parentId = null }) => {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/comments`,
        {
          postId: id,
          text,
          parentId,
          authorName: user.name,
          authorEmail: user.email,
          authorImage: user.image || '',
        },
        { withCredentials: true }
      );
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
      setComment('');
      setReplyTo(null);
      setReplyText('');
    },
    onError: () => toast.error('Failed to post comment'),
  });

  const editMutation = useMutation({
    mutationFn: async ({ commentId, text }) => {
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
        { text, email: user.email },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments', id]);
      setEditingId(null);
    },
    onError: () => toast.error('Edit failed'),
  });

  const deleteMutation = useMutation({
    mutationFn: async (commentId) => {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}?email=${user.email}`,
        { withCredentials: true }
      );
    },
    onSuccess: () => queryClient.invalidateQueries(['comments', id]),
    onError: () => toast.error('Delete failed'),
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="h-80 bg-surface border border-border rounded-2xl animate-pulse mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-surface border border-border rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!post) return <div className="text-center py-24 text-gray-400">Post not found</div>;

  const liked = post.likes?.includes(user?.email);
  const disliked = post.dislikes?.includes(user?.email);
  const topComments = comments.filter((c) => !c.parentId);
  const getReplies = (commentId) => comments.filter((c) => c.parentId === commentId);

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      {/* Hero Image */}
      <div className="relative h-80 rounded-2xl overflow-hidden mb-8">
        <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.8), transparent)' }} />
        <span className="absolute top-4 left-4 bg-black/70 text-xs font-bold px-3 py-1 rounded-full">
          {post.authorRole === 'admin' ? 'Admin' : 'Trainer'}
        </span>
      </div>

      {/* Title + Author */}
      <h1 className="text-3xl font-extrabold mb-3">{post.title}</h1>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
          {post.authorName?.[0]}
        </div>
        <div>
          <p className="text-sm font-semibold">{post.authorName}</p>
          <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-400 leading-relaxed mb-8">{post.description}</p>

      {/* Like / Dislike */}
      <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
        <button
          onClick={() => user ? voteMutation.mutate('like') : toast.error('Login first')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border transition font-semibold text-sm"
          style={liked
            ? { background: 'linear-gradient(135deg, #00c896, #00a8ff)', borderColor: 'transparent', color: 'white' }
            : { borderColor: '#1e2736', color: '#9ca3af' }}
        >
          👍 {post.likes?.length || 0}
        </button>
        <button
          onClick={() => user ? voteMutation.mutate('dislike') : toast.error('Login first')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border transition font-semibold text-sm"
          style={disliked
            ? { background: 'rgba(239,68,68,0.2)', borderColor: '#ef4444', color: '#ef4444' }
            : { borderColor: '#1e2736', color: '#9ca3af' }}
        >
          👎 {post.dislikes?.length || 0}
        </button>
      </div>

      {/* Comments Section */}
      <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

      {/* Add Comment */}
      {user ? (
        <div className="flex gap-3 mb-8">
          <div className="w-9 h-9 rounded-full shrink-0 flex items-center justify-center text-sm font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
            {user.name?.[0]}
          </div>
          <div className="flex-1">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write a comment..."
              rows={3}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 outline-none focus:border-lime text-sm resize-none"
            />
            <button
              onClick={() => comment.trim() && commentMutation.mutate({ text: comment })}
              disabled={!comment.trim()}
              className="mt-2 px-5 py-2 rounded-lg text-sm font-bold text-white disabled:opacity-40"
              style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
            >
              Post Comment
            </button>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-sm mb-8">Please login to comment.</p>
      )}

      {/* Comments List */}
      <div className="space-y-6">
        {topComments.map((c) => (
          <div key={c._id}>
            <CommentItem
              comment={c}
              user={user}
              editingId={editingId}
              editText={editText}
              setEditingId={setEditingId}
              setEditText={setEditText}
              onEdit={(id, text) => editMutation.mutate({ commentId: id, text })}
              onDelete={(id) => deleteMutation.mutate(id)}
              onReply={() => setReplyTo(c._id)}
            />

            {/* Replies */}
            <div className="ml-12 mt-4 space-y-4">
              {getReplies(c._id).map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  user={user}
                  editingId={editingId}
                  editText={editText}
                  setEditingId={setEditingId}
                  setEditText={setEditText}
                  onEdit={(id, text) => editMutation.mutate({ commentId: id, text })}
                  onDelete={(id) => deleteMutation.mutate(id)}
                  isReply
                />
              ))}

              {replyTo === c._id && user && (
                <div className="flex gap-3">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    rows={2}
                    className="flex-1 bg-surface border border-border rounded-xl px-4 py-2 outline-none focus:border-lime text-sm resize-none"
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => replyText.trim() && commentMutation.mutate({ text: replyText, parentId: c._id })}
                      className="px-4 py-2 rounded-lg text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}
                    >
                      Reply
                    </button>
                    <button onClick={() => setReplyTo(null)} className="px-4 py-2 rounded-lg text-xs border border-border text-gray-400">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function CommentItem({ comment, user, editingId, editText, setEditingId, setEditText, onEdit, onDelete, onReply, isReply }) {
  const isOwn = user?.email === comment.authorEmail;
  const isEditing = editingId === comment._id;

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white"
        style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
        {comment.authorName?.[0]}
      </div>
      <div className="flex-1 bg-surface border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-semibold">{comment.authorName}</p>
          <p className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</p>
        </div>

        {isEditing ? (
          <div>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={2}
              className="w-full bg-bg border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-lime resize-none"
            />
            <div className="flex gap-2 mt-2">
              <button onClick={() => onEdit(comment._id, editText)}
                className="px-3 py-1 rounded text-xs font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
                Save
              </button>
              <button onClick={() => setEditingId(null)}
                className="px-3 py-1 rounded text-xs border border-border text-gray-400">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-300">{comment.text}</p>
        )}

        <div className="flex gap-4 mt-3">
          {!isReply && onReply && (
            <button onClick={onReply} className="text-xs text-gray-500 hover:text-lime">
              Reply
            </button>
          )}
          {isOwn && !isEditing && (
            <>
              <button onClick={() => { setEditingId(comment._id); setEditText(comment.text); }}
                className="text-xs text-gray-500 hover:text-lime">
                Edit
              </button>
              <button onClick={() => onDelete(comment._id)}
                className="text-xs text-gray-500 hover:text-red-400">
                Delete
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
