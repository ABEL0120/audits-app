import React, { useMemo, useState } from 'react';
import {
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonBadge,
  IonButton,
  IonModal,
  IonItem,
  IonLabel,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon,
} from '@ionic/react';
import { checkmarkOutline, closeOutline, cameraOutline, warningOutline } from 'ionicons/icons';
import { AuditMeta, Item, MOCK_AUDITS, MOCK_ITEMS } from '../data/mockData';
import './AuditDetail.css';

interface Props {
  auditId: number;
}

const AuditDetail: React.FC<Props> = ({ auditId }) => {
  const auditMeta = MOCK_AUDITS.find((a) => a.id === auditId) as AuditMeta | undefined;

  const [items, setItems] = useState<Item[]>(MOCK_ITEMS);
  const [showPhotoModalFor, setShowPhotoModalFor] = useState<number | null>(null);
  const [showDefectModalFor, setShowDefectModalFor] = useState<number | null>(null);
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');

  const counts = useMemo(() => {
    const total = items.length;
    const completed = items.filter((i) => i.result).length;
    const photos = items.reduce((s, it) => s + it.photos.length, 0);
    const defects = items.reduce((s, it) => s + it.defects.length, 0);
    return { total, completed, photos, defects };
  }, [items]);

  function setItemResult(itemId: number, result: Item['result']) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, result } : it)));
    if (result === 'FAIL') setTimeout(() => setShowDefectModalFor(itemId), 200);
  }

  function addDefect(itemId: number, defect: Item['defects'][number]) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, defects: [...it.defects, defect] } : it)));
    setShowDefectModalFor(null);
  }

  function addPhoto(itemId: number, fileId: string) {
    setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, photos: [...it.photos, { id: fileId }] } : it)));
    setShowPhotoModalFor(null);
  }

  function onSubmitAudit() {
    alert('Auditoría enviada correctamente. El supervisor revisará tu envío.');
    setShowSummary(false);
  }

  if (!auditMeta) return <div>Auditoría no encontrada</div>;

  return (
    <div>
      <IonCard className="audit-header-card">
        <IonCardHeader className="audit-card-header">
          <div className="audit-header-info">
            <div>
              <div className="audit-code">{auditMeta.code}</div>
              <div className="audit-meta">{auditMeta.line} — Turno {auditMeta.shift}</div>
              <div className="audit-meta">Empleado: {auditMeta.employee_number}</div>
              <div className="audit-meta">Supervisor: {auditMeta.supervisor_name}</div>
            </div>
            <IonBadge className="status-badge" color={auditMeta.status === 'draft' ? 'medium' : auditMeta.status === 'in_progress' ? 'warning' : 'success'}>
              {auditMeta.status}
            </IonBadge>
          </div>

          <div className="audit-header-actions">
            {auditMeta.status === 'draft' && (
              <IonButton color="primary" onClick={() => alert('Iniciar auditoría')}>
                Iniciar
              </IonButton>
            )}
            <IonButton onClick={() => alert('Guardando borrador...')} fill="outline">Guardar</IonButton>
            <IonButton color="danger" onClick={() => setShowSummary(true)}>
              Finalizar
            </IonButton>
          </div>
        </IonCardHeader>
      </IonCard>

      <IonGrid className="stats-container">
        <IonRow>
          <IonCol size="4">
            <div className="stats-card">
              <div className="stats-title">Completados</div>
              <div className="stats-value">{counts.completed}/{counts.total}</div>
            </div>
          </IonCol>
          <IonCol size="4">
            <div className="stats-card">
              <div className="stats-title">Fotos</div>
              <div className="stats-value">{counts.photos}</div>
            </div>
          </IonCol>
          <IonCol size="4">
            <div className="stats-card">
              <div className="stats-title">Defectos</div>
              <div className="stats-value">{counts.defects}</div>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>

      <div className="items-container">
        {items.length === 0 ? (
          <div className="empty-state">
            <h4>No hay elementos para inspeccionar</h4>
            <p>Cuando existan items para revisar aparecerán aquí.</p>
          </div>
        ) : (
          items.map((it) => (
            <IonCard key={it.id} className="item-card">
              <IonCardContent className="item-card-content">
                <div className="item-header">
                  <div>
                    <div className="item-title">{it.tool_code} — {it.tool_name}</div>
                    <div className="item-desc">{it.model} • {it.description}</div>
                  </div>
                  <div className="result-buttons">
                    <IonButton size="small" color={it.result === 'PASS' ? 'success' : 'light'} fill={it.result === 'PASS' ? 'solid' : 'outline'} onClick={() => setItemResult(it.id, 'PASS')}>
                      <IonIcon slot="start" icon={checkmarkOutline} /> PASS
                    </IonButton>
                    <IonButton size="small" color={it.result === 'FAIL' ? 'danger' : 'light'} fill={it.result === 'FAIL' ? 'solid' : 'outline'} onClick={() => setItemResult(it.id, 'FAIL')}>
                      <IonIcon slot="start" icon={warningOutline} /> FAIL
                    </IonButton>
                    <IonButton size="small" color={it.result === 'NA' ? 'medium' : 'light'} fill={it.result === 'NA' ? 'solid' : 'outline'} onClick={() => setItemResult(it.id, 'NA')}>
                      N/A
                    </IonButton>
                  </div>
                </div>

                <div className="item-actions">
                  <IonButton size="small" onClick={() => setShowPhotoModalFor(it.id)}>
                    <IonIcon slot="start" icon={cameraOutline} /> Fotos ({it.photos.length})
                  </IonButton>
                  <IonButton fill="clear" size="small" onClick={() => setShowDefectModalFor(it.id)}>
                    <IonIcon slot="start" icon={closeOutline} /> Defectos ({it.defects.length})
                  </IonButton>
                </div>
              </IonCardContent>
            </IonCard>
          ))
        )}
      </div>

      <div className="footer-actions">
        <IonButton expand="block" onClick={() => setShowSummary(true)}>Finalizar</IonButton>
        <IonButton color="medium" onClick={() => alert('Guardado')}>Guardar</IonButton>
      </div>

      <IonModal isOpen={showPhotoModalFor !== null} onDidDismiss={() => setShowPhotoModalFor(null)}>
        <div className="modal-container">
          <h3>Añadir foto</h3>
          <input className="file-input" type="file" accept="image/*" onChange={(e) => {
            const f = e.target.files && e.target.files[0];
            if (f && showPhotoModalFor) addPhoto(showPhotoModalFor, `${Date.now()}`);
          }} />
          <div className="modal-actions">
            <IonButton onClick={() => setShowPhotoModalFor(null)} fill="outline">Cancelar</IonButton>
            <IonButton onClick={() => setShowPhotoModalFor(null)}>Aceptar</IonButton>
          </div>
        </div>
      </IonModal>

      <IonModal isOpen={showDefectModalFor !== null} onDidDismiss={() => setShowDefectModalFor(null)}>
        <div className="modal-container">
          <h3>Registrar defecto</h3>
          <IonItem>
            <IonLabel position="stacked">Tipo de defecto</IonLabel>
            <IonSelect id="defect-type" placeholder="Selecciona tipo">
              <IonSelectOption value="wear">Desgaste</IonSelectOption>
              <IonSelectOption value="fracture">Fractura</IonSelectOption>
              <IonSelectOption value="misalignment">Desalineado</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Severidad</IonLabel>
            <IonSelect id="defect-severity" placeholder="Selecciona severidad">
              <IonSelectOption value="low">Baja</IonSelectOption>
              <IonSelectOption value="medium">Media</IonSelectOption>
              <IonSelectOption value="high">Alta</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Descripción</IonLabel>
            <IonTextarea id="defect-desc" />
          </IonItem>
          <div className="modal-actions">
            <IonButton fill="outline" onClick={() => setShowDefectModalFor(null)}>Cancelar</IonButton>
            <IonButton onClick={() => {
              const type = (document.getElementById('defect-type') as HTMLSelectElement)?.value || 'other';
              const sev = (document.getElementById('defect-severity') as HTMLSelectElement)?.value || 'low';
              const desc = (document.getElementById('defect-desc') as HTMLTextAreaElement)?.value || 'Descripción';
              if (showDefectModalFor) addDefect(showDefectModalFor, { type, severity: sev, description: desc });
            }}>Guardar</IonButton>
          </div>
        </div>
      </IonModal>

      <IonModal isOpen={showSummary} onDidDismiss={() => setShowSummary(false)}>
        <div className="modal-container">
          <h3>Enviar auditoría</h3>
          <div className="summary-count">Completados: {counts.completed}/{counts.total}</div>
          <IonItem>
            <IonLabel position="stacked">Resumen</IonLabel>
            <IonTextarea value={summaryText} onIonChange={(e: unknown) => {
              const ev = e as CustomEvent<{ value?: string }>;
              setSummaryText(ev?.detail?.value ?? '');
            }} />
          </IonItem>
          <div className="modal-actions">
            <IonButton fill="outline" onClick={() => setShowSummary(false)}>Cancelar</IonButton>
            <IonButton color="primary" onClick={onSubmitAudit}>Enviar</IonButton>
          </div>
        </div>
      </IonModal>
    </div>
  );
};

export default AuditDetail;
