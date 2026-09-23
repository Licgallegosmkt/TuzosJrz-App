// TuzosJrz — Admin: bulk export player documents for tournament registration

function TournamentExport({ back }) {
  const { PLAYERS, CATEGORIES } = window.TZ_DATA;
  const [category, setCategory] = React.useState('Sub-12');
  const [packageName, setPackageName] = React.useState('Torneo Interfilial 2026');
  const [selectedIds, setSelectedIds] = React.useState(new Set());
  const [tick, setTick] = React.useState(0);
  const [generating, setGenerating] = React.useState(false);

  React.useEffect(() => {
    const h = () => setTick(t => t + 1);
    window.addEventListener('tz-docs-change', h);
    return () => window.removeEventListener('tz-docs-change', h);
  }, []);

  const roster = PLAYERS.filter(p => p.category === category);
  const rosterCompletion = React.useMemo(() =>
    roster.map(p => ({
      ...p,
      completion: window.docsCompletionForPlayer(p.id),
    })), [category, tick]);

  const toggle = (id) => setSelectedIds(s => {
    const n = new Set(s);
    if (n.has(id)) n.delete(id); else n.add(id);
    return n;
  });
  const toggleAll = () => {
    if (selectedIds.size === roster.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(roster.map(p => p.id)));
  };
  const toggleAllComplete = () => {
    const complete = roster.filter(p => window.docsCompletionForPlayer(p.id).pct === 100).map(p => p.id);
    setSelectedIds(new Set(complete));
  };

  const selectedPlayers = rosterCompletion.filter(p => selectedIds.has(p.id));
  const totalCompleteInSelection = selectedPlayers.filter(p => p.completion.pct === 100).length;
  const totalMissingInSelection = selectedPlayers.filter(p => p.completion.pct < 100).length;

  const handleGenerate = async () => {
    if (selectedIds.size === 0) return;
    setGenerating(true);
    try {
      await window.downloadDocsForPlayers(Array.from(selectedIds), packageName);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{
        padding: '54px 20px 18px',
        background: `linear-gradient(155deg, #B45309 0%, #78350F 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={back} style={{
            width: 36, height: 36, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={18} color="#fff" />
          </button>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>ADMINISTRACIÓN</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 8 }}>
              🏆 Paquete para torneo
            </div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
              Descarga los documentos de varios jugadores en un solo ZIP
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Nombre del paquete */}
        <SectionTitle>Nombre del paquete</SectionTitle>
        <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: '10px 14px' }}>
          <input value={packageName} onChange={e => setPackageName(e.target.value)}
            placeholder="Ej. Torneo Interfilial 2026"
            style={{
              width: '100%', border: 0, outline: 'none', fontSize: 14,
              color: TZ.ink, fontWeight: 500, fontFamily: 'inherit',
            }} />
        </div>

        {/* Categoría */}
        <SectionTitle>Categoría</SectionTitle>
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -16px', padding: '2px 16px 4px' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => { setCategory(c); setSelectedIds(new Set()); }} style={{
              padding: '8px 14px', borderRadius: 999, border: 0, whiteSpace: 'nowrap',
              background: category === c ? TZ.ink : '#fff',
              color: category === c ? '#fff' : TZ.inkSoft,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: category === c ? 'none' : '0 1px 2px rgba(15,23,42,0.06)',
              border: category === c ? 0 : '1px solid ' + TZ.line,
            }}>{c}</button>
          ))}
        </div>

        {/* Bulk actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={toggleAll} style={quickBtn}>
            {selectedIds.size === roster.length ? '☐ Deseleccionar todos' : '☑ Seleccionar todos'}
          </button>
          <button onClick={toggleAllComplete} style={quickBtn}>
            ✓ Solo con docs completos
          </button>
        </div>

        {/* Roster list */}
        <SectionTitle>Jugadores · {category}</SectionTitle>
        <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, overflow: 'hidden' }}>
          {rosterCompletion.map((p, i) => {
            const on = selectedIds.has(p.id);
            const isComplete = p.completion.pct === 100;
            return (
              <div key={p.id} onClick={() => toggle(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                cursor: 'pointer', background: on ? 'rgba(29,61,138,0.04)' : 'transparent',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: on ? 0 : '1.5px solid #CBD1DC',
                  background: on ? TZ.primary : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  {on && <Icon name="check" size={16} color="#fff" strokeWidth={3} />}
                </div>
                <Avatar player={p} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
                    #{p.number} · {p.position}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                  <window.DocsProgressPill playerId={p.id} />
                  {!isComplete && <span style={{ fontSize: 10, color: TZ.warn, fontWeight: 700 }}>Incompleto</span>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary + generate button */}
        {selectedIds.size > 0 && (
          <>
            <div style={{
              marginTop: 20, padding: 14, borderRadius: 12,
              background: totalMissingInSelection > 0 ? '#FFFBEB' : '#F0FDF4',
              border: '1px solid ' + (totalMissingInSelection > 0 ? '#FDE68A' : '#BBF7D0'),
              fontSize: 12, color: totalMissingInSelection > 0 ? '#78350F' : '#166534',
              lineHeight: 1.5,
            }}>
              <div style={{ fontWeight: 800, fontSize: 13, marginBottom: 6 }}>
                📦 Resumen del paquete
              </div>
              <div>{selectedIds.size} jugador{selectedIds.size !== 1 ? 'es' : ''} seleccionado{selectedIds.size !== 1 ? 's' : ''}</div>
              <div>✓ {totalCompleteInSelection} con documentación completa</div>
              {totalMissingInSelection > 0 && (
                <div>⚠️ {totalMissingInSelection} con documentos faltantes (se incluyen los que sí tienen)</div>
              )}
            </div>

            <button onClick={handleGenerate} disabled={generating} style={{
              width: '100%', marginTop: 14, padding: '15px', borderRadius: 12, border: 0,
              background: generating ? '#78350F' : 'linear-gradient(135deg, #F5B301, #E5A300)',
              color: generating ? '#F5B301' : '#0F2560',
              fontSize: 15, fontWeight: 800, cursor: generating ? 'wait' : 'pointer',
              boxShadow: '0 6px 16px rgba(245,179,1,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {generating ? 'Generando ZIP…' : `📦 Descargar ZIP · ${selectedIds.size} jugadores`}
            </button>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 6, textAlign: 'center' }}>
              El ZIP incluye una carpeta por jugador + un manifest.txt con el detalle
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const quickBtn = {
  flex: 1, padding: '10px', borderRadius: 10, border: '1px solid ' + TZ.line,
  background: '#fff', color: TZ.inkSoft, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
};

Object.assign(window, { TournamentExport });
