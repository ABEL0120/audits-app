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
import { settingsOutline, readerOutline, home } from "ionicons/icons";
import Dashboard from "./pages/Dashboard";
import Audits from "./pages/Audits";
import Tab3 from "./pages/Tab3";
import Login from "./pages/Login";
import useAuthStore from "./store/auth";
import UpdateToast from "./components/UpdateToast";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => {
  const token = useAuthStore((s: { token: string | null }) => s.token);

  return (
    <IonApp>
      <IonReactRouter>
        <UpdateToast />
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/login">
              <Login />
            </Route>
            {/* registration is disabled: users must be created by a supervisor */}

            {/* Protected routes */}
            <Route exact path="/Dashboard">
              {token ? <Dashboard /> : <Redirect to="/login" />}
            </Route>
            <Route exact path="/Audits">
              {token ? <Audits /> : <Redirect to="/login" />}
            </Route>
            {/* accept lowercase routes as well (links may use /audits/1) */}
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
