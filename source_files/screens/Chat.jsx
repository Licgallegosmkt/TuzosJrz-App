// TuzosJrz — Chat module: category groups + DMs + admin supervision

const CATEGORY_GROUP_MSGS = {
  'Sub-12': [
    { id: 1, author: 'Coach Ramírez', role: 'coach', text: 'Buenas tardes familias 👋 Recordatorio: mañana entrenamiento a las 17:00 en Cancha 2.', at: '10:22', mine: false },
    { id: 2, author: 'Carlos Hernández', role: 'parent', text: '¡Enterado coach! Diego va a estar.', at: '10:24', mine: false },
    { id: 3, author: 'María López', role: 'parent', text: '¿Se llevan espinilleras?', at: '10:28', mine: false },
    { id: 4, author: 'Coach Ramírez', role: 'coach', text: 'Sí, espinilleras siempre 👍 Y botella extra de agua.', at: '10:30', mine: false },
    { id: 5, author: 'Coach Ramírez', role: 'coach', text: '📅 Recordatorio: partido vs Tigres Jr. el sábado 26 a las 10:30 en el Estadio Hidalgo.', at: '11:02', mine: false, pinned: true },
    { id: 6, author: 'Jorge Torres', role: 'parent', text: 'Nosotros vamos directo al estadio, ¿está bien?', at: '11:15', mine: false },
    { id: 7, author: 'Coach Ramírez', role: 'coach', text: 'Perfecto Jorge, cita 09:30 en el acceso norte.', at: '11:16', mine: false },
    { id: 8, author: 'Ana Mendoza', role: 'parent', text: 'Iker va a llegar 10 min tarde mañana, viene de terapia.', at: '13:40', mine: false },
    { id: 9, author: 'Coach Ramírez', role: 'coach', text: 'Sin problema Ana, gracias por avisar 🙏', at: '13:41', mine: false },
  ],
};

// ── Reacciones disponibles ─────────────────────────────────
const AVAILABLE_REACTIONS = ['👍', '❤️', '🎉', '🙏', '🔥'];

// Storage helpers para reacciones por mensaje
function reactionsKey(chatId, msgId) { return `tz.reactions.${chatId}.${msgId}`; }
function getReactions(chatId, msgId) {
  try { return JSON.parse(localStorage.getItem(reactionsKey(chatId, msgId)) || '{}'); }
  catch { return {}; }
}
function saveReactions(chatId, msgId, reactions) {
  try { localStorage.setItem(reactionsKey(chatId, msgId), JSON.stringify(reactions)); } catch {}
  window.dispatchEvent(new CustomEvent('tz-reactions-change', { detail: { chatId, msgId, reactions } }));
}
function toggleReaction(chatId, msgId, emoji, userId = 'me') {
  const r = getReactions(chatId, msgId);
  r[emoji] = r[emoji] || { count: 0, users: [] };
  const idx = r[emoji].users.indexOf(userId);
  if (idx >= 0) {
    r[emoji].users.splice(idx, 1);
    r[emoji].count = Math.max(0, r[emoji].count - 1);
    if (r[emoji].count === 0) delete r[emoji];
  } else {
    r[emoji].users.push(userId);
    r[emoji].count += 1;
  }
  saveReactions(chatId, msgId, r);
}

// ── Mensajes seed para el canal de anuncios ────────────────
const ANNOUNCE_MSGS = [
  { id: 1, author: 'Admin TuzosJrz', role: 'admin', text: '📅 A partir del 1 de octubre, los entrenamientos de Sub-10 y Sub-12 cambian de horario:\n\n• Sub-10 → 16:00 (antes 17:00)\n• Sub-12 → 18:00 (antes 17:00)\n\nGracias.', at: 'Vie 10:00', mine: false, seedReactions: { '👍': { count: 18, users: ['u1','u2'] }, '🙏': { count: 6, users: [] } } },
  { id: 2, author: 'Admin TuzosJrz', role: 'admin', text: '⛈️ Se cancelan entrenamientos de HOY por lluvia. Nos vemos mañana en horario normal.', at: 'Mié 14:22', mine: false, seedReactions: { '👍': { count: 24, users: [] }, '❤️': { count: 3, users: [] } } },
  { id: 3, author: 'Admin TuzosJrz', role: 'admin', text: '🏆 ¡GANAMOS EL TORNEO INTERFILIAL! Felicidades a Sub-14 por vencer 3-1 a Rayados Jr. Orgullosos del equipo 💛💙', at: 'Lun 20:15', mine: false, seedReactions: { '🎉': { count: 42, users: [] }, '🔥': { count: 28, users: [] }, '❤️': { count: 19, users: [] } } },
  { id: 4, author: 'Admin TuzosJrz', role: 'admin', text: '💰 Recordatorio: cuotas de septiembre vencen el día 5. Pueden pagar desde la app con tarjeta, SPEI o transferencia. Gracias.', at: '2 Sep 09:00', mine: false, seedReactions: { '👍': { count: 12, users: [] } } },
];

