// TuzosJrz — Admin reports & exports

const REPORTS = [
  {
    id: 'attendance', icon: '📋', color: '#0F766E',
    title: 'Asistencia mensual',
    desc: 'Reporte por categoría con promedios, top y bottom asistentes',
    sample: 'attendance',
  },
  {
    id: 'cobranza', icon: '💰', color: TZ.primary,
    title: 'Estado de cobranza',
    desc: 'Al día, pendientes, atrasados y proyección del mes',
    sample: 'money',
  },
  {
    id: 'medical', icon: '🩹', color: '#DC2626',
    title: 'Estado médico general',
    desc: 'Aptos, en recuperación y lesionados; historial de lesiones',
    sample: 'medical',
  },
  {
    id: 'roster', icon: '👥', color: '#7C3AED',
    title: 'Roster completo del club',
    desc: 'Todos los jugadores con datos de contacto y tutor',
    sample: 'roster',
  },
  {
    id: 'performance', icon: '⚽', color: '#B45309',
    title: 'Rendimiento por categoría',
    desc: 'Partidos jugados, resultados y estadísticas',
    sample: 'perf',
  },
];

function AdminReports({ back }) {
  const [preview, setPreview] = React.useState(null);

  return (
    <div style={{ paddingBottom: 100 }}>
      <div style={{
        padding: '54px 20px 18px', background: `linear-gradient(155deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <button onClick={back} style={{
            width: 40, height: 40, borderRadius: '50%', border: 0,
            background: 'rgba(255,255,255,0.15)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="chevronL" size={20} color="#fff" />
          </button>
          <button style={{
            padding: '10px 14px', borderRadius: 999, border: 0,
            background: 'rgba(255,255,255,0.15)', color: '#fff',
            fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <Icon name="calendar" size={14} color="#fff" />
            Sep 2026
          </button>
        </div>
        <div style={{ position: 'relative', marginTop: 14 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, fontWeight: 700, opacity: 0.75 }}>ADMINISTRACIÓN</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.5, marginTop: 2 }}>Reportes</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>Exporta a PDF o Excel y compártelos con el club</div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <SectionTitle>Reportes disponibles</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {REPORTS.map(r => (
            <ReportCard key={r.id} r={r} onOpen={() => setPreview(r)} />
          ))}
        </div>

        <SectionTitle>Envíos automáticos programados</SectionTitle>
        <Card padded={false}>
          {[
            { title: 'Estado de cobranza', freq: 'Primer día del mes', to: 'Directiva del club', on: true },
            { title: 'Asistencia semanal', freq: 'Cada lunes 08:00', to: 'Coordinación deportiva', on: true },
            { title: 'Alertas médicas', freq: 'Al detectar lesión', to: 'Fisio + coach', on: false },
          ].map((s, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
            }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, background: 'rgba(29,61,138,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', color: TZ.primary,
              }}>
                <Icon name="mail" size={16} color={TZ.primary} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>{s.title}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>{s.freq} · {s.to}</div>
              </div>
              <MiniSwitch on={s.on} />
            </div>
          ))}
        </Card>
      </div>

      {preview && <ReportPreview report={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function ReportCard({ r, onOpen }) {
  return (
    <div style={{
      background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 14,
      padding: 14, cursor: 'pointer',
      display: 'flex', gap: 14, alignItems: 'center',
    }} onClick={onOpen}>
      <div style={{
        width: 48, height: 48, borderRadius: 12,
        background: r.color + '15', color: r.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24, flexShrink: 0,
      }}>{r.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: TZ.ink }}>{r.title}</div>
        <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3, lineHeight: 1.4 }}>{r.desc}</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <MiniExportBadge icon="📄" label="PDF" />
          <MiniExportBadge icon="📊" label="Excel" />
        </div>
      </div>
      <Icon name="chevron" size={16} color={TZ.muted} />
    </div>
  );
}

function MiniExportBadge({ icon, label }) {
  return (
    <span style={{
      padding: '3px 8px', borderRadius: 6, background: '#F4F5F8',
      fontSize: 10, fontWeight: 700, color: TZ.inkSoft, letterSpacing: 0.3,
      display: 'inline-flex', alignItems: 'center', gap: 3,
    }}>{icon} {label}</span>
  );
}

function MiniSwitch({ on: initial }) {
  const [on, setOn] = React.useState(initial);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: 40, height: 24, borderRadius: 12, border: 0, cursor: 'pointer',
      background: on ? TZ.primary : '#D1D5DB', position: 'relative',
      transition: 'background 0.15s', flexShrink: 0,
    }}>
      <div style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'left 0.15s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
}

// ── Report preview sheet ──────────────────────────────────────
function ReportPreview({ report: r, onClose }) {
  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 0 0', maxHeight: '92%', display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />
        <div style={{ padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: r.color + '15',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
          }}>{r.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TZ.ink }}>{r.title}</div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>Vista previa · Septiembre 2026</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="close" size={16} color={TZ.inkSoft} />
          </button>
        </div>

        {/* Preview content — mock document */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px 20px' }}>
          <div style={{
            background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
            padding: 20, boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            {/* Document header */}
            <div style={{ borderBottom: '2px solid ' + TZ.primary, paddingBottom: 12, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', background: '#F5B301',
                  color: TZ.primaryDark, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 800, fontSize: 15,
                }}>TJ</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.2, fontWeight: 700, color: TZ.muted }}>TUZOSJRZ · FILIAL OFICIAL DEL CLUB PACHUCA</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: TZ.ink }}>{r.title}</div>
                </div>
              </div>
              <div style={{ fontSize: 10, color: TZ.muted, marginTop: 8 }}>
                Periodo: 1 – 30 Sep 2026 · Generado 21 Sep 2026 · Admin
              </div>
            </div>

            {r.sample === 'attendance' && <SampleAttendance />}
            {r.sample === 'money' && <SampleMoney />}
            {r.sample === 'medical' && <SampleMedical />}
            {r.sample === 'roster' && <SampleRoster />}
            {r.sample === 'perf' && <SamplePerformance />}
          </div>
        </div>

        {/* Export actions */}
        <div style={{
          padding: '14px 20px 34px', borderTop: '1px solid ' + TZ.line, background: '#fff',
          display: 'flex', gap: 10,
        }}>
          <button style={{
            flex: 1, padding: '13px', borderRadius: 12,
            background: '#DC2626', color: '#fff', border: 0,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            📄 Descargar PDF
          </button>
          <button style={{
            flex: 1, padding: '13px', borderRadius: 12,
            background: '#0F766E', color: '#fff', border: 0,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
            📊 Descargar Excel
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Preview content samples ──────────────────────────────────
function SampleAttendance() {
  const { CATEGORIES, PLAYERS } = window.TZ_DATA;
  const rows = CATEGORIES.map(c => {
    const p = PLAYERS.filter(x => x.category === c);
    const avg = Math.round(p.reduce((s, x) => s + x.attendance.rate, 0) / p.length);
    return { cat: c, size: p.length, avg };
  });
  return (
    <>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.inkSoft, marginBottom: 8, letterSpacing: 0.5, textTransform: 'uppercase' }}>Promedio por categoría</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {rows.map(r => (
          <div key={r.cat} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12 }}>
            <div style={{ width: 60, fontWeight: 700, color: TZ.ink }}>{r.cat}</div>
            <div style={{ flex: 1, height: 8, background: '#F4F5F8', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ width: r.avg + '%', height: '100%', background: r.avg > 85 ? TZ.ok : r.avg > 75 ? TZ.warn : TZ.err }} />
            </div>
            <div style={{ width: 40, textAlign: 'right', fontWeight: 700, color: TZ.ink }}>{r.avg}%</div>
            <div style={{ width: 30, textAlign: 'right', color: TZ.muted, fontSize: 10 }}>{r.size}p</div>
          </div>
        ))}
      </div>
      <div style={{ margin: '16px 0 8px', fontSize: 11, fontWeight: 700, color: TZ.inkSoft, letterSpacing: 0.5, textTransform: 'uppercase' }}>Top asistentes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {PLAYERS.slice(0, 5).sort((a, b) => b.attendance.rate - a.attendance.rate).map((p, i) => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
            <span style={{ width: 18, color: TZ.muted, fontWeight: 700 }}>{i + 1}.</span>
            <span style={{ flex: 1, color: TZ.ink }}>{p.name}</span>
            <span style={{ color: TZ.muted, fontSize: 10 }}>{p.category}</span>
            <span style={{ width: 40, textAlign: 'right', fontWeight: 700, color: TZ.ok }}>{p.attendance.rate}%</span>
          </div>
        ))}
      </div>
    </>
  );
}

function SampleMoney() {
  const s = window.TZ_DATA.paymentsSummary();
  const pct = Math.round(s.cobrado / (s.total * 850) * 100);
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
        <div style={{ padding: 12, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#166534', letterSpacing: 0.5 }}>COBRADO</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#166534', marginTop: 3 }}>${s.cobrado.toLocaleString('es-MX')}</div>
        </div>
        <div style={{ padding: 12, background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#78350F', letterSpacing: 0.5 }}>POR COBRAR</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: '#78350F', marginTop: 3 }}>${s.porCobrar.toLocaleString('es-MX')}</div>
        </div>
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.inkSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>Distribución ({pct}% cumplido)</div>
      <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ flex: s.alDia, background: TZ.ok }} />
        <div style={{ flex: s.pendiente, background: TZ.warn }} />
        <div style={{ flex: s.atrasado, background: TZ.err }} />
      </div>
      <div style={{ display: 'flex', gap: 14, fontSize: 11 }}>
        <span><strong style={{ color: TZ.ok }}>{s.alDia}</strong> al día</span>
        <span><strong style={{ color: TZ.warn }}>{s.pendiente}</strong> pendientes</span>
        <span><strong style={{ color: TZ.err }}>{s.atrasado}</strong> atrasados</span>
      </div>
    </>
  );
}

function SampleMedical() {
  const p = window.TZ_DATA.PLAYERS;
  const aptos = p.filter(x => x.medical.status === 'apto').length;
  const recup = p.filter(x => x.medical.status === 'recuperacion').length;
  const lesionados = p.filter(x => x.medical.status === 'lesionado').length;
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 14 }}>
        <StatBadge label="Aptos" value={aptos} color={TZ.ok} bg="#F0FDF4" />
        <StatBadge label="Recuperación" value={recup} color={TZ.warn} bg="#FFFBEB" />
        <StatBadge label="Lesionados" value={lesionados} color={TZ.err} bg="#FEF2F2" />
      </div>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.inkSoft, marginBottom: 6, letterSpacing: 0.5, textTransform: 'uppercase' }}>Casos activos</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {p.filter(x => x.medical.status !== 'apto').slice(0, 5).map(pl => (
          <div key={pl.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11 }}>
            <StatusDot tone={pl.medical.status === 'lesionado' ? 'err' : 'warn'} />
            <span style={{ flex: 1, color: TZ.ink }}>{pl.name}</span>
            <span style={{ color: TZ.muted, fontSize: 10 }}>{pl.category}</span>
            <span style={{ fontWeight: 700, color: pl.medical.status === 'lesionado' ? TZ.err : TZ.warn }}>
              {pl.medical.status === 'lesionado' ? 'Lesión' : 'Recup.'}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

function SampleRoster() {
  const p = window.TZ_DATA.PLAYERS;
  return (
    <>
      <div style={{ fontSize: 11, color: TZ.muted, marginBottom: 10 }}>
        {p.length} jugadores en total · Contactos, tutor, documentos
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {p.slice(0, 8).map(pl => (
          <div key={pl.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, padding: '6px 0', borderBottom: '1px solid ' + TZ.line }}>
            <span style={{ width: 20, color: TZ.muted, fontWeight: 700 }}>#{pl.number}</span>
            <span style={{ flex: 1, color: TZ.ink, fontWeight: 600 }}>{pl.name}</span>
            <span style={{ color: TZ.muted, fontSize: 10 }}>{pl.category}</span>
            <span style={{ color: TZ.muted, fontSize: 10, width: 40, textAlign: 'right' }}>{pl.position}</span>
          </div>
        ))}
        <div style={{ fontSize: 11, color: TZ.muted, textAlign: 'center', marginTop: 6, fontStyle: 'italic' }}>
          … y {p.length - 8} más en el reporte completo
        </div>
      </div>
    </>
  );
}

function SamplePerformance() {
  return (
    <>
      <div style={{ fontSize: 11, fontWeight: 700, color: TZ.inkSoft, marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>Últimos 4 partidos por categoría</div>
      {window.TZ_DATA.CATEGORIES.map(c => (
        <div key={c} style={{ padding: '8px 0', borderBottom: '1px solid ' + TZ.line, display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ width: 50, fontSize: 12, fontWeight: 700, color: TZ.ink }}>{c}</span>
          <div style={{ display: 'flex', gap: 3, flex: 1 }}>
            {['G','G','E','P'].map((r, i) => (
              <span key={i} style={{
                width: 22, height: 22, borderRadius: 4,
                background: r === 'G' ? TZ.ok : r === 'E' ? TZ.muted : TZ.err,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 800,
              }}>{r}</span>
            ))}
          </div>
          <span style={{ fontSize: 11, color: TZ.ok, fontWeight: 700 }}>2G</span>
          <span style={{ fontSize: 10, color: TZ.muted }}>·</span>
          <span style={{ fontSize: 11, color: TZ.err, fontWeight: 700 }}>1P</span>
        </div>
      ))}
    </>
  );
}

function StatBadge({ label, value, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 8, padding: '10px 8px', textAlign: 'center' }}>
      <div style={{ fontSize: 18, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 9, color, fontWeight: 700, marginTop: 3, letterSpacing: 0.4, textTransform: 'uppercase' }}>{label}</div>
    </div>
  );
}

Object.assign(window, { AdminReports });
