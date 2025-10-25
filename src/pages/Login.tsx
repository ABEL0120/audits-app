import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  IonPage,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  InputCustomEvent,
  InputChangeEventDetail,
  IonText,
  IonSpinner,
} from "@ionic/react";
import { loginApi, setAuthToken } from "../api/auth";
import { logError } from "../utils/logger";
import messages from "../config/messages.json";
import useAuthStore from "../store/auth";
import "./Auth.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useAuthStore((s) => s.login);
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await loginApi(email, password);
      const token =
        data.token || data.access_token || (data.data && data.data.token) || null;
      const user = data.user || data.data?.user || { email };
      if (!token) throw new Error("Token no recibido desde el servidor");
      // set axios default header for following requests
      setAuthToken(token);
      login(token, user);
      history.replace("/Dashboard");
    } catch (err: unknown) {
      // log raw error for later diagnosis
      logError(err, { location: "Login.onSubmit", email });
      // show a friendly, non-technical message to the user
      setError(messages.auth.login_failed || messages.auth.default_error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen={true} className="ion-padding auth-page">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">AA</div>
            <div>
              <h3 className="auth-title">Bienvenido de nuevo</h3>
              <div className="auth-sub">Ingresa para continuar a tu panel</div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="auth-form">
            <div className="auth-field">
              <IonItem>
                <IonLabel position="stacked">Email</IonLabel>
                <IonInput
                  value={email}
                  onIonChange={(e: InputCustomEvent<InputChangeEventDetail>) =>
                    setEmail(e.detail.value ?? "")
                  }
                  type="email"
                  required
                />
              </IonItem>
            </div>

            <div className="auth-field">
              <IonItem>
                <IonLabel position="stacked">Contraseña</IonLabel>
                <IonInput
                  value={password}
                  onIonChange={(e: InputCustomEvent<InputChangeEventDetail>) =>
                    setPassword(e.detail.value ?? "")
                  }
                  type="password"
                  required
                />
              </IonItem>
            </div>

            <div className="auth-actions">
              <IonButton type="submit" expand="block" disabled={loading}>
                {loading ? (
                  <>
                    <IonSpinner name="crescent" />
                    &nbsp;Entrando...
                  </>
                ) : (
                  "Entrar"
                )}
              </IonButton>
            </div>
            {error && (
              <div style={{ marginTop: 12 }}>
                <IonText color="danger">{error}</IonText>
              </div>
            )}
            <div className="auth-footer">
              ¿No tienes cuenta? Solicita a tu supervisor que cree tu usuario.
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
