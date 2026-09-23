// TuzosJrz — Payment flow (parent) — hybrid: card, SPEI, wallet, cash, transfer with receipt

// Payment status types
// 'paid' | 'processing' | 'review' | 'rejected' | 'pending' | 'overdue'

// ── Persistence helpers ─────────────────────────────────────
function getPaymentHistory(parentKey) {
  try { return JSON.parse(localStorage.getItem(`tz.payments.${parentKey}`) || '[]'); }
  catch { return []; }
}
function savePaymentHistory(parentKey, list) {
  try { localStorage.setItem(`tz.payments.${parentKey}`, JSON.stringify(list)); } catch {}
}
function addPayment(parentKey, entry) {
  const list = getPaymentHistory(parentKey);
  list.unshift(entry);
  savePaymentHistory(parentKey, list);
  // Also add to global pending inbox for admin approval
  if (entry.status === 'review') {
    const pending = JSON.parse(localStorage.getItem('tz.payments.pending') || '[]');
    pending.unshift({ ...entry, parentKey });
    localStorage.setItem('tz.payments.pending', JSON.stringify(pending));
  }
  window.dispatchEvent(new CustomEvent('tz-payments-change'));
}

function seedPaymentsIfEmpty(parentKey) {
  const list = getPaymentHistory(parentKey);
  if (list.length > 0) return;
  const seed = [
    { id: 'pay-1', concept: 'Cuota Agosto',      amount: 850, method: 'card',   status: 'paid',      date: '3 Ago 2026',  ref: 'CLIP-8829173', last4: '4242' },
    { id: 'pay-2', concept: 'Cuota Julio',       amount: 850, method: 'spei',   status: 'paid',      date: '2 Jul 2026',  ref: 'SPEI-77102' },
    { id: 'pay-3', concept: 'Inscripción 26/27', amount: 2500,method: 'transfer',status:'paid',      date: '15 Ago 2026', ref: 'BBVA-99120', receiptImg: true },
    { id: 'pay-4', concept: 'Cuota Junio',       amount: 850, method: 'cash',   status: 'paid',      date: '5 Jun 2026',  approvedBy: 'Admin' },
  ];
  savePaymentHistory(parentKey, seed);
}

// ── Method labels/icons ─────────────────────────────────────
const METHOD_META = {
  card:     { label: 'Tarjeta',              icon: '💳', color: '#1D3D8A' },
  spei:     { label: 'SPEI',                 icon: '🏧', color: '#0F766E' },
  wallet:   { label: 'Wallet',               icon: '📱', color: '#0F172A' },
  whatsapp: { label: 'Link WhatsApp',        icon: '🔗', color: '#25D366' },
  transfer: { label: 'Transferencia (manual)',icon: '📤', color: '#B45309' },
  cash:     { label: 'Efectivo',             icon: '💵', color: '#0F766E' },
};

const STATUS_META = {
  paid:       { label: 'Pagado',      tone: 'ok'   },
  processing: { label: 'Procesando',  tone: 'warn' },
  review:     { label: 'En revisión', tone: 'warn' },
  rejected:   { label: 'Rechazado',   tone: 'err'  },
  pending:    { label: 'Pendiente',   tone: 'warn' },
  overdue:    { label: 'Vencido',     tone: 'err'  },
};

// ── MAIN FLOW ────────────────────────────────────────────────
function PayFlow({ back, parentKey = 'parent-carlos', childName = 'Diego Hernández', concept = 'Cuota Septiembre', amount = 850, onDone }) {
  const [screen, setScreen] = React.useState('select');   // select | card | spei | wallet | transfer | cash | whatsapp | success
  const [result, setResult] = React.useState(null);

  React.useEffect(() => { seedPaymentsIfEmpty(parentKey); }, [parentKey]);

  const finish = (entry) => {
    addPayment(parentKey, { ...entry, id: 'pay-' + Date.now(), concept, amount });
    setResult(entry);
    setScreen('success');
  };

  const commonProps = { back: () => setScreen('select'), amount, concept, childName, onDone: finish };

  return (
    <div style={{ minHeight: '100%', background: '#F4F5F8', paddingBottom: 100 }}>
      {screen === 'select' && <PayMethodSelector back={back} amount={amount} concept={concept} childName={childName}
        onPick={(m) => setScreen(m)} />}
      {screen === 'card'     && <PayCard {...commonProps} />}
      {screen === 'spei'     && <PaySPEI {...commonProps} />}
      {screen === 'wallet'   && <PayWallet {...commonProps} />}
      {screen === 'transfer' && <PayTransfer {...commonProps} />}
      {screen === 'cash'     && <PayCash {...commonProps} />}
      {screen === 'whatsapp' && <PayWhatsApp {...commonProps} />}
      {screen === 'success'  && <PaySuccess result={result} onDone={() => { onDone && onDone(); back && back(); }} />}
    </div>
  );
}

