// TuzosJrz — Shared UI atoms

const TZ = {
  primary: 'var(--tz-primary, #1D3D8A)',   // azul Pachuca
  primaryDark: 'var(--tz-primary-dark, #0F2560)',
  ink: '#0B1220',
  inkSoft: '#3B4658',
  muted: '#6B7280',
  line: '#E6E8EE',
  bg: '#F4F5F8',
  card: '#FFFFFF',
  gold: '#F5B301',
  ok: '#16A34A',
  warn: '#F59E0B',
  err: '#DC2626',
};

// Simple stroked icon set — 24x24
function Icon({ name, size = 22, color = 'currentColor', strokeWidth = 1.8 }) {
  const p = { fill: 'none', stroke: color, strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home:      <><path {...p} d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/></>,
    users:     <><circle {...p} cx="9" cy="9" r="3.5"/><path {...p} d="M3 20c.6-3.3 3.2-5 6-5s5.4 1.7 6 5"/><circle {...p} cx="17" cy="7" r="2.5"/><path {...p} d="M15 15c2.5 0 4.4 1.3 5 4"/></>,
    wallet:    <><path {...p} d="M3 7a2 2 0 0 1 2-2h13v4H5a2 2 0 0 0-2 2z"/><path {...p} d="M3 9v9a2 2 0 0 0 2 2h15V9"/><circle {...p} cx="16" cy="14.5" r="1.3" fill={color}/></>,
    check:     <><path {...p} d="M4 12l5 5L20 6"/></>,
    board:     <><rect {...p} x="3" y="4" width="18" height="14" rx="2"/><path {...p} d="M3 11h18M12 4v14"/><circle {...p} cx="12" cy="11" r="1.5"/></>,
    chevron:   <><path {...p} d="M9 6l6 6-6 6"/></>,
    chevronL:  <><path {...p} d="M15 6l-6 6 6 6"/></>,
    plus:      <><path {...p} d="M12 5v14M5 12h14"/></>,
    bell:      <><path {...p} d="M6 8a6 6 0 0 1 12 0v4l1.5 3H4.5L6 12z"/><path {...p} d="M10 19a2 2 0 0 0 4 0"/></>,
    calendar:  <><rect {...p} x="4" y="5" width="16" height="15" rx="2"/><path {...p} d="M4 10h16M9 3v4M15 3v4"/></>,
    dot:       <><circle cx="12" cy="12" r="4" fill={color}/></>,
    medical:   <><path {...p} d="M10 3h4v4h4v4h-4v4h-4v-4H6V7h4z"/></>,
    phone:     <><path {...p} d="M4 5c0-1 1-2 2-2h2l2 4-2 2a12 12 0 0 0 6 6l2-2 4 2v2c0 1-1 2-2 2A16 16 0 0 1 4 5z"/></>,
    mail:      <><rect {...p} x="3" y="5" width="18" height="14" rx="2"/><path {...p} d="M3 7l9 7 9-7"/></>,
    search:    <><circle {...p} cx="11" cy="11" r="6"/><path {...p} d="M20 20l-4-4"/></>,
    filter:    <><path {...p} d="M4 5h16l-6 8v6l-4-2v-4z"/></>,
    doc:       <><path {...p} d="M6 3h9l4 4v14a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path {...p} d="M14 3v5h5M8 13h8M8 17h6"/></>,
    swap:      <><path {...p} d="M4 8h13l-3-3M20 16H7l3 3"/></>,
    play:      <><path {...p} d="M7 5l12 7-12 7z" fill={color}/></>,
    close:     <><path {...p} d="M6 6l12 12M18 6L6 18"/></>,
    stat:      <><path {...p} d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
    tshirt:    <><path {...p} d="M7 4l3-1 2 2 2-2 3 1 3 3-3 3v10H7V10L4 7z"/></>,
    whistle:   <><circle {...p} cx="9" cy="14" r="5"/><path {...p} d="M14 12l6-4v6"/></>,
    money:     <><rect {...p} x="3" y="6" width="18" height="12" rx="2"/><circle {...p} cx="12" cy="12" r="2.5"/><path {...p} d="M6 10v4M18 10v4"/></>,
    receipt:   <><path {...p} d="M6 3h12v18l-2-1.5L14 21l-2-1.5L10 21l-2-1.5L6 21z"/><path {...p} d="M9 8h6M9 12h6M9 16h4"/></>,
    user:      <><circle {...p} cx="12" cy="8" r="4"/><path {...p} d="M4 21c0-4 4-7 8-7s8 3 8 7"/></>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>{paths[name] || null}</svg>;
}

// Avatar with number badge — reads photo from localStorage automatically.
// For upload UI, use <PhotoAvatar> directly (in profile heros).
function Avatar({ player, size = 44, showNumber = true }) {
  const initials = player ? `${player.first[0]}${player.last[0]}` : '?';
  const hue = player ? (player.id * 47) % 360 : 200;
  const storageKey = player ? `tz.photo.player-${player.id}` : null;

  const [photo, setPhoto] = React.useState(() => {
    if (!storageKey) return null;
    try { return localStorage.getItem(storageKey); } catch { return null; }
  });
  React.useEffect(() => {
    if (!storageKey) return;
    const handler = (e) => { if (e.detail?.storageKey === storageKey) setPhoto(e.detail.photo); };
    window.addEventListener('tz-photo-change', handler);
    return () => window.removeEventListener('tz-photo-change', handler);
  }, [storageKey]);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden',
        background: photo ? '#000' : `linear-gradient(135deg, hsl(${hue} 55% 55%), hsl(${(hue+40)%360} 60% 40%))`,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.38, letterSpacing: -0.3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15), inset 0 -6px 12px rgba(0,0,0,0.15)',
      }}>
        {photo
          ? <img src={photo} alt={player?.name || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : initials}
      </div>
      {showNumber && player && (
        <div style={{
          position: 'absolute', bottom: -3, right: -3,
          minWidth: 20, height: 20, padding: '0 5px', borderRadius: 10,
          background: TZ.ink, color: '#fff',
          fontFamily: '"Barlow Condensed", Impact, sans-serif',
          fontWeight: 700, fontSize: 13,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff', letterSpacing: 0.3,
        }}>{player.number}</div>
      )}
    </div>
  );
}

