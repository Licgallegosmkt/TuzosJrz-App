// TuzosJrz — Players list + Profile with medical

function Players({ nav, openPlayer }) {
  const { PLAYERS, CATEGORIES } = window.TZ_DATA;
  const [category, setCategory] = React.useState('Todos');
  const [query, setQuery] = React.useState('');
  const [addMenu, setAddMenu] = React.useState(false);
  const [modal, setModal] = React.useState(null); // 'newPlayer' | 'inviteTutor' | 'import'

  const filtered = PLAYERS.filter(p => {
    if (category !== 'Todos' && p.category !== category) return false;
    if (query && !p.name.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  // Group by category when 'Todos'
  const grouped = {};
  filtered.forEach(p => {
    (grouped[p.category] = grouped[p.category] || []).push(p);
  });

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Jugadores"
        subtitle={`${PLAYERS.length} en plantilla`}
        right={<button style={pillBtn} onClick={() => setAddMenu(true)}><Icon name="plus" size={18} color="#fff" /></button>}
      />
      <div style={{ padding: '0 16px' }}>
        {/* search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 14px',
          border: '1px solid ' + TZ.line,
        }}>
          <Icon name="search" size={18} color={TZ.muted} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar jugador…"
            style={{ border: 0, outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }} />
        </div>
        <CategoryChipRow value={category} onChange={setCategory} categories={CATEGORIES} />

        {/* list */}
        {(category === 'Todos' ? Object.keys(grouped) : [category]).filter(k => grouped[k]).map(cat => (
          <div key={cat}>
            <SectionTitle>{cat} · {grouped[cat].length}</SectionTitle>
            <Card padded={false}>
              {grouped[cat].map((p, i) => (
                <div key={p.id} onClick={() => openPlayer(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', cursor: 'pointer',
                  borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                }}>
                  <Avatar player={p} size={42} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 14, fontWeight: 600, color: TZ.ink,
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{p.position}</span>
                      <span style={{ fontSize: 11, color: TZ.muted }}>·</span>
                      <span style={{ fontSize: 11, color: TZ.muted }}>{p.age} años</span>
                      {p.medical.status !== 'apto' && (
                        <>
                          <span style={{ fontSize: 11, color: TZ.muted }}>·</span>
                          <StatusDot tone={p.medical.status === 'lesionado' ? 'err' : 'warn'} />
                          <span style={{ fontSize: 11, color: p.medical.status === 'lesionado' ? TZ.err : TZ.warn, fontWeight: 600 }}>
                            {p.medical.status === 'lesionado' ? 'Lesionado' : 'Recup.'}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    {p.paymentStatus === 'atrasado' && <Chip tone="err" size="sm">Atrasado</Chip>}
                    {p.paymentStatus === 'pendiente' && <Chip tone="warn" size="sm">Pendiente</Chip>}
                    <window.DocsProgressPill playerId={p.id} />
                    <Icon name="chevron" size={16} color={TZ.muted} />
                  </div>
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>

      {/* Bottom sheet: menú de agregar */}
      {addMenu && (
        <AddPlayerMenu
          onClose={() => setAddMenu(false)}
          onPick={(id) => { setAddMenu(false); setModal(id); }}
        />
      )}

      {/* Modales secundarios */}
      {modal === 'newPlayer' && (
        <NewPlayerModal onClose={() => setModal(null)} />
      )}
      {modal === 'inviteTutor' && (
        <QuickInviteModal onClose={() => setModal(null)} />
      )}
      {modal === 'import' && (
        <ImportPlayersModal onClose={() => setModal(null)} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADD PLAYER MENU — bottom sheet con 3 opciones
// ═══════════════════════════════════════════════════════════
function AddPlayerMenu({ onClose, onPick }) {
  const options = [
    {
      id: 'newPlayer',
      icon: '👶',
      title: 'Nuevo jugador',
      sub: 'Crear perfil del niño + invitar tutor',
      color: TZ.primary,
    },
    {
      id: 'inviteTutor',
      icon: '📧',
      title: 'Invitar tutor',
      sub: 'Vincular con un jugador existente',
      color: '#16A34A',
    },
    {
      id: 'import',
      icon: '📥',
      title: 'Importar lista (CSV / Excel)',
      sub: 'Útil para inicio de temporada',
      color: '#7C3AED',
    },
  ];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink, marginBottom: 4 }}>
          ➕ Agregar al club
        </div>
        <div style={{ fontSize: 12, color: TZ.muted, marginBottom: 18 }}>
          ¿Qué quieres hacer?
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {options.map(o => (
            <button key={o.id} onClick={() => onPick(o.id)} style={{
              padding: 14, borderRadius: 14,
              border: '1.5px solid ' + TZ.line, background: '#fff',
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14,
              transition: 'all 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#F4F5F8'}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, flexShrink: 0,
                background: o.color + '15', color: o.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24,
              }}>{o.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: TZ.ink }}>{o.title}</div>
                <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>{o.sub}</div>
              </div>
              <span style={{ fontSize: 18, color: TZ.muted }}>›</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// NEW PLAYER MODAL — admin crea un jugador nuevo
// ═══════════════════════════════════════════════════════════
function NewPlayerModal({ onClose }) {
  const { CATEGORIES, POSITIONS } = window.TZ_DATA;
  const [first, setFirst] = React.useState('');
  const [last, setLast] = React.useState('');
  const [cat, setCat] = React.useState('Sub-10');
  const [pos, setPos] = React.useState('DC');
  const [num, setNum] = React.useState('');
  const [birth, setBirth] = React.useState('');
  const [inviteTutor, setInviteTutor] = React.useState(true);

  const canSave = first && last && birth && num;

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink }}>👶 Nuevo jugador</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>Datos básicos del niño</div>
          </div>
          <button onClick={onClose} style={closeBtn}><Icon name="close" size={16} color={TZ.inkSoft} /></button>
        </div>

        {/* Nombres */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
          <Field label="Nombre(s)" value={first} onChange={setFirst} placeholder="Diego" />
          <Field label="Apellidos" value={last} onChange={setLast} placeholder="Hernández" />
        </div>

        {/* Fecha nacimiento */}
        <Field label="Fecha de nacimiento" value={birth} onChange={setBirth} type="date" />

        {/* Categoría */}
        <div style={{ marginTop: 14, marginBottom: 6, fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
          Categoría
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {CATEGORIES.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: '8px 14px', borderRadius: 999,
              border: cat === c ? `2px solid ${TZ.primary}` : '1px solid ' + TZ.line,
              background: cat === c ? 'rgba(29,61,138,0.05)' : '#fff',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              color: cat === c ? TZ.primary : TZ.inkSoft,
            }}>{c}</button>
          ))}
        </div>

        {/* Posición + dorsal */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginTop: 14 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
              Posición
            </div>
            <select value={pos} onChange={e => setPos(e.target.value)} style={{
              width: '100%', padding: '12px', borderRadius: 10, border: '1px solid ' + TZ.line,
              fontSize: 14, background: '#fff', color: TZ.ink, cursor: 'pointer',
            }}>
              {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <Field label="Dorsal" value={num} onChange={setNum} type="number" placeholder="7" />
        </div>

        {/* Toggle invitar tutor */}
        <label style={{
          display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: 12, background: '#F4F5F8', borderRadius: 12,
          marginTop: 18, cursor: 'pointer',
        }}>
          <input type="checkbox" checked={inviteTutor} onChange={e => setInviteTutor(e.target.checked)}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: TZ.primary }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>Invitar tutor después de crear</div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Se abrirá el modal de invitación con el jugador recién creado</div>
          </div>
        </label>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={onClose} disabled={!canSave} style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: canSave ? TZ.primary : '#CBD5E1', color: '#fff', border: 0,
            fontSize: 14, fontWeight: 800, cursor: canSave ? 'pointer' : 'not-allowed',
            boxShadow: canSave ? '0 4px 12px rgba(29,61,138,0.3)' : 'none',
          }}>
            {inviteTutor ? 'Crear y continuar →' : 'Crear jugador'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// QUICK INVITE MODAL — invitar tutor con jugador existente
// ═══════════════════════════════════════════════════════════
function QuickInviteModal({ onClose }) {
  const { PLAYERS } = window.TZ_DATA;
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState(null);

  const filtered = PLAYERS.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 10);

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink }}>📧 Invitar tutor</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>Selecciona el jugador a vincular</div>
          </div>
          <button onClick={onClose} style={closeBtn}><Icon name="close" size={16} color={TZ.inkSoft} /></button>
        </div>

        {/* Buscador */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#F4F5F8', borderRadius: 12, padding: '10px 14px',
          border: '1px solid ' + TZ.line, marginBottom: 12,
        }}>
          <Icon name="search" size={18} color={TZ.muted} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar jugador por nombre…"
            autoFocus
            style={{ border: 0, outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }} />
        </div>

        {/* Lista */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflow: 'auto' }}>
          {filtered.map(p => (
            <button key={p.id} onClick={() => setSelected(p.id)} style={{
              padding: 10, borderRadius: 10,
              border: selected === p.id ? '2px solid ' + TZ.primary : '1px solid ' + TZ.line,
              background: selected === p.id ? 'rgba(29,61,138,0.05)' : '#fff',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
            }}>
              <Avatar player={p} size={38} showNumber={false} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{p.name}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>
                  {p.category} · #{p.number} · {p.position}
                </div>
              </div>
              {selected === p.id && <Icon name="check" size={18} color={TZ.primary} />}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={onClose} disabled={!selected} style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: selected ? '#16A34A' : '#CBD5E1', color: '#fff', border: 0,
            fontSize: 14, fontWeight: 800, cursor: selected ? 'pointer' : 'not-allowed',
            boxShadow: selected ? '0 4px 12px rgba(22,163,74,0.3)' : 'none',
          }}>
            Continuar a invitación →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// IMPORT PLAYERS MODAL — subir CSV / Excel
// ═══════════════════════════════════════════════════════════
function ImportPlayersModal({ onClose }) {
  const [step, setStep] = React.useState('upload'); // upload | preview | done
  const [count, setCount] = React.useState(0);

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 110,
      background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink }}>📥 Importar jugadores</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>Carga masiva desde CSV o Excel</div>
          </div>
          <button onClick={onClose} style={closeBtn}><Icon name="close" size={16} color={TZ.inkSoft} /></button>
        </div>

        {step === 'upload' && (
          <>
            {/* Download template */}
            <div style={{
              padding: 14, background: '#EFF6FF', border: '1px solid #DBEAFE',
              borderRadius: 12, display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16,
            }}>
              <div style={{ fontSize: 20 }}>💡</div>
              <div style={{ flex: 1, fontSize: 12, color: '#1E3A8A', lineHeight: 1.5 }}>
                <strong>Primera vez?</strong> Descarga la plantilla con las columnas correctas:<br />
                <strong>Nombre, Apellidos, Fecha nacimiento, Categoría, Posición, Dorsal, Email tutor, Teléfono tutor</strong>
              </div>
            </div>
            <button style={{
              width: '100%', padding: '12px', borderRadius: 10, border: '1.5px solid ' + TZ.primary,
              background: '#fff', color: TZ.primary, cursor: 'pointer',
              fontSize: 13, fontWeight: 700, marginBottom: 16,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              📥 Descargar plantilla
            </button>

            {/* Upload zone */}
            <label style={{
              display: 'block', padding: '32px 20px', borderRadius: 14,
              border: '2px dashed ' + TZ.line, background: '#F4F5F8',
              cursor: 'pointer', textAlign: 'center',
            }}>
              <input type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }}
                onChange={() => { setCount(23); setStep('preview'); }} />
              <div style={{ fontSize: 36 }}>📄</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink, marginTop: 8 }}>
                Toca para subir archivo
              </div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 4 }}>
                CSV, XLSX o XLS · máx 5 MB
              </div>
            </label>
          </>
        )}

        {step === 'preview' && (
          <>
            <div style={{
              padding: 14, background: '#F0FDF4', border: '1px solid #BBF7D0',
              borderRadius: 12, marginBottom: 16,
            }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#166534' }}>
                ✓ Archivo procesado
              </div>
              <div style={{ fontSize: 12, color: '#166534', marginTop: 4 }}>
                Se detectaron <strong>{count} jugadores</strong> listos para importar.
              </div>
            </div>

            {/* Vista previa simulada */}
            <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
              Vista previa (primeros 3)
            </div>
            <div style={{ background: '#F4F5F8', borderRadius: 10, padding: 10, fontSize: 11, color: TZ.inkSoft, fontFamily: 'monospace', lineHeight: 1.6 }}>
              Diego Hernández · Sub-12 · DC · #7<br />
              Iker Castro · Sub-10 · POR · #1<br />
              Mateo Rivera · Sub-14 · MC · #10<br />
              <span style={{ opacity: 0.5 }}>…y 20 más</span>
            </div>

            {/* Opciones */}
            <label style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: 12, background: '#F4F5F8', borderRadius: 10,
              marginTop: 14, cursor: 'pointer',
            }}>
              <input type="checkbox" defaultChecked
                style={{ marginTop: 3, width: 18, height: 18, accentColor: TZ.primary }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: TZ.ink }}>Enviar invitación automática a todos los tutores</div>
                <div style={{ fontSize: 10, color: TZ.muted, marginTop: 2 }}>Se enviará email con código único a cada tutor</div>
              </div>
            </label>

            <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
              <button onClick={() => setStep('upload')} style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: '#EEF0F4', color: TZ.ink, border: 0,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>Regresar</button>
              <button onClick={onClose} style={{
                flex: 2, padding: '14px', borderRadius: 12,
                background: '#7C3AED', color: '#fff', border: 0,
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(124,58,237,0.3)',
              }}>
                Importar {count} jugadores
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Field helper ────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ marginBottom: 2 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 6 }}>
        {label}
      </div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={{
        width: '100%', padding: '12px', borderRadius: 10, border: '1px solid ' + TZ.line,
        fontSize: 14, outline: 'none', color: TZ.ink, boxSizing: 'border-box',
      }} />
    </div>
  );
}

