// TuzosJrz — Admin: pending payments inbox (approve / reject manual receipts)

function getPendingPayments() {
  try {
    const list = JSON.parse(localStorage.getItem('tz.payments.pending') || '[]');
    // Seed a few if empty
    if (list.length === 0) return seedPending();
    return list;
  } catch { return []; }
}
function savePendingPayments(list) {
  try { localStorage.setItem('tz.payments.pending', JSON.stringify(list)); } catch {}
}
function seedPending() {
  const players = window.TZ_DATA.PLAYERS.filter(p => p.tutor).slice(0, 4);
  const seed = players.map((p, i) => ({
    id: 'pend-' + p.id,
    parentKey: 'parent-' + p.tutor.name.toLowerCase().replace(/\s+/g, '-'),
    parentName: p.tutor.name,
    parentRelation: p.tutor.relation,
    childName: p.name,
    childCategory: p.category,
    concept: 'Cuota Septiembre',
    amount: 850,
    method: ['transfer','cash','transfer','transfer'][i],
    status: 'review',
    date: ['Hoy 10:22','Hoy 09:15','Ayer 18:40','Ayer 14:12'][i],
    operationId: ['8829173','','7710244','8836022'][i],
    transferDate: ['2026-09-21','','2026-09-20','2026-09-20'][i],
    receiptImg: i !== 1, // cash doesn't have receipt
  }));
  savePendingPayments(seed);
  return seed;
}

