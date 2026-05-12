import { useState } from 'react';
import { submitContactMessage } from '../services/contactService';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!form.message.trim()) {
      setError('Message is required');
      return;
    }

    try {
      setLoading(true);
      await submitContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || '',
        message: form.message.trim(),
      });
      setForm({ name: '', email: '', phone: '', message: '' });
      setSubmitted(true);
      
      // Reset success message after 5 seconds
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('Error submitting message:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
        <p className="text-gray-600 mb-6">Get in touch with IEEE WIE SUSL</p>

        {submitted && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-start">
              <svg
                className="h-5 w-5 text-green-600 mt-0.5 mr-3"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-green-800">Message sent successfully!</p>
                <p className="text-sm text-green-700 mt-1">We'll get back to you shortly.</p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Phone (Optional)
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Your phone number"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Message *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              placeholder="Write your message here..."
              rows="5"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-500 py-2 text-white font-medium hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <p className="text-xs text-gray-500 text-center mt-4">
          * Required fields
        </p>
      </div>
    </div>
  );
}