const closeBtn = {
  width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
};

function PlayerProfile({ playerId, back }) {
  const p = window.TZ_DATA.PLAYERS.find(x => x.id === playerId);
  const [tab, setTab] = React.useState('info');
  if (!p) return null;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(160deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '54px 20px 66px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={back} style={{ ...iconBtnDark }}>
            <Icon name="chevronL" size={20} color="#fff" />
          </button>
          <button style={{ ...iconBtnDark }}>
            <Icon name="doc" size={18} color="#fff" />
          </button>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginTop: 22 }}>
          <window.PhotoAvatar
            entityId={`player-${p.id}`}
            entityKind="player"
            name={p.name}
            size={78}
            canEdit={true}
            showRing
            hue={(p.id * 47) % 360}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>{p.name}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip tone="gold">#{p.number}</Chip>
              <Chip tone="dark">{p.position}</Chip>
              <Chip tone="dark">{p.category}</Chip>
              <Chip tone="dark">{p.age} años</Chip>
            </div>
          </div>
        </div>
      </div>

      {/* KPI cards overlapping hero */}
      <div style={{ padding: '0 16px', marginTop: -46, position: 'relative' }}>
        <Card padded={false} style={{ padding: '14px 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <ProfileKpi label="Asistencia" value={`${p.attendance.rate}%`} />
            <div style={{ borderLeft: '1px solid ' + TZ.line, borderRight: '1px solid ' + TZ.line }}>
              <ProfileKpi label="Balance"
                value={p.balance === 0 ? 'Al día' : `$${Math.abs(p.balance)}`}
                tone={p.balance === 0 ? 'ok' : 'err'} />
            </div>
            <ProfileKpi label="Estado"
              value={p.medical.status === 'apto' ? 'Apto' : p.medical.status === 'recuperacion' ? 'Recup.' : 'Lesión'}
              tone={p.medical.status === 'apto' ? 'ok' : p.medical.status === 'recuperacion' ? 'warn' : 'err'} />
          </div>
        </Card>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 18,
          background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'info', label: 'Info' },
            { id: 'medical', label: 'Médica' },
            { id: 'docs', label: 'Docs' },
            { id: 'history', label: 'Historial' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 4px', border: 0, borderRadius: 9,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? TZ.ink : TZ.inkSoft,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'info' && <InfoTab p={p} />}
        {tab === 'medical' && <MedicalTab p={p} />}
        {tab === 'docs' && <DocsTab p={p} />}
        {tab === 'history' && <HistoryTab p={p} />}
      </div>
    </div>
  );
}

