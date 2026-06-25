'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import { authClient } from '@/lib/auth-client';

const categories = ['Cardio', 'Weights', 'Yoga', 'Functional', 'Boxing', 'HIIT', 'Pilates', 'CrossFit'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

export default function AddClassPage() {
  const { data: session } = authClient.useSession();
  const user = session?.user;

  const [form, setForm] = useState({
    className: '', category: '', difficulty: '', duration: '',
    schedule: '', price: '', description: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

  const addMutation = useMutation({
    mutationFn: async () => {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadToImgbb(imageFile);
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/classes`,
        {
          ...form,
          price: parseFloat(form.price),
          image: imageUrl,
          trainerName: user.name,
          trainerEmail: user.email,
          status: 'pending',
        },
        { withCredentials: true }
      );
    },
    onSuccess: () => {
      toast.success('Class submitted for approval!');
      setForm({ className: '', category: '', difficulty: '', duration: '', schedule: '', price: '', description: '' });
      setImageFile(null);
      setPreview('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add class'),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="text-3xl font-extrabold mb-2">Add New Class</h1>
      <p className="text-gray-400 mb-8">Your class will be reviewed by admin before going live.</p>

      <div className="bg-surface border border-border rounded-2xl p-6 space-y-5">
        {/* Image Upload */}
        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">CLASS IMAGE</label>
          {preview && <img src={preview} alt="preview" className="mt-2 h-40 w-full object-cover rounded-xl mb-2" />}
          <input type="file" accept="image/*" onChange={handleImage}
            className="w-full mt-2 text-xs text-gray-400 file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-bg file:border file:border-border file:text-gray-300" />
        </div>

        {[
          { name: 'className', label: 'CLASS NAME', placeholder: 'e.g. Morning HIIT Blast' },
          { name: 'duration', label: 'DURATION', placeholder: 'e.g. 60 min' },
          { name: 'schedule', label: 'SCHEDULE', placeholder: 'e.g. Mon, Wed, Fri - 6:00 AM' },
          { name: 'price', label: 'PRICE ($)', placeholder: 'e.g. 25', type: 'number' },
        ].map((f) => (
          <div key={f.name}>
            <label className="text-xs text-gray-400 font-bold tracking-wide">{f.label}</label>
            <input type={f.type || 'text'} name={f.name} value={form[f.name]} onChange={handleChange}
              placeholder={f.placeholder}
              className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm" />
          </div>
        ))}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 font-bold tracking-wide">CATEGORY</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm">
              <option value="">Select</option>
              {categories.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-400 font-bold tracking-wide">DIFFICULTY</label>
            <select name="difficulty" value={form.difficulty} onChange={handleChange}
              className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm">
              <option value="">Select</option>
              {difficulties.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs text-gray-400 font-bold tracking-wide">DESCRIPTION</label>
          <textarea name="description" value={form.description} onChange={handleChange}
            rows={4} placeholder="Describe your class..."
            className="w-full mt-2 bg-bg border border-border rounded-lg px-4 py-3 outline-none focus:border-lime text-sm resize-none" />
        </div>

        <button
          onClick={() => addMutation.mutate()}
          disabled={addMutation.isPending || !form.className || !form.category}
          className="w-full py-3 rounded-lg font-bold text-white disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #00c896, #00a8ff)' }}>
          {addMutation.isPending ? 'Submitting...' : 'Submit Class'}
        </button>
      </div>
    </div>
  );
}
