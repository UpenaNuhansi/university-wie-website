# university-wie-website

Official website for the University (SUSL) WIE Student Chapter.

## Project structure

```text
wie-club-website/
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── assets/
│   │   └── wie-logo.png
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Footer.jsx
│   │   ├── EventCard.jsx
│   │   ├── GalleryCard.jsx
│   │   ├── Button.jsx
│   │   ├── Loader.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Events.jsx
│   │   ├── Gallery.jsx
│   │   ├── Contact.jsx
│   │   ├── Volunteer.jsx
│   │   ├── Login.jsx
│   │   └── NotFound.jsx
│   ├── admin/
│   │   ├── AdminLayout.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ManageEvents.jsx
│   │   ├── ManageGallery.jsx
│   │   ├── ViewMessages.jsx
│   │   ├── ViewVolunteers.jsx
│   │   └── AddEvent.jsx
│   ├── firebase/
│   │   ├── config.js
│   │   ├── auth.js
│   │   ├── firestore.js
│   │   └── storage.js
│   ├── services/
│   │   ├── eventService.js
│   │   ├── galleryService.js
│   │   ├── contactService.js
│   │   └── volunteerService.js
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useFetchEvents.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── validators.js
│   ├── routes/
│   │   └── AppRoutes.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## Why this structure

- `components/`: reusable UI building blocks
- `pages/`: public user-facing pages
- `admin/`: isolated admin dashboard area
- `firebase/`: Firebase setup and instances
- `services/`: data/API logic separated from UI
- `hooks/`: reusable React stateful logic
- `context/`: app-wide shared state (authentication)
- `utils/`: helper functions and validators
- `routes/`: centralized routing configuration
