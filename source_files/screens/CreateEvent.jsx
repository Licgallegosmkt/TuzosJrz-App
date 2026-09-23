// TuzosJrz — Create events (Training, Match, Club event, Birthday)

// ── Type picker (initial screen) ─────────────────────────────
const EVENT_TYPES = [
  { id: 'training', icon: '🏃', label: 'Entrenamiento', desc: 'Sesión regular de la categoría', color: '#1D3D8A' },
  { id: 'match',    icon: '⚽', label: 'Partido oficial', desc: 'Jornada de liga con marcador', color: '#F5B301', dark: true },
  { id: 'friendly', icon: '🤝', label: 'Partido amistoso', desc: 'Encuentro no oficial', color: '#0F766E' },
  { id: 'meeting',  icon: '📋', label: 'Evento del club', desc: 'Reunión, junta con padres', color: '#7C3AED' },
];

function CreateEventPicker({ back, onPick, role, coachCategory }) {
  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', background: '#F4F5F8' }}>
      <div style={{
        padding: '54px 20px 18px',
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
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
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>NUEVO</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Crear evento</div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0' }}>
        <div style={{ fontSize: 13, color: TZ.inkSoft, lineHeight: 1.5, marginBottom: 16 }}>
          {role === 'coach'
            ? <>Crearás el evento para tu categoría <strong style={{ color: TZ.primary }}>{coachCategory}</strong>.</>
            : <>Elige el tipo de evento para configurarlo.</>}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {EVENT_TYPES.map(t => (
            <button key={t.id} onClick={() => onPick(t.id)} style={{
              background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14,
              padding: 14, cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 14,
              boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
            }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12, background: t.color + '18',
                color: t.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 24, flexShrink: 0,
              }}>{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: TZ.ink }}>{t.label}</div>
                <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>{t.desc}</div>
              </div>
              <Icon name="chevron" size={18} color={TZ.muted} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Location picker (Google Maps mock) ───────────────────────
const KNOWN_PLACES = [
  { id: 1, name: 'CAR Pachuca · Cancha 1', address: 'Blvd. Felipe Ángeles, Pachuca, Hgo.', lat: 20.126, lng: -98.735 },
  { id: 2, name: 'CAR Pachuca · Cancha 2', address: 'Blvd. Felipe Ángeles, Pachuca, Hgo.', lat: 20.127, lng: -98.736 },
  { id: 3, name: 'Estadio Hidalgo',        address: 'Av. Colosio s/n, Pachuca, Hgo.',       lat: 20.108, lng: -98.762 },
  { id: 4, name: 'Deportivo Revolución',   address: 'Av. Revolución 500, Pachuca, Hgo.',    lat: 20.100, lng: -98.750 },
  { id: 5, name: 'Cancha San Bartolo',     address: 'San Bartolo Tutotepec, Hgo.',          lat: 20.400, lng: -98.200 },
];

function LocationPicker({ value, onChange }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');

  const filtered = KNOWN_PLACES.filter(p =>
    !query || p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase())
  );
  const showAsCustom = query.length > 4 && filtered.length === 0;

  return (
    <>
      <button onClick={() => setOpen(true)} style={{
        width: '100%', textAlign: 'left', background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
        padding: 12, cursor: 'pointer', display: 'flex', alignItems: 'stretch', gap: 12,
      }}>
        {/* Map preview */}
        <div style={{
          width: 76, height: 76, borderRadius: 10, flexShrink: 0,
          background: value
            ? `#DDEAF7 url('https://maps.google.com/maps/api/staticmap?center=${value.lat},${value.lng}&zoom=15&size=200x200') no-repeat center/cover`
            : 'linear-gradient(135deg, #DDEAF7, #C6DAF0)',
          position: 'relative', overflow: 'hidden',
          border: '1px solid ' + TZ.line,
        }}>
          {/* Fallback pretty map pattern (works without external API) */}
          <MapPatternMock />
          {value && (
            <div style={{
              position: 'absolute', left: '50%', top: '50%',
              transform: 'translate(-50%, -100%)', color: TZ.err,
              filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.4))',
            }}>
              <MapPin />
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Ubicación</div>
          {value ? (
            <>
              <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink, marginTop: 4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.name}</div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value.address}</div>
            </>
          ) : (
            <div style={{ fontSize: 14, color: TZ.primary, fontWeight: 600, marginTop: 4 }}>
              📍 Buscar en Google Maps
            </div>
          )}
        </div>
      </button>

      <BottomSheet open={open} title="Buscar ubicación" onClose={() => setOpen(false)}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#F4F5F8', borderRadius: 12, padding: '12px 14px',
        }}>
          <Icon name="search" size={18} color={TZ.muted} />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Nombre del lugar, dirección…"
            style={{ border: 0, outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }} />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'transparent', border: 0, cursor: 'pointer', color: TZ.muted }}>
              <Icon name="close" size={16} color={TZ.muted} />
            </button>
          )}
        </div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>🔵</span> Con tecnología de Google Maps
        </div>

        {/* Suggestions */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 8, paddingLeft: 4 }}>
            {query ? 'Resultados' : 'Ubicaciones frecuentes'}
          </div>
          {filtered.length > 0 && (
            <div style={{
              background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, overflow: 'hidden',
            }}>
              {filtered.map((p, i) => (
                <div key={p.id} onClick={() => { onChange(p); setOpen(false); }} style={{
                  padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
                  borderTop: i === 0 ? 0 : '1px solid ' + TZ.line, cursor: 'pointer',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: '#EFF6FF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    <MapPin small />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.address}</div>
                  </div>
                  <Icon name="chevron" size={16} color={TZ.muted} />
                </div>
              ))}
            </div>
          )}

          {showAsCustom && (
            <div onClick={() => {
              onChange({ id: 'custom-' + Date.now(), name: query, address: query, lat: 20.12, lng: -98.74 });
              setOpen(false);
            }} style={{
              marginTop: 10, padding: 14, background: '#fff',
              border: '1.5px dashed ' + TZ.primary, borderRadius: 12, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(29,61,138,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.primary }}>
                <Icon name="plus" size={18} color={TZ.primary} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TZ.primary }}>Usar "{query}"</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Ajustar el pin al confirmar</div>
              </div>
            </div>
          )}

          {filtered.length === 0 && !showAsCustom && (
            <div style={{ padding: 30, textAlign: 'center', color: TZ.muted, fontSize: 13 }}>
              Escribe más para buscar en el mapa
            </div>
          )}
        </div>
      </BottomSheet>
    </>
  );
}

