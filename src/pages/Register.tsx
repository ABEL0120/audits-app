import React from 'react';
import { useHistory } from 'react-router-dom';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton } from '@ionic/react';
import './Auth.css';

const RegisterDisabled: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro deshabilitado</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">AA</div>
            <div>
              <h3 className="auth-title">Registro deshabilitado</h3>
              <div className="auth-sub">Solo un supervisor puede crear usuarios técnicos.</div>
            </div>
          </div>

          <div className="auth-form">
            <p className="auth-field">Si necesitas acceso, solicita a tu supervisor que te dé de alta.</p>
            <div className="auth-actions">
              <IonButton onClick={() => history.replace('/login')} expand="block">Volver al inicio</IonButton>
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default RegisterDisabled;
