// TuzosJrz — Player documents system
// - 2 required categories (Identification, CURP)
// - 5 legacy documents (kept from Docs tab)
// - Free-form user-named documents (parent uploads with custom name)

// Storage keys per player: tz.docs.player-<id> = [ { id, category, name, fileName, fileType, fileData, uploadedAt, uploadedBy, status, expiresAt } ]

const REQUIRED_DOC_CATEGORIES = [
  {
    id: 'identification',
    label: 'Identificación del deportista',
    hint: 'Pasaporte, credencial del colegio, o INE de menor',
    icon: '🪪',
    required: true,
  },
  {
    id: 'curp',
    label: 'CURP (formato actual)',
    hint: 'Descárgalo en gob.mx/curp',
    icon: '📄',
    required: true,
  },
];

const LEGACY_DOCS = [
  { id: 'ine',           label: 'INE / Acta de nacimiento',  icon: 'doc' },
  { id: 'federativa',    label: 'Ficha federativa',          icon: 'doc' },
  { id: 'autorizacion',  label: 'Autorización tutor',        icon: 'doc' },
  { id: 'medica',        label: 'Constancia médica',         icon: 'medical' },
  { id: 'foto',          label: 'Foto oficial',              icon: 'users' },
];

function getPlayerDocs(playerId) {
  try { return JSON.parse(localStorage.getItem(`tz.docs.player-${playerId}`) || '[]'); }
  catch { return []; }
}
function savePlayerDocs(playerId, docs) {
  try { localStorage.setItem(`tz.docs.player-${playerId}`, JSON.stringify(docs)); } catch {}
  window.dispatchEvent(new CustomEvent('tz-docs-change', { detail: { playerId } }));
}

// Compute completion for the parent's child docs (based on required categories)
function docsCompletionForPlayer(playerId) {
  const docs = getPlayerDocs(playerId);
  const uploaded = new Set(docs.map(d => d.category));
  const total = REQUIRED_DOC_CATEGORIES.length;
  const done = REQUIRED_DOC_CATEGORIES.filter(c => uploaded.has(c.id)).length;
  return { done, total, pct: total > 0 ? Math.round((done / total) * 100) : 100, missing: REQUIRED_DOC_CATEGORIES.filter(c => !uploaded.has(c.id)) };
}

function seedDocsIfEmpty(playerId, someUploaded = true) {
  const existing = getPlayerDocs(playerId);
  if (existing.length > 0) return;
  if (!someUploaded) return;
  // Seed with only Identification uploaded (so CURP is missing) — realistic for demo
  savePlayerDocs(playerId, [
    { id: 'doc-seed-1', category: 'identification', name: 'Identificación', fileName: 'credencial_colegio.jpg', fileType: 'image/jpeg', fileData: null, uploadedAt: '18 Sep 2026', uploadedBy: 'parent', status: 'ok' },
  ]);
}

