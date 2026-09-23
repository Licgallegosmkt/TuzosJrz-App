// TuzosJrz — PhotoAvatar: shows a profile photo (persisted in localStorage)
// with a fallback initials avatar. If `canEdit` is true, shows a camera badge
// to upload/change the photo.

function PhotoAvatar({
  entityId,          // unique key like "player-7" or "parent-carlos" — persistence key
  entityKind = 'player', // 'player' | 'parent' | 'coach'
  name,              // "Diego Hernández" for initials fallback + alt
  size = 60,
  canEdit = false,   // whether current role can change this photo
  hue,               // optional deterministic hue for fallback gradient
  showRing = false,  // subtle ring around (used in profile hero)
  numberBadge,       // optional shirt number to overlay
  onChange,          // callback(url) when photo changes
}) {
  const storageKey = `tz.photo.${entityId}`;
  const [photo, setPhoto] = React.useState(() => {
    try { return localStorage.getItem(storageKey); } catch { return null; }
  });
  const fileInputRef = React.useRef(null);

  // Listen for photo changes from other places using the same entityId
  React.useEffect(() => {
    const handler = (e) => {
      if (e.detail?.storageKey === storageKey) setPhoto(e.detail.photo);
    };
    window.addEventListener('tz-photo-change', handler);
    return () => window.removeEventListener('tz-photo-change', handler);
  }, [storageKey]);

  const initials = React.useMemo(() => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return (parts[0][0] + (parts[1]?.[0] || '')).toUpperCase();
  }, [name]);

  // Deterministic gradient from name/id
  const hueVal = hue ?? (
    (entityId || name || '').split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7)
  );

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Resize to max 400px to keep localStorage light
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const max = 400;
        const scale = Math.min(1, max / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w; canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, w, h);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        try { localStorage.setItem(storageKey, dataUrl); } catch {}
        setPhoto(dataUrl);
        window.dispatchEvent(new CustomEvent('tz-photo-change', { detail: { storageKey, photo: dataUrl } }));
        onChange && onChange(dataUrl);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const openPicker = () => fileInputRef.current?.click();

  const ringSize = showRing ? 4 : 0;
  const badgeSize = Math.max(18, size * 0.28);

  return (
    <div style={{
      position: 'relative',
      width: size + ringSize * 2, height: size + ringSize * 2,
      flexShrink: 0,
    }}>
      {showRing && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: '50%',
          border: '2.5px solid rgba(245,179,1,0.7)',
        }} />
      )}
      <div style={{
        position: 'absolute', top: ringSize, left: ringSize,
        width: size, height: size, borderRadius: '50%',
        overflow: 'hidden',
        background: photo ? '#000' : `linear-gradient(135deg, hsl(${hueVal} 55% 55%), hsl(${(hueVal + 40) % 360} 60% 40%))`,
        color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: 700, fontSize: size * 0.38, letterSpacing: -0.3,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15), inset 0 -6px 12px rgba(0,0,0,0.15)',
      }}>
        {photo ? (
          <img src={photo} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span>{initials}</span>
        )}
      </div>

      {/* Number badge (for players) */}
      {numberBadge != null && (
        <div style={{
          position: 'absolute', bottom: -2, right: -2,
          minWidth: badgeSize, height: badgeSize, padding: `0 ${badgeSize * 0.28}px`,
          borderRadius: badgeSize / 2,
          background: '#0B1220', color: '#fff',
          fontFamily: '"Barlow Condensed", Impact, sans-serif',
          fontWeight: 700, fontSize: badgeSize * 0.62,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '2px solid #fff', letterSpacing: 0.3, zIndex: 3,
        }}>{numberBadge}</div>
      )}

      {/* Edit camera button */}
      {canEdit && (
        <>
          <button onClick={openPicker} title="Cambiar foto" style={{
            position: 'absolute', bottom: -2, right: numberBadge != null ? undefined : -2,
            left: numberBadge != null ? -2 : undefined,
            width: badgeSize, height: badgeSize, borderRadius: '50%',
            background: 'var(--tz-primary, #1D3D8A)', color: '#fff', border: '2px solid #fff',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(0,0,0,0.25)', padding: 0, zIndex: 4,
          }}>
            <svg width={badgeSize * 0.55} height={badgeSize * 0.55} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={handleFile} />
        </>
      )}
    </div>
  );
}

// Helper — check permission for the current role
function canEditPhoto(role, entityKind) {
  if (entityKind === 'player') return role === 'admin' || role === 'coach';
  if (entityKind === 'parent') return role === 'parent'; // parent edits own
  if (entityKind === 'coach') return role === 'coach' || role === 'admin';
  if (entityKind === 'admin') return role === 'admin';
  return false;
}

Object.assign(window, { PhotoAvatar, canEditPhoto });
