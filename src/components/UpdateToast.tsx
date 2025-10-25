import React, { useEffect, useState } from 'react';
import { IonIcon } from '@ionic/react';
import { notificationsOutline } from 'ionicons/icons';
import './UpdateToast.css';

const UpdateToast: React.FC = () => {
  const [show, setShow] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    function onNeedRefresh() {
      setShow(true);
    }
    window.addEventListener('sw:needs-refresh', onNeedRefresh as EventListener);
    return () => window.removeEventListener('sw:needs-refresh', onNeedRefresh as EventListener);
  }, []);

  async function doUpdate() {
    try {
      setPending(true);
      // call the update function stored on window by main.tsx
      if (window.__swUpdate) {
        await window.__swUpdate();
      }
      // once updated, reload to activate the new service worker
      window.location.reload();
    } catch (err) {
      // log to console for debugging; keep UI recoverable
      // actual raw errors should be handled by the project's logger elsewhere
  // hide the notification so the user can continue
  console.debug('SW update failed', err);
      setPending(false);
      setShow(false);
    }
  }

  if (!show) return null;

  return (
    <div className="mobile-notification" role="status" aria-live="polite">
      <div className="mobile-notification__icon" aria-hidden>
        <IonIcon icon={notificationsOutline} />
      </div>
      <div className="mobile-notification__body">
        <div className="mobile-notification__title">Actualización disponible</div>
        <div className="mobile-notification__message">Hay una nueva versión lista para instalar.</div>
        <div className="mobile-notification__actions">
          <button
            className="mobile-notification__btn mobile-notification__btn--dismiss"
            onClick={() => setShow(false)}
            type="button"
          >
            Más tarde
          </button>
          <button
            className="mobile-notification__btn mobile-notification__btn--primary"
            onClick={() => doUpdate()}
            type="button"
            disabled={pending}
          >
            {pending ? 'Actualizando...' : 'Actualizar ahora'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateToast;