function InfoTab({ p }) {
  return (
    <>
      <SectionTitle>Datos personales</SectionTitle>
      <Card padded={false}>
        <ProfileRow icon="calendar" label="Fecha de nacimiento" value={`${p.birthYear} · ${p.age} años`} />
        <ProfileRow icon="tshirt" label="Dorsal · Posición" value={`#${p.number} · ${p.position}`} />
        <ProfileRow icon="phone" label="Teléfono" value={p.phone} />
        <ProfileRow icon="mail" label="Email" value={p.email} last />
      </Card>

      {p.tutor && (
        <>
          <SectionTitle>Tutor</SectionTitle>
          <Card padded={false}>
            <ProfileRow icon="users" label={p.tutor.relation} value={p.tutor.name} />
            <ProfileRow icon="phone" label="Teléfono" value={p.tutor.phone} last />
          </Card>
        </>
      )}
    </>
  );
}

function MedicalTab({ p }) {
  const m = p.medical;
  const statusMap = {
    apto: { tone: 'ok', label: 'Apto para actividad completa' },
    recuperacion: { tone: 'warn', label: 'En recuperación · carga diferenciada' },
    lesionado: { tone: 'err', label: 'Lesionado · sin entrenar' },
  };
  const s = statusMap[m.status];
  const imc = (m.weight / Math.pow(m.height / 100, 2)).toFixed(1);
  return (
    <>
      {/* Status banner */}
      <div style={{
        background: s.tone === 'ok' ? '#F0FDF4' : s.tone === 'warn' ? '#FFFBEB' : '#FEF2F2',
        border: '1px solid ' + (s.tone === 'ok' ? '#BBF7D0' : s.tone === 'warn' ? '#FDE68A' : '#FECACA'),
        borderRadius: 12, padding: '12px 14px', marginTop: 18,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: s.tone === 'ok' ? TZ.ok : s.tone === 'warn' ? TZ.warn : TZ.err,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="medical" size={20} color="#fff" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase',
            color: s.tone === 'ok' ? '#166534' : s.tone === 'warn' ? '#92400E' : '#991B1B' }}>Estado actual</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink, marginTop: 1 }}>{s.label}</div>
        </div>
      </div>

      <SectionTitle>Biometría</SectionTitle>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        <BioCard label="Peso" value={m.weight} unit="kg" />
        <BioCard label="Altura" value={m.height} unit="cm" />
        <BioCard label="IMC" value={imc} unit="" />
      </div>

      <SectionTitle>Ficha clínica</SectionTitle>
      <Card padded={false}>
        <ProfileRow label="Tipo de sangre" value={m.bloodType} />
        <ProfileRow label="Alergias" value={m.allergies} />
        <ProfileRow label="Medicación" value={m.medication} />
        <ProfileRow label="Último chequeo" value={m.lastCheckup} last />
      </Card>

      <SectionTitle>Contacto de emergencia</SectionTitle>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(220,38,38,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.err }}>
            <Icon name="phone" size={20} color={TZ.err} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{m.emergencyContact.name}</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 1 }}>{m.emergencyContact.phone}</div>
          </div>
          <button style={callBtn}>Llamar</button>
        </div>
      </Card>

      {m.injuries.length > 0 && (
        <>
          <SectionTitle>Historial de lesiones</SectionTitle>
          <Card padded={false}>
            {m.injuries.map((inj, i) => (
              <div key={i} style={{ padding: '14px', borderTop: i === 0 ? 0 : '1px solid ' + TZ.line }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{inj.type}</span>
                  <span style={{ fontSize: 11, color: TZ.muted }}>{inj.date}</span>
                </div>
                <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 4 }}>{inj.notes}</div>
              </div>
            ))}
          </Card>
        </>
      )}

      {m.notes && (
        <>
          <SectionTitle>Notas del fisio</SectionTitle>
          <Card>
            <div style={{ fontSize: 13, color: TZ.inkSoft, lineHeight: 1.5 }}>{m.notes}</div>
          </Card>
        </>
      )}
    </>
  );
}

