// TuzosJrz — Profile screens (Admin / Coach / Parent)

// ── Shared building blocks ───────────────────────────────────
function ProfileHero({ name, role, photoEntity, photoKind, canEditPhoto, subtitle, hue }) {
  return (
    <div style={{
      background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
      color: '#fff', padding: '54px 20px 28px', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
        backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 16 }}>
        <window.PhotoAvatar
          entityId={photoEntity}
          entityKind={photoKind}
          name={name}
          size={78}
          canEdit={canEditPhoto}
          showRing
          hue={hue}
        />
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>{role.toUpperCase()}</div>
          <div style={{
            fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 2, lineHeight: 1.1,
          }}>{name}</div>
          {subtitle && (
            <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{subtitle}</div>
          )}
        </div>
      </div>
    </div>
  );
}

// Section card with title
function SectionCard({ title, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1,
        textTransform: 'uppercase', margin: '0 4px 8px' }}>{title}</div>
      <div style={{
        background: '#fff', borderRadius: 14, overflow: 'hidden',
        border: '1px solid rgba(15,23,42,0.04)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.04)',
      }}>
        {children}
      </div>
    </div>
  );
}

// Editable field row (tap to edit inline)
function FieldRow({ icon, label, value, storageKey, placeholder, multiline, type = 'text', last, onSave, readOnly, defaultValue }) {
  const persisted = React.useMemo(() => {
    if (!storageKey) return null;
    try { return localStorage.getItem(storageKey); } catch { return null; }
  }, [storageKey]);
  const [val, setVal] = React.useState(persisted ?? value ?? defaultValue ?? '');
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(val);

  const save = () => {
    setVal(draft);
    if (storageKey) { try { localStorage.setItem(storageKey, draft); } catch {} }
    onSave && onSave(draft);
    setEditing(false);
  };
  const cancel = () => { setDraft(val); setEditing(false); };

  return (
    <div style={{
      padding: '12px 14px', display: 'flex', alignItems: multiline ? 'flex-start' : 'center', gap: 12,
      borderBottom: last ? 0 : '1px solid ' + TZ.line,
    }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0,
          marginTop: multiline ? 4 : 0,
        }}>
          <Icon name={icon} size={16} color={TZ.inkSoft} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</div>
        {editing ? (
          multiline ? (
            <textarea autoFocus value={draft} onChange={e => setDraft(e.target.value)} rows={3}
              style={{
                width: '100%', border: '1px solid ' + TZ.primary, borderRadius: 8, padding: 8,
                fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none', marginTop: 4,
                color: TZ.ink,
              }} />
          ) : (
            <input autoFocus type={type} value={draft} onChange={e => setDraft(e.target.value)}
              placeholder={placeholder}
              onKeyDown={e => { if (e.key === 'Enter') save(); if (e.key === 'Escape') cancel(); }}
              style={{
                width: '100%', border: 0, borderBottom: '1.5px solid ' + TZ.primary,
                padding: '3px 0', fontSize: 14, outline: 'none', background: 'transparent',
                color: TZ.ink, marginTop: 2,
              }} />
          )
        ) : (
          <div style={{
            fontSize: 14, color: val ? TZ.ink : TZ.muted, fontWeight: 500, marginTop: 1,
            fontStyle: val ? 'normal' : 'italic',
            overflow: multiline ? 'visible' : 'hidden',
            textOverflow: multiline ? 'clip' : 'ellipsis',
            whiteSpace: multiline ? 'pre-wrap' : 'nowrap',
            lineHeight: multiline ? 1.4 : 'normal',
          }}>
            {val || placeholder || 'Sin datos'}
          </div>
        )}
      </div>
      {!readOnly && (
        editing ? (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={cancel} style={smallBtn('neutral')}>Cancelar</button>
            <button onClick={save} style={smallBtn('primary')}>Guardar</button>
          </div>
        ) : (
          <button onClick={() => { setDraft(val); setEditing(true); }} style={{
            background: 'transparent', border: 0, cursor: 'pointer',
            color: TZ.primary, fontSize: 12, fontWeight: 700, padding: 4, flexShrink: 0,
          }}>Editar</button>
        )
      )}
    </div>
  );
}

