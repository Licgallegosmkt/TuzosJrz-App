// TuzosJrz — Panel de partido EN VIVO
// El coach registra goles, tarjetas, cambios y faltas en tiempo real
// Notifica automáticamente a padres y guarda estadísticas acumuladas

// ═══════════════════════════════════════════════════════════
// STORAGE LAYER
// ═══════════════════════════════════════════════════════════
function getMatchState(matchId) {
  try { return JSON.parse(localStorage.getItem('tz.matchLive.' + matchId) || 'null'); }
  catch { return null; }
}
function saveMatchState(matchId, state) {
  try { localStorage.setItem('tz.matchLive.' + matchId, JSON.stringify(state)); } catch {}
  window.dispatchEvent(new CustomEvent('tz-match-change', { detail: { matchId } }));
}
function getPlayerStats(playerId) {
  try { return JSON.parse(localStorage.getItem('tz.playerStats.' + playerId) || '{}'); }
  catch { return {}; }
}
function updatePlayerStats(playerId, delta) {
  const cur = getPlayerStats(playerId);
  const next = {
    goals: (cur.goals || 0) + (delta.goals || 0),
    assists: (cur.assists || 0) + (delta.assists || 0),
    yellows: (cur.yellows || 0) + (delta.yellows || 0),
    reds: (cur.reds || 0) + (delta.reds || 0),
    fouls: (cur.fouls || 0) + (delta.fouls || 0),
    minutes: (cur.minutes || 0) + (delta.minutes || 0),
    matches: (cur.matches || 0) + (delta.matches || 0),
  };
  try { localStorage.setItem('tz.playerStats.' + playerId, JSON.stringify(next)); } catch {}
  return next;
}