function DocsTab({ p }) {
  React.useEffect(() => { window.seedDocsIfEmpty && window.seedDocsIfEmpty(p.id, true); }, [p.id]);
  const docs = [
    { name: 'INE / Acta de nacimiento', status: 'ok', date: '15 Ene 2026' },
    { name: 'Ficha federativa', status: 'ok', date: '02 Ago 2026' },
    { name: 'Autorización tutor', status: p.tutor ? 'ok' : 'na', date: p.tutor ? '10 Ago 2026' : '—' },
    { name: 'Constancia médica', status: 'pending', date: 'Vence 30 Oct' },
    { name: 'Foto oficial', status: 'ok', date: 'Ago 2026' },
  ];
  return (
    <>
      {/* Nuevos documentos (subidos por padre / coach / admin) */}
      <div style={{ marginTop: 4 }}>
        <window.DocsUploader playerId={p.id} role="admin" playerName={p.name} />
      </div>

      {/* Documentos legacy (institucionales del club) */}
      <SectionTitle>Documentos institucionales</SectionTitle>
      <Card padded={false}>
        {docs.map((d, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
            borderTop: i === 0 ? 0 : '1px solid ' + TZ.line }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: d.status === 'ok' ? '#DCFCE7' : d.status === 'pending' ? '#FEF3C7' : '#F3F4F6',
              color: d.status === 'ok' ? TZ.ok : d.status === 'pending' ? TZ.warn : TZ.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="doc" size={18} color={d.status === 'ok' ? TZ.ok : d.status === 'pending' ? TZ.warn : TZ.muted} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink }}>{d.name}</div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{d.date}</div>
            </div>
            {d.status === 'ok' && <Chip tone="ok">Vigente</Chip>}
            {d.status === 'pending' && <Chip tone="warn">Por vencer</Chip>}
            {d.status === 'na' && <Chip tone="neutral">N/A</Chip>}
          </div>
        ))}
      </Card>
    </>
  );
}

