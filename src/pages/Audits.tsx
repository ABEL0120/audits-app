import React from 'react';
import { useParams } from 'react-router-dom';
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
} from '@ionic/react';
import './Audits.css';
import { MOCK_AUDITS } from '../data/mockData';
import AuditDetail from '../components/AuditDetail';

const Audits: React.FC = () => {
  const params = useParams<{ id?: string }>();
  const id = params.id ? Number(params.id) : undefined;

  if (id) {
    return (
      <IonPage className="dark-theme">
        <IonHeader>
          <IonToolbar>
            <IonTitle>Auditoría</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen className="ion-padding">
          <AuditDetail auditId={id} />
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage className="dark-theme">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Auditorías</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding audits-list">
        {MOCK_AUDITS.length === 0 ? (
          <div className="empty-state">
            <h3>No hay auditorías disponibles</h3>
            <p>Crea una nueva auditoría o espera a que el administrador publique una.</p>
          </div>
        ) : (
          <IonGrid className="audits-list-grid">
            <IonRow>
              {MOCK_AUDITS.map((a) => (
                <IonCol size="12" sizeMd="6" key={a.id}>
                  <IonCard className="audit-list-card" routerLink={`/audits/${a.id}`}>
                    <div className="audit-list-content">
                      <div>
                        <div className="audit-list-code">{a.code}</div>
                        <div className="audit-list-title">{a.title}</div>
                        <div className="audit-list-meta">{a.line} — Turno {a.shift}</div>
                      </div>
                      <IonBadge className="audit-list-badge" color={a.status === 'draft' ? 'medium' : a.status === 'in_progress' ? 'warning' : 'success'}>
                        {a.status}
                      </IonBadge>
                    </div>
                  </IonCard>
                </IonCol>
              ))}
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Audits;