// ── DocsUploader — the main uploader UI ──────────────────────
function DocsUploader({ playerId, role = 'admin', compact = false, playerName = '' }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const handler = (e) => { if (e.detail?.playerId === playerId) setTick(t => t + 1); };
    window.addEventListener('tz-docs-change', handler);
    return () => window.removeEventListener('tz-docs-change', handler);
  }, [playerId]);

  const docs = React.useMemo(() => getPlayerDocs(playerId), [playerId, tick]);
  const [addingFree, setAddingFree] = React.useState(false);
  const [freeName, setFreeName] = React.useState('');
  const [pendingCategory, setPendingCategory] = React.useState(null);
  const [viewingDoc, setViewingDoc] = React.useState(null);
  const fileRef = React.useRef(null);
  const canDownload = role === 'admin' || role === 'coach' || role === 'parent';

  const completion = docsCompletionForPlayer(playerId);

  const openPicker = (category, name) => {
    setPendingCategory({ category, name });
    fileRef.current?.click();
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file || !pendingCategory) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      // Compress if image
      const process = (dataUrl) => {
        const existing = getPlayerDocs(playerId);
        // Remove old required doc of same category (replace)
        const filtered = REQUIRED_DOC_CATEGORIES.some(c => c.id === pendingCategory.category)
          ? existing.filter(d => d.category !== pendingCategory.category)
          : existing;
        const newDoc = {
          id: 'doc-' + Date.now(),
          category: pendingCategory.category,
          name: pendingCategory.name,
          fileName: file.name,
          fileType: file.type,
          fileData: dataUrl,
          fileSize: file.size,
          uploadedAt: 'Hoy',
          uploadedBy: role,
          status: 'ok', // auto-accept, admin can flag suspicious later
          expiresAt: null,
        };
        savePlayerDocs(playerId, [...filtered, newDoc]);
        // Dispatch a notif for admin
        if (role === 'parent') {
          window.dispatchEvent(new CustomEvent('tz-admin-notif', {
            detail: { kind: 'document', title: 'Nuevo documento subido', body: `El padre subió: ${pendingCategory.name}`, playerId }
          }));
        }
        setPendingCategory(null);
        setFreeName('');
        setAddingFree(false);
      };
      if (file.type.startsWith('image/')) {
        // resize to max 1200px
        const img = new Image();
        img.onload = () => {
          const max = 1200;
          const scale = Math.min(1, max / Math.max(img.width, img.height));
          const w = Math.round(img.width * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          process(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.src = ev.target.result;
      } else {
        process(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const addFreeDoc = () => {
    if (!freeName.trim()) return;
    openPicker('free', freeName.trim());
  };

  const deleteDoc = (docId) => {
    if (!confirm('¿Eliminar este documento?')) return;
    savePlayerDocs(playerId, docs.filter(d => d.id !== docId));
  };

  const canUpload = role === 'parent' || role === 'admin' || role === 'coach';

  const renderDocSlot = (cat, isRequired) => {
    const uploaded = docs.filter(d => d.category === cat.id);
    const doc = uploaded[0];
    return (
      <div key={cat.id} style={{
        background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
        padding: 14, display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: doc ? '#DCFCE7' : (isRequired ? '#FEF3C7' : '#F4F5F8'),
          color: doc ? TZ.ok : (isRequired ? TZ.warn : TZ.inkSoft),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 22, flexShrink: 0,
        }}>{doc ? '✓' : cat.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{cat.label}</span>
            {isRequired && !doc && <Chip tone="warn" size="sm">Requerido</Chip>}
            {doc && <Chip tone="ok" size="sm">Subido</Chip>}
          </div>
          {doc ? (
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>
              {doc.fileName} · Subido {doc.uploadedAt} por {roleLabel(doc.uploadedBy)}
            </div>
          ) : (
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>{cat.hint || 'Sube el documento'}</div>
          )}
        </div>
        {doc && (
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button onClick={() => setViewingDoc(doc)} style={{
              ...smallBtn('neutral'), padding: '6px 9px', background: 'rgba(29,61,138,0.1)', color: TZ.primary,
            }} title="Ver">👁</button>
            {canDownload && (
              <button onClick={() => downloadDoc(doc, playerName)} style={{
                ...smallBtn('neutral'), padding: '6px 9px', background: 'rgba(22,163,74,0.1)', color: TZ.ok,
              }} title="Descargar">⬇</button>
            )}
            {canUpload && (
              <>
                <button onClick={() => openPicker(cat.id, cat.label)} style={smallBtn('neutral')}>
                  Cambiar
                </button>
                {(role === 'admin' || role === 'parent') && (
                  <button onClick={() => deleteDoc(doc.id)} style={{ ...smallBtn('danger'), padding: '5px 8px' }}>×</button>
                )}
              </>
            )}
          </div>
        )}
        {!doc && canUpload && (
          <button onClick={() => openPicker(cat.id, cat.label)} style={{
            padding: '8px 12px', borderRadius: 999, border: 0,
            background: isRequired ? TZ.primary : '#EEF0F4',
            color: isRequired ? '#fff' : TZ.inkSoft,
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            boxShadow: isRequired ? '0 2px 6px rgba(29,61,138,0.3)' : 'none',
            display: 'flex', alignItems: 'center', gap: 4, whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            📎 Subir
          </button>
        )}
      </div>
    );
  };

  const freeDocs = docs.filter(d => d.category === 'free');

  return (
    <div>
      {/* Completion progress (visible for admin/coach; also for parent as feedback) */}
      {!compact && (
        <div style={{
          background: completion.pct === 100 ? '#F0FDF4' : '#FFFBEB',
          border: '1px solid ' + (completion.pct === 100 ? '#BBF7D0' : '#FDE68A'),
          borderRadius: 12, padding: 14, marginBottom: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: 0.6, textTransform: 'uppercase',
                color: completion.pct === 100 ? '#166534' : '#78350F' }}>
                Documentación obligatoria
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink, marginTop: 2 }}>
                {completion.pct === 100
                  ? '✓ Todo completo'
                  : `${completion.done} de ${completion.total} subidos`}
              </div>
            </div>
            <div style={{
              fontSize: 22, fontWeight: 800, letterSpacing: -0.4,
              color: completion.pct === 100 ? TZ.ok : TZ.warn,
            }}>{completion.pct}%</div>
          </div>
          <div style={{ height: 8, borderRadius: 4, background: 'rgba(255,255,255,0.7)', overflow: 'hidden' }}>
            <div style={{
              width: `${completion.pct}%`, height: '100%',
              background: completion.pct === 100 ? TZ.ok : TZ.warn,
              transition: 'width 0.3s',
            }} />
          </div>
          {completion.missing.length > 0 && (
            <div style={{ fontSize: 11, color: '#78350F', marginTop: 8, fontWeight: 600 }}>
              Falta: {completion.missing.map(m => m.label).join(' · ')}
            </div>
          )}
        </div>
      )}

      {/* Bulk download button — only for admin/coach */}
      {(role === 'admin' || role === 'coach') && docs.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <button onClick={() => downloadAllDocsForPlayer(playerId, playerName)} style={{
            width: '100%', padding: '12px 14px', border: 0, borderRadius: 12,
            background: 'linear-gradient(135deg, #F5B301, #E5A300)',
            color: '#0F2560', fontSize: 13, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(245,179,1,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            📦 Descargar todos los documentos (ZIP)
          </button>
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 6, textAlign: 'center' }}>
            Ideal para armar el paquete de inscripción al torneo
          </div>
        </div>
      )}

      {/* Required categories */}
      <SectionTitle>Obligatorios</SectionTitle>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {REQUIRED_DOC_CATEGORIES.map(cat => renderDocSlot(cat, true))}
      </div>

      {/* Free-form documents */}
      <SectionTitle
        action={canUpload ? { label: '+ Añadir', onClick: () => setAddingFree(true) } : null}
      >Otros documentos</SectionTitle>
      {freeDocs.length === 0 && !addingFree ? (
        <div style={{
          background: '#fff', border: '1.5px dashed ' + TZ.line, borderRadius: 12,
          padding: '18px 14px', textAlign: 'center', color: TZ.muted, fontSize: 12,
        }}>
          {canUpload
            ? '¿Autorización de torneo, historial de vacunas, algo más? Añádelo con "+ Añadir".'
            : 'Aún no hay documentos adicionales.'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {freeDocs.map(doc => (
            <div key={doc.id} style={{
              background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
              padding: 14, display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: '#EFF6FF', color: TZ.primary,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
              }}>📎</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>
                  {doc.fileName} · {doc.uploadedAt} · {roleLabel(doc.uploadedBy)}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
                <button onClick={() => setViewingDoc(doc)} style={{
                  ...smallBtn('neutral'), padding: '6px 9px', background: 'rgba(29,61,138,0.1)', color: TZ.primary,
                }} title="Ver">👁</button>
                {canDownload && (
                  <button onClick={() => downloadDoc(doc, playerName)} style={{
                    ...smallBtn('neutral'), padding: '6px 9px', background: 'rgba(22,163,74,0.1)', color: TZ.ok,
                  }} title="Descargar">⬇</button>
                )}
                {canUpload && (
                  <button onClick={() => deleteDoc(doc.id)} style={{ ...smallBtn('danger'), padding: '5px 9px' }}>×</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {addingFree && (
        <div style={{
          marginTop: 8, background: '#fff', border: '2px solid ' + TZ.primary,
          borderRadius: 12, padding: 12,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.5, marginBottom: 6 }}>
            ¿QUÉ DOCUMENTO ES?
          </div>
          <input autoFocus value={freeName} onChange={e => setFreeName(e.target.value)}
            placeholder="Ej. Autorización torneo, cartilla vacunación…"
            style={{
              width: '100%', border: '1px solid ' + TZ.line, borderRadius: 8, padding: '10px 12px',
              fontSize: 14, outline: 'none', fontFamily: 'inherit',
            }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button onClick={() => { setAddingFree(false); setFreeName(''); }} style={{
              flex: 1, padding: 10, borderRadius: 8, border: 0, background: '#EEF0F4',
              color: TZ.ink, fontSize: 13, fontWeight: 700, cursor: 'pointer',
            }}>Cancelar</button>
            <button onClick={addFreeDoc} disabled={!freeName.trim()} style={{
              flex: 2, padding: 10, borderRadius: 8, border: 0,
              background: freeName.trim() ? TZ.primary : '#D5D9E2',
              color: '#fff', fontSize: 13, fontWeight: 700,
              cursor: freeName.trim() ? 'pointer' : 'not-allowed',
            }}>Elegir archivo…</button>
          </div>
        </div>
      )}

      {/* Info footer */}
      <div style={{
        marginTop: 16, padding: '10px 12px', background: '#EFF6FF', border: '1px solid #DBEAFE',
        borderRadius: 8, fontSize: 11, color: '#1E3A8A', lineHeight: 1.5,
      }}>
        📄 Se aceptan imágenes (JPG, PNG) y PDF. En móvil puedes tomar la foto directamente con la cámara.
      </div>

      {/* Hidden file input */}
      <input ref={fileRef} type="file" accept="image/*,application/pdf" capture="environment"
        style={{ display: 'none' }} onChange={handleFile} />

      {/* Document viewer modal */}
      {viewingDoc && <DocViewer doc={viewingDoc} playerName={playerName} onClose={() => setViewingDoc(null)} />}
    </div>
  );
}

function roleLabel(r) {
  return r === 'admin' ? 'Admin' : r === 'coach' ? 'Coach' : r === 'parent' ? 'Padre' : r;
}

function smallBtn(kind) {
  const map = {
    primary: { bg: TZ.primary, fg: '#fff' },
    neutral: { bg: '#EEF0F4', fg: TZ.inkSoft },
    danger: { bg: 'transparent', fg: TZ.err, border: '1px solid ' + TZ.err },
  };
  const t = map[kind] || map.neutral;
  return {
    padding: '6px 10px', borderRadius: 8, border: t.border || 0, cursor: 'pointer',
    fontSize: 12, fontWeight: 700, background: t.bg, color: t.fg,
  };
}

// ── Warning banner for parent home ───────────────────────────
function DocsWarningBanner({ playerId, playerName, onOpen }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const h = () => setTick(t => t + 1);
    window.addEventListener('tz-docs-change', h);
    return () => window.removeEventListener('tz-docs-change', h);
  }, []);

  const completion = React.useMemo(() => docsCompletionForPlayer(playerId), [playerId, tick]);
  if (completion.pct === 100) return null;

  return (
    <div onClick={onOpen} style={{
      background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      border: '1px solid #FCD34D', borderRadius: 14, padding: 14,
      display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', top: -8, right: -6, fontSize: 44, opacity: 0.15 }}>📄</div>
      <div style={{
        width: 44, height: 44, borderRadius: 10, background: '#F5B301', color: '#78350F',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0,
      }}>⚠️</div>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div style={{ fontSize: 11, fontWeight: 800, color: '#78350F', letterSpacing: 0.8 }}>DOCUMENTACIÓN PENDIENTE</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#78350F', marginTop: 2 }}>
          Falta {completion.missing.length === 1 ? completion.missing[0].label : `subir ${completion.missing.length} documentos`}
        </div>
        <div style={{ fontSize: 11, color: '#92400E', marginTop: 3 }}>
          Ayúdanos a tener completa la ficha de {playerName}
        </div>
      </div>
      <div style={{ padding: '6px 10px', borderRadius: 999, background: '#78350F', color: '#F5B301',
        fontSize: 11, fontWeight: 800, flexShrink: 0 }}>Subir →</div>
    </div>
  );
}

// ── Small % bar for admin/coach on player card ──────────────
function DocsProgressPill({ playerId }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const h = (e) => { if (e.detail?.playerId === playerId) setTick(t => t + 1); };
    window.addEventListener('tz-docs-change', h);
    return () => window.removeEventListener('tz-docs-change', h);
  }, [playerId]);
  const c = React.useMemo(() => docsCompletionForPlayer(playerId), [playerId, tick]);
  const tone = c.pct === 100 ? 'ok' : c.pct >= 50 ? 'warn' : 'err';
  const color = tone === 'ok' ? TZ.ok : tone === 'warn' ? TZ.warn : TZ.err;
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <div style={{
        width: 40, height: 6, borderRadius: 3, background: '#EEF0F4', overflow: 'hidden',
      }}>
        <div style={{ width: `${c.pct}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 10, fontWeight: 700, color, minWidth: 28 }}>{c.pct}%</span>
    </div>
  );
}

// ── DOCUMENT VIEWER (modal fullscreen) ───────────────────────
function DocViewer({ doc, playerName, onClose }) {
  if (!doc) return null;
  const isImage = doc.fileType && doc.fileType.startsWith('image/');
  const isPDF = doc.fileType === 'application/pdf';

  const downloadThis = () => downloadDoc(doc, playerName);

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column',
    }}>
      {/* Header */}
      <div style={{
        padding: '54px 16px 14px', background: 'rgba(0,0,0,0.6)',
        display: 'flex', alignItems: 'center', gap: 10, color: '#fff', flexShrink: 0,
      }}>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: '50%', border: 0,
          background: 'rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="close" size={18} color="#fff" />
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.name}</div>
          <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {doc.fileName} · {doc.uploadedAt}
          </div>
        </div>
        <button onClick={downloadThis} style={{
          padding: '8px 12px', border: 0, borderRadius: 999,
          background: '#F5B301', color: '#0F2560', cursor: 'pointer',
          fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          ⬇ Descargar
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: 16, display: 'flex',
        alignItems: 'center', justifyContent: 'center' }}>
        {doc.fileData ? (
          isImage ? (
            <img src={doc.fileData} alt={doc.name}
              style={{ maxWidth: '100%', maxHeight: '100%', display: 'block',
                borderRadius: 4, boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }} />
          ) : isPDF ? (
            <embed src={doc.fileData} type="application/pdf"
              style={{ width: '100%', height: '100%', minHeight: 500, background: '#fff', borderRadius: 4 }} />
          ) : (
            <FilePlaceholder doc={doc} />
          )
        ) : (
          <FilePlaceholder doc={doc} />
        )}
      </div>
    </div>
  );
}

function FilePlaceholder({ doc }) {
  return (
    <div style={{
      background: '#fff', borderRadius: 12, padding: '40px 32px', textAlign: 'center',
      maxWidth: 320, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
    }}>
      <div style={{ fontSize: 64 }}>📄</div>
      <div style={{ fontSize: 16, fontWeight: 700, color: '#0B1220', marginTop: 12 }}>{doc.fileName}</div>
      <div style={{ fontSize: 12, color: '#6B7280', marginTop: 4 }}>
        {doc.fileType || 'archivo'}
      </div>
      <div style={{ fontSize: 11, color: '#6B7280', marginTop: 16, lineHeight: 1.5 }}>
        Este archivo no puede previsualizarse en la app. Descárgalo para abrirlo.
      </div>
    </div>
  );
}

// ── Download helpers ─────────────────────────────────────────
function slugify(s) {
  return (s || '')
    .toString().toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .substring(0, 60);
}

function dataUrlToBlob(dataUrl) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'application/octet-stream';
  const bstr = atob(arr[1]);
  const u8 = new Uint8Array(bstr.length);
  for (let i = 0; i < bstr.length; i++) u8[i] = bstr.charCodeAt(i);
  return new Blob([u8], { type: mime });
}

function extFromMime(mime, fallback = '.bin') {
  if (!mime) return fallback;
  if (mime === 'application/pdf') return '.pdf';
  if (mime === 'image/jpeg') return '.jpg';
  if (mime === 'image/png') return '.png';
  if (mime === 'image/webp') return '.webp';
  if (mime === 'image/gif') return '.gif';
  return fallback;
}

function downloadDoc(doc, playerName) {
  if (!doc.fileData) {
    alert('Este documento es una demo (sin archivo real cargado). En la app real se descargará el archivo original.');
    return;
  }
  const blob = dataUrlToBlob(doc.fileData);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const ext = doc.fileName?.match(/\.[a-z0-9]+$/i)?.[0] || extFromMime(doc.fileType);
  a.href = url;
  a.download = `${slugify(playerName)}_${slugify(doc.name)}${ext}`;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Load JSZip once
let _jszipPromise = null;
function loadJSZip() {
  if (window.JSZip) return Promise.resolve(window.JSZip);
  if (_jszipPromise) return _jszipPromise;
  _jszipPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'assets/jszip.min.js';
    s.onload = () => resolve(window.JSZip);
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return _jszipPromise;
}

async function downloadAllDocsForPlayer(playerId, playerName) {
  const docs = getPlayerDocs(playerId).filter(d => d.fileData);
  if (docs.length === 0) {
    alert('No hay documentos con archivo real para descargar. En la app real cada archivo se guardará y podrás descargarlos aquí.');
    return;
  }
  try {
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    const folder = zip.folder(slugify(playerName) || 'jugador');
    docs.forEach(d => {
      const ext = d.fileName?.match(/\.[a-z0-9]+$/i)?.[0] || extFromMime(d.fileType);
      const name = `${slugify(d.name)}${ext}`;
      folder.file(name, dataUrlToBlob(d.fileData));
    });
    // Also add a small manifest.txt
    const manifest = [
      `TuzosJrz — Documentos de ${playerName}`,
      `Generado: ${new Date().toLocaleString('es-MX')}`,
      '',
      'Archivos incluidos:',
      ...docs.map(d => `  - ${d.name} (${d.fileName}) · subido ${d.uploadedAt} por ${roleLabel(d.uploadedBy)}`),
    ].join('\n');
    folder.file('_manifest.txt', manifest);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TuzosJrz_${slugify(playerName)}_documentos.zip`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    alert('No se pudo generar el ZIP. Intenta descargar documento por documento.');
  }
}

async function downloadDocsForPlayers(playerIds, packageName = 'Torneo') {
  const players = window.TZ_DATA.PLAYERS.filter(p => playerIds.includes(p.id));
  const totalDocs = players.reduce((s, p) => s + getPlayerDocs(p.id).filter(d => d.fileData).length, 0);
  if (totalDocs === 0) {
    alert('Ningún jugador seleccionado tiene documentos con archivo real cargado. En la app real todos los documentos subidos estarán aquí.');
    return;
  }
  try {
    const JSZip = await loadJSZip();
    const zip = new JSZip();
    players.forEach(p => {
      const docs = getPlayerDocs(p.id).filter(d => d.fileData);
      if (docs.length === 0) return;
      const folder = zip.folder(`${slugify(p.name)}_${p.number}`);
      docs.forEach(d => {
        const ext = d.fileName?.match(/\.[a-z0-9]+$/i)?.[0] || extFromMime(d.fileType);
        folder.file(`${slugify(d.name)}${ext}`, dataUrlToBlob(d.fileData));
      });
    });
    const manifest = [
      `TuzosJrz — Paquete: ${packageName}`,
      `Generado: ${new Date().toLocaleString('es-MX')}`,
      `Jugadores incluidos: ${players.length}`,
      `Documentos totales: ${totalDocs}`,
      '',
      'Detalle:',
      ...players.map(p => {
        const docs = getPlayerDocs(p.id).filter(d => d.fileData);
        return `  ${p.name} (#${p.number} · ${p.category}) — ${docs.length} documento(s)`;
      }),
    ].join('\n');
    zip.file('_manifest.txt', manifest);
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `TuzosJrz_${slugify(packageName)}.zip`;
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  } catch (err) {
    alert('No se pudo generar el ZIP.');
  }
}

Object.assign(window, {
  REQUIRED_DOC_CATEGORIES, LEGACY_DOCS,
  getPlayerDocs, savePlayerDocs, docsCompletionForPlayer, seedDocsIfEmpty,
  DocsUploader, DocsWarningBanner, DocsProgressPill,
  DocViewer, downloadDoc, downloadAllDocsForPlayer, downloadDocsForPlayers,
});
