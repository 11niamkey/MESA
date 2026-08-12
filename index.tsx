import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global fallback: swap any broken/blocked remote image with a local placeholder
// so a failed Unsplash (or other remote) request never leaves an empty slot.
document.addEventListener(
  'error',
  (event) => {
    const target = event.target as HTMLElement | null;
    if (target && target.tagName === 'IMG' && !target.dataset.fallbackApplied) {
      target.dataset.fallbackApplied = 'true';
      (target as HTMLImageElement).src = '/images/mesa_logo_plate.png';
    }
  },
  true
);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