// ═══════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════
function MatchLive({ eventId, back }) {
  const evt = window.getEvent(eventId);
  const [tick, setTick] = React.useState(0);
  React.useEffect(() => {
    // 1 Hz clock tick when running
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Match state — initialize from storage or from event
  const [state, setState] = React.useState(() => {
    const existing = getMatchState(eventId);
    if (existing) return existing;
    return {
      phase: 'pre',      // pre | 1t | halftime | 2t | finished
      elapsedMs: 0,      // running time in current half
      halfLengthMin: evt?.halfLengthMin || 25,
      runningSince: null, // Date.now() when started/resumed, null when paused
      homeScore: 0,
      awayScore: 0,
      events: [],        // { id, at, minute, type, playerId, playerOutId, comment }
      lineupOnField: [], // array of playerId currently playing
      startedAt: null,
    };
  });

  // Persist state
  React.useEffect(() => { saveMatchState(eventId, state); }, [state, eventId]);

  // Live elapsed time (only meaningful when running)
  const liveElapsed = React.useMemo(() => {
    if (!state.runningSince) return state.elapsedMs;
    return state.elapsedMs + (Date.now() - state.runningSince);
  }, [state, tick]);

  const totalMs = state.halfLengthMin * 60 * 1000;
  const minute = Math.min(state.halfLengthMin, Math.floor(liveElapsed / 60000));
  const displayMin = state.phase === '2t' ? state.halfLengthMin + minute : minute;

  // ── Actions ─────────────────────────────────────────────
  const start = () => {
    const now = Date.now();
    // Initialize titulares from convocados (first 11 or 8 depending on category)
    const isEight = evt?.category === 'Sub-8' || evt?.category === 'Sub-10';
    const teamSize = isEight ? 8 : 11;
    const titulares = (evt?.convocados || []).slice(0, teamSize);
    setState(s => ({
      ...s,
      phase: '1t',
      runningSince: now,
      startedAt: now,
      lineupOnField: titulares,
      events: [{ id: 'ev-' + now, at: now, minute: 0, type: 'kickoff', comment: '1er tiempo' }],
    }));
  };

  const pause = () => setState(s => ({ ...s, elapsedMs: liveElapsed, runningSince: null }));
  const resume = () => setState(s => ({ ...s, runningSince: Date.now() }));
  const endHalf = () => {
    const now = Date.now();
    if (state.phase === '1t') {
      setState(s => ({
        ...s, phase: 'halftime', runningSince: null, elapsedMs: 0,
        events: [...s.events, { id: 'ev-' + now, at: now, minute: displayMin, type: 'halftime', comment: 'Medio tiempo' }],
      }));
    } else if (state.phase === '2t') {
      // End of match
      finish();
    }
  };
  const startSecondHalf = () => {
    const now = Date.now();
    setState(s => ({
      ...s, phase: '2t', runningSince: now, elapsedMs: 0,
      events: [...s.events, { id: 'ev-' + now, at: now, minute: s.halfLengthMin, type: 'kickoff', comment: '2do tiempo' }],
    }));
  };
  const finish = () => {
    const now = Date.now();
    // Snapshot first (state is still current pre-finish here)
    const snapshotState = state;
    const scorers = snapshotState.events.filter(e => e.type === 'goal-us').map(e => {
      const p = window.TZ_DATA.PLAYERS.find(x => x.id === e.playerId);
      return p ? p.first : '';
    }).filter(Boolean).join(', ');
    const result = snapshotState.homeScore > snapshotState.awayScore ? '🏆 ¡VICTORIA!' :
                   snapshotState.homeScore < snapshotState.awayScore ? '😔 Derrota' : '🤝 Empate';

    setState(s => ({
      ...s, phase: 'finished', runningSince: null, elapsedMs: liveElapsed,
      events: [...s.events, { id: 'ev-' + now, at: now, minute: displayMin, type: 'fulltime', comment: 'Final' }],
    }));
    // Side effects OUTSIDE setState (post-render safe)
    snapshotState.lineupOnField.forEach(pid => {
      updatePlayerStats(pid, { minutes: 90, matches: 1 });
    });
    // Defer push to next tick so it doesn't fire during render
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('tz-push', {
        detail: {
          title: result,
          body: `TuzosJrz ${snapshotState.homeScore} - ${snapshotState.awayScore} ${evt?.rival || 'Rival'}${scorers ? `\nGoles: ${scorers}` : ''}`,
          kind: 'match-final',
        },
      }));
    }, 100);
  };

  // Register event action
  const registerEvent = (evData) => {
    const now = Date.now();
    const newEvent = {
      id: 'ev-' + now,
      at: now,
      minute: displayMin,
      ...evData,
    };
    setState(s => {
      const next = { ...s, events: [...s.events, newEvent] };
      // Update scores
      if (evData.type === 'goal-us') next.homeScore = s.homeScore + 1;
      if (evData.type === 'goal-them') next.awayScore = s.awayScore + 1;
      // Update lineup on substitution
      if (evData.type === 'sub' && evData.playerId && evData.playerOutId) {
        next.lineupOnField = s.lineupOnField
          .filter(id => id !== evData.playerOutId)
          .concat(evData.playerId);
      }
      return next;
    });
    // Update player stats accumulated
    if (evData.type === 'goal-us' && evData.playerId) {
      updatePlayerStats(evData.playerId, { goals: 1 });
    }
    if (evData.type === 'yellow') updatePlayerStats(evData.playerId, { yellows: 1 });
    if (evData.type === 'red') updatePlayerStats(evData.playerId, { reds: 1 });
    if (evData.type === 'foul') updatePlayerStats(evData.playerId, { fouls: 1 });

    // Live push notification to parents (deferred to avoid render-time dispatch)
    const p = evData.playerId ? window.TZ_DATA.PLAYERS.find(x => x.id === evData.playerId) : null;
    if (evData.type === 'goal-us') {
      setTimeout(() => window.dispatchEvent(new CustomEvent('tz-push', {
        detail: {
          title: `⚽ ¡GOL de TuzosJrz! ${state.homeScore + 1} - ${state.awayScore}`,
          body: p ? `Anotó ${p.name} · min ${displayMin}` : `min ${displayMin}`,
          kind: 'match-goal',
        },
      })), 50);
    } else if (evData.type === 'goal-them') {
      setTimeout(() => window.dispatchEvent(new CustomEvent('tz-push', {
        detail: {
          title: `⚽ Gol del rival ${state.homeScore} - ${state.awayScore + 1}`,
          body: `${evt?.rival || 'Rival'} anotó · min ${displayMin}`,
          kind: 'match-goal-them',
        },
      })), 50);
    }
  };

  const undoLast = () => {
    setState(s => {
      const events = [...s.events];
      const last = events.pop();
      if (!last) return s;
      let homeScore = s.homeScore, awayScore = s.awayScore;
      if (last.type === 'goal-us') homeScore = Math.max(0, homeScore - 1);
      if (last.type === 'goal-them') awayScore = Math.max(0, awayScore - 1);
      // Revert stats
      if (last.type === 'goal-us' && last.playerId) updatePlayerStats(last.playerId, { goals: -1 });
      if (last.type === 'yellow') updatePlayerStats(last.playerId, { yellows: -1 });
      if (last.type === 'red') updatePlayerStats(last.playerId, { reds: -1 });
      if (last.type === 'foul') updatePlayerStats(last.playerId, { fouls: -1 });
      // TODO: revert substitutions
      return { ...s, events, homeScore, awayScore };
    });
  };

  // ── Render ──────────────────────────────────────────────
  if (!evt) return null;

  // Pre-game screen
  if (state.phase === 'pre') {
    return <PreMatchScreen evt={evt} onStart={start} onEditHalf={(min) => setState(s => ({ ...s, halfLengthMin: min }))}
      halfLengthMin={state.halfLengthMin} back={back} />;
  }

  // Post-game screen
  if (state.phase === 'finished') {
    return <MatchSummary evt={evt} state={state} back={back}
      onReopen={() => setState(s => ({ ...s, phase: '2t' }))} />;
  }

  const isRunning = !!state.runningSince;
  const isHalftime = state.phase === 'halftime';

  return (
    <div style={{
      minHeight: '100%', position: 'relative',
      background: 'linear-gradient(180deg, #0F1E3F 0%, #061128 60%, #000 100%)',
      color: '#fff', paddingBottom: 80,
    }}>
      {/* Stadium turf overlay */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.06, pointerEvents: 'none',
        backgroundImage: 'repeating-linear-gradient(90deg, transparent 0 8%, rgba(255,255,255,0.15) 8% 16%)' }} />

      {/* Top bar */}
      <div style={{ padding: '52px 16px 8px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <button onClick={back} style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronL" size={18} color="#fff" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301', textTransform: 'uppercase' }}>
            🔴 EN VIVO · {evt.category}
          </div>
          <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.9, marginTop: 1 }}>
            {evt.location?.name || 'Sede por definir'}
          </div>
        </div>
        <button onClick={undoLast} disabled={state.events.length === 0} style={{
          padding: '6px 10px', borderRadius: 8,
          background: 'rgba(255,255,255,0.1)', border: 0, cursor: 'pointer',
          color: '#fff', fontSize: 11, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 4,
          opacity: state.events.length === 0 ? 0.4 : 1,
        }}>
          ↶ Deshacer
        </button>
      </div>

      {/* SCOREBOARD — stadium style */}
      <Scoreboard
        homeScore={state.homeScore} awayScore={state.awayScore}
        rival={evt.rival} minute={displayMin}
        phase={state.phase} isRunning={isRunning}
        halfLengthMin={state.halfLengthMin}
      />

      {/* Controls */}
      <div style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
          {isHalftime ? (
            <BigBtn onClick={startSecondHalf} color="#F5B301" text="▶️ INICIAR 2° TIEMPO" dark />
          ) : isRunning ? (
            <>
              <BigBtn onClick={pause} color="rgba(255,255,255,0.15)" text="⏸ PAUSA" small />
              <BigBtn onClick={endHalf} color="#DC2626" text={state.phase === '1t' ? '⏹ FIN 1T' : '🏁 FINAL'} />
            </>
          ) : (
            <>
              <BigBtn onClick={resume} color="#F5B301" text="▶️ REANUDAR" dark />
              <BigBtn onClick={endHalf} color="rgba(255,255,255,0.15)" text={state.phase === '1t' ? '⏹ FIN 1T' : '🏁 FINAL'} small />
            </>
          )}
        </div>

        {/* Quick "+1 rival" button */}
        <button onClick={() => registerEvent({ type: 'goal-them' })}
          disabled={!isRunning && !isHalftime}
          style={{
            marginTop: 12, width: '100%',
            padding: '12px', borderRadius: 12,
            background: 'rgba(220, 38, 38, 0.15)', border: '1.5px solid rgba(220,38,38,0.4)',
            color: '#FCA5A5', fontSize: 14, fontWeight: 800, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            opacity: !isRunning && !isHalftime ? 0.4 : 1,
          }}>
          <span style={{ fontSize: 20 }}>⚽</span>
          +1 GOL DEL RIVAL
        </button>
      </div>

      {/* Roster grid */}
      <RosterGrid
        evt={evt}
        state={state}
        onAction={(action, playerId, extras) => {
          if (action === 'sub') {
            // Substitution flow handled separately in sheet
            registerEvent({ type: 'sub', playerId: extras.inId, playerOutId: playerId });
          } else {
            registerEvent({ type: action, playerId, ...(extras || {}) });
          }
        }}
      />

      {/* Timeline */}
      <MatchTimeline state={state} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// PRE-MATCH SCREEN