// ── Method selector ─────────────────────────────────────────
function PayMethodSelector({ back, amount, concept, childName, onPick }) {
  const [recurring, setRecurring] = React.useState(false);

  const autoMethods = [
    { id: 'card',     icon: '💳', label: 'Tarjeta',            desc: 'Crédito o débito · aplica al instante', badge: 'MÁS USADO', color: '#1D3D8A' },
    { id: 'wallet',   icon: '📱', label: 'Apple Pay / Google Pay', desc: 'Un tap con Face ID',                   color: '#0F172A' },
    { id: 'spei',     icon: '🏧', label: 'SPEI',                desc: 'Transferencia bancaria · 2-4 h',        color: '#0F766E' },
  ];
  const manualMethods = [
    { id: 'transfer', icon: '📤', label: 'Transferencia bancaria', desc: 'Sube comprobante · admin aprueba',  color: '#B45309' },
    { id: 'cash',     icon: '💵', label: 'Efectivo',              desc: 'Pagas en persona · admin confirma',  color: '#0F766E' },
  ];

  return (
    <>
      {/* Hero */}
      <div style={{
        padding: '54px 20px 24px',
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={back} style={{
            width: 36, height: 36, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={18} color="#fff" />
          </button>
          <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>PAGAR CUOTA</div>
        </div>
        <div style={{ position: 'relative', marginTop: 18 }}>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{concept} · {childName}</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 20, opacity: 0.7, fontWeight: 600 }}>$</span>
            <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: -1.2, lineHeight: 1 }}>
              {amount.toLocaleString('es-MX')}
            </span>
            <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>MXN</span>
          </div>
          <div style={{
            marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '4px 10px', borderRadius: 999, background: 'rgba(245,179,1,0.2)',
            border: '1px solid rgba(245,179,1,0.4)',
            fontSize: 10, fontWeight: 800, color: '#F5B301', letterSpacing: 0.6,
          }}>
            ✓ EL CLUB ABSORBE COMISIONES · PAGAS EXACTO
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Automatic methods */}
        <SectionTitle>💳 Pago instantáneo</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {autoMethods.map(m => (
            <MethodCard key={m.id} {...m} onClick={() => onPick(m.id)} />
          ))}
        </div>

        {/* WhatsApp option */}
        <SectionTitle>🔗 Compartir link</SectionTitle>
        <MethodCard
          id="whatsapp" icon="🔗" label="Enviar link de pago"
          desc="Manda el enlace por WhatsApp · abren y pagan"
          color="#25D366"
          onClick={() => onPick('whatsapp')}
        />

        {/* Manual methods */}
        <SectionTitle>📤 Pago manual</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {manualMethods.map(m => (
            <MethodCard key={m.id} {...m} onClick={() => onPick(m.id)} />
          ))}
        </div>
        <div style={{ marginTop: 8, padding: '10px 12px', background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: 8, fontSize: 11, color: '#78350F', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          <span>ℹ️</span>
          <span>Los pagos manuales quedan <strong>en revisión</strong> hasta que el administrador los confirme (usualmente en menos de 4 h).</span>
        </div>

        {/* Recurring toggle */}
        <SectionTitle>Cobro automático</SectionTitle>
        <div style={{
          background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 14,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: recurring ? TZ.primary : '#EEF0F4',
            color: recurring ? '#fff' : TZ.inkSoft,
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18,
          }}>🔁</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>Cobrar cuota cada mes</div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
              {recurring
                ? 'Te cobraremos $850 automáticamente el día 1 de cada mes'
                : 'Se cobra el mismo día que hoy · puedes pausar cuando quieras'}
            </div>
          </div>
          <Toggle on={recurring} onChange={setRecurring} />
        </div>
      </div>
    </>
  );
}

function MethodCard({ icon, label, desc, color, badge, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14,
      padding: 14, cursor: 'pointer', textAlign: 'left',
      display: 'flex', alignItems: 'center', gap: 14, position: 'relative',
      boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
    }}>
      <div style={{
        width: 48, height: 48, borderRadius: 12, background: color + '18',
        color: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 22, flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{label}</span>
          {badge && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
              padding: '2px 6px', borderRadius: 4,
              background: '#F5B301', color: '#78350F',
            }}>{badge}</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>{desc}</div>
      </div>
      <Icon name="chevron" size={18} color={TZ.muted} />
    </button>
  );
}

// ── Shared step header ──────────────────────────────────────
function PayStepHeader({ back, title, subtitle }) {
  return (
    <div style={{
      padding: '54px 20px 16px',
      background: '#fff', borderBottom: '1px solid ' + TZ.line,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <button onClick={back} style={{
        background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: TZ.primary,
      }}>
        <Icon name="chevronL" size={22} color={TZ.primary} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: TZ.ink }}>{title}</div>
        {subtitle && <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{subtitle}</div>}
      </div>
    </div>
  );
}

