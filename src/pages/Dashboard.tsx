import React from 'react';
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
} from '@ionic/react';
import {
  add,
  checkmarkDoneCircleOutline,
  chevronForwardOutline,
  documentTextOutline,
  timeOutline,
} from 'ionicons/icons';
import './Dashboard.css';

interface Audit {
  id: number;
  title: string;
  due: string;
  status: 'PENDIENTE' | 'EN PROCESO';
  icon: string;
}

interface CompletedAudit {
  id: number;
  title: string;
  date: string;
}

const userData = {
  name: 'Juan Pérez',
  avatarUrl: `https://ui-avatars.com/api/?name=Juan+Perez&background=1c1c1c&color=3880ff&bold=true`,
};

const pendingAudits: Audit[] = [
  { id: 1, title: 'Revisión de Seguridad - Planta Norte', due: 'Vence Hoy', status: 'PENDIENTE', icon: documentTextOutline },
  { id: 2, title: 'Auditoría de Calidad - Almacén Central', due: 'Vence en 2 días', status: 'EN PROCESO', icon: timeOutline },
];

const completedAudits: CompletedAudit[] = [
  { id: 3, title: 'Inspección de Equipo - Tienda A', date: '2025-10-10' },
  { id: 4, title: 'Revisión de Cumplimiento - Sede B', date: '2025-10-08' },
  { id: 5, title: 'Auditoría Trimestral - Planta C', date: '2025-09-30' },
];

const PendienteCard: React.FC<{ audit: Audit }> = ({ audit }) => (
  <IonCard className={`dark-card status-${audit.status.toLowerCase()}`}>
    <div className="dark-card-header">
      <IonIcon icon={audit.icon} className="dark-icon" />
      <div>
        <h2>{audit.title}</h2>
        <p>{audit.due}</p>
      </div>
    </div>
    <div className="dark-card-footer">
      <IonBadge color={audit.status === 'PENDIENTE' ? 'warning' : 'primary'}>
        {audit.status}
      </IonBadge>
      <IonButton fill="clear" size="small" routerLink={`/audits/${audit.id}`}>
        {audit.status === 'PENDIENTE' ? 'Empezar Auditoría' : 'Continuar'}
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
            <p>Hola de nuevo,</p>
            <h1>{userData.name}</h1>
          </div>
          <img src={userData.avatarUrl} alt="avatar" className="hero-avatar" />
        </div>

        <h2 className="section-title">Auditorías por Hacer</h2>

        {pendingAudits.map((a) => (
          <PendienteCard key={a.id} audit={a} />
        ))}

        <div className="completed-section">
          <details>
            <summary className="completed-summary">
              <span>Ver finalizadas</span>
              <IonIcon icon={chevronForwardOutline} />
            </summary>
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