// ═══════════════════════════════════════════════════════════
function PreMatchScreen({ evt, onStart, halfLengthMin, onEditHalf, back }) {
  const durations = [15, 20, 25, 30, 35, 40, 45];
  return (
    <div style={{
      minHeight: '100%', paddingBottom: 60,
      background: `linear-gradient(180deg, ${TZ.primaryDark} 0%, #000 100%)`,
      color: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ position: 'absolute', inset: 0, opacity: 0.05,
        backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />

      {/* Header */}
      <div style={{ padding: '52px 16px 8px', display: 'flex', alignItems: 'center', gap: 10, position: 'relative' }}>
        <button onClick={back} style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)', border: 0, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="chevronL" size={18} color="#fff" />
        </button>
        <div style={{ fontSize: 12, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301' }}>MODO EN VIVO</div>
      </div>

      <div style={{ padding: '20px 24px 0', textAlign: 'center', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.7 }}>
          {evt.category?.toUpperCase()} · {new Date(evt.date + 'T' + (evt.matchTime || '10:00')).toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}
        </div>
        <div style={{ marginTop: 30 }}>
          <TeamBlock name="TUZOSJRZ" color="#F5B301" isHome />
          <div style={{ fontSize: 44, fontWeight: 800, margin: '20px 0', opacity: 0.5, fontFamily: '"Barlow Condensed", sans-serif' }}>VS</div>
          <TeamBlock name={(evt.rival || 'RIVAL').toUpperCase()} color="rgba(255,255,255,0.7)" />
        </div>
      </div>

      {/* Duration picker */}
      <div style={{ padding: '40px 20px 0', position: 'relative' }}>
        <div style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301', marginBottom: 12, textAlign: 'center' }}>
          DURACIÓN DE CADA TIEMPO
        </div>
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
          {durations.map(d => (
            <button key={d} onClick={() => onEditHalf(d)} style={{
              padding: '10px 14px', borderRadius: 999,
              background: halfLengthMin === d ? '#F5B301' : 'rgba(255,255,255,0.1)',
              color: halfLengthMin === d ? TZ.primaryDark : '#fff',
              border: 0, fontSize: 13, fontWeight: 800, cursor: 'pointer',
              fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: 0.5,
            }}>
              {d}'
            </button>
          ))}
        </div>
        <div style={{ marginTop: 10, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
          Partido total: {halfLengthMin * 2}' ({halfLengthMin}' + {halfLengthMin}')
        </div>
      </div>

      {/* Convocados count */}
      <div style={{ padding: '30px 20px 0', position: 'relative' }}>
        <div style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 14, padding: 16,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 1, fontWeight: 700, opacity: 0.6 }}>CONVOCADOS</div>
              <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4 }}>{(evt.convocados || []).length} jugadores</div>
            </div>
            <div style={{ fontSize: 48 }}>👥</div>
          </div>
        </div>
      </div>

      {/* START button */}
      <div style={{ padding: '30px 20px 0', position: 'relative' }}>
        <button onClick={onStart} style={{
          width: '100%', padding: '20px', borderRadius: 16,
          background: '#F5B301', color: TZ.primaryDark, border: 0,
          fontSize: 18, fontWeight: 800, cursor: 'pointer', letterSpacing: 0.5,
          boxShadow: '0 8px 24px rgba(245,179,1,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 24 }}>▶️</span>
          INICIAR PARTIDO
        </button>
        <div style={{ marginTop: 12, textAlign: 'center', fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
          Los padres recibirán push por cada gol
        </div>
      </div>
    </div>
  );
}

function TeamBlock({ name, color, isHome }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div style={{
        width: 80, height: 80, borderRadius: 14,
        background: isHome ? 'transparent' : 'rgba(255,255,255,0.08)',
        border: isHome ? 0 : '2px solid ' + color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, boxSizing: 'border-box',
        filter: isHome ? 'drop-shadow(0 4px 12px rgba(245,179,1,0.4))' : 'none',
      }}>
        {isHome ? (
          <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        ) : (
          <span style={{ fontSize: 36 }}>🏟</span>
        )}
      </div>
      {/* Note: TeamBlock isHome now transparent — see wrapper */}
      <div style={{
        fontSize: 22, fontWeight: 800, marginTop: 10, letterSpacing: 1,
        color, fontFamily: '"Barlow Condensed", sans-serif',
      }}>{name}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCOREBOARD
// ═══════════════════════════════════════════════════════════
function Scoreboard({ homeScore, awayScore, rival, minute, phase, isRunning, halfLengthMin }) {
  const phaseLabel = phase === '1t' ? '1er TIEMPO'
    : phase === '2t' ? '2do TIEMPO'
    : phase === 'halftime' ? 'MEDIO TIEMPO'
    : phase === 'finished' ? 'FINAL' : '';

  return (
    <div style={{
      margin: '10px 16px', borderRadius: 20,
      background: 'linear-gradient(180deg, #000 0%, #1a1a1a 100%)',
      border: '2px solid rgba(245,179,1,0.4)',
      padding: '16px 12px', position: 'relative', overflow: 'hidden',
      boxShadow: '0 10px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
    }}>
      {/* LED matrix effect */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.15,
        backgroundImage: 'radial-gradient(circle, #F5B301 1px, transparent 1px)',
        backgroundSize: '4px 4px' }} />

      {/* Phase / clock */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 10, letterSpacing: 3, color: '#F5B301', fontWeight: 700 }}>
          {phaseLabel}
        </div>
        <div style={{
          fontSize: 32, fontWeight: 800, color: '#F5B301', marginTop: 2,
          fontFamily: '"Barlow Condensed", monospace', letterSpacing: 2,
          textShadow: isRunning ? '0 0 20px rgba(245,179,1,0.5)' : 'none',
        }}>
          {String(minute).padStart(2, '0')}'
          {isRunning && <span style={{ animation: 'blink 1.5s infinite' }}> ▪</span>}
        </div>
      </div>

      {/* Score row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 10, position: 'relative' }}>
        {/* Home */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
          <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
            style={{ width: 36, height: 36, objectFit: 'contain' }} />
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff' }}>TUZOSJRZ</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>LOCAL</div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '4px 10px' }}>
          <span style={{
            fontSize: 56, fontWeight: 900, color: '#F5B301',
            fontFamily: '"Barlow Condensed", monospace', letterSpacing: -2,
            textShadow: '0 0 30px rgba(245,179,1,0.4)',
            minWidth: 40, textAlign: 'center',
          }}>{homeScore}</span>
          <span style={{ fontSize: 32, fontWeight: 800, color: 'rgba(255,255,255,0.3)' }}>-</span>
          <span style={{
            fontSize: 56, fontWeight: 900, color: '#fff',
            fontFamily: '"Barlow Condensed", monospace', letterSpacing: -2,
            minWidth: 40, textAlign: 'center',
          }}>{awayScore}</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <div style={{
            width: 32, height: 32, background: 'rgba(255,255,255,0.1)', borderRadius: 6,
            border: '1px dashed rgba(255,255,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
          }}>🏟</div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, color: '#fff',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 100 }}>
            {(rival || 'RIVAL').toUpperCase()}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>VISITA</div>
        </div>
      </div>
      <style>{`@keyframes blink { 0%, 50% { opacity: 1 } 51%, 100% { opacity: 0.2 } }`}</style>
    </div>
  );
}

function BigBtn({ onClick, color, text, dark, small }) {
  return (
    <button onClick={onClick} style={{
      flex: small ? '0 1 auto' : 1,
      padding: small ? '10px 16px' : '14px 20px',
      borderRadius: 12, border: 0, cursor: 'pointer',
      background: color, color: dark ? TZ.primaryDark : '#fff',
      fontSize: small ? 12 : 14, fontWeight: 800, letterSpacing: 0.5,
      whiteSpace: 'nowrap',
    }}>{text}</button>
  );
}

// ═══════════════════════════════════════════════════════════
// ROSTER GRID
// ═══════════════════════════════════════════════════════════
function RosterGrid({ evt, state, onAction }) {
  const players = (evt.convocados || []).map(id => window.TZ_DATA.PLAYERS.find(p => p.id === id)).filter(Boolean);
  const [sheetPlayer, setSheetPlayer] = React.useState(null);

  // Player stats for badges
  const eventsByPlayer = React.useMemo(() => {
    const map = {};
    state.events.forEach(e => {
      if (!e.playerId) return;
      const p = map[e.playerId] = map[e.playerId] || { goals: 0, yellows: 0, reds: 0, fouls: 0 };
      if (e.type === 'goal-us') p.goals++;
      if (e.type === 'yellow') p.yellows++;
      if (e.type === 'red') p.reds++;
      if (e.type === 'foul') p.fouls++;
    });
    return map;
  }, [state.events]);

  return (
    <div style={{ padding: '4px 16px 20px' }}>
      <SectionLabel>JUGADORES · {players.length}</SectionLabel>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 6 }}>
        {players.map(p => (
          <PlayerCard key={p.id} p={p} stats={eventsByPlayer[p.id]}
            onClick={() => setSheetPlayer(p)} onField />
        ))}
      </div>

      {/* Action sheet */}
      {sheetPlayer && (
        <ActionSheet player={sheetPlayer}
          onClose={() => setSheetPlayer(null)}
          onGoal={() => { onAction('goal-us', sheetPlayer.id); setSheetPlayer(null); }}
          onYellow={() => { onAction('yellow', sheetPlayer.id); setSheetPlayer(null); }}
          onRed={() => { onAction('red', sheetPlayer.id); setSheetPlayer(null); }}
          onFoul={() => { onAction('foul', sheetPlayer.id); setSheetPlayer(null); }}
        />
      )}
    </div>
  );
}

function SectionLabel({ children, style }) {
  return (
    <div style={{
      fontSize: 10, letterSpacing: 1.5, fontWeight: 800,
      color: '#F5B301', textTransform: 'uppercase',
      padding: '4px 2px', ...style,
    }}>{children}</div>
  );
}

function PlayerCard({ p, stats, onClick, onField }) {
  const isRed = stats && stats.reds > 0;
  return (
    <button onClick={onClick} disabled={isRed} style={{
      background: onField ? 'rgba(245,179,1,0.12)' : 'rgba(255,255,255,0.05)',
      border: onField ? '1px solid rgba(245,179,1,0.4)' : '1px solid rgba(255,255,255,0.1)',
      borderRadius: 10, padding: '8px 4px', cursor: isRed ? 'not-allowed' : 'pointer',
      color: '#fff', textAlign: 'center', position: 'relative',
      opacity: isRed ? 0.4 : 1,
    }}>
      <div style={{
        width: 36, height: 36, margin: '0 auto', borderRadius: '50%',
        background: `linear-gradient(135deg, hsl(${(p.id * 47) % 360} 55% 50%), hsl(${((p.id * 47) + 40) % 360} 60% 35%))`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 800, position: 'relative',
      }}>
        {p.first[0]}{p.last[0]}
        <span style={{
          position: 'absolute', bottom: -3, right: -3,
          minWidth: 18, height: 18, padding: '0 4px', borderRadius: 9,
          background: '#000', color: '#F5B301',
          fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 11,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1.5px solid ' + (onField ? '#F5B301' : 'rgba(255,255,255,0.3)'),
        }}>{p.number}</span>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, marginTop: 6,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.first}</div>
      {/* Stats badges */}
      {stats && (stats.goals || stats.yellows || stats.reds) && (
        <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginTop: 3, minHeight: 12 }}>
          {stats.goals > 0 && <StatBadge label={`⚽${stats.goals > 1 ? stats.goals : ''}`} />}
          {stats.yellows > 0 && <StatBadge yellow />}
          {stats.reds > 0 && <StatBadge red />}
        </div>
      )}
    </button>
  );
}