// Seed reacciones si vacías
function seedAnnounceReactions() {
  ANNOUNCE_MSGS.forEach(m => {
    const existing = getReactions('club-broadcast', m.id);
    if (Object.keys(existing).length === 0 && m.seedReactions) {
      saveReactions('club-broadcast', m.id, m.seedReactions);
    }
  });
}

const DM_MSGS = {
  'coach-ramirez': [
    { id: 1, author: 'Coach Ramírez', role: 'coach', text: 'Hola, quería comentarte sobre Diego. Ha tenido excelente actitud últimamente.', at: 'Ayer 18:22', mine: false },
    { id: 2, author: 'Yo', role: 'parent', text: 'Muchas gracias coach, en casa también lo notamos motivado.', at: 'Ayer 19:05', mine: true },
    { id: 3, author: 'Coach Ramírez', role: 'coach', text: 'Me gustaría probarlo unos minutos como delantero centro el sábado. ¿Alguna observación?', at: 'Ayer 19:08', mine: false },
    { id: 4, author: 'Yo', role: 'parent', text: '¡Adelante! Él está encantado. Solo cuídalo, viene saliendo de un esguince pequeño.', at: 'Ayer 19:15', mine: true },
    { id: 5, author: 'Coach Ramírez', role: 'coach', text: 'Perfecto, estaré atento. Nos vemos mañana en el entrenamiento 💪', at: 'Ayer 19:17', mine: false },
  ],
  'admin-club': [
    { id: 1, author: 'Admin TuzosJrz', role: 'admin', text: 'Buenas tardes, le confirmamos que su recibo de septiembre ya está disponible en la app.', at: '09:15', mine: false },
    { id: 2, author: 'Yo', role: 'parent', text: 'Gracias, ya lo descargué.', at: '09:32', mine: true },
  ],
};

