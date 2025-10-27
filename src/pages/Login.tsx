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
        data.token ||
        data.access_token ||
        (data.data && data.data.token) ||
        null;
      const rawUser = data.user || data.data?.user || { email };
      const user = {
        id: rawUser.id ?? rawUser.user_id ?? 0,
        name: rawUser.name ?? rawUser.full_name ?? rawUser.email ?? email,
        email: rawUser.email ?? email,
        role: rawUser.role ?? rawUser.type ?? undefined,
      };
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

  function triggerTestNotification() {
    try {
      // dispatch the same event UpdateToast listens for
      window.dispatchEvent(new CustomEvent("sw:needs-refresh"));
      console.info("sw:needs-refresh event dispatched (test)");
    } catch (err) {
      console.debug("failed to dispatch test sw event", err);
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
              {/* Puedes comentar o eliminar el botón de notificación de prueba si no es necesario */}
              <IonButton fill="clear" onClick={triggerTestNotification}>
                Probar notificación
              </IonButton>
            </div>
            {error && (
              <div className="auth-error-message">
                <IonText color="danger">{error}</IonText>
              </div>
            )}
            <div className="auth-footer">
              ¿No tienes cuenta? Solicita a tu supervisor que cree tu usuario.
              {/* Ejemplo de un CTA si tuvieras una página de registro/solicitud */}
              {/* <a href="/request-account" className="auth-cta">Solicitar cuenta</a> */}
            </div>
          </form>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
