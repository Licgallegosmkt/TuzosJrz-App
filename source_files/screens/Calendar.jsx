// TuzosJrz — Calendar (month/week view) — shared across roles

// Generate events for current period
function buildEvents() {
  const cats = window.TZ_DATA.CATEGORIES;
  const evts = [];
  let id = 1;
  // Fixed pattern of trainings + matches for September 2026
  const trainDays = [1, 3, 4, 8, 10, 11, 15, 17, 18, 22, 24, 25, 29];
  const matchDays = [5, 12, 19, 26];
  const eventDays = [30]; // tournament

  cats.forEach((cat, ci) => {
    trainDays.forEach(d => {
      evts.push({ id: id++, day: d, month: 8, kind: 'training', title: 'Entrenamiento', category: cat,
        time: ['16:00', '17:00', '17:00', '18:00', '17:00'][ci], place: 'Cancha ' + ((ci % 2) + 1) });
    });
    matchDays.forEach(d => {
      const rivals = ['Tigres Jr.', 'León Jr.', 'Rayados Jr.', 'Cruz Azul Jr.'];
      evts.push({ id: id++, day: d, month: 8, kind: 'match', title: 'vs ' + rivals[d % 4], category: cat,
        time: '10:' + (ci * 15 + 30).toString().padStart(2, '0').slice(-2), place: 'Estadio Hidalgo' });
    });
  });
  eventDays.forEach(d => {
    evts.push({ id: id++, day: d, month: 8, kind: 'tournament', title: 'Torneo Interfilial',
      category: 'Todas', time: '09:00', place: 'CAR Pachuca' });
  });
  return evts;
}

const ALL_EVENTS = buildEvents();

