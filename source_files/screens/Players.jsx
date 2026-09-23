// TuzosJrz — Players list + Profile with medical

function Players({ nav, openPlayer }) {
  const { PLAYERS, CATEGORIES } = window.TZ_DATA;
  const [category, setCategory] = React.useState('Todos');
  const [query, setQuery] = React.useState('');

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
        right={<button style={pillBtn}><Icon name="plus" size={18} color="#fff" /></button>}
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
    </div>
  );
}

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
