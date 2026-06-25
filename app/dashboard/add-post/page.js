'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

export default function AddPostPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const [form, setForm] = useState({ title: '', description: '' });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const { data: roleData } = useQuery({
    queryKey: ['userRole', user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/users/role/${user.email}`,
        { withCredentials: true }
      );
      return res.data;
    },
  });

  const role = roleData?.role || 'trainer';

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const uploadToImgbb = async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`,
      { method: 'POST', body: formData }
    );
    const data = await res.json();
    if (!data.success) throw new Error('Image upload failed');
    return data.data.url;
  };

  const postMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadToImgbb(imageFile);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/forum-posts`,
        {
          title: form.title,
          description: form.description,
          image: imageUrl,
          authorName: user.name,
          authorEmail: user.email,
          authorRole: role,
        },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success('Post published!');
      setForm({ title: '', description: '' });
      setImageFile(null);
      setPreview('');
    },
    onError: () => toast.error('Failed to publish post'),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-8">Add Forum Post</h1>
      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">POST IMAGE</label>
          {preview && <img src={preview} alt="preview" className="mt-2 h-40 w-full object-cover rounded-xl mb-2" />}
          <input type="file" accept="image/*" onChange={handleImage}
            className="w-full mt-2 text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-bg file:border file:border-border file:text-gray-300" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">TITLE</label>
          <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Post title..."
            className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm" />
        </div>
        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">DESCRIPTION</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={6} placeholder="Write your post content..."
            className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm resize-none" />
        </div>
        <button onClick={() => postMutation.mutate()}
          disabled={postMutation.isPending || !form.title || !form.description}
          className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
          {postMutation.isPending ? 'Publishing...' : 'Publish Post'}
        </button>
      </div>
    </div>
  );
}
