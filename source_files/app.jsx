// TuzosJrz — App shell (admin + parent roles)

function App() {
  // Pull cross-file components from window at render time (Babel scopes each file)
  const {
    IOSDevice,
    useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakSelect, TweakColor,
    TZ, Icon, TabBar, ScreenHeader,
    Dashboard, Players, PlayerProfile, Payments, Attendance, Tactics,
    AdminInvites, PENDING_REQUESTS,
    ParentOnboarding, ParentHome, ParentChildProfile, ParentTabBar,
    CoachHome, CoachRoster, CoachPlayerProfile, CoachCall, CoachTabBar,
    ChatList, ChatConversation, NewChatComposer, AdminChatSupervision,
    AdminCoaches, CalendarScreen, NotificationsCenter, PushMock, AdminReports,
    AdminProfile, CoachProfile, ParentProfile,
    CreateEventFlow,
    PayFlow, ParentPayments, AdminPaymentInbox,
    TournamentExport,
    SplashScreen, LoginScreen, NoAccountScreen,
    getSession, clearSession,
  } = window;
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // --- AUTH state ---
  const [authStage, setAuthStage] = React.useState('splash'); // splash | login | noAccount | app
  const [session, setSession] = React.useState(() => getSession());

  React.useEffect(() => {
    // After splash finishes, decide: si hay sesión → app, sino → login
    if (authStage === 'splash') return;
    if (session && authStage === 'app') return;
  }, [authStage, session]);

  const handleSplashDone = () => {
    if (session) {
      // Sync role from session
      setTweak('role', session.role);
      setAuthStage('app');
    } else {
      setAuthStage('login');
    }
  };
  const handleLogin = (newSession) => {
    setSession(newSession);
    setTweak('role', newSession.role);
    // Reset any stale routes so they land on home
    setRoute(null); setTab('home');
    setParentRoute(null); setParentTab('home');
    setCoachRoute(null); setCoachTab('home');
    setAuthStage('app');
  };
  const handleLogout = () => {
    clearSession();
    setSession(null);
    setAuthStage('login');
  };
  // Expose logout globally so Profile can trigger it
  React.useEffect(() => { window.tzLogout = handleLogout; }, []);

  // --- ADMIN state ---
  const [tab, setTab] = React.useState(() => localStorage.getItem('tz.tab') || 'home');
  const [route, setRoute] = React.useState(() => JSON.parse(localStorage.getItem('tz.route') || 'null'));
  const [tacticsFullscreen, setTacticsFullscreen] = React.useState(false);

  // --- PARENT state ---
  const [parentTab, setParentTab] = React.useState(() => localStorage.getItem('tz.ptab') || 'home');
  const [parentRoute, setParentRoute] = React.useState(() => JSON.parse(localStorage.getItem('tz.proute') || 'null'));

  // --- COACH state ---
  const [coachTab, setCoachTab] = React.useState(() => localStorage.getItem('tz.ctab') || 'home');
  const [coachRoute, setCoachRoute] = React.useState(() => JSON.parse(localStorage.getItem('tz.croute') || 'null'));
  const [coachTacticsFullscreen, setCoachTacticsFullscreen] = React.useState(false);
  React.useEffect(() => { localStorage.setItem('tz.ctab', coachTab); }, [coachTab]);
  React.useEffect(() => { localStorage.setItem('tz.croute', JSON.stringify(coachRoute)); }, [coachRoute]);

  React.useEffect(() => { localStorage.setItem('tz.tab', tab); }, [tab]);
  React.useEffect(() => { localStorage.setItem('tz.route', JSON.stringify(route)); }, [route]);
  React.useEffect(() => { localStorage.setItem('tz.ptab', parentTab); }, [parentTab]);
  React.useEffect(() => { localStorage.setItem('tz.proute', JSON.stringify(parentRoute)); }, [parentRoute]);

  // Apply primary color
  React.useEffect(() => {
    document.documentElement.style.setProperty('--tz-primary', tweaks.primary);
    document.documentElement.style.setProperty('--tz-primary-dark', tweaks.primaryDark);
  }, [tweaks.primary, tweaks.primaryDark]);

  // Reset onboarding state helpers
  const parentState = tweaks.parentState; // 'invite' | 'register' | 'review' | 'approved'
  const setParentState = (s) => setTweak('parentState', s);

  // Choose device
  const isTablet = tweaks.device === 'tablet';
  const deviceW = isTablet ? 720 : 402;
  const deviceH = isTablet ? 960 : 874;

  // ── ADMIN nav ──
  const nav = (t) => {
    if (t === 'createEvent' || t === 'notifications') { setRoute({ screen: t }); return; }
    setRoute(null); setTab(t);
  };
  const openPlayer = (id) => setRoute({ screen: 'profile', playerId: id });
  const openAdminScreen = (s) => {
    // Tab-level sections should switch tabs; extras use route
    if (['home','players','payments','attend','tactics','profile'].includes(s)) {
      setRoute(null); setTab(s);
    } else {
      setRoute({ screen: s });
    }
  };
  const back = () => setRoute(null);

  // ── PARENT nav ──
  const parentNav = (t) => { setParentRoute(null); setParentTab(t); };
  const openChild = (id) => setParentRoute({ screen: 'child', childId: id });
  const parentBack = () => setParentRoute(null);

  const isAdmin = tweaks.role === 'admin';
  const isCoach = tweaks.role === 'coach';
  const isParent = tweaks.role === 'parent';
  const coachCategory = tweaks.coachCategory || 'Sub-12';

  // ── COACH nav ──
  const coachNav = (t) => {
    // Sub-screens that go via route, not tab
    if (['createEvent', 'calendar', 'notifications'].includes(t)) {
      setCoachRoute({ screen: t });
    } else {
      setCoachRoute(null); setCoachTab(t);
    }
  };
  const openCoachPlayer = (id) => setCoachRoute({ screen: 'profile', playerId: id });
  const coachBack = () => setCoachRoute(null);

  // ── Admin route helpers for chat ──
  const openChatFromAdmin = (chat) => setRoute({ screen: 'chatConv', chat });
  const openChatSupervised = (chat) => setRoute({ screen: 'chatConvSup', chat });

  // ── ADMIN content ──
  const adminContent = (
    <div style={{ position: 'relative', height: '100%', background: TZ.bg, overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        {route && route.screen === 'profile' ? (
          <PlayerProfile playerId={route.playerId} back={back} />
        ) : route && route.screen === 'invites' ? (
          <AdminInvitesWithBack back={back} />
        ) : route && route.screen === 'coaches' ? (
          <AdminCoaches back={back} />
        ) : route && route.screen === 'calendar' ? (
          <CalendarScreen role="admin" back={back} onCreate={() => setRoute({ screen: 'createEvent' })} />
        ) : route && route.screen === 'createEvent' ? (
          <CreateEventFlow back={() => setRoute({ screen: 'calendar' })} role="admin" />
        ) : route && route.screen === 'chat' ? (
          <ChatList role="admin" openChat={openChatFromAdmin} openNewChat={() => setRoute({ screen: 'newChat' })} openSupervision={() => setRoute({ screen: 'supervision' })} />
        ) : route && route.screen === 'chatConv' ? (
          <ChatConversation chat={route.chat} back={() => setRoute({ screen: 'chat' })} role="admin" />
        ) : route && route.screen === 'chatConvSup' ? (
          <ChatConversation chat={route.chat} back={() => setRoute({ screen: 'supervision' })} role="admin" supervising />
        ) : route && route.screen === 'newChat' ? (
          <NewChatComposer back={() => setRoute({ screen: 'chat' })} role="admin" startChat={(c) => setRoute({ screen: 'chatConv', chat: c })} />
        ) : route && route.screen === 'supervision' ? (
          <AdminChatSupervision back={() => setRoute({ screen: 'chat' })} openChatSupervised={openChatSupervised} />
        ) : route && route.screen === 'notifications' ? (
          <NotificationsCenter role="admin" back={back} />
        ) : route && route.screen === 'reports' ? (
          <AdminReports back={back} />
        ) : route && route.screen === 'paymentInbox' ? (
          <AdminPaymentInbox back={back} />
        ) : route && route.screen === 'tournamentExport' ? (
          <TournamentExport back={back} />
        ) : (
          <>
            {tab === 'home' && <AdminDashboard nav={nav} openAdminScreen={openAdminScreen} />}
            {tab === 'players' && <Players nav={nav} openPlayer={openPlayer} />}
            {tab === 'payments' && <Payments nav={nav} openPlayer={openPlayer} />}
            {tab === 'attend' && <Attendance nav={nav} />}
            {tab === 'tactics' && <Tactics nav={nav} fullscreen={tacticsFullscreen} setFullscreen={setTacticsFullscreen} />}
            {tab === 'profile' && <AdminProfile />}
          </>
        )}
      </div>
      {!tacticsFullscreen && !route?.screen?.startsWith('chatConv') && <TabBar tab={tab} onChange={(t) => { setRoute(null); setTab(t); }} />}
    </div>
  );

  // ── PARENT content ──
  const parentApproved = parentState === 'approved';
  const parentContent = (
    <div style={{ position: 'relative', height: '100%', background: TZ.bg, overflow: 'hidden' }}>
      {parentApproved ? (
        <>
          <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
            {parentRoute && parentRoute.screen === 'child' ? (
              <ParentChildProfile childId={parentRoute.childId} back={parentBack} />
            ) : parentRoute && parentRoute.screen === 'chatConv' ? (
              <ChatConversation chat={parentRoute.chat} back={() => setParentRoute(null)} role="parent" />
            ) : parentRoute && parentRoute.screen === 'newChat' ? (
              <NewChatComposer back={() => setParentRoute(null)} role="parent"
                startChat={(c) => setParentRoute({ screen: 'chatConv', chat: c })} />
            ) : parentRoute && parentRoute.screen === 'notifications' ? (
              <NotificationsCenter role="parent" back={() => setParentRoute(null)} />
            ) : parentRoute && parentRoute.screen === 'payFlow' ? (
              <PayFlow back={() => setParentRoute(null)}
                parentKey="parent-carlos"
                childName="Diego Hernández"
                concept="Cuota Septiembre"
                amount={850}
                onDone={() => setParentRoute(null)} />
            ) : parentRoute && parentRoute.screen === 'payments' ? (
              <ParentPayments parentKey="parent-carlos"
                onPay={() => setParentRoute({ screen: 'payFlow' })} />
            ) : (
              <>
                {parentTab === 'home' && <ParentHome nav={parentNav} openChild={openChild}
                  onPay={() => setParentRoute({ screen: 'payFlow' })} />}
                {parentTab === 'child' && <ParentChildProfile childId={1} back={() => parentNav('home')} />}
                {parentTab === 'payments' && <ParentPayments parentKey="parent-carlos"
                  onPay={() => setParentRoute({ screen: 'payFlow' })} />}
                {parentTab === 'calendar' && <CalendarScreen role="parent" />}
                {parentTab === 'chat' && <ChatList role="parent"
                  openChat={(c) => setParentRoute({ screen: 'chatConv', chat: c })}
                  openNewChat={() => setParentRoute({ screen: 'newChat' })} />}
                {parentTab === 'profile' && <ParentProfile />}
              </>
            )}
          </div>
          <ParentTabBar tab={parentTab} onChange={(t) => { setParentRoute(null); setParentTab(t); }} />
        </>
      ) : (
        <ParentOnboarding
          state={parentState}
          setState={setParentState}
          onEnter={() => { setParentTab('home'); setParentRoute(null); }}
        />
      )}
    </div>
  );

  // ── COACH content ──
  const coachContent = (
    <div style={{ position: 'relative', height: '100%', background: TZ.bg, overflow: 'hidden' }}>
      <div style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}>
        {coachRoute && coachRoute.screen === 'profile' ? (
          <CoachPlayerProfile playerId={coachRoute.playerId} back={coachBack} />
        ) : coachRoute && coachRoute.screen === 'chatConv' ? (
          <ChatConversation chat={coachRoute.chat} back={() => setCoachRoute(null)} role="coach" />
        ) : coachRoute && coachRoute.screen === 'newChat' ? (
          <NewChatComposer back={() => setCoachRoute(null)} role="coach" category={coachCategory}
            startChat={(c) => setCoachRoute({ screen: 'chatConv', chat: c })} />
        ) : coachRoute && coachRoute.screen === 'notifications' ? (
          <NotificationsCenter role="coach" back={() => setCoachRoute(null)} />
        ) : coachRoute && coachRoute.screen === 'createEvent' ? (
          <CreateEventFlow back={() => setCoachRoute(null)} role="coach" coachCategory={coachCategory} />
        ) : coachRoute && coachRoute.screen === 'calendar' ? (
          <CalendarScreen role="coach" category={coachCategory} back={() => setCoachRoute(null)}
            onCreate={() => setCoachRoute({ screen: 'createEvent' })} />
        ) : (
          <>
            {coachTab === 'home' && <CoachHome nav={coachNav} openPlayer={openCoachPlayer} category={coachCategory} />}
            {coachTab === 'roster' && <CoachRoster openPlayer={openCoachPlayer} category={coachCategory} />}
            {coachTab === 'attend' && <Attendance nav={coachNav} lockedCategory={coachCategory} />}
            {coachTab === 'tactics' && <Tactics nav={coachNav} fullscreen={coachTacticsFullscreen} setFullscreen={setCoachTacticsFullscreen} />}
            {coachTab === 'profile' && <CoachProfile category={coachCategory} />}
            {coachTab === 'chat' && <ChatList role="coach" category={coachCategory}
              openChat={(c) => setCoachRoute({ screen: 'chatConv', chat: c })}
              openNewChat={() => setCoachRoute({ screen: 'newChat' })} />}
            {coachTab === 'call' && <CoachCall category={coachCategory} />}
          </>
        )}
      </div>
      {!coachTacticsFullscreen && !coachRoute?.screen?.startsWith('chatConv') && <CoachTabBar tab={coachTab === 'call' ? 'home' : coachTab} onChange={(t) => { setCoachRoute(null); setCoachTab(t); }} />}
    </div>
  );

  const roleContent = isAdmin ? adminContent : isCoach ? coachContent : parentContent;

  // Overlay layer for splash / login / no-account
  let deviceContent;
  if (authStage === 'splash') {
    deviceContent = (
      <div style={{ position: 'relative', height: '100%', background: TZ.bg, overflow: 'hidden' }}>
        <SplashScreen onDone={handleSplashDone} />
      </div>
    );
  } else if (authStage === 'login') {
    deviceContent = (
      <div style={{ position: 'relative', height: '100%', background: TZ.bg, overflow: 'hidden' }}>
        <LoginScreen onLogin={handleLogin} onNoAccount={() => setAuthStage('noAccount')} />
      </div>
    );
  } else if (authStage === 'noAccount') {
    deviceContent = (
      <div style={{ position: 'relative', height: '100%', background: TZ.bg, overflow: 'hidden' }}>
        <NoAccountScreen back={() => setAuthStage('login')} />
      </div>
    );
  } else {
    deviceContent = roleContent;
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(160deg, #E8ECF3 0%, #DDE3EE 100%)',
      padding: 24, boxSizing: 'border-box',
      fontFamily: 'Inter, -apple-system, "SF Pro", system-ui, sans-serif',
    }}>
      <IOSDevice width={deviceW} height={deviceH}>
        {deviceContent}
      </IOSDevice>

      <TweaksPanel>
        <TweakSection label="Rol">
          <TweakSelect
            label="Vista"
            value={tweaks.role}
            onChange={(v) => setTweak('role', v)}
            options={[
              { value: 'admin',  label: '⚽ Admin (gestión total)' },
              { value: 'coach',  label: '🏃 Entrenador (por categoría)' },
              { value: 'parent', label: '👪 Padre / tutor' },
            ]}
          />
        </TweakSection>

        {isCoach && (
          <TweakSection label="Categoría asignada al coach">
            <TweakSelect
              label="Categoría"
              value={coachCategory}
              onChange={(v) => setTweak('coachCategory', v)}
              options={window.TZ_DATA.CATEGORIES.map(c => ({ value: c, label: c }))}
            />
          </TweakSection>
        )}

        {isParent && (
          <TweakSection label="Estado del padre (recorre el flujo)">
            <TweakSelect
              label="Etapa del onboarding"
              value={tweaks.parentState}
              onChange={(v) => setTweak('parentState', v)}
              options={[
                { value: 'invite',   label: '1 · Invitación (WhatsApp)' },
                { value: 'register', label: '2 · Formulario' },
                { value: 'review',   label: '3 · En revisión' },
                { value: 'approved', label: '4 · Aprobado (Home)' },
              ]}
            />
          </TweakSection>
        )}

        <TweakSection label="Marca">
          <TweakColor
            label="Color primario"
            value={tweaks.primary}
            onChange={(v) => setTweak({ primary: v, primaryDark: shade(v, -25) })}
            options={['#1D3D8A', '#0A2657', '#153E75', '#1E3A8A', '#0F172A']}
          />
        </TweakSection>

        <TweakSection label="Dispositivo">
          <TweakRadio
            label="Vista"
            value={tweaks.device}
            onChange={(v) => setTweak('device', v)}
            options={[
              { value: 'phone', label: 'Móvil' },
              { value: 'tablet', label: 'Tablet' },
            ]}
          />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

// ── Admin dashboard extended with parent-requests card ──────────
function AdminDashboard({ nav, openAdminScreen }) {
  const pendingCount = window.PENDING_REQUESTS ? window.PENDING_REQUESTS.length : 0;
  return (
    <div style={{ position: 'relative' }}>
      <Dashboard nav={nav} noBottomPad />
      <AdminExtras openAdminScreen={openAdminScreen} pendingCount={pendingCount} />
      {/* Spacer so el contenido no quede pegado a la tab bar */}
      <div style={{ height: 120 }} />
    </div>
  );
}

// Extra admin actions injected after the Dashboard content
function AdminExtras({ openAdminScreen, pendingCount }) {
  const pendingPayments = React.useMemo(() => {
    try {
      const list = window.getPendingPayments ? window.getPendingPayments() : [];
      return list.filter(p => !p._decided).length;
    } catch { return 0; }
  }, []);
  const items = [
    { id: 'tactics',       icon: '⚽', label: 'Pizarra',         color: '#0F172A',    badge: null },
    { id: 'coaches',       icon: '🏃', label: 'Entrenadores',   color: '#0F766E',    badge: null },
    { id: 'invites',       icon: '👪', label: 'Tutores',        color: '#B45309',    badge: pendingCount },
    { id: 'paymentInbox',  icon: '💰', label: 'Aprobar pagos',   color: '#F5B301',    badge: pendingPayments, dark: true },
    { id: 'calendar',      icon: '📅', label: 'Calendario',      color: '#7C3AED',    badge: null },
    { id: 'chat',          icon: '💬', label: 'Chat',            color: TZ.primary,   badge: 5 },
    { id: 'reports',       icon: '📊', label: 'Reportes',        color: '#334155',    badge: null },
    { id: 'tournamentExport', icon: '🏆', label: 'Torneos',       color: '#B45309',    badge: null },
  ];
  return (
    <div style={{ padding: '0 16px', marginTop: 20 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: TZ.inkSoft, letterSpacing: 0.6, textTransform: 'uppercase', margin: '0 4px 10px' }}>
        Gestión del club
      </div>
      <div style={{
        background: '#fff', borderRadius: 16, padding: 6,
        border: '1px solid rgba(15,23,42,0.04)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 2px 8px rgba(15, 23, 42, 0.04)',
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2,
      }}>
        {items.map(it => (
          <button key={it.id} onClick={() => openAdminScreen(it.id)} style={{
            background: 'transparent', border: 0, borderRadius: 12,
            padding: '12px 4px 10px', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, position: 'relative',
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 11, background: it.color + '18',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
            }}>{it.icon}</div>
            <span style={{ fontSize: 10, fontWeight: 700, color: TZ.ink, textAlign: 'center', lineHeight: 1.15 }}>{it.label}</span>
            {it.badge > 0 && (
              <span style={{
                position: 'absolute', top: 6, right: 8,
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                background: TZ.err, color: '#fff', fontSize: 9, fontWeight: 800,
                display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff',
              }}>{it.badge}</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

// Wrap AdminInvites with a back button
function AdminInvitesWithBack({ back }) {
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={back} style={{
        position: 'absolute', top: 62, left: 20, zIndex: 20,
        width: 36, height: 36, borderRadius: '50%', border: 0,
        background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      }}>
        <Icon name="chevronL" size={18} color={TZ.ink} />
      </button>
      <AdminInvites />
    </div>
  );
}

function ParentPlaceholder({ title, msg }) {
  return (
    <div>
      <ScreenHeader title={title} subtitle="Sección" />
      <div style={{ padding: 40, textAlign: 'center' }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: '#EEF0F4',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '20px auto',
        }}>
          <Icon name="doc" size={30} color={TZ.muted} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 700, color: TZ.ink }}>{title}</div>
        <div style={{ fontSize: 13, color: TZ.muted, marginTop: 8, lineHeight: 1.5, maxWidth: 280, margin: '8px auto 0' }}>
          {msg}
        </div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 20, fontStyle: 'italic' }}>
          (Pantalla del portal padres para siguiente iteración)
        </div>
      </div>
    </div>
  );
}

function shade(hex, percent) {
  const num = parseInt(hex.replace('#',''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.max(0, Math.min(255, (num >> 16) + amt));
  const G = Math.max(0, Math.min(255, ((num >> 8) & 0xff) + amt));
  const B = Math.max(0, Math.min(255, (num & 0xff) + amt));
  return '#' + ((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1);
}

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "primary": "#1D3D8A",
  "primaryDark": "#0F2560",
  "device": "phone",
  "role": "admin",
  "parentState": "invite",
  "coachCategory": "Sub-12"
}/*EDITMODE-END*/;

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
