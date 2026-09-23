// TuzosJrz — Coach role (staff deportivo, scoped to assigned category)

function CoachHome({ nav, openPlayer, category, coachName = 'Ramírez' }) {
  const { PLAYERS } = window.TZ_DATA;
  const roster = PLAYERS.filter(p => p.category === category);
  const avgAttendance = Math.round(roster.reduce((s, p) => s + p.attendance.rate, 0) / roster.length);
  const injured = roster.filter(p => p.medical.status !== 'apto').length;
  const behind = roster.filter(p => p.paymentStatus === 'atrasado').length;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '54px 20px 24px', borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button style={iconBtnDark}><Icon name="bell" size={20} color="#fff" /></button>
          <button style={iconBtnDark}>
            <div style={{ width: 28, height: 28, borderRadius: '50%',
              background: '#F5B301', color: TZ.primaryDark, fontSize: 13, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>R</div>
          </button>
        </div>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginTop: 18 }}>
          <window.ClubCrest size={64} />
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>PANEL ENTRENADOR</div>
            <div style={{
              fontSize: 26, fontWeight: 800, letterSpacing: -0.6, marginTop: 2, lineHeight: 1,
              fontFamily: '"Barlow Condensed", Impact, sans-serif', textTransform: 'uppercase',
            }}>Coach {coachName}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ padding: '3px 8px', borderRadius: 999, background: '#F5B301',
                color: TZ.primaryDark, fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>{category}</span>
              <span style={{ fontSize: 11, opacity: 0.8, fontWeight: 600 }}>{roster.length} jugadores</span>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 20, fontSize: 15, opacity: 0.85 }}>
          Hoy tienes entrenamiento a las <strong style={{ color: '#F5B301' }}>17:00</strong>.
        </div>

        {/* KPI strip */}
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 18 }}>
          <MiniKpi label="Asistencia" value={`${avgAttendance}%`} sub="promedio mes" />
          <MiniKpi label="Aptos hoy" value={`${roster.length - injured}/${roster.length}`} sub="disponibles" />
          <MiniKpi label="Lesionados" value={injured} sub={injured === 1 ? '1 jugador' : `${injured} jugadores`} tone={injured > 0 ? 'warn' : 'ok'} />
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Next session — big CTA */}
        <SectionTitle>Próxima sesión</SectionTitle>
        <div style={{
          background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 16, padding: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: TZ.primary }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Chip tone="brand">ENTRENO</Chip>
              <div style={{ fontSize: 17, fontWeight: 800, color: TZ.ink, marginTop: 8 }}>Cancha 2 · CAR Pachuca</div>
              <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 4 }}>
                <strong style={{ color: TZ.ink }}>Hoy · 17:00</strong> · 90 min
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: 12, background: 'rgba(29,61,138,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: TZ.primary, letterSpacing: 1 }}>HOY</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: TZ.ink, lineHeight: 1 }}>17:00</div>
            </div>
          </div>
          <button onClick={() => nav('attend')} style={{
            marginTop: 14, width: '100%', padding: '13px', border: 0, borderRadius: 12,
            background: TZ.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
          }}>
            <Icon name="check" size={16} color="#fff" />
            Pasar lista ahora
          </button>
        </div>

        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
          <QuickAction icon="board" label="Pizarra" color="#0F172A" onClick={() => nav('tactics')} />
          <QuickAction icon="plus" label="Nuevo evento" color="#B45309" onClick={() => nav('createEvent')} />
          <QuickAction icon="mail" label="Chat padres" color="#0F766E" onClick={() => nav('chat')} />
        </div>

        {/* Medical alerts */}
        {injured > 0 && (
          <>
            <SectionTitle>Alertas médicas del grupo</SectionTitle>
            <Card padded={false}>
              {roster.filter(p => p.medical.status !== 'apto').map((p, i) => (
                <div key={p.id} onClick={() => openPlayer(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                  borderTop: i === 0 ? 0 : '1px solid ' + TZ.line, cursor: 'pointer',
                }}>
                  <Avatar player={p} size={38} showNumber={false} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>#{p.number} · {p.position}</div>
                  </div>
                  <Chip tone={p.medical.status === 'lesionado' ? 'err' : 'warn'}>
                    {p.medical.status === 'lesionado' ? 'Lesionado' : 'Recuperación'}
                  </Chip>
                </div>
              ))}
            </Card>
          </>
        )}

        {/* Squad snapshot with permission note */}
        <SectionTitle>Snack del próximo partido</SectionTitle>
        <window.NextSnackWidget role="coach" category={category} />

        <SectionTitle action={{ label: 'Ver plantilla', onClick: () => nav('roster') }}>Mi plantilla · {category}</SectionTitle>
        <Card padded={false}>
          {roster.slice(0, 5).map((p, i) => (
            <CoachPlayerRow key={p.id} player={p} first={i === 0} onClick={() => openPlayer(p.id)} />
          ))}
          {roster.length > 5 && (
            <div style={{ padding: '10px 14px', textAlign: 'center', borderTop: '1px solid ' + TZ.line,
              fontSize: 12, fontWeight: 600, color: TZ.primary, cursor: 'pointer' }} onClick={() => nav('roster')}>
              Ver los {roster.length - 5} restantes
            </div>
          )}
        </Card>

        {/* Permissions note */}
        <div style={{
          marginTop: 18, padding: '12px 14px', borderRadius: 10,
          background: '#EFF6FF', border: '1px solid #DBEAFE',
          display: 'flex', gap: 10, alignItems: 'flex-start',
        }}>
          <div style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%',
            background: '#1E3A8A', color: '#fff', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>i</div>
          <div style={{ fontSize: 12, color: '#1E3A8A', lineHeight: 1.5 }}>
            Como entrenador, puedes ver el estado de pago (al día / atrasado) de tus jugadores como referencia. <strong>El cobro y los montos los gestiona el administrador.</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── COACH ROSTER (lista scoped) ──────────────────────────────
