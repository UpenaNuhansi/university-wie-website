import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../hooks/useAuth';
import { Icon } from '@iconify/react';

export default function Login() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) { setError('Please enter your email'); return; }
    if (!password.trim()) { setError('Please enter your password'); return; }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/user-not-found')       setError('Email not found');
      else if (err.code === 'auth/wrong-password')  setError('Incorrect password');
      else if (err.code === 'auth/invalid-email')   setError('Invalid email address');
      else                                           setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB] px-4 py-12 font-sans">
      <div className="w-full max-w-[440px] space-y-8">
        
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#A855F7] shadow-lg shadow-purple-100">
            <Icon icon="mdi:lock-outline" className="h-8 w-8 text-white" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">
            Admin Portal
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#111827]">
            Welcome back
          </h1>
          <p className="mt-2 text-[#6B7280]">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-10 shadow-sm">
          {error && (
            <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3">
              <Icon icon="mdi:alert-circle-outline" className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
              <p className="text-sm font-medium text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Address */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                Email Address
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#D1D5DB]">
                  <Icon icon="mdi:email-outline" className="h-5 w-5" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="adminwie@example.com"
                  className="block w-full rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] py-3.5 pl-12 pr-4 text-sm text-[#111827] placeholder-[#D1D5DB] transition-all focus:border-[#A855F7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#D1D5DB]">
                  <Icon icon="mdi:lock-outline" className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Admin123"
                  className="block w-full rounded-xl border border-[#E5E7EB] bg-[#F3F4F6] py-3.5 pl-12 pr-12 text-sm text-[#111827] placeholder-[#D1D5DB] transition-all focus:border-[#A855F7] focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-4 flex items-center text-[#D1D5DB] hover:text-[#9CA3AF]"
                >
                  <Icon icon={showPassword ? "mdi:eye-off-outline" : "mdi:eye-outline"} className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#A855F7] py-3.5 text-sm font-bold text-white shadow-lg shadow-purple-100 transition-all hover:bg-[#9333EA] hover:shadow-xl hover:shadow-purple-200 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  Sign In
                  <Icon icon="mdi:arrow-right" className="h-5 w-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Credentials Info Box */}
        <div className="rounded-2xl border border-[#F3E8FF] bg-[#FAF5FF] px-6 py-4">
          <div className="flex items-start gap-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-[#F3E8FF] text-[#A855F7]">
              <Icon icon="mdi:information-outline" className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#7E22CE]">Credentials</p>
              <p className="mt-1 text-xs text-[#A855F7]">
                Use your Firebase email and password to log in.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}