// Simple row (label + action right)
function SettingRow({ icon, label, sublabel, right, onClick, last, danger }) {
  return (
    <div onClick={onClick} style={{
      padding: '13px 14px', display: 'flex', alignItems: 'center', gap: 12,
      borderBottom: last ? 0 : '1px solid ' + TZ.line,
      cursor: onClick ? 'pointer' : 'default',
    }}>
      {icon && (
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: danger ? 'rgba(220,38,38,0.1)' : '#EEF0F4',
          color: danger ? TZ.err : TZ.inkSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name={icon} size={16} color={danger ? TZ.err : TZ.inkSoft} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: danger ? TZ.err : TZ.ink, fontWeight: danger ? 700 : 500 }}>{label}</div>
        {sublabel && (
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{sublabel}</div>
        )}
      </div>
      {right !== undefined ? right : onClick && <Icon name="chevron" size={16} color={TZ.muted} />}
    </div>
  );
}

// Toggle switch
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

// Theme segmented picker
function ThemePicker({ value, onChange }) {
  const opts = [
    { id: 'light', label: '☀️ Claro' },
    { id: 'auto',  label: '⚙️ Auto'  },
    { id: 'dark',  label: '🌙 Oscuro' },
  ];
  return (
    <div style={{ display: 'flex', gap: 3, background: '#EEF0F4', borderRadius: 10, padding: 3, minWidth: 190 }}>
      {opts.map(o => (
        <button key={o.id} onClick={() => onChange(o.id)} style={{
          flex: 1, padding: '7px 4px', border: 0, borderRadius: 7,
          background: value === o.id ? '#fff' : 'transparent',
          color: value === o.id ? TZ.ink : TZ.inkSoft,
          fontSize: 11, fontWeight: 700, cursor: 'pointer',
          boxShadow: value === o.id ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
        }}>{o.label}</button>
      ))}
    </div>
  );
}

