import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import ConfirmDialog from '../components/ConfirmDialog';

const navItems = [
  {
    to: '/admin',
    exact: true,
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: 'Dashboard',
  },
  {
    to: '/admin/events',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Manage Events',
  },
  {
    to: '/admin/gallery',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    label: 'Manage Gallery',
  },
  {
    to: '/admin/messages',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    label: 'View Messages',
  },
  {
    to: '/admin/volunteers',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: 'View Volunteers',
  },
  {
    to: '/admin/events/add',
    icon: (
      <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    label: 'Add Event',
    accent: true,
  },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    await logout();
    setShowLogoutDialog(false);
    navigate('/login');
  };

  const isActive = (to, exact = false) => {
    if (exact) return location.pathname === to;
    return location.pathname.startsWith(to) && to !== '/admin';
  };

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] bg-gray-50">

      {/* Sidebar */}
      <aside className="flex flex-col border-r border-gray-100 bg-white">

        {/* Brand */}
        <div className="border-b border-gray-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600 shadow-md shadow-purple-200">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold tracking-tight text-gray-900">WiE Admin</p>
              <p className="text-[11px] text-gray-400">IEEE Student Branch</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5 px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-gray-300">
            Navigation
          </p>
          {navItems.map(({ to, exact, icon, label, accent }) => {
            const active = isActive(to, exact) || (to === '/admin' && location.pathname === '/admin');
            return (
              <Link
                key={to}
                to={to}
                className={`
                  flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150
                  ${active
                    ? 'bg-purple-50 text-purple-700'
                    : accent
                      ? 'border border-dashed border-purple-200 text-purple-500 hover:bg-purple-50 hover:text-purple-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }
                `}
              >
                <span className={active ? 'text-purple-600' : accent ? 'text-purple-400' : 'text-gray-400'}>
                  {icon}
                </span>
                {label}
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-purple-500" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User / Logout */}
        <div className="border-t border-gray-100 p-3">
          <div className="mb-2 flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-600">
              A
            </div>
            <div className="flex-1 min-w-0">
              <p className="truncate text-xs font-semibold text-gray-700">Administrator</p>
              <p className="truncate text-[11px] text-gray-400">WIE · SUSL</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutDialog(true)}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-red-50 hover:text-red-500"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex flex-col overflow-auto">

        {/* Top bar */}
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 px-8 py-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-300">
                {navItems.find(n => isActive(n.to, n.exact) || (n.to === '/admin' && location.pathname === '/admin'))?.label ?? 'Admin Panel'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-semibold text-green-600">
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                Live
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>

      </main>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutDialog}
        title="Sign out?"
        message="You will be logged out from the admin panel."
        confirmText="Sign out"
        cancelText="Stay"
        isDangerous={true}
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </div>
  );
}