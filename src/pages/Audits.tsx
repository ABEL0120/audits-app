import React from "react";
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
  IonIcon, // Añadido para iconos en badges
} from "@ionic/react";
import {
  checkmarkCircleOutline, // Icono para estado 'completed'
  timerOutline, // Icono para estado 'in_progress'
  documentTextOutline, // Icono para estado 'draft'
  alertCircleOutline, // Icono para error o pendiente
} from "ionicons/icons"; // Importar iconos de Ionicons

import "./Audits.css";
import { MOCK_AUDITS } from "../data/mockData"; // Mantener mock data para la lista de ejemplo
import AuditDetail from "../components/AuditDetail";

const Audits: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const id = params.id ? Number(params.id) : undefined;

  // Función para obtener el color e icono del badge según el estado
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

  if (id) {
    // Renderiza la vista de detalle de auditoría si hay un ID
    return (
      <IonPage className="dark-theme">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Detalle de Auditoría</IonTitle>{" "}
            {/* Título más específico */}
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding audit-detail-content">
          {" "}
          {/* Nueva clase para el contenido */}
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
          <IonTitle>Mis Auditorías</IonTitle> {/* Título más amigable */}
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding audits-list-view">
        {" "}
        {/* Nueva clase para la vista de lista */}
        {MOCK_AUDITS.length === 0 ? (
          <div className="empty-state">
            <h3>No hay auditorías disponibles</h3>
            <p>
              Crea una nueva auditoría o espera a que el administrador publique
              una.
            </p>
          </div>
        ) : (
          <IonGrid className="audits-list-grid">
            <IonRow>
              {MOCK_AUDITS.map((a) => {
                const { color, icon } = getStatusProps(a.status);
                return (
                  <IonCol size="12" sizeMd="6" sizeLg="4" key={a.id}>
                    {" "}
                    {/* Añadido sizeLg para pantallas grandes */}
                    <IonCard
                      className="audit-list-card"
                      routerLink={`/audits/${a.id}`}
                    >
                      <div className="audit-list-content">
                        <div>
                          <div className="audit-list-code">{a.code}</div>
                          <div className="audit-list-title">{a.title}</div>
                          <div className="audit-list-meta">
                            Línea: {a.line} — Turno: {a.shift}
                          </div>{" "}
                          {/* Texto más descriptivo */}
                        </div>
                        <IonBadge className="audit-list-badge" color={color}>
                          <IonIcon icon={icon} slot="start" />{" "}
                          {/* Icono en el badge */}
                          {a.status.replace("_", " ")}{" "}
                          {/* Formatear status: "in_progress" -> "in progress" */}
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