function CoachRoster({ openPlayer, category }) {
  const roster = window.TZ_DATA.PLAYERS.filter(p => p.category === category);
  const [query, setQuery] = React.useState('');
  const filtered = roster.filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Mi plantilla" subtitle={`${category} · ${roster.length} jugadores`} />
      <div style={{ padding: '0 16px' }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 14px', border: '1px solid ' + TZ.line,
        }}>
          <Icon name="search" size={18} color={TZ.muted} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar jugador…"
            style={{ border: 0, outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }} />
        </div>

        <div style={{ marginTop: 14 }}>
          <Card padded={false}>
            {filtered.map((p, i) => (
              <CoachPlayerRow key={p.id} player={p} first={i === 0} onClick={() => openPlayer(p.id)} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

function CoachPlayerRow({ player: p, first, onClick }) {
  // Semáforo pago — sin montos, solo estado
  const payTone = p.paymentStatus === 'al-dia' ? 'ok' : p.paymentStatus === 'pendiente' ? 'warn' : 'err';
  const payLabel = p.paymentStatus === 'al-dia' ? 'Al día' : p.paymentStatus === 'pendiente' ? 'Pendiente' : 'Atrasado';
  const medTone = p.medical.status === 'apto' ? 'ok' : p.medical.status === 'lesionado' ? 'err' : 'warn';

  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', cursor: 'pointer',
      borderTop: first ? 0 : '1px solid ' + TZ.line,
    }}>
      <Avatar player={p} size={40} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: TZ.ink,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 3, alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{p.position}</span>
          <span style={{ fontSize: 11, color: TZ.muted }}>·</span>
          <span style={{ fontSize: 11, color: TZ.muted }}>{p.attendance.rate}% asist.</span>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
        {/* Med chip */}
        {p.medical.status !== 'apto' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <StatusDot tone={medTone} />
            <span style={{ fontSize: 10, color: medTone === 'err' ? TZ.err : TZ.warn, fontWeight: 700 }}>
              {p.medical.status === 'lesionado' ? 'Lesión' : 'Recup.'}
            </span>
          </div>
        )}
        {/* Pay semáforo (sin monto) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <StatusDot tone={payTone} />
          <span style={{
            fontSize: 10, fontWeight: 700,
            color: payTone === 'ok' ? TZ.ok : payTone === 'warn' ? TZ.warn : TZ.err,
          }}>{payLabel}</span>
        </div>
      </div>
    </div>
  );
}

// ── COACH PLAYER PROFILE ──────────────────────────────────────
function CoachPlayerProfile({ playerId, back }) {
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
          <button onClick={back} style={iconBtnDark}>
            <Icon name="chevronL" size={20} color="#fff" />
          </button>
          <button style={iconBtnDark}>
            <Icon name="mail" size={18} color="#fff" />
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
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px', marginTop: -46, position: 'relative' }}>
        {/* Tabs — Info · Médica · Docs · Historial */}
        <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 12, padding: 4,
          boxShadow: '0 8px 16px rgba(15,23,42,0.08)' }}>
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

        {tab === 'info' && <CoachInfoTab p={p} />}
        {tab === 'medical' && <CoachMedicalTab p={p} />}
        {tab === 'docs' && <div style={{ marginTop: 4 }}><window.DocsUploader playerId={p.id} role="coach" playerName={p.name} /></div>}
        {tab === 'history' && <CoachHistoryTab p={p} />}
      </div>
    </div>
  );
}