// Amount recap card (fixed at top of most flows)
function AmountRecap({ concept, childName, amount }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 14,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: 'rgba(29,61,138,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.primary, fontSize: 20,
      }}>💰</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{concept}</div>
        <div style={{ fontSize: 13, color: TZ.ink, fontWeight: 700, marginTop: 2 }}>{childName}</div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.5 }}>TOTAL</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, letterSpacing: -0.5 }}>
          ${amount.toLocaleString('es-MX')}
        </div>
      </div>
    </div>
  );
}

// ── FLOW: TARJETA ────────────────────────────────────────────
function PayCard({ back, amount, concept, childName, onDone }) {
  const [number, setNumber] = React.useState('');
  const [exp, setExp]       = React.useState('');
  const [cvv, setCvv]       = React.useState('');
  const [name, setName]     = React.useState('');
  const [saveCard, setSaveCard] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const cardBrand = detectBrand(number);
  const canPay = number.replace(/\s/g, '').length >= 15 && exp.length >= 4 && cvv.length >= 3 && name.length > 3;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onDone({
        method: 'card', status: 'paid',
        last4: number.replace(/\s/g, '').slice(-4),
        brand: cardBrand, date: 'Hoy',
        ref: 'CLIP-' + Math.floor(Math.random() * 90000000 + 10000000),
      });
    }, 1600);
  };

  return (
    <>
      <PayStepHeader back={back} title="Pagar con tarjeta" subtitle="🔒 Cifrado extremo a extremo" />
      <div style={{ padding: '16px' }}>
        <AmountRecap concept={concept} childName={childName} amount={amount} />

        {/* Card visual */}
        <div style={{
          marginTop: 18, padding: 18, borderRadius: 16,
          background: `linear-gradient(135deg, ${TZ.primaryDark}, ${TZ.primary} 60%, #2563EB)`,
          color: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 10px 24px rgba(29,61,138,0.35)',
          minHeight: 160,
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(245,179,1,0.35), transparent 70%)' }} />
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: 1, color: '#F5B301' }}>
              TUZOSJRZ
            </div>
            <CardBrandLogo brand={cardBrand} />
          </div>
          <div style={{ position: 'relative', marginTop: 34, fontFamily: 'monospace',
            fontSize: 20, letterSpacing: 3, fontWeight: 600 }}>
            {(number || '•••• •••• •••• ••••').padEnd(19, '•').slice(0, 19)}
          </div>
          <div style={{ position: 'relative', marginTop: 14, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 8, opacity: 0.7, fontWeight: 700, letterSpacing: 0.6 }}>TITULAR</div>
              <div style={{ fontSize: 12, marginTop: 2, textTransform: 'uppercase' }}>{name || 'NOMBRE APELLIDO'}</div>
            </div>
            <div>
              <div style={{ fontSize: 8, opacity: 0.7, fontWeight: 700, letterSpacing: 0.6 }}>VENCE</div>
              <div style={{ fontSize: 12, marginTop: 2, fontFamily: 'monospace' }}>{exp || 'MM/AA'}</div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PayInput label="Número de tarjeta" value={formatCardNumber(number)}
            onChange={v => setNumber(v.replace(/\D/g, '').slice(0, 16))}
            placeholder="1234 5678 9012 3456" type="tel" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <PayInput label="Vencimiento" value={exp}
              onChange={v => {
                let d = v.replace(/\D/g, '').slice(0, 4);
                if (d.length >= 3) d = d.slice(0, 2) + '/' + d.slice(2);
                setExp(d);
              }} placeholder="MM/AA" type="tel" />
            <PayInput label="CVV" value={cvv}
              onChange={v => setCvv(v.replace(/\D/g, '').slice(0, 4))}
              placeholder="•••" type="password" />
          </div>
          <PayInput label="Nombre en la tarjeta" value={name} onChange={setName} placeholder="Como aparece en la tarjeta" />
        </div>

        {/* Save card toggle */}
        <div style={{ marginTop: 12, padding: '12px 14px', background: '#fff',
          border: '1px solid ' + TZ.line, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink }}>Guardar tarjeta</div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>Para futuros pagos con Face ID</div>
          </div>
          <Toggle on={saveCard} onChange={setSaveCard} />
        </div>

        {/* Security badges */}
        <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center',
          fontSize: 10, color: TZ.muted, fontWeight: 600 }}>
          <span>🔒 PCI-DSS</span>
          <span>·</span>
          <span>Clip</span>
          <span>·</span>
          <span>3D Secure</span>
        </div>

        {/* Pay button */}
        <button disabled={!canPay || processing} onClick={handlePay} style={{
          width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, border: 0,
          background: processing ? TZ.primaryDark : (canPay ? TZ.primary : '#D5D9E2'),
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: canPay && !processing ? 'pointer' : 'not-allowed',
          boxShadow: canPay ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {processing ? (
            <>
              <Spinner /> Procesando pago…
            </>
          ) : (
            <>
              <span>🔒</span>
              Pagar ${amount.toLocaleString('es-MX')} MXN
            </>
          )}
        </button>
      </div>
    </>
  );
}

