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

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('MESA UI ErrorBoundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-gray-50 border border-gray-200 rounded-3xl p-8 space-y-4 shadow-lg">
            <h1 className="text-2xl font-black text-orange-600">Qualcosa è andato storto</h1>
            <p className="text-sm text-gray-600 font-medium">
              Si è verificato un imprevisto durante il caricamento dell'applicazione. Ricarica la pagina per continuare.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-orange-600 hover:bg-black text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all"
            >
              Ricarica MESA
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
