import { Link } from 'react-router-dom';

export default function Navbar() {
  const links = [
    ['/', 'Home'],
    ['/events', 'Events'],
    ['/gallery', 'Gallery'],
    ['/contact', 'Contact'],
    ['/volunteer', 'Volunteer']
  ];

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <span className="font-semibold">WIE Club</span>
        {links.map(([to, label]) => (
          <Link key={to} to={to}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
