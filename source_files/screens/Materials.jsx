// TuzosJrz — Training materials catalog + SVGs

const MATERIAL_COLORS = {
  red:    '#DC2626',
  yellow: '#F5B301',
  blue:   '#2563EB',
  green:  '#16A34A',
  orange: '#EA580C',
};
const MATERIAL_COLOR_ORDER = ['red', 'yellow', 'blue', 'green', 'orange'];

// Each material: { id, label, sizeDefault (w,h in pitch %), hasColor, aspectRatio, defaultColor }
const MATERIAL_CATALOG = [
  { id: 'hoop',      label: 'Aro',              w: 4,   h: 4,   hasColor: true,  defaultColor: 'red',    icon: 'HoopIcon' },
  { id: 'hurdle-lo', label: 'Valla baja',       w: 4,   h: 2.5, hasColor: false, icon: 'HurdleLoIcon' },
  { id: 'hurdle-hi', label: 'Valla alta',       w: 4,   h: 3.5, hasColor: false, icon: 'HurdleHiIcon' },
  { id: 'ladder',    label: 'Escalera agilidad',w: 3,   h: 15,  hasColor: false, icon: 'LadderIcon' },
  { id: 'medball',   label: 'Pelota medicinal', w: 3.5, h: 3.5, hasColor: false, icon: 'MedBallIcon' },
  { id: 'ball',      label: 'Balón',            w: 3,   h: 3,   hasColor: false, icon: 'SoccerBallIcon' },
  { id: 'goal',      label: 'Portería pequeña', w: 8,   h: 3,   hasColor: false, icon: 'MiniGoalIcon' },
  { id: 'vest',      label: 'Chaleco',          w: 3.5, h: 4,   hasColor: true,  defaultColor: 'yellow', icon: 'VestIcon' },
  { id: 'disc',      label: 'Plato',            w: 2.5, h: 2.5, hasColor: true,  defaultColor: 'orange', icon: 'DiscIcon' },
  { id: 'zone-r',    label: 'Área (rectángulo)',w: 14,  h: 10,  hasColor: true,  defaultColor: 'yellow', icon: 'ZoneRectIcon', shape: 'rect' },
  { id: 'zone-c',    label: 'Área (círculo)',   w: 10,  h: 10,  hasColor: true,  defaultColor: 'yellow', icon: 'ZoneCircleIcon', shape: 'circle' },
];

