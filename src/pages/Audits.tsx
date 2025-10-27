import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonBadge,
  IonIcon,
} from "@ionic/react";
import {
  checkmarkCircleOutline,
  timerOutline,
  documentTextOutline,
  alertCircleOutline,
} from "ionicons/icons";

import "./Audits.css";
import AuditDetail from "../components/AuditDetail";
import { listAudits, AuditsListResponse, AuditItem } from "../api/audits";

type ApiState = {
  loading: boolean;
  error: string | null;
  audits: AuditItem[];
  page: number;
};

const Audits: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const id = params.id ? Number(params.id) : undefined;

  const getStatusProps = (status: string) => {
    switch (status) {
      case "completed":
        return { color: "success", icon: checkmarkCircleOutline };
      case "in_progress":
        return { color: "warning", icon: timerOutline };
      case "draft":
        return { color: "medium", icon: documentTextOutline };
      default:
        return { color: "danger", icon: alertCircleOutline };
    }
  };

  // Traduce etiquetas de estado a español (casos comunes)
  const statusLabel = (status?: string) => {
    if (!status) return "Desconocido";
    const s = status.toLowerCase();
    switch (s) {
      case "submitted":
        return "Enviado";
      case "in_progress":
      case "inprogress":
        return "En progreso";
      case "completed":
        return "Completado";
      case "draft":
        return "Borrador";
      case "pending":
        return "Pendiente";
      default:
        return s.charAt(0).toUpperCase() + s.slice(1);
    }
  };

  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
    audits: [],
    page: 1,
  });

  useEffect(() => {
    if (id) return;
    let mounted = true;
    async function load() {
      setState((s) => ({ ...s, loading: true, error: null }));
      try {
        const data: AuditsListResponse = await listAudits(state.page);
        if (!mounted) return;
        setState((s) => ({ ...s, audits: data.data, loading: false }));
      } catch {
        if (!mounted) return;
        setState((s) => ({
          ...s,
          error: "No se pudieron cargar las auditorías",
          loading: false,
        }));
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [id, state.page]);
  if (id) {
    // Renderiza la vista de detalle de auditoría si hay un ID
    return (
      <IonPage className="dark-theme">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle de Auditoría</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="audit-detail-content">
          {" "}
          {/* Eliminado ion-padding aquí para controlarlo desde CSS */}
          <AuditDetail auditId={id} />
        </IonContent>
      </IonPage>
    );
  }

  // Renderiza la lista de auditorías si no hay ID
  return (
    <IonPage className="dark-theme">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis Auditorías</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen className="ion-padding audits-list-view">
        {" "}
        {/* Añadido ion-padding y audits-list-view */}
        {state.loading ? (
          <div className="empty-state">
            <h3>Cargando auditorías...</h3>
          </div>
        ) : state.error ? (
          <div className="empty-state">
            <h3>{state.error}</h3>
            <p>Intenta recargar la aplicación o verifica tu conexión.</p>
          </div>
        ) : state.audits.length === 0 ? (
          <div className="empty-state">
            <h3>No hay auditorías disponibles</h3>
            <p>Cuando se creen auditorías aparecerán aquí.</p>
          </div>
        ) : (
          <IonGrid className="audits-list-grid">
            <IonRow>
              {state.audits.map((a) => {
                const { color, icon } = getStatusProps(a.status || "");
                return (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={a.id}>
                    <IonCard
                      className="audit-list-card"
                      routerLink={`/audits/${a.id}`}
                    >
                      <div className="audit-list-content">
                        <div>
                          <div className="audit-list-code">{a.audit_code}</div>
                          <div className="audit-list-title">{a.summary}</div>
                          <div className="audit-list-meta">
                            Línea: {a.line?.name || a.line?.code} — Técnico:{" "}
                            {a.technician?.name}
                          </div>
                        </div>
                        <IonBadge className="audit-list-badge" color={color}>
                          <IonIcon icon={icon} slot="start" /> {statusLabel(a.status)}
                        </IonBadge>
                      </div>
                    </IonCard>
                  </IonCol>
                );
              })}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
    );
  };

  export default Audits;
