// TuzosJrz — Event detail with edit / cancel / history actions

function EventDetail({ eventId, back, role, coachCategory, onEdit, onStartMatch }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const h = () => setTick(t => t + 1);
    window.addEventListener('tz-events-change', h);
    return () => window.removeEventListener('tz-events-change', h);
  }, []);

  const evt = window.getEvent(eventId);
  const [cancelSheet, setCancelSheet] = React.useState(false);
  const [historyOpen, setHistoryOpen] = React.useState(false);
  const [addToCalOpen, setAddToCalOpen] = React.useState(false);

  if (!evt) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: TZ.muted }}>
        <div style={{ fontSize: 40 }}>🤷</div>
        <div style={{ marginTop: 12, fontSize: 14, fontWeight: 700, color: TZ.ink }}>Evento no encontrado</div>
        <button onClick={back} style={{
          marginTop: 20, padding: '10px 20px', background: TZ.primary, color: '#fff',
          border: 0, borderRadius: 10, cursor: 'pointer', fontWeight: 700,
        }}>Regresar</button>
      </div>
    );
  }

  const isMatch = evt.type === 'match' || evt.type === 'friendly';
  const isCancelled = evt.status === 'cancelled';
  const isModified = evt.status === 'modified';
  const canEdit = role === 'admin' || (role === 'coach' && evt.category === coachCategory);

  const heroBg = isCancelled
    ? 'linear-gradient(155deg, #6B7280 0%, #374151 100%)'
    : isMatch
    ? `linear-gradient(155deg, ${TZ.primaryDark} 0%, #000 100%)`
    : `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`;

  return (
    <div style={{ paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{
        padding: '54px 20px 20px', background: heroBg,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
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
            <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>
              {isMatch ? 'PARTIDO' : evt.type === 'training' ? 'ENTRENAMIENTO' : 'EVENTO'}
              {evt.category ? ` · ${evt.category.toUpperCase()}` : ''}
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, marginTop: 2,
              textDecoration: isCancelled ? 'line-through' : 'none', opacity: isCancelled ? 0.7 : 1 }}>
              {isMatch ? `vs ${evt.rival}` : (evt.title || 'Evento')}
            </div>
          </div>
        </div>

        {/* Status badge */}
        {isCancelled && (
          <div style={{ marginTop: 12, position: 'relative',
            padding: '8px 12px', background: 'rgba(220,38,38,0.25)',
            border: '1px solid rgba(220,38,38,0.5)', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700,
          }}>
            <span>❌</span>
            <div style={{ flex: 1 }}>
              <div>CANCELADO</div>
              {evt.cancelReason && <div style={{ fontSize: 11, opacity: 0.85, fontWeight: 500, marginTop: 2 }}>{evt.cancelReason}</div>}
            </div>
          </div>
        )}
        {isModified && !isCancelled && (
          <div style={{ marginTop: 12, position: 'relative',
            padding: '8px 12px', background: 'rgba(245,179,1,0.25)',
            border: '1px solid rgba(245,179,1,0.5)', borderRadius: 10,
            display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 700, color: '#F5B301',
          }}>
            <span>📝</span>
            <span>MODIFICADO — {new Date(evt.changeHistory[evt.changeHistory.length - 1].at).toLocaleString('es-MX', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        )}
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Details card */}
        <SectionTitle>Detalles</SectionTitle>
        <Card padded={false}>
          {evt.date && (
            <DetailRow icon="calendar" label="Fecha" value={
              new Date(evt.date + 'T' + (evt.matchTime || '10:00')).toLocaleDateString('es-MX',
                { weekday: 'long', day: 'numeric', month: 'long' })
            } />
          )}
          {evt.matchTime && <DetailRow icon="stat" label="Hora del partido" value={evt.matchTime} />}
          {evt.callTime && <DetailRow icon="check" label="Hora de cita (llegada)" value={evt.callTime + ' hrs'} />}
          {evt.dateTime && <DetailRow icon="calendar" label="Fecha y hora"
            value={new Date(evt.dateTime).toLocaleString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })} />}
          {evt.uniform && <DetailRow icon="tshirt" label="Uniforme"
            value={evt.uniform === 'local' ? 'Local (azul)' : 'Visitante (dorado)'} />}
          {evt.location && (
            <DetailRow icon="dot" label="Sede"
              value={evt.location.name}
              sub={evt.location.address}
              action={evt.location.lat && (
                <a href={`https://maps.google.com/?q=${evt.location.lat},${evt.location.lng}`} target="_blank" rel="noopener"
                  style={{ padding: '6px 10px', borderRadius: 999, background: TZ.primary,
                    color: '#fff', fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
                  📍 Cómo llegar
                </a>
              )}
              last={!evt.notes && !evt.convocados && !evt.snackPlayerId} />
          )}
          {evt.notes && <DetailRow icon="doc" label="Notas" value={evt.notes} last={!evt.convocados && !evt.snackPlayerId} />}
          {evt.convocados && Array.isArray(evt.convocados) && (
            <DetailRow icon="users" label="Convocados"
              value={`${evt.convocados.length} jugador${evt.convocados.length !== 1 ? 'es' : ''}`}
              last={!evt.snackPlayerId} />
          )}
          {evt.snackPlayerId && (() => {
            const sp = window.TZ_DATA.PLAYERS.find(p => p.id === evt.snackPlayerId);
            return sp ? <DetailRow icon="dot" label="🍎 Snack" value={sp.name}
              sub={sp.tutor ? `${sp.tutor.name} (${sp.tutor.relation})` : ''} last /> : null;
          })()}
        </Card>

        {/* Change history summary */}
        {evt.changeHistory && evt.changeHistory.length > 1 && (
          <>
            <SectionTitle action={{ label: 'Ver todo', onClick: () => setHistoryOpen(true) }}>
              Historial de cambios
            </SectionTitle>
            <Card>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {evt.changeHistory.slice(-3).reverse().map((h, i) => (
                  <ChangeRow key={i} h={h} />
                ))}
              </div>
            </Card>
          </>
        )}

        {/* Add to calendar — visible para todos los roles */}
        {!isCancelled && (
          <button onClick={() => setAddToCalOpen(true)} style={{
            marginTop: 18, width: '100%',
            padding: '14px', borderRadius: 12, border: '1.5px solid ' + TZ.primary,
            background: '#fff', color: TZ.primary,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            <span style={{ fontSize: 16 }}>📅</span>
            Añadir a mi calendario
          </button>
        )}

        {/* Actions */}
        {canEdit && (
          <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {!isCancelled && isMatch && onStartMatch && (() => {
              // Show "start match" if today or past AND not finished
              const matchState = window.getMatchState && window.getMatchState(evt.id);
              const isFinished = matchState?.phase === 'finished';
              const isInProgress = matchState && matchState.phase !== 'pre' && !isFinished;
              return (
                <button onClick={() => onStartMatch(evt)} style={{
                  padding: '16px', borderRadius: 12, border: 0,
                  background: isInProgress ? '#DC2626' : isFinished ? TZ.inkSoft : '#F5B301',
                  color: isInProgress ? '#fff' : isFinished ? '#fff' : TZ.primaryDark,
                  fontSize: 15, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.5,
                  boxShadow: '0 6px 20px ' + (isInProgress ? 'rgba(220,38,38,0.4)' : 'rgba(245,179,1,0.4)'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 22 }}>{isInProgress ? '🔴' : isFinished ? '📊' : '▶️'}</span>
                  {isInProgress ? 'PARTIDO EN VIVO · Continuar'
                    : isFinished ? `Ver resultado (${matchState.homeScore}-${matchState.awayScore})`
                    : 'INICIAR PARTIDO EN VIVO'}
                </button>
              );
            })()}
            {!isCancelled ? (
              <>
                <button onClick={() => onEdit(evt)} style={{
                  padding: '14px', borderRadius: 12, border: 0,
                  background: TZ.primary, color: '#fff',
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(29,61,138,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Icon name="doc" size={16} color="#fff" />
                  Editar este evento
                </button>
                <button onClick={() => setCancelSheet(true)} style={{
                  padding: '14px', borderRadius: 12, border: '1.5px solid ' + TZ.err,
                  background: '#fff', color: TZ.err,
                  fontSize: 14, fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <Icon name="close" size={16} color={TZ.err} />
                  Cancelar evento
                </button>
              </>
            ) : (
              <button onClick={() => {
                window.reactivateEvent(evt.id, { role, name: role === 'admin' ? 'Admin' : 'Coach' });
              }} style={{
                padding: '14px', borderRadius: 12, border: 0,
                background: TZ.ok, color: '#fff',
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(22,163,74,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <Icon name="check" size={16} color="#fff" />
                Reactivar evento
              </button>
            )}
          </div>
        )}

        {/* Note about notifications */}
        {canEdit && (
          <div style={{
            marginTop: 16, padding: '10px 12px', background: '#EFF6FF',
            border: '1px solid #DBEAFE', borderRadius: 8,
            fontSize: 11, color: '#1E3A8A', lineHeight: 1.5,
          }}>
            🔔 Cualquier cambio o cancelación envía push automático a todos los convocados + mensaje al chat de {evt.category || 'la categoría'}.
          </div>
        )}
      </div>

      {/* Cancel sheet */}
      {cancelSheet && (
        <CancelSheet event={evt} role={role}
          onCancel={(reason) => {
            window.cancelEvent(evt.id, reason, { role, name: role === 'admin' ? 'Admin' : 'Coach' });
            setCancelSheet(false);
          }}
          onClose={() => setCancelSheet(false)} />
      )}

      {/* History sheet */}
      {historyOpen && (
        <HistorySheet event={evt} onClose={() => setHistoryOpen(false)} />
      )}

      {/* Add to calendar sheet */}
      {addToCalOpen && (
        <AddToCalendarSheet event={evt} onClose={() => setAddToCalOpen(false)} />
      )}
    </div>
  );
}

function DetailRow({ icon, label, value, sub, action, last }) {
  return (
    <div style={{ padding: '12px 14px', display: 'flex', alignItems: 'flex-start', gap: 12,
      borderBottom: last ? 0 : '1px solid ' + TZ.line }}>
      {icon && (
        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#EEF0F4',
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.inkSoft, flexShrink: 0 }}>
          <Icon name={icon} size={16} color={TZ.inkSoft} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, color: TZ.ink, fontWeight: 500, marginTop: 1,
          textTransform: label === 'Fecha' ? 'capitalize' : 'none' }}>{value}</div>
        {sub && <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
}

function ChangeRow({ h }) {
  const icon = h.kind === 'created' ? '✨'
    : h.kind === 'edited' ? '📝'
    : h.kind === 'cancelled' ? '❌'
    : h.kind === 'reactivated' ? '✅' : '•';
  const time = new Date(h.at).toLocaleString('es-MX', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
  return (
    <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
      <div style={{ fontSize: 18, flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: TZ.ink, fontWeight: 600, lineHeight: 1.4 }}>
          {h.summary}
        </div>
        <div style={{ fontSize: 10, color: TZ.muted, marginTop: 2 }}>
          {time} · por {h.by?.name || 'Sistema'}
        </div>
        {h.kind === 'edited' && h.changes && h.changes.length > 1 && (
          <div style={{ marginTop: 6, padding: '6px 10px', background: '#F4F5F8',
            borderRadius: 6, fontSize: 11, color: TZ.inkSoft, lineHeight: 1.5 }}>
            {h.changes.map((c, i) => (
              <div key={i}>
                <strong>{c.label}:</strong> <span style={{ color: TZ.err, textDecoration: 'line-through' }}>{c.from}</span> → <span style={{ color: TZ.ok, fontWeight: 600 }}>{c.to}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CancelSheet({ event, role, onCancel, onClose }) {
  const [reason, setReason] = React.useState('');
  const presets = ['Lluvia / mal clima', 'Incomparecencia del rival', 'Falta de árbitros', 'Cambio de programación', 'Otro motivo'];
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: TZ.err, marginBottom: 4 }}>❌ Cancelar evento</div>
        <div style={{ fontSize: 13, color: TZ.inkSoft, marginBottom: 16, lineHeight: 1.5 }}>
          Los convocados recibirán una notificación push + mensaje en el chat de {event.category || 'la categoría'}.
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 8 }}>
          Motivo (opcional)
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {presets.map(p => (
            <button key={p} onClick={() => setReason(p)} style={{
              padding: '6px 12px', borderRadius: 999,
              border: reason === p ? '2px solid ' + TZ.primary : '1px solid ' + TZ.line,
              background: reason === p ? 'rgba(29,61,138,0.05)' : '#fff',
              fontSize: 12, fontWeight: 600, cursor: 'pointer',
              color: reason === p ? TZ.primary : TZ.inkSoft,
            }}>{p}</button>
          ))}
        </div>
        <textarea value={reason} onChange={e => setReason(e.target.value)} rows={2}
          placeholder="Escribe el motivo…"
          style={{ width: '100%', border: '1px solid ' + TZ.line, borderRadius: 10, padding: 10,
            fontSize: 13, fontFamily: 'inherit', resize: 'none', outline: 'none', color: TZ.ink }} />

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>Regresar</button>
          <button onClick={() => onCancel(reason)} style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: TZ.err, color: '#fff', border: 0,
            fontSize: 14, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(220,38,38,0.35)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            ❌ Confirmar cancelación
          </button>
        </div>
      </div>
    </div>
  );
}

function HistorySheet({ event, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink, marginBottom: 4 }}>📜 Historial completo</div>
        <div style={{ fontSize: 12, color: TZ.muted, marginBottom: 16 }}>
          {event.changeHistory.length} entrada{event.changeHistory.length !== 1 ? 's' : ''}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[...event.changeHistory].reverse().map((h, i) => <ChangeRow key={i} h={h} />)}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// ADD TO CALENDAR — 4 opciones: Google, Apple, Outlook, .ics
// ═══════════════════════════════════════════════════════════
function AddToCalendarSheet({ event, onClose }) {
  const [copied, setCopied] = React.useState(false);

  // Generate event data for URL params
  const isMatch = event.type === 'match' || event.type === 'friendly';
  const title = isMatch ? `TuzosJrz vs ${event.rival || 'Rival'}` : (event.title || 'TuzosJrz — Evento');
  const location = event.location?.name
    ? `${event.location.name}${event.location.address ? ' · ' + event.location.address : ''}`
    : '';
  const description = isMatch
    ? `Partido ${event.category || ''} · Cita ${event.callTime || event.matchTime} hrs${event.uniform ? ` · Uniforme ${event.uniform === 'local' ? 'local' : 'visitante'}` : ''}${event.notes ? '\n\n' + event.notes : ''}`
    : (event.notes || '');

  // Compute start / end datetime
  let startDate, endDate;
  if (event.date && event.matchTime) {
    startDate = new Date(`${event.date}T${event.matchTime}:00`);
    endDate = new Date(startDate.getTime() + 90 * 60 * 1000); // 90 min default
  } else if (event.dateTime) {
    startDate = new Date(event.dateTime);
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hr default
  } else {
    startDate = new Date();
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  }

  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`
    + `&text=${encodeURIComponent(title)}`
    + `&dates=${fmt(startDate)}/${fmt(endDate)}`
    + `&details=${encodeURIComponent(description)}`
    + `&location=${encodeURIComponent(location)}`;

  const outlookUrl = `https://outlook.live.com/calendar/0/action/compose?path=/calendar/action/compose&rru=addevent`
    + `&subject=${encodeURIComponent(title)}`
    + `&startdt=${startDate.toISOString()}`
    + `&enddt=${endDate.toISOString()}`
    + `&body=${encodeURIComponent(description)}`
    + `&location=${encodeURIComponent(location)}`;

  const options = [
    { id: 'google',  icon: '🅶', name: 'Google Calendar', sub: 'Web + Android',
      color: '#4285F4', url: gcalUrl },
    { id: 'apple',   icon: '🍎', name: 'Apple Calendar', sub: 'iPhone / iPad / Mac',
      color: '#0F172A', action: 'download' },
    { id: 'outlook', icon: '📮', name: 'Outlook', sub: 'Microsoft / Hotmail',
      color: '#0078D4', url: outlookUrl },
    { id: 'ics',     icon: '⬇️', name: 'Descargar archivo .ics', sub: 'Compatible con cualquier calendario',
      color: '#6B7280', action: 'download' },
  ];

  const handleClick = (opt) => {
    if (opt.action === 'download') {
      // Show success animation (mock — real ics generation would go here)
      setCopied('ics');
      setTimeout(() => setCopied(false), 2000);
    } else if (opt.url) {
      // In real app this opens external URL — in prototype we simulate
      setCopied(opt.id);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '85%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: 'rgba(29,61,138,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>📅</div>
          <div style={{ fontSize: 17, fontWeight: 800, color: TZ.ink, lineHeight: 1.2 }}>Añadir a mi calendario</div>
        </div>
        <div style={{ fontSize: 12, color: TZ.muted, marginBottom: 16, lineHeight: 1.5 }}>
          Guarda este evento en tu calendario personal para recibir recordatorios.
        </div>

        {/* Event preview card */}
        <div style={{
          padding: '12px 14px', background: '#F4F5F8',
          borderRadius: 12, marginBottom: 18,
          borderLeft: '3px solid ' + (isMatch ? '#F5B301' : TZ.primary),
        }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{title}</div>
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
            {startDate.toLocaleString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })}
          </div>
          {location && <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>📍 {location}</div>}
        </div>

        {/* 4 opciones */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {options.map(opt => (
            <button key={opt.id} onClick={() => handleClick(opt)} style={{
              padding: '12px 14px', borderRadius: 12,
              background: copied === opt.id ? TZ.ok + '15' : '#fff',
              border: '1.5px solid ' + (copied === opt.id ? TZ.ok : TZ.line),
              cursor: 'pointer', textAlign: 'left',
              display: 'flex', alignItems: 'center', gap: 12,
              transition: 'all 0.2s',
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: opt.color + '15', color: opt.color,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 20, fontWeight: 800,
              }}>{opt.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{opt.name}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{opt.sub}</div>
              </div>
              {copied === opt.id ? (
                <div style={{
                  padding: '4px 10px', background: TZ.ok, color: '#fff',
                  fontSize: 10, fontWeight: 800, borderRadius: 999, letterSpacing: 0.5,
                }}>✓ ABIERTO</div>
              ) : (
                <span style={{ color: TZ.muted, fontSize: 18 }}>›</span>
              )}
            </button>
          ))}
        </div>

        {/* Tip para suscripción */}
        <div style={{
          marginTop: 18, padding: '12px 14px',
          background: '#EFF6FF', border: '1px solid #DBEAFE',
          borderRadius: 12, display: 'flex', gap: 10,
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>💡</div>
          <div style={{ flex: 1, fontSize: 11, color: '#1E3A8A', lineHeight: 1.5 }}>
            <strong>Consejo:</strong> Si quieres ver TODOS los eventos automáticamente en tu calendario personal, activa la <strong>sincronización completa</strong> desde tu Perfil → Sincronizar calendario.
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EventDetail });
