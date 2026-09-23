// TuzosJrz — Snacks module: rotation logic + UI

// LocalStorage-based history: who has brought snacks and how many times
// Keys: tz.snacks.history.<category> = [{ playerId, matchId, date }]
// Keys: tz.snacks.assignment.<matchId> = playerId (the one assigned for THIS match)

function getSnackHistory(category) {
  try { return JSON.parse(localStorage.getItem(`tz.snacks.history.${category}`) || '[]'); }
  catch { return []; }
}
function saveSnackHistory(category, history) {
  try { localStorage.setItem(`tz.snacks.history.${category}`, JSON.stringify(history)); } catch {}
}
function getSnackAssignment(matchId) {
  try { return localStorage.getItem(`tz.snacks.assignment.${matchId}`); } catch { return null; }
}
function saveSnackAssignment(matchId, playerId) {
  try { localStorage.setItem(`tz.snacks.assignment.${matchId}`, String(playerId)); } catch {}
}

// Seed some fake history so the demo shows realistic rotation
function seedSnackHistoryIfEmpty(category) {
  const h = getSnackHistory(category);
  if (h.length > 0) return;
  const players = window.TZ_DATA.PLAYERS.filter(p => p.category === category);
  if (players.length < 3) return;
  const seed = [
    { playerId: players[0].id, matchId: 'seed-1', date: '30 Ago 2026', label: 'vs Cruz Azul Jr.' },
    { playerId: players[3]?.id, matchId: 'seed-2', date: '6 Sep 2026',  label: 'vs León Jr.' },
    { playerId: players[7]?.id, matchId: 'seed-3', date: '13 Sep 2026', label: 'vs Rayados Jr.' },
  ].filter(x => x.playerId);
  saveSnackHistory(category, seed);
}

// Build a rotation order: pick players who have brought fewest times, earliest date first,
// filtered to those confirmed for the match.
function buildRotation(confirmedIds, category, history) {
  const counts = {};
  const lastDate = {};
  history.forEach((h, i) => {
    counts[h.playerId] = (counts[h.playerId] || 0) + 1;
    lastDate[h.playerId] = i; // higher = more recent
  });
  return confirmedIds
    .map(id => ({
      id,
      count: counts[id] || 0,
      last: lastDate[id] ?? -1,
    }))
    .sort((a, b) => a.count - b.count || a.last - b.last)
    .map(x => x.id);
}

// ── Snack step (inside CreateMatch flow) ─────────────────────
function SnackAssignmentPicker({ category, matchId, confirmedIds, onChange, initialSelected }) {
  const [autoMode, setAutoMode] = React.useState(true);
  React.useEffect(() => seedSnackHistoryIfEmpty(category), [category]);
  const history = getSnackHistory(category);
  const rotation = buildRotation(confirmedIds, category, history);
  const players = window.TZ_DATA.PLAYERS;
  const findP = (id) => players.find(p => p.id === id);

  const [selectedId, setSelectedId] = React.useState(initialSelected || rotation[0]);
  React.useEffect(() => {
    if (autoMode) setSelectedId(rotation[0]);
  }, [autoMode]);
  React.useEffect(() => { onChange && onChange(selectedId); }, [selectedId]);

  const selectedPlayer = findP(selectedId);

  // Count per player
  const counts = {};
  history.forEach(h => { counts[h.playerId] = (counts[h.playerId] || 0) + 1; });

  return (
    <div style={{ padding: '18px 16px 0' }}>
      <div style={{
        padding: '12px 14px', background: '#FFFBEB', border: '1px solid #FDE68A',
        borderRadius: 10, marginBottom: 14,
        display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: '#78350F',
      }}>
        <span style={{ fontSize: 16 }}>🍎</span>
        <span>Elige quién lleva el <strong>snack post-partido</strong> para el equipo. Sugerimos automáticamente al jugador que menos veces ha llevado.</span>
      </div>

      {/* Selected card — big & clear */}
      {selectedPlayer && (
        <div style={{
          background: `linear-gradient(135deg, #F5B301 0%, #E5A300 100%)`,
          borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -14, right: -6, fontSize: 74, opacity: 0.14 }}>🍎</div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#78350F', letterSpacing: 1.5 }}>SNACK ASIGNADO</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, position: 'relative' }}>
            <Avatar player={selectedPlayer} size={54} showNumber={false} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 17, fontWeight: 800, color: '#0F2560' }}>{selectedPlayer.name}</div>
              <div style={{ fontSize: 12, color: '#78350F', marginTop: 2 }}>
                {selectedPlayer.tutor
                  ? `${selectedPlayer.tutor.name} (${selectedPlayer.tutor.relation})`
                  : 'Padre / tutor'}
              </div>
            </div>
          </div>
          <div style={{
            marginTop: 12, padding: '6px 10px', background: 'rgba(255,255,255,0.7)',
            borderRadius: 8, fontSize: 11, fontWeight: 700, color: '#78350F',
            display: 'inline-flex', alignItems: 'center', gap: 6,
          }}>
            {counts[selectedPlayer.id]
              ? `Ha llevado ${counts[selectedPlayer.id]} vez${counts[selectedPlayer.id] > 1 ? 'es' : ''} en la temporada`
              : 'Nunca ha llevado · le toca 🎯'}
          </div>
        </div>
      )}

      {/* Mode switch */}
      <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 12, padding: 4, marginTop: 14 }}>
        {[
          { id: true,  label: '🔁 Rotación automática' },
          { id: false, label: '✏️ Elegir manualmente' },
        ].map(m => (
          <button key={m.id} onClick={() => setAutoMode(m.id)} style={{
            flex: 1, padding: '10px 6px', border: 0, borderRadius: 9,
            background: autoMode === m.id ? '#fff' : 'transparent',
            color: autoMode === m.id ? TZ.ink : TZ.inkSoft,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: autoMode === m.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{m.label}</button>
        ))}
      </div>

      {/* Full rotation list */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
          Orden sugerido de rotación
        </div>
        <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, overflow: 'hidden' }}>
          {rotation.map((id, i) => {
            const p = findP(id);
            if (!p) return null;
            const isSelected = id === selectedId;
            return (
              <div key={id} onClick={() => { setAutoMode(false); setSelectedId(id); }} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                cursor: 'pointer',
                background: isSelected ? 'rgba(245,179,1,0.10)' : 'transparent',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 12,
                  background: i === 0 ? '#F5B301' : '#EEF0F4',
                  color: i === 0 ? TZ.primaryDark : TZ.inkSoft,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                }}>{i + 1}</div>
                <Avatar player={p} size={34} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink }}>{p.name}</div>
                  <div style={{ fontSize: 10, color: TZ.muted, marginTop: 1 }}>
                    {p.category} · Llevó snack {counts[id] || 0}× en la temporada
                  </div>
                </div>
                {isSelected && (
                  <span style={{
                    fontSize: 10, fontWeight: 800, letterSpacing: 0.5, padding: '3px 8px',
                    borderRadius: 999, background: '#F5B301', color: TZ.primaryDark,
                  }}>ASIGNADO</span>
                )}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 8, paddingLeft: 4 }}>
          Solo aparecen los <strong style={{ color: TZ.inkSoft }}>{confirmedIds.length} confirmados</strong> para este partido. Los que aún no confirmen podrán entrar a la lista cuando lo hagan.
        </div>
      </div>
    </div>
  );
}

