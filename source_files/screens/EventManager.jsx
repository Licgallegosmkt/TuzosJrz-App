// TuzosJrz — Event manager: CRUD + changes + notifications
// Stores events created by admin/coach in localStorage, tracks change history,
// and dispatches notifications automatically.

// Storage: tz.events = [{ id, ...data, status, changeHistory }]

function getAllEvents() {
  try { return JSON.parse(localStorage.getItem('tz.events') || '[]'); }
  catch { return []; }
}
function saveAllEvents(list) {
  try { localStorage.setItem('tz.events', JSON.stringify(list)); } catch {}
  window.dispatchEvent(new CustomEvent('tz-events-change'));
}
function getEvent(id) { return getAllEvents().find(e => e.id === id); }

function createEvent(data, createdBy = { role: 'admin', name: 'Admin' }) {
  const evt = {
    id: 'evt-' + Date.now(),
    ...data,
    status: 'scheduled',
    createdBy,
    createdAt: Date.now(),
    changeHistory: [{
      kind: 'created', at: Date.now(), by: createdBy, summary: 'Evento creado',
    }],
  };
  saveAllEvents([evt, ...getAllEvents()]);
  broadcast(evt, 'created');
  return evt;
}

function updateEvent(id, changes, editedBy = { role: 'admin', name: 'Admin' }) {
  const list = getAllEvents();
  const idx = list.findIndex(e => e.id === id);
  if (idx < 0) return null;
  const prev = list[idx];
  const diff = computeDiff(prev, changes);
  if (diff.length === 0) return prev;
  const updated = {
    ...prev,
    ...changes,
    status: 'modified',
    changeHistory: [
      ...(prev.changeHistory || []),
      { kind: 'edited', at: Date.now(), by: editedBy, changes: diff, summary: summarizeDiff(diff) },
    ],
  };
  list[idx] = updated;
  saveAllEvents(list);
  broadcast(updated, 'modified', diff);
  return updated;
}

function cancelEvent(id, reason, cancelledBy = { role: 'admin', name: 'Admin' }) {
  const list = getAllEvents();
  const idx = list.findIndex(e => e.id === id);
  if (idx < 0) return null;
  const prev = list[idx];
  const updated = {
    ...prev,
    status: 'cancelled',
    cancelReason: reason,
    cancelledAt: Date.now(),
    changeHistory: [
      ...(prev.changeHistory || []),
      { kind: 'cancelled', at: Date.now(), by: cancelledBy, reason, summary: 'Evento cancelado' + (reason ? ` — ${reason}` : '') },
    ],
  };
  list[idx] = updated;
  saveAllEvents(list);
  broadcast(updated, 'cancelled', null, reason);
  return updated;
}

function reactivateEvent(id, by = { role: 'admin', name: 'Admin' }) {
  const list = getAllEvents();
  const idx = list.findIndex(e => e.id === id);
  if (idx < 0) return null;
  const prev = list[idx];
  const updated = {
    ...prev,
    status: 'scheduled',
    cancelReason: null,
    cancelledAt: null,
    changeHistory: [
      ...(prev.changeHistory || []),
      { kind: 'reactivated', at: Date.now(), by, summary: 'Evento reactivado' },
    ],
  };
  list[idx] = updated;
  saveAllEvents(list);
  broadcast(updated, 'reactivated');
  return updated;
}

// ── Diff calculation ────────────────────────────────────────
const FIELD_LABELS = {
  date: 'Fecha',
  matchTime: 'Hora del partido',
  callTime: 'Hora de cita',
  location: 'Sede',
  rival: 'Rival',
  uniform: 'Uniforme',
  notes: 'Notas',
  category: 'Categoría',
  dateTime: 'Fecha y hora',
  title: 'Título',
  convocados: 'Convocatoria',
  snackPlayerId: 'Snack',
};

