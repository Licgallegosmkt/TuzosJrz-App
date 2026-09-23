// TuzosJrz — Notifications center + preferences

const NOTIFICATIONS = {
  admin: [
    { id: 1, when: 'hoy', at: '10:22', kind: 'money',  icon: '💳', title: 'Pago recibido', body: 'Diego Hernández · Cuota Septiembre · $850', tone: 'ok' },
    { id: 2, when: 'hoy', at: '09:48', kind: 'parent', icon: '👪', title: 'Nueva solicitud de tutor', body: 'Lucía Ramírez quiere vincularse con Mateo Ramírez (Sub-10)', tone: 'info', unread: true },
    { id: 3, when: 'hoy', at: '09:15', kind: 'coach',  icon: '🏃', title: 'Coach López aceptó su invitación', body: 'Ya puede acceder al panel Sub-10', tone: 'ok' },
    { id: 4, when: 'ayer', at: '20:12', kind: 'medical', icon: '🩹', title: 'Alerta médica', body: 'Bruno García fue reportado como lesionado por Coach Vera', tone: 'warn', unread: true },
    { id: 5, when: 'ayer', at: '15:30', kind: 'money',  icon: '⚠️', title: 'Cuota vencida', body: '3 jugadores con más de 15 días de atraso', tone: 'err' },
    { id: 6, when: 'semana', at: 'Vie 18', kind: 'stat', icon: '📊', title: 'Reporte semanal listo', body: 'Asistencia promedio del club: 87%', tone: 'info' },
    { id: 7, when: 'semana', at: 'Jue 17', kind: 'match', icon: '⚽', title: 'Resultado registrado', body: 'Sub-14 venció 3-1 a Rayados Jr.', tone: 'ok' },
  ],
  coach: [
    { id: 1, when: 'hoy', at: '13:41', kind: 'chat', icon: '💬', title: 'Ana Mendoza escribió al grupo', body: '"Iker va a llegar 10 min tarde mañana..."', tone: 'info', unread: true },
    { id: 2, when: 'hoy', at: '11:16', kind: 'match', icon: '⚽', title: 'Convocatoria confirmada', body: '14 de 18 jugadores confirmados para partido del sábado', tone: 'ok' },
    { id: 3, when: 'ayer', at: '18:30', kind: 'medical', icon: '🩺', title: 'Alta médica', body: 'Mateo Rivera fue dado de alta por el fisio', tone: 'ok', unread: true },
    { id: 4, when: 'ayer', at: '10:00', kind: 'admin', icon: '📢', title: 'Aviso del admin', body: 'Reunión de coaches el jueves 25 a las 19:00', tone: 'info' },
    { id: 5, when: 'semana', at: 'Vie 18', kind: 'chat', icon: '💬', title: '3 mensajes nuevos', body: 'En el grupo Sub-12 Familias', tone: 'info' },
  ],
  parent: [
    { id: 1, when: 'hoy', at: '10:22', kind: 'coach', icon: '🏃', title: 'Coach Ramírez', body: '"Recordatorio: mañana entrenamiento a las 17:00"', tone: 'info', unread: true },
    { id: 2, when: 'hoy', at: '09:15', kind: 'money', icon: '💳', title: 'Cuota Septiembre disponible', body: 'Vence en 3 días · $850 MXN', tone: 'warn', unread: true },
    { id: 3, when: 'ayer', at: '19:17', kind: 'coach', icon: '💬', title: 'Coach te escribió', body: '"Perfecto, estaré atento. Nos vemos mañana 💪"', tone: 'info' },
    { id: 4, when: 'ayer', at: '15:00', kind: 'match', icon: '⚽', title: 'Convocatoria: vs Tigres Jr.', body: 'Diego fue convocado para el sábado 26 a las 10:30', tone: 'ok' },
    { id: 5, when: 'semana', at: 'Vie 18', kind: 'attend', icon: '✅', title: 'Asistencia registrada', body: 'Diego estuvo presente en el entrenamiento', tone: 'ok' },
    { id: 6, when: 'semana', at: 'Mié 16', kind: 'admin', icon: '📢', title: 'Nuevas fotos del equipo', body: 'El club subió fotos del último partido', tone: 'info' },
  ],
};