function StatBadge({ label, yellow, red }) {
  if (yellow) return <span style={{ width: 8, height: 11, background: '#F5B301', borderRadius: 1 }} />;
  if (red) return <span style={{ width: 8, height: 11, background: '#DC2626', borderRadius: 1 }} />;
  return <span style={{ fontSize: 10, fontWeight: 700, color: '#F5B301' }}>{label}</span>;
}

// ═══════════════════════════════════════════════════════════
// ACTION SHEET
// ═══════════════════════════════════════════════════════════
function ActionSheet({ player, isOnField, onClose, onGoal, onYellow, onRed, onFoul }) {
  const [step, setStep] = React.useState('main'); // main | confirmRed

  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#0F1E3F', color: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '85%', overflow: 'auto',
        borderTop: '2px solid #F5B301',
      }}>
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 999, margin: '4px auto 14px' }} />

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: `linear-gradient(135deg, hsl(${(player.id * 47) % 360} 55% 50%), hsl(${((player.id * 47) + 40) % 360} 60% 35%))`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 800, position: 'relative',
          }}>
            {player.first[0]}{player.last[0]}
            <span style={{
              position: 'absolute', bottom: -3, right: -3,
              minWidth: 20, height: 20, padding: '0 4px', borderRadius: 10,
              background: '#F5B301', color: TZ.primaryDark,
              fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '2px solid #0F1E3F',
            }}>{player.number}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800 }}>{player.name}</div>
            <div style={{ fontSize: 11, color: '#F5B301', fontWeight: 700, letterSpacing: 0.5, marginTop: 2 }}>
              {isOnField ? '🟢 EN CANCHA' : '🔵 EN BANCA'} · {player.position}
            </div>
          </div>
        </div>

        {step === 'main' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            <ActionBtn icon="⚽" label="GOL" color="#22C55E" onClick={() => onGoal(null)} big />
            <ActionBtn icon="🟨" label="Amarilla" color="#F5B301" onClick={onYellow} />
            <ActionBtn icon="🟥" label="Roja" color="#DC2626" onClick={() => setStep('confirmRed')} />
            <ActionBtn icon="❌" label="Falta" color="#6B7280" onClick={onFoul} />
          </div>
        )}

        {step === 'confirmRed' && (
          <div>
            <div style={{ padding: 20, background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.5)',
              borderRadius: 12, textAlign: 'center' }}>
              <div style={{ fontSize: 40 }}>🟥</div>
              <div style={{ fontSize: 15, fontWeight: 800, marginTop: 8 }}>
                Confirmar EXPULSIÓN
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginTop: 6 }}>
                {player.name} quedará fuera del partido
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button onClick={() => setStep('main')} style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'rgba(255,255,255,0.1)', color: '#fff', border: 0,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
              }}>Cancelar</button>
              <button onClick={onRed} style={{
                flex: 2, padding: '14px', borderRadius: 12,
                background: '#DC2626', color: '#fff', border: 0,
                fontSize: 14, fontWeight: 800, cursor: 'pointer',
              }}>🟥 Expulsar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ActionBtn({ icon, label, color, onClick, big }) {
  return (
    <button onClick={onClick} style={{
      gridColumn: big ? '1 / -1' : 'auto',
      padding: big ? '16px' : '18px 10px',
      borderRadius: 12, border: 0, cursor: 'pointer',
      background: color + '22', color: '#fff',
      border: '1.5px solid ' + color + '80',
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      fontSize: big ? 14 : 12, fontWeight: 800, letterSpacing: 0.5,
    }}>
      <span style={{ fontSize: big ? 22 : 24 }}>{icon}</span>
      {label}
    </button>
  );
}

