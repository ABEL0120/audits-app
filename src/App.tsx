// src/App.tsx

import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
// 1. Importa la función 'addIcons'
import { addIcons } from "ionicons";
// 2. Importa TODOS los iconos que usarás en la app.
import {
  settingsOutline,
  readerOutline,
  home,
  documentTextOutline, // <- ESTE ES EL ICONO DEL ERROR
  // ¡Añade cualquier otro icono que uses aquí!
} from "ionicons/icons";
import Dashboard from "./pages/Dashboard";
import Audits from "./pages/Audits";
import Tab3 from "./pages/Settings";
import Login from "./pages/Login";
import useAuthStore from "./store/auth";
import UpdateToast from "./components/UpdateToast";

/* Imports de CSS... */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";
import "./theme/variables.css";

setupIonicReact();

// 3. Registra los iconos globalmente para que estén disponibles sin conexión
//    Esto resuelve el error "Could not load icon".
addIcons({
  "settings-outline": settingsOutline,
  "reader-outline": readerOutline,
  home: home,
  "document-text-outline": documentTextOutline,
});

const App: React.FC = () => {
  const token = useAuthStore((s: { token: string | null }) => s.token);

  return (
    <IonApp>
      <IonReactRouter>
        <UpdateToast />
        <IonTabs>
          <IonRouterOutlet>
            {/* ... Tus rutas se mantienen igual ... */}
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/Dashboard">
              {token ? <Dashboard /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/Audits">
              {token ? <Audits /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/audits">
              {token ? <Audits /> : <Redirect to="/login" />}
            </Route>
            <Route path="/audits/:id">
              {token ? <Audits /> : <Redirect to="/login" />}
            </Route>
            <Route path="/Settings">
              {token ? <Tab3 /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/">
              <Redirect to="/Dashboard" />
            </Route>
          </IonRouterOutlet>
          {token && (
            <IonTabBar slot="bottom">
              <IonTabButton tab="Dashboard" href="/Dashboard">
                <IonIcon aria-hidden="true" icon={home} />
                <IonLabel>Inicio</IonLabel>
              </IonTabButton>
              <IonTabButton tab="Audits" href="/Audits">
                <IonIcon aria-hidden="true" icon={readerOutline} />
                <IonLabel>Auditorías</IonLabel>
              </IonTabButton>
              <IonTabButton tab="Settings" href="/Settings">
                <IonIcon aria-hidden="true" icon={settingsOutline} />
                <IonLabel>Configuración</IonLabel>
              </IonTabButton>
            </IonTabBar>
          )}
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