// ── Snack widget (Home padre + Coach + Dashboard admin) ──────
function NextSnackWidget({ role, category }) {
  // In prototype, mock: assume next match has some confirmed player and snack assigned
  const cat = category || 'Sub-12';
  seedSnackHistoryIfEmpty(cat);
  const history = getSnackHistory(cat);
  const players = window.TZ_DATA.PLAYERS.filter(p => p.category === cat);
  // Mock next match: assign the first player in rotation
  const confirmed = players.slice(0, 12).map(p => p.id);
  const rotation = buildRotation(confirmed, cat, history);
  const nextP = players.find(p => p.id === rotation[0]);
  if (!nextP) return null;

  const isMe = role === 'parent' && nextP.first === 'Diego'; // simulate parent is Diego's dad
  const upcoming = { title: 'vs Tigres Jr.', date: 'Sáb 26 Sep · 10:30' };

  return (
    <div style={{
      background: `linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)`,
      borderRadius: 16, padding: 14, border: '1px solid #FCD34D',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -12, right: -6, fontSize: 64, opacity: 0.16, pointerEvents: 'none' }}>🍎</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: '#F5B301', color: '#0F2560',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
        }}>🍎</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#B45309', letterSpacing: 1.2 }}>SNACK · PRÓXIMO PARTIDO</div>
          <div style={{ fontSize: 12, fontWeight: 700, color: '#78350F', marginTop: 2 }}>{upcoming.title} · {upcoming.date.split('·')[0].trim()}</div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, position: 'relative' }}>
        <Avatar player={nextP} size={44} showNumber={false} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#78350F' }}>
            {isMe ? 'Te toca a ti 🎯' : `${nextP.first} ${nextP.last}`}
          </div>
          <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>
            {nextP.tutor ? `${nextP.tutor.name} (${nextP.tutor.relation})` : ''} · {cat}
          </div>
        </div>
        {isMe && (
          <div style={{
            padding: '6px 10px', borderRadius: 999,
            background: '#78350F', color: '#F5B301', fontSize: 11, fontWeight: 800,
          }}>TU TURNO</div>
        )}
      </div>

      {/* Next 2 in the queue */}
      {rotation.length > 1 && (
        <div style={{
          marginTop: 12, paddingTop: 10, borderTop: '1px dashed rgba(120,53,15,0.25)',
          display: 'flex', gap: 8, alignItems: 'center', position: 'relative',
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: '#78350F', textTransform: 'uppercase', letterSpacing: 0.5 }}>Después:</span>
          {rotation.slice(1, 4).map((id, i) => {
            const p = players.find(x => x.id === id);
            if (!p) return null;
            return (
              <div key={id} style={{ display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.7)', borderRadius: 999, padding: '3px 8px 3px 3px' }}>
                <Avatar player={p} size={20} showNumber={false} />
                <span style={{ fontSize: 10, fontWeight: 700, color: '#78350F' }}>{p.first}</span>
              </div>
            );
          })}
        </div>
      )}

      {role === 'parent' && !isMe && (
        <button style={{
          marginTop: 12, padding: '9px 14px', borderRadius: 999, border: 0,
          background: 'rgba(120,53,15,0.15)', color: '#78350F',
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
        }}>Ver rotación completa</button>
      )}
    </div>
  );
}

Object.assign(window, {
  SnackAssignmentPicker, NextSnackWidget,
  getSnackHistory, saveSnackHistory, getSnackAssignment, saveSnackAssignment,
  seedSnackHistoryIfEmpty, buildRotation,
});
