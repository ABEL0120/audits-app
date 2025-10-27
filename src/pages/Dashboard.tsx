import React from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonLabel,
  IonButton,
  IonIcon,
  IonFab,
  IonFabButton,
  IonItem,
  IonList,
  IonBadge,
} from "@ionic/react";
import {
  add,
  checkmarkDoneCircleOutline,
  chevronForwardOutline,
  // calendarOutline, // Example icon for due date - keep if you want to use it
  // documentTextOutline, // Example icon for audit - keep if you want to use it
  // clipboardOutline, // Another example icon - keep if you want to use it
} from "ionicons/icons";
import "./Dashboard.css";

interface Audit {
  id: number;
  title: string;
  due: string;
  status: "PENDIENTE" | "EN PROCESO";
  icon: string; // Dynamic icon for each audit
}

interface CompletedAudit {
  id: number;
  title: string;
  date: string;
}

// Data is now empty, ready for API consumption
const userData = { name: "", avatarUrl: "" };
const pendingAudits: Audit[] = [];
const completedAudits: CompletedAudit[] = [];

const PendienteCard: React.FC<{ audit: Audit }> = ({ audit }) => (
  <IonCard className={`dark-card`}>
    <div className="dark-card-header">
      <IonIcon icon={audit.icon} className="dark-icon" />
      <div>
        <h2>{audit.title}</h2>
        <p>{audit.due}</p>
      </div>
    </div>
    <div className="dark-card-footer">
      <IonBadge color={audit.status === "PENDIENTE" ? "warning" : "primary"}>
        {audit.status}
      </IonBadge>
      <IonButton fill="clear" size="small" routerLink={`/audits/${audit.id}`}>
        {audit.status === "PENDIENTE" ? "Empezar Auditoría" : "Continuar"}
        <IonIcon icon={chevronForwardOutline} slot="end" />
      </IonButton>
    </div>
  </IonCard>
);

const Dashboard: React.FC = () => {
  return (
    <IonPage>
      <IonHeader translucent={true}>
        <IonToolbar className="dark-toolbar">
          <IonTitle className="toolbar-title">Dashboard</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen className="dark-bg ion-padding">
        <div className="hero-dark">
          <div className="hero-info">
            <p>Hola</p>
            <h1>{userData.name || "Bienvenido"}</h1>
          </div>
          {userData.avatarUrl ? (
            <img
              src={userData.avatarUrl}
              alt="avatar"
              className="hero-avatar"
            />
          ) : (
            <div className="hero-avatar-placeholder" />
          )}
        </div>

        <h2 className="section-title">Auditorías por Hacer</h2>

        {pendingAudits.length === 0 ? (
          <div className="empty-state">
            <h4>No hay auditorías pendientes</h4>
            <p>Cuando se creen auditorías aparecerán aquí.</p>
          </div>
        ) : (
          pendingAudits.map((a) => <PendienteCard key={a.id} audit={a} />)
        )}

        <div className="completed-section">
          <details>
            <summary className="completed-summary">
              <span>Ver finalizadas</span>
              <IonIcon icon={chevronForwardOutline} />
            </summary>
            {completedAudits.length === 0 ? (
              <div className="empty-state small">
                No hay auditorías finalizadas
              </div>
            ) : (
              <IonList lines="none" className="completed-list">
                {completedAudits.map((audit) => (
                  <IonItem key={audit.id} className="completed-item">
                    <IonIcon
                      icon={checkmarkDoneCircleOutline}
                      slot="start"
                      color="success"
                    />
                    <IonLabel>
                      <h3>{audit.title}</h3>
                      <p>{audit.date}</p>
                    </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            )}
          </details>
        </div>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton color="primary" routerLink="/new-audit">
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;
