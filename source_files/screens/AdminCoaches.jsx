// TuzosJrz — Admin: coach management

const COACHES = [
  { id: 1, first: 'Miguel',   last: 'Ramírez', initials: 'MR', categories: ['Sub-12'], phone: '+52 771 111 2233', email: 'coach.ramirez@tuzosjrz.mx', lastActive: 'Hace 5 min',  status: 'active' },
  { id: 2, first: 'Fernanda', last: 'López',   initials: 'FL', categories: ['Sub-10'], phone: '+52 771 222 3344', email: 'coach.lopez@tuzosjrz.mx',   lastActive: 'Hace 1 h',    status: 'active' },
  { id: 3, first: 'Andrés',   last: 'Vera',    initials: 'AV', categories: ['Sub-14', 'Sub-16'], phone: '+52 771 333 4455', email: 'coach.vera@tuzosjrz.mx', lastActive: 'Hace 20 min', status: 'active' },
  { id: 4, first: 'Julio',    last: 'Cruz',    initials: 'JC', categories: ['Sub-8'], phone: '+52 771 444 5566', email: 'coach.cruz@tuzosjrz.mx',    lastActive: 'Ayer', status: 'active' },
  { id: 5, first: 'Diego',    last: 'Ortiz',   initials: 'DO', categories: [], phone: '+52 771 555 6677', email: 'coach.ortiz@tuzosjrz.mx',   lastActive: '3 días',       status: 'inactive' },
];

