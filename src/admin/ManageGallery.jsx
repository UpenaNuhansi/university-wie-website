import { useEffect, useRef, useState } from 'react';
import {
  getGalleryItems,
  deleteGalleryItem,
  addGalleryItem,
  compressImage,
} from '../services/galleryService';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';
import ConfirmDialog from '../components/ConfirmDialog';

const FIXED_CATEGORIES = ['WIE Day', 'Hackathons', 'Summits', 'Other'];

export default function ManageGallery() {
  const [gallery, setGallery]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deleting, setDeleting]   = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState(0);
  const [showForm, setShowForm]   = useState(false);
  const [dragOver, setDragOver]   = useState(false);
  const [preview, setPreview]     = useState(null);   // local object URL for preview
  const [imageFile, setImageFile] = useState(null);   // raw File object
  const [confirmImageId, setConfirmImageId] = useState(null);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    category: 'WIE Day',
    customCategory: '',
  });
  const { showToast } = useNotification();

  useEffect(() => { fetchGallery(); }, []);

  // Revoke object URL on unmount / change to avoid memory leaks
  useEffect(() => {
    return () => { if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview); };
  }, [preview]);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setGallery(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ── file helpers ────────────────────────────────────────────────────────
  const applyFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setImageFile(file);
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(URL.createObjectURL(file));
  };

  const handleFileChange = (e) => applyFile(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    applyFile(e.dataTransfer.files[0]);
  };

  const clearImage = () => {
    setImageFile(null);
    if (preview && preview.startsWith('blob:')) URL.revokeObjectURL(preview);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // ── submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const resolvedCategory =
      formData.category === 'Other'
        ? formData.customCategory.trim() || 'Other'
        : formData.category;

    if (!formData.title.trim()) { showToast('Please enter a title', 'error'); return; }
    if (!imageFile)              { showToast('Please select an image', 'error'); return; }

    try {
      setUploading(true);
      setProgress(0);

      // 1. Compress image in browser → base64
      const base64 = await compressImage(imageFile, setProgress);

      // 2. Save base64 + metadata to Firestore
      setProgress(98);
      await addGalleryItem({
        title:    formData.title.trim(),
        image:    base64,
        category: resolvedCategory,
      });

      setProgress(100);
      setFormData({ title: '', category: 'WIE Day', customCategory: '' });
      clearImage();
      setShowForm(false);
      await fetchGallery();
    } catch (error) {
      console.error(error);
      showToast('Failed to add image. The file may be too large — try a smaller image.', 'error');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async (id) => {
    try {
      setDeleting(id);
      await deleteGalleryItem(id);
      setGallery((prev) => prev.filter((item) => item.id !== id));
    } catch {
      showToast('Delete failed', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const requestDelete = (id) => {
    setConfirmImageId(id);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;
    setConfirmImageId(null);
  };

  const confirmDelete = async () => {
    if (!confirmImageId) return;
    await handleDelete(confirmImageId);
    setConfirmImageId(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setFormData({ title: '', category: 'WIE Day', customCategory: '' });
    clearImage();
  };

  if (loading) return <Loader />;

  // ── derived stats ───────────────────────────────────────────────────────
  const addedThisMonth = gallery.filter((i) => {
    if (!i.createdAt) return false;
    const d = new Date(i.createdAt.seconds ? i.createdAt.seconds * 1000 : i.createdAt);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  const topCategory = Object.entries(
    gallery.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {})
  ).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  // ── render ──────────────────────────────────────────────────────────────
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
          onClick={() => (showForm ? handleCloseForm() : setShowForm(true))}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d={showForm ? 'M6 18L18 6M6 6l12 12' : 'M12 4v16m8-8H4'} />
          </svg>
          {showForm ? 'Cancel' : 'Add Image'}
        </button>
      </div>

      {/* Add Image Form */}
      {showForm && (
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">

          {/* Form header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Add New Image</p>
              <p className="text-xs text-gray-400">
                Image is compressed &amp; saved directly to Firestore · keep files under 5 MB
              </p>
            </div>
          </div>

          <div className="space-y-5">

            {/* Title + Category row */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Community Cleanup 2024"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value, customCategory: '' })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 transition focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                >
                  {FIXED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Custom category */}
            {formData.category === 'Other' && (
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                  Custom Category Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Workshops, Outreach, Awards…"
                  value={formData.customCategory}
                  onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-300 transition focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100"
                />
              </div>
            )}

            {/* Drop-zone / Preview */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest text-gray-300">Image</label>

              {preview ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200">
                  <img src={preview} alt="Preview" className="h-52 w-full object-cover" />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg bg-white/90 px-3 py-1.5 text-xs font-semibold text-gray-700 backdrop-blur-sm hover:bg-white"
                      >
                        Replace
                      </button>
                      <button
                        type="button"
                        onClick={clearImage}
                        className="rounded-lg bg-red-500/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="ml-auto truncate text-[11px] text-white/70">{imageFile?.name}</p>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 transition-all ${
                    dragOver
                      ? 'border-purple-400 bg-purple-50'
                      : 'border-gray-200 bg-gray-50 hover:border-purple-300 hover:bg-purple-50/50'
                  }`}
                >
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl transition-colors ${
                    dragOver ? 'bg-purple-100 text-purple-500' : 'bg-gray-100 text-gray-400'
                  }`}>
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">
                      {dragOver ? 'Drop it here!' : 'Click to upload or drag & drop'}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">PNG, JPG, WEBP · max 5 MB recommended</p>
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Progress bar */}
            {uploading && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-gray-400">
                    {progress < 95 ? 'Compressing image…' : 'Saving to Firestore…'}
                  </p>
                  <p className="text-xs font-bold text-purple-600">{progress}%</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 pt-1">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {progress < 95 ? `Compressing… ${progress}%` : 'Saving…'}
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
                type="button"
                onClick={handleCloseForm}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-500 transition hover:border-gray-300 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="h-1.5 w-8 rounded-full bg-amber-500 opacity-30" />
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-amber-700">{gallery.length}</p>
          <p className="mt-1 text-xs font-medium text-gray-400">Total Images</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="h-1.5 w-8 rounded-full bg-teal-500 opacity-30" />
          </div>
          <p className="mt-4 text-3xl font-bold tracking-tight text-teal-700">{addedThisMonth}</p>
          <p className="mt-1 text-xs font-medium text-gray-400">Added This Month</p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div className="h-1.5 w-8 rounded-full bg-purple-500 opacity-30" />
          </div>
          <p className="mt-4 truncate text-xl font-bold tracking-tight text-purple-700">{topCategory}</p>
          <p className="mt-1 text-xs font-medium text-gray-400">Top Category</p>
        </div>
      </div>

      {/* Gallery Grid / Empty State */}
      {gallery.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-amber-400">
            <svg className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="mt-4 text-sm font-semibold text-gray-700">No images yet</p>
          <p className="mt-1 text-xs text-gray-400">Upload your first photo to get started</p>
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((item) => (
              <div
                key={item.id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-gray-100"
              >
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
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-800">{item.title}</p>
                      <p className="mt-0.5 text-[11px] text-gray-400">
                        {item.createdAt
                          ? new Date(
                              item.createdAt.seconds
                                ? item.createdAt.seconds * 1000
                                : item.createdAt
                            ).toLocaleDateString('en-US', {
                              day: 'numeric', month: 'short', year: 'numeric',
                            })
                          : 'No date'}
                      </p>
                    </div>
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-semibold text-amber-600">
                      {item.category ?? 'Uncategorized'}
                    </span>
                  </div>

                  <button
                    onClick={() => requestDelete(item.id)}
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
                          <path strokeLinecap="round" strokeLinejoin="round"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

      <ConfirmDialog
        isOpen={Boolean(confirmImageId)}
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous
        onCancel={closeDeleteDialog}
        onConfirm={confirmDelete}
      />
    </div>
  );
}