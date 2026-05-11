import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="grid min-h-screen grid-cols-[220px_1fr]">
      <aside className="border-r bg-white p-4">
        <h2 className="mb-3 font-semibold">Admin</h2>
        <nav className="space-y-1 text-sm">
          <Link className="block" to="/admin">Dashboard</Link>
          <Link className="block" to="/admin/events">Manage Events</Link>
          <Link className="block" to="/admin/gallery">Manage Gallery</Link>
          <Link className="block" to="/admin/messages">View Messages</Link>
          <Link className="block" to="/admin/volunteers">View Volunteers</Link>
          <Link className="block" to="/admin/events/add">Add Event</Link>
        </nav>
      </aside>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}