// ── Chat list ────────────────────────────────────────────────
function ChatList({ role, category, openChat, openNewChat, openSupervision }) {
  const [tab, setTab] = React.useState('all'); // all | groups | direct | anuncios
  const [query, setQuery] = React.useState('');

  const groups = window.TZ_DATA.CATEGORIES.map((c, i) => ({
    id: 'grp-' + c, kind: 'group', category: c,
    title: c + ' · Familias',
    subtitle: [12, 18, 22, 8, 26][i % 5] + ' miembros',
    last: c === category ? 'Coach: Sin problema Ana, gracias por avisar 🙏' : ['Padre: ¿A qué hora es?', 'Coach: Confirmado partido 10:30', 'Padre: 👍', 'Coach: Enviaré el calendario', 'Padre: Perfecto, gracias'][i % 5],
    when: c === category ? '13:41' : ['Ayer', '10:02', '09:15', '2d', '3d'][i % 5],
    unread: c === category ? 3 : [0, 0, 1, 0, 0][i % 5],
    pinned: c === category,
  }));

  const dms = [
    { id: 'coach-ramirez', kind: 'direct', title: 'Coach Ramírez', subtitle: 'Entrenador Sub-12', last: 'Perfecto, estaré atento. Nos vemos…', when: 'Ayer', unread: 0, roleTag: 'COACH', avatar: 'CR' },
    { id: 'admin-club',    kind: 'direct', title: 'Admin TuzosJrz', subtitle: 'Administración', last: 'Su recibo de septiembre ya está…', when: '09:15', unread: 1, roleTag: 'ADMIN', avatar: 'AD' },
  ];

  const anuncios = [
    { id: 'club-broadcast', kind: 'announce', title: 'Anuncios del club', subtitle: 'Solo lectura · Direc­tiva', last: 'Nuevos horarios de la escuela…', when: 'Vie', unread: 0 },
  ];

  // Filter based on role
  const allChats = role === 'parent' ? [
    // Parent: only category of their child + DMs + anuncios
    ...groups.filter(g => g.category === 'Sub-12').map(g => ({ ...g, title: 'Familias ' + g.category })),
    ...dms,
    ...anuncios,
  ] : role === 'coach' ? [
    // Coach: their category group + DMs with all parents + anuncios
    ...groups.filter(g => g.category === category),
    // Coach's DMs = parents (simulate a bunch)
    ...window.TZ_DATA.PLAYERS.filter(p => p.category === category && p.tutor).slice(0, 6).map((p, i) => ({
      id: 'dm-' + p.id, kind: 'direct', title: p.tutor.name,
      subtitle: p.tutor.relation + ' de ' + p.first,
      last: ['¿A qué hora es el partido?', 'Gracias coach 🙏', 'Confirmado', 'Va a faltar mañana', 'Ok!', 'Perfecto'][i],
      when: ['10:22', '09:15', 'Ayer', 'Ayer', '2d', '3d'][i], unread: i < 2 ? 1 : 0,
      roleTag: 'PADRE', avatar: p.tutor.name.split(' ').map(x => x[0]).slice(0,2).join(''),
    })),
  ] : allAdminChats();

  const filtered = allChats
    .filter(c => tab === 'all' || (tab === 'groups' && c.kind === 'group') || (tab === 'direct' && c.kind === 'direct') || (tab === 'anuncios' && c.kind === 'announce'))
    .filter(c => !query || c.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Chat"
        subtitle={role === 'admin' ? 'Todas las conversaciones' : role === 'coach' ? category : 'Familia'}
        right={
          <div style={{ display: 'flex', gap: 8 }}>
            {role === 'admin' && (
              <button onClick={openSupervision} style={supervisorBtn}>
                <Icon name="search" size={14} color="#fff" />
                Supervisar
              </button>
            )}
            <button onClick={openNewChat} style={{
              width: 40, height: 40, borderRadius: '50%',
              background: TZ.primary, border: 0, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(29,61,138,0.35)',
            }}>
              <Icon name="plus" size={18} color="#fff" />
            </button>
          </div>
        }
      />

      <div style={{ padding: '0 16px' }}>
        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 14px', border: '1px solid ' + TZ.line,
        }}>
          <Icon name="search" size={18} color={TZ.muted} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder={role === 'admin' ? 'Buscar cualquier chat, persona o palabra…' : 'Buscar conversación…'}
            style={{ border: 0, outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }} />
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 6, marginTop: 12, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'all', label: 'Todos' },
            { id: 'groups', label: 'Grupos' },
            { id: 'direct', label: 'Directos' },
            { id: 'anuncios', label: 'Anuncios' },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 4px', border: 0, borderRadius: 9,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? TZ.ink : TZ.inkSoft,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        {/* Chat list */}
        <div style={{ marginTop: 14 }}>
          {filtered.length === 0 ? (
            <Card>
              <div style={{ textAlign: 'center', padding: 20, color: TZ.muted, fontSize: 13 }}>
                Sin conversaciones {tab !== 'all' && `en ${tab}`}
              </div>
            </Card>
          ) : (
            <Card padded={false}>
              {filtered.map((c, i) => (
                <ChatRow key={c.id} chat={c} first={i === 0} onClick={() => openChat(c)} />
              ))}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function ChatRow({ chat: c, first, onClick }) {
  const isGroup = c.kind === 'group';
  const isAnnounce = c.kind === 'announce';
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '13px 14px',
      borderTop: first ? 0 : '1px solid ' + TZ.line, cursor: 'pointer',
    }}>
      {/* Avatar */}
      {isGroup ? (
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: `linear-gradient(135deg, ${TZ.primary}, ${TZ.primaryDark})`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 15,
          letterSpacing: 0.5, flexShrink: 0,
        }}>{(c.category || '').replace('Sub-', 'U')}</div>
      ) : isAnnounce ? (
        <div style={{
          width: 46, height: 46, borderRadius: 12,
          background: '#F5B301', color: TZ.primaryDark,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <Icon name="bell" size={22} color={TZ.primaryDark} />
        </div>
      ) : (
        <div style={{
          width: 46, height: 46, borderRadius: '50%',
          background: `linear-gradient(135deg, hsl(${(c.id.length * 47) % 360} 55% 55%), hsl(${((c.id.length * 47) + 40) % 360} 60% 40%))`,
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: 15, flexShrink: 0,
        }}>{c.avatar || c.title.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
            {c.pinned && <span style={{ fontSize: 11 }}>📌</span>}
            <span style={{ fontSize: 14, fontWeight: 700, color: TZ.ink,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.title}</span>
            {c.roleTag && (
              <span style={{
                fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
                padding: '2px 6px', borderRadius: 4,
                background: c.roleTag === 'ADMIN' ? '#DBEAFE' : c.roleTag === 'COACH' ? 'rgba(29,61,138,0.10)' : '#F1F5F9',
                color: c.roleTag === 'ADMIN' ? '#1E40AF' : c.roleTag === 'COACH' ? TZ.primary : TZ.inkSoft,
              }}>{c.roleTag}</span>
            )}
          </div>
          <span style={{ fontSize: 11, color: c.unread ? TZ.primary : TZ.muted, fontWeight: 600, flexShrink: 0 }}>{c.when}</span>
        </div>
        {c.subtitle && (
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{c.subtitle}</div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 13, color: c.unread ? TZ.ink : TZ.inkSoft, fontWeight: c.unread ? 600 : 400,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
            {c.last}
          </span>
          {c.unread > 0 && (
            <span style={{
              minWidth: 20, height: 20, padding: '0 6px', borderRadius: 10,
              background: TZ.primary, color: '#fff',
              fontSize: 11, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{c.unread}</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Chat conversation ─────────────────────────────────────────
function ChatConversation({ chat, back, role, supervising = false }) {
  const [text, setText] = React.useState('');
  const [reactionPickerFor, setReactionPickerFor] = React.useState(null); // msgId
  const [localMessages, setLocalMessages] = React.useState([]);
  const isGroup = chat.kind === 'group';
  const isAnnounce = chat.kind === 'announce';
  const isAdmin = role === 'admin';

  // Seed reactions for announce channel
  React.useEffect(() => { if (isAnnounce) seedAnnounceReactions(); }, [isAnnounce]);

  const baseMessages = isAnnounce
    ? ANNOUNCE_MSGS
    : isGroup ? (CATEGORY_GROUP_MSGS[chat.category] || []) : (DM_MSGS[chat.id] || defaultDMMsgs(chat));

  // Load persisted messages (system broadcasts) for this chat
  const [persistedMessages, setPersistedMessages] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('tz.chatMsgs.' + chat.id) || '[]'); }
    catch { return []; }
  });
  React.useEffect(() => {
    const h = (e) => {
      if (e.detail?.chatId === chat.id) {
        setPersistedMessages(prev => [...prev, e.detail.msg]);
      }
    };
    window.addEventListener('tz-chat-broadcast', h);
    return () => window.removeEventListener('tz-chat-broadcast', h);
  }, [chat.id]);

  const messages = [...baseMessages, ...persistedMessages, ...localMessages];

  // On announce channel: only admin can write (composer disabled for others)
  const canWrite = !supervising && (!isAnnounce || isAdmin);

  const handleReact = (msgId, emoji) => {
    toggleReaction(chat.id, msgId, emoji);
    setReactionPickerFor(null);
  };

  const handleSend = () => {
    if (!text.trim()) return;
    const newMsg = {
      id: 'local-' + Date.now(),
      author: isAdmin ? 'Admin TuzosJrz' : 'Yo',
      role: isAdmin ? 'admin' : (role === 'coach' ? 'coach' : 'parent'),
      text: text.trim(),
      at: 'ahora',
      mine: true,
    };
    setLocalMessages(prev => [...prev, newMsg]);
    setText('');

    // 🔔 Auto-push a todos los padres cuando admin publica en anuncios
    if (isAnnounce && isAdmin) {
      window.dispatchEvent(new CustomEvent('tz-announce-broadcast', {
        detail: {
          title: '📢 Nuevo anuncio del club',
          body: text.trim().slice(0, 120) + (text.length > 120 ? '…' : ''),
          messageId: newMsg.id,
        }
      }));
      // Show visible confirmation
      setTimeout(() => {
        window.alert && console.log('Push enviado a todos los padres y coaches');
      }, 100);
    }
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: '#EDE7DC' }}>
      {/* Header */}
      <div style={{
        padding: '54px 14px 12px',
        background: '#fff',
        borderBottom: '1px solid ' + TZ.line,
        display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
      }}>
        <button onClick={back} style={{
          background: 'transparent', border: 0, padding: 4, cursor: 'pointer',
          display: 'flex', alignItems: 'center', color: TZ.primary,
        }}>
          <Icon name="chevronL" size={22} color={TZ.primary} />
        </button>
        {isGroup ? (
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: `linear-gradient(135deg, ${TZ.primary}, ${TZ.primaryDark})`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 13,
            flexShrink: 0,
          }}>{(chat.category || '').replace('Sub-', 'U')}</div>
        ) : (
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${(chat.id.length * 47) % 360} 55% 55%), hsl(${((chat.id.length * 47) + 40) % 360} 60% 40%))`,
            color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 12, flexShrink: 0,
          }}>{chat.avatar || chat.title.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{chat.title}</div>
          <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>
            {isGroup ? (chat.subtitle || '18 miembros') : (chat.subtitle || 'En línea')}
          </div>
        </div>
        <button style={iconBtn}><Icon name="phone" size={18} color={TZ.inkSoft} /></button>
      </div>

      {/* Supervision banner */}
      {supervising && (
        <div style={{
          padding: '8px 14px', background: '#FEF3C7',
          borderBottom: '1px solid #FDE68A',
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, color: '#78350F', fontWeight: 600,
        }}>
          <span>🔒</span>
          <span>Vista de supervisión · No participas en la conversación</span>
        </div>
      )}

      {/* Announce channel banner */}
      {isAnnounce && !supervising && (
        <div style={{
          padding: '8px 14px', background: isAdmin ? '#DBEAFE' : '#F4F5F8',
          borderBottom: '1px solid ' + (isAdmin ? '#93C5FD' : TZ.line),
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 11, color: isAdmin ? '#1E40AF' : TZ.inkSoft, fontWeight: 600,
        }}>
          <span>{isAdmin ? '📢' : '👁'}</span>
          <span>{isAdmin
            ? 'Cada mensaje aquí envía push automático a todo el club'
            : 'Canal oficial · Solo el admin publica · Puedes reaccionar'}</span>
        </div>
      )}

      {/* Messages */}
      <div style={{
        flex: 1, overflow: 'auto', padding: '14px 10px',
        display: 'flex', flexDirection: 'column', gap: 4,
        backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(0,0,0,0.03) 0, transparent 40%)',
      }}>
        <DayLabel label={isAnnounce ? 'ANUNCIOS RECIENTES' : 'HOY'} />
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showAuthor = (isGroup || isAnnounce) && !m.mine && (!prev || prev.author !== m.author);
          return <Bubble key={m.id} msg={m} showAuthor={showAuthor} isGroup={isGroup || isAnnounce}
            chatId={chat.id} onOpenReactions={() => setReactionPickerFor(m.id)}
            isAnnounce={isAnnounce} canReact={!supervising} />;
        })}
      </div>

      {/* Reaction picker sheet */}
      {reactionPickerFor && (
        <div onClick={() => setReactionPickerFor(null)} style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'flex-end', zIndex: 50,
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            width: '100%', background: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20,
            padding: '14px 20px 30px',
          }}>
            <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '0 auto 14px' }} />
            <div style={{ fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>
              Reaccionar
            </div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'space-around' }}>
              {AVAILABLE_REACTIONS.map(emoji => (
                <button key={emoji} onClick={() => handleReact(reactionPickerFor, emoji)} style={{
                  width: 54, height: 54, borderRadius: '50%',
                  border: 0, background: '#F4F5F8', cursor: 'pointer',
                  fontSize: 28, transition: 'transform 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.15)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Composer */}
      {canWrite ? (
        <div style={{
          padding: '10px 12px 30px', background: '#F4F5F8',
          borderTop: '1px solid ' + TZ.line,
          display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0,
        }}>
          <button style={composerBtn}><Icon name="plus" size={20} color={TZ.inkSoft} /></button>
          <div style={{
            flex: 1, background: '#fff', borderRadius: 22,
            display: 'flex', alignItems: 'center', padding: '6px 12px 6px 14px',
            border: isAnnounce ? '1.5px solid ' + TZ.primary : '1px solid ' + TZ.line,
          }}>
            <input value={text} onChange={e => setText(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
              placeholder={isAnnounce ? 'Publicar anuncio al club…' : 'Mensaje…'}
              style={{ flex: 1, border: 0, outline: 'none', background: 'transparent', fontSize: 14, padding: '6px 0' }} />
            <button style={{ background: 'transparent', border: 0, cursor: 'pointer', padding: 0 }}>
              <span style={{ fontSize: 20 }}>😊</span>
            </button>
          </div>
          {text ? (
            <button onClick={handleSend} style={{
              ...composerBtn, background: isAnnounce ? '#F5B301' : TZ.primary, color: isAnnounce ? TZ.primaryDark : '#fff',
              boxShadow: '0 2px 6px rgba(29,61,138,0.35)',
            }}>
              <Icon name="play" size={16} color={isAnnounce ? TZ.primaryDark : '#fff'} />
            </button>
          ) : (
            <button style={composerBtn}>
              <span style={{ fontSize: 18 }}>{isAnnounce ? '📢' : '🎤'}</span>
            </button>
          )}
        </div>
      ) : isAnnounce && !supervising ? (
        <div style={{
          padding: '14px 20px 34px', background: '#F4F5F8',
          borderTop: '1px solid ' + TZ.line,
          textAlign: 'center', fontSize: 12, color: TZ.muted, fontWeight: 600, flexShrink: 0,
        }}>
          👁 Canal solo lectura · Toca cualquier anuncio para reaccionar
        </div>
      ) : (
        <div style={{
          padding: '14px 20px 34px', background: '#FEF3C7',
          borderTop: '1px solid #FDE68A',
          textAlign: 'center', fontSize: 12, color: '#78350F', fontWeight: 600, flexShrink: 0,
        }}>
          🔒 No puedes escribir en modo supervisión
        </div>
      )}
    </div>
  );
}

function Bubble({ msg: m, showAuthor, isGroup, chatId, onOpenReactions, isAnnounce, canReact }) {
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    const h = (e) => {
      if (e.detail?.chatId === chatId && e.detail?.msgId === m.id) setTick(t => t + 1);
    };
    window.addEventListener('tz-reactions-change', h);
    return () => window.removeEventListener('tz-reactions-change', h);
  }, [chatId, m.id]);

  const reactions = React.useMemo(() => chatId ? getReactions(chatId, m.id) : {}, [chatId, m.id, tick]);
  const hasReactions = Object.keys(reactions).length > 0;

  const bg = m.mine ? '#DCF8C6'
    : m.role === 'coach' && isGroup ? '#DBEAFE'
    : m.role === 'admin' && (isGroup || isAnnounce) ? '#FEF3C7'
    : '#fff';
  const roleColor = m.role === 'admin' ? '#1E40AF' : m.role === 'coach' ? TZ.primary : TZ.inkSoft;
  const roleLabel = m.role === 'admin' ? 'ADMIN' : m.role === 'coach' ? 'COACH' : null;

  if (m.pinned) {
    return (
      <div style={{
        alignSelf: 'stretch', padding: '10px 14px', background: '#FFFBEB',
        border: '1px solid #FDE68A', borderRadius: 12, margin: '8px 4px',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 14 }}>📌</span>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 0.6, color: '#92400E', marginBottom: 4 }}>MENSAJE FIJADO</div>
          <div style={{ fontSize: 13, color: TZ.ink, lineHeight: 1.4 }}>{m.text}</div>
          <div style={{ fontSize: 10, color: TZ.muted, marginTop: 4, fontWeight: 600 }}>{m.author} · {m.at}</div>
        </div>
      </div>
    );
  }

  // Anuncio: burbuja full width con estilo card
  const isAnnounceBubble = isAnnounce && m.role === 'admin';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      alignItems: isAnnounceBubble ? 'stretch' : (m.mine ? 'flex-end' : 'flex-start'),
      maxWidth: isAnnounceBubble ? '95%' : '85%',
      alignSelf: isAnnounceBubble ? 'stretch' : (m.mine ? 'flex-end' : 'flex-start'),
      margin: isAnnounceBubble ? '4px 6px' : 0,
    }}>
      {showAuthor && (
        <div style={{ fontSize: 10, fontWeight: 700, color: roleColor, marginLeft: 12, marginBottom: 2, marginTop: 6, display: 'flex', alignItems: 'center', gap: 5 }}>
          <span>{m.author}</span>
          {roleLabel && (
            <span style={{
              fontSize: 8, fontWeight: 800, letterSpacing: 0.5, padding: '1px 5px',
              borderRadius: 3, background: roleColor, color: '#fff',
            }}>{roleLabel}</span>
          )}
        </div>
      )}
      <div
        onClick={() => canReact && chatId && onOpenReactions && onOpenReactions(m.id)}
        style={{
          padding: isAnnounceBubble ? '12px 14px 10px' : '7px 12px 6px',
          background: bg,
          borderRadius: isAnnounceBubble ? 14 : 12,
          borderTopLeftRadius: !m.mine && !showAuthor && !isAnnounceBubble ? 4 : (isAnnounceBubble ? 14 : 12),
          borderTopRightRadius: m.mine && !showAuthor && !isAnnounceBubble ? 4 : (isAnnounceBubble ? 14 : 12),
          boxShadow: isAnnounceBubble ? '0 2px 6px rgba(0,0,0,0.08)' : '0 1px 1px rgba(0,0,0,0.06)',
          fontSize: isAnnounceBubble ? 14 : 13.5, color: TZ.ink, lineHeight: 1.4,
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          cursor: canReact && chatId ? 'pointer' : 'default',
          border: isAnnounceBubble ? '1px solid #FDE68A' : 0,
        }}>
        {m.text}
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 8, verticalAlign: 'baseline' }}>
          <span style={{ fontSize: 10, color: '#7A8695', fontWeight: 500 }}>{m.at}</span>
          {m.mine && <span style={{ fontSize: 10, color: '#4FC3F7' }}>✓✓</span>}
        </span>
      </div>

      {/* Reactions row */}
      {(hasReactions || (canReact && chatId)) && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 4,
          alignSelf: isAnnounceBubble ? 'stretch' : (m.mine ? 'flex-end' : 'flex-start'),
          paddingLeft: isAnnounceBubble ? 4 : (m.mine ? 0 : 8),
          paddingRight: isAnnounceBubble ? 4 : (m.mine ? 8 : 0),
        }}>
          {Object.entries(reactions).map(([emoji, data]) => {
            const iReacted = data.users?.includes('me');
            return (
              <button key={emoji} onClick={(e) => {
                e.stopPropagation();
                if (canReact && chatId) { toggleReaction(chatId, m.id, emoji); }
              }} style={{
                background: iReacted ? 'rgba(29,61,138,0.15)' : '#fff',
                border: iReacted ? '1px solid ' + TZ.primary : '1px solid ' + TZ.line,
                borderRadius: 999, padding: '2px 8px 2px 6px',
                fontSize: 11, cursor: canReact && chatId ? 'pointer' : 'default',
                display: 'inline-flex', alignItems: 'center', gap: 3,
                fontWeight: 600, color: iReacted ? TZ.primary : TZ.inkSoft,
              }}>
                <span style={{ fontSize: 13 }}>{emoji}</span>
                <span>{data.count}</span>
              </button>
            );
          })}
          {canReact && chatId && (
            <button onClick={(e) => { e.stopPropagation(); onOpenReactions(m.id); }} style={{
              background: 'rgba(255,255,255,0.7)', border: '1px dashed ' + TZ.line,
              borderRadius: 999, padding: '2px 7px', fontSize: 12, cursor: 'pointer',
              color: TZ.muted, fontWeight: 600,
            }}>+</button>
          )}
        </div>
      )}
    </div>
  );
}

function DayLabel({ label }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '4px 0 12px' }}>
      <div style={{
        padding: '3px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.7)',
        fontSize: 10, fontWeight: 700, letterSpacing: 1, color: TZ.inkSoft,
      }}>{label}</div>
    </div>
  );
}

// ── New chat composer ─────────────────────────────────────────
function NewChatComposer({ back, role, category, startChat }) {
  const [kind, setKind] = React.useState('direct');

  const contacts = role === 'parent' ? [
    { id: 'coach-ramirez', title: 'Coach Ramírez',   sub: 'Entrenador Sub-12', tag: 'COACH', avatar: 'CR' },
    { id: 'admin-club',    title: 'Admin TuzosJrz', sub: 'Administración',    tag: 'ADMIN', avatar: 'AD' },
  ] : role === 'coach' ? (
    window.TZ_DATA.PLAYERS.filter(p => p.category === category && p.tutor).slice(0, 10).map(p => ({
      id: 'dm-' + p.id, title: p.tutor.name,
      sub: p.tutor.relation + ' de ' + p.first,
      tag: 'PADRE', avatar: p.tutor.name.split(' ').map(x => x[0]).slice(0,2).join(''),
    }))
  ) : (
    // admin
    [
      { id: 'coach-ramirez', title: 'Coach Ramírez', sub: 'Sub-12', tag: 'COACH', avatar: 'CR' },
      { id: 'coach-lopez',   title: 'Coach López',   sub: 'Sub-10', tag: 'COACH', avatar: 'CL' },
      { id: 'coach-vera',    title: 'Coach Vera',    sub: 'Sub-14', tag: 'COACH', avatar: 'CV' },
    ]
  );

  const groups = window.TZ_DATA.CATEGORIES.map(c => ({
    id: 'grp-' + c, title: 'Familias ' + c, sub: [12, 18, 22, 8, 26][window.TZ_DATA.CATEGORIES.indexOf(c) % 5] + ' miembros',
    category: c,
  }));

  return (
    <div style={{ paddingBottom: 100, background: '#F4F5F8', minHeight: '100%' }}>
      <div style={{
        padding: '54px 14px 12px', background: '#fff',
        borderBottom: '1px solid ' + TZ.line,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <button onClick={back} style={{
          background: 'transparent', border: 0, padding: 4, cursor: 'pointer', color: TZ.primary,
        }}>
          <Icon name="chevronL" size={22} color={TZ.primary} />
        </button>
        <div style={{ fontSize: 17, fontWeight: 700, color: TZ.ink }}>Nueva conversación</div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Kind toggle */}
        <div style={{ display: 'flex', gap: 6, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'direct', label: '💬 Mensaje directo', desc: 'Uno a uno' },
            { id: 'group',  label: '👥 Grupo por categoría', desc: 'Familia + coach' },
          ].map(k => (
            <button key={k.id} onClick={() => setKind(k.id)} style={{
              flex: 1, padding: '12px 8px', border: 0, borderRadius: 9,
              background: kind === k.id ? '#fff' : 'transparent',
              color: kind === k.id ? TZ.ink : TZ.inkSoft,
              cursor: 'pointer',
              boxShadow: kind === k.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{k.label}</div>
              <div style={{ fontSize: 10, marginTop: 2, opacity: 0.7 }}>{k.desc}</div>
            </button>
          ))}
        </div>

        <SectionTitle>{kind === 'direct' ? 'Contactos' : 'Grupos disponibles'}</SectionTitle>
        <Card padded={false}>
          {(kind === 'direct' ? contacts : groups).map((c, i) => (
            <div key={c.id} onClick={() => startChat({
              id: c.id,
              kind: kind === 'direct' ? 'direct' : 'group',
              title: c.title,
              subtitle: c.sub,
              category: c.category,
              roleTag: c.tag,
              avatar: c.avatar,
            })} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line, cursor: 'pointer',
            }}>
              {kind === 'group' ? (
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `linear-gradient(135deg, ${TZ.primary}, ${TZ.primaryDark})`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 13,
                }}>{(c.category || '').replace('Sub-', 'U')}</div>
              ) : (
                <div style={{
                  width: 42, height: 42, borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${(c.id.length * 47) % 360} 55% 55%), hsl(${((c.id.length * 47) + 40) % 360} 60% 40%))`,
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 800, fontSize: 13,
                }}>{c.avatar || c.title.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{c.title}</span>
                  {c.tag && (
                    <span style={{
                      fontSize: 9, fontWeight: 800, letterSpacing: 0.6,
                      padding: '2px 6px', borderRadius: 4,
                      background: c.tag === 'ADMIN' ? '#DBEAFE' : c.tag === 'COACH' ? 'rgba(29,61,138,0.10)' : '#F1F5F9',
                      color: c.tag === 'ADMIN' ? '#1E40AF' : c.tag === 'COACH' ? TZ.primary : TZ.inkSoft,
                    }}>{c.tag}</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{c.sub}</div>
              </div>
              <Icon name="chevron" size={16} color={TZ.muted} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

// ── Admin supervision ─────────────────────────────────────────
function AdminChatSupervision({ back, openChatSupervised }) {
  const [tab, setTab] = React.useState('all');
  const [query, setQuery] = React.useState('');
  const chats = allAdminChats();
  const filtered = chats
    .filter(c => tab === 'all' || (tab === 'groups' && c.kind === 'group') || (tab === 'direct' && c.kind === 'direct'))
    .filter(c => !query || c.title.toLowerCase().includes(query.toLowerCase()) || (c.last || '').toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        padding: '54px 14px 14px',
        background: `linear-gradient(155deg, #78350F 0%, #451A03 100%)`,
        color: '#fff', display: 'flex', alignItems: 'center', gap: 10, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.12,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <button onClick={back} style={{ ...iconBtn, background: 'rgba(255,255,255,0.15)', zIndex: 1 }}>
          <Icon name="chevronL" size={20} color="#fff" />
        </button>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>MODO SUPERVISOR</div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>Historial de mensajes</div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <div style={{
          marginTop: 14, padding: '10px 14px', background: '#FEF3C7', border: '1px solid #FDE68A',
          borderRadius: 10, display: 'flex', gap: 10, alignItems: 'flex-start',
          fontSize: 12, color: '#78350F',
        }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <div>
            Como administrador puedes leer cualquier conversación del club para efectos de moderación. <strong>No aparecerás como participante</strong> ni podrás enviar mensajes.
          </div>
        </div>

        <div style={{
          marginTop: 14, display: 'flex', alignItems: 'center', gap: 8,
          background: '#fff', borderRadius: 12, padding: '10px 14px', border: '1px solid ' + TZ.line,
        }}>
          <Icon name="search" size={18} color={TZ.muted} />
          <input value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Buscar por persona, texto…"
            style={{ border: 0, outline: 'none', flex: 1, fontSize: 14, background: 'transparent' }} />
        </div>

        <div style={{ display: 'flex', gap: 6, marginTop: 12, background: '#EEF0F4', borderRadius: 12, padding: 4 }}>
          {[
            { id: 'all', label: `Todos (${chats.length})` },
            { id: 'groups', label: `Grupos (${chats.filter(c => c.kind === 'group').length})` },
            { id: 'direct', label: `Directos (${chats.filter(c => c.kind === 'direct').length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '8px 4px', border: 0, borderRadius: 9,
              background: tab === t.id ? '#fff' : 'transparent',
              color: tab === t.id ? TZ.ink : TZ.inkSoft,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              boxShadow: tab === t.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
            }}>{t.label}</button>
          ))}
        </div>

        <div style={{ marginTop: 14 }}>
          <Card padded={false}>
            {filtered.map((c, i) => (
              <ChatRow key={c.id} chat={c} first={i === 0} onClick={() => openChatSupervised(c)} />
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ── Helpers ──────────────────────────────────────────────────
function allAdminChats() {
  const groups = window.TZ_DATA.CATEGORIES.map((c, i) => ({
    id: 'grp-' + c, kind: 'group', category: c,
    title: 'Familias ' + c,
    subtitle: [12, 18, 22, 8, 26][i % 5] + ' miembros · Coach ' + ['Ramírez','López','Vera','Cruz','Ortiz'][i % 5],
    last: ['Coach: Sin problema, gracias 🙏', 'Padre: ¿A qué hora es?', 'Coach: Confirmado partido 10:30', 'Padre: 👍', 'Coach: Enviaré calendario'][i % 5],
    when: ['13:41', 'Ayer', '10:02', '09:15', '2d'][i % 5],
    unread: 0,
  }));
  const dms = [
    { id: 'coach-ramirez', kind: 'direct', title: 'Carlos Hernández ↔ Coach Ramírez', subtitle: 'Padre + Coach Sub-12', last: 'Perfecto, estaré atento…', when: 'Ayer', unread: 0, roleTag: 'DM', avatar: 'CH' },
    { id: 'dm-1', kind: 'direct', title: 'María López ↔ Coach López', subtitle: 'Madre + Coach Sub-10', last: 'Nos vemos el sábado', when: '11:22', unread: 0, roleTag: 'DM', avatar: 'ML' },
    { id: 'dm-2', kind: 'direct', title: 'Roberto García ↔ Admin', subtitle: 'Padre + Admin', last: '¿Podemos hablar sobre la cuota?', when: '09:15', unread: 0, roleTag: 'DM', avatar: 'RG' },
    { id: 'dm-3', kind: 'direct', title: 'Ana Mendoza ↔ Coach Ortiz', subtitle: 'Madre + Coach Sub-8', last: 'Iker va a llegar tarde', when: 'Ayer', unread: 0, roleTag: 'DM', avatar: 'AM' },
  ];
  // Canal oficial de anuncios (admin puede publicar aquí)
  const anuncios = [
    { id: 'club-broadcast', kind: 'announce', title: 'Anuncios del club',
      subtitle: 'Canal oficial · Publicar aquí envía push a todos', last: '🏆 ¡GANAMOS EL TORNEO INTERFILIAL!',
      when: 'Lun', unread: 0 },
  ];
  return [...anuncios, ...groups, ...dms];
}

function defaultDMMsgs(chat) {
  return [
    { id: 1, author: chat.title.split('↔')[0]?.trim() || 'Otro', role: 'parent', text: 'Hola, ¿cómo estás?', at: '10:00', mine: false },
    { id: 2, author: 'Yo', role: 'coach', text: 'Bien, gracias. Dime.', at: '10:02', mine: true },
  ];
}

const iconBtn = {
  width: 36, height: 36, borderRadius: '50%', border: 0,
  background: '#EEF0F4',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

const composerBtn = {
  width: 40, height: 40, borderRadius: '50%', border: 0,
  background: '#EEF0F4',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
  flexShrink: 0,
};

const supervisorBtn = {
  padding: '8px 12px', borderRadius: 999, border: 0,
  background: '#78350F', color: '#fff',
  fontSize: 11, fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', gap: 5,
};

Object.assign(window, { ChatList, ChatConversation, NewChatComposer, AdminChatSupervision });