// ── SVG icons (fit any container via viewBox) ─────────────
function HoopIcon({ color = '#DC2626', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="16" fill="none" stroke={color} strokeWidth="4" />
      <circle cx="20" cy="20" r="10" fill="none" stroke={color} strokeWidth="1" strokeOpacity="0.4" />
    </svg>
  );
}
function HurdleLoIcon({ color = '#0B1220', size = 24 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 30">
      <rect x="4" y="20" width="4" height="8" fill={color} />
      <rect x="32" y="20" width="4" height="8" fill={color} />
      <rect x="4" y="15" width="32" height="5" fill={color} />
    </svg>
  );
}
function HurdleHiIcon({ color = '#0B1220', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <rect x="4" y="26" width="4" height="12" fill={color} />
      <rect x="32" y="26" width="4" height="12" fill={color} />
      <rect x="4" y="4" width="4" height="22" fill={color} />
      <rect x="32" y="4" width="4" height="22" fill={color} />
      <rect x="4" y="4" width="32" height="5" fill="#F5B301" />
      <rect x="4" y="15" width="32" height="4" fill="#F5B301" />
    </svg>
  );
}
function LadderIcon({ color = '#F5B301', size = 24 }) {
  return (
    <svg width={size * 0.35} height={size} viewBox="0 0 14 80">
      <rect x="1" y="0" width="12" height="80" fill="none" stroke={color} strokeWidth="1.2" />
      {[10, 20, 30, 40, 50, 60, 70].map(y => (
        <line key={y} x1="1" y1={y} x2="13" y2={y} stroke={color} strokeWidth="1.2" />
      ))}
    </svg>
  );
}
function MedBallIcon({ color = '#7C2D12', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill={color} stroke="#0B1220" strokeWidth="1.5" />
      <path d="M6 20 Q 20 14, 34 20" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
      <path d="M6 20 Q 20 26, 34 20" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
      <path d="M20 3 Q 26 20, 20 37" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
      <path d="M20 3 Q 14 20, 20 37" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
    </svg>
  );
}
function SoccerBallIcon({ size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="17" fill="#fff" stroke="#0B1220" strokeWidth="1.5" />
      <polygon points="20,10 26,15 24,22 16,22 14,15" fill="#0B1220" />
      <polygon points="20,10 27,7 30,13 26,15" fill="#0B1220" opacity="0.85" />
      <polygon points="20,10 13,7 10,13 14,15" fill="#0B1220" opacity="0.85" />
      <polygon points="16,22 12,28 18,32 22,29" fill="#0B1220" opacity="0.85" />
    </svg>
  );
}
function MiniGoalIcon({ color = '#fff', size = 24 }) {
  return (
    <svg width={size * 2} height={size * 0.8} viewBox="0 0 80 32">
      <rect x="2" y="4" width="76" height="26" fill="none" stroke={color} strokeWidth="2.4" />
      {/* mesh */}
      {[15, 27, 39, 51, 63, 75].map(x => (
        <line key={x} x1={x} y1="5" x2={x} y2="29" stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
      ))}
      {[10, 16, 22, 28].map(y => (
        <line key={y} x1="3" y1={y} x2="77" y2={y} stroke={color} strokeWidth="0.7" strokeOpacity="0.5" />
      ))}
    </svg>
  );
}
function VestIcon({ color = '#F5B301', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <path d="M10 8 L14 4 L26 4 L30 8 L34 12 L30 16 L30 34 L10 34 L10 16 L6 12 Z"
        fill={color} stroke="#0B1220" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M14 4 L20 10 L26 4" fill="none" stroke="#0B1220" strokeWidth="1.2" />
    </svg>
  );
}
function DiscIcon({ color = '#EA580C', size = 24 }) {
  return (
    <svg width={size} height={size * 0.65} viewBox="0 0 40 26">
      <ellipse cx="20" cy="14" rx="17" ry="7" fill={color} stroke="#0B1220" strokeWidth="1.4" />
      <ellipse cx="20" cy="12" rx="17" ry="7" fill={color} stroke="#0B1220" strokeWidth="1.4" opacity="0.9" />
    </svg>
  );
}
function ZoneRectIcon({ color = '#F5B301', size = 24 }) {
  return (
    <svg width={size} height={size * 0.7} viewBox="0 0 40 28">
      <rect x="3" y="3" width="34" height="22" fill={color + '33'} stroke={color} strokeWidth="2" strokeDasharray="4 3" rx="2" />
    </svg>
  );
}
function ZoneCircleIcon({ color = '#F5B301', size = 24 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40">
      <circle cx="20" cy="20" r="15" fill={color + '33'} stroke={color} strokeWidth="2" strokeDasharray="4 3" />
    </svg>
  );
}

const MATERIAL_ICONS = {
  HoopIcon, HurdleLoIcon, HurdleHiIcon, LadderIcon, MedBallIcon,
  SoccerBallIcon, MiniGoalIcon, VestIcon, DiscIcon, ZoneRectIcon, ZoneCircleIcon,
};

// ── Render material on the pitch (scaled to element w/h in %) ─
function MaterialGlyph({ material, color, sizeMult = 1 }) {
  const Comp = MATERIAL_ICONS[material.icon];
  if (!Comp) return null;
  const c = color ? MATERIAL_COLORS[color] : undefined;
  // Use CSS transform to scale via container; icon renders at 100%
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex',
      alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
      <Comp color={c} size={100} />
    </div>
  );
}

Object.assign(window, {
  MATERIAL_CATALOG, MATERIAL_COLORS, MATERIAL_COLOR_ORDER, MATERIAL_ICONS, MaterialGlyph,
});
