// TuzosJrz — Admin panel: parent requests + invite modal

const PENDING_REQUESTS = [
  { id: 1, first: 'Lucía',   last: 'Ramírez',  relation: 'Madre', child: 'Mateo Ramírez',    childCat: 'Sub-10', childId: 15, when: 'hace 2 h',  phone: '+52 771 456 7890', email: 'lucia.rmz@correo.mx', code: 'TZ-8821' },
  { id: 2, first: 'Roberto', last: 'García',   relation: 'Padre', child: 'Bruno García',     childCat: 'Sub-14', childId: 45, when: 'hace 5 h',  phone: '+52 771 234 5566', email: 'r.garcia@correo.mx',  code: 'TZ-5017' },
  { id: 3, first: 'Ana',     last: 'Mendoza',  relation: 'Madre', child: 'Iker Mendoza',     childCat: 'Sub-8',  childId: 4,  when: 'ayer',       phone: '+52 771 999 1122', email: 'a.mendoza@correo.mx', code: 'TZ-3390' },
  { id: 4, first: 'Fernando',last: 'Torres',   relation: 'Tutor', child: 'Kevin Torres',     childCat: 'Sub-12', childId: 22, when: 'ayer',       phone: '+52 771 700 2211', email: 'f.torres@correo.mx',  code: 'TZ-6748' },
];

function AdminInvites({ nav }) {
  const [modal, setModal] = React.useState(null); // 'invite' | { requestId }
  const [processed, setProcessed] = React.useState({}); // reqId -> 'approved' | 'rejected'

  const pending = PENDING_REQUESTS.filter(r => !processed[r.id]);

  return (
    <div style={{ paddingBottom: 100 }}>
      <ScreenHeader
        title="Tutores"
        subtitle="Solicitudes y accesos"
        right={
          <button onClick={() => setModal('invite')} style={{
            padding: '8px 12px', borderRadius: 999, border: 0,
            background: TZ.primary, color: '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            boxShadow: '0 2px 6px rgba(29,61,138,0.35)',
          }}>
            <Icon name="plus" size={14} color="#fff" />
            Invitar
          </button>
        }
      />

      <div style={{ padding: '0 16px' }}>
        {/* Summary strip */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          <MiniStat label="Pendientes" value={pending.length} color={TZ.warn} bg="#FFFBEB" />
          <MiniStat label="Aprobados" value="128" color={TZ.ok} bg="#F0FDF4" />
          <MiniStat label="Rechazados" value="3" color={TZ.err} bg="#FEF2F2" />
        </div>

        <SectionTitle>Solicitudes pendientes</SectionTitle>
        {pending.length === 0 ? (
          <Card>
            <div style={{ textAlign: 'center', padding: 20, color: TZ.muted, fontSize: 13 }}>
              No hay solicitudes pendientes 🎉
            </div>
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {pending.map(r => (
              <Card key={r.id} padded={false}>
                <div style={{ padding: 14 }}>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: `linear-gradient(135deg, hsl(${(r.id * 87) % 360} 55% 55%), hsl(${((r.id * 87) + 40) % 360} 60% 40%))`,
                      color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: 15, flexShrink: 0,
                    }}>{r.first[0]}{r.last[0]}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontSize: 14, fontWeight: 700, color: TZ.ink,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.first} {r.last}</span>
                        <span style={{ fontSize: 10, color: TZ.muted, fontWeight: 600, flexShrink: 0 }}>{r.when}</span>
                      </div>
                      <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2 }}>
                        {r.relation} · {r.phone}
                      </div>
                      <div style={{
                        marginTop: 10, padding: '8px 10px', background: '#F4F5F8', borderRadius: 8,
                        display: 'flex', alignItems: 'center', gap: 8,
                      }}>
                        <Icon name="users" size={14} color={TZ.inkSoft} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 10, color: TZ.muted, fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase' }}>Se vincula con</div>
                          <div style={{ fontSize: 12, fontWeight: 700, color: TZ.ink,
                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.child} · {r.childCat}</div>
                        </div>
                        <Chip tone="brand">{r.code}</Chip>
                      </div>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid ' + TZ.line }}>
                  <button style={ghostBtn}>
                    <Icon name="doc" size={14} color={TZ.inkSoft} />
                    Ver detalles
                  </button>
                  <button onClick={() => setProcessed(p => ({ ...p, [r.id]: 'rejected' }))} style={{ ...ghostBtn, borderLeft: '1px solid ' + TZ.line, color: TZ.err }}>
                    <Icon name="close" size={14} color={TZ.err} />
                    Rechazar
                  </button>
                  <button onClick={() => setProcessed(p => ({ ...p, [r.id]: 'approved' }))} style={{
                    padding: '12px', border: 0, borderLeft: '1px solid ' + TZ.line,
                    background: TZ.primary, color: '#fff',
                    fontSize: 12, fontWeight: 700, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                  }}>
                    <Icon name="check" size={14} color="#fff" />
                    Aprobar
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}

        <SectionTitle action={{ label: 'Ver todos', onClick: () => {} }}>Tutores activos</SectionTitle>
        <Card padded={false}>
          {[
            { n: 'Carlos Hernández', child: 'Diego Hernández', cat: 'Sub-12' },
            { n: 'María López',      child: 'Alan López',      cat: 'Sub-14' },
            { n: 'Jorge Cruz',       child: 'Sebastián Cruz',  cat: 'Sub-10' },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
              borderTop: i === 0 ? 0 : '1px solid ' + TZ.line,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: '50%',
                background: `linear-gradient(135deg, hsl(${(i * 91 + 40) % 360} 55% 55%), hsl(${(i * 91 + 80) % 360} 60% 40%))`,
                color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 800, fontSize: 13, flexShrink: 0,
              }}>{t.n.split(' ').map(x => x[0]).slice(0,2).join('')}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TZ.ink }}>{t.n}</div>
                <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>{t.child} · {t.cat}</div>
              </div>
              <Chip tone="ok">Activo</Chip>
            </div>
          ))}
        </Card>
      </div>

      {modal === 'invite' && <InviteModal onClose={() => setModal(null)} />}
    </div>
  );
}