// ── FLOW: WALLET (Apple Pay / Google Pay) ────────────────────
function PayWallet({ back, amount, concept, childName, onDone }) {
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
  const [processing, setProcessing] = React.useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onDone({
        method: 'wallet', status: 'paid',
        wallet: isIOS ? 'Apple Pay' : 'Google Pay',
        date: 'Hoy',
        ref: 'CLIP-' + Math.floor(Math.random() * 90000000 + 10000000),
      });
    }, 1300);
  };

  return (
    <>
      <PayStepHeader back={back} title={isIOS ? 'Apple Pay' : 'Google Pay'} subtitle="Confirma con Face ID / huella" />
      <div style={{ padding: 16 }}>
        <AmountRecap concept={concept} childName={childName} amount={amount} />

        {/* Sheet-like preview */}
        <div style={{
          marginTop: 20, background: '#000', color: '#fff', borderRadius: 20, padding: 20,
          boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{isIOS ? '  Pay' : 'G Pay'}</div>
            <button onClick={back} style={{ background: 'rgba(255,255,255,0.15)', border: 0, color: '#fff',
              borderRadius: '50%', width: 26, height: 26, cursor: 'pointer', fontSize: 14 }}>×</button>
          </div>
          <div style={{ marginTop: 20, fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Pagar a</div>
          <div style={{ fontSize: 17, fontWeight: 700, marginTop: 2 }}>TuzosJrz · Filial oficial del Club Pachuca</div>
          <div style={{ marginTop: 14, borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ opacity: 0.7 }}>Concepto</span>
              <span>{concept}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
              <span style={{ opacity: 0.7 }}>Total</span>
              <strong>${amount.toLocaleString('es-MX')} MXN</strong>
            </div>
          </div>
          <div style={{ marginTop: 18, padding: 12, background: 'rgba(255,255,255,0.08)', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 24, borderRadius: 4, background: '#fff' }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700 }}>Visa •••• 4242</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Predeterminada</div>
            </div>
          </div>
          <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👤</div>
            <div style={{ fontSize: 12, opacity: 0.8, flex: 1 }}>
              Confirma con <strong>Face ID</strong> para pagar
            </div>
          </div>
        </div>

        <button disabled={processing} onClick={handlePay} style={{
          width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, border: 0,
          background: processing ? '#333' : '#000',
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: processing ? 'wait' : 'pointer',
          boxShadow: '0 6px 16px rgba(0,0,0,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {processing ? <><Spinner /> Confirmando…</> : <>{isIOS ? '  Pay' : 'G Pay'} · ${amount.toLocaleString('es-MX')}</>}
        </button>
      </div>
    </>
  );
}

// ── FLOW: SPEI ───────────────────────────────────────────────
function PaySPEI({ back, amount, concept, childName, onDone }) {
  const clabe = '646 180 148 002 291057';
  const reference = 'TZ' + Math.floor(Math.random() * 900000 + 100000);
  const [copied, setCopied] = React.useState('');
  const copy = (what, val) => {
    navigator.clipboard?.writeText(val);
    setCopied(what);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <>
      <PayStepHeader back={back} title="Pagar por SPEI" subtitle="Se refleja en 2-4 horas" />
      <div style={{ padding: 16 }}>
        <AmountRecap concept={concept} childName={childName} amount={amount} />

        {/* Instructions card */}
        <div style={{ marginTop: 18, background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1, textTransform: 'uppercase' }}>Datos para transferir</div>

          <SpeiRow label="Banco" value="STP · TuzosJrz" onCopy={() => copy('bank', 'STP')} copied={copied === 'bank'} />
          <SpeiRow label="CLABE" value={clabe} onCopy={() => copy('clabe', clabe.replace(/\s/g,''))} copied={copied === 'clabe'} big />
          <SpeiRow label="Beneficiario" value="Club TuzosJrz A.C." onCopy={() => copy('name', 'Club TuzosJrz A.C.')} copied={copied === 'name'} />
          <SpeiRow label="Monto" value={`$${amount.toLocaleString('es-MX')} MXN`} exact onCopy={() => copy('amount', String(amount))} copied={copied === 'amount'} />
          <SpeiRow label="Concepto / Referencia" value={reference} onCopy={() => copy('ref', reference)} copied={copied === 'ref'} highlight />
        </div>

        {/* How it works */}
        <div style={{ marginTop: 14, padding: 14, background: '#EFF6FF', border: '1px solid #DBEAFE',
          borderRadius: 12, fontSize: 12, color: '#1E3A8A' }}>
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            ¿Cómo funciona?
          </div>
          <ol style={{ margin: 0, paddingLeft: 18, lineHeight: 1.7 }}>
            <li>Ve a tu banca en línea → hacer transferencia SPEI</li>
            <li>Copia y pega los datos de arriba</li>
            <li>Usa el <strong>concepto exacto</strong> para que se identifique automáticamente</li>
            <li>Al recibirse, verás tu pago como <strong>Pagado</strong> en el historial</li>
          </ol>
        </div>

        {/* Confirm button */}
        <button onClick={() => onDone({
          method: 'spei', status: 'processing', date: 'Hoy',
          ref: reference, clabe,
        })} style={{
          width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, border: 0,
          background: TZ.primary, color: '#fff',
          fontSize: 15, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(29,61,138,0.35)',
        }}>
          Ya transferí · Marcar en proceso
        </button>
        <div style={{ marginTop: 8, textAlign: 'center', fontSize: 11, color: TZ.muted }}>
          🔒 El SPEI se acredita automáticamente. No es necesario subir comprobante.
        </div>
      </div>
    </>
  );
}

function SpeiRow({ label, value, onCopy, copied, big, highlight, exact }) {
  return (
    <div style={{ padding: '10px 0', borderTop: '1px solid ' + TZ.line, display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.5, display: 'flex', alignItems: 'center', gap: 4 }}>
          <span>{label}</span>
          {exact && <span style={{ background: TZ.err, color: '#fff', padding: '1px 5px', borderRadius: 3, fontSize: 8 }}>EXACTO</span>}
          {highlight && <span style={{ background: '#F5B301', color: '#78350F', padding: '1px 5px', borderRadius: 3, fontSize: 8 }}>IMPORTANTE</span>}
        </div>
        <div style={{
          fontSize: big ? 15 : 13, color: TZ.ink,
          fontWeight: big || highlight ? 700 : 500, marginTop: 2,
          fontFamily: big || highlight ? 'monospace' : 'inherit',
          letterSpacing: big ? 1 : 0,
        }}>{value}</div>
      </div>
      <button onClick={onCopy} style={{
        padding: '6px 10px', borderRadius: 8, border: 0, cursor: 'pointer',
        background: copied ? TZ.ok : '#EEF0F4',
        color: copied ? '#fff' : TZ.inkSoft,
        fontSize: 11, fontWeight: 700,
      }}>{copied ? '✓ Copiado' : 'Copiar'}</button>
    </div>
  );
}

// ── FLOW: TRANSFERENCIA MANUAL ───────────────────────────────
function PayTransfer({ back, amount, concept, childName, onDone }) {
  const [operationId, setOperationId] = React.useState('');
  const [transferDate, setTransferDate] = React.useState('2026-09-21');
  const [receiptImg, setReceiptImg] = React.useState(null);
  const fileRef = React.useRef(null);
  const canSubmit = operationId && receiptImg;

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setReceiptImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <>
      <PayStepHeader back={back} title="Transferencia bancaria" subtitle="Sube comprobante · admin revisa" />
      <div style={{ padding: 16 }}>
        <AmountRecap concept={concept} childName={childName} amount={amount} />

        {/* Bank data recap */}
        <div style={{ marginTop: 14, padding: 14, background: '#F4F5F8', borderRadius: 12,
          border: '1px solid ' + TZ.line, fontSize: 12, color: TZ.inkSoft }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
            Datos bancarios del club
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div><strong style={{ color: TZ.ink }}>Banco:</strong> BBVA</div>
            <div><strong style={{ color: TZ.ink }}>Cuenta:</strong> 0119 8834 4529</div>
            <div><strong style={{ color: TZ.ink }}>CLABE:</strong> 012 320 00119883445 29</div>
            <div><strong style={{ color: TZ.ink }}>Titular:</strong> Club TuzosJrz A.C.</div>
          </div>
        </div>

        {/* Form */}
        <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PayInput label="Número de operación / referencia" value={operationId}
            onChange={setOperationId} placeholder="Ej. 8829173" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
            background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="calendar" size={16} color={TZ.inkSoft} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>Fecha de la transferencia</div>
              <input type="date" value={transferDate} onChange={e => setTransferDate(e.target.value)}
                style={{ width: '100%', border: 0, outline: 'none', background: 'transparent',
                  fontSize: 14, color: TZ.ink, fontWeight: 500, padding: '2px 0', marginTop: 1, fontFamily: 'inherit' }} />
            </div>
          </div>
        </div>

        {/* Receipt upload */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6, paddingLeft: 4 }}>
            Comprobante *
          </div>
          <input ref={fileRef} type="file" accept="image/*,application/pdf" style={{ display: 'none' }} onChange={handleFile} />
          {receiptImg ? (
            <div style={{ position: 'relative', background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
              padding: 8, textAlign: 'center' }}>
              <img src={receiptImg} alt="Comprobante"
                style={{ maxWidth: '100%', maxHeight: 220, borderRadius: 8, display: 'block', margin: '0 auto' }} />
              <button onClick={() => setReceiptImg(null)} style={{
                position: 'absolute', top: 12, right: 12,
                width: 30, height: 30, borderRadius: '50%', border: 0,
                background: 'rgba(220,38,38,0.9)', color: '#fff', cursor: 'pointer',
              }}>×</button>
              <div style={{ marginTop: 8, fontSize: 11, color: TZ.ok, fontWeight: 700 }}>
                ✓ Comprobante cargado
              </div>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{
              width: '100%', padding: '24px 14px',
              border: '1.5px dashed ' + TZ.primary, borderRadius: 12,
              background: 'rgba(29,61,138,0.03)', cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: TZ.primary,
            }}>
              <div style={{ fontSize: 34 }}>📎</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Subir foto o PDF del comprobante</div>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 500 }}>PNG, JPG o PDF · máx 5 MB</div>
            </button>
          )}
        </div>

        {/* Warning */}
        <div style={{ marginTop: 14, padding: 12, background: '#FFFBEB', border: '1px solid #FDE68A',
          borderRadius: 10, fontSize: 12, color: '#78350F', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <span>⏱️</span>
          <span>El admin revisará tu comprobante. Recibirás una notificación en cuanto quede confirmado (usualmente en menos de 4 h).</span>
        </div>

        <button disabled={!canSubmit} onClick={() => onDone({
          method: 'transfer', status: 'review', date: 'Hoy',
          operationId, transferDate, receiptImg: true,
        })} style={{
          width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, border: 0,
          background: canSubmit ? TZ.primary : '#D5D9E2',
          color: '#fff', fontSize: 15, fontWeight: 800, cursor: canSubmit ? 'pointer' : 'not-allowed',
          boxShadow: canSubmit ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
        }}>Enviar comprobante</button>
      </div>
    </>
  );
}

// ── FLOW: EFECTIVO ───────────────────────────────────────────
function PayCash({ back, amount, concept, childName, onDone }) {
  return (
    <>
      <PayStepHeader back={back} title="Pago en efectivo" subtitle="Admin confirma al recibir" />
      <div style={{ padding: 16 }}>
        <AmountRecap concept={concept} childName={childName} amount={amount} />

        <div style={{ marginTop: 18, padding: 16, background: '#fff',
          border: '1px solid ' + TZ.line, borderRadius: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>Entrega el efectivo a:</div>
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Cristian Ordóñez', role: 'Administrador general', phone: '771 000 0000' },
              { name: 'Coach Ramírez',    role: 'Entrenador Sub-12',     phone: '771 111 2233' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px',
                background: '#F4F5F8', borderRadius: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${i * 100 + 200} 55% 55%), hsl(${i * 100 + 240} 60% 40%))`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 14 }}>
                  {p.name.split(' ').map(x => x[0]).slice(0, 2).join('')}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{p.role} · {p.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 14, padding: 12, background: '#EFF6FF', border: '1px solid #DBEAFE',
          borderRadius: 10, fontSize: 12, color: '#1E3A8A', lineHeight: 1.5 }}>
          Marca "Ya pagué" cuando entregues el dinero. El admin lo confirmará en la app y se reflejará en tu historial.
        </div>

        <button onClick={() => onDone({
          method: 'cash', status: 'review', date: 'Hoy',
        })} style={{
          width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, border: 0,
          background: TZ.primary, color: '#fff',
          fontSize: 15, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(29,61,138,0.35)',
        }}>Ya pagué · Notificar al admin</button>
      </div>
    </>
  );
}

// ── FLOW: WHATSAPP LINK ──────────────────────────────────────
function PayWhatsApp({ back, amount, concept, childName, onDone }) {
  const link = `https://tuzosjrz.app/p/${Math.random().toString(36).slice(2, 10)}`;
  const msg = `Hola 👋 Aquí está el link para pagar la cuota de ${childName}:\n\n💰 ${concept}\n💵 $${amount.toLocaleString('es-MX')} MXN\n\n🔗 ${link}\n\nPuedes pagar con tarjeta, SPEI o transferencia. Gracias 💛💙\n\n— TuzosJrz`;
  const [copied, setCopied] = React.useState(false);

  return (
    <>
      <PayStepHeader back={back} title="Link de pago" subtitle="Compártelo por WhatsApp" />
      <div style={{ padding: 16 }}>
        <AmountRecap concept={concept} childName={childName} amount={amount} />

        {/* Link box */}
        <div style={{ marginTop: 18, background: '#fff', border: '1.5px dashed ' + TZ.primary, borderRadius: 14,
          padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 24 }}>🔗</div>
          <div style={{ flex: 1, minWidth: 0, fontFamily: 'monospace', fontSize: 12, color: TZ.primary,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</div>
          <button onClick={() => { navigator.clipboard?.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 1500); }} style={{
            padding: '6px 10px', borderRadius: 8, border: 0, background: copied ? TZ.ok : '#EEF0F4',
            color: copied ? '#fff' : TZ.inkSoft, fontSize: 11, fontWeight: 700, cursor: 'pointer',
          }}>{copied ? '✓' : 'Copiar'}</button>
        </div>

        {/* WhatsApp preview */}
        <div style={{ marginTop: 14, padding: 14, background: '#E5DDD5', borderRadius: 14 }}>
          <div style={{ background: '#DCF8C6', padding: '10px 12px', borderRadius: 10,
            fontSize: 12, color: '#111', whiteSpace: 'pre-wrap', lineHeight: 1.5,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }}>
            {msg}
            <div style={{ fontSize: 10, color: '#666', textAlign: 'right', marginTop: 4 }}>10:24 ✓✓</div>
          </div>
        </div>

        <button onClick={() => {
          const url = 'https://wa.me/?text=' + encodeURIComponent(msg);
          try { window.open(url, '_blank'); } catch {}
          onDone({
            method: 'whatsapp', status: 'pending', date: 'Hoy', link,
          });
        }} style={{
          width: '100%', marginTop: 16, padding: '15px', borderRadius: 12, border: 0,
          background: '#25D366', color: '#fff',
          fontSize: 15, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(37,211,102,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <span>💬</span>
          Compartir por WhatsApp
        </button>
      </div>
    </>
  );
}

// ── SUCCESS SCREEN ──────────────────────────────────────────
function PaySuccess({ result, onDone }) {
  const isInstant = result.status === 'paid';
  const isProcessing = result.status === 'processing';
  const isReview = result.status === 'review';
  const isPending = result.status === 'pending';

  const gradient = isInstant
    ? `linear-gradient(155deg, ${TZ.ok}, #15803D)`
    : isReview || isProcessing
    ? `linear-gradient(155deg, #F5B301, #B45309)`
    : `linear-gradient(155deg, ${TZ.primary}, ${TZ.primaryDark})`;

  const icon = isInstant ? '✓' : isProcessing ? '⏳' : isReview ? '⏱️' : '🔗';
  const title = isInstant ? '¡Pago realizado!' : isProcessing ? 'Pago en proceso' : isReview ? 'Comprobante enviado' : 'Link compartido';
  const sub = isInstant
    ? 'Tu pago fue aplicado y aparece en tu historial.'
    : isProcessing
    ? 'Verás tu pago acreditado en las próximas horas.'
    : isReview
    ? 'El administrador revisará tu comprobante y te avisaremos.'
    : 'Cuando el destinatario pague, se acreditará automáticamente.';

  return (
    <>
      <div style={{ padding: '54px 20px 24px', background: gradient, color: '#fff',
        position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', textAlign: 'center', paddingTop: 20 }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto', boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
            fontSize: 40, fontWeight: 800, color: isInstant ? TZ.ok : '#B45309',
          }}>{icon}</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginTop: 16, letterSpacing: -0.4 }}>{title}</div>
          <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8, maxWidth: 300, margin: '8px auto 0', lineHeight: 1.5 }}>{sub}</div>
        </div>
      </div>

      <div style={{ padding: '18px 16px' }}>
        <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, padding: 16 }}>
          <SummaryRow label="Método" value={
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <span>{METHOD_META[result.method]?.icon}</span> {METHOD_META[result.method]?.label}
            </span>
          } />
          <SummaryRow label="Estado" value={
            <Chip tone={STATUS_META[result.status]?.tone}>{STATUS_META[result.status]?.label}</Chip>
          } />
          {result.ref && <SummaryRow label="Referencia" value={<span style={{ fontFamily: 'monospace' }}>{result.ref}</span>} />}
          {result.last4 && <SummaryRow label="Tarjeta" value={`•••• ${result.last4}`} />}
          <SummaryRow label="Fecha" value={result.date} last />
        </div>

        <div style={{ marginTop: 16, display: 'flex', gap: 10 }}>
          <button onClick={onDone} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Ver historial</button>
          <button onClick={onDone} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: TZ.primary, color: '#fff', border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
          }}>Hecho</button>
        </div>
      </div>
    </>
  );
}