// Bottom sheet
function BottomSheet({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 44px', maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: TZ.ink }}>{title}</div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="close" size={16} color={TZ.inkSoft} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Common shared sections (Security, App, Support, Critical action)
function CommonSections({ userKey, roleLabel }) {
  const [passOpen, setPassOpen] = React.useState(false);
  const [logoutOpen, setLogoutOpen] = React.useState(false);
  const [logoutAllOpen, setLogoutAllOpen] = React.useState(false);
  const [reportOpen, setReportOpen] = React.useState(false);
  const [downOpen, setDownOpen] = React.useState(false);
  const [faceOn, setFaceOn] = usePersistedState(`tz.settings.${userKey}.faceid`, false);
  const [theme, setTheme] = usePersistedState(`tz.settings.${userKey}.theme`, 'auto');

  return (
    <>
      <SectionCard title="Seguridad">
        <SettingRow icon="doc" label="Cambiar contraseña"
          sublabel="Última actualización: hace 3 meses"
          onClick={() => setPassOpen(true)} />
        <SettingRow icon="check" label="Face ID"
          sublabel="Abrir la app con reconocimiento facial"
          right={<Toggle on={faceOn} onChange={setFaceOn} />} />
        <SettingRow icon="close" label="Cerrar sesión en otros dispositivos"
          sublabel="Solo esta sesión seguirá activa"
          onClick={() => setLogoutAllOpen(true)} last />
      </SectionCard>

      <SectionCard title="Apariencia">
        <SettingRow icon="dot" label="Tema de la app"
          sublabel={theme === 'light' ? 'Siempre claro' : theme === 'dark' ? 'Siempre oscuro' : 'Se adapta al sistema'}
          right={<ThemePicker value={theme} onChange={setTheme} />} last />
      </SectionCard>

      <SectionCard title="Ayuda y soporte">
        <SettingRow icon="phone" label="Contactar al club"
          sublabel="WhatsApp · 771 000 0000"
          onClick={() => window.open('https://wa.me/5217710000000', '_blank')} />
        <SettingRow icon="mail" label="Reportar un problema"
          sublabel="Nos ayuda a mejorar la app"
          onClick={() => setReportOpen(true)} />
        <SettingRow icon="doc" label="Aviso de privacidad y términos"
          onClick={() => setDownOpen(true)} />
        <SettingRow label="Versión de la app"
          right={<span style={{ fontSize: 12, color: TZ.muted, fontWeight: 600 }}>1.0.0 · build 42</span>} last />
      </SectionCard>

      <div style={{ marginTop: 22 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 1,
          textTransform: 'uppercase', margin: '0 4px 8px' }}>Cuenta</div>
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(15,23,42,0.04)', boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)' }}>
          <SettingRow icon="close" label="Cerrar sesión"
            onClick={() => setLogoutOpen(true)} last />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <div style={{
          background: '#fff', borderRadius: 14, overflow: 'hidden',
          border: '1px solid rgba(220,38,38,0.15)',
        }}>
          <SettingRow icon="close" danger label="Solicitar baja del club"
            sublabel="Se envía una notificación al administrador"
            onClick={() => setDownOpen(true)} last />
        </div>
      </div>

      <div style={{ marginTop: 30, textAlign: 'center', color: TZ.muted, fontSize: 11 }}>
        TuzosJrz · Filial oficial del Club Pachuca<br />
        Hecho con 💛💙 para el club
      </div>

      {/* Sheets */}
      <BottomSheet open={passOpen} title="Cambiar contraseña" onClose={() => setPassOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <PasswordInput placeholder="Contraseña actual" />
          <PasswordInput placeholder="Nueva contraseña" />
          <PasswordInput placeholder="Confirmar nueva contraseña" />
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 4, lineHeight: 1.5 }}>
            Mínimo 8 caracteres · Al menos una mayúscula y un número
          </div>
          <button onClick={() => setPassOpen(false)} style={sheetPrimaryBtn}>Guardar contraseña</button>
        </div>
      </BottomSheet>

      <BottomSheet open={logoutOpen} title="Cerrar sesión" onClose={() => setLogoutOpen(false)}>
        <div style={{ fontSize: 14, color: TZ.inkSoft, lineHeight: 1.5, marginBottom: 20 }}>
          ¿Seguro que quieres cerrar sesión en este dispositivo? Tendrás que iniciar sesión de nuevo la próxima vez.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setLogoutOpen(false)} style={sheetSecondaryBtn}>Cancelar</button>
          <button onClick={() => { setLogoutOpen(false); window.tzLogout && window.tzLogout(); }} style={sheetDangerBtn}>Cerrar sesión</button>
        </div>
      </BottomSheet>

      <BottomSheet open={logoutAllOpen} title="Cerrar sesión en otros dispositivos" onClose={() => setLogoutAllOpen(false)}>
        <div style={{ fontSize: 14, color: TZ.inkSoft, lineHeight: 1.5, marginBottom: 16 }}>
          Actualmente hay <strong style={{ color: TZ.ink }}>2 dispositivos activos</strong> con tu cuenta.
        </div>
        <div style={{ background: '#F4F5F8', borderRadius: 10, padding: 12, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: TZ.ink, fontWeight: 700 }}>📱 iPhone 15 · este dispositivo</span>
            <span style={{ color: TZ.ok, fontWeight: 700 }}>Actual</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: TZ.inkSoft }}>💻 Chrome en Windows</span>
            <span style={{ color: TZ.muted }}>Hace 2 días</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => setLogoutAllOpen(false)} style={sheetSecondaryBtn}>Cancelar</button>
          <button onClick={() => setLogoutAllOpen(false)} style={sheetDangerBtn}>Cerrar otras sesiones</button>
        </div>
      </BottomSheet>

      <BottomSheet open={reportOpen} title="Reportar un problema" onClose={() => setReportOpen(false)}>
        <div style={{ fontSize: 12, color: TZ.muted, marginBottom: 10 }}>
          Cuéntanos qué pasó. Recibiremos tu reporte con detalles técnicos automáticos.
        </div>
        <textarea placeholder="Ej. La app se cierra al abrir el chat…" rows={5}
          style={{ width: '100%', border: '1px solid ' + TZ.line, borderRadius: 10, padding: 12,
            fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none', color: TZ.ink }} />
        <button onClick={() => setReportOpen(false)} style={sheetPrimaryBtn}>Enviar reporte</button>
      </BottomSheet>

      <BottomSheet open={downOpen} title="Solicitar baja del club" onClose={() => setDownOpen(false)}>
        <div style={{ fontSize: 14, color: TZ.inkSoft, lineHeight: 1.5, marginBottom: 12 }}>
          Al enviar la solicitud, el administrador del club será notificado y se pondrá en contacto contigo. Tu cuenta sigue activa hasta que el club procese la baja.
        </div>
        <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 6 }}>Motivo (opcional)</div>
        <textarea placeholder="Cuéntanos por qué te vas…" rows={4}
          style={{ width: '100%', border: '1px solid ' + TZ.line, borderRadius: 10, padding: 12,
            fontSize: 14, fontFamily: 'inherit', resize: 'none', outline: 'none', color: TZ.ink }} />
        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={() => setDownOpen(false)} style={sheetSecondaryBtn}>Cancelar</button>
          <button onClick={() => setDownOpen(false)} style={sheetDangerBtn}>Enviar solicitud</button>
        </div>
      </BottomSheet>
    </>
  );
}

