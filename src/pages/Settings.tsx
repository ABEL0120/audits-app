import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonSpinner,
  IonItem,
  IonLabel,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Settings.css";
import { useHistory } from "react-router-dom";
import { logoutApi, setAuthToken } from "../api/auth";
import useAuthStore from "../store/auth";
import React, { useState } from "react";

const Settings: React.FC = () => {
  const history = useHistory();
  const logout = useAuthStore((s) => s.logout);
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      // attempt server logout; if it fails we'll still clear local auth
      await logoutApi();
    } catch (err) {
      // ignore server errors; still clear client state
      console.debug("logout failed", err);
    } finally {
      // clear axios auth header and client store
      setAuthToken(null);
      logout();
      setLoading(false);
      history.replace("/login");
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Configuración</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Configuración</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div style={{ padding: 16 }}>
          <ExploreContainer name="Ajustes y preferencias" />

          <IonItem lines="none" style={{ marginTop: 20 }}>
            <IonLabel>Sesión</IonLabel>
          </IonItem>

          <div style={{ padding: 16 }}>
            <IonButton color="danger" onClick={onLogout} disabled={loading}>
              {loading ? (
                <>
                  <IonSpinner name="crescent" />&nbsp;Cerrando sesión...
                </>
              ) : (
                "Cerrar sesión"
              )}
            </IonButton>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Settings;