function SummaryRow({ label, value, last }) {
  return (
    <div style={{ padding: '10px 0', borderBottom: last ? 0 : '1px solid ' + TZ.line,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
      <span style={{ fontSize: 12, color: TZ.muted, fontWeight: 600 }}>{label}</span>
      <span style={{ fontSize: 13, color: TZ.ink, fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

// ── HISTORY (parent view) ────────────────────────────────────
function ParentPayments({ parentKey = 'parent-carlos', onPay }) {
  React.useEffect(() => seedPaymentsIfEmpty(parentKey), [parentKey]);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const h = () => setTick(t => t + 1);
    window.addEventListener('tz-payments-change', h);
    return () => window.removeEventListener('tz-payments-change', h);
  }, []);
  const history = getPaymentHistory(parentKey);
  const totalPaid = history.filter(h => h.status === 'paid').reduce((s, h) => s + h.amount, 0);

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader title="Pagos" subtitle="Cuotas · historial · recibos" />
      <div style={{ padding: '0 16px' }}>
        {/* Big current cuota card */}
        <div style={{
          background: `linear-gradient(150deg, ${TZ.primary}, ${TZ.primaryDark})`,
          color: '#fff', borderRadius: 16, padding: 16, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
            backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.75, letterSpacing: 1 }}>CUOTA ACTUAL</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 10 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700 }}>Septiembre 2026</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: -0.6, marginTop: 4 }}>
                  $850 <span style={{ fontSize: 14, opacity: 0.7, fontWeight: 600 }}>MXN</span>
                </div>
                <div style={{ marginTop: 6 }}>
                  <span style={{ padding: '3px 8px', borderRadius: 999, background: 'rgba(245,179,1,0.25)',
                    color: '#F5B301', fontSize: 10, fontWeight: 800, letterSpacing: 0.5 }}>
                    ⏰ VENCE EN 3 DÍAS
                  </span>
                </div>
              </div>
              <button onClick={onPay} style={{
                padding: '12px 18px', borderRadius: 12, border: 0,
                background: '#F5B301', color: TZ.primaryDark,
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(245,179,1,0.4)',
              }}>Pagar ahora</button>
            </div>
          </div>
        </div>

        {/* Totals */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
          <StatBox label="Pagado en el año" value={`$${totalPaid.toLocaleString('es-MX')}`} color={TZ.ok} />
          <StatBox label="Pagos realizados" value={history.filter(h => h.status === 'paid').length} color={TZ.primary} />
        </div>

        <SectionTitle>Historial</SectionTitle>
        <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14, overflow: 'hidden' }}>
          {history.length === 0 ? (
            <div style={{ padding: 30, textAlign: 'center', color: TZ.muted, fontSize: 13 }}>
              Sin pagos registrados aún
            </div>
          ) : history.map((h, i) => (
            <PaymentHistoryRow key={h.id} entry={h} first={i === 0} />
          ))}
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, color: TZ.muted }}>
          🔒 Los pagos y recibos se guardan de forma segura en tu cuenta
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
      padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 20, fontWeight: 800, color, letterSpacing: -0.3, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</div>
    </div>
  );
}

