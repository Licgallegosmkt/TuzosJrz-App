// TuzosJrz — Payments

function Payments({ nav, openPlayer }) {
  const { PLAYERS, paymentsSummary, CATEGORIES } = window.TZ_DATA;
  const [filter, setFilter] = React.useState('todos');
  const [category, setCategory] = React.useState('Todos');
  const [modal, setModal] = React.useState(null); // playerId being charged
  const s = paymentsSummary();
  const pct = Math.round(s.cobrado / (s.total * 850) * 100);

  const filtered = PLAYERS.filter(p => {
    if (category !== 'Todos' && p.category !== category) return false;
    if (filter === 'atrasado' && p.paymentStatus !== 'atrasado') return false;
    if (filter === 'pendiente' && p.paymentStatus !== 'pendiente') return false;
    if (filter === 'aldia' && p.paymentStatus !== 'al-dia') return false;
    return true;
  });

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Pagos"
        subtitle="Septiembre 2026"
        right={<button style={fabBtn}><Icon name="plus" size={18} color="#fff" /></button>}
      />

      <div style={{ padding: '0 16px' }}>
        {/* Big summary card */}
        <Card style={{ background: `linear-gradient(150deg, ${TZ.primary}, ${TZ.primaryDark})`, color: '#fff', border: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1.2, opacity: 0.75, fontWeight: 700 }}>COBRADO</div>
              <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.8, marginTop: 4 }}>
                ${s.cobrado.toLocaleString('es-MX')}
                <span style={{ fontSize: 14, opacity: 0.7, marginLeft: 6, fontWeight: 600 }}>MXN</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', paddingBottom: 4 }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#F5B301' }}>{pct}%</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>de la meta</div>
            </div>
          </div>
          <div style={{ height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.2)', marginTop: 14, overflow: 'hidden' }}>
            <div style={{ width: `${pct}%`, height: '100%', background: '#F5B301' }} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 14 }}>
            <SumChip label="Por cobrar" value={`$${(s.porCobrar/1000).toFixed(1)}k`} />
            <SumChip label="Al día" value={s.alDia} />
            <SumChip label="Atrasados" value={s.atrasado} highlight />
          </div>
        </Card>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 16, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'todos', label: `Todos (${s.total})` },
            { id: 'atrasado', label: `Atrasados (${s.atrasado})` },
            { id: 'pendiente', label: `Pendientes (${s.pendiente})` },
            { id: 'aldia', label: `Al día (${s.alDia})` },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              flex: 1, padding: '8px 4px', border: 0, borderRadius: 9,
              background: filter === t.id ? '#fff' : 'transparent',
              color: filter === t.id ? TZ.ink : TZ.inkSoft,
              fontSize: 11, fontWeight: 600, cursor: 'pointer',
              boxShadow: filter === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        <CategoryChipRow value={category} onChange={setCategory} categories={CATEGORIES} />

        {/* List */}
        <Card padded={false}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line }}>
              <Avatar player={p} size={40} showNumber={false} />
              <div style={{ flex: 1, minWidth: 0, cursor: 'pointer' }} onClick={() => openPlayer(p.id)}>
                <div style={{ fontSize: 14, fontWeight: 600, color: TZ.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
                  {p.category} · Cuota ${p.monthlyFee}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                {p.paymentStatus === 'al-dia' && <Chip tone="ok">Al día</Chip>}
                {p.paymentStatus === 'pendiente' && (
                  <>
                    <Chip tone="warn">Pendiente</Chip>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TZ.warn, marginTop: 4 }}>
                      ${Math.abs(p.balance)}
                    </div>
                  </>
                )}
                {p.paymentStatus === 'atrasado' && (
                  <>
                    <Chip tone="err">Atrasado</Chip>
                    <div style={{ fontSize: 12, fontWeight: 700, color: TZ.err, marginTop: 4 }}>
                      ${Math.abs(p.balance)}
                    </div>
                  </>
                )}
              </div>
              {p.paymentStatus !== 'al-dia' ? (
                <button onClick={() => setModal(p.id)} style={cobrarBtn}>Cobrar</button>
              ) : (
                <button style={recBtn}>
                  <Icon name="receipt" size={16} color={TZ.muted} />
                </button>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: TZ.muted, fontSize: 13 }}>
              Sin resultados con este filtro
            </div>
          )}
        </Card>
      </div>

      {/* Charge modal */}
      {modal && <ChargeModal playerId={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

function ChargeModal({ playerId, onClose }) {
  const p = window.TZ_DATA.PLAYERS.find(x => x.id === playerId);
  const [method, setMethod] = React.useState('efectivo');
  const [concept, setConcept] = React.useState('cuota');
  const amount = concept === 'cuota' ? Math.abs(p.balance) || 850 : 500;

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 44px', maxHeight: '85%', overflow: 'auto',
      }}>
        {/* handle */}
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar player={p} size={48} showNumber={false} />
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: TZ.ink }}>{p.name}</div>
            <div style={{ fontSize: 12, color: TZ.muted }}>{p.category} · #{p.number}</div>
          </div>
        </div>

        <div style={{ margin: '20px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Concepto</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'cuota', label: 'Cuota mensual', sub: 'Septiembre' },
            { id: 'extra', label: 'Pago extra', sub: 'Uniforme, torneo…' },
          ].map(c => (
            <button key={c.id} onClick={() => setConcept(c.id)} style={{
              padding: '12px', borderRadius: 12,
              border: concept === c.id ? `2px solid ${TZ.primary}` : '2px solid ' + TZ.line,
              background: concept === c.id ? 'rgba(29,61,138,0.05)' : '#fff',
              textAlign: 'left', cursor: 'pointer',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{c.label}</div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{c.sub}</div>
            </button>
          ))}
        </div>

        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Monto</div>
        <div style={{
          background: '#F4F5F8', borderRadius: 14, padding: '18px 16px',
          display: 'flex', alignItems: 'baseline', gap: 4,
        }}>
          <span style={{ fontSize: 24, fontWeight: 700, color: TZ.muted }}>$</span>
          <span style={{ fontSize: 40, fontWeight: 800, color: TZ.ink, letterSpacing: -1 }}>{amount.toLocaleString('es-MX')}</span>
          <span style={{ fontSize: 14, color: TZ.muted, fontWeight: 600, marginLeft: 4 }}>MXN</span>
        </div>

        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>Método de pago</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            { id: 'efectivo', label: 'Efectivo' },
            { id: 'transfer', label: 'Transferencia' },
          ].map(m => (
            <button key={m.id} onClick={() => setMethod(m.id)} style={{
              padding: '12px', borderRadius: 12,
              border: method === m.id ? `2px solid ${TZ.primary}` : '2px solid ' + TZ.line,
              background: method === m.id ? 'rgba(29,61,138,0.05)' : '#fff',
              fontSize: 13, fontWeight: 700, color: TZ.ink, cursor: 'pointer',
            }}>{m.label}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Cancelar</button>
          <button onClick={onClose} style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: TZ.primary, color: '#fff', border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
          }}>Registrar y enviar recibo</button>
        </div>
      </div>
    </div>
  );
}

function SumChip({ label, value, highlight }) {
  return (
    <div style={{
      flex: 1, background: highlight ? 'rgba(245,179,1,0.2)' : 'rgba(255,255,255,0.12)',
      borderRadius: 10, padding: '8px 10px',
      border: highlight ? '1px solid rgba(245,179,1,0.4)' : '1px solid rgba(255,255,255,0.15)',
    }}>
      <div style={{ fontSize: 9, opacity: 0.8, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: 15, fontWeight: 800, marginTop: 2, color: highlight ? '#F5B301' : '#fff' }}>{value}</div>
    </div>
  );
}

const fabBtn = {
  width: 40, height: 40, borderRadius: '50%',
  background: TZ.primary, border: 0, color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  boxShadow: '0 2px 6px rgba(29,61,138,0.35)',
};
const cobrarBtn = {
  background: TZ.primary, color: '#fff', border: 0, borderRadius: 999,
  padding: '7px 14px', fontSize: 12, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 2px 4px rgba(29,61,138,0.25)',
};
const recBtn = {
  background: '#EEF0F4', border: 0, borderRadius: 8,
  width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

Object.assign(window, { Payments });
