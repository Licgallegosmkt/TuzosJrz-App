// TuzosJrz — Parent onboarding flow (invite → register → verify → approved)

function ParentOnboarding({ state, setState, onEnter }) {
  // state: 'invite' | 'register' | 'review' | 'approved'
  // 'approved' is handled by App switching to ParentHome; here we just render the pre-approved screens.

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#F4F5F8' }}>
      {/* Stepper preview bar — only visible in prototype for reviewers */}
      <StepperBar state={state} setState={setState} />

      <div style={{ flex: 1, overflow: 'auto' }}>
        {state === 'invite' && <InviteLanding onContinue={() => setState('register')} />}
        {state === 'register' && <RegisterForm onSubmit={() => setState('review')} back={() => setState('invite')} />}
        {state === 'review' && <ReviewPending onSimulateApprove={() => { setState('approved'); onEnter && onEnter(); }} />}
      </div>
    </div>
  );
}

// ── Reviewer stepper (top of onboarding) ─────────────────────
function StepperBar({ state, setState }) {
  const steps = [
    { id: 'invite',   n: 1, label: 'Invitación' },
    { id: 'register', n: 2, label: 'Registro' },
    { id: 'review',   n: 3, label: 'En revisión' },
    { id: 'approved', n: 4, label: 'Aprobado' },
  ];
  const activeIdx = steps.findIndex(s => s.id === state);
  return (
    <div style={{
      padding: '54px 16px 12px',
      background: '#fff',
      borderBottom: '1px solid ' + TZ.line,
      position: 'relative',
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: TZ.muted, textTransform: 'uppercase', textAlign: 'center', marginBottom: 10 }}>
        Vista prototipo · flujo de alta
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {steps.map((s, i) => {
          const active = i === activeIdx;
          const done = i < activeIdx;
          return (
            <React.Fragment key={s.id}>
              <button onClick={() => setState(s.id)} style={{
                flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                background: 'transparent', border: 0, cursor: 'pointer', padding: '4px 0',
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: '50%',
                  background: active ? TZ.primary : done ? TZ.ok : '#EEF0F4',
                  color: (active || done) ? '#fff' : TZ.muted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 800,
                  boxShadow: active ? '0 2px 6px rgba(29,61,138,0.35)' : 'none',
                }}>
                  {done ? '✓' : s.n}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, marginTop: 4,
                  color: active ? TZ.ink : done ? TZ.ok : TZ.muted,
                  letterSpacing: 0.3,
                }}>{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div style={{ flex: 0.4, height: 2, background: i < activeIdx ? TZ.ok : '#EEF0F4', marginTop: -14 }} />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

// ── SCREEN 1: Invite landing (from WhatsApp link) ────────────
function InviteLanding({ onContinue }) {
  return (
    <div style={{ padding: 24, minHeight: '100%', background: `linear-gradient(180deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`, color: '#fff', position: 'relative', overflow: 'hidden' }}>
      {/* Diagonal stripes */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
      {/* Rings watermark */}
      <div style={{ position: 'absolute', right: -60, top: 80, width: 240, height: 240, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
      <div style={{ position: 'absolute', right: -20, top: 120, width: 160, height: 160, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)' }} />

      <div style={{ position: 'relative', paddingTop: 24 }}>
        {/* Logo oficial grande */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <window.ClubCrest size={150} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 14 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>FILIAL OFICIAL DEL CLUB PACHUCA</div>
        </div>

        {/* Invitation card */}
        <div style={{
          marginTop: 30, background: 'rgba(255,255,255,0.10)',
          backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: 20, padding: 22, textAlign: 'center',
        }}>
          <div style={{ display: 'inline-block', background: '#F5B301', color: TZ.primaryDark,
            fontSize: 10, fontWeight: 800, letterSpacing: 1.5, padding: '4px 10px', borderRadius: 999, textTransform: 'uppercase' }}>
            Invitación
          </div>
          <div style={{ marginTop: 14, fontSize: 20, fontWeight: 700, lineHeight: 1.3 }}>
            Bienvenido al portal de padres
          </div>
          <div style={{ marginTop: 8, fontSize: 13, opacity: 0.85, lineHeight: 1.5 }}>
            Vas a vincular tu cuenta con el jugador:
          </div>

          {/* Linked player card */}
          <div style={{
            marginTop: 14, background: 'rgba(0,0,0,0.20)', borderRadius: 14,
            padding: 12, display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left',
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%',
              background: 'linear-gradient(135deg, hsl(214 55% 55%), hsl(254 60% 40%))',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 16,
            }}>DH</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Diego Hernández</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Sub-12 · #7 · Delantero</div>
            </div>
            <div style={{
              fontFamily: '"Barlow Condensed", monospace', fontSize: 20, fontWeight: 800,
              color: '#F5B301', letterSpacing: 2,
            }}>TZ-4291</div>
          </div>
        </div>

        {/* Auth buttons */}
        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={onContinue} style={{
            padding: '14px', borderRadius: 12, border: 0, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 700, color: '#0B1220', cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          }}>
            <GoogleG />
            Continuar con Google
          </button>
          <button onClick={onContinue} style={{
            padding: '14px', borderRadius: 12, border: 0, background: '#000',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 700, color: '#fff', cursor: 'pointer',
          }}>
            <AppleLogo />
            Continuar con Apple
          </button>
        </div>

        <div style={{ marginTop: 20, textAlign: 'center', fontSize: 11, opacity: 0.7, lineHeight: 1.5 }}>
          Al continuar aceptas los términos del club.<br/>
          Tu cuenta debe ser aprobada por el administrador.
        </div>
      </div>
    </div>
  );
}

// ── SCREEN 2: Register form ──────────────────────────────────
function RegisterForm({ onSubmit, back }) {
  const [form, setForm] = React.useState({
    name: 'Carlos Hernández',
    relation: 'Padre',
    phone: '+52 771 234 5678',
    email: 'carlos.hdz@correo.mx',
    address: '',
    emgName: '',
    emgPhone: '',
    accepts1: false,
    accepts2: false,
  });
  const canSubmit = form.name && form.relation && form.phone && form.email && form.accepts1 && form.accepts2;
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div style={{ padding: '18px 20px 40px' }}>
      <button onClick={back} style={{
        background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
        color: TZ.primary, fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4,
        marginBottom: 12,
      }}>
        <Icon name="chevronL" size={16} color={TZ.primary} />
        Volver
      </button>

      <div style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, letterSpacing: -0.4 }}>Completa tu perfil</div>
      <div style={{ fontSize: 13, color: TZ.muted, marginTop: 4, lineHeight: 1.5 }}>
        Estos datos los usará el club para contactarte y validar la vinculación con tu hijo.
      </div>

      {/* Linked player recap */}
      <div style={{
        marginTop: 18, padding: 12, background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: 'linear-gradient(135deg, hsl(214 55% 55%), hsl(254 60% 40%))',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 13,
        }}>DH</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.8, textTransform: 'uppercase' }}>Vinculando con</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>Diego Hernández · Sub-12</div>
        </div>
        <Chip tone="brand">TZ-4291</Chip>
      </div>

      {/* Sections */}
      <FormSection title="Datos personales">
        <Input label="Nombre completo" value={form.name} onChange={v => set('name', v)} />
        <RadioRow label="Parentesco" value={form.relation} onChange={v => set('relation', v)}
          options={['Padre', 'Madre', 'Tutor']} />
        <Input label="Teléfono" value={form.phone} onChange={v => set('phone', v)} icon="phone" />
        <Input label="Email" value={form.email} onChange={v => set('email', v)} icon="mail" hint="Precargado desde Google" locked />
        <Input label="Dirección" value={form.address} onChange={v => set('address', v)} placeholder="Calle, número, colonia" multiline />
      </FormSection>

      <FormSection title="Contacto de emergencia adicional">
        <div style={{ fontSize: 12, color: TZ.muted, marginBottom: 8, lineHeight: 1.5 }}>
          Alguien más a quien podamos llamar si no te localizamos.
        </div>
        <Input label="Nombre" value={form.emgName} onChange={v => set('emgName', v)} placeholder="Ej. María López" />
        <Input label="Teléfono" value={form.emgPhone} onChange={v => set('emgPhone', v)} placeholder="+52 ..." icon="phone" />
      </FormSection>

      <FormSection title="Documentos y consentimientos">
        <CheckRow value={form.accepts1} onChange={v => set('accepts1', v)}>
          He leído y acepto el <strong style={{ color: TZ.primary }}>Reglamento del club</strong>.
        </CheckRow>
        <CheckRow value={form.accepts2} onChange={v => set('accepts2', v)}>
          Acepto el <strong style={{ color: TZ.primary }}>Aviso de privacidad</strong> y el tratamiento de mis datos.
        </CheckRow>
      </FormSection>

      <button disabled={!canSubmit} onClick={onSubmit} style={{
        width: '100%', marginTop: 22, padding: '15px',
        borderRadius: 12, border: 0,
        background: canSubmit ? TZ.primary : '#D5D9E2',
        color: '#fff', fontSize: 15, fontWeight: 700,
        cursor: canSubmit ? 'pointer' : 'not-allowed',
        boxShadow: canSubmit ? '0 6px 16px rgba(29,61,138,0.35)' : 'none',
      }}>
        Enviar solicitud
      </button>
      <div style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: TZ.muted }}>
        Un administrador revisará tu registro en un plazo aproximado de 24 h.
      </div>
    </div>
  );
}

// ── SCREEN 3: Review / pending approval ──────────────────────
function ReviewPending({ onSimulateApprove }) {
  return (
    <div style={{ padding: '40px 24px', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Animated wait icon */}
      <div style={{ margin: '20px auto 0', position: 'relative', width: 120, height: 120 }}>
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          background: 'rgba(29,61,138,0.08)',
        }} />
        <div style={{
          position: 'absolute', inset: 14, borderRadius: '50%',
          background: 'rgba(29,61,138,0.14)',
        }} />
        <div style={{
          position: 'absolute', inset: 28, borderRadius: '50%',
          background: TZ.primary, color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 8px 20px rgba(29,61,138,0.35)',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 22 }}>
        <div style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, letterSpacing: -0.4 }}>Solicitud enviada</div>
        <div style={{ fontSize: 14, color: TZ.inkSoft, marginTop: 8, lineHeight: 1.55, maxWidth: 320, margin: '8px auto 0' }}>
          Tu cuenta está en revisión por un administrador del club. Te avisaremos por email cuando esté lista.
        </div>
      </div>

      {/* Status card */}
      <div style={{
        marginTop: 26, background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 16,
        padding: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <Chip tone="brand">TZ-4291</Chip>
          <span style={{ fontSize: 12, color: TZ.muted }}>Solicitud enviada · hoy 10:24</span>
        </div>
        <TimelineStep done label="Datos enviados" sub="Perfil, contacto de emergencia, consentimientos" />
        <TimelineStep active label="En revisión por el club" sub="Un administrador validará tu solicitud" />
        <TimelineStep label="Acceso otorgado" sub="Recibirás un correo de confirmación" last />
      </div>

      {/* Support */}
      <div style={{
        marginTop: 18, padding: 14, background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(29,61,138,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="phone" size={18} color={TZ.primary} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: TZ.ink }}>¿Dudas con tu registro?</div>
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Escríbenos por WhatsApp al 771 000 0000</div>
        </div>
      </div>

      {/* Prototype-only: skip to approved */}
      <button onClick={onSimulateApprove} style={{
        marginTop: 24, padding: '12px 16px',
        border: '1.5px dashed ' + TZ.primary, borderRadius: 12, background: 'transparent',
        color: TZ.primary, fontSize: 12, fontWeight: 700, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
      }}>
        <Icon name="check" size={14} color={TZ.primary} />
        [Vista prototipo] Simular aprobación
      </button>
    </div>
  );
}

// ── Bits ─────────────────────────────────────────────────────
function FormSection({ title, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, placeholder, icon, hint, locked, multiline }) {
  return (
    <label style={{ display: 'block' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: TZ.inkSoft, marginBottom: 5, paddingLeft: 2, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span>{label}</span>
        {locked && <Chip tone="neutral" size="sm">Auto</Chip>}
      </div>
      <div style={{
        display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 8,
        background: locked ? '#F4F5F8' : '#fff',
        border: '1px solid ' + TZ.line, borderRadius: 10, padding: '11px 12px',
      }}>
        {icon && <Icon name={icon} size={16} color={TZ.muted} />}
        {multiline ? (
          <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={2}
            style={{ flex: 1, border: 0, outline: 'none', fontSize: 14, color: TZ.ink, background: 'transparent', resize: 'none', fontFamily: 'inherit' }} />
        ) : (
          <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={locked}
            style={{ flex: 1, border: 0, outline: 'none', fontSize: 14, color: TZ.ink, background: 'transparent' }} />
        )}
      </div>
      {hint && <div style={{ fontSize: 11, color: TZ.muted, marginTop: 4, paddingLeft: 2 }}>{hint}</div>}
    </label>
  );
}

function RadioRow({ label, value, onChange, options }) {
  return (
    <div>
      <div style={{ fontSize: 11, fontWeight: 600, color: TZ.inkSoft, marginBottom: 5, paddingLeft: 2 }}>{label}</div>
      <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 10, padding: 3 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} type="button" style={{
            flex: 1, padding: '9px 4px', border: 0, borderRadius: 8,
            background: value === o ? '#fff' : 'transparent',
            color: value === o ? TZ.ink : TZ.inkSoft,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: value === o ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
          }}>{o}</button>
        ))}
      </div>
    </div>
  );
}

function CheckRow({ value, onChange, children }) {
  return (
    <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', cursor: 'pointer' }}>
      <div onClick={() => onChange(!value)} style={{
        flexShrink: 0, marginTop: 1,
        width: 22, height: 22, borderRadius: 6,
        border: '1.5px solid ' + (value ? TZ.primary : '#CBD1DC'),
        background: value ? TZ.primary : '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {value && <Icon name="check" size={14} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: 13, color: TZ.ink, lineHeight: 1.5 }}>{children}</span>
    </label>
  );
}

function TimelineStep({ label, sub, done, active, last }) {
  return (
    <div style={{ display: 'flex', gap: 12, position: 'relative', paddingBottom: last ? 0 : 14 }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%',
          background: done ? TZ.ok : active ? TZ.primary : '#EEF0F4',
          color: (done || active) ? '#fff' : TZ.muted,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 800, flexShrink: 0,
          boxShadow: active ? '0 0 0 4px rgba(29,61,138,0.15)' : 'none',
        }}>
          {done ? '✓' : active ? '' : ''}
          {active && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#fff', animation: 'pulse 1.5s ease-in-out infinite' }} />}
        </div>
        {!last && <div style={{ flex: 1, width: 2, background: done ? TZ.ok : '#EEF0F4', marginTop: 2, minHeight: 20 }} />}
      </div>
      <div style={{ flex: 1, paddingTop: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: (done || active) ? TZ.ink : TZ.muted }}>{label}</div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>
      </div>
    </div>
  );
}

function GoogleG() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.7-6.7C35.5 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.6 17.7 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.2-.4-4.7H24v9h12.7c-.6 3-2.3 5.5-4.9 7.2l7.6 5.9c4.4-4.1 7.1-10.1 7.1-17.4z"/>
      <path fill="#FBBC05" d="M10.4 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.8-6C.9 16.9 0 20.3 0 24s.9 7.1 2.6 10.6l7.8-6z"/>
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.6-5.9c-2.1 1.4-4.9 2.3-8.3 2.3-6.3 0-11.7-4.1-13.6-9.7l-7.8 6C6.5 42.6 14.6 48 24 48z"/>
    </svg>
  );
}
function AppleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
}

Object.assign(window, { ParentOnboarding });
