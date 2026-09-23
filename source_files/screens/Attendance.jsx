// TuzosJrz — Attendance

function Attendance({ nav, lockedCategory, coachName }) {
  const { PLAYERS, CATEGORIES } = window.TZ_DATA;
  const [category, setCategory] = React.useState(lockedCategory || 'Sub-12');
  React.useEffect(() => { if (lockedCategory) setCategory(lockedCategory); }, [lockedCategory]);
  const [session, setSession] = React.useState('training'); // or 'match'
  const [marks, setMarks] = React.useState({}); // playerId -> P|A|J

  const roster = PLAYERS.filter(p => p.category === category);
  const cycle = (id) => {
    setMarks(m => {
      const cur = m[id];
      const next = cur === undefined ? 'P' : cur === 'P' ? 'A' : cur === 'A' ? 'J' : undefined;
      const c = { ...m };
      if (next === undefined) delete c[id]; else c[id] = next;
      return c;
    });
  };

  const markAll = (v) => {
    const c = {};
    roster.forEach(p => c[p.id] = v);
    setMarks(c);
  };

  const present = Object.values(marks).filter(v => v === 'P').length;
  const absent = Object.values(marks).filter(v => v === 'A').length;
  const just = Object.values(marks).filter(v => v === 'J').length;
  const unmarked = roster.length - Object.keys(marks).length;

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Asistencia"
        subtitle="Pasar lista rápida"
      />
      <div style={{ padding: '0 16px' }}>
        {/* Session type toggle */}
        <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'training', label: 'Entrenamiento', icon: 'whistle' },
            { id: 'match', label: 'Partido', icon: 'stat' },
          ].map(t => (
            <button key={t.id} onClick={() => setSession(t.id)} style={{
              flex: 1, padding: '10px', border: 0, borderRadius: 9,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: session === t.id ? '#fff' : 'transparent',
              color: session === t.id ? TZ.primary : TZ.inkSoft,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: session === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
              <Icon name={t.icon} size={18} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Session info */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1, textTransform: 'uppercase' }}>
                {session === 'training' ? 'Sesión de hoy' : 'Convocatoria'}
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: TZ.ink, marginTop: 2 }}>
                {session === 'training' ? 'Entrenamiento · Cancha 2' : 'vs Tigres Jr.'}
              </div>
              <div style={{ fontSize: 12, color: TZ.muted, marginTop: 4 }}>
                Lun 21 Sep · 17:00 · {category}
              </div>
            </div>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: 'rgba(29,61,138,0.08)', color: TZ.primary,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name={session === 'training' ? 'whistle' : 'stat'} size={24} color={TZ.primary} />
            </div>
          </div>
        </Card>

        {!lockedCategory && <CategoryChipRow value={category} onChange={setCategory} categories={CATEGORIES} />}
        {lockedCategory && (
          <div style={{ marginTop: 8, padding: '8px 12px', background: 'rgba(29,61,138,0.06)',
            border: '1px dashed rgba(29,61,138,0.3)', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: TZ.primary, fontWeight: 600 }}>
            🔒 Solo tu categoría asignada · {lockedCategory}
          </div>
        )}

        {/* Counters */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, margin: '4px 0 12px' }}>
          <MiniCount label="Total" value={roster.length} color={TZ.ink} />
          <MiniCount label="Presentes" value={present} color={TZ.ok} />
          <MiniCount label="Ausentes" value={absent} color={TZ.err} />
          <MiniCount label="Justif." value={just} color={TZ.warn} />
        </div>

        {/* Quick actions */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button onClick={() => markAll('P')} style={quickBtn}>Marcar todos presentes</button>
          <button onClick={() => setMarks({})} style={{ ...quickBtn, flex: '0 0 auto', padding: '10px 14px' }}>
            <Icon name="close" size={16} color={TZ.inkSoft} />
          </button>
        </div>

        {/* Roster */}
        <Card padded={false}>
          {roster.map((p, i) => {
            const m = marks[p.id];
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                background: m === 'P' ? 'rgba(22,163,74,0.04)' : m === 'A' ? 'rgba(220,38,38,0.04)' : m === 'J' ? 'rgba(245,158,11,0.05)' : 'transparent',
                transition: 'background 0.15s',
              }}>
                <Avatar player={p} size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: TZ.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
                    {p.position} · Asistencia {p.attendance.rate}%
                  </div>
                </div>
                {/* 3 mark buttons */}
                <div style={{ display: 'flex', gap: 4 }}>
                  <MarkBtn label="P" active={m === 'P'} color={TZ.ok} onClick={() => setMarks({ ...marks, [p.id]: m === 'P' ? undefined : 'P' })} />
                  <MarkBtn label="A" active={m === 'A'} color={TZ.err} onClick={() => setMarks({ ...marks, [p.id]: m === 'A' ? undefined : 'A' })} />
                  <MarkBtn label="J" active={m === 'J'} color={TZ.warn} onClick={() => setMarks({ ...marks, [p.id]: m === 'J' ? undefined : 'J' })} />
                </div>
              </div>
            );
          })}
        </Card>

        {/* Save button */}
        <button style={{
          position: 'fixed', bottom: 90, left: '50%', transform: 'translateX(-50%)',
          padding: '14px 24px', borderRadius: 999, border: 0,
          background: unmarked === 0 ? TZ.primary : TZ.ink, color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(15,23,42,0.25)',
          display: 'none', // hidden in prototype (would show when marks > 0)
        }}>
          Guardar asistencia ({Object.keys(marks).length}/{roster.length})
        </button>
      </div>
    </div>
  );
}

function MarkBtn({ label, active, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: 34, height: 34, borderRadius: 8, border: active ? 0 : '1.5px solid ' + TZ.line,
      background: active ? color : '#fff', color: active ? '#fff' : TZ.inkSoft,
      fontSize: 14, fontWeight: 800, cursor: 'pointer', transition: 'all 0.15s',
      boxShadow: active ? `0 2px 6px ${color}55` : 'none',
    }}>{label}</button>
  );
}

function MiniCount({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 600, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
    </div>
  );
}

const quickBtn = {
  flex: 1, padding: '10px', borderRadius: 10, border: '1px solid ' + TZ.line,
  background: '#fff', color: TZ.inkSoft, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
};

Object.assign(window, { Attendance });
