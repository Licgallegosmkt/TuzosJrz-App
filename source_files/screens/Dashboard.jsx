// TuzosJrz — Dashboard

function Dashboard({ nav, noBottomPad }) {
  const { PLAYERS, UPCOMING, RECENT_ACTIVITY, paymentsSummary, CATEGORIES } = window.TZ_DATA;
  const pay = paymentsSummary();
  const totalPlayers = PLAYERS.length;
  const injured = PLAYERS.filter(p => p.medical.status !== 'apto').length;
  const avgAttendance = Math.round(PLAYERS.reduce((s, p) => s + p.attendance.rate, 0) / PLAYERS.length);

  return (
    <div style={{ paddingBottom: noBottomPad ? 0 : 100 }}>
      {/* HERO — Pachuca blue with club identity */}
      <div style={{
        background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '54px 20px 24px', position: 'relative', overflow: 'hidden',
        borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
      }}>
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.09, pointerEvents: 'none',
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)',
        }} />
        {/* Soccer ball watermark */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 240, height: 240, borderRadius: '50%',
          border: '2px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', right: 20, top: 40, width: 120, height: 120, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.15)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <button onClick={() => nav('notifications')} style={{ ...iconBtn, position: 'relative' }}>
            <Icon name="bell" size={20} color="#fff" />
            <span style={{
              position: 'absolute', top: 4, right: 4,
              minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
              background: TZ.err, color: '#fff', fontSize: 9, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid ' + TZ.primary,
            }}>3</span>
          </button>
          <button style={iconBtn}>
            <div style={{ width: 28, height: 28, borderRadius: '50%',
              background: '#F5B301', color: TZ.primaryDark, fontSize: 13, fontWeight: 800,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>C</div>
          </button>
        </div>

        {/* Logo oficial + subtítulo */}
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 14, marginTop: 20 }}>
          <ClubCrest size={82} />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, opacity: 0.75 }}>FILIAL OFICIAL DEL CLUB PACHUCA</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F5B301' }} />
              <span style={{ fontSize: 12, opacity: 0.85, letterSpacing: 0.4, fontWeight: 600 }}>Temporada 2026</span>
            </div>
            <div style={{ fontSize: 11, opacity: 0.7, marginTop: 3, fontWeight: 500 }}>Panel administrador</div>
          </div>
        </div>

        <div style={{ position: 'relative', marginTop: 22, fontSize: 15, opacity: 0.85 }}>
          Buen día, <strong style={{ color: '#F5B301' }}>Coach</strong>
        </div>
        <div style={{ position: 'relative', marginTop: 2, fontSize: 20, fontWeight: 600 }}>
          Hoy tienes 2 entrenamientos.
        </div>

        {/* KPI strip */}
        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 22 }}>
          <MiniKpi label="Jugadores" value={totalPlayers} sub={`${CATEGORIES.length} categorías`} />
          <MiniKpi label="Asistencia" value={`${avgAttendance}%`} sub="promedio mes" tone="ok" />
          <MiniKpi label="Por cobrar" value={`$${(pay.porCobrar/1000).toFixed(1)}k`} sub={`${pay.pendiente + pay.atrasado} morosos`} tone={pay.atrasado > 0 ? 'warn' : 'ok'} />
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Quick actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 14 }}>
          <QuickAction icon="check" label="Pasar lista" color={TZ.primary} onClick={() => nav('attend')} />
          <QuickAction icon="money" label="Cobrar" color="#0F766E" onClick={() => nav('payments')} />
          <QuickAction icon="board" label="Pizarra" color="#0F172A" onClick={() => nav('tactics')} />
          <QuickAction icon="plus" label="Nuevo evento" color="#B45309" onClick={() => nav('createEvent')} />
        </div>

        {/* Upcoming */}
        <SectionTitle action={{ label: 'Ver agenda', onClick: () => {} }}>Próximo</SectionTitle>
        <div style={{ display: 'flex', gap: 10, overflowX: 'auto', margin: '0 -16px', padding: '2px 16px 4px' }}>
          {UPCOMING.map(ev => (
            <div key={ev.id} style={{
              minWidth: 220, background: '#fff', borderRadius: 16, padding: 14,
              border: '1px solid ' + TZ.line, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, width: 4, height: '100%',
                background: ev.kind === 'match' ? TZ.gold : TZ.primary,
              }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Chip tone={ev.kind === 'match' ? 'gold' : 'brand'}>
                  {ev.kind === 'match' ? 'PARTIDO' : 'ENTRENO'}
                </Chip>
                <span style={{ fontSize: 11, color: TZ.muted, fontWeight: 600 }}>{ev.category}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: 16, fontWeight: 700, color: TZ.ink }}>{ev.title}</div>
              <div style={{ display: 'flex', gap: 10, marginTop: 8, fontSize: 12, color: TZ.inkSoft }}>
                <span style={{ fontWeight: 700, color: TZ.ink }}>{ev.date}</span>
                <span>·</span>
                <span>{ev.time}</span>
              </div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 4 }}>{ev.place}</div>
            </div>
          ))}
        </div>

        {/* Payments health card */}
        <SectionTitle action={{ label: 'Detalles', onClick: () => nav('payments') }}>Pagos · Septiembre</SectionTitle>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <div style={{ fontSize: 12, color: TZ.muted, fontWeight: 600 }}>Cobrado este mes</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: TZ.ink, letterSpacing: -0.5, marginTop: 2 }}>
                ${pay.cobrado.toLocaleString('es-MX')}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: 12, color: TZ.muted, fontWeight: 600 }}>Meta</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: TZ.inkSoft }}>
                ${(pay.total * 850).toLocaleString('es-MX')}
              </div>
            </div>
          </div>
          {/* stacked bar */}
          <div style={{ display: 'flex', height: 10, borderRadius: 999, overflow: 'hidden', marginTop: 14, background: '#EEF0F4' }}>
            <div style={{ flex: pay.alDia, background: TZ.ok }} />
            <div style={{ flex: pay.pendiente, background: TZ.warn }} />
            <div style={{ flex: pay.atrasado, background: TZ.err }} />
          </div>
          <div style={{ display: 'flex', gap: 14, marginTop: 12, fontSize: 12 }}>
            <LegendDot color={TZ.ok} label="Al día" value={pay.alDia} />
            <LegendDot color={TZ.warn} label="Pendientes" value={pay.pendiente} />
            <LegendDot color={TZ.err} label="Atrasados" value={pay.atrasado} />
          </div>
        </Card>

        {/* Attendance by category */}
        <SectionTitle action={{ label: 'Ver todo', onClick: () => nav('attend') }}>Asistencia por categoría</SectionTitle>
        <Card padded={false}>
          {CATEGORIES.map((cat, i) => {
            const players = PLAYERS.filter(p => p.category === cat);
            const rate = Math.round(players.reduce((s, p) => s + p.attendance.rate, 0) / players.length);
            return (
              <div key={cat} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10, background: 'rgba(29,61,138,0.08)',
                  color: TZ.primary, fontWeight: 800, fontSize: 12,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: 0.5,
                }}>{cat.replace('Sub-', 'U')}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TZ.ink }}>{cat}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: rate > 85 ? TZ.ok : rate > 75 ? TZ.warn : TZ.err }}>
                      {rate}%
                    </span>
                  </div>
                  <div style={{ height: 6, background: '#EEF0F4', borderRadius: 999, marginTop: 6, overflow: 'hidden' }}>
                    <div style={{ width: `${rate}%`, height: '100%',
                      background: rate > 85 ? TZ.ok : rate > 75 ? TZ.warn : TZ.err }} />
                  </div>
                </div>
                <div style={{ fontSize: 11, color: TZ.muted, minWidth: 42, textAlign: 'right' }}>{players.length} jug.</div>
              </div>
            );
          })}
        </Card>

        {/* Medical alerts */}
        {injured > 0 && (
          <>
            <SectionTitle>Área médica</SectionTitle>
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(220,38,38,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.err }}>
                  <Icon name="medical" size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{injured} jugadores en seguimiento</div>
                  <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>Revisa estatus y notas del fisio</div>
                </div>
                <Icon name="chevron" size={18} color={TZ.muted} />
              </div>
            </Card>
          </>
        )}

        {/* Birthdays this month */}
        <BirthdaysBlock />

        {/* Recent activity */}
        <SectionTitle>Actividad reciente</SectionTitle>
        <Card padded={false}>
          {RECENT_ACTIVITY.map((a, i) => (
            <div key={a.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
            }}>
              <div style={{ fontSize: 22 }}>{a.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.text}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{a.meta}</div>
              </div>
              <span style={{ fontSize: 10, color: TZ.muted, fontWeight: 600 }}>{a.when}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

const iconBtn = {
  width: 40, height: 40, borderRadius: '50%', border: 0,
  background: 'rgba(255,255,255,0.15)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
};

function MiniKpi({ label, value, sub, tone }) {
  const toneColor = tone === 'ok' ? '#86EFAC' : tone === 'warn' ? '#FCD34D' : '#fff';
  return (
    <div style={{
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
      borderRadius: 12, padding: '10px 12px',
      border: '1px solid rgba(255,255,255,0.15)',
    }}>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, opacity: 0.8 }}>{label.toUpperCase()}</div>
      <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5, marginTop: 2, color: toneColor }}>{value}</div>
      <div style={{ fontSize: 10, opacity: 0.7, marginTop: 1 }}>{sub}</div>
    </div>
  );
}