function InviteModal({ onClose }) {
  const [copied, setCopied] = React.useState('');
  const code = 'TZ-4291';
  const link = `tuzosjrz.app/i/${code.toLowerCase()}`;
  const msg = `Hola 👋 Te invitamos al portal de padres de *TuzosJrz*.\n\nCon esta liga podrás vincular tu cuenta con tu hijo/a en el club:\n\n🔗 ${link}\nCódigo: ${code}\n\nUn saludo,\nTuzosJrz — Filial oficial del Club Pachuca 💛💙`;

  const copy = (what, val) => {
    navigator.clipboard?.writeText(val);
    setCopied(what);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div style={{
      position: 'absolute', inset: 0, zIndex: 100,
      background: 'rgba(15,23,42,0.5)', display: 'flex', alignItems: 'flex-end',
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', background: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        padding: '10px 20px 44px', maxHeight: '90%', overflow: 'auto',
      }}>
        <div style={{ width: 40, height: 4, background: '#D1D5DB', borderRadius: 999, margin: '4px auto 14px' }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: TZ.ink }}>Invitar tutor</div>
            <div style={{ fontSize: 12, color: TZ.muted, marginTop: 2 }}>Envía el link por WhatsApp</div>
          </div>
          <button onClick={onClose} style={{
            width: 32, height: 32, borderRadius: '50%', border: 0, background: '#EEF0F4', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="close" size={16} color={TZ.inkSoft} />
          </button>
        </div>

        {/* Player pick */}
        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
          Jugador a vincular
        </div>
        <div style={{
          padding: 12, border: '1px solid ' + TZ.line, borderRadius: 12,
          display: 'flex', alignItems: 'center', gap: 12,
          background: '#F4F5F8',
        }}>
          <Avatar player={window.TZ_DATA.PLAYERS[0]} size={40} showNumber={false} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: TZ.ink }}>Diego Hernández</div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 1 }}>Sub-12 · #7</div>
          </div>
          <button style={{
            fontSize: 12, fontWeight: 700, color: TZ.primary, background: 'transparent', border: 0, cursor: 'pointer',
          }}>Cambiar</button>
        </div>

        {/* Link + code */}
        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
          Link de invitación
        </div>
        <button onClick={() => copy('link', link)} style={{
          width: '100%', padding: '12px 14px', border: '1.5px solid ' + TZ.line, borderRadius: 12,
          background: '#fff', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left',
        }}>
          <Icon name="doc" size={16} color={TZ.inkSoft} />
          <div style={{ flex: 1, minWidth: 0, fontSize: 13, color: TZ.ink,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link}</div>
          <span style={{ fontSize: 12, fontWeight: 700, color: copied === 'link' ? TZ.ok : TZ.primary }}>
            {copied === 'link' ? '✓ Copiado' : 'Copiar'}
          </span>
        </button>

        <div style={{ margin: '14px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
          Código
        </div>
        <button onClick={() => copy('code', code)} style={{
          width: '100%', padding: '18px 14px', border: '1.5px dashed ' + TZ.primary, borderRadius: 12,
          background: 'rgba(29,61,138,0.03)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <span style={{
            fontFamily: '"Barlow Condensed", monospace', fontSize: 26, fontWeight: 800,
            color: TZ.primary, letterSpacing: 4,
          }}>{code}</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: copied === 'code' ? TZ.ok : TZ.primary }}>
            {copied === 'code' ? '✓' : 'Copiar'}
          </span>
        </button>

        {/* Message preview */}
        <div style={{ margin: '18px 0 6px', fontSize: 11, fontWeight: 700, color: TZ.muted, letterSpacing: 0.8, textTransform: 'uppercase' }}>
          Vista previa del mensaje
        </div>
        <div style={{
          padding: 14, background: '#E5DDD5',
          borderRadius: 14, position: 'relative',
        }}>
          <div style={{
            background: '#DCF8C6', padding: '10px 12px', borderRadius: 10,
            fontSize: 12, color: '#111', whiteSpace: 'pre-wrap', lineHeight: 1.5,
            boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
          }}>
            {msg}
            <div style={{ fontSize: 10, color: '#666', textAlign: 'right', marginTop: 4 }}>10:24 ✓✓</div>
          </div>
        </div>

        {/* Send */}
        <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
          <button onClick={() => copy('msg', msg)} style={{
            flex: 1, padding: '14px', borderRadius: 12,
            background: '#EEF0F4', color: TZ.ink, border: 0,
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
          }}>{copied === 'msg' ? '✓ Copiado' : 'Copiar mensaje'}</button>
          <button style={{
            flex: 2, padding: '14px', borderRadius: 12,
            background: '#25D366', color: '#fff', border: 0,
            fontSize: 14, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            boxShadow: '0 4px 12px rgba(37,211,102,0.4)',
          }}>
            <WhatsAppIcon />
            Enviar por WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, color, bg }) {
  return (
    <div style={{ background: bg, borderRadius: 12, padding: '12px 10px', textAlign: 'center' }}>
      <div style={{ fontSize: 22, fontWeight: 800, color, letterSpacing: -0.5, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 10, color: TZ.inkSoft, fontWeight: 700, marginTop: 4, textTransform: 'uppercase', letterSpacing: 0.6 }}>{label}</div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.4.5-.6.2-.2.2-.3.3-.5.1-.2.1-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.8.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.2.2 2.2 3.4 5.4 4.7 1.9.7 2.6.8 3.6.6.6-.1 1.8-.7 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.7-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.3c1.4.8 3.1 1.3 4.8 1.3 5.5 0 10-4.5 10-10S17.5 2 12 2z"/>
    </svg>
  );
}

const ghostBtn = {
  padding: '12px', border: 0, background: '#fff',
  color: TZ.inkSoft, fontSize: 12, fontWeight: 700, cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
};

Object.assign(window, { AdminInvites, PENDING_REQUESTS });
