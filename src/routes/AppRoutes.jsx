import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import Events from '../pages/Events';
import Gallery from '../pages/Gallery';
import Contact from '../pages/Contact';
import Volunteer from '../pages/Volunteer';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminLayout from '../admin/AdminLayout';
import Dashboard from '../admin/Dashboard';
import ManageEvents from '../admin/ManageEvents';
import ManageGallery from '../admin/ManageGallery';
import ViewMessages from '../admin/ViewMessages';
import ViewVolunteers from '../admin/ViewVolunteers';
import AddEvent from '../admin/AddEvent';

const publicLayout = (children) => (
  <div className="flex min-h-screen flex-col">
    <Navbar />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6">{children}</main>
    <Footer />
  </div>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={publicLayout(<Home />)} />
      <Route path="/events" element={publicLayout(<Events />)} />
      <Route path="/gallery" element={publicLayout(<Gallery />)} />
      <Route path="/contact" element={publicLayout(<Contact />)} />
      <Route path="/volunteer" element={publicLayout(<Volunteer />)} />
      <Route path="/login" element={publicLayout(<Login />)} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="events" element={<ManageEvents />} />
        <Route path="gallery" element={<ManageGallery />} />
        <Route path="messages" element={<ViewMessages />} />
        <Route path="volunteers" element={<ViewVolunteers />} />
        <Route path="events/add" element={<AddEvent />} />
      </Route>

      <Route path="/404" element={publicLayout(<NotFound />)} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}