function QuickAction({ icon, label, color, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14,
      padding: '12px 6px 10px', cursor: 'pointer', display: 'flex', flexDirection: 'column',
      alignItems: 'center', gap: 6,
      boxShadow: '0 1px 2px rgba(15,23,42,0.04)',
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: color, color: '#fff',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon name={icon} size={20} color="#fff" />
      </div>
      <span style={{ fontSize: 11, fontWeight: 600, color: TZ.ink }}>{label}</span>
    </button>
  );
}

function LegendDot({ color, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
      <span style={{ color: TZ.inkSoft }}>{label}</span>
      <strong style={{ color: TZ.ink }}>{value}</strong>
    </div>
  );
}

// Club crest — TuzosJrz monogram, no background
function ClubCrest({ size = 78 }) {
  return (
    <div style={{
      position: 'relative', width: size, height: size, flexShrink: 0,
    }}>
      <img src="assets/tuzosjrz-logo.png" alt="TuzosJrz"
        style={{
          width: '100%', height: '100%', objectFit: 'contain', display: 'block',
          filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.3))',
        }} />
    </div>
  );
}

// ── Birthdays block (this month's players) ─────────────────
function BirthdaysBlock() {
  const now = new Date(2026, 8, 21); // simulate today = Sep 21, 2026
  const thisMonth = window.TZ_DATA.birthdaysThisMonth(now.getMonth());
  const months = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];
  const monthLong = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'][now.getMonth()];

  if (thisMonth.length === 0) return null;

  // Split into upcoming (>= today) and past
  const upcoming = thisMonth.filter(p => p.birthDay >= now.getDate());
  const past = thisMonth.filter(p => p.birthDay < now.getDate());
  const nextOne = upcoming[0];

  return (
    <>
      <SectionTitle>🎂 Cumpleañeros de {monthLong}</SectionTitle>
      <div style={{
        background: `linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)`,
        borderRadius: 16, padding: 14, position: 'relative', overflow: 'hidden',
        border: '1px solid #FCD34D',
      }}>
        {/* Confetti decoration */}
        <div style={{ position: 'absolute', top: -12, right: -6, fontSize: 60, opacity: 0.15, pointerEvents: 'none' }}>🎉</div>
        <div style={{ position: 'absolute', bottom: -18, left: -8, fontSize: 44, opacity: 0.12, pointerEvents: 'none' }}>🎈</div>

        {nextOne && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, position: 'relative' }}>
            <div style={{
              width: 54, height: 54, borderRadius: 12, background: '#fff', textAlign: 'center',
              padding: '6px 0', flexShrink: 0, boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
            }}>
              <div style={{ fontSize: 9, fontWeight: 800, color: '#B45309', letterSpacing: 1 }}>{months[now.getMonth()]}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#78350F', lineHeight: 1 }}>{nextOne.birthDay}</div>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#B45309', letterSpacing: 1, textTransform: 'uppercase' }}>Próximo cumpleaños</div>
              <div style={{ fontSize: 16, fontWeight: 800, color: '#78350F', marginTop: 2 }}>{nextOne.name}</div>
              <div style={{ fontSize: 11, color: '#92400E', marginTop: 2 }}>
                {nextOne.category} · Cumple {2026 - nextOne.birthYear + 1} años · {daysUntilLabel(nextOne, now)}
              </div>
            </div>
          </div>
        )}

        {/* Rest of the month — compact chips */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: nextOne ? 12 : 0 }}>
          {[...upcoming.slice(1), ...past].slice(0, 8).map(p => {
            const isPast = p.birthDay < now.getDate();
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,0.7)', borderRadius: 999, padding: '4px 8px 4px 4px',
                opacity: isPast ? 0.55 : 1,
              }}>
                <Avatar player={p} size={22} showNumber={false} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#78350F' }}>
                  {p.first} · {p.birthDay}
                </span>
              </div>
            );
          })}
          {(upcoming.length + past.length) > 9 && (
            <div style={{
              background: 'rgba(255,255,255,0.7)', borderRadius: 999, padding: '4px 10px',
              fontSize: 11, fontWeight: 700, color: '#78350F',
            }}>+{(upcoming.length + past.length) - 9} más</div>
          )}
        </div>
      </div>
    </>
  );
}

function daysUntilLabel(p, now) {
  if (p.birthDay === now.getDate()) return '¡Hoy!';
  if (p.birthDay === now.getDate() + 1) return 'Mañana';
  return `En ${p.birthDay - now.getDate()} días`;
}

Object.assign(window, { Dashboard, ClubCrest, BirthdaysBlock });