function CalendarScreen({ role, category, back, onCreate }) {
  const [view, setView] = React.useState('month'); // month | week
  const [currentMonth, setCurrentMonth] = React.useState(8); // September (0-indexed)
  const [selectedDay, setSelectedDay] = React.useState(null);
  const year = 2026;

  // Filter by role
  const events = ALL_EVENTS.filter(e => {
    if (role === 'coach' && category && e.category !== category && e.category !== 'Todas') return false;
    if (role === 'parent') {
      // Simulate parent has kids in Sub-12
      if (e.category !== 'Sub-12' && e.category !== 'Todas') return false;
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Header */}
      <div style={{
        padding: '54px 20px 16px',
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {back && (
            <button onClick={back} style={{
              width: 36, height: 36, borderRadius: '50%', border: 0,
              background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="chevronL" size={18} color="#fff" />
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, justifyContent: 'center' }}>
            <button onClick={() => setCurrentMonth(m => m - 1)} style={arrBtn}>‹</button>
            <div style={{ minWidth: 140, textAlign: 'center' }}>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.3 }}>
                {['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][currentMonth] || 'Septiembre'}
              </div>
              <div style={{ fontSize: 11, opacity: 0.75 }}>{year}</div>
            </div>
            <button onClick={() => setCurrentMonth(m => m + 1)} style={arrBtn}>›</button>
          </div>
          {(role === 'admin' || role === 'coach') ? (
            <button onClick={onCreate} style={{
              padding: '8px 12px', borderRadius: 999, border: 0,
              background: '#F5B301', color: TZ.primaryDark,
              fontSize: 11, fontWeight: 800, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Icon name="plus" size={14} color={TZ.primaryDark} />
              Nuevo
            </button>
          ) : <div style={{ width: 36 }} />}
        </div>

        {/* View toggle */}
        <div style={{ position: 'relative', display: 'flex', gap: 4, marginTop: 14,
          background: 'rgba(0,0,0,0.25)', borderRadius: 10, padding: 3 }}>
          {[
            { id: 'month', label: 'Mes' },
            { id: 'week', label: 'Semana' },
          ].map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              flex: 1, padding: '8px', border: 0, borderRadius: 7,
              background: view === v.id ? '#F5B301' : 'transparent',
              color: view === v.id ? TZ.primaryDark : 'rgba(255,255,255,0.8)',
              fontSize: 12, fontWeight: 800, cursor: 'pointer',
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Legend */}
        <div style={{ display: 'flex', gap: 12, padding: '12px 0', flexWrap: 'wrap' }}>
          <LegendDot color={TZ.primary} label="Entrenamiento" />
          <LegendDot color="#F5B301" label="Partido" />
          <LegendDot color="#7C3AED" label="Torneo" />
        </div>

        {view === 'month' ? (
          <MonthGrid year={year} month={currentMonth} events={events} selectedDay={selectedDay} onSelectDay={setSelectedDay} />
        ) : (
          <WeekView events={events.filter(e => e.month === currentMonth)} />
        )}
      </div>

      {/* Selected day sheet */}
      {selectedDay !== null && (
        <DaySheet
          day={selectedDay}
          month={currentMonth}
          year={year}
          events={events.filter(e => e.day === selectedDay && e.month === currentMonth)}
          role={role}
          onClose={() => setSelectedDay(null)}
          onCreate={onCreate}
        />
      )}
    </div>
  );
}

function MonthGrid({ year, month, events, selectedDay, onSelectDay }) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  // Convert to Monday-first (0=Mon, 6=Sun)
  const startOffset = (firstDay + 6) % 7;
  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push({ empty: true, key: 'e' + i });
  for (let d = 1; d <= daysInMonth; d++) {
    const dayEvents = events.filter(e => e.day === d && e.month === month);
    cells.push({ day: d, events: dayEvents, key: 'd' + d });
  }
  // Pad to full weeks
  while (cells.length % 7 !== 0) cells.push({ empty: true, key: 'p' + cells.length });

  const today = 21; // simulate today = Sep 21

  return (
    <div>
      {/* Weekday header */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2, marginBottom: 6 }}>
        {['LUN','MAR','MIÉ','JUE','VIE','SÁB','DOM'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: TZ.muted, letterSpacing: 0.5, padding: '4px 0' }}>{d}</div>
        ))}
      </div>
      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {cells.map(c => (
          c.empty ? <div key={c.key} style={{ aspectRatio: '1' }} /> : (
            <button key={c.key} onClick={() => onSelectDay(c.day)} style={{
              aspectRatio: '1', padding: 4, border: c.day === today ? '2px solid ' + TZ.primary : '1px solid ' + TZ.line,
              borderRadius: 8, background: selectedDay === c.day ? TZ.primary : '#fff',
              cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center',
              justifyContent: 'space-between', padding: '4px 2px',
            }}>
              <span style={{
                fontSize: 13, fontWeight: c.day === today ? 800 : 600,
                color: selectedDay === c.day ? '#fff' : c.day === today ? TZ.primary : TZ.ink,
              }}>{c.day}</span>
              <div style={{ display: 'flex', gap: 2, minHeight: 6 }}>
                {c.events.slice(0, 3).map(e => (
                  <span key={e.id} style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: selectedDay === c.day ? '#fff' :
                      e.kind === 'match' ? '#F5B301' : e.kind === 'tournament' ? '#7C3AED' : TZ.primary,
                  }} />
                ))}
              </div>
            </button>
          )
        ))}
      </div>
    </div>
  );
}

