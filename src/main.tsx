import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';
import { setAuthToken } from './api/auth';
import useAuthStore from './store/auth';

// apply persisted token to axios instance at startup (if any)
try {
  const token = useAuthStore.getState().token;
  if (token) setAuthToken(token);
} catch {
  // ignore
}

// Register the service worker. registerSW returns an update function we could
// expose to the UI if we want to prompt users when a new version is available.
const updateSW = registerSW({
  onOfflineReady() {
    console.info('PWA: offline ready');
  },
  onNeedRefresh() {
    // when a new service worker is waiting, dispatch an event the app can
    // listen to. We also attach the update function to window so UI can
    // call it to apply the update.
    try {
      // store the update function globally for simple access from UI
      window.__swUpdate = updateSW;
    } catch (err) {
      console.debug('pwa: failed to expose sw update fn', err);
    }
    window.dispatchEvent(new CustomEvent('sw:needs-refresh'));
    console.info('PWA: new content is available');
  }
});

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);