function SubstitutionSheet({ outPlayer, banca, onCancel, onConfirm }) {
  return (
    <div onClick={onCancel} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#0F1E3F', color: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 34px', maxHeight: '85%', overflow: 'auto',
        borderTop: '2px solid #F5B301',
      }}>
        <div style={{ width: 40, height: 4, background: 'rgba(255,255,255,0.3)', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>🔄 Sustitución</div>
        <div style={{ fontSize: 12, color: '#F5B301', marginBottom: 20 }}>
          Sale <strong>{outPlayer.name}</strong> #{outPlayer.number}. ¿Quién entra?
        </div>
        {banca.length === 0 ? (
          <div style={{ padding: 30, textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: 13 }}>
            No hay jugadores en la banca
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            {banca.map(p => (
              <button key={p.id} onClick={() => onConfirm(p)} style={{
                padding: '14px 8px', borderRadius: 12,
                background: 'rgba(34,197,94,0.15)', border: '1.5px solid rgba(34,197,94,0.4)',
                color: '#fff', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: `linear-gradient(135deg, hsl(${(p.id * 47) % 360} 55% 50%), hsl(${((p.id * 47) + 40) % 360} 60% 35%))`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800,
                }}>{p.first[0]}{p.last[0]}</div>
                <div style={{ fontSize: 11, fontWeight: 800 }}>#{p.number}</div>
                <div style={{ fontSize: 10, opacity: 0.8 }}>{p.first}</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// TIMELINE
// ═══════════════════════════════════════════════════════════
function MatchTimeline({ state }) {
  const events = [...state.events].reverse();
  if (events.length === 0) return null;
  return (
    <div style={{ padding: '4px 16px 20px' }}>
      <SectionLabel>CRONOLOGÍA</SectionLabel>
      <div style={{
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 12, marginTop: 6, padding: '4px 0',
      }}>
        {events.map(e => <TimelineEvent key={e.id} evt={e} />)}
      </div>
    </div>
  );
}

function TimelineEvent({ evt }) {
  const players = window.TZ_DATA.PLAYERS;
  const player = evt.playerId ? players.find(p => p.id === evt.playerId) : null;

  const map = {
    'goal-us':   { icon: '⚽', label: 'GOL TuzosJrz', color: '#22C55E' },
    'goal-them': { icon: '⚽', label: 'Gol rival', color: '#DC2626' },
    'yellow':    { icon: '🟨', label: 'Amarilla', color: '#F5B301' },
    'red':       { icon: '🟥', label: 'Roja', color: '#DC2626' },
    'foul':      { icon: '❌', label: 'Falta', color: '#9CA3AF' },
    'kickoff':   { icon: '▶️', label: 'Inicio', color: '#F5B301' },
    'halftime':  { icon: '⏸', label: 'Medio tiempo', color: '#F5B301' },
    'fulltime':  { icon: '🏁', label: 'Final del partido', color: '#F5B301' },
  };
  const cfg = map[evt.type] || { icon: '•', label: evt.type, color: '#fff' };

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div style={{
        width: 36, textAlign: 'center', fontSize: 13, fontWeight: 800, color: '#F5B301',
        fontFamily: '"Barlow Condensed", monospace', flexShrink: 0,
      }}>
        {evt.minute > 0 ? `${evt.minute}'` : ''}
      </div>
      <div style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
        {(player || evt.comment) && (
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 }}>
            {player ? player.name : evt.comment}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MATCH SUMMARY (post-game)
// ═══════════════════════════════════════════════════════════
function MatchSummary({ evt, state, back, onReopen }) {
  const [showShare, setShowShare] = React.useState(false);

  const result = state.homeScore > state.awayScore ? { label: '🏆 VICTORIA', color: '#22C55E', bg: 'linear-gradient(135deg, #16A34A, #15803D)' }
    : state.homeScore < state.awayScore ? { label: '😔 DERROTA', color: '#DC2626', bg: 'linear-gradient(135deg, #DC2626, #991B1B)' }
    : { label: '🤝 EMPATE', color: '#F5B301', bg: 'linear-gradient(135deg, #F5B301, #C48800)' };

  // Aggregate stats
  const players = window.TZ_DATA.PLAYERS;
  const scorers = state.events.filter(e => e.type === 'goal-us').map(e => players.find(p => p.id === e.playerId)).filter(Boolean);
  const yellows = state.events.filter(e => e.type === 'yellow').map(e => players.find(p => p.id === e.playerId)).filter(Boolean);
  const reds = state.events.filter(e => e.type === 'red').map(e => players.find(p => p.id === e.playerId)).filter(Boolean);
  const fouls = state.events.filter(e => e.type === 'foul').length;

  return (
    <div style={{ minHeight: '100%', background: '#F4F5F8', paddingBottom: 100 }}>
      {/* Hero */}
      <div style={{
        padding: '54px 20px 24px', background: result.bg,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={back} style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={18} color="#fff" />
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, fontWeight: 700, opacity: 0.85 }}>FINAL · {evt.category}</div>
            <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.4, marginTop: 2 }}>{result.label}</div>
          </div>
        </div>

        {/* Score */}
        <div style={{ position: 'relative', textAlign: 'center', margin: '24px 0 10px' }}>
          <div style={{
            display: 'inline-flex', gap: 16, alignItems: 'center',
            padding: '16px 22px', background: 'rgba(0,0,0,0.35)', borderRadius: 20,
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            <div style={{ textAlign: 'center' }}>
              <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
                style={{ width: 44, height: 44, objectFit: 'contain', margin: '0 auto 6px', display: 'block',
                  filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.3))' }} />
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.8 }}>TUZOSJRZ</div>
              <div style={{ fontSize: 44, fontWeight: 900, marginTop: 4, fontFamily: '"Barlow Condensed", monospace' }}>{state.homeScore}</div>
            </div>
            <div style={{ fontSize: 20, opacity: 0.5, fontWeight: 700, paddingBottom: 4 }}>-</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 40, height: 40, margin: '0 auto 6px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 8,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
              }}>🏟</div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.8,
                overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 100, whiteSpace: 'nowrap' }}>{(evt.rival || 'RIVAL').toUpperCase()}</div>
              <div style={{ fontSize: 44, fontWeight: 900, marginTop: 4, fontFamily: '"Barlow Condensed", monospace' }}>{state.awayScore}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px' }}>
        {/* Share button */}
        <button onClick={() => setShowShare(true)} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: TZ.primary, color: '#fff', border: 0,
          fontSize: 14, fontWeight: 800, cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(29,61,138,0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          📱 Compartir en redes sociales
        </button>

        {/* Goleadores */}
        {scorers.length > 0 && (
          <>
            <SectionTitle>⚽ Goleadores</SectionTitle>
            <Card padded={false}>
              {scorers.map((p, i) => {
                const eventsOfP = state.events.filter(e => e.type === 'goal-us' && e.playerId === p.id);
                return (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                    borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
                  }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${(p.id * 47) % 360} 55% 55%), hsl(${((p.id * 47) + 40) % 360} 60% 40%))`,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800,
                    }}>{p.first[0]}{p.last[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
                        {eventsOfP.map(e => `${e.minute}'`).join(' · ')}
                      </div>
                    </div>
                    <div style={{ fontSize: 20 }}>⚽</div>
                  </div>
                );
              })}
            </Card>
          </>
        )}

        {/* Tarjetas y stats */}
        <SectionTitle>Estadísticas del partido</SectionTitle>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          <MiniStat label="Amarillas" value={yellows.length} icon="🟨" />
          <MiniStat label="Rojas" value={reds.length} icon="🟥" />
          <MiniStat label="Faltas" value={fouls} icon="❌" />
          <MiniStat label="Minutos" value={state.halfLengthMin * 2} icon="⏱" />
        </div>

        {/* Full timeline */}
        <SectionTitle>Cronología completa</SectionTitle>
        <Card padded={false} style={{ background: '#0F1E3F' }}>
          {state.events.map(e => <TimelineEvent key={e.id} evt={e} />)}
        </Card>

        {/* Reopen */}
        <button onClick={onReopen} style={{
          marginTop: 20, width: '100%', padding: '12px', borderRadius: 10,
          background: 'transparent', color: TZ.muted, border: '1px dashed ' + TZ.line,
          fontSize: 12, fontWeight: 600, cursor: 'pointer',
        }}>
          ↩ Reabrir partido (si necesitas corregir)
        </button>
      </div>

      {/* Share sheet */}
      {showShare && (
        <ShareSheet evt={evt} state={state} result={result} scorers={scorers}
          onClose={() => setShowShare(false)} />
      )}
    </div>
  );
}