function WeekView({ events }) {
  // Take a fixed week Mon Sep 21 - Sun Sep 27
  const days = [
    { day: 21, name: 'Lun', short: 'LUN' },
    { day: 22, name: 'Mar', short: 'MAR' },
    { day: 23, name: 'Mié', short: 'MIÉ' },
    { day: 24, name: 'Jue', short: 'JUE' },
    { day: 25, name: 'Vie', short: 'VIE' },
    { day: 26, name: 'Sáb', short: 'SÁB' },
    { day: 27, name: 'Dom', short: 'DOM' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {days.map(d => {
        const dayEvents = events.filter(e => e.day === d.day);
        const isToday = d.day === 21;
        return (
          <div key={d.day} style={{
            background: '#fff', border: isToday ? `2px solid ${TZ.primary}` : '1px solid ' + TZ.line,
            borderRadius: 12, padding: 12, display: 'flex', gap: 12,
          }}>
            <div style={{
              width: 44, textAlign: 'center', flexShrink: 0,
              padding: '4px 0', borderRadius: 8,
              background: isToday ? TZ.primary : '#F4F5F8',
              color: isToday ? '#fff' : TZ.ink,
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: 0.8, opacity: 0.8 }}>{d.short}</div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4, lineHeight: 1 }}>{d.day}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {dayEvents.length === 0 ? (
                <div style={{ fontSize: 12, color: TZ.muted, fontStyle: 'italic', padding: '10px 0' }}>Sin actividades</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {dayEvents.map(e => <MiniEventRow key={e.id} e={e} />)}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function MiniEventRow({ e }) {
  const bg = e.kind === 'match' ? '#F5B301' : e.kind === 'tournament' ? '#7C3AED' : TZ.primary;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 3, height: 32, background: bg, borderRadius: 2 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: TZ.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.title}</div>
        <div style={{ fontSize: 10, color: TZ.muted, marginTop: 1 }}>{e.time} · {e.category} · {e.place}</div>
      </div>
    </div>
  );
}

function DaySheet({ day, month, year, events, role, onClose, onCreate }) {
  const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 44px', maxHeight: '80%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 1, fontWeight: 700, color: TZ.muted, textTransform: 'uppercase' }}>
              {months[month]} {year}
            </div>
            <div style={{ fontSize: 28, fontWeight: 800, color: TZ.ink, letterSpacing: -0.5, marginTop: 2 }}>{day}</div>
          </div>
          {(role === 'admin' || role === 'coach') && (
            <button onClick={() => { onClose(); onCreate && onCreate(); }} style={{
              padding: '8px 12px', borderRadius: 999, border: 0,
              background: TZ.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              <Icon name="plus" size={14} color="#fff" />
              Añadir
            </button>
          )}
        </div>

        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {events.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: TZ.muted, fontSize: 13, fontStyle: 'italic' }}>
              No hay actividades este día
            </div>
          ) : events.map(e => <FullEventCard key={e.id} e={e} role={role} />)}
        </div>
      </div>
    </div>
  );
}

function FullEventCard({ e, role }) {
  const bg = e.kind === 'match' ? '#F5B301' : e.kind === 'tournament' ? '#7C3AED' : TZ.primary;
  const label = e.kind === 'match' ? 'PARTIDO' : e.kind === 'tournament' ? 'TORNEO' : 'ENTRENO';
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, overflow: 'hidden' }}>
      <div style={{ display: 'flex', gap: 12, padding: 14 }}>
        <div style={{ width: 4, background: bg, borderRadius: 2, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.6, padding: '2px 8px', borderRadius: 999,
              background: bg + '22', color: bg,
            }}>{label}</span>
            <span style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{e.category}</span>
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: TZ.ink, marginTop: 6 }}>{e.title}</div>
          <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 4 }}>
            <strong style={{ color: TZ.ink }}>{e.time}</strong> · {e.place}
          </div>
        </div>
      </div>
      {role === 'parent' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid ' + TZ.line }}>
          <button style={{ padding: '12px', border: 0, borderRight: '1px solid ' + TZ.line, background: 'transparent',
            color: TZ.err, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>No podrá ir</button>
          <button style={{ padding: '12px', border: 0, background: TZ.primary, color: '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Confirmar asistencia</button>
        </div>
      )}
      {role === 'coach' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid ' + TZ.line }}>
          <button style={{ padding: '12px', border: 0, borderRight: '1px solid ' + TZ.line, background: 'transparent',
            color: TZ.inkSoft, fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Ver detalles</button>
          <button style={{ padding: '12px', border: 0, background: TZ.primary, color: '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer' }}>Pasar lista / Convocar</button>
        </div>
      )}
    </div>
  );
}

function LegendDot({ color, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ fontSize: 11, color: TZ.inkSoft, fontWeight: 600 }}>{label}</span>
    </div>
  );
}

const arrBtn = {
  width: 30, height: 30, borderRadius: '50%', border: 0,
  background: 'rgba(255,255,255,0.15)', color: '#fff',
  fontSize: 18, fontWeight: 700, cursor: 'pointer',
};

Object.assign(window, { CalendarScreen });