function PaymentHistoryRow({ entry: h, first }) {
  const meta = METHOD_META[h.method] || METHOD_META.card;
  const status = STATUS_META[h.status];
  return (
    <div style={{
      padding: '13px 14px', borderTop: first ? 0 : '1px solid ' + TZ.line,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, background: meta.color + '18',
        color: meta.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 20, flexShrink: 0,
      }}>{meta.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: TZ.ink,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.concept}</span>
          <span style={{ fontSize: 13, fontWeight: 800, color: TZ.ink, flexShrink: 0 }}>
            ${h.amount.toLocaleString('es-MX')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 3 }}>
          <span style={{ fontSize: 11, color: TZ.muted }}>{h.date}</span>
          <span style={{ fontSize: 11, color: TZ.muted }}>·</span>
          <span style={{ fontSize: 10, color: TZ.muted, fontWeight: 600 }}>{meta.label}</span>
          <span style={{ marginLeft: 'auto' }}>
            <Chip tone={status.tone} size="sm">{status.label}</Chip>
          </span>
        </div>
        {h.ref && (
          <div style={{ fontSize: 10, color: TZ.muted, marginTop: 3, fontFamily: 'monospace' }}>
            Ref: {h.ref}
          </div>
        )}
        {h.receiptImg && (
          <div style={{ fontSize: 10, color: TZ.primary, marginTop: 3, fontWeight: 600 }}>
            📎 Comprobante adjunto
          </div>
        )}
      </div>
    </div>
  );
}

