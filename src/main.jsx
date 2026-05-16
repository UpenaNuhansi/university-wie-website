import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import favicon from './assets/logo/logo-2.png';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);

// Set favicon to bundled logo so it works in both dev and production builds
try {
  const setFavicon = (url) => {
    const link = document.querySelector("link[rel~='icon']") || document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = url;
    if (!document.querySelector("link[rel~='icon']")) document.head.appendChild(link);
  };
  setFavicon(favicon);
} catch (e) {
  // noop - if document isn't available (e.g. server) ignore
}