function NotificationsCenter({ role, back }) {
  const [tab, setTab] = React.useState('all');
  const list = NOTIFICATIONS[role] || NOTIFICATIONS.admin;
  const filtered = list.filter(n => {
    if (tab === 'all') return true;
    if (tab === 'unread') return n.unread;
    return n.kind === tab;
  });
  const grouped = {};
  filtered.forEach(n => { (grouped[n.when] = grouped[n.when] || []).push(n); });
  const labelMap = { hoy: 'Hoy', ayer: 'Ayer', semana: 'Esta semana' };
  const unreadCount = list.filter(n => n.unread).length;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        padding: '54px 20px 14px', background: '#fff', borderBottom: '1px solid ' + TZ.line,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        {back && (
          <button onClick={back} style={{
            background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: TZ.primary,
          }}>
            <Icon name="chevronL" size={22} color={TZ.primary} />
          </button>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 800, color: TZ.ink, letterSpacing: -0.3 }}>Notificaciones</div>
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>
            {unreadCount > 0 ? `${unreadCount} sin leer` : 'Todo al día'}
          </div>
        </div>
        <button style={{
          fontSize: 12, color: TZ.primary, fontWeight: 700, background: 'transparent', border: 0, cursor: 'pointer',
        }}>Marcar leídas</button>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Filter chips */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', padding: '12px 0 4px', margin: '0 -16px', paddingLeft: 16, paddingRight: 16 }}>
          {[
            { id: 'all',    label: `Todas (${list.length})` },
            { id: 'unread', label: `Sin leer (${unreadCount})` },
            { id: 'chat',   label: 'Chats' },
            { id: 'money',  label: 'Pagos' },
            { id: 'match',  label: 'Partidos' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '7px 12px', borderRadius: 999, border: 0, whiteSpace: 'nowrap',
              background: tab === t.id ? TZ.ink : '#fff',
              color: tab === t.id ? '#fff' : TZ.inkSoft,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: tab === t.id ? 'none' : '0 1px 2px rgba(15,23,42,0.06)',
              border: tab === t.id ? 0 : '1px solid ' + TZ.line,
            }}>{t.label}</button>
          ))}
        </div>

        {['hoy','ayer','semana'].map(when => grouped[when] && (
          <div key={when}>
            <SectionTitle>{labelMap[when]}</SectionTitle>
            <Card padded={false}>
              {grouped[when].map((n, i) => <NotifRow key={n.id} n={n} first={i === 0} />)}
            </Card>
          </div>
        ))}

        {filtered.length === 0 && (
          <Card>
            <div style={{ textAlign: 'center', padding: 30, color: TZ.muted, fontSize: 13 }}>
              Sin notificaciones en esta categoría
            </div>
          </Card>
        )}

        {/* Preferences link */}
        <div style={{ marginTop: 22, textAlign: 'center' }}>
          <button style={{
            background: 'transparent', border: 0, color: TZ.primary,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>⚙️ Configurar notificaciones</button>
        </div>
      </div>
    </div>
  );
}

function NotifRow({ n, first }) {
  const toneBg = n.tone === 'ok' ? '#DCFCE7' : n.tone === 'warn' ? '#FEF3C7' : n.tone === 'err' ? '#FEE2E2' : '#DBEAFE';
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '13px 14px',
      borderTop: first ? 0 : '1px solid ' + TZ.line,
      background: n.unread ? 'rgba(29,61,138,0.03)' : 'transparent',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12, background: toneBg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>{n.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: n.unread ? 700 : 600, color: TZ.ink }}>{n.title}</span>
          <span style={{ fontSize: 10, color: TZ.muted, fontWeight: 600, flexShrink: 0 }}>{n.at}</span>
        </div>
        <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 3, lineHeight: 1.4 }}>{n.body}</div>
      </div>
      {n.unread && (
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: TZ.primary, marginTop: 6, flexShrink: 0 }} />
      )}
    </div>
  );
}

// Push notification simulator — floating card demo
function PushMock({ role }) {
  const list = NOTIFICATIONS[role] || NOTIFICATIONS.admin;
  const n = list[0];
  if (!n) return null;
  return (
    <div style={{
      position: 'absolute', top: 60, left: 12, right: 12, zIndex: 200,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderRadius: 20, padding: '12px 14px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
      display: 'flex', gap: 12, alignItems: 'center',
      animation: 'slideDown 0.4s ease-out',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 8,
        background: TZ.primary, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 15,
        flexShrink: 0,
      }}>TJ</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#000' }}>TUZOSJRZ</span>
          <span style={{ fontSize: 10, color: '#666', fontWeight: 600 }}>ahora</span>
        </div>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#000', marginTop: 2 }}>{n.title}</div>
        <div style={{ fontSize: 12, color: '#333', marginTop: 1, lineHeight: 1.3,
          overflow: 'hidden', textOverflow: 'ellipsis',
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.body}</div>
      </div>
    </div>
  );
}

Object.assign(window, { NotificationsCenter, PushMock });