function computeDiff(prev, next) {
  const diff = [];
  Object.keys(next).forEach(key => {
    if (key === 'changeHistory' || key === 'status') return;
    const prevVal = prev[key];
    const nextVal = next[key];
    if (JSON.stringify(prevVal) === JSON.stringify(nextVal)) return;
    diff.push({
      field: key,
      label: FIELD_LABELS[key] || key,
      from: formatValue(key, prevVal),
      to: formatValue(key, nextVal),
    });
  });
  return diff;
}

function formatValue(key, val) {
  if (val == null) return '—';
  if (key === 'location' && typeof val === 'object') return val.name || val.address || '—';
  if (key === 'uniform') return val === 'local' ? 'Local (azul)' : val === 'away' ? 'Visitante (dorado)' : val;
  if (key === 'convocados' && Array.isArray(val)) return `${val.length} jugador${val.length !== 1 ? 'es' : ''}`;
  if (key === 'snackPlayerId') {
    const p = window.TZ_DATA?.PLAYERS?.find(x => x.id === val);
    return p ? p.name : '—';
  }
  return String(val);
}

function summarizeDiff(diff) {
  if (diff.length === 0) return 'Sin cambios';
  if (diff.length === 1) return `${diff[0].label}: ${diff[0].from} → ${diff[0].to}`;
  return `${diff.length} campos modificados: ${diff.map(d => d.label).join(', ')}`;
}

// ── Broadcast: dispatch push + chat + notification ──────────
function broadcast(evt, action, diff, reason) {
  const isMatch = evt.type === 'match' || evt.type === 'friendly';
  const label = isMatch ? `vs ${evt.rival}` : (evt.title || 'evento');
  const category = evt.category ? ` · ${evt.category}` : '';

  let title, body;
  if (action === 'created') {
    title = isMatch ? '⚽ Nuevo partido' : '📅 Nuevo evento';
    body = `${label}${category}`;
  } else if (action === 'modified') {
    title = '📝 Cambio en el evento';
    const summary = diff && diff.length ? summarizeDiff(diff) : 'Se hicieron cambios';
    body = `${label}${category}\n${summary}`;
  } else if (action === 'cancelled') {
    title = '❌ Evento cancelado';
    body = `${label}${category}${reason ? `\nMotivo: ${reason}` : ''}`;
  } else if (action === 'reactivated') {
    title = '✅ Evento reactivado';
    body = `${label}${category}`;
  }

  // 1. Push mock (aparece bajando desde arriba)
  window.dispatchEvent(new CustomEvent('tz-push', {
    detail: { title, body, kind: 'event', eventId: evt.id, action },
  }));

  // 2. Persistir mensaje del sistema en el chat de la categoría
  const chatId = 'grp-' + evt.category;
  try {
    const key = 'tz.chatMsgs.' + chatId;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    const sysMsg = {
      id: 'sys-' + Date.now(),
      author: 'Sistema TuzosJrz',
      role: 'admin',
      text: `${title}\n${label}${category}${diff && diff.length ? '\n\n' + diff.map(d => `• ${d.label}: ${d.from} → ${d.to}`).join('\n') : ''}${reason ? `\n\nMotivo: ${reason}` : ''}`,
      at: 'ahora',
      mine: false,
      system: true,
    };
    localStorage.setItem(key, JSON.stringify([...existing, sysMsg]));
    window.dispatchEvent(new CustomEvent('tz-chat-broadcast', { detail: { chatId, msg: sysMsg } }));
  } catch {}
}

// ── Get upcoming (helper for widgets) ───────────────────────
function getUpcomingEvents(category, limit = 5) {
  const list = getAllEvents().filter(e =>
    e.status !== 'cancelled' &&
    (!category || e.category === category || e.category === 'Todas')
  );
  return list.slice(0, limit);
}

Object.assign(window, {
  getAllEvents, saveAllEvents, getEvent,
  createEvent, updateEvent, cancelEvent, reactivateEvent,
  computeDiff, summarizeDiff, formatValue, FIELD_LABELS,
  getUpcomingEvents,
});