function MapPin({ small }) {
  const size = small ? 20 : 28;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#DC2626" stroke="#fff" strokeWidth="1.5">
      <path d="M12 2C7.6 2 4 5.6 4 10c0 6 8 12 8 12s8-6 8-12c0-4.4-3.6-8-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="#fff" stroke="none"/>
    </svg>
  );
}

// A CSS-generated map background (roads + parcels) so we don't hit an external tile server
function MapPatternMock() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `
        linear-gradient(45deg, transparent 48%, #fff 48%, #fff 52%, transparent 52%),
        linear-gradient(135deg, transparent 68%, #fff 68%, #fff 71%, transparent 71%),
        linear-gradient(0deg, transparent 76%, rgba(255,255,255,0.6) 76%, rgba(255,255,255,0.6) 78%, transparent 78%),
        linear-gradient(90deg, #DDEAF7 0%, #CFE0F0 50%, #E8F0F8 100%)`,
    }}>
      {/* Green patches simulating parks */}
      <div style={{ position: 'absolute', top: '15%', left: '20%', width: '30%', height: '25%',
        background: 'rgba(179, 213, 155, 0.5)', borderRadius: 6 }} />
      <div style={{ position: 'absolute', bottom: '10%', right: '15%', width: '25%', height: '20%',
        background: 'rgba(179, 213, 155, 0.5)', borderRadius: 4 }} />
    </div>
  );
}

