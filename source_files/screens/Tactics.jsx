// TuzosJrz — Pizarra táctica (extendida: materiales + flechas + capas + plantillas)

// Items model
// Player:   { kind:'player', id, team:'h'|'a', num, x, y }
// Material: { kind:'material', id, materialId, color?, x, y, w, h, rotation }
// Arrow:    { kind:'arrow', id, type, path:[{x,y},...], color? }

function Tactics({ nav, fullscreen, setFullscreen }) {
  const { FORMATIONS_11, FORMATIONS_8 } = window.TZ_DATA;
  const [mode, setMode] = React.useState('11v11');
  const [formation, setFormation] = React.useState('4-3-3');
  const [team, setTeam] = React.useState('home');
  const [items, setItems] = React.useState([]);       // unified list
  const [selectedId, setSelectedId] = React.useState(null);
  const [drawing, setDrawing] = React.useState(null); // {type, path}
  const [tool, setTool] = React.useState('move');     // move | arrow | erase
  const [arrowType, setArrowType] = React.useState('simple');
  const [layers, setLayers] = React.useState({ players: true, materials: true, arrows: true });
  const [panel, setPanel] = React.useState('players'); // players | materials | arrows | templates
  const [panelOpen, setPanelOpen] = React.useState(true);

  const formations = mode === '11v11' ? FORMATIONS_11 : FORMATIONS_8;
  const formationKeys = Object.keys(formations);

  // Load formation into players
  React.useEffect(() => {
    setFormation(formationKeys[0]);
  }, [mode]);

  React.useEffect(() => {
    const base = formations[formation] || formations[formationKeys[0]];
    if (!base) return;
    const playerItems = [];
    base.forEach((pt, i) => {
      playerItems.push({ kind: 'player', id: `p-h-${i}`, team: 'h', num: i + 1, x: pt.x, y: pt.y });
      playerItems.push({ kind: 'player', id: `p-a-${i}`, team: 'a', num: i + 1, x: 100 - pt.x, y: pt.y });
    });
    // Keep non-player items when only formation changes
    setItems(prev => [...playerItems, ...prev.filter(it => it.kind !== 'player')]);
    setSelectedId(null);
  }, [formation, mode]);

  const addMaterial = (materialId) => {
    const mat = window.MATERIAL_CATALOG.find(m => m.id === materialId);
    if (!mat) return;
    const id = 'm-' + Date.now();
    setItems(prev => [...prev, {
      kind: 'material', id, materialId,
      color: mat.hasColor ? mat.defaultColor : undefined,
      x: 50, y: 50, w: mat.w, h: mat.h, rotation: 0,
    }]);
    setSelectedId(id);
  };

  const updateItem = (id, patch) => {
    setItems(prev => prev.map(it => it.id === id ? { ...it, ...patch } : it));
  };
  const deleteItem = (id) => {
    setItems(prev => prev.filter(it => it.id !== id));
    setSelectedId(null);
  };
  const duplicateItem = (id) => {
    const src = items.find(it => it.id === id);
    if (!src) return;
    const newId = src.kind + '-' + Date.now();
    const copy = { ...src, id: newId, x: Math.min(95, src.x + 5), y: Math.min(95, src.y + 5) };
    setItems(prev => [...prev, copy]);
    setSelectedId(newId);
  };

  const clearAll = (kind) => {
    setItems(prev => prev.filter(it => it.kind !== kind));
    setSelectedId(null);
  };

  return (
    <div style={{
      position: fullscreen ? 'fixed' : 'relative',
      inset: fullscreen ? 0 : 'auto',
      background: fullscreen ? '#0B1220' : 'transparent',
      zIndex: fullscreen ? 200 : 'auto',
      height: fullscreen ? '100vh' : 'auto',
      paddingBottom: fullscreen ? 0 : 100,
    }}>
      {!fullscreen && (
        <ScreenHeader
          title="Pizarra táctica"
          subtitle={`${mode} · ${formation}`}
          right={
            <button onClick={() => setFullscreen(true)} style={{
              padding: '8px 14px', borderRadius: 999, border: 0,
              background: TZ.ink, color: '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 5,
            }}>
              <Icon name="board" size={14} color="#fff" />
              Fullscreen
            </button>
          }
        />
      )}

      {fullscreen && (
        <div style={{
          padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={() => setFullscreen(false)} style={fullBtnDark}>
              <Icon name="chevronL" size={18} color="#fff" />
            </button>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301', textTransform: 'uppercase' }}>Pizarra</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#fff' }}>{mode} · {formation}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <LayerToggles layers={layers} setLayers={setLayers} />
            <button style={{ ...fullBtnDark, background: '#F5B301', color: TZ.primaryDark }}
              onClick={() => setPanel('templates')}>
              <Icon name="doc" size={16} color={TZ.primaryDark} />
            </button>
          </div>
        </div>
      )}

      <div style={{
        display: fullscreen ? 'flex' : 'block',
        gap: fullscreen ? 12 : 0,
        padding: fullscreen ? '12px' : '0 16px',
        height: fullscreen ? 'calc(100vh - 80px)' : 'auto',
      }}>
        {/* Compact mobile controls */}
        {!fullscreen && (
          <div style={{ display: 'flex', background: TZ.ink, borderRadius: 14, padding: 4, marginBottom: 12 }}>
            {['11v11', '8v8'].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: '12px', border: 0, borderRadius: 10,
                background: mode === m ? '#F5B301' : 'transparent',
                color: mode === m ? TZ.primaryDark : 'rgba(255,255,255,0.7)',
                fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.5,
                fontFamily: '"Barlow Condensed", sans-serif',
              }}>
                FÚTBOL {m}
              </button>
            ))}
          </div>
        )}

        {/* Fullscreen controls bar (top of pitch column) */}
        {fullscreen && (
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <SegBar label="Modalidad" options={['11v11', '8v8']} value={mode} onChange={setMode} dark />
              <SegBar label="Formación" options={formationKeys} value={formation} onChange={setFormation} dark />
              <SegBar label="Equipos" options={[
                { id: 'home', label: 'Local' },
                { id: 'away', label: 'Rival' },
                { id: 'both', label: 'Ambos' },
              ]} value={team} onChange={setTeam} dark />
              <div style={{ flex: 1 }} />
              <SegBar label="Herramienta" options={[
                { id: 'move',  label: '✋' },
                { id: 'arrow', label: '↗️' },
                { id: 'erase', label: '🧽' },
              ]} value={tool} onChange={setTool} dark />
            </div>

            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <Pitch
                mode={mode}
                items={items}
                setItems={setItems}
                team={team}
                fullscreen={fullscreen}
                tool={tool}
                arrowType={arrowType}
                drawing={drawing}
                setDrawing={setDrawing}
                selectedId={selectedId}
                setSelectedId={setSelectedId}
                updateItem={updateItem}
                deleteItem={deleteItem}
                duplicateItem={duplicateItem}
                layers={layers}
              />
            </div>
          </div>
        )}

        {/* Compact pitch (mobile) */}
        {!fullscreen && (
          <Pitch
            mode={mode}
            items={items}
            setItems={setItems}
            team={team}
            fullscreen={false}
            tool={tool}
            arrowType={arrowType}
            drawing={drawing}
            setDrawing={setDrawing}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            updateItem={updateItem}
            deleteItem={deleteItem}
            duplicateItem={duplicateItem}
            layers={layers}
          />
        )}

        {/* SIDE PANEL — fullscreen only */}
        {fullscreen && (
          <SidePanel
            open={panelOpen}
            setOpen={setPanelOpen}
            panel={panel}
            setPanel={setPanel}
            addMaterial={addMaterial}
            arrowType={arrowType}
            setArrowType={setArrowType}
            tool={tool}
            setTool={setTool}
            items={items}
            setItems={setItems}
            clearAll={clearAll}
            mode={mode}
            formation={formation}
          />
        )}

        {/* Compact mobile controls below pitch */}
        {!fullscreen && (
          <>
            <SectionTitle>Formación</SectionTitle>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto', margin: '0 -16px', padding: '2px 16px 4px' }}>
              {formationKeys.map(f => (
                <button key={f} onClick={() => setFormation(f)} style={{
                  padding: '10px 16px', borderRadius: 12, border: 0,
                  background: formation === f ? TZ.primary : '#fff',
                  color: formation === f ? '#fff' : TZ.ink,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  boxShadow: formation === f ? '0 2px 6px rgba(29,61,138,0.3)' : '0 1px 2px rgba(15,23,42,0.06)',
                  border: formation === f ? 0 : '1px solid ' + TZ.line,
                  fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: 1,
                }}>{f}</button>
              ))}
            </div>

            <SectionTitle>Equipos en la cancha</SectionTitle>
            <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
              {[
                { id: 'home', label: 'Solo local' },
                { id: 'away', label: 'Solo rival' },
                { id: 'both', label: 'Ambos' },
              ].map(t => (
                <button key={t.id} onClick={() => setTeam(t.id)} style={{
                  flex: 1, padding: '10px', border: 0, borderRadius: 9,
                  background: team === t.id ? '#fff' : 'transparent',
                  color: team === t.id ? TZ.ink : TZ.inkSoft,
                  fontSize: 12, fontWeight: 700, cursor: 'pointer',
                  boxShadow: team === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                }}>{t.label}</button>
              ))}
            </div>

            <SectionTitle>Materiales de entrenamiento</SectionTitle>
            <div style={{
              background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
              padding: 8, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6,
            }}>
              {window.MATERIAL_CATALOG.map(m => (
                <button key={m.id} onClick={() => addMaterial(m.id)} style={{
                  background: '#F4F5F8', border: 0, borderRadius: 10, padding: '10px 4px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, cursor: 'pointer',
                }}>
                  <div style={{ height: 32, display: 'flex', alignItems: 'center' }}>
                    <MaterialThumb material={m} size={28} />
                  </div>
                  <span style={{ fontSize: 9, fontWeight: 700, color: TZ.inkSoft, textAlign: 'center', lineHeight: 1.2 }}>{m.label}</span>
                </button>
              ))}
            </div>

            <SectionTitle>Consejo</SectionTitle>
            <div style={{ padding: '10px 12px', background: '#EFF6FF', border: '1px solid #DBEAFE',
              borderRadius: 10, fontSize: 12, color: '#1E3A8A', lineHeight: 1.5 }}>
              💡 Para experiencia completa (dibujar flechas, guardar plantillas, capas), abre la pizarra en <strong>Fullscreen</strong> desde el botón arriba.
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── SIDE PANEL (fullscreen) ─────────────────────────────────
function SidePanel({ open, setOpen, panel, setPanel, addMaterial, arrowType, setArrowType, tool, setTool, items, setItems, clearAll, mode, formation }) {
  const [showTemplates, setShowTemplates] = React.useState(false);

  const tabs = [
    { id: 'players',   icon: '👥', label: 'Jugadores' },
    { id: 'materials', icon: '🧡', label: 'Materiales' },
    { id: 'arrows',    icon: '↗️', label: 'Flechas' },
    { id: 'templates', icon: '💾', label: 'Guardar' },
  ];

  return (
    <div style={{
      width: open ? 260 : 44,
      background: 'rgba(11,18,32,0.9)',
      backdropFilter: 'blur(20px)',
      borderRadius: 14,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      transition: 'width 0.2s',
      color: '#fff', flexShrink: 0,
    }}>
      {/* Collapse toggle */}
      <button onClick={() => setOpen(!open)} style={{
        padding: '10px 8px', background: 'rgba(255,255,255,0.05)', border: 0, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: open ? 'space-between' : 'center', gap: 8,
        borderBottom: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer',
      }}>
        {open && <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: 1, color: '#F5B301' }}>PANEL</span>}
        <span style={{ fontSize: 16 }}>{open ? '›' : '‹'}</span>
      </button>

      {open && (
        <>
          {/* Tab strip */}
          <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setPanel(t.id)} style={{
                flex: 1, padding: '10px 4px', border: 0, background: panel === t.id ? 'rgba(245,179,1,0.2)' : 'transparent',
                color: panel === t.id ? '#F5B301' : 'rgba(255,255,255,0.6)', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
                borderBottom: panel === t.id ? '2px solid #F5B301' : '2px solid transparent',
              }}>
                <span style={{ fontSize: 16 }}>{t.icon}</span>
                <span style={{ fontSize: 9, fontWeight: 700 }}>{t.label}</span>
              </button>
            ))}
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
            {panel === 'players' && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5 }}>
                Selecciona <strong style={{ color: '#fff' }}>formación</strong> arriba. Arrastra fichas en la cancha para reposicionarlas.
                <div style={{ marginTop: 12, padding: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 8 }}>
                  <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, letterSpacing: 0.5 }}>ACTUAL</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginTop: 4, color: '#F5B301',
                    fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: 1 }}>{mode} · {formation}</div>
                </div>
              </div>
            )}

            {panel === 'materials' && (
              <>
                <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, letterSpacing: 0.6, marginBottom: 8 }}>
                  TAP PARA AÑADIR
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  {window.MATERIAL_CATALOG.map(m => (
                    <button key={m.id} onClick={() => addMaterial(m.id)} style={{
                      background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, padding: '10px 4px', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                    }}>
                      <div style={{ height: 32, display: 'flex', alignItems: 'center' }}>
                        <MaterialThumb material={m} size={28} dark />
                      </div>
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#fff', textAlign: 'center', lineHeight: 1.2 }}>{m.label}</span>
                    </button>
                  ))}
                </div>
                {items.filter(i => i.kind === 'material').length > 0 && (
                  <button onClick={() => clearAll('material')} style={{
                    marginTop: 12, width: '100%', padding: 8, border: '1px solid rgba(220,38,38,0.5)',
                    background: 'transparent', color: '#FCA5A5', borderRadius: 8,
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>Limpiar materiales</button>
                )}
              </>
            )}

            {panel === 'arrows' && (
              <>
                <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, letterSpacing: 0.6, marginBottom: 8 }}>
                  ELIGE Y DIBUJA EN LA CANCHA
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {ARROW_TYPES.map(a => (
                    <button key={a.id} onClick={() => { setArrowType(a.id); setTool('arrow'); }} style={{
                      background: (tool === 'arrow' && arrowType === a.id) ? 'rgba(245,179,1,0.2)' : 'rgba(255,255,255,0.06)',
                      border: (tool === 'arrow' && arrowType === a.id) ? '1px solid #F5B301' : '1px solid rgba(255,255,255,0.08)',
                      borderRadius: 8, padding: 8, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                    }}>
                      <div style={{ width: 44, height: 22, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                        <ArrowPreview type={a.id} />
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', flex: 1 }}>{a.label}</span>
                    </button>
                  ))}
                </div>
                {items.filter(i => i.kind === 'arrow').length > 0 && (
                  <button onClick={() => clearAll('arrow')} style={{
                    marginTop: 12, width: '100%', padding: 8, border: '1px solid rgba(220,38,38,0.5)',
                    background: 'transparent', color: '#FCA5A5', borderRadius: 8,
                    fontSize: 11, fontWeight: 700, cursor: 'pointer',
                  }}>Limpiar trazos</button>
                )}
              </>
            )}

            {panel === 'templates' && (
              <TemplatesPanel items={items} setItems={setItems} mode={mode} formation={formation} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── ARROW TYPES ─────────────────────────────────────────────
const ARROW_TYPES = [
  { id: 'simple',   label: 'Movimiento recto' },
  { id: 'wavy',     label: 'Drible / conducción' },
  { id: 'dashed',   label: 'Pase largo' },
  { id: 'curve',    label: 'Recorrido con curva' },
  { id: 'dotted',   label: 'Visión / desmarque' },
  { id: 'double',   label: 'Ida y vuelta' },
  { id: 'rotation', label: 'Rotación' },
];

function ArrowPreview({ type }) {
  const stroke = '#F5B301';
  const w = 42, h = 20;
  const commonHead = <polygon points="38,10 30,6 32,10 30,14" fill={stroke} />;
  switch (type) {
    case 'simple':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><line x1="4" y1="10" x2="34" y2="10" stroke={stroke} strokeWidth="2" />{commonHead}</svg>;
    case 'wavy':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><path d="M4 10 Q 10 4, 16 10 T 28 10 T 34 10" stroke={stroke} strokeWidth="2" fill="none"/>{commonHead}</svg>;
    case 'dashed':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><line x1="4" y1="10" x2="34" y2="10" stroke={stroke} strokeWidth="2" strokeDasharray="5 3" />{commonHead}</svg>;
    case 'curve':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><path d="M4 15 Q 20 -2, 34 10" stroke={stroke} strokeWidth="2" fill="none"/>{commonHead}</svg>;
    case 'dotted':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><line x1="4" y1="10" x2="38" y2="10" stroke={stroke} strokeWidth="2" strokeDasharray="1.5 3" strokeLinecap="round" /></svg>;
    case 'double':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><line x1="8" y1="10" x2="34" y2="10" stroke={stroke} strokeWidth="2" />{commonHead}<polygon points="4,10 12,6 10,10 12,14" fill={stroke} /></svg>;
    case 'rotation':
      return <svg viewBox={`0 0 ${w} ${h}`} width="42" height="20"><path d="M 30 6 A 8 8 0 1 1 22 6" stroke={stroke} strokeWidth="2" fill="none"/><polygon points="32,4 24,4 28,10" fill={stroke} /></svg>;
    default: return null;
  }
}

// Render arrow on the pitch
function ArrowShape({ item, pitchW, pitchH, onClick, selected }) {
  const stroke = '#F5B301';
  const path = item.path;
  if (!path || path.length < 2) return null;

  // Convert % coords to viewBox 0-100
  const toX = p => p.x;
  const toY = p => p.y * 0.66;
  const first = path[0], last = path[path.length - 1];

  let d = '';
  if (item.type === 'wavy') {
    // wavy path — sinusoidal along direction
    const dx = last.x - first.x;
    const dy = last.y - first.y;
    const len = Math.hypot(dx, dy);
    const nx = -dy / len; const ny = dx / len;
    const wavelen = 6;
    const amp = 2;
    let waveD = `M ${toX(first)} ${toY(first)}`;
    for (let s = 0; s <= len; s += 1) {
      const t = s / len;
      const cx = first.x + dx * t;
      const cy = first.y + dy * t;
      const wave = Math.sin((s / wavelen) * Math.PI * 2) * amp;
      waveD += ` L ${cx + nx * wave} ${(cy + ny * wave) * 0.66}`;
    }
    d = waveD;
  } else if (item.type === 'curve') {
    const mx = (first.x + last.x) / 2;
    const my = Math.min(first.y, last.y) - 12;
    d = `M ${toX(first)} ${toY(first)} Q ${mx} ${my * 0.66} ${toX(last)} ${toY(last)}`;
  } else if (item.type === 'rotation') {
    const cx = (first.x + last.x) / 2;
    const cy = (first.y + last.y) / 2;
    const r = Math.max(4, Math.hypot(last.x - first.x, last.y - first.y) / 2);
    d = `M ${cx + r} ${cy * 0.66} A ${r} ${r * 0.66} 0 1 1 ${cx - r} ${cy * 0.66}`;
  } else {
    // simple/dashed/dotted/double: polyline through all points
    d = `M ${toX(path[0])} ${toY(path[0])}`;
    path.slice(1).forEach(pt => { d += ` L ${toX(pt)} ${toY(pt)}`; });
  }

  const dashArr = item.type === 'dashed' ? '2.5 1.8' : item.type === 'dotted' ? '0.7 1.5' : undefined;
  const angle = Math.atan2(last.y - path[path.length - 2].y, last.x - path[path.length - 2].x);
  const headSize = 2;

  return (
    <g onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
      style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <path d={d} stroke={stroke} strokeWidth={selected ? 0.9 : 0.6} fill="none"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={dashArr}
        filter={selected ? 'drop-shadow(0 0 2px rgba(245,179,1,0.8))' : undefined} />
      {/* Arrow head */}
      {item.type !== 'dotted' && item.type !== 'rotation' && (
        <polygon
          points={`
            ${toX(last)},${toY(last)}
            ${toX(last) - Math.cos(angle - 0.5) * headSize},${toY(last) - Math.sin(angle - 0.5) * headSize * 0.66}
            ${toX(last) - Math.cos(angle) * headSize * 0.5},${toY(last) - Math.sin(angle) * headSize * 0.5 * 0.66}
            ${toX(last) - Math.cos(angle + 0.5) * headSize},${toY(last) - Math.sin(angle + 0.5) * headSize * 0.66}
          `} fill={stroke} />
      )}
      {item.type === 'double' && (
        <polygon
          points={`
            ${toX(first)},${toY(first)}
            ${toX(first) + Math.cos(angle - 0.5) * headSize},${toY(first) + Math.sin(angle - 0.5) * headSize * 0.66}
            ${toX(first) + Math.cos(angle) * headSize * 0.5},${toY(first) + Math.sin(angle) * headSize * 0.5 * 0.66}
            ${toX(first) + Math.cos(angle + 0.5) * headSize},${toY(first) + Math.sin(angle + 0.5) * headSize * 0.66}
          `} fill={stroke} />
      )}
    </g>
  );
}

// ── LAYER TOGGLES ───────────────────────────────────────────
function LayerToggles({ layers, setLayers }) {
  const items = [
    { id: 'players',   icon: '👥' },
    { id: 'materials', icon: '🧡' },
    { id: 'arrows',    icon: '↗️' },
  ];
  return (
    <div style={{
      display: 'flex', gap: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 10, padding: 3,
    }}>
      {items.map(it => (
        <button key={it.id} onClick={() => setLayers(l => ({ ...l, [it.id]: !l[it.id] }))} style={{
          width: 34, height: 34, borderRadius: 7, border: 0, cursor: 'pointer',
          background: layers[it.id] ? '#F5B301' : 'transparent',
          color: layers[it.id] ? '#000' : 'rgba(255,255,255,0.5)',
          fontSize: 16, opacity: layers[it.id] ? 1 : 0.5,
        }}>{it.icon}</button>
      ))}
    </div>
  );
}

// ── TEMPLATES PANEL ─────────────────────────────────────────
function TemplatesPanel({ items, setItems, mode, formation }) {
  const [tick, setTick] = React.useState(0);
  const [name, setName] = React.useState('');
  const [saved, setSaved] = React.useState(null);
  const templates = React.useMemo(() => {
    try { return JSON.parse(localStorage.getItem('tz.tactics.templates') || '[]'); }
    catch { return []; }
  }, [tick]);

  const save = () => {
    if (!name.trim()) return;
    const t = {
      id: 'tpl-' + Date.now(),
      name: name.trim(),
      mode, formation,
      items,
      createdAt: new Date().toLocaleDateString('es-MX'),
    };
    const list = [...templates, t];
    localStorage.setItem('tz.tactics.templates', JSON.stringify(list));
    setSaved(t.id);
    setName('');
    setTick(v => v + 1);
    setTimeout(() => setSaved(null), 1500);
  };
  const load = (t) => setItems(t.items);
  const remove = (id) => {
    const list = templates.filter(t => t.id !== id);
    localStorage.setItem('tz.tactics.templates', JSON.stringify(list));
    setTick(v => v + 1);
  };

  return (
    <>
      <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, letterSpacing: 0.6, marginBottom: 8 }}>
        GUARDAR PLANTILLA
      </div>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Ej. Salida presión alta"
        style={{
          width: '100%', border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.06)',
          borderRadius: 8, padding: '10px 12px', fontSize: 12, color: '#fff', outline: 'none',
        }} />
      <button onClick={save} disabled={!name.trim()} style={{
        marginTop: 8, width: '100%', padding: 10, border: 0, borderRadius: 8,
        background: name.trim() ? '#F5B301' : 'rgba(255,255,255,0.1)',
        color: name.trim() ? '#000' : 'rgba(255,255,255,0.4)',
        fontSize: 12, fontWeight: 800, cursor: name.trim() ? 'pointer' : 'not-allowed',
      }}>{saved ? '✓ Guardada' : 'Guardar plantilla'}</button>

      <div style={{ fontSize: 10, opacity: 0.6, fontWeight: 700, letterSpacing: 0.6, marginTop: 18, marginBottom: 8 }}>
        MIS PLANTILLAS ({templates.length})
      </div>
      {templates.length === 0 ? (
        <div style={{ padding: 20, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>
          Aún no guardas ninguna jugada
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {templates.slice().reverse().map(t => (
            <div key={t.id} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 8, padding: '8px 10px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#fff',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.name}</div>
                <div style={{ fontSize: 9, opacity: 0.5, marginTop: 2 }}>{t.mode} · {t.formation} · {t.createdAt}</div>
              </div>
              <button onClick={() => load(t)} style={{
                padding: '4px 8px', background: 'rgba(245,179,1,0.2)', color: '#F5B301',
                border: 0, borderRadius: 5, fontSize: 10, fontWeight: 700, cursor: 'pointer',
              }}>Cargar</button>
              <button onClick={() => remove(t.id)} style={{
                width: 22, height: 22, background: 'transparent', border: 0, color: 'rgba(255,255,255,0.4)',
                cursor: 'pointer', fontSize: 14,
              }}>×</button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ── MATERIAL THUMB (for palette) ────────────────────────────
function MaterialThumb({ material, size = 28, dark }) {
  const Comp = window.MATERIAL_ICONS[material.icon];
  if (!Comp) return null;
  const color = material.hasColor ? window.MATERIAL_COLORS[material.defaultColor] : (dark ? '#fff' : '#0B1220');
  return <Comp color={color} size={size} />;
}

// ── PITCH ───────────────────────────────────────────────────
function Pitch({ mode, items, setItems, team, fullscreen, tool, arrowType, drawing, setDrawing, selectedId, setSelectedId, updateItem, deleteItem, duplicateItem, layers }) {
  const ref = React.useRef(null);
  const [drag, setDrag] = React.useState(null);
  const [resize, setResize] = React.useState(null);
  const [rotate, setRotate] = React.useState(null);
  const aspect = mode === '11v11' ? '105 / 68' : '75 / 50';
  const pitchH = fullscreen ? '100%' : 260;

  const getPct = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const pt = e.touches ? e.touches[0] : e;
    const x = ((pt.clientX - rect.left) / rect.width) * 100;
    const y = ((pt.clientY - rect.top) / rect.height) * 100;
    return { x: Math.max(1, Math.min(99, x)), y: Math.max(1, Math.min(99, y)) };
  };

  const onDown = (id) => (e) => {
    if (tool !== 'move' && tool !== 'erase') return;
    e.preventDefault(); e.stopPropagation();
    if (tool === 'erase') { deleteItem(id); return; }
    setSelectedId(id); setDrag(id);
  };
  const onMove = (e) => {
    if (drag) {
      const pt = getPct(e);
      updateItem(drag, pt);
    } else if (resize) {
      const pt = getPct(e);
      const item = items.find(i => i.id === resize.id);
      if (!item) return;
      const dw = (pt.x - resize.startX) * 2;
      const dh = (pt.y - resize.startY) * 2;
      updateItem(resize.id, {
        w: Math.max(2, resize.startW + dw),
        h: Math.max(2, resize.startH + dh),
      });
    } else if (rotate) {
      const pt = getPct(e);
      const item = items.find(i => i.id === rotate);
      if (!item) return;
      const angle = Math.atan2(pt.y - item.y, pt.x - item.x) * 180 / Math.PI;
      updateItem(rotate, { rotation: angle });
    } else if (drawing) {
      const pt = getPct(e);
      setDrawing(d => ({ ...d, path: [...d.path, pt] }));
    }
  };
  const onUp = () => {
    if (drawing && drawing.path.length > 1) {
      const newArrow = { kind: 'arrow', id: 'a-' + Date.now(), type: drawing.type, path: drawing.path };
      setItems(prev => [...prev, newArrow]);
      setDrawing(null);
    } else if (drawing) {
      setDrawing(null);
    }
    setDrag(null); setResize(null); setRotate(null);
  };
  const onPitchDown = (e) => {
    if (tool === 'arrow') {
      const pt = getPct(e);
      setDrawing({ type: arrowType, path: [pt] });
      setSelectedId(null);
      return;
    }
    if (tool === 'move' && e.target === ref.current) {
      setSelectedId(null);
    }
  };

  const startResize = (id) => (e) => {
    e.stopPropagation();
    const item = items.find(i => i.id === id);
    if (!item) return;
    const pt = getPct(e);
    setResize({ id, startX: pt.x, startY: pt.y, startW: item.w, startH: item.h });
  };
  const startRotate = (id) => (e) => {
    e.stopPropagation();
    setRotate(id);
  };

  const players = layers.players ? items.filter(i => i.kind === 'player') : [];
  const materials = layers.materials ? items.filter(i => i.kind === 'material') : [];
  const arrows = layers.arrows ? items.filter(i => i.kind === 'arrow') : [];

  const showHome = team === 'home' || team === 'both';
  const showAway = team === 'away' || team === 'both';

  return (
    <div ref={ref} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
      onTouchMove={onMove} onTouchEnd={onUp}
      onMouseDown={onPitchDown} onTouchStart={onPitchDown}
      style={{
        aspectRatio: fullscreen ? undefined : aspect,
        height: fullscreen ? '100%' : undefined,
        width: '100%', maxWidth: '100%',
        borderRadius: 16, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(180deg, #1B7A3E 0%, #145E30 100%)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.2), inset 0 0 60px rgba(0,0,0,0.15)',
        touchAction: 'none', userSelect: 'none',
        cursor: tool === 'arrow' ? 'crosshair' : tool === 'erase' ? 'not-allowed' : 'default',
      }}>
      {/* mowing stripes */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 9%, rgba(255,255,255,0.045) 9% 18%)' }} />

      {/* Center crest */}
      <div style={{
        position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
        width: fullscreen ? 78 : 46, height: fullscreen ? 78 : 46,
        pointerEvents: 'none', zIndex: 1, opacity: 0.92,
        filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.45))',
      }}>
        <PitchCrest />
      </div>

      {/* Pitch lines */}
      <svg viewBox="0 0 100 66" preserveAspectRatio="none" style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 2,
      }}>
        <g fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="0.35">
          <rect x="2" y="2" width="96" height="62" />
          <line x1="50" y1="2" x2="50" y2="64" />
          <circle cx="50" cy="33" r="7" />
          <circle cx="50" cy="33" r="0.6" fill="rgba(255,255,255,0.75)" />
          {mode === '11v11' ? (
            <>
              <rect x="2" y="16" width="14" height="34" />
              <rect x="2" y="24" width="5" height="18" />
              <path d="M 16 27 Q 22 33 16 39" />
              <circle cx="11" cy="33" r="0.6" fill="rgba(255,255,255,0.75)" />
              <rect x="84" y="16" width="14" height="34" />
              <rect x="93" y="24" width="5" height="18" />
              <path d="M 84 27 Q 78 33 84 39" />
              <circle cx="89" cy="33" r="0.6" fill="rgba(255,255,255,0.75)" />
              <line x1="0.5" y1="28" x2="0.5" y2="38" strokeWidth="0.6" />
              <line x1="99.5" y1="28" x2="99.5" y2="38" strokeWidth="0.6" />
              {/* Arcos de tiro de esquina (4) — más gruesos y visibles */}
              <path d="M 2 4.5 A 2.5 2.5 0 0 1 4.5 2" strokeWidth="0.5" />
              <path d="M 95.5 2 A 2.5 2.5 0 0 1 98 4.5" strokeWidth="0.5" />
              <path d="M 98 61.5 A 2.5 2.5 0 0 1 95.5 64" strokeWidth="0.5" />
              <path d="M 4.5 64 A 2.5 2.5 0 0 1 2 61.5" strokeWidth="0.5" />
            </>
          ) : (
            <>
              <rect x="2" y="21" width="10" height="24" />
              <rect x="88" y="21" width="10" height="24" />
              <line x1="0.5" y1="28" x2="0.5" y2="38" strokeWidth="0.6" />
              <line x1="99.5" y1="28" x2="99.5" y2="38" strokeWidth="0.6" />
              {/* Arcos de tiro de esquina (4) — más gruesos y visibles */}
              <path d="M 2 4.5 A 2.5 2.5 0 0 1 4.5 2" strokeWidth="0.5" />
              <path d="M 95.5 2 A 2.5 2.5 0 0 1 98 4.5" strokeWidth="0.5" />
              <path d="M 98 61.5 A 2.5 2.5 0 0 1 95.5 64" strokeWidth="0.5" />
              <path d="M 4.5 64 A 2.5 2.5 0 0 1 2 61.5" strokeWidth="0.5" />
            </>
          )}
        </g>

        {/* Arrows */}
        {arrows.map(arr => (
          <ArrowShape key={arr.id} item={arr}
            onClick={() => { if (tool === 'move') setSelectedId(arr.id); if (tool === 'erase') deleteItem(arr.id); }}
            selected={selectedId === arr.id} />
        ))}
        {drawing && drawing.path.length > 1 && (
          <ArrowShape item={{ ...drawing, id: 'draft' }} />
        )}
      </svg>

      {/* Materials */}
      {materials.map(m => {
        const mat = window.MATERIAL_CATALOG.find(x => x.id === m.materialId);
        if (!mat) return null;
        const isSel = selectedId === m.id;
        return (
          <div key={m.id}
            onMouseDown={onDown(m.id)} onTouchStart={onDown(m.id)}
            style={{
              position: 'absolute', left: `${m.x}%`, top: `${m.y}%`,
              width: `${m.w}%`, height: `${m.h * (mode === '11v11' ? 68/105 : 50/75)}%`,
              transform: `translate(-50%, -50%) rotate(${m.rotation || 0}deg)`,
              cursor: tool === 'move' ? 'grab' : tool === 'erase' ? 'not-allowed' : 'default',
              zIndex: isSel ? 25 : 5,
              outline: isSel ? '2px dashed #F5B301' : 'none',
              outlineOffset: 2,
            }}>
            <MaterialGlyph material={mat} color={m.color} />
            {isSel && tool === 'move' && (
              <>
                {/* Resize handle */}
                <div onMouseDown={startResize(m.id)} onTouchStart={startResize(m.id)}
                  style={{ position: 'absolute', right: -8, bottom: -8, width: 16, height: 16,
                    background: '#F5B301', borderRadius: '50%', border: '2px solid #fff',
                    cursor: 'nwse-resize' }} />
                {/* Rotate handle */}
                <div onMouseDown={startRotate(m.id)} onTouchStart={startRotate(m.id)}
                  style={{ position: 'absolute', left: '50%', top: -18, width: 14, height: 14,
                    marginLeft: -7, background: '#2563EB', borderRadius: '50%', border: '2px solid #fff',
                    cursor: 'grab', fontSize: 8, color: '#fff', textAlign: 'center', lineHeight: '10px' }}>↻</div>
              </>
            )}
          </div>
        );
      })}

      {/* Players */}
      {showHome && players.filter(p => p.team === 'h').map(p => (
        <PlayerToken key={p.id} pkey={p.id} x={p.x} y={p.y} n={p.num}
          color={TZ.primary} onDown={onDown(p.id)} dragging={drag === p.id} />
      ))}
      {showAway && players.filter(p => p.team === 'a').map(p => (
        <PlayerToken key={p.id} pkey={p.id} x={p.x} y={p.y} n={p.num}
          color="#F5B301" textColor={TZ.primaryDark} onDown={onDown(p.id)} dragging={drag === p.id} />
      ))}

      {/* Contextual mini menu for selected item */}
      {selectedId && fullscreen && (() => {
        const sel = items.find(i => i.id === selectedId);
        if (!sel) return null;
        const isMat = sel.kind === 'material';
        const mat = isMat ? window.MATERIAL_CATALOG.find(m => m.id === sel.materialId) : null;
        return (
          <div style={{
            position: 'absolute', left: `${sel.x}%`, top: `${sel.y}%`,
            transform: `translate(-50%, calc(-100% - 20px))`,
            zIndex: 40, background: 'rgba(11,18,32,0.95)', color: '#fff',
            borderRadius: 10, padding: 6, display: 'flex', gap: 3, alignItems: 'center',
            boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
          }}>
            {isMat && mat && mat.hasColor && (
              <div style={{ display: 'flex', gap: 3, padding: '0 4px', borderRight: '1px solid rgba(255,255,255,0.15)' }}>
                {window.MATERIAL_COLOR_ORDER.map(c => (
                  <button key={c} onClick={() => updateItem(sel.id, { color: c })} style={{
                    width: 16, height: 16, borderRadius: '50%', border: sel.color === c ? '2px solid #fff' : 0,
                    background: window.MATERIAL_COLORS[c], cursor: 'pointer',
                  }} />
                ))}
              </div>
            )}
            <button onClick={() => duplicateItem(sel.id)} style={ctxBtn} title="Duplicar">⧉</button>
            {isMat && (
              <button onClick={() => updateItem(sel.id, { rotation: ((sel.rotation || 0) + 45) % 360 })} style={ctxBtn} title="Rotar 45°">↻</button>
            )}
            <button onClick={() => deleteItem(sel.id)} style={{ ...ctxBtn, color: '#FCA5A5' }} title="Eliminar">🗑</button>
          </div>
        );
      })()}
    </div>
  );
}

const ctxBtn = {
  padding: '5px 9px', background: 'transparent', border: 0, color: '#fff',
  cursor: 'pointer', fontSize: 14, borderRadius: 5,
};

function PlayerToken({ pkey, x, y, n, color, textColor = '#fff', onDown, dragging }) {
  return (
    <div
      onMouseDown={onDown} onTouchStart={onDown}
      style={{
        position: 'absolute', left: `${x}%`, top: `${y}%`,
        transform: `translate(-50%, -50%) scale(${dragging ? 1.15 : 1})`,
        transition: dragging ? 'none' : 'transform 0.15s',
        width: 30, height: 30, borderRadius: '50%',
        background: color, color: textColor,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: '"Barlow Condensed", Impact, sans-serif',
        fontSize: 15, fontWeight: 800, letterSpacing: 0.3,
        border: '2px solid ' + (color === '#F5B301' ? textColor : '#fff'),
        boxShadow: dragging ? '0 6px 16px rgba(0,0,0,0.4)' : '0 2px 6px rgba(0,0,0,0.3)',
        cursor: 'grab', zIndex: dragging ? 30 : 10,
      }}>
      {n}
    </div>
  );
}

function SegBar({ label, options, value, onChange, dark }) {
  const opts = options.map(o => typeof o === 'string' ? { id: o, label: o } : o);
  return (
    <div>
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
        color: dark ? 'rgba(255,255,255,0.5)' : TZ.muted, marginBottom: 4, paddingLeft: 4,
      }}>{label}</div>
      <div style={{
        display: 'flex', gap: 2, borderRadius: 10, padding: 3,
        background: dark ? 'rgba(255,255,255,0.08)' : '#EEF0F4',
        maxWidth: '100%', overflow: 'auto',
      }}>
        {opts.map(o => (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            padding: '7px 12px', border: 0, borderRadius: 7,
            background: value === o.id ? (dark ? '#F5B301' : '#fff') : 'transparent',
            color: value === o.id ? (dark ? TZ.primaryDark : TZ.ink) : (dark ? 'rgba(255,255,255,0.7)' : TZ.inkSoft),
            fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap',
          }}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

const fullBtnDark = {
  width: 40, height: 40, borderRadius: 10, border: 0,
  background: 'rgba(255,255,255,0.12)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

function PitchCrest() {
  return (
    <img src="assets/pachuca-crest.png" alt="Pachuca"
      style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }} />
  );
}

Object.assign(window, { Tactics, PitchCrest });