// Colored pill / chip
function Chip({ children, tone = 'neutral', size = 'sm' }) {
  const tones = {
    neutral: { bg: '#EEF0F4', fg: TZ.inkSoft },
    ok:      { bg: '#DCFCE7', fg: '#166534' },
    warn:    { bg: '#FEF3C7', fg: '#92400E' },
    err:     { bg: '#FEE2E2', fg: '#991B1B' },
    info:    { bg: '#DBEAFE', fg: '#1E40AF' },
    brand:   { bg: 'rgba(29,61,138,0.10)', fg: TZ.primary },
    gold:    { bg: '#FEF3C7', fg: '#7C4A03' },
    dark:    { bg: TZ.ink, fg: '#fff' },
  };
  const t = tones[tone] || tones.neutral;
  const pad = size === 'md' ? '5px 10px' : '3px 8px';
  const fs = size === 'md' ? 12 : 11;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: pad, borderRadius: 999, background: t.bg, color: t.fg,
      fontSize: fs, fontWeight: 600, letterSpacing: 0.1, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}

function StatusDot({ tone = 'ok', size = 8 }) {
  const map = { ok: TZ.ok, warn: TZ.warn, err: TZ.err, muted: TZ.muted };
  return <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', background: map[tone] || TZ.muted }} />;
}

// Card
function Card({ children, style = {}, onClick, padded = true }) {
  return (
    <div onClick={onClick} style={{
      background: TZ.card, borderRadius: 16,
      boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.04)',
      border: '1px solid rgba(15,23,42,0.04)',
      padding: padded ? 16 : 0, cursor: onClick ? 'pointer' : 'default',
      ...style,
    }}>{children}</div>
  );
}

function SectionTitle({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '18px 4px 8px' }}>
      <h3 style={{ margin: 0, fontSize: 13, fontWeight: 700, color: TZ.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase' }}>{children}</h3>
      {action && <button onClick={action.onClick} style={{
        background: 'transparent', border: 0, padding: 0, color: TZ.primary,
        fontSize: 13, fontWeight: 600, cursor: 'pointer',
      }}>{action.label}</button>}
    </div>
  );
}

function CategoryChipRow({ value, onChange, categories }) {
  return (
    <div style={{ display: 'flex', gap: 8, overflowX: 'auto', padding: '4px 0 8px', margin: '0 -16px', paddingLeft: 16, paddingRight: 16 }}>
      {['Todos', ...categories].map(c => {
        const active = value === c;
        return (
          <button key={c} onClick={() => onChange(c)} style={{
            padding: '8px 14px', borderRadius: 999, border: 0, whiteSpace: 'nowrap',
            background: active ? TZ.ink : '#fff',
            color: active ? '#fff' : TZ.inkSoft,
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
            boxShadow: active ? 'none' : '0 1px 2px rgba(15,23,42,0.06)',
            border: active ? 0 : '1px solid ' + TZ.line,
          }}>{c}</button>
        );
      })}
    </div>
  );
}

// Simple bottom tab bar
function TabBar({ tab, onChange }) {
  const items = [
    { id: 'home',     label: 'Inicio',    icon: 'home' },
    { id: 'players',  label: 'Jugadores', icon: 'users' },
    { id: 'payments', label: 'Pagos',     icon: 'wallet' },
    { id: 'attend',   label: 'Asistencia',icon: 'check' },
    { id: 'profile',  label: 'Perfil',    icon: 'user' },
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

// Screen header — matches Pachuca energy
function ScreenHeader({ title, subtitle, right, dark = false, compact = false }) {
  return (
    <div style={{
      padding: compact ? '52px 20px 12px' : '58px 20px 18px',
      background: dark ? `linear-gradient(160deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)` : 'transparent',
      color: dark ? '#fff' : TZ.ink,
      display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
      gap: 12, position: 'relative', overflow: 'hidden',
    }}>
      {dark && (
        // Subtle diagonal stripes texture (Pachuca-ish)
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)',
        }} />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {subtitle && <div style={{ fontSize: 12, fontWeight: 600, letterSpacing: 1.2, textTransform: 'uppercase', opacity: dark ? 0.8 : 0.55 }}>{subtitle}</div>}
        <h1 style={{ margin: subtitle ? '4px 0 0' : 0, fontSize: 28, fontWeight: 800, letterSpacing: -0.6 }}>{title}</h1>
      </div>
      {right && <div style={{ position: 'relative', zIndex: 1 }}>{right}</div>}
    </div>
  );
}

Object.assign(window, {
  TZ, Icon, Avatar, Chip, StatusDot, Card, SectionTitle, CategoryChipRow, TabBar, ScreenHeader,
});
