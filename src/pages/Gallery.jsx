// import { useEffect, useState } from 'react';
// import { getGalleryItems } from '../services/galleryService';

// export default function Gallery() {
//   const [gallery, setGallery] = useState([]);
//   const [filtered, setFiltered] = useState([]);
//   const [activeCategory, setActiveCategory] = useState('All');
//   const [visibleCount, setVisibleCount] = useState(6);

//   useEffect(() => {
//     fetchGallery();
//   }, []);

//   const fetchGallery = async () => {
//     const data = await getGalleryItems();
//     setGallery(data);
//     setFiltered(data);
//   };

//   const handleFilter = (category) => {
//     setActiveCategory(category);

//     if (category === 'All') {
//       setFiltered(gallery);
//     } else {
//       setFiltered(gallery.filter((item) => item.category === category));
//     }

//     setVisibleCount(6);
//   };

//   const categories = ['All', 'WIE Day', 'Hackathons', 'Summits'];

//   return (
//     <section className="bg-[#f3e8f7] px-6 py-16">
//       <div className="mx-auto max-w-7xl">

//         {/* Hero Section */}
//         <div className="text-center">
//           <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
//             Visual Journey
//           </p>
//           <h1 className="mt-3 text-4xl font-bold text-purple-900">
//             Our Community in Action
//           </h1>
//           <p className="mx-auto mt-4 max-w-2xl text-sm text-purple-700">
//             Capturing impactful moments, inspiring events, and brilliant
//             minds that shape our women in STEM community.
//           </p>
//         </div>

//         {/* Filter Buttons */}
//         <div className="mt-10 flex flex-wrap justify-center gap-3">
//           {categories.map((cat) => (
//             <button
//               key={cat}
//               onClick={() => handleFilter(cat)}
//               className={`rounded-full px-5 py-2 text-sm font-medium transition ${
//                 activeCategory === cat
//                   ? 'bg-pink-600 text-white shadow-md'
//                   : 'bg-white text-purple-700 hover:bg-purple-100'
//               }`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Gallery Grid */}
//         <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
//           {filtered.slice(0, visibleCount).map((item) => (
//             <div
//               key={item.id}
//               className="group overflow-hidden rounded-2xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-lg"
//             >
//               <div className="aspect-[4/3] overflow-hidden">
//                 <img
//                   src={item.image}
//                   alt={item.title}
//                   className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
//                 />
//               </div>

//               <div className="p-5">
//                 <h3 className="text-lg font-semibold text-purple-900">
//                   {item.title}
//                 </h3>
//                 <p className="mt-2 text-xs text-gray-500">
//                   {item.createdAt
//                     ? new Date(
//                         item.createdAt.seconds
//                           ? item.createdAt.seconds * 1000
//                           : item.createdAt
//                       ).toLocaleDateString('en-US', {
//                         day: 'numeric',
//                         month: 'short',
//                         year: 'numeric',
//                       })
//                     : ''}
//                 </p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Load More Button */}
//         {visibleCount < filtered.length && (
//           <div className="mt-14 text-center">
//             <button
//               onClick={() => setVisibleCount((prev) => prev + 6)}
//               className="rounded-xl border border-purple-400 px-6 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-700 hover:text-white"
//             >
//               Load More Moments
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }


// pages/Gallery.jsx

import { useEffect, useState } from 'react';
import { getGalleryItems } from '../services/galleryService';
import GalleryCard from '../components/GalleryCard';

const FIXED_CATEGORIES = ['All', 'WIE Day', 'Hackathons', 'Summits'];

export default function Gallery() {
  const [gallery, setGallery]           = useState([]);
  const [filtered, setFiltered]         = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading]           = useState(true);

  useEffect(() => { fetchGallery(); }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const data = await getGalleryItems();
      setGallery(data);
      setFiltered(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Build dynamic category list: fixed ones + any extra categories from DB
  const dynamicCategories = [
    ...FIXED_CATEGORIES,
    ...gallery
      .map((item) => item.category)
      .filter((cat) => cat && !FIXED_CATEGORIES.includes(cat))
      .filter((cat, i, arr) => arr.indexOf(cat) === i), // deduplicate
  ];

  const handleFilter = (category) => {
    setActiveCategory(category);
    setFiltered(category === 'All' ? gallery : gallery.filter((item) => item.category === category));
    setVisibleCount(6);
  };

  return (
    <section className="bg-[#f3e8f7] px-6 py-16">
      <div className="mx-auto max-w-7xl">

        {/* Hero */}
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-purple-500">
            Visual Journey
          </p>
          <h1 className="mt-3 text-4xl font-bold text-purple-900">
            Our Community in Action
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-purple-700">
            Capturing impactful moments, inspiring events, and brilliant minds that
            shape our women in STEM community.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleFilter(cat)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                activeCategory === cat
                  ? 'bg-pink-600 text-white shadow-md'
                  : 'bg-white text-purple-700 hover:bg-purple-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading / Empty / Grid */}
        {loading ? (
          <div className="mt-20 flex justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-200 border-t-purple-600" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-20 text-center">
            <p className="text-sm text-purple-600">No images in this category yet.</p>
          </div>
        ) : (
          <>
            <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.slice(0, visibleCount).map((item) => (
                <GalleryCard key={item.id} item={item} />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="mt-14 text-center">
                <button
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="rounded-xl border border-purple-400 px-6 py-3 text-sm font-semibold text-purple-700 transition hover:bg-purple-700 hover:text-white"
                >
                  Load More Moments
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}