// ── Helpers ─────────────────────────────────────────────────
function PayInput({ label, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12, padding: '10px 14px' }}>
      <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>{label}</div>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', border: 0, outline: 'none', background: 'transparent',
          fontSize: 15, color: TZ.ink, fontWeight: 500, padding: '4px 0 2px', fontFamily: 'inherit' }} />
    </div>
  );
}

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

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function detectBrand(n) {
  const cleaned = n.replace(/\D/g, '');
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  return null;
}
function formatCardNumber(n) {
  const c = n.replace(/\D/g, '').slice(0, 16);
  return c.replace(/(\d{4})(?=\d)/g, '$1 ');
}
function CardBrandLogo({ brand }) {
  if (brand === 'visa')       return <span style={{ fontFamily: 'Georgia,serif', fontWeight: 900, fontStyle: 'italic', fontSize: 18 }}>VISA</span>;
  if (brand === 'mastercard') return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#EB001B' }} />
      <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#F79E1B', marginLeft: -8 }} />
    </div>
  );
  if (brand === 'amex')       return <span style={{ background: '#fff', color: '#006FCF', padding: '2px 5px', fontWeight: 800, fontSize: 10, borderRadius: 3 }}>AMEX</span>;
  return <div style={{ width: 34, height: 22, borderRadius: 4, background: 'rgba(255,255,255,0.15)' }} />;
}

// Spinner CSS
(function() {
  if (document.getElementById('tz-pay-css')) return;
  const s = document.createElement('style');
  s.id = 'tz-pay-css';
  s.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
  document.head.appendChild(s);
})();

Object.assign(window, {
  PayFlow, ParentPayments,
  getPaymentHistory, savePaymentHistory, addPayment, seedPaymentsIfEmpty,
  METHOD_META, STATUS_META,
});