function MiniStat({ label, value, icon }) {
  return (
    <div style={{ background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 10, padding: '10px 6px', textAlign: 'center' }}>
      <div style={{ fontSize: 18 }}>{icon}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: TZ.ink, marginTop: 2, fontFamily: '"Barlow Condensed", sans-serif' }}>{value}</div>
      <div style={{ fontSize: 9, color: TZ.muted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SHARE SHEET (stadium-style card for social media)
// ═══════════════════════════════════════════════════════════
function ShareSheet({ evt, state, result, scorers, onClose }) {
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', color: TZ.ink,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 30px', maxHeight: '92%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>📱 Compartir resultado</div>
        <div style={{ fontSize: 12, color: TZ.muted, marginBottom: 20 }}>
          Descarga o comparte esta tarjeta en tus redes sociales
        </div>

        {/* Stadium-style scoreboard card */}
        <div style={{
          borderRadius: 20, overflow: 'hidden',
          background: 'linear-gradient(135deg, #0F1E3F 0%, #000 100%)',
          color: '#fff', padding: '24px 20px', position: 'relative',
          border: '3px solid #F5B301',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}>
          {/* Diagonal stripes */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.08, pointerEvents: 'none',
            backgroundImage: 'repeating-linear-gradient(115deg, #F5B301 0 2px, transparent 2px 24px)' }} />

          {/* Watermark del logo grande al fondo (branding sutil) */}
          <img src="assets/tuzosjrz-logo.png" alt=""
            style={{
              position: 'absolute', bottom: -30, right: -30,
              width: 200, height: 200, objectFit: 'contain',
              opacity: 0.08, pointerEvents: 'none',
              filter: 'grayscale(1) brightness(2)',
            }} />

          {/* Top row: club identity pill + result badge */}
          <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, gap: 10 }}>
            <div style={{
              background: 'rgba(245,179,1,0.15)',
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '4px 10px 4px 6px',
              borderRadius: 999, border: '1px solid rgba(245,179,1,0.4)',
            }}>
              <img src="assets/tuzosjrz-logo.png" alt=""
                style={{ width: 18, height: 18, objectFit: 'contain' }} />
              <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1.5, color: '#F5B301' }}>#TUZOSJRZ</span>
            </div>
            <div style={{
              background: 'rgba(0,0,0,0.35)',
              padding: '4px 10px', borderRadius: 999,
              fontSize: 10, fontWeight: 800, letterSpacing: 1.2, color: '#F5B301',
              border: '1px solid rgba(245,179,1,0.3)',
            }}>
              {evt.category?.toUpperCase() || 'PARTIDO'}
            </div>
          </div>

          {/* Title */}
          <div style={{ position: 'relative', textAlign: 'center' }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>
              RESULTADO FINAL
            </div>
            <div style={{ fontSize: 17, fontWeight: 800, marginTop: 4, opacity: 0.95 }}>
              {result.label}
            </div>
          </div>

          <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr auto 1fr',
            alignItems: 'center', gap: 12, margin: '28px 0 20px' }}>
            <div style={{ textAlign: 'center' }}>
              <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
                style={{ width: 60, height: 60, objectFit: 'contain', margin: '0 auto 8px', display: 'block',
                  filter: 'drop-shadow(0 4px 12px rgba(245,179,1,0.4))' }} />
              <div style={{
                fontSize: 13, fontWeight: 800, letterSpacing: 1, color: '#F5B301',
                fontFamily: '"Barlow Condensed", sans-serif',
              }}>TUZOSJRZ</div>
              <div style={{
                fontSize: 70, fontWeight: 900, marginTop: 4, color: '#F5B301',
                fontFamily: '"Barlow Condensed", monospace', lineHeight: 0.9,
                textShadow: '0 0 30px rgba(245,179,1,0.5)',
              }}>{state.homeScore}</div>
            </div>
            <div style={{ fontSize: 40, fontWeight: 800, color: 'rgba(255,255,255,0.3)', paddingBottom: 4 }}>-</div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 56, height: 56, margin: '0 auto 8px',
                background: 'rgba(255,255,255,0.1)', borderRadius: 10,
                border: '1.5px dashed rgba(255,255,255,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>🏟</div>
              <div style={{
                fontSize: 13, fontWeight: 800, letterSpacing: 1, color: '#fff',
                fontFamily: '"Barlow Condensed", sans-serif',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>{(evt.rival || 'RIVAL').toUpperCase()}</div>
              <div style={{
                fontSize: 70, fontWeight: 900, marginTop: 4, color: '#fff',
                fontFamily: '"Barlow Condensed", monospace', lineHeight: 0.9,
              }}>{state.awayScore}</div>
            </div>
          </div>

          {scorers.length > 0 && (
            <div style={{ position: 'relative', paddingTop: 12,
              borderTop: '1px solid rgba(255,255,255,0.15)', textAlign: 'center' }}>
              <div style={{ fontSize: 9, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301', marginBottom: 6 }}>⚽ GOLEADORES</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>
                {scorers.map((p, i) => {
                  const eventsOfP = state.events.filter(e => e.type === 'goal-us' && e.playerId === p.id);
                  return `${p.first} ${eventsOfP.map(e => `${e.minute}'`).join(', ')}`;
                }).join(' · ')}
              </div>
            </div>
          )}

          <div style={{ position: 'relative', marginTop: 16, paddingTop: 10,
            borderTop: '1px solid rgba(255,255,255,0.1)', textAlign: 'center',
            fontSize: 9, color: 'rgba(255,255,255,0.5)', fontWeight: 700, letterSpacing: 1 }}>
            {new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
            {evt.location?.name && ` · ${evt.location.name.toUpperCase()}`}
          </div>
        </div>

        {/* Share buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginTop: 20 }}>
          {[
            { icon: '📷', label: 'Instagram', color: '#E1306C' },
            { icon: '📘', label: 'Facebook', color: '#1877F2' },
            { icon: '💬', label: 'WhatsApp', color: '#25D366' },
            { icon: '⬇️', label: 'Descargar', color: TZ.inkSoft },
          ].map(s => (
            <button key={s.label} style={{
              padding: '14px 4px', borderRadius: 12, border: 0, cursor: 'pointer',
              background: '#F4F5F8',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 24 }}>{s.icon}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.color }}>{s.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { MatchLive, getMatchState, getPlayerStats });
