import { useEffect, useState } from 'react';
import { getGalleryItems, deleteGalleryItem, addGalleryItem } from '../services/galleryService';
import Loader from '../components/Loader';

export default function ManageGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', image: '' });

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setGallery(data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddImage = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      alert('Please fill in all fields');
      return;
    }
    try {
      setUploading(true);
      await addGalleryItem({ title: formData.title, image: formData.image });
      setFormData({ title: '', image: '' });
      setShowForm(false);
      await fetchGallery();
    } catch (error) {
      console.error('Error adding image:', error);
      alert('Failed to add image');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      setDeleting(itemId);
      await deleteGalleryItem(itemId);
      setGallery((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting image:', error);
      alert('Failed to delete image');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-8">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Manage Gallery</h1>
          <p className="mt-0.5 text-sm text-gray-400">
            {gallery.length} image{gallery.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {/* Add Image Form */}
      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Add New Image</p>
              <p className="text-xs text-gray-400">Paste a URL to add an image to the gallery</p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">Title</label>
              <input
                type="text"
                placeholder="e.g. Community Cleanup 2024"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-colors focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">Image URL</label>
              <input
                type="url"
                placeholder="https://example.com/photo.jpg"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition-colors focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
              />
            </div>
          </div>

          {/* URL Preview */}
          {formData.image && (
            <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
              <img
                src={formData.image}
                alt="Preview"
                className="h-40 w-full object-cover"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={handleAddImage}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Adding…
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                  Add to Gallery
                </>
              )}
            </button>
            <button
              onClick={() => { setShowForm(false); setFormData({ title: '', image: '' }); }}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-500 transition-all hover:border-gray-300 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="h-1.5 w-8 rounded-full bg-amber-500 opacity-30" />
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-amber-700">{gallery.length}</p>
          <p className="mt-1 text-xs font-medium text-gray-400">Total Images</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="h-1.5 w-8 rounded-full bg-purple-500 opacity-30" />
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-purple-700">
            {gallery.filter((i) => i.image).length}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-400">With Image</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="h-1.5 w-8 rounded-full bg-teal-500 opacity-30" />
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-teal-700">
            {gallery.filter((i) => {
              if (!i.createdAt) return false;
              const d = new Date(i.createdAt);
              const now = new Date();
              return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
            }).length}
          </p>
          <p className="mt-1 text-xs font-medium text-gray-400">Added This Month</p>
        </div>
      </div>

      {/* Gallery Grid */}
      {gallery.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-700">No images yet</p>
          <p className="mt-1 text-xs text-gray-400">Add your first image to get started</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Image
          </button>
        </div>
      ) : (
        <>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">Gallery</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md hover:shadow-gray-100"
              >
                {/* Image */}
                <div className="aspect-video overflow-hidden bg-gray-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-300">
                      <svg className="h-10 w-10" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {item.createdAt
                          ? new Date(item.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'No date'}
                      </p>
                    </div>
                    <span className="inline-flex flex-shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      Active
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(item.id)}
                    disabled={deleting === item.id}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-100 bg-red-50 py-2 text-[11px] font-semibold text-red-500 transition-all hover:border-red-200 hover:bg-red-100 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {deleting === item.id ? (
                      <>
                        <svg className="h-3 w-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                        </svg>
                        Deleting…
                      </>
                    ) : (
                      <>
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}