import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { updateEvent, getEventById } from '../services/eventService';
import { compressImage } from '../services/galleryService';
import Loader from '../components/Loader';
import { useNotification } from '../context/NotificationContext';

export default function EditEvent() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    description: '',
    image: '',
    comingSoon: false,
    youtubeLink: '',
    facebookLink: '',
    registrationEnabled: false,
    registrationType: 'google',
    registrationLabel: 'Register Now',
    registrationLink: '',
  });
  const [imageItems, setImageItems] = useState([]);
  const { showToast } = useNotification();

  useEffect(() => {
    fetchEvent();
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const data = await getEventById(eventId);
      
      // Format date for date input
      let formattedDate = '';
      if (data.date) {
        const d = new Date(data.date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        formattedDate = `${year}-${month}-${day}`;
      }

      const fallbackStartTime = data.date
        ? (() => {
            const d = new Date(data.date);
            if (Number.isNaN(d.getTime())) return '';
            return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
          })()
        : '';

      setFormData({
        title: data.title || '',
        date: formattedDate,
        startTime: data.startTime || fallbackStartTime,
        endTime: data.endTime || '',
        location: data.location || '',
        description: data.description || '',
        image: data.image || '',
        comingSoon: data.comingSoon ?? false,
        youtubeLink: data.youtubeLink || '',
        facebookLink: data.facebookLink || '',
        registrationEnabled: data.registrationEnabled ?? Boolean(data.allowRegister || data.registrationLink || data.registerLink),
        registrationType: data.registrationType || ((data.registrationLink || data.registerLink || '').includes('docs.google.com') ? 'google' : 'custom'),
        registrationLabel: data.registrationLabel || (((data.registrationLink || data.registerLink || '').includes('docs.google.com')) ? 'Open Google Form' : 'Register Now'),
        registrationLink: data.registrationLink || data.registerLink || '',
      });
      const eventImages = Array.isArray(data.images) && data.images.length ? data.images : data.image ? [data.image] : [];
      setImageItems(
        eventImages.map((preview, index) => ({
          id: `existing-${index}-${preview.slice(0, 24)}`,
          preview,
          file: null,
        }))
      );
      setError('');
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const readers = files.map(
      (file, index) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve({
              id: `new-${Date.now()}-${index}-${file.name}`,
              file,
              preview: reader.result,
            });
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(readers).then((newItems) => {
      setImageItems((prev) => [...prev, ...newItems]);
    });

    e.target.value = '';
  };

  const removeImage = (id) => {
    setImageItems((prev) => prev.filter((item) => item.id !== id));
    if (imageItems.length <= 1) {
      const input = document.getElementById('image-input');
      if (input) input.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.title.trim()) return setError('Event title is required.');
    if (!formData.comingSoon) {
      if (!formData.date) return setError('Date is required.');
      if (!formData.description.trim()) return setError('Description is required.');
      if (!imageItems.length) return setError('At least one event image is required.');
    } else {
      if (!formData.description.trim()) return setError('Description is required for coming soon events.');
    }
    if (formData.registrationEnabled && !formData.registrationLink.trim()) {
      return setError('Registration link is required when registration is enabled.');
    }

    try {
      setSaving(true);
      setProgress(0);
      const imageUrls = [];
      for (let index = 0; index < imageItems.length; index += 1) {
        const item = imageItems[index];
        if (item.file) {
          const imageBase64 = await compressImage(item.file, (fileProgress) => {
            const overallProgress = Math.round(((index + (fileProgress / 100)) / imageItems.length) * 100);
            setProgress(overallProgress);
          });
          imageUrls.push(imageBase64);
        } else {
          imageUrls.push(item.preview);
        }
      }

      const payload = {
        title: formData.title,
        description: formData.description,
        image: imageUrls[0] || '',
        images: imageUrls,
        youtubeLink: formData.youtubeLink.trim() || '',
        facebookLink: formData.facebookLink.trim() || '',
        registrationEnabled: formData.registrationEnabled,
        registrationType: formData.registrationType,
        registrationLabel: formData.registrationLabel.trim() || (formData.registrationType === 'google' ? 'Open Google Form' : 'Register Now'),
        registrationLink: formData.registrationEnabled ? formData.registrationLink.trim() : '',
        comingSoon: Boolean(formData.comingSoon),
      };

      if (!formData.comingSoon && formData.date) {
        const [year, month, day] = formData.date.split('-').map(Number);
        const eventDate = new Date(year, month - 1, day);
        payload.date = eventDate;
        if (formData.startTime) payload.startTime = formData.startTime;
        if (formData.endTime) payload.endTime = formData.endTime;
        if (formData.location && formData.location.trim()) payload.location = formData.location.trim();
      }

      await updateEvent(eventId, payload);
      showToast('Event updated successfully!', 'success');
      navigate('/admin/events');
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    } finally {
      setSaving(false);
      setProgress(0);
    }
  };

  const inputClass =
    'mt-1.5 block w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 transition-all duration-150 focus:border-purple-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-100';

  const labelClass = 'block text-xs font-semibold uppercase tracking-widest text-gray-400';

  if (loading) return <Loader />;

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
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">Edit Event</h1>
              <p className="text-sm text-gray-400">Update event details</p>
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

              {/* Coming Soon toggle */}
              <div className="flex items-center justify-end">
                <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700">
                  <input
                    type="checkbox"
                    name="comingSoon"
                    checked={formData.comingSoon}
                    onChange={handleChange}
                    className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-200"
                  />
                  Mark as Coming Soon (no date/time/location)
                </label>
              </div>

              {/* Date + Time + Location row */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
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
                      Update the registration form or disable it for this event.
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

              {/* Social Links */}
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <p className="text-sm font-semibold text-gray-700">Event Links (optional)</p>
                <p className="text-xs text-gray-400 mb-3">Add social links for this event — shown when there is no registration.</p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>YouTube Link</label>
                    <input
                      type="url"
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                      placeholder="https://youtube.com/..."
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Facebook Link</label>
                    <input
                      type="url"
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleChange}
                      placeholder="https://facebook.com/..."
                      className={inputClass}
                    />
                  </div>
                </div>
              </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className={labelClass}>Event Images</label>
                <div className="mt-1.5 space-y-3">
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
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
                          {imageItems.length ? `${imageItems.length} image${imageItems.length > 1 ? 's' : ''} selected` : 'Click to upload or drag and drop'}
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                      </div>
                    </label>
                  </div>
                  {progress > 0 && progress < 100 && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  )}
                  {imageItems.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {imageItems.map((item, index) => (
                        <div key={item.id} className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <img src={item.preview} alt={`Preview ${index + 1}`} className="h-32 w-full object-cover" />
                          <div className="absolute left-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                            {index === 0 ? 'Cover' : `Image ${index + 1}`}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(item.id)}
                            className="absolute right-2 top-2 rounded-full bg-red-500 p-1.5 text-white shadow-lg shadow-red-200 transition hover:bg-red-600"
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
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
                  disabled={saving}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-purple-100 transition-all duration-150 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/events')}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-all duration-150 hover:border-gray-300 hover:bg-gray-50 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