function HistoryTab({ p }) {
  return (
    <>
      <SectionTitle>Últimos entrenamientos</SectionTitle>
      <Card padded={false}>
        {['Vie 20', 'Mié 18', 'Lun 16', 'Vie 13', 'Mié 11'].map((d, i) => {
          const r = ['P','P','J','P','A'][i];
          const tone = r === 'P' ? 'ok' : r === 'J' ? 'warn' : 'err';
          const label = r === 'P' ? 'Presente' : r === 'J' ? 'Justificado' : 'Ausente';
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line }}>
              <div style={{
                width: 36, height: 36, borderRadius: 8, background: '#EEF0F4',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: TZ.ink, textAlign: 'center', lineHeight: 1,
              }}>{d.slice(0,3)}<br /><span style={{ fontSize: 10, fontWeight: 600, color: TZ.muted }}>{d.slice(4)}</span></div>
              <span style={{ flex: 1, fontSize: 13, color: TZ.ink }}>Entrenamiento · {p.category}</span>
              <Chip tone={tone}>{label}</Chip>
            </div>
          );
        })}
      </Card>
    </>
  );
}

function ProfileRow({ icon, label, value, last }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      borderBottom: last ? 0 : '1px solid ' + TZ.line }}>
      {icon && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft }}>
          <Icon name={icon} size={16} color={TZ.inkSoft} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, color: TZ.ink, fontWeight: 500, marginTop: 1,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
      </div>
    </div>
  );
}

function ProfileKpi({ label, value, tone }) {
  const c = tone === 'ok' ? TZ.ok : tone === 'warn' ? TZ.warn : tone === 'err' ? TZ.err : TZ.ink;
  return (
    <div style={{ padding: '4px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase', color: TZ.muted }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: c, marginTop: 4, letterSpacing: -0.3 }}>{value}</div>
    </div>
  );
}

function BioCard({ label, value, unit }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ marginTop: 6, display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 3 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, letterSpacing: -0.5 }}>{value}</span>
        {unit && <span style={{ fontSize: 12, color: TZ.muted, fontWeight: 600 }}>{unit}</span>}
      </div>
    </div>
  );
}

const pillBtn = {
  width: 40, height: 40, borderRadius: '50%',
  background: TZ.primary, border: 0, color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(29,61,138,0.35)',
};
const iconBtnDark = {
  width: 40, height: 40, borderRadius: '50%', border: 0,
  background: 'rgba(255,255,255,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};
const callBtn = {
  background: TZ.err, color: '#fff', border: 0, borderRadius: 999,
  padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
};

Object.assign(window, { Players, PlayerProfile, ProfileRow, BioCard, iconBtnDark });
