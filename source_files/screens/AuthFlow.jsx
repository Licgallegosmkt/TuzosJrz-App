// TuzosJrz — Splash + Login + Role router (mock; ready for Supabase Auth)

// Session helpers — persist in localStorage
function getSession() {
  try { return JSON.parse(localStorage.getItem('tz.session') || 'null'); }
  catch { return null; }
}
function saveSession(session) {
  try { localStorage.setItem('tz.session', JSON.stringify(session)); } catch {}
}
function clearSession() {
  try { localStorage.removeItem('tz.session'); } catch {}
}

// Detect role from email (mocked; real logic lives in Supabase auth hooks)
function detectRoleFromEmail(email) {
  const e = (email || '').toLowerCase().trim();
  if (e === 'tuzosjrz@gmail.com' || e.startsWith('admin@') || e === 'admin@tuzosjrz.com') {
    return { role: 'admin', name: 'Admin TuzosJrz', firstName: 'Cristian' };
  }
  if (e.includes('coach') || e.includes('entrenador')) {
    return { role: 'coach', name: 'Coach ' + capitalize(e.split('@')[0].replace(/coach\.?/, '').replace(/\d+/g, '') || 'Ramírez'), firstName: 'Miguel' };
  }
  // Everyone else → parent
  return { role: 'parent', name: capitalize((e.split('@')[0] || 'Padre').replace(/[._-]+/g, ' ')), firstName: capitalize((e.split('@')[0] || 'Padre').split(/[._-]/)[0]) };
}
function capitalize(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }

// ── SPLASH SCREEN ────────────────────────────────────────────
function SplashScreen({ onDone }) {
  React.useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      overflow: 'hidden', zIndex: 500,
    }}>
      {/* Diagonal stripes */}
      <div style={{
        position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)',
      }} />
      {/* Decorative rings */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-20%', width: 340, height: 340,
        borderRadius: '50%', border: '1px solid rgba(245,179,1,0.15)', animation: 'tz-splash-ring 2s ease-out',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-25%', width: 400, height: 400,
        borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', animation: 'tz-splash-ring 2.4s ease-out',
      }} />

      {/* Logo */}
      <div style={{
        animation: 'tz-splash-logo 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.35))',
      }}>
        <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
          style={{ width: 200, height: 200, objectFit: 'contain', display: 'block' }} />
      </div>

      {/* Subtitle appearing after logo */}
      <div style={{
        marginTop: 20, textAlign: 'center', color: '#fff',
        animation: 'tz-splash-fade 1.6s ease-out',
      }}>
        <div style={{ fontSize: 11, letterSpacing: 2.5, fontWeight: 700, color: '#F5B301' }}>
          FILIAL OFICIAL DEL CLUB PACHUCA
        </div>
      </div>

      {/* Bottom loader */}
      <div style={{
        position: 'absolute', bottom: 60, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', gap: 6,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 8, height: 8, borderRadius: '50%', background: '#F5B301',
            animation: `tz-splash-bounce 0.9s ease-in-out ${i * 0.15}s infinite`,
          }} />
        ))}
      </div>

      <style>{`
        @keyframes tz-splash-logo {
          0% { opacity: 0; transform: scale(0.5); }
          60% { opacity: 1; transform: scale(1.08); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes tz-splash-fade {
          0%, 40% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes tz-splash-ring {
          0% { opacity: 0; transform: scale(0.5); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes tz-splash-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-8px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── LOGIN SCREEN ────────────────────────────────────────────
function LoginScreen({ onLogin, onNoAccount }) {
  const [loading, setLoading] = React.useState(null); // null | 'google' | 'apple'
  const [showEmail, setShowEmail] = React.useState(false);
  const [email, setEmail] = React.useState('');

  const doLogin = (provider, presetEmail) => {
    setLoading(provider);
    const emailToUse = presetEmail || email || (provider === 'google' ? 'tuzosjrz@gmail.com' : 'usuario@icloud.com');
    setTimeout(() => {
      const detected = detectRoleFromEmail(emailToUse);
      const session = {
        email: emailToUse,
        provider,
        ...detected,
        loggedInAt: Date.now(),
      };
      saveSession(session);
      onLogin(session);
    }, 900);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#F4F5F8',
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      {/* Hero azul con logo */}
      <div style={{
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '80px 24px 60px', position: 'relative', overflow: 'hidden',
        borderBottomLeftRadius: 40, borderBottomRightRadius: 40,
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
            style={{ width: 130, height: 130, objectFit: 'contain', margin: '0 auto',
              filter: 'drop-shadow(0 8px 20px rgba(0,0,0,0.3))' }} />
          <div style={{ fontSize: 11, letterSpacing: 2.5, fontWeight: 700, color: '#F5B301', marginTop: 12 }}>
            FILIAL OFICIAL DEL CLUB PACHUCA
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px 24px 40px', flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, letterSpacing: -0.4 }}>
            Bienvenido de vuelta
          </div>
          <div style={{ fontSize: 13, color: TZ.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
            Inicia sesión para continuar
          </div>
        </div>

        {/* Auth buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => doLogin('google')} disabled={loading} style={{
            padding: '14px', borderRadius: 12, border: '1px solid ' + TZ.line,
            background: '#fff', color: TZ.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            boxShadow: '0 2px 6px rgba(15,23,42,0.06)',
            opacity: loading && loading !== 'google' ? 0.4 : 1,
          }}>
            {loading === 'google' ? <><Spinner /> Iniciando sesión…</> : <><GoogleG /> Continuar con Google</>}
          </button>
          <button onClick={() => doLogin('apple')} disabled={loading} style={{
            padding: '14px', borderRadius: 12, border: 0,
            background: '#000', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 700, cursor: loading ? 'wait' : 'pointer',
            opacity: loading && loading !== 'apple' ? 0.4 : 1,
          }}>
            {loading === 'apple' ? <><Spinner /> Iniciando sesión…</> : <><AppleLogo /> Continuar con Apple</>}
          </button>
        </div>

        {/* Separator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '22px 0' }}>
          <div style={{ flex: 1, height: 1, background: TZ.line }} />
          <span style={{ fontSize: 11, color: TZ.muted, fontWeight: 600, letterSpacing: 0.5 }}>O</span>
          <div style={{ flex: 1, height: 1, background: TZ.line }} />
        </div>

        {/* Email login (opcional) */}
        {!showEmail ? (
          <button onClick={() => setShowEmail(true)} style={{
            width: '100%', padding: '12px', borderRadius: 12, border: '1px solid ' + TZ.line,
            background: '#fff', color: TZ.inkSoft, fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}>
            Iniciar sesión con correo
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="tucorreo@gmail.com" autoFocus
              style={{
                padding: '13px 14px', border: '1px solid ' + TZ.line, borderRadius: 10,
                fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff',
              }} />
            <button onClick={() => doLogin('email', email)} disabled={!email.includes('@') || loading} style={{
              padding: '13px', borderRadius: 12, border: 0,
              background: email.includes('@') ? TZ.primary : '#D5D9E2',
              color: '#fff', fontSize: 14, fontWeight: 700,
              cursor: email.includes('@') ? 'pointer' : 'not-allowed',
              boxShadow: email.includes('@') ? '0 4px 12px rgba(29,61,138,0.35)' : 'none',
            }}>
              {loading === 'email' ? 'Enviando enlace…' : 'Enviar enlace mágico'}
            </button>
            <div style={{ fontSize: 11, color: TZ.muted, textAlign: 'center' }}>
              Te llegará un link por correo · sin contraseñas
            </div>
          </div>
        )}

        {/* No account CTA */}
        <div style={{
          marginTop: 28, padding: 14, background: '#fff', border: '1px solid ' + TZ.line,
          borderRadius: 12, textAlign: 'center',
        }}>
          <div style={{ fontSize: 13, color: TZ.inkSoft, marginBottom: 8 }}>
            ¿Primera vez en la app?
          </div>
          <button onClick={onNoAccount} style={{
            background: 'transparent', border: 0, color: TZ.primary,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>
            Pide tu invitación al club →
          </button>
        </div>

        {/* Prototype hints */}
        <div style={{
          marginTop: 30, padding: 12, background: '#FEF3C7', border: '1px solid #FDE68A',
          borderRadius: 10, fontSize: 11, color: '#78350F', lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>💡 Prueba con:</div>
          <div><strong>Admin:</strong> tuzosjrz@gmail.com o admin@…</div>
          <div><strong>Coach:</strong> cualquier email con "coach" (ej. coach.ramirez@…)</div>
          <div><strong>Padre:</strong> cualquier otro correo</div>
        </div>

        {/* Footer */}
        <div style={{ marginTop: 24, textAlign: 'center', fontSize: 10, color: TZ.muted, lineHeight: 1.5 }}>
          Al continuar aceptas los <strong>Términos</strong> y el <strong>Aviso de privacidad</strong> del club.<br/>
          TuzosJrz · Filial Club Pachuca
        </div>
      </div>
    </div>
  );
}

// ── NO ACCOUNT / REQUEST INVITE SCREEN ──────────────────────
function NoAccountScreen({ back }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#F4F5F8',
      display: 'flex', flexDirection: 'column', overflow: 'auto',
    }}>
      <div style={{
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '54px 20px 40px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <button onClick={back} style={{
          position: 'relative', width: 36, height: 36, borderRadius: '50%', border: 0,
          background: 'rgba(255,255,255,0.15)', cursor: 'pointer', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronL" size={18} color="#fff" />
        </button>
        <div style={{ position: 'relative', textAlign: 'center', marginTop: 20 }}>
          <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
            style={{ width: 90, height: 90, objectFit: 'contain', margin: '0 auto',
              filter: 'drop-shadow(0 6px 14px rgba(0,0,0,0.3))' }} />
        </div>
      </div>

      <div style={{ padding: 24, flex: 1 }}>
        <div style={{ textAlign: 'center', marginBottom: 22 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: TZ.ink, letterSpacing: -0.4 }}>
            Solicita tu invitación
          </div>
          <div style={{ fontSize: 13, color: TZ.inkSoft, marginTop: 8, lineHeight: 1.5 }}>
            La app es exclusiva para familias y staff del club.<br/>
            Contacta al administrador para recibir tu acceso.
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button onClick={() => window.open('https://wa.me/5217710000000?text=Hola,%20quiero%20unirme%20a%20TuzosJrz', '_blank')} style={{
            padding: '14px', borderRadius: 12, border: 0,
            background: '#25D366', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
          }}>
            <WhatsAppIcon />
            Contactar por WhatsApp
          </button>
          <button onClick={() => window.open('mailto:tuzosjrz@gmail.com?subject=Solicito%20invitaci%C3%B3n%20a%20la%20app', '_blank')} style={{
            padding: '14px', borderRadius: 12, border: '1px solid ' + TZ.line,
            background: '#fff', color: TZ.ink,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
          }}>
            <Icon name="mail" size={18} color={TZ.inkSoft} />
            Enviar correo
          </button>
        </div>

        <div style={{
          marginTop: 26, padding: 14, background: '#EFF6FF', border: '1px solid #DBEAFE',
          borderRadius: 10, fontSize: 12, color: '#1E3A8A', lineHeight: 1.5,
        }}>
          <div style={{ fontWeight: 800, marginBottom: 4 }}>📋 ¿Cómo funciona?</div>
          1. Nos contactas por WhatsApp o correo<br/>
          2. Te enviamos un link con código único<br/>
          3. Completas tus datos<br/>
          4. El admin te aprueba y listo
        </div>
      </div>
    </div>
  );
}

// ── Helper: WhatsApp icon (reused) ──────────────────────────
function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 1.9.7 2.6.8 3.6.6.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.7-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
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

function Spinner() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 0.8s linear infinite' }}>
      <circle cx="12" cy="12" r="9" stroke="rgba(0,0,0,0.15)" strokeWidth="3" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

Object.assign(window, {
  SplashScreen, LoginScreen, NoAccountScreen,
  getSession, saveSession, clearSession, detectRoleFromEmail,
});