// ── Date & time input helpers ────────────────────────────────
function DateTimeField({ label, value, onChange, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
      {icon && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
          <Icon name={icon} size={16} color={TZ.inkSoft} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</div>
        <input type="datetime-local" value={value} onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', border: 0, outline: 'none', background: 'transparent',
            fontSize: 14, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1,
            fontFamily: 'inherit',
          }} />
      </div>
    </div>
  );
}

function TimeField({ label, value, onChange, icon }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
      {icon && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
          <Icon name={icon} size={16} color={TZ.inkSoft} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</div>
        <input type="time" value={value} onChange={e => onChange(e.target.value)}
          style={{
            width: '100%', border: 0, outline: 'none', background: 'transparent',
            fontSize: 14, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1,
            fontFamily: 'inherit',
          }} />
      </div>
    </div>
  );
}

// Category picker (locked for coach)
function CategoryField({ value, onChange, locked }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
        <Icon name="users" size={16} color={TZ.inkSoft} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>
          Categoría {locked && <span style={{ color: TZ.primary }}>· 🔒 asignada</span>}
        </div>
        {locked ? (
          <div style={{ fontSize: 14, color: TZ.ink, fontWeight: 500, marginTop: 2 }}>{value}</div>
        ) : (
          <select value={value} onChange={e => onChange(e.target.value)} style={{
            width: '100%', border: 0, outline: 'none', background: 'transparent',
            fontSize: 14, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1, fontFamily: 'inherit',
          }}>
            {window.TZ_DATA.CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        )}
      </div>
    </div>
  );
}

