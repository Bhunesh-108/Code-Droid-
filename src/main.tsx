import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Register Service Worker for offline PWA functionality & mobile home-screen install
if ('serviceWorker' in navigator && (import.meta.env.PROD || !import.meta.env.DEV)) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch((err) => {
      console.warn('SW registration note:', err);
    });
  });
}

createRoot(document.getElementById('root')!).render(<App />);