function AdminPaymentInbox({ back }) {
  const [tick, setTick] = React.useState(0);
  const [selected, setSelected] = React.useState(null);
  const [filter, setFilter] = React.useState('pending');

  const all = getPendingPayments();
  const list = filter === 'pending' ? all : all.filter(p => p._decided === filter);

  const handleApprove = (id) => {
    const all = getPendingPayments();
    const idx = all.findIndex(p => p.id === id);
    if (idx < 0) return;
    all[idx]._decided = 'approved';
    all[idx].status = 'paid';
    savePendingPayments(all);
    setSelected(null); setTick(t => t + 1);
    window.dispatchEvent(new CustomEvent('tz-payments-change'));
  };
  const handleReject = (id, reason) => {
    const all = getPendingPayments();
    const idx = all.findIndex(p => p.id === id);
    if (idx < 0) return;
    all[idx]._decided = 'rejected';
    all[idx].status = 'rejected';
    all[idx].rejectReason = reason;
    savePendingPayments(all);
    setSelected(null); setTick(t => t + 1);
    window.dispatchEvent(new CustomEvent('tz-payments-change'));
  };

  const pending = all.filter(p => !p._decided);
  const approved = all.filter(p => p._decided === 'approved');
  const rejected = all.filter(p => p._decided === 'rejected');

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{ padding: '54px 20px 18px',
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden' }}>
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
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>ADMINISTRACIÓN</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4 }}>Aprobar pagos</div>
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
              {pending.length} comprobante{pending.length !== 1 ? 's' : ''} en revisión
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 14, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'pending',  label: `Pendientes (${pending.length})` },
            { id: 'approved', label: `Aprobados (${approved.length})` },
            { id: 'rejected', label: `Rechazados (${rejected.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setFilter(t.id)} style={{
              flex: 1, padding: '8px 4px', border: 0, borderRadius: 9,
              background: filter === t.id ? '#fff' : 'transparent',
              color: filter === t.id ? TZ.ink : TZ.inkSoft,
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              boxShadow: filter === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* List */}
        <div style={{ marginTop: 14 }}>
          {(filter === 'pending' ? pending : filter === 'approved' ? approved : rejected).map(p => (
            <PendingCard key={p.id} p={p} onOpen={() => setSelected(p)} />
          ))}
          {(filter === 'pending' ? pending : filter === 'approved' ? approved : rejected).length === 0 && (
            <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
              padding: 40, textAlign: 'center', color: TZ.muted, fontSize: 13 }}>
              {filter === 'pending' ? '✅ No hay comprobantes por revisar' : 'Sin registros'}
            </div>
          )}
        </div>
      </div>

      {selected && <PendingSheet p={selected} onClose={() => setSelected(null)}
        onApprove={() => handleApprove(selected.id)}
        onReject={(reason) => handleReject(selected.id, reason)} />}
    </div>
  );
}

function PendingCard({ p, onOpen }) {
  const meta = window.METHOD_META[p.method];
  return (
    <div onClick={onOpen} style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 14,
      marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: meta.color + '18',
        color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>{meta.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TZ.ink,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.parentName}</span>
          <span style={{ fontSize: 14, fontWeight: 800, color: TZ.ink }}>${p.amount.toLocaleString('es-MX')}</span>
        </div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
          {p.parentRelation} de {p.childName} · {p.childCategory}
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 6, alignItems: 'center' }}>
          <Chip tone="neutral" size="sm">{meta.label}</Chip>
          <span style={{ fontSize: 11, color: TZ.muted }}>{p.date}</span>
          {p.receiptImg && <span style={{ fontSize: 11, color: TZ.primary, fontWeight: 700 }}>📎 Comprobante</span>}
          {p._decided === 'approved' && <span style={{ marginLeft: 'auto' }}><Chip tone="ok" size="sm">Aprobado</Chip></span>}
          {p._decided === 'rejected' && <span style={{ marginLeft: 'auto' }}><Chip tone="err" size="sm">Rechazado</Chip></span>}
        </div>
      </div>
      {!p._decided && <Icon name="chevron" size={16} color={TZ.muted} />}
    </div>
  );
}

function PendingSheet({ p, onClose, onApprove, onReject }) {
  const meta = window.METHOD_META[p.method];
  const [rejecting, setRejecting] = React.useState(false);
  const [reason, setReason] = React.useState('');

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.6)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 0 0', maxHeight: '92%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        {/* Header */}
        <div style={{ padding: '0 20px 16px', borderBottom: '1px solid ' + TZ.line }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12, background: meta.color + '18',
              color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, flexShrink: 0,
            }}>{meta.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 700, letterSpacing: 0.5 }}>{meta.label.toUpperCase()}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: TZ.ink, letterSpacing: -0.3 }}>
                ${p.amount.toLocaleString('es-MX')} MXN
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="close" size={16} color={TZ.inkSoft} />
            </button>
          </div>
        </div>

        {/* Scroll content */}
        <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
          {/* Parent */}
          <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            Padre / tutor
          </div>
          <div style={{ background: '#F4F5F8', borderRadius: 12, padding: 12, display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: '50%',
              background: `linear-gradient(135deg, hsl(${p.parentName.charCodeAt(0) * 3 % 360} 55% 55%), hsl(${p.parentName.charCodeAt(0) * 3 % 360 + 40} 60% 40%))`,
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 14,
            }}>{p.parentName.split(' ').map(x => x[0]).slice(0, 2).join('')}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{p.parentName}</div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
                {p.parentRelation} de {p.childName} · {p.childCategory}
              </div>
            </div>
          </div>

          {/* Payment details */}
          <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            Detalles
          </div>
          <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: 4 }}>
            <DetailRow label="Concepto" value={p.concept} />
            <DetailRow label="Enviado" value={p.date} />
            {p.operationId && <DetailRow label="No. operación" value={p.operationId} mono />}
            {p.transferDate && <DetailRow label="Fecha transferencia" value={p.transferDate} />}
            <DetailRow label="Método" value={meta.label} last />
          </div>

          {/* Receipt */}
          {p.receiptImg && (
            <>
              <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginTop: 18, marginBottom: 8 }}>
                Comprobante
              </div>
              <div style={{
                background: '#F4F5F8', border: '1px solid ' + TZ.line, borderRadius: 12,
                padding: 8, textAlign: 'center',
              }}>
                {/* Mock receipt visual */}
                <div style={{
                  background: '#fff', borderRadius: 8, padding: '18px 14px', textAlign: 'left',
                  border: '1px dashed #CBD1DC', minHeight: 220, position: 'relative',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 12, borderBottom: '2px solid #003DA5' }}>
                    <div>
                      <div style={{ fontFamily: 'Georgia,serif', fontWeight: 800, fontSize: 20, color: '#003DA5' }}>BBVA</div>
                      <div style={{ fontSize: 10, color: '#666', marginTop: 2 }}>Comprobante de operación</div>
                    </div>
                    <Chip tone="ok" size="sm">EXITOSA</Chip>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 11, color: '#333' }}>
                    <div style={{ marginBottom: 6 }}><strong>Fecha:</strong> {p.transferDate || '21/09/2026'} · 10:22 hrs</div>
                    <div style={{ marginBottom: 6 }}><strong>Referencia:</strong> {p.operationId || 'N/A'}</div>
                    <div style={{ marginBottom: 6 }}><strong>Concepto:</strong> {p.concept}</div>
                    <div style={{ margin: '12px 0', padding: '10px 12px', background: '#F4F5F8', borderRadius: 6, textAlign: 'center' }}>
                      <div style={{ fontSize: 10, color: '#666' }}>MONTO TRANSFERIDO</div>
                      <div style={{ fontSize: 22, fontWeight: 800, color: '#003DA5', marginTop: 2 }}>
                        ${p.amount.toLocaleString('es-MX')}.00 MXN
                      </div>
                    </div>
                    <div style={{ fontSize: 10, color: '#666', marginTop: 6, borderTop: '1px dashed #ccc', paddingTop: 6 }}>
                      Cuenta destino: •••• 4529 · Club TuzosJrz A.C.
                    </div>
                  </div>
                </div>
                <button style={{
                  marginTop: 10, padding: '8px 14px', borderRadius: 999, border: '1px solid ' + TZ.line,
                  background: '#fff', color: TZ.primary, fontSize: 12, fontWeight: 700, cursor: 'pointer',
                }}>Ver original</button>
              </div>
            </>
          )}

          {/* Amount match warning */}
          <div style={{ marginTop: 14, padding: 12, background: '#F0FDF4', border: '1px solid #BBF7D0',
            borderRadius: 10, fontSize: 12, color: '#166534', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span>✓</span>
            <span>El monto del comprobante coincide con la cuota esperada de <strong>$850 MXN</strong>.</span>
          </div>

          {/* Reject reason input */}
          {rejecting && (
            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: TZ.err, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>
                Motivo del rechazo
              </div>
              <textarea autoFocus value={reason} onChange={e => setReason(e.target.value)} rows={3}
                placeholder="Ej. El monto no coincide, referencia inválida…"
                style={{ width: '100%', border: '1px solid ' + TZ.line, borderRadius: 10, padding: 10,
                  fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', color: TZ.ink }} />
            </div>
          )}
        </div>

        {/* Actions */}
        {!p._decided && (
          <div style={{ padding: '14px 20px 34px', borderTop: '1px solid ' + TZ.line, background: '#fff' }}>
            {rejecting ? (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setRejecting(false)} style={{
                  flex: 1, padding: '14px', borderRadius: 12,
                  background: '#EEF0F4', color: TZ.ink, border: 0,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Cancelar</button>
                <button onClick={() => onReject(reason)} style={{
                  flex: 2, padding: '14px', borderRadius: 12,
                  background: TZ.err, color: '#fff', border: 0,
                  fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.35)',
                }}>Confirmar rechazo</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setRejecting(true)} style={{
                  flex: 1, padding: '14px', borderRadius: 12,
                  background: '#fff', color: TZ.err, border: '1.5px solid ' + TZ.err,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                }}>Rechazar</button>
                <button onClick={onApprove} style={{
                  flex: 2, padding: '14px', borderRadius: 12,
                  background: TZ.ok, color: '#fff', border: 0,
                  fontSize: 14, fontWeight: 800, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(22,163,74,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                }}>
                  <Icon name="check" size={16} color="#fff" strokeWidth={2.5} />
                  Aprobar pago
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value, mono, last }) {
  return (
    <div style={{ padding: '10px 12px', display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', gap: 10, borderBottom: last ? 0 : '1px solid ' + TZ.line }}>
      <span style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: TZ.ink, fontWeight: 500,
        fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
    </div>
  );
}

Object.assign(window, { AdminPaymentInbox, getPendingPayments });
