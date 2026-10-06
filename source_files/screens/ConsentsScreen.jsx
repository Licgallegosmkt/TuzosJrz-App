// TuzosJrz — Pantalla de consentimientos legales
// Se muestra después del registro, antes de mandar la solicitud a revisión

function ConsentsScreen({ onSubmit, back }) {
  // 3 documentos consolidados — todos obligatorios
  const REQUIRED = [
    { id: 'reglamento',
      icon: '📋',
      title: 'Reglamento Interno',
      subtitle: 'Normas del club, conducta, uniforme, disciplina',
      short: 'Acepto el Reglamento Interno completo de TuzosJrz, que rige la operación del club: obligaciones del alumno, del tutor, del staff, conducta en la banca, uniforme oficial, disciplina, sanciones, uso de imagen y todos los aspectos operativos.',
      doc: 'reglamento',
      keyPoints: [
        'Uniforme original obligatorio (sin excepciones)',
        'NO gritar instrucciones desde la banca',
        'NO comentarios negativos del club en redes',
        'Autorización médica de emergencia',
        'TuzosJrz es entidad independiente de Pachuca',
      ],
    },
    { id: 'privacidad',
      icon: '🔒',
      title: 'Aviso de Privacidad',
      subtitle: 'Uso de datos personales y del menor',
      short: 'Autorizo el tratamiento de mis datos personales y los de mi hijo(a), incluyendo datos sensibles de salud e imagen, conforme a la LFPDPPP. Autorizo atención médica de emergencia y el uso de imagen en actividades oficiales del club. Puedo ejercer derechos ARCO en cualquier momento.',
      doc: 'privacidad',
      keyPoints: [
        'Datos de salud del menor (para atención de emergencia)',
        'Fotos y videos en RRSS y material del club',
        'Compartir con Pachuca para scouting deportivo',
        'Puedo pedir acceso/rectificación/cancelación en cualquier momento',
      ],
    },
    { id: 'financiero',
      icon: '💰',
      title: 'Reglamento Financiero',
      subtitle: 'Cuotas, pagos, moras, bajas',
      short: 'Acepto las condiciones económicas del club: cuota mensual pagada en los primeros 5 días hábiles, suspensión del alumno por mora mayor a 2 meses (con generación continua de cuotas), sin devoluciones por bajas voluntarias, sin descuentos por vacaciones o faltas.',
      doc: 'financiero',
      keyPoints: [
        'Pago dentro de los primeros 5 días hábiles del mes',
        'Suspensión si atraso > 2 meses (cuota se sigue generando)',
        'Sin reembolsos por baja voluntaria',
        'Uniformes adicionales son pago independiente',
      ],
    },
  ];

  const [checks, setChecks] = React.useState({});
  const [docModal, setDocModal] = React.useState(null);
  const [confirmed, setConfirmed] = React.useState(false);
  const [expandedKeys, setExpandedKeys] = React.useState({});

  const toggle = (id) => setChecks(c => ({ ...c, [id]: !c[id] }));
  const toggleKeys = (id) => setExpandedKeys(k => ({ ...k, [id]: !k[id] }));

  const requiredAccepted = REQUIRED.filter(r => checks[r.id]).length;
  const totalRequired = REQUIRED.length;

  const canContinue = requiredAccepted === totalRequired;

  const pct = Math.round((requiredAccepted / totalRequired) * 100);

  return (
    <div style={{ minHeight: '100%', paddingBottom: 130 }}>
      {/* Hero */}
      <div style={{
        background: `linear-gradient(160deg, ${TZ.primary} 0%, ${TZ.primaryDark} 100%)`,
        color: '#fff', padding: '22px 20px 24px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.08,
          backgroundImage: 'repeating-linear-gradient(115deg, #fff 0 2px, transparent 2px 22px)' }} />

        <button onClick={back} style={{
          background: 'transparent', border: 0, cursor: 'pointer',
          color: '#F5B301', fontSize: 13, fontWeight: 700, padding: 0, marginBottom: 10,
          display: 'flex', alignItems: 'center', gap: 4,
        }}>
          ← Regresar
        </button>

        <div style={{ position: 'relative' }}>
          <div style={{ fontSize: 11, letterSpacing: 1.5, fontWeight: 700, color: '#F5B301' }}>
            PASO 3 DE 4
          </div>
          <h1 style={{ margin: '4px 0 0', fontSize: 26, fontWeight: 800, letterSpacing: -0.5 }}>
            Antes de comenzar
          </h1>
          <div style={{ marginTop: 10, fontSize: 14, opacity: 0.9, lineHeight: 1.5 }}>
            Lee y acepta estos <strong>3 documentos</strong> para completar tu inscripción. Toca cada uno para leer el contenido completo.
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ marginTop: 18, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.85 }}>
              {requiredAccepted} de {totalRequired} aceptados
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: canContinue ? '#86EFAC' : '#F5B301' }}>
              {canContinue ? '✓ Listo' : `Falta${totalRequired - requiredAccepted === 1 ? '' : 'n'} ${totalRequired - requiredAccepted}`}
            </span>
          </div>
          <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', borderRadius: 999, overflow: 'hidden' }}>
            <div style={{
              width: `${pct}%`, height: '100%',
              background: canContinue ? 'linear-gradient(90deg, #22C55E, #86EFAC)' : '#F5B301',
              transition: 'width 0.3s',
              boxShadow: canContinue ? '0 0 12px rgba(134,239,172,0.5)' : 'none',
            }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        {/* Info banner */}
        <div style={{
          marginTop: 18, padding: '12px 14px',
          background: '#EFF6FF', border: '1px solid #DBEAFE',
          borderRadius: 12, display: 'flex', gap: 10,
        }}>
          <div style={{ fontSize: 20, flexShrink: 0 }}>💡</div>
          <div style={{ flex: 1, fontSize: 12, color: '#1E3A8A', lineHeight: 1.5 }}>
            Toca <strong>"Leer completo"</strong> para ver el documento oficial. Tu aceptación queda registrada con fecha, hora, IP y versión — es tu acuse legal.
          </div>
        </div>

        {/* 3 documents */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }}>
          {REQUIRED.map(item => (
            <DocumentCard key={item.id}
              item={item}
              accepted={!!checks[item.id]}
              onToggle={() => toggle(item.id)}
              onOpenDoc={() => setDocModal(item.doc)}
              expanded={!!expandedKeys[item.id]}
              onToggleExpand={() => toggleKeys(item.id)} />
          ))}
        </div>

        {/* Summary before submit */}
        <div style={{
          marginTop: 22, padding: 16,
          background: canContinue ? '#F0FDF4' : '#FFFBEB',
          border: '1px solid ' + (canContinue ? '#BBF7D0' : '#FDE68A'),
          borderRadius: 14,
        }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: canContinue ? '#166534' : '#92400E', marginBottom: 6 }}>
            {canContinue ? '✓ Los 3 documentos aceptados' : '⚠️ Faltan documentos por aceptar'}
          </div>
          <div style={{ fontSize: 12, color: canContinue ? '#166534' : '#92400E', lineHeight: 1.5 }}>
            {canContinue ? (
              <>Al continuar recibirás un correo con tu <strong>acuse de aceptación en PDF</strong> como comprobante legal.</>
            ) : (
              <>Debes aceptar los {totalRequired - requiredAccepted} documento{totalRequired - requiredAccepted === 1 ? '' : 's'} restante{totalRequired - requiredAccepted === 1 ? '' : 's'} para continuar.</>
            )}
          </div>
        </div>

        {/* Final acknowledgment */}
        <label style={{
          marginTop: 16, display: 'flex', alignItems: 'flex-start', gap: 10,
          padding: 12, background: '#fff', border: '1px solid ' + TZ.line, borderRadius: 12,
          cursor: 'pointer',
        }}>
          <input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)}
            style={{ marginTop: 3, width: 18, height: 18, accentColor: TZ.primary, cursor: 'pointer' }} />
          <div style={{ fontSize: 12, color: TZ.inkSoft, lineHeight: 1.5 }}>
            <strong style={{ color: TZ.ink }}>Confirmo que soy mayor de edad</strong>, tutor legal del alumno, y que la información
            proporcionada es veraz. Entiendo que esta aceptación electrónica tiene el mismo valor jurídico que una firma autógrafa.
          </div>
        </label>
      </div>

      {/* Sticky bottom action bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
        padding: '12px 16px 30px', background: 'rgba(255,255,255,0.96)',
        borderTop: '1px solid ' + TZ.line,
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}>
        <button onClick={() => canContinue && confirmed && onSubmit()}
          disabled={!canContinue || !confirmed}
          style={{
            width: '100%', padding: '16px', borderRadius: 14,
            background: canContinue && confirmed
              ? `linear-gradient(135deg, ${TZ.primary}, ${TZ.primaryDark})`
              : '#E5E7EB',
            color: canContinue && confirmed ? '#fff' : '#9CA3AF',
            border: 0, fontSize: 15, fontWeight: 800, letterSpacing: 0.3,
            cursor: canContinue && confirmed ? 'pointer' : 'not-allowed',
            boxShadow: canContinue && confirmed ? '0 8px 20px rgba(29,61,138,0.35)' : 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
          {canContinue && confirmed ? (
            <>Aceptar los 3 y enviar solicitud <span>→</span></>
          ) : !canContinue ? (
            <>
              {!checks.reglamento
                ? 'Acepta el Reglamento Interno'
                : !checks.privacidad
                ? 'Acepta el Aviso de Privacidad'
                : !checks.financiero
                ? 'Acepta el Reglamento Financiero'
                : `Faltan ${totalRequired - requiredAccepted} documentos`}
            </>
          ) : (
            <>Confirma que eres mayor de edad</>
          )}
        </button>
        <div style={{ textAlign: 'center', fontSize: 10, color: TZ.muted, marginTop: 6, fontWeight: 600 }}>
          🔒 Registro seguro · Tus datos están protegidos
        </div>
      </div>

      {/* Document modal */}
      {docModal && <DocModal doc={docModal} onClose={() => setDocModal(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════

function SectionHeader({ label, sublabel, count, done, optional }) {
  return (
    <div style={{ margin: '22px 4px 10px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h3 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: optional ? TZ.inkSoft : TZ.ink, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {label}
          </h3>
          {!optional && (
            <span style={{
              fontSize: 9, fontWeight: 800, letterSpacing: 0.8, padding: '2px 6px',
              borderRadius: 4, background: done ? TZ.ok : TZ.err, color: '#fff',
            }}>REQUERIDO</span>
          )}
        </div>
        {sublabel && <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>{sublabel}</div>}
      </div>
      <span style={{
        fontSize: 12, fontWeight: 800,
        color: optional ? TZ.muted : done ? TZ.ok : TZ.err,
        fontFamily: '"Barlow Condensed", sans-serif', letterSpacing: 0.5,
      }}>{count}</span>
    </div>
  );
}

function DocumentCard({ item, accepted, onToggle, onOpenDoc, expanded, onToggleExpand }) {
  return (
    <div style={{
      background: '#fff',
      border: '2px solid ' + (accepted ? TZ.ok : TZ.line),
      borderRadius: 16,
      transition: 'all 0.2s',
      boxShadow: accepted ? '0 4px 14px rgba(22,163,74,0.12)' : '0 1px 3px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 16px 14px' }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
            background: accepted ? TZ.ok + '20' : 'rgba(29,61,138,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22,
          }}>{item.icon}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: TZ.ink, letterSpacing: -0.2 }}>
              {item.title}
            </div>
            <div style={{ fontSize: 11, color: TZ.muted, marginTop: 2, fontWeight: 600 }}>
              {item.subtitle}
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ fontSize: 13, color: TZ.inkSoft, marginTop: 12, lineHeight: 1.55 }}>
          {item.short}
        </div>

        {/* Key points toggle */}
        {item.keyPoints && (
          <button onClick={onToggleExpand} style={{
            marginTop: 10, background: 'transparent', border: 0, padding: 0, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 5,
            color: TZ.primary, fontSize: 12, fontWeight: 700,
          }}>
            <span>{expanded ? '▼' : '▶'}</span>
            <span style={{ textDecoration: 'underline', textDecorationStyle: 'dotted', textUnderlineOffset: 3 }}>
              {expanded ? 'Ocultar puntos clave' : 'Ver puntos clave'}
            </span>
          </button>
        )}

        {/* Key points list */}
        {expanded && item.keyPoints && (
          <div style={{
            marginTop: 10, padding: '10px 12px',
            background: '#FFFBEB', border: '1px solid #FDE68A',
            borderRadius: 10,
          }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: 1, color: '#92400E', marginBottom: 6, textTransform: 'uppercase' }}>
              Puntos importantes que aceptas
            </div>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {item.keyPoints.map((point, i) => (
                <li key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 6,
                  fontSize: 12, color: '#78350F', lineHeight: 1.5, marginTop: i === 0 ? 0 : 5,
                }}>
                  <span style={{ color: '#F5B301', fontWeight: 800, flexShrink: 0 }}>•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Footer with read + accept buttons */}
      <div style={{
        display: 'flex', borderTop: '1px solid ' + TZ.line, background: '#FAFBFC',
      }}>
        <button onClick={onOpenDoc} style={{
          flex: 1, padding: '13px 14px', background: 'transparent', border: 0, cursor: 'pointer',
          color: TZ.primary, fontSize: 13, fontWeight: 700,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          borderRight: '1px solid ' + TZ.line,
        }}>
          📖 Leer completo
        </button>
        <button
          onClick={onToggle}
          style={{
            flex: 1.3, padding: '13px 14px',
            background: accepted ? TZ.ok : '#fff',
            color: accepted ? '#fff' : TZ.ink,
            border: 0, cursor: 'pointer',
            fontSize: 13, fontWeight: 800, letterSpacing: 0.2,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}>
          {accepted ? <>✓ Aceptado</> : <>Acepto este documento</>}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// DOC MODAL — read full document
// ═══════════════════════════════════════════════════════════
const DOC_CONTENT = {
  reglamento: {
    title: 'Reglamento Interno',
    version: 'v2.0',
    updated: 'Vigente al lanzamiento de la app',
    sections: [
      { h: '§1 · Naturaleza jurídica de TuzosJrz', b: 'TuzosJrz es una ENTIDAD INDEPENDIENTE, filial oficial del Club Pachuca bajo licencia de marca. Los pagos son exclusivamente a TuzosJrz, NO al Club Pachuca profesional. Al inscribir al deportista, ya forma parte de la estructura deportiva del Club Pachuca. La inscripción NO garantiza ni promete ascenso al Pachuca profesional, fuerzas básicas ni otras categorías del sistema Pachuca. El uso de la marca, escudo, colores y nombre "Pachuca" está restringido al ámbito formativo del club; queda prohibido usarlos en otras actividades o comercializarlos.' },
      { h: '§2 · Obligaciones de la Filial', b: 'Proveer entrenadores capacitados, instalaciones adecuadas, material deportivo, botiquín básico, comunicación oportuna vía app y responsabilidad del alumno DURANTE actividades oficiales. Fuera de ese horario el alumno queda bajo responsabilidad del tutor.' },
      { h: '§3 · Obligaciones del alumno', b: 'Puntualidad a entrenamientos y partidos. Uniforme oficial ORIGINAL COMPLETO obligatorio (jersey, short, calcetas, espinilleras, calzado de fútbol). SIN UNIFORME COMPLETO NO ENTRA AL CAMPO. Todo uniforme deberá ser solicitado a la Filial para su pedido a Tuzomanía. Prohibido uniforme de otras marcas/escuelas o personalización (bordados, logos, parches) sin autorización escrita. Respeto absoluto a coaches, compañeros, rivales e instalaciones.' },
      { h: '§4 · Obligaciones del tutor', b: 'Pago puntual de cuotas. Asumir decisiones técnicas del coach sin discusión (alineación, minutos, posición). PROHIBIDO gritar instrucciones técnicas desde la banca. PROHIBIDO ingresar a vestidores o zona técnica. Adulto responsable presente durante toda la actividad. Comunicación por canales oficiales (app, correo, cita).' },
      { h: '§5 · Redes sociales', b: 'PUBLICAR COMENTARIOS NEGATIVOS del club, coaches o coordinación en redes sociales es CAUSAL DE BAJA INMEDIATA. Las inconformidades se canalizan por vías oficiales. No compartir fotos de otros niños sin autorización de sus tutores. No hablar en nombre de TuzosJrz o Pachuca.' },
      { h: '§6 · Cambios de categoría', b: 'La categoría del alumno (por edad o nivel) es DECISIÓN EXCLUSIVA de la coordinación deportiva. El tutor puede solicitar revisión, pero la decisión final NO se negocia.' },
      { h: '§7 · Emergencias médicas', b: 'Al inscribir AUTORIZAS: aplicar primeros auxilios y trasladar al alumno a atención médica de emergencia si es necesario. Debes mantener contacto de emergencia LOCALIZABLE. Los gastos médicos son responsabilidad de la familia (salvo negligencia comprobada del club por autoridad competente).' },
      { h: '§8 · Uso de imagen del menor', b: 'Autorizas uso de foto/video del menor en RRSS oficiales del club, materiales promocionales, revistas y web oficial. AUTORIZACIÓN NO REVOCABLE mientras el alumno sea parte de la Filial. TuzosJrz no comparte imágenes con fines comerciales de terceros.' },
      { h: '§9 · Uso de la app', b: 'Cuenta PERSONAL E INTRANSFERIBLE. NO compartir credenciales con familiares, cuidadores ni terceros. Prohibido en la app: publicidad ajena al club, spam, contenido ofensivo, extraer datos de otros usuarios, organizar acciones colectivas contra la Filial. El admin supervisa chats grupales.' },
      { h: '§10 · Régimen disciplinario', b: 'Escala progresiva de sanciones: Nivel 1 (llamada de atención), Nivel 2 (amonestación escrita + suspensión 1 sesión), Nivel 3 (suspensión 2-4 semanas), Nivel 4 (BAJA DEFINITIVA sin reembolso). Debido proceso: notificación por escrito, derecho de reunión con coordinación antes de nivel 3-4.' },
      { h: '§11 · Baja inmediata sin apelación', b: 'Agresión física a alumno/staff/padre. Bullying comprobado. Daño intencional a instalaciones. Ataques públicos al club en redes. Falsedad grave de información médica o legal. Uso comercial no autorizado de la marca.' },
      { h: '§12 · Jurisdicción', b: 'Tribunales competentes de Ciudad Juárez, Chihuahua, México, renunciando a cualquier otro fuero.' },
    ],
    footer: 'Al aceptar declaras haber leído las 14 secciones y comprometerte a cumplirlas junto con tu hijo(a).',
  },
  privacidad: {
    title: 'Aviso de Privacidad Integral',
    version: 'v2.0 · Conforme a LFPDPPP',
    updated: 'Cumple INAI + Ley Federal de Protección de Datos + Ley de Derechos NNA',
    sections: [
      { h: '§1 · Responsable de datos', b: 'TuzosJrz Escuela de Fútbol Formativo — Calle Júpiter y Parral #1112, Col. Colonial del Valle II, Cd. Juárez, Chihuahua. Contacto: tuzosjrz@gmail.com. En adelante "el Responsable".' },
      { h: '§2 · Datos que se recaban del alumno', b: 'Identificación (nombre, edad, CURP, sexo, fotografía). Contacto vía tutores. Académicos (escuela, grado). SALUD (DATOS SENSIBLES): tipo de sangre, alergias, medicamentos, historial médico, lesiones, contacto de emergencia. Deportivos: categoría, posición, dorsal, estadísticas, evaluaciones. IMAGEN Y VOZ: fotografías, videos, grabaciones de entrenamientos.' },
      { h: '§3 · Datos que se recaban del tutor', b: 'Identificación (nombre, RFC, CURP, fotografía). Contacto (domicilio, celular, email). Datos laborales opcionales. Identificación oficial (INE/pasaporte). Datos bancarios (solo para reembolsos, opcional). Datos técnicos del uso de la app (IP, dispositivo).' },
      { h: '§4 · Finalidades primarias (obligatorias)', b: 'Inscribir al alumno y llevar registro. Contactar al tutor. Convocar a entrenamientos, partidos, torneos. Controlar pagos y facturación. Atender emergencias médicas. Verificar identidad. Operar la app (chat, notificaciones, calendario, pagos). Registrar estadísticas deportivas. Gestionar bajas y sanciones. Cumplir obligaciones legales.' },
      { h: '§5 · Finalidades secundarias', b: 'Publicación en RRSS oficiales del club. Material promocional (posters, folletos, banners, web). Compartir con Club Pachuca para scouting deportivo. Envío de comunicaciones sobre torneos externos y patrocinadores. Encuestas de satisfacción. Para oponerte a cualquiera, envía correo a tuzosjrz@gmail.com.' },
      { h: '§6 · Transferencias de datos', b: 'Club Pachuca (con autorización). Autoridades (obligación legal). Proveedores cloud (Supabase, Vercel, Cloudflare). Pasarelas de pago (Stripe, MercadoPago, Clip). Notificaciones (OneSignal). Contador fiscal. NUNCA vendemos, alquilamos ni compartimos datos con fines comerciales de terceros.' },
      { h: '§7 · Derechos ARCO', b: 'ACCESO (conocer qué datos tenemos), RECTIFICACIÓN (corregir), CANCELACIÓN (eliminar), OPOSICIÓN (limitar uso). Envía solicitud a tuzosjrz@gmail.com con "Ejercicio de Derechos ARCO", nombre completo, copia de INE y descripción del derecho. Respuesta en 20 días hábiles. Trámite GRATUITO.' },
      { h: '§8 · Menores de edad (protección reforzada)', b: 'La cuenta en la app es del TUTOR, no del menor. NO recabamos datos del menor sin consentimiento del tutor. NO compartimos datos del menor con terceros no autorizados. NO perfilamos al menor con fines comerciales ni publicidad dirigida. Los datos del menor son ELIMINABLES a solicitud del tutor. Cumplimos Ley General de Derechos de Niñas, Niños y Adolescentes.' },
      { h: '§9 · Medidas de seguridad', b: 'Cifrado TLS en tránsito. Cifrado en reposo. Autenticación fuerte (opción 2FA). Row Level Security por rol. Acceso limitado del personal. Respaldos automáticos. Registro de auditoría. Capacitación del staff. Notificación en 72 horas si hay incidente de seguridad.' },
      { h: '§10 · Conservación de datos', b: 'Expediente del alumno: durante relación + 5 años. Datos médicos: 5 años. Pagos y comprobantes: 5 años (fiscal). Fotos publicadas: hasta revocación. Chat: 2 años. Logs: 1 año. Al vencer se eliminan de forma segura o se anonimizan.' },
      { h: '§11 · Cambios al aviso', b: 'Podemos modificar este aviso. Los cambios se notifican por la app, correo y website. Cambios sustanciales requieren NUEVA ACEPTACIÓN explícita.' },
      { h: '§12 · Autoridad de control', b: 'Si consideras vulnerado tu derecho a la protección de datos, denuncia ante INAI: home.inai.org.mx · Tel 800 835 4324 · Insurgentes Sur 3211, CDMX.' },
    ],
    footer: 'Al aceptar autorizas expresamente el tratamiento de datos personales, incluyendo datos sensibles del menor.',
  },
  financiero: {
    title: 'Reglamento Financiero',
    version: 'v2.0',
    updated: 'Vigente al lanzamiento de la app',
    sections: [
      { h: '1. Conceptos de cobro', b: 'Inscripción (pago único anual). Mensualidad (cuota mensual del ciclo). Uniforme oficial (Kit entrenamiento + Kit juego, pago único al ingreso). Uniforme adicional (segundo kit o ropa complementaria, pago independiente, sin descuentos por tener el primero). Torneos, viajes y eventos especiales (pagos independientes según convocatoria).' },
      { h: '2. Formas de pago', b: 'App TuzosJrz (tarjeta, SPEI, wallet digital). Depósito o transferencia a cuenta Santander 60-54854719-2 · CLABE 014116605485471924. Efectivo directo en instalaciones con recibo. Todos los pagos son a TuzosJrz, NO al Club Pachuca.' },
      { h: '3. Fechas y puntualidad', b: 'Nuevos alumnos: inscripción + primer mes al inscribirse. Mensualidades: pagar dentro de los PRIMEROS 5 DÍAS HÁBILES de cada mes.' },
      { h: '4. Mora y suspensión', b: 'El alumno con adeudo mayor a 2 MESES será suspendido de entrenamientos y partidos hasta ponerse al corriente. AÚN ESTANDO SUSPENDIDO, la mensualidad se sigue generando y debe pagarse para reingresar.' },
      { h: '5. Sin descuentos', b: 'No se hacen descuentos ni ajustes por: días festivos, vacaciones oficiales, faltas del alumno, cambio de horario, torneos externos u otros motivos.' },
      { h: '6. Bajas y devoluciones', b: 'Baja voluntaria debe notificarse por escrito. Baja no notificada: deberás pagar mensualidades del periodo transcurrido para poder reingresar. NO HAY DEVOLUCIONES de inscripción, mensualidad, uniforme o pagos de torneos por decisión unilateral del tutor.' },
      { h: '7. Incapacidades médicas', b: 'Lesión o enfermedad > 15 días con CERTIFICADO MÉDICO OFICIAL entregado antes o durante la ausencia (no retroactivo) permite no cobrar mensualidad del periodo. La Filial puede solicitar segunda opinión médica.' },
      { h: '8. Facturación fiscal', b: 'Si necesitas factura CFDI, proporciona tus datos fiscales (RFC, régimen, dirección) al momento del pago. Facturación disponible dentro del mismo mes del pago; no se generan facturas retroactivas fuera de plazo fiscal.' },
    ],
    footer: 'Al aceptar, entiendes que estos son términos económicos firmes y no negociables.',
  },
};

function DocModal({ doc, onClose }) {
  const content = DOC_CONTENT[doc];
  if (!content) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 200,
      background: 'rgba(15,23,42,0.7)', display: 'flex', alignItems: 'flex-end',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        width: '100%', maxHeight: '92%', background: '#fff',
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Handle */}
        <div style={{ padding: '10px 0 0', textAlign: 'center', flexShrink: 0 }}>
          <div style={{ display: 'inline-block', width: 40, height: 4, background: '#D1D5DB', borderRadius: 999 }} />
        </div>

        {/* Header */}
        <div style={{ padding: '12px 20px 14px', borderBottom: '1px solid ' + TZ.line, flexShrink: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
            <div>
              <div style={{ fontSize: 10, letterSpacing: 1.5, fontWeight: 800, color: TZ.primary, textTransform: 'uppercase' }}>
                Documento oficial · {content.version}
              </div>
              <div style={{ fontSize: 17, fontWeight: 800, color: TZ.ink, marginTop: 2 }}>
                {content.title}
              </div>
              <div style={{ fontSize: 11, color: TZ.muted, marginTop: 3 }}>
                {content.updated}
              </div>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: '#F4F5F8', border: 0, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 14, color: TZ.inkSoft }}>✕</span>
            </button>
          </div>
        </div>

        {/* Content — scrollable */}
        <div style={{ flex: 1, overflow: 'auto', padding: '18px 20px 24px' }}>
          <div style={{
            padding: '10px 14px', marginBottom: 14,
            background: '#EFF6FF', border: '1px solid #DBEAFE',
            borderRadius: 10, fontSize: 12, color: '#1E3A8A', lineHeight: 1.5,
            display: 'flex', gap: 8, alignItems: 'flex-start',
          }}>
            <span style={{ fontSize: 16 }}>📑</span>
            <span>
              Este es un <strong>resumen ejecutivo</strong>. El documento completo con todos los artículos está publicado en <strong>tuzosjrz.com</strong> y disponible en tu perfil.
            </span>
          </div>

          {content.sections.map((s, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <h4 style={{ margin: 0, fontSize: 13, fontWeight: 800, color: TZ.primary, letterSpacing: 0.2 }}>
                {s.h}
              </h4>
              <p style={{ margin: '6px 0 0', fontSize: 13, color: TZ.inkSoft, lineHeight: 1.6 }}>
                {s.b}
              </p>
            </div>
          ))}

          <div style={{
            marginTop: 24, padding: '12px 14px',
            background: '#F4F5F8', borderRadius: 10, fontSize: 11, color: TZ.muted,
            textAlign: 'center', fontWeight: 600,
          }}>
            {content.footer}
          </div>
        </div>

        {/* Footer button */}
        <div style={{ padding: '12px 20px 30px', borderTop: '1px solid ' + TZ.line, flexShrink: 0 }}>
          <button onClick={onClose} style={{
            width: '100%', padding: '14px', borderRadius: 12,
            background: TZ.primary, color: '#fff', border: 0,
            fontSize: 14, fontWeight: 800, cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(29,61,138,0.3)',
          }}>
            Entendido, regresar
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ConsentsScreen });