// ── CREATE TRAINING ─────────────────────────────────────────
function CreateTraining({ back, onSave, role, coachCategory }) {
  const [category, setCategory] = React.useState(coachCategory || 'Sub-12');
  const [dateTime, setDateTime] = React.useState('2026-09-22T17:00');
  const [location, setLocation] = React.useState(KNOWN_PLACES[0]);
  const [notify, setNotify] = React.useState(true);

  const canSave = category && dateTime;

  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', background: '#F4F5F8' }}>
      <div style={{
        padding: '54px 20px 18px',
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={back} style={{
            width: 36, height: 36, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>NUEVO · ENTRENAMIENTO</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>🏃</span> Entrenamiento
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '20px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <CategoryField value={category} onChange={setCategory} locked={role === 'coach'} />
        <DateTimeField label="Fecha y hora de inicio" value={dateTime} onChange={setDateTime} icon="calendar" />
        <LocationPicker value={location} onChange={setLocation} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
          background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
            <Icon name="bell" size={16} color={TZ.inkSoft} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: TZ.ink }}>Avisar a padres</div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Push + mensaje al grupo · recordatorio 2 h antes</div>
          </div>
          <Toggle on={notify} onChange={setNotify} />
        </div>
      </div>

      <div style={{ padding: '24px 16px 0' }}>
        <button disabled={!canSave} onClick={() => onSave({ type: 'training', category, dateTime, location })} style={{
          width: '100%', padding: '15px', borderRadius: 12, border: 0,
          background: canSave ? TZ.primary : '#D5D9E2',
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: canSave ? 'pointer' : 'not-allowed',
          boxShadow: canSave ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="check" size={18} color="#fff" strokeWidth={2.5} />
          Crear entrenamiento
        </button>
      </div>
    </div>
  );
}

// ── CREATE MATCH ────────────────────────────────────────────
function CreateMatch({ back, onSave, role, coachCategory, kind = 'match' }) {
  const isOfficial = kind === 'match';
  const [step, setStep] = React.useState(1);      // 1=details, 2=convocatoria, 3=snack, 4=revisar
  const [category, setCategory] = React.useState(coachCategory || 'Sub-12');
  const [rival, setRival] = React.useState('');
  const [date, setDate] = React.useState('2026-09-26');
  const [matchTime, setMatchTime] = React.useState('10:30');
  const [callTime, setCallTime] = React.useState('09:30');
  const [uniform, setUniform] = React.useState('local');
  const [location, setLocation] = React.useState(KNOWN_PLACES[2]);
  const [notes, setNotes] = React.useState('');
  const [convocados, setConvocados] = React.useState(new Set());
  const [snackPlayerId, setSnackPlayerId] = React.useState(null);

  const roster = window.TZ_DATA.PLAYERS.filter(p => p.category === category);

  // Init convocados when category ready
  React.useEffect(() => {
    // start with all APTOs pre-checked
    const initial = new Set(roster.filter(p => p.medical.status === 'apto').map(p => p.id));
    setConvocados(initial);
  }, [category]);

  const canGoStep2 = rival && date && matchTime && callTime && location;
  const canFinish = convocados.size > 0;

  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', background: '#F4F5F8' }}>
      {/* Header */}
      <div style={{
        padding: '54px 20px 14px',
        background: isOfficial
          ? `linear-gradient(155deg, ${TZ.primaryDark} 0%, #000 100%)`
          : `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={step === 1 ? back : () => setStep(s => s - 1)} style={{
            width: 36, height: 36, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>
              NUEVO · PARTIDO {isOfficial ? 'OFICIAL' : 'AMISTOSO'}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{isOfficial ? '⚽' : '🤝'}</span>
              {rival ? 'vs ' + rival : 'Nuevo partido'}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div style={{ position: 'relative', display: 'flex', gap: 5, marginTop: 14 }}>
          {[
            { n: 1, label: 'Detalles' },
            { n: 2, label: 'Convocatoria' },
            { n: 3, label: '🍎 Snack' },
            { n: 4, label: 'Revisar' },
          ].map((s, i) => (
            <div key={s.n} style={{ flex: 1 }}>
              <div style={{
                height: 3, borderRadius: 2,
                background: step >= s.n ? '#F5B301' : 'rgba(255,255,255,0.25)',
              }} />
              <div style={{ fontSize: 10, fontWeight: 700, marginTop: 5, letterSpacing: 0.4,
                color: step >= s.n ? '#F5B301' : 'rgba(255,255,255,0.6)' }}>
                {s.n}. {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 — DETAILS */}
      {step === 1 && (
        <div style={{ padding: '18px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <CategoryField value={category} onChange={setCategory} locked={role === 'coach'} />

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
              <Icon name="whistle" size={16} color={TZ.inkSoft} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>Rival</div>
              <input value={rival} onChange={e => setRival(e.target.value)}
                placeholder="Ej. Tigres Jr."
                style={{ width: '100%', border: 0, outline: 'none', background: 'transparent',
                  fontSize: 14, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1, fontFamily: 'inherit' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
                <Icon name="calendar" size={16} color={TZ.inkSoft} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>Fecha</div>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={{ width: '100%', border: 0, outline: 'none', background: 'transparent',
                    fontSize: 13, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1, fontFamily: 'inherit' }} />
              </div>
            </div>
            <TimeField label="Inicio" value={matchTime} onChange={setMatchTime} icon="stat" />
          </div>

          <TimeField label="Hora de cita (llegada)" value={callTime} onChange={setCallTime} icon="check" />

          {/* Uniform */}
          <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600, marginBottom: 8 }}>Uniforme</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { id: 'local', label: 'Local', color: TZ.primary, sub: 'Azul + blanco' },
                { id: 'away',  label: 'Visitante', color: '#F5B301', sub: 'Dorado + azul' },
              ].map(u => (
                <button key={u.id} onClick={() => setUniform(u.id)} style={{
                  padding: '12px 10px', borderRadius: 10,
                  border: uniform === u.id ? `2px solid ${TZ.primary}` : '2px solid ' + TZ.line,
                  background: uniform === u.id ? 'rgba(29,61,138,0.05)' : '#fff', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left',
                }}>
                  <UniformIcon color={u.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{u.label}</div>
                    <div style={{ fontSize: 10, color: TZ.muted, marginTop: 1 }}>{u.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <LocationPicker value={location} onChange={setLocation} />

          {/* Notes */}
          <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600, marginBottom: 6 }}>Notas para padres (opcional)</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2}
              placeholder="Ej. Llevar botella extra de agua y bloqueador…"
              style={{ width: '100%', border: 0, outline: 'none', background: 'transparent',
                fontSize: 13, color: TZ.ink, resize: 'none', fontFamily: 'inherit', lineHeight: 1.5 }} />
          </div>

          <div style={{ marginTop: 6 }}>
            <button disabled={!canGoStep2} onClick={() => setStep(2)} style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 0,
              background: canGoStep2 ? TZ.primary : '#D5D9E2',
              color: '#fff', fontSize: 15, fontWeight: 800, cursor: canGoStep2 ? 'pointer' : 'not-allowed',
              boxShadow: canGoStep2 ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Siguiente · Convocatoria
              <Icon name="chevron" size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2 — CONVOCATORIA */}
      {step === 2 && (
        <div style={{ padding: '18px 16px 0' }}>
          <div style={{
            padding: '12px 14px', background: '#EFF6FF', border: '1px solid #DBEAFE',
            borderRadius: 10, marginBottom: 14,
            display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 12, color: '#1E3A8A',
          }}>
            <span style={{ fontSize: 14 }}>ℹ️</span>
            <span>Los <strong>lesionados</strong> se excluyen automáticamente. Selecciona los jugadores convocados; los padres recibirán push y confirmarán en la app.</span>
          </div>

          {/* Counters */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 12 }}>
            <MiniCount label="Plantilla" value={roster.length} color={TZ.ink} />
            <MiniCount label="Convocados" value={convocados.size} color={TZ.primary} />
            <MiniCount label="Lesionados" value={roster.filter(p => p.medical.status === 'lesionado').length} color={TZ.err} />
          </div>

          {/* Quick actions */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setConvocados(new Set(roster.filter(p => p.medical.status === 'apto').map(p => p.id)))} style={quickBtn}>
              Todos los aptos
            </button>
            <button onClick={() => setConvocados(new Set())} style={{ ...quickBtn, flex: '0 0 auto', padding: '10px 14px' }}>
              <Icon name="close" size={14} color={TZ.inkSoft} />
            </button>
          </div>

          <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, overflow: 'hidden' }}>
            {roster.map((p, i) => {
              const on = convocados.has(p.id);
              const disabled = p.medical.status === 'lesionado';
              return (
                <div key={p.id} onClick={() => {
                  if (disabled) return;
                  setConvocados(s => { const n = new Set(s); if (n.has(p.id)) n.delete(p.id); else n.add(p.id); return n; });
                }} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                  borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                  cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
                  background: on ? 'rgba(29,61,138,0.04)' : 'transparent',
                }}>
                  <Avatar player={p} size={38} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>#{p.number} · {p.position} · {p.attendance.rate}% asist.</div>
                  </div>
                  {p.medical.status === 'lesionado' && <Chip tone="err">Lesionado</Chip>}
                  {p.medical.status === 'recuperacion' && <Chip tone="warn">Recup.</Chip>}
                  <div style={{
                    width: 24, height: 24, borderRadius: 6,
                    border: on ? 0 : '1.5px solid #CBD1DC',
                    background: on ? TZ.primary : '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  }}>
                    {on && <Icon name="check" size={16} color="#fff" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <button disabled={!canFinish} onClick={() => setStep(3)} style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 0,
              background: canFinish ? TZ.primary : '#D5D9E2',
              color: '#fff', fontSize: 15, fontWeight: 800, cursor: canFinish ? 'pointer' : 'not-allowed',
              boxShadow: canFinish ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Siguiente · Asignar snack 🍎
              <Icon name="chevron" size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 — SNACK */}
      {step === 3 && (
        <>
          <window.SnackAssignmentPicker
            category={category}
            matchId={`new-${date}-${matchTime}`}
            confirmedIds={Array.from(convocados)}
            initialSelected={snackPlayerId}
            onChange={setSnackPlayerId}
          />
          <div style={{ padding: '20px 16px 0' }}>
            <button onClick={() => setStep(4)} style={{
              width: '100%', padding: '15px', borderRadius: 12, border: 0,
              background: TZ.primary, color: '#fff', fontSize: 15, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 6px 16px rgba(29,61,138,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              Siguiente · Revisar
              <Icon name="chevron" size={18} color="#fff" />
            </button>
          </div>
        </>
      )}

      {/* STEP 4 — REVIEW */}
      {step === 4 && (
        <div style={{ padding: '18px 16px 0' }}>
          {/* Preview card */}
          <div style={{
            background: '#fff', borderRadius: 16, overflow: 'hidden', border: '1px solid ' + TZ.line,
            boxShadow: '0 2px 8px rgba(15,23,42,0.06)',
          }}>
            <div style={{
              background: `linear-gradient(105deg, ${TZ.primaryDark}, ${TZ.primary})`,
              color: '#fff', padding: 16, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', inset: 0, opacity: 0.12,
                backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#F5B301', letterSpacing: 1 }}>LOCAL</div>
                  <div style={{ marginTop: 6, width: 40, height: 40, borderRadius: '50%',
                    background: '#F5B301', color: TZ.primaryDark, fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>TJ</div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4 }}>TuzosJrz</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: -1 }}>VS</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{category}</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#F5B301', letterSpacing: 1 }}>RIVAL</div>
                  <div style={{ marginTop: 6, width: 40, height: 40, borderRadius: '50%',
                    background: 'rgba(255,255,255,0.15)', color: '#fff', border: '2px solid rgba(255,255,255,0.4)',
                    fontFamily: '"Barlow Condensed", sans-serif',
                    fontWeight: 800, fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {rival.split(' ').map(w => w[0]).slice(0, 2).join('') || '?'}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, marginTop: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rival}</div>
                </div>
              </div>
            </div>
            <div style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <ReviewRow icon="calendar" label="Fecha" value={new Date(date + 'T' + matchTime).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} />
              <ReviewRow icon="stat" label="Hora del partido" value={matchTime} />
              <ReviewRow icon="check" label="Cita" value={callTime + ' hrs'} />
              <ReviewRow icon="tshirt" label="Uniforme" value={uniform === 'local' ? 'Local (azul)' : 'Visitante (dorado)'} />
              <ReviewRow icon="dot" label="Sede" value={location.name} sub={location.address} />
              {notes && <ReviewRow icon="doc" label="Notas" value={notes} />}
              <ReviewRow icon="users" label="Convocados" value={`${convocados.size} jugadores`} />
              {snackPlayerId && (() => {
                const sp = window.TZ_DATA.PLAYERS.find(p => p.id === snackPlayerId);
                return sp ? <ReviewRow icon="dot" label="🍎 Snack" value={sp.name} sub={sp.tutor ? `${sp.tutor.name} (${sp.tutor.relation})` : ''} /> : null;
              })()}
            </div>
          </div>

          {/* Notifications summary */}
          <div style={{ marginTop: 16, padding: 14, background: '#F0FDF4', border: '1px solid #BBF7D0',
            borderRadius: 12, fontSize: 12, color: '#166534' }}>
            <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
              Se dispararán:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4, lineHeight: 1.6 }}>
              <div>✓ Push a los padres de los {convocados.size} convocados</div>
              <div>✓ Mensaje al grupo de {category} en el chat</div>
              <div>✓ Email + adjunto .ics (calendario)</div>
              <div>✓ Recordatorio 24 h antes y 2 h antes</div>
            </div>
          </div>

          <div style={{ marginTop: 20, display: 'flex', gap: 10 }}>
            <button onClick={() => setStep(3)} style={{
              flex: 1, padding: '14px', borderRadius: 12,
              background: '#EEF0F4', color: TZ.ink, border: 0,
              fontSize: 14, fontWeight: 700, cursor: 'pointer',
            }}>Ajustar</button>
            <button onClick={() => {
              // Persist snack assignment
              if (snackPlayerId) {
                window.saveSnackAssignment(`match-${date}-${matchTime}`, snackPlayerId);
              }
              onSave({
                type: kind, category, rival, date, matchTime, callTime, uniform, location, notes,
                convocados: Array.from(convocados), snackPlayerId,
              });
            }} style={{
              flex: 2, padding: '14px', borderRadius: 12,
              background: TZ.primary, color: '#fff', border: 0,
              fontSize: 14, fontWeight: 800, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="check" size={16} color="#fff" strokeWidth={2.5} />
              Crear y enviar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ReviewRow({ icon, label, value, sub }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div style={{ width: 28, height: 28, borderRadius: 7, background: '#F4F5F8',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
        <Icon name={icon} size={14} color={TZ.inkSoft} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 13, color: TZ.ink, fontWeight: 500, marginTop: 1,
          textTransform: label === 'Fecha' ? 'capitalize' : 'none' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

function UniformIcon({ color }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill={color} stroke={color === '#F5B301' ? '#0F2560' : '#fff'} strokeWidth="1">
      <path d="M8 4l-4 2 1.5 4L7 9v10h10V9l1.5 1L20 6l-4-2-2 2h-4L8 4z"/>
    </svg>
  );
}

function MiniCount({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: -0.4, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color: TZ.muted, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
    </div>
  );
}

// Bottom sheet local copy (avoid collision with Profile's BottomSheet)
function BottomSheet({ open, title, onClose, children }) {
  if (!open) return null;
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: TZ.ink }}>{title}</div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="close" size={16} color={TZ.inkSoft} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Local Toggle
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} style={{
      width: 44, height: 26, borderRadius: 13, border: 0, cursor: 'pointer',
      background: on ? TZ.primary : '#D1D5DB', position: 'relative',
      transition: 'background 0.15s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 20 : 2,
        width: 22, height: 22, borderRadius: '50%', background: '#fff',
        transition: 'left 0.15s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

const quickBtn = {
  flex: 1, padding: '10px', borderRadius: 10, border: '1px solid ' + TZ.line,
  background: '#fff', color: TZ.inkSoft, fontSize: 12, fontWeight: 600, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
};

// ── Wrapper flow ─────────────────────────────────────────────
function CreateEventFlow({ back, role, coachCategory, onCreated }) {
  const [screen, setScreen] = React.useState('picker'); // picker | training | match | friendly | meeting | party | success
  const [saved, setSaved] = React.useState(null);

  const handleSave = (data) => { setSaved(data); setScreen('success'); onCreated && onCreated(data); };

  if (screen === 'picker') {
    return <CreateEventPicker back={back} role={role} coachCategory={coachCategory}
      onPick={(t) => setScreen(t)} />;
  }
  if (screen === 'training') return <CreateTraining back={() => setScreen('picker')} onSave={handleSave} role={role} coachCategory={coachCategory} />;
  if (screen === 'match')    return <CreateMatch back={() => setScreen('picker')} onSave={handleSave} role={role} coachCategory={coachCategory} kind="match" />;
  if (screen === 'friendly') return <CreateMatch back={() => setScreen('picker')} onSave={handleSave} role={role} coachCategory={coachCategory} kind="friendly" />;
  if (screen === 'meeting') {
    return <SimpleEventStub back={() => setScreen('picker')} onSave={handleSave} icon="📋" label="Evento del club"
      hint="Reuniones, juntas con padres, presentaciones oficiales." />;
  }
  if (screen === 'success') return <SuccessScreen data={saved} back={back} />;
  return null;
}

function SimpleEventStub({ back, onSave, icon, label, hint }) {
  const [title, setTitle] = React.useState('');
  const [dateTime, setDateTime] = React.useState('2026-09-30T19:00');
  const [location, setLocation] = React.useState(KNOWN_PLACES[0]);
  const canSave = title && dateTime;
  return (
    <div style={{ paddingBottom: 100, minHeight: '100%', background: '#F4F5F8' }}>
      <div style={{ padding: '54px 20px 18px', background: `linear-gradient(155deg, ${TZ.primary}, ${TZ.primaryDark})`,
        color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={back} style={{ width: 36, height: 36, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="chevronL" size={18} color="#fff" />
          </button>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>NUEVO</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 22 }}>{icon}</span> {label}
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '18px 16px 0', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ fontSize: 12, color: TZ.muted, padding: '0 4px' }}>{hint}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
          background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
            <Icon name="doc" size={16} color={TZ.inkSoft} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>Título</div>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="Ej. Junta de padres Sub-12"
              style={{ width: '100%', border: 0, outline: 'none', background: 'transparent',
                fontSize: 14, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1, fontFamily: 'inherit' }} />
          </div>
        </div>
        <DateTimeField label="Fecha y hora" value={dateTime} onChange={setDateTime} icon="calendar" />
        <LocationPicker value={location} onChange={setLocation} />
        <button disabled={!canSave} onClick={() => onSave({ type: 'other', title, dateTime, location })} style={{
          width: '100%', padding: '15px', borderRadius: 12, border: 0, marginTop: 8,
          background: canSave ? TZ.primary : '#D5D9E2',
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: canSave ? 'pointer' : 'not-allowed',
          boxShadow: canSave ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <Icon name="check" size={18} color="#fff" strokeWidth={2.5} />
          Crear evento
        </button>
      </div>
    </div>
  );
}

function SuccessScreen({ data, back }) {
  const isMatch = data.type === 'match' || data.type === 'friendly';
  return (
    <div style={{ minHeight: '100%', background: '#F4F5F8', paddingBottom: 100,
      display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '54px 20px 20px', background: `linear-gradient(155deg, ${TZ.ok}, #15803D)`,
        color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', textAlign: 'center', paddingTop: 12 }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
          }}>
            <Icon name="check" size={36} color={TZ.ok} strokeWidth={3} />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, marginTop: 14, letterSpacing: -0.4 }}>
            ¡{isMatch ? 'Partido' : data.type === 'training' ? 'Entrenamiento' : 'Evento'} creado!
          </div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 6 }}>
            Los avisos ya se enviaron a las familias.
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 16px', flex: 1 }}>
        {isMatch ? (
          <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 12, color: TZ.muted, fontWeight: 700 }}>{data.category}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: TZ.ink, marginTop: 4 }}>vs {data.rival}</div>
            <div style={{ fontSize: 13, color: TZ.inkSoft, marginTop: 6 }}>
              {new Date(data.date + 'T' + data.matchTime).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })} · {data.matchTime}
            </div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>{data.location.name}</div>
            <div style={{ marginTop: 14, padding: 12, background: '#F4F5F8', borderRadius: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Convocatoria enviada</div>
              <div style={{ fontSize: 13, color: TZ.ink, fontWeight: 500 }}>{data.convocados.length} jugadores · Esperando confirmaciones</div>
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: TZ.ink }}>{data.title || (data.type === 'training' ? 'Entrenamiento' : 'Evento')}</div>
            <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 6 }}>{data.category || ''}</div>
            <div style={{ fontSize: 13, color: TZ.inkSoft, marginTop: 4 }}>{data.location?.name}</div>
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px 24px', display: 'flex', gap: 10 }}>
        <button onClick={back} style={{
          flex: 1, padding: '14px', borderRadius: 12,
          background: '#EEF0F4', color: TZ.ink, border: 0,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
        }}>Ir al calendario</button>
        <button onClick={back} style={{
          flex: 1, padding: '14px', borderRadius: 12,
          background: TZ.primary, color: '#fff', border: 0,
          fontSize: 14, fontWeight: 700, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
        }}>Hecho</button>
      </div>
    </div>
  );
}

Object.assign(window, { CreateEventFlow, LocationPicker, KNOWN_PLACES });
