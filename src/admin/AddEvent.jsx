import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addEvent } from '../services/eventService';
import { compressImage } from '../services/galleryService';
import { useNotification } from '../context/NotificationContext';

export default function AddEvent() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const { showToast } = useNotification();
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    image: '',
    registrationEnabled: false,
    registrationType: 'google',
    registrationLabel: 'Register Now',
    registrationLink: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) return setError('Event title is required.');
    if (!formData.date) return setError('Date & time is required.');
    if (!formData.location.trim()) return setError('Location is required.');
    if (!formData.description.trim()) return setError('Description is required.');
    if (!imageFile) return setError('Event image is required.');
    if (formData.registrationEnabled && !formData.registrationLink.trim()) {
      return setError('Registration link is required when registration is enabled.');
    }

    try {
      setLoading(true);
      setProgress(0);
      let imageBase64 = '';
      if (imageFile) {
        imageBase64 = await compressImage(imageFile, setProgress);
      }

      await addEvent({
        title: formData.title,
        date: new Date(formData.date),
        location: formData.location,
        description: formData.description,
        image: imageBase64,
        registrationEnabled: formData.registrationEnabled,
        registrationType: formData.registrationType,
        registrationLabel: formData.registrationLabel.trim() || (formData.registrationType === 'google' ? 'Open Google Form' : 'Register Now'),
        registrationLink: formData.registrationEnabled ? formData.registrationLink.trim() : '',
      });
      showToast('Event added successfully!', 'success');
      navigate('/admin/events');
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to add event. Please try again.');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const inputClass =
    'mt-1.5 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-150 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100';

  const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-gray-400';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/events')}
            className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400 transition hover:text-purple-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Events
          </button>
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-600 shadow-lg shadow-purple-200">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">New Event</h1>
              <p className="text-sm text-gray-400">Fill in the details to publish a new event</p>
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl shadow-gray-100">

          {/* Purple top accent bar */}
          <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-400 to-purple-600" />

          <div className="p-8">
            {error && (
              <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5 text-sm text-red-600">
                <svg className="mt-0.5 h-4 w-4 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
                {error}
              </div>
            )}

            <div className="space-y-6">

              {/* Title */}
              <div>
                <label className={labelClass}>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Women in Engineering Conference"
                  className={inputClass}
                />
              </div>

              {/* Date + Location row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Date & Time</label>
                  <input
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Engineering Building, Room 101"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Write a detailed description of the event..."
                  className={inputClass + ' resize-none leading-relaxed'}
                />
              </div>

              {/* Registration */}
              <div className="rounded-2xl border border-purple-100 bg-purple-50/50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900">Registration Settings</h2>
                    <p className="mt-1 text-xs text-gray-500">
                      Enable this for events that need a Google Form or a custom registration form link.
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      name="registrationEnabled"
                      checked={formData.registrationEnabled}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-200"
                    />
                    Registration required
                  </label>
                </div>

                {formData.registrationEnabled && (
                  <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Form Type</label>
                      <select
                        name="registrationType"
                        value={formData.registrationType}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="google">Google Form</option>
                        <option value="custom">Custom Registration Form</option>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Button Label</label>
                      <input
                        type="text"
                        name="registrationLabel"
                        value={formData.registrationLabel}
                        onChange={handleChange}
                        placeholder={formData.registrationType === 'google' ? 'Open Google Form' : 'Register Now'}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Registration Link</label>
                      <input
                        type="url"
                        name="registrationLink"
                        value={formData.registrationLink}
                        onChange={handleChange}
                        placeholder="Paste your Google Form or custom form URL"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className={labelClass}>Event Image</label>
                <div className="mt-1.5 space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="image-input"
                    />
                    <label
                      htmlFor="image-input"
                      className="flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 px-4 py-6 cursor-pointer transition hover:border-purple-400 hover:bg-purple-50"
                    >
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="text-center">
                        <p className="text-sm font-medium text-gray-700">
                          {imageFile ? imageFile.name : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    </label>
                  </div>
                  {progress > 0 && progress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  {imagePreview && (
                    <div className="relative rounded-lg overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Preview" className="h-32 w-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                          document.getElementById('image-input').value = '';
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-100" />

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all duration-150 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Publishing...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      Publish Event
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/events')}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-500 transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700 active:scale-95"
                >
                  Cancel
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-4 text-center text-xs text-gray-300">
          Published events will appear publicly on the WiE website
        </p>

      </div>
    </div>
  );
}