function CoachInfoTab({ p }) {
  return (
    <>
      {/* Payment semáforo — read only, no montos */}
      <SectionTitle>Estado administrativo</SectionTitle>
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <StatusDot tone={p.paymentStatus === 'al-dia' ? 'ok' : p.paymentStatus === 'atrasado' ? 'err' : 'warn'} size={12} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>
              {p.paymentStatus === 'al-dia' ? 'Al día con las cuotas'
                : p.paymentStatus === 'pendiente' ? 'Pago pendiente del mes'
                : 'Atrasado en cuotas'}
            </div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
              🔒 Los montos y cobros los gestiona el administrador
            </div>
          </div>
        </div>
      </Card>

      <SectionTitle action={{ label: 'Editar', onClick: () => {} }}>Perfil deportivo</SectionTitle>
      <Card padded={false}>
        <window.ProfileRow icon="tshirt" label="Dorsal · Posición" value={`#${p.number} · ${p.position}`} />
        <window.ProfileRow icon="calendar" label="Categoría" value={p.category} last />
      </Card>

      <SectionTitle>Datos personales</SectionTitle>
      <Card padded={false}>
        <window.ProfileRow icon="calendar" label="Edad" value={`${p.age} años · ${p.birthYear}`} />
        <window.ProfileRow icon="phone" label="Teléfono" value={p.phone} last />
      </Card>

      {p.tutor && (
        <>
          <SectionTitle>Tutor</SectionTitle>
          <Card padded={false}>
            <window.ProfileRow icon="users" label={p.tutor.relation} value={p.tutor.name} />
            <window.ProfileRow icon="phone" label="Teléfono" value={p.tutor.phone} last />
          </Card>
        </>
      )}
    </>
  );
}

