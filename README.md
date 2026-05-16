# University WIE Website

Official website for the Sabaragamuwa University of Sri Lanka WIE Student Chapter.

This project is a modern React application built with Vite, Tailwind CSS, and Firebase. It includes public-facing pages for visitors, along with a protected admin dashboard for managing events, gallery items, messages, volunteers, and executive committee content.

## Overview

The website is designed to present the chapter’s activities, showcase events and photo galleries, share committee information, and provide a simple way for students and visitors to get in touch or register interest in volunteering.

## Features

- Responsive public website for desktop and mobile users
- Home page with chapter highlights and calls to action
- About, Events, Gallery, Contact, Volunteer, and Executive Committee pages
- Event details page for viewing individual event information
- Protected admin area for managing website content
- Firebase integration for authentication, database, and file storage
- Reusable UI components and service layer for cleaner code organization
- Styled with Tailwind CSS for fast, consistent UI development

## Screenshots

Add your page screenshots here. A simple approach is to place them in a folder such as `docs/screenshots/` and link them below.

### Home Page

![Home page screenshot](docs/screenshots/HomePageMobile.png)

![Home page screenshot](docs/screenshots/HomePageDesktop.png)


### About Page

![About page screenshot](docs/screenshots/about.png)

### Events Page

![Events page screenshot](docs/screenshots/events.png)

### Event Details Page

![Event details page screenshot](docs/screenshots/event-details.png)

### Gallery Page

![Gallery page screenshot](docs/screenshots/gallery.png)

### Contact Page

![Contact page screenshot](docs/screenshots/contact.png)

### Volunteer Page

![Volunteer page screenshot](docs/screenshots/volunteer.png)

### Executive Committee Page

![Executive committee page screenshot](docs/screenshots/excom.png)

### Admin Dashboard

![Admin dashboard screenshot](docs/screenshots/admin-dashboard.png)

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- ESLint

## Project Structure

```text
university-wie-website/
├── public/
├── src/
│   ├── admin/
│   ├── assets/
│   ├── components/
│   ├── context/
│   ├── firebase/
│   ├── hooks/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── tailwind.config.js
├── postcss.config.js
├── vite.config.js
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A Firebase project configured for this application

### Installation

1. Clone the repository.
2. Install dependencies:

```bash
npm install
```

3. Set up your Firebase environment variables or config values in the appropriate files under `src/firebase/`.
4. Start the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - start the Vite development server
- `npm run build` - create a production build
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint on the source files

## Firebase Configuration

The app relies on Firebase for authentication and backend data storage. Before deploying or running admin features, make sure your Firebase project is configured with:

- Authentication enabled for admin sign-in
- Firestore collections for events, gallery items, messages, and volunteers
- Storage enabled for media uploads

## Folder Guide

- `src/components/`: reusable UI elements
- `src/pages/`: public pages shown to website visitors
- `src/admin/`: admin dashboard pages and management tools
- `src/firebase/`: Firebase initialization and helpers
- `src/services/`: data access and business logic
- `src/hooks/`: custom React hooks
- `src/context/`: shared application state
- `src/routes/`: application routing
- `src/utils/`: helper functions and validators

## Contributing

If you plan to extend the site, keep UI components reusable and move data access logic into the service layer when possible. That keeps page components focused on presentation and makes the codebase easier to maintain.

## License

This project is maintained for the University WIE Student Chapter. Add your preferred license text here if you want to publish it publicly.