function PasswordInput({ placeholder }) {
  const [show, setShow] = React.useState(false);
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 10, padding: '11px 14px',
    }}>
      <input type={show ? 'text' : 'password'} placeholder={placeholder}
        style={{ flex: 1, border: 0, outline: 'none', fontSize: 14, background: 'transparent' }} />
      <button onClick={() => setShow(!show)} style={{
        background: 'transparent', border: 0, cursor: 'pointer', color: TZ.muted, fontSize: 11, fontWeight: 700,
      }}>{show ? 'Ocultar' : 'Ver'}</button>
    </div>
  );
}

function usePersistedState(key, defaultValue) {
  const [val, setVal] = React.useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : defaultValue;
    } catch { return defaultValue; }
  });
  const setter = React.useCallback((v) => {
    setVal(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);
  return [val, setter];
}

// ── ADMIN PROFILE ────────────────────────────────────────────
function AdminProfile() {
  const userKey = 'admin-me';
  return (
    <div style={{ paddingBottom: 100 }}>
      <ProfileHero
        name="Cristian Ordóñez"
        role="Administrador del club"
        subtitle="Coordinador general · TuzosJrz"
        photoEntity="admin-me"
        photoKind="admin"
        canEditPhoto
        hue={220}
      />

      <div style={{ padding: '0 16px' }}>
        <SectionCard title="Mis datos">
          <FieldRow icon="users" label="Nombre completo"
            storageKey={`tz.profile.${userKey}.name`}
            defaultValue="Cristian Ordóñez" />
          <FieldRow icon="tshirt" label="Cargo en el club"
            storageKey={`tz.profile.${userKey}.role`}
            defaultValue="Coordinador general" />
          <FieldRow icon="mail" label="Correo"
            storageKey={`tz.profile.${userKey}.email`}
            defaultValue="cristian@tuzosjrz.mx" type="email" />
          <FieldRow icon="phone" label="Teléfono"
            storageKey={`tz.profile.${userKey}.phone`}
            defaultValue="+52 771 000 0000" type="tel" last />
        </SectionCard>

        <SectionCard title="Datos del club">
          <FieldRow icon="tshirt" label="Nombre del club"
            storageKey="tz.club.name"
            defaultValue="TuzosJrz" />
          <FieldRow icon="doc" label="Dirección"
            storageKey="tz.club.address"
            defaultValue="CAR Pachuca, Zona Plateada" multiline />
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
            borderTop: '1px solid ' + TZ.line }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>🛡️</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>Escudo oficial</div>
              <div style={{ fontSize: 12, color: TZ.ink, marginTop: 2 }}>Usado en headers, chat y reportes</div>
            </div>
            <button style={{
              padding: '7px 12px', borderRadius: 999, border: '1px solid ' + TZ.line,
              background: '#fff', color: TZ.primary, fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>Cambiar</button>
          </div>
        </SectionCard>

        <SectionCard title="Cuenta bancaria para cobros">
          <FieldRow icon="wallet" label="Banco"
            storageKey="tz.bank.name"
            defaultValue="BBVA" />
          <FieldRow icon="wallet" label="Titular"
            storageKey="tz.bank.holder"
            defaultValue="Club TuzosJrz A.C." />
          <FieldRow icon="wallet" label="CLABE"
            storageKey="tz.bank.clabe"
            defaultValue="012 320 00000000000 0" last />
          <div style={{ padding: '10px 14px', background: '#FFFBEB', borderTop: '1px solid #FDE68A',
            fontSize: 11, color: '#78350F', display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span>🔒</span>
            <span>Esta información solo es visible para administradores. Se muestra a los padres al momento del pago.</span>
          </div>
        </SectionCard>

        <CommonSections userKey={userKey} roleLabel="Admin" />
      </div>
    </div>
  );
}

// ── COACH PROFILE ────────────────────────────────────────────
function CoachProfile({ category }) {
  const userKey = 'coach-ramirez';
  return (
    <div style={{ paddingBottom: 100 }}>
      <ProfileHero
        name="Miguel Ramírez"
        role="Entrenador"
        subtitle={`Categoría asignada · ${category || 'Sub-12'}`}
        photoEntity="coach-ramirez"
        photoKind="coach"
        canEditPhoto
        hue={180}
      />

      <div style={{ padding: '0 16px' }}>
        <SectionCard title="Mis datos">
          <FieldRow icon="users" label="Nombre completo"
            storageKey={`tz.profile.${userKey}.name`}
            defaultValue="Miguel Ramírez" />
          <FieldRow icon="mail" label="Correo"
            storageKey={`tz.profile.${userKey}.email`}
            defaultValue="coach.ramirez@tuzosjrz.mx" type="email" />
          <FieldRow icon="phone" label="Teléfono"
            storageKey={`tz.profile.${userKey}.phone`}
            defaultValue="+52 771 111 2233" type="tel" last />
        </SectionCard>

        <SectionCard title="Sobre mí">
          <FieldRow icon="whistle" label="Biografía"
            storageKey={`tz.profile.${userKey}.bio`}
            defaultValue="Entrenador con 8 años de experiencia en formativas. Licenciatura en Ciencias del Deporte, certificado UEFA C."
            multiline last />
        </SectionCard>

        <SectionCard title="Mi categoría">
          <SettingRow icon="users" label={category || 'Sub-12'}
            sublabel="Asignada por el administrador"
            right={<span style={{ fontSize: 11, color: TZ.muted }}>18 jugadores</span>} last />
        </SectionCard>

        <CommonSections userKey={userKey} roleLabel="Coach" />
      </div>
    </div>
  );
}

// ── PARENT PROFILE ───────────────────────────────────────────
function ParentProfile() {
  const userKey = 'parent-carlos';
  const [payOpen, setPayOpen] = React.useState(false);
  return (
    <div style={{ paddingBottom: 100 }}>
      <ProfileHero
        name="Carlos Hernández"
        role="Padre / tutor"
        subtitle="Miembro desde Agosto 2026"
        photoEntity="parent-carlos-hernandez"
        photoKind="parent"
        canEditPhoto
        hue={30}
      />

      <div style={{ padding: '0 16px' }}>
        <SectionCard title="Mis datos">
          <FieldRow icon="users" label="Nombre completo"
            storageKey={`tz.profile.${userKey}.name`}
            defaultValue="Carlos Hernández" />
          <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
            borderTop: '1px solid ' + TZ.line }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="users" size={16} color={TZ.inkSoft} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>Parentesco</div>
              <div style={{ fontSize: 14, color: TZ.ink, marginTop: 2, fontWeight: 500 }}>Padre</div>
            </div>
            <ParentRelationPicker userKey={userKey} />
          </div>
          <FieldRow icon="mail" label="Correo"
            storageKey={`tz.profile.${userKey}.email`}
            defaultValue="carlos.hdz@correo.mx" type="email" />
          <FieldRow icon="phone" label="Teléfono"
            storageKey={`tz.profile.${userKey}.phone`}
            defaultValue="+52 771 234 5678" type="tel" />
          <FieldRow icon="doc" label="Dirección"
            storageKey={`tz.profile.${userKey}.address`}
            defaultValue="Av. Revolución 123, Col. Centro, Pachuca, Hgo."
            multiline last />
        </SectionCard>

        <SectionCard title="Contacto de emergencia">
          <FieldRow icon="users" label="Nombre"
            storageKey={`tz.profile.${userKey}.emgName`}
            defaultValue="María Hernández" />
          <FieldRow icon="phone" label="Teléfono"
            storageKey={`tz.profile.${userKey}.emgPhone`}
            defaultValue="+52 771 987 6543" type="tel" last />
        </SectionCard>

        <SectionCard title="Método de pago guardado">
          <div style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 52, height: 34, borderRadius: 6,
              background: 'linear-gradient(135deg, #1E3A8A, #0F2560)',
              color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800, letterSpacing: 1,
              boxShadow: 'inset 0 -4px 8px rgba(0,0,0,0.2)',
            }}>VISA</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink, fontFamily: 'monospace', letterSpacing: 1 }}>
                •••• •••• •••• 4242
              </div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Vence 12/28 · Predeterminada</div>
            </div>
            <button onClick={() => setPayOpen(true)} style={{
              background: 'transparent', border: 0, cursor: 'pointer',
              color: TZ.primary, fontSize: 12, fontWeight: 700,
            }}>Cambiar</button>
          </div>
          <div style={{ padding: '10px 14px', borderTop: '1px solid ' + TZ.line, background: '#F4F5F8',
            fontSize: 11, color: TZ.muted, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
            <span>🔒</span>
            <span>Guardamos solo los últimos 4 dígitos. Los cobros los procesa la pasarela de pagos del club.</span>
          </div>
        </SectionCard>

        <SectionCard title="Mis hijos vinculados">
          {[
            { id: 1, name: 'Diego Hernández', cat: 'Sub-12', num: 7 },
            { id: 42, name: 'Sofía Hernández', cat: 'Sub-10', num: 10 },
          ].map((c, i) => (
            <div key={c.id} style={{
              padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12,
              borderBottom: i === 0 ? '1px solid ' + TZ.line : 0,
            }}>
              <window.PhotoAvatar
                entityId={`player-${c.id}`}
                entityKind="player"
                name={c.name}
                size={38}
                canEdit={false}
                hue={(c.id * 47) % 360}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{c.name}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{c.cat} · #{c.num}</div>
              </div>
              <Chip tone="ok">Activo</Chip>
            </div>
          ))}
        </SectionCard>

        <CommonSections userKey={userKey} roleLabel="Padre" />
      </div>

      <BottomSheet open={payOpen} title="Cambiar método de pago" onClose={() => setPayOpen(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Número de tarjeta" style={inputStyle} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <input placeholder="MM/AA" style={inputStyle} />
            <input placeholder="CVV" style={inputStyle} />
          </div>
          <input placeholder="Nombre en la tarjeta" style={inputStyle} />
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 4, lineHeight: 1.5 }}>
            🔒 Tus datos viajan cifrados. La pasarela de pagos cumple PCI-DSS.
          </div>
          <button onClick={() => setPayOpen(false)} style={sheetPrimaryBtn}>Guardar tarjeta</button>
        </div>
      </BottomSheet>
    </div>
  );
}

function ParentRelationPicker({ userKey }) {
  const [val, setVal] = usePersistedState(`tz.profile.${userKey}.relation`, 'Padre');
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)} style={{
        background: 'transparent', border: 0, cursor: 'pointer',
        color: TZ.primary, fontSize: 12, fontWeight: 700, padding: 4,
      }}>{val} ▾</button>
      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 4, zIndex: 5,
          background: '#fff', borderRadius: 10, padding: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
        }}>
          {['Padre', 'Madre', 'Tutor'].map(o => (
            <button key={o} onClick={() => { setVal(o); setOpen(false); }} style={{
              display: 'block', padding: '8px 14px', border: 0, background: val === o ? '#EEF0F4' : 'transparent',
              width: 100, textAlign: 'left', borderRadius: 6, fontSize: 13, cursor: 'pointer',
              color: TZ.ink, fontWeight: val === o ? 700 : 500,
            }}>{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Styles ──────────────────────────────────────────────────
const smallBtn = (kind) => ({
  padding: '6px 10px', borderRadius: 8, border: 0, cursor: 'pointer',
  fontSize: 11, fontWeight: 700,
  background: kind === 'primary' ? TZ.primary : '#EEF0F4',
  color: kind === 'primary' ? '#fff' : TZ.inkSoft,
});
const sheetPrimaryBtn = {
  padding: '14px', border: 0, borderRadius: 12, marginTop: 16,
  background: TZ.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(29,61,138,0.35)',
};
const sheetSecondaryBtn = {
  flex: 1, padding: '14px', border: 0, borderRadius: 12,
  background: '#EEF0F4', color: TZ.ink, fontSize: 14, fontWeight: 700, cursor: 'pointer',
};
const sheetDangerBtn = {
  flex: 2, padding: '14px', border: 0, borderRadius: 12,
  background: TZ.err, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer',
  boxShadow: '0 4px 12px rgba(220,38,38,0.35)',
};
const inputStyle = {
  padding: '12px 14px', border: '1px solid #E6E8EE', borderRadius: 10,
  fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff',
};

Object.assign(window, { AdminProfile, CoachProfile, ParentProfile });