function CoachMedicalTab({ p }) {
  const m = p.medical;
  const [editing, setEditing] = React.useState(false);
  const [notes, setNotes] = React.useState(m.notes || '');
  const [weight, setWeight] = React.useState(m.weight);
  const imc = (weight / Math.pow(m.height / 100, 2)).toFixed(1);
  const statusMap = {
    apto: { tone: 'ok', label: 'Apto para actividad completa' },
    recuperacion: { tone: 'warn', label: 'En recuperación · carga diferenciada' },
    lesionado: { tone: 'err', label: 'Lesionado · sin entrenar' },
  };
  const s = statusMap[m.status];

  return (
    <>
      {/* Editable banner */}
      <div style={{
        marginTop: 18, padding: '10px 14px',
        background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10,
        display: 'flex', alignItems: 'center', gap: 8,
        fontSize: 12, color: '#166534',
      }}>
        <Icon name="check" size={16} color="#166534" />
        <span style={{ flex: 1 }}>Como entrenador puedes editar la ficha médica.</span>
        <button onClick={() => setEditing(e => !e)} style={{
          background: editing ? TZ.ok : '#fff', color: editing ? '#fff' : '#166534',
          border: '1px solid #86EFAC', borderRadius: 999, padding: '4px 12px',
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
        }}>{editing ? 'Guardar' : 'Editar'}</button>
      </div>

      {/* Status */}
      <div style={{
        background: s.tone === 'ok' ? '#F0FDF4' : s.tone === 'warn' ? '#FFFBEB' : '#FEF2F2',
        border: '1px solid ' + (s.tone === 'ok' ? '#BBF7D0' : s.tone === 'warn' ? '#FDE68A' : '#FECACA'),
        borderRadius: 12, padding: '12px 14px', marginTop: 14,
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
        {editing ? (
          <div style={{ background: '#fff', border: '2px solid ' + TZ.primary, borderRadius: 14, padding: '10px 8px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: TZ.primary, fontWeight: 800, letterSpacing: 0.8, textTransform: 'uppercase' }}>Peso · edit</div>
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)}
              style={{ marginTop: 6, width: '100%', border: 0, outline: 'none', textAlign: 'center',
                fontSize: 20, fontWeight: 800, color: TZ.ink }} />
            <div style={{ fontSize: 10, color: TZ.muted }}>kg</div>
          </div>
        ) : (
          <window.BioCard label="Peso" value={weight} unit="kg" />
        )}
        <window.BioCard label="Altura" value={m.height} unit="cm" />
        <window.BioCard label="IMC" value={imc} unit="" />
      </div>

      <SectionTitle>Ficha clínica</SectionTitle>
      <Card padded={false}>
        <window.ProfileRow label="Tipo de sangre" value={m.bloodType} />
        <window.ProfileRow label="Alergias" value={m.allergies} />
        <window.ProfileRow label="Medicación" value={m.medication} />
        <window.ProfileRow label="Último chequeo" value={m.lastCheckup} last />
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
          <button style={{
            background: TZ.err, color: '#fff', border: 0, borderRadius: 999,
            padding: '8px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          }}>Llamar</button>
        </div>
      </Card>

      <SectionTitle>Notas del entrenador</SectionTitle>
      <Card>
        {editing ? (
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
            placeholder="Añade una nota sobre el estado del jugador…"
            style={{
              width: '100%', border: '1px solid ' + TZ.line, borderRadius: 10, padding: 10,
              fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', color: TZ.ink,
            }} />
        ) : (
          <div style={{ fontSize: 13, color: notes ? TZ.inkSoft : TZ.muted, lineHeight: 1.5, fontStyle: notes ? 'normal' : 'italic' }}>
            {notes || 'Sin notas por el momento. Toca Editar para agregar.'}
          </div>
        )}
      </Card>
    </>
  );
}

function CoachHistoryTab({ p }) {
  return (
    <>
      <SectionTitle>Últimos entrenamientos</SectionTitle>
      <Card padded={false}>
        {['Vie 20','Mié 18','Lun 16','Vie 13','Mié 11'].map((d, i) => {
          const r = ['P','P','J','P','A'][i];
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
  );
}

// ── COACH CALL / CHAT (placeholders) ──────────────────────────
function CoachCall({ category }) {
  const roster = window.TZ_DATA.PLAYERS.filter(p => p.category === category);
  const [selected, setSelected] = React.useState(new Set(roster.slice(0, 14).map(p => p.id)));
  const toggle = id => {
    setSelected(s => {
      const c = new Set(s);
      if (c.has(id)) c.delete(id); else c.add(id);
      return c;
    });
  };
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Convocatoria" subtitle={`vs Tigres Jr. · Sáb 26`} />
      <div style={{ padding: '0 16px' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1, textTransform: 'uppercase' }}>Seleccionados</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TZ.ink, letterSpacing: -0.5, marginTop: 2 }}>
                {selected.size} <span style={{ fontSize: 14, color: TZ.muted, fontWeight: 600 }}>/ {roster.length}</span>
              </div>
            </div>
            <button style={{
              padding: '10px 16px', border: 0, borderRadius: 999,
              background: TZ.primary, color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
            }}>Enviar convocatoria</button>
          </div>
        </Card>

        <SectionTitle>Plantilla · {category}</SectionTitle>
        <Card padded={false}>
          {roster.map((p, i) => {
            const on = selected.has(p.id);
            const disabled = p.medical.status === 'lesionado';
            return (
              <div key={p.id} onClick={() => !disabled && toggle(p.id)} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px',
                borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
                background: on ? 'rgba(29,61,138,0.04)' : 'transparent',
              }}>
                <Avatar player={p} size={38} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>#{p.number} · {p.position}</div>
                </div>
                {disabled && <Chip tone="err">Lesionado</Chip>}
                <div style={{
                  width: 24, height: 24, borderRadius: 6,
                  border: on ? 0 : '1.5px solid #CBD1DC',
                  background: on ? TZ.primary : '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {on && <Icon name="check" size={16} color="#fff" strokeWidth={3} />}
                </div>
              </div>
            );
          })}
        </Card>
      </div>
    </div>
  );
}

function CoachChat({ category }) {
  const roster = window.TZ_DATA.PLAYERS.filter(p => p.category === category && p.tutor).slice(0, 10);
  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Chat con padres" subtitle={`${category}`} />
      <div style={{ padding: '0 16px' }}>
        <Card padded={false}>
          {roster.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line, cursor: 'pointer',
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: `linear-gradient(135deg, hsl(${(p.id * 71) % 360} 55% 55%), hsl(${((p.id * 71) + 40) % 360} 60% 40%))`,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 14, flexShrink: 0,
              }}>{p.tutor.name.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{p.tutor.name}</span>
                  <span style={{ fontSize: 10, color: TZ.muted, fontWeight: 600 }}>{['10:22','09:15','ayer','ayer','2d','2d','3d','1sem','1sem','2sem'][i]}</span>
                </div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{p.tutor.relation} de {p.first}</div>
                <div style={{ fontSize: 12, color: TZ.inkSoft, marginTop: 4,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {['¿A qué hora es el partido del sábado?','Gracias coach 🙏','Confirmado, ahí estaremos.','Va a faltar mañana, no se siente bien.','Ok!','Perfecto, gracias.','Sin problema.','👍','Enterada.','Todo bien.'][i]}
                </div>
              </div>
              {i < 2 && <span style={{ width: 8, height: 8, borderRadius: '50%', background: TZ.primary, flexShrink: 0 }} />}
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── COACH TAB BAR ─────────────────────────────────────────────
function CoachTabBar({ tab, onChange }) {
  const items = [
    { id: 'home',    label: 'Inicio',    icon: 'home' },
    { id: 'roster',  label: 'Plantilla', icon: 'users' },
    { id: 'attend',  label: 'Asist.',    icon: 'check' },
    { id: 'tactics', label: 'Pizarra',   icon: 'board' },
    { id: 'chat',    label: 'Chat',      icon: 'mail' },
    { id: 'profile', label: 'Perfil',    icon: 'user' },
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

// Local styles reused
const iconBtnDark = {
  width: 40, height: 40, borderRadius: '50%', border: 0,
  background: 'rgba(255,255,255,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

function MiniKpi({ label, value, sub, tone }) {
  const toneColor = tone === 'ok' ? '#86EFAC' : tone === 'warn' ? '#FCD34D' : '#fff';
  return (
    <div style={{
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      borderRadius: 12, padding: '10px 12px',
      border: '1px solid rgba(255,255,255,0.15)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.8, color: '#fff' }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 2, color: toneColor }}>{value}</div>
      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1, color: '#fff' }}>{sub}</div>
    </div>
  );
}

function QuickAction({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14,
      padding: '12px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 6,
      boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: TZ.ink }}>{label}</span>
    </button>
  );
}

Object.assign(window, { CoachHome, CoachRoster, CoachPlayerProfile, CoachCall, CoachChat, CoachTabBar });