function AdminCoaches({ back }) {
  const [modal, setModal] = React.useState(null);
  const [detailId, setDetailId] = React.useState(null);
  const detail = detailId ? COACHES.find(c => c.id === detailId) : null;

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        padding: '54px 20px 18px', background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button onClick={back} style={{
            width: 40, height: 40, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={20} color="#fff" />
          </button>
          <button onClick={() => setModal('invite')} style={{
            padding: '10px 14px', borderRadius: 999, border: 0,
            background: '#F5B301', color: TZ.primaryDark,
            fontSize: 12, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Icon name="plus" size={14} color={TZ.primaryDark} />
            Invitar coach
          </button>
        </div>
        <div style={{ position: 'relative', marginTop: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>STAFF DEPORTIVO</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>Entrenadores</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{COACHES.length} en el club · {COACHES.filter(c => c.status === 'active').length} activos</div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          <StatCard label="Categorías cubiertas" value={new Set(COACHES.flatMap(c => c.categories)).size + '/' + window.TZ_DATA.CATEGORIES.length} color={TZ.primary} />
          <StatCard label="Sin asignar" value={COACHES.filter(c => c.categories.length === 0).length} color={TZ.warn} />
          <StatCard label="Multi-categoría" value={COACHES.filter(c => c.categories.length > 1).length} color={TZ.ok} />
        </div>

        {/* List */}
        <SectionTitle>Todos los entrenadores</SectionTitle>
        <Card padded={false}>
          {COACHES.map((c, i) => (
            <div key={c.id} onClick={() => setDetailId(c.id)} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line, cursor: 'pointer',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: `linear-gradient(135deg, hsl(${(c.id * 71) % 360} 55% 55%), hsl(${((c.id * 71) + 40) % 360} 60% 40%))`,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 15, flexShrink: 0,
                opacity: c.status === 'inactive' ? 0.5 : 1,
              }}>{c.initials}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>Coach {c.last}</span>
                  {c.status === 'inactive' && <Chip tone="neutral">Inactivo</Chip>}
                </div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>{c.first} {c.last} · {c.lastActive}</div>
                <div style={{ display: 'flex', gap: 4, marginTop: 6, flexWrap: 'wrap' }}>
                  {c.categories.length > 0 ? c.categories.map(cat => (
                    <span key={cat} style={{
                      padding: '2px 8px', borderRadius: 999,
                      background: 'rgba(29,61,138,0.10)', color: TZ.primary,
                      fontSize: 10, fontWeight: 700,
                    }}>{cat}</span>
                  )) : (
                    <span style={{ padding: '2px 8px', borderRadius: 999,
                      background: '#FEF3C7', color: '#78350F',
                      fontSize: 10, fontWeight: 700 }}>Sin categorías asignadas</span>
                  )}
                </div>
              </div>
              <Icon name="chevron" size={16} color={TZ.muted} />
            </div>
          ))}
        </Card>
      </div>

      {modal === 'invite' && <CoachInviteModal onClose={() => setModal(null)} />}
      {detail && <CoachDetailSheet coach={detail} onClose={() => setDetailId(null)} />}
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: -0.3, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

function CoachInviteModal({ onClose }) {
  const [selected, setSelected] = React.useState(new Set());
  const toggle = c => setSelected(s => {
    const n = new Set(s);
    if (n.has(c)) n.delete(c); else n.add(c);
    return n;
  });

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 44px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink }}>Invitar entrenador</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>Se enviará por correo + WhatsApp</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="close" size={16} color={TZ.inkSoft} />
          </button>
        </div>

        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Datos del coach</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Nombre completo" style={inpStyle} />
          <input placeholder="Correo electrónico" style={inpStyle} />
          <input placeholder="Teléfono (para WhatsApp)" style={inpStyle} />
        </div>

        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Categorías asignadas</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {window.TZ_DATA.CATEGORIES.map(c => {
            const on = selected.has(c);
            return (
              <button key={c} onClick={() => toggle(c)} style={{
                padding: '10px 14px', borderRadius: 999, border: on ? 0 : '1.5px solid ' + TZ.line,
                background: on ? TZ.primary : '#fff',
                color: on ? '#fff' : TZ.ink,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {on && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
                {c}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 8 }}>
          Puedes asignar más de una categoría al mismo entrenador. Podrá pasar lista y editar solo esas.
        </div>

        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Permisos adicionales</div>
        <PermToggle label="Ver ficha médica completa" defaultOn />
        <PermToggle label="Editar ficha médica" defaultOn />
        <PermToggle label="Editar pizarra táctica" defaultOn />
        <PermToggle label="Chatear con padres" defaultOn />

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={onClose} style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: TZ.primary, color: '#fff', border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
          }}>Enviar invitación</button>
        </div>
      </div>
    </div>
  );
}

function PermToggle({ label, defaultOn }) {
  const [on, setOn] = React.useState(!!defaultOn);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0' }}>
      <div style={{ flex: 1, fontSize: 13, color: TZ.ink, fontWeight: 500 }}>{label}</div>
      <button onClick={() => setOn(!on)} style={{
        width: 44, height: 26, borderRadius: 13, border: 0, cursor: 'pointer',
        background: on ? TZ.primary : '#D1D5DB', position: 'relative',
        transition: 'background 0.15s',
      }}>
        <div style={{
          position: 'absolute', top: 2, left: on ? 20 : 2,
          width: 22, height: 22, borderRadius: '50%', background: '#fff',
          transition: 'left 0.15s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
}

function CoachDetailSheet({ coach, onClose }) {
  const [selected, setSelected] = React.useState(new Set(coach.categories));
  const toggle = c => setSelected(s => {
    const n = new Set(s);
    if (n.has(c)) n.delete(c); else n.add(c);
    return n;
  });
  const rosterSize = Array.from(selected).reduce((s, cat) =>
    s + window.TZ_DATA.PLAYERS.filter(p => p.category === cat).length, 0);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 44px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${(coach.id * 71) % 360} 55% 55%), hsl(${((coach.id * 71) + 40) % 360} 60% 40%))`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 20,
          }}>{coach.initials}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink }}>Coach {coach.last}</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>{coach.first} {coach.last}</div>
          </div>
          <button style={{
            padding: '8px 12px', borderRadius: 999, border: '1px solid ' + TZ.line,
            background: '#fff', fontSize: 12, fontWeight: 700, color: TZ.err, cursor: 'pointer',
          }}>Desactivar</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <SmallInfoCard label="Email" value={coach.email} />
          <SmallInfoCard label="Teléfono" value={coach.phone} />
        </div>

        <div style={{ margin: '20px 0 8px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', display: 'flex', justifyContent: 'space-between' }}>
          <span>Categorías asignadas</span>
          <span style={{ color: TZ.primary }}>{rosterSize} jugadores en total</span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {window.TZ_DATA.CATEGORIES.map(c => {
            const on = selected.has(c);
            return (
              <button key={c} onClick={() => toggle(c)} style={{
                padding: '10px 14px', borderRadius: 999, border: on ? 0 : '1.5px solid ' + TZ.line,
                background: on ? TZ.primary : '#fff',
                color: on ? '#fff' : TZ.ink,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 5,
              }}>
                {on && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
                {c}
              </button>
            );
          })}
        </div>

        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Permisos</div>
        <PermToggle label="Ver ficha médica completa" defaultOn />
        <PermToggle label="Editar ficha médica" defaultOn />
        <PermToggle label="Editar pizarra táctica" defaultOn />
        <PermToggle label="Chatear con padres" defaultOn />
        <PermToggle label="Convocar a partidos" defaultOn />

        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Cerrar</button>
          <button onClick={onClose} style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: TZ.primary, color: '#fff', border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
          }}>Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

function SmallInfoCard({ label, value }) {
  return (
    <div style={{ flex: 1, background: '#F4F5F8', borderRadius: 10, padding: '8px 10px', minWidth: 0 }}>
      <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.6, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 12, color: TZ.ink, marginTop: 2, fontWeight: 500,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
    </div>
  );
}

const inpStyle = {
  padding: '12px 14px', border: '1px solid #E6E8EE', borderRadius: 10,
  fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff',
};

Object.assign(window, { AdminCoaches });
