// TuzosJrz — Parent home (post-approval) + child profile as viewed by parent

const iconBtnDark = {
  width: 40, height: 40, borderRadius: '50%', border: 0,
  background: 'rgba(255,255,255,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

// Simulated children for the parent account
const PARENT_CHILDREN = [
  { id: 1,  first: 'Diego',   last: 'Hernández', number: 7,  position: 'DC',  category: 'Sub-12', age: 11 },
  { id: 42, first: 'Sofía',   last: 'Hernández', number: 10, position: 'MCO', category: 'Sub-10', age: 9  },
];

function ParentHome({ nav, openChild, onPay }) {
  const [childId, setChildId] = React.useState(PARENT_CHILDREN[0].id);
  const [childPickerOpen, setChildPickerOpen] = React.useState(false);
  const child = PARENT_CHILDREN.find(c => c.id === childId);
  // Enrich with data from mock DB
  const dbChild = window.TZ_DATA.PLAYERS.find(p => p.id === childId) || {
    ...child, medical: { status: 'apto', height: 138, weight: 34 }, paymentStatus: 'pendiente', balance: -850, attendance: { rate: 92 },
  };

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero with child selector */}
      <div style={{
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '54px 20px 24px', borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
            <window.PhotoAvatar
              entityId="parent-carlos-hernandez"
              entityKind="parent"
              name="Carlos Hernández"
              size={52}
              canEdit={true}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, opacity: 0.75 }}>PORTAL PADRES</div>
              <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Hola, Carlos 👋</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
            <button style={iconBtnDark}><Icon name="bell" size={18} color="#fff" /></button>
          </div>
        </div>

        {/* Child selector chip */}
        <button onClick={() => setChildPickerOpen(true)} style={{
          position: 'relative', marginTop: 20, width: '100%',
          background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 14, padding: '12px 14px', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${(child.id * 47) % 360} 55% 55%), hsl(${((child.id * 47) + 40) % 360} 60% 40%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, color: '#fff',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>{child.first[0]}{child.last[0]}</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontSize: 9, letterSpacing: 1.5, opacity: 0.7, fontWeight: 700 }}>VIENDO A</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginTop: 1 }}>{child.first} {child.last}</div>
            <div style={{ fontSize: 11, opacity: 0.75, marginTop: 1 }}>{child.category} · #{child.number} · {child.position}</div>
          </div>
          {PARENT_CHILDREN.length > 1 && (
            <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: 4, display: 'flex' }}>
              <Icon name="swap" size={16} color="#fff" />
            </div>
          )}
        </button>
      </div>

      {/* Child picker sheet */}
      {childPickerOpen && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(15,23,42,0.5)', zIndex: 100,
          display: 'flex', alignItems: 'flex-end',
        }} onClick={() => setChildPickerOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
            padding: '10px 20px 44px',
          }}>
            <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 12 }}>
              Selecciona un hijo
            </div>
            {PARENT_CHILDREN.map(c => (
              <button key={c.id} onClick={() => { setChildId(c.id); setChildPickerOpen(false); }} style={{
                width: '100%', padding: '12px', border: c.id === childId ? `2px solid ${TZ.primary}` : '2px solid ' + TZ.line,
                borderRadius: 14, background: c.id === childId ? 'rgba(29,61,138,0.05)' : '#fff',
                display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', marginBottom: 8, textAlign: 'left',
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${(c.id * 47) % 360} 55% 55%), hsl(${((c.id * 47) + 40) % 360} 60% 40%))`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
                }}>{c.first[0]}{c.last[0]}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{c.first} {c.last}</div>
                  <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{c.category} · #{c.number}</div>
                </div>
                {c.id === childId && <Icon name="check" size={20} color={TZ.primary} />}
              </button>
            ))}
            <button style={{
              width: '100%', padding: '12px', border: '1.5px dashed ' + TZ.line,
              borderRadius: 14, background: 'transparent',
              display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
              color: TZ.primary, fontSize: 13, fontWeight: 700,
            }}>
              <Icon name="plus" size={16} color={TZ.primary} />
              Vincular otro hijo
            </button>
          </div>
        </div>
      )}

      <div style={{ padding: '0 16px' }}>
        {/* Documents pending banner */}
        <div style={{ marginTop: 16 }}>
          <window.DocsWarningBanner
            playerId={child.id}
            playerName={child.first}
            onOpen={() => openChild(child.id)}
          />
        </div>

        {/* Next event with confirmation CTA */}
        <SectionTitle>Próxima convocatoria</SectionTitle>
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{
            padding: 16, background: 'linear-gradient(105deg, rgba(245,179,1,0.12), rgba(245,179,1,0.02))',
            borderBottom: '1px solid ' + TZ.line,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <Chip tone="gold">PARTIDO</Chip>
                <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink, marginTop: 8, letterSpacing: -0.3 }}>vs Tigres Jr.</div>
                <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 4 }}>
                  <strong style={{ color: TZ.ink }}>Sáb 26 Sep · 10:30</strong>
                </div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Estadio Hidalgo · Cita 09:30</div>
              </div>
              <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: '#fff', border: '1px solid ' + TZ.line, textAlign: 'center',
                padding: '6px 0', flexShrink: 0,
              }}>
                <div style={{ fontSize: 9, fontWeight: 800, color: TZ.err, letterSpacing: 1 }}>SEP</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, lineHeight: 1 }}>26</div>
              </div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            <button style={{
              padding: '14px', border: 0, borderRight: '1px solid ' + TZ.line,
              background: 'transparent', color: TZ.err, fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="close" size={14} color={TZ.err} />
              No podrá ir
            </button>
            <button style={{
              padding: '14px', border: 0, background: TZ.primary, color: '#fff',
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <Icon name="check" size={14} color="#fff" />
              Confirmar asistencia
            </button>
          </div>
        </Card>

        {/* Payment status */}
        <SectionTitle>Snack del próximo partido</SectionTitle>
        <window.NextSnackWidget role="parent" category="Sub-12" />

        <SectionTitle>Estado de pagos</SectionTitle>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Cuota Septiembre</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: TZ.ink, marginTop: 4, letterSpacing: -0.5 }}>
                $850 <span style={{ fontSize: 12, color: TZ.muted, fontWeight: 600 }}>MXN</span>
              </div>
              <div style={{ marginTop: 6 }}>
                <Chip tone="warn">Vence en 3 días</Chip>
              </div>
            </div>
            <button onClick={onPay} style={{
              padding: '12px 18px', border: 0, borderRadius: 12,
              background: TZ.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <Icon name="wallet" size={16} color="#fff" />
              Pagar
            </button>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid ' + TZ.line,
            display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: TZ.muted }}>Últimos 3 pagos</span>
            <span style={{ color: TZ.primary, fontWeight: 700, cursor: 'pointer' }}>Ver historial</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {['Ago', 'Jul', 'Jun'].map(m => (
              <div key={m} style={{
                flex: 1, padding: '8px 6px', textAlign: 'center',
                background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 8,
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', letterSpacing: 0.5 }}>{m.toUpperCase()}</div>
                <div style={{ fontSize: 11, color: '#166534', marginTop: 2, fontWeight: 600 }}>✓ $850</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Attendance mini */}
        <SectionTitle action={{ label: 'Ver todo', onClick: () => {} }}>Asistencia · últimas 8 sesiones</SectionTitle>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
            <div>
              <div style={{ fontSize: 32, fontWeight: 800, color: TZ.ok, letterSpacing: -0.5, lineHeight: 1 }}>{dbChild.attendance.rate}%</div>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600, marginTop: 4 }}>asistencia del mes</div>
            </div>
            <button style={{
              padding: '8px 12px', border: '1px solid ' + TZ.line, borderRadius: 999,
              background: '#fff', color: TZ.inkSoft, fontSize: 12, fontWeight: 600, cursor: 'pointer',
            }}>Justificar ausencia</button>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            {['P','P','P','J','P','P','A','P'].map((s, i) => {
              const c = s === 'P' ? TZ.ok : s === 'J' ? TZ.warn : TZ.err;
              return (
                <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 32, borderRadius: 6, background: c, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 800,
                  }}>{s}</div>
                  <div style={{ fontSize: 9, color: TZ.muted, marginTop: 4, fontWeight: 600 }}>{[13,15,18,20,22,25,27,29][i]}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Quick actions */}
        <SectionTitle>Acceso rápido</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <QuickTile
            icon="users" tint={TZ.primary}
            title="Ficha de mi hijo"
            sub="Info · médica · dorsal"
            onClick={() => openChild(child.id)}
          />
          <QuickTile
            icon="calendar" tint="#0F766E"
            title="Calendario"
            sub="Entrenos y partidos"
          />
          <QuickTile
            icon="mail" tint="#B45309"
            title="Chat con coach"
            sub="Coach Ramírez"
            badge={2}
          />
          <QuickTile
            icon="receipt" tint="#7C3AED"
            title="Mis recibos"
            sub="Descarga y comparte"
          />
        </div>

        {/* Coach message */}
        <SectionTitle>Mensajes recientes</SectionTitle>
        <Card>
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'linear-gradient(135deg, #0F172A, #334155)', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800,
              flexShrink: 0,
            }}>CR</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>Coach Ramírez</span>
                <span style={{ fontSize: 10, color: TZ.muted, fontWeight: 600 }}>10:22</span>
              </div>
              <div style={{ fontSize: 13, color: TZ.inkSoft, marginTop: 4, lineHeight: 1.5 }}>
                Recordatorio: mañana llevar botella extra de agua y espinilleras nuevas para el partido…
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function QuickTile({ icon, title, sub, tint, badge, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14,
      padding: 14, cursor: 'pointer', textAlign: 'left', position: 'relative',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10, background: tint,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        <Icon name={icon} size={18} color="#fff" />
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink, marginTop: 10 }}>{title}</div>
      <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{sub}</div>
      {badge && (
        <div style={{
          position: 'absolute', top: 10, right: 10, minWidth: 20, height: 20, padding: '0 6px',
          borderRadius: 999, background: TZ.err, color: '#fff', fontSize: 11, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>{badge}</div>
      )}
    </button>
  );
}

// ── Parent view of child profile ─────────────────────────────
function ParentChildProfile({ childId, back }) {
  const p = window.TZ_DATA.PLAYERS.find(x => x.id === childId)
    || { id: childId, first: 'Sofía', last: 'Hernández', name: 'Sofía Hernández',
         number: 10, position: 'MCO', category: 'Sub-10', age: 9, birthYear: 2017,
         phone: '—', email: '—',
         medical: { status: 'apto', height: 138, weight: 34, bloodType: 'O+',
           allergies: 'Ninguna', medication: 'Ninguna', lastCheckup: '5 Ago 2026',
           emergencyContact: { name: 'Carlos Hernández', phone: '+52 771 234 5678' }, injuries: [], notes: '' },
         attendance: { rate: 92 }, paymentStatus: 'al-dia' };
  const [tab, setTab] = React.useState('info');

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        background: `linear-gradient(160deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '54px 20px 66px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={back} style={iconBtnDark}>
            <Icon name="chevronL" size={20} color="#fff" />
          </button>
        </div>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16, marginTop: 22 }}>
          <window.PhotoAvatar
            entityId={`player-${p.id}`}
            entityKind="player"
            name={p.name}
            size={78}
            canEdit={false}
            showRing
            hue={(p.id * 47) % 360}
          />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301', textTransform: 'uppercase' }}>Ficha de mi hijo</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>{p.name}</div>
            <div style={{ marginTop: 6, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <Chip tone="dark">#{p.number} · {p.position}</Chip>
              <Chip tone="dark">{p.category}</Chip>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: -46, position: 'relative' }}>
        {/* Tabs — Info · Médica · Docs · Historial */}
        <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 12, padding: 4, boxShadow: '0 8px 16px rgba(15,23,42,0.08)' }}>
          {[
            { id: 'info', label: 'Info' },
            { id: 'medical', label: 'Médica' },
            { id: 'docs', label: 'Docs' },
            { id: 'history', label: 'Historial' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '10px 4px', border: 0, borderRadius: 9,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? TZ.ink : TZ.inkSoft,
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {tab === 'info' && (
          <>
            <SectionTitle>Datos deportivos</SectionTitle>
            <Card padded={false}>
              <ProfileRow icon="tshirt" label="Dorsal · Posición" value={`#${p.number} · ${p.position}`} />
              <ProfileRow icon="calendar" label="Categoría" value={p.category} />
              <ProfileRow icon="whistle" label="Entrenador" value="Coach Ramírez" last />
            </Card>
            <SectionTitle>Datos personales</SectionTitle>
            <Card padded={false}>
              <ProfileRow icon="calendar" label="Edad" value={`${p.age} años · ${p.birthYear}`} last />
            </Card>
          </>
        )}

        {tab === 'medical' && (
          <>
            <div style={{
              marginTop: 18, padding: '10px 14px',
              background: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: 10,
              fontSize: 12, color: '#1E3A8A',
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <Icon name="medical" size={16} color="#1E3A8A" />
              Los datos médicos los actualiza el fisio del club.
            </div>
            <SectionTitle>Biometría</SectionTitle>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              <BioCard label="Peso" value={p.medical.weight} unit="kg" />
              <BioCard label="Altura" value={p.medical.height} unit="cm" />
              <BioCard label="Estado" value={p.medical.status === 'apto' ? 'Apto' : 'Recup.'} unit="" />
            </div>
            <SectionTitle>Datos clínicos</SectionTitle>
            <Card padded={false}>
              <ProfileRow label="Tipo de sangre" value={p.medical.bloodType} />
              <ProfileRow label="Alergias" value={p.medical.allergies} />
              <ProfileRow label="Medicación" value={p.medical.medication} />
              <ProfileRow label="Último chequeo" value={p.medical.lastCheckup} last />
            </Card>
          </>
        )}

        {tab === 'docs' && (
          <div style={{ marginTop: 4 }}>
            <window.DocsUploader playerId={p.id} role="parent" playerName={p.name} />
          </div>
        )}

        {tab === 'history' && (
          <>
            <SectionTitle>Últimos entrenamientos</SectionTitle>
            <Card padded={false}>
              {['Vie 20','Mié 18','Lun 16','Vie 13','Mié 11'].map((d, i) => {
                const r = ['P','P','J','P','P'][i];
                const tone = r === 'P' ? 'ok' : r === 'J' ? 'warn' : 'err';
                const label = r === 'P' ? 'Presente' : r === 'J' ? 'Justificado' : 'Ausente';
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderTop: i === 0 ? 0 : '1px solid ' + TZ.line }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 8, background: '#EEF0F4',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      fontSize: 11, fontWeight: 700, color: TZ.ink, lineHeight: 1.1,
                    }}>{d.slice(0,3)}<span style={{ fontSize: 10, color: TZ.muted }}>{d.slice(4)}</span></div>
                    <span style={{ flex: 1, fontSize: 13, color: TZ.ink }}>Entrenamiento · {p.category}</span>
                    <Chip tone={tone}>{label}</Chip>
                  </div>
                );
              })}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}

// Parent tab bar (5 tabs adapted)
function ParentTabBar({ tab, onChange }) {
  const items = [
    { id: 'home',     label: 'Inicio',   icon: 'home' },
    { id: 'child',    label: 'Mi hijo',  icon: 'users' },
    { id: 'calendar', label: 'Agenda',   icon: 'calendar' },
    { id: 'chat',     label: 'Chat',     icon: 'mail' },
    { id: 'profile',  label: 'Perfil',   icon: 'user' },
  ];
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      paddingBottom: 26, paddingTop: 8, background: 'rgba(255,255,255,0.94)',
      backdropFilter: 'blur(20px) saturate(180%)',
      WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      borderTop: '1px solid rgba(15,23,42,0.06)',
      display: 'flex', justifyContent: 'space-around',
    }}>
      {items.map(it => {
        const active = tab === it.id;
        return (
          <button key={it.id} onClick={() => onChange(it.id)} style={{
            background: 'transparent', border: 0, padding: '4px 8px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3,
            color: active ? TZ.primary : TZ.muted,
          }}>
            <Icon name={it.icon} size={24} />
            <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}>{it.label}</span>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { ParentHome, ParentChildProfile, ParentTabBar, PARENT_CHILDREN });
