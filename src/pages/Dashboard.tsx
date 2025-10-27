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
import useAuthStore from "../store/auth";
import { listAudits, AuditItem } from "../api/audits";
import { useEffect, useState } from "react";

interface Audit {
  id: number;
  title: string;
  due: string;
  status: string;
  icon: string; // Dynamic icon for each audit
}

interface CompletedAudit {
  id: number;
  title: string;
  date: string;
}

const completedAudits: CompletedAudit[] = [];

// Helper to map API audit item to our simple Audit interface
function mapApiToAudit(a: AuditItem): Audit {
  return {
    id: a.id,
    title: a.summary || a.audit_code,
    due: a.started_at || "",
    status: a.status || "PENDIENTE",
    icon: "documentTextOutline",
  } as Audit;
}

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
  const userData = useAuthStore((s) => s.user);
  const [pendingAudits, setPendingAudits] = useState<Audit[]>([]);

  function getInitials(name?: string | null) {
    if (!name) return "";
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return "";
    const first = parts[0].charAt(0);
    const second = parts.length > 1 ? parts[1].charAt(0) : "";
    return (first + second).toUpperCase();
  }

  useEffect(() => {
    let mounted = true;
    async function loadPending() {
      if (!userData || !userData.id) return;

      try {
        const res = await listAudits(1);
        if (!mounted) return;
        const items = res.data
          .filter((a) => a.technician?.id === userData.id)
          .filter((a) => {
            // consider pending if assignment is 'assigned' or audit not submitted/completed
            const asg = a.assignment?.status;
            const s = a.status?.toLowerCase();
            return (
              asg === "assigned" ||
              (s && s !== "submitted" && s !== "completed")
            );
          })
          .map(mapApiToAudit);
        setPendingAudits(items);
      } catch (e) {
        // ignore errors for now; keep pendingAudits empty
        console.debug("failed to load pending audits", e);
      }
    }
    loadPending();
    return () => {
      mounted = false;
    };
  }, [userData]);
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
            <h1>{userData?.name ?? "Bienvenido"}</h1>
          </div>
          {userData && userData.name ? (
            <div className="hero-avatar-initials" aria-hidden>
              {getInitials(userData.name)}
            </div>
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
