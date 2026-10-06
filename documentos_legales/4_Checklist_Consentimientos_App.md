# CHECKLIST DE CONSENTIMIENTOS EN LA APP
## Pantalla de registro — TuzosJrz

**Para desarrollador**: Este documento define **exactamente qué checkboxes y textos** debe mostrar la app en el flow de registro. Cada consentimiento se guarda en la BD con timestamp, IP y versión del documento aceptado.

---

## 🎯 FLOW EN LA APP

```
Registro paso 1: Cuenta → email + contraseña / Google / Apple
Registro paso 2: Datos del tutor
Registro paso 3: Datos del alumno
Registro paso 4: 📋 Consentimientos legales (esta pantalla)
Registro paso 5: Documentos requeridos (fotos, INE, acta)
Registro paso 6: Espera aprobación del admin
```

---

## 📋 PANTALLA DE CONSENTIMIENTOS — LAYOUT

**Título**: "Últimos pasos — Consentimientos importantes"
**Subtítulo**: "Lee y acepta cada punto antes de continuar. Puedes ver el documento completo tocando cualquier título."

---

### GRUPO 1 — OBLIGATORIOS (sin estos NO se puede completar registro)

#### ☐ 1. Reglamento Interno
> Al aceptar, declaro que he leído y comprendo el **Reglamento Interno** de TuzosJrz y me comprometo a cumplirlo y a hacer que mi hijo(a) lo cumpla.
>
> [Ver Reglamento completo →]

**BD**: `consent_reglamento_interno` (bool + timestamp + version_id + ip)

---

#### ☐ 2. Aviso de Privacidad — Datos generales
> Al aceptar, autorizo a **TuzosJrz** al tratamiento de mis datos personales y los de mi hijo(a) conforme al **Aviso de Privacidad Integral**, para las finalidades primarias descritas (inscripción, comunicación, pagos, actividades del club).
>
> [Ver Aviso completo →]

**BD**: `consent_privacidad_primarias`

---

#### ☐ 3. Datos sensibles del menor (salud)
> Autorizo expresamente el tratamiento de los **datos personales sensibles de salud** de mi hijo(a) (alergias, medicamentos, tipo de sangre, historial de lesiones) con fines de atención médica de emergencia y seguimiento de su bienestar en actividades del club.
>
> ⚠️ Sin este consentimiento no podemos brindar atención adecuada al menor en actividades deportivas.

**BD**: `consent_datos_salud_menor`

---

#### ☐ 4. Términos de Uso de la App
> Acepto los **Términos y Condiciones de Uso** de la App TuzosJrz, entendiendo mis obligaciones sobre el uso apropiado de la aplicación, chat, pagos y notificaciones.
>
> [Ver Términos completos →]

**BD**: `consent_terminos_app`

---

#### ☐ 5. Naturaleza jurídica de la Filial
> Entiendo que **TuzosJrz es una entidad independiente**, Filial Oficial del Club Pachuca bajo licencia, pero legalmente autónoma. Comprendo que:
>
> • Los pagos son para TuzosJrz, no para el Club Pachuca profesional.
> • La inscripción no garantiza ni promete ascenso a Pachuca profesional.
> • No puedo usar los uniformes/logo para actividades ajenas al club.

**BD**: `consent_naturaleza_filial`

---

#### ☐ 6. Autorización médica de emergencia
> Autorizo a TuzosJrz a **aplicar primeros auxilios y trasladar a mi hijo(a) a atención médica de emergencia** si fuese necesario durante actividades oficiales, mientras se contacta con el tutor.
>
> Comprendo que los gastos médicos derivados son responsabilidad de la familia.

**BD**: `consent_medico_emergencia`

---

#### ☐ 7. Custodia legal
> Declaro bajo protesta de decir verdad que:
>
> [Selecciona una opción]:
> ○ Soy padre/madre con **custodia completa** del menor.
> ○ Tengo **custodia compartida** — subiré documento que lo acredite.
> ○ Soy **tutor legal designado** por autoridad competente — subiré documento.
>
> Manifiesto tener la representación legal necesaria para inscribir al menor y otorgar los consentimientos requeridos.

**BD**: `consent_custodia` (con opción seleccionada + documento cuando aplique)

---

#### ☐ 8. Uniforme oficial obligatorio
> Comprendo que:
>
> • Solo se permite el uso del **uniforme oficial ORIGINAL** de TuzosJrz.
> • Prohibido el uso de uniformes de otras escuelas o marcas.
> • Prohibido personalizar el uniforme (bordados, logos, parches) sin autorización.
> • Mi hijo NO podrá entrenar/jugar si no lleva el uniforme completo.

**BD**: `consent_uniforme`

---

#### ☐ 9. Reglamento financiero
> Acepto el **Reglamento Financiero** de la Sección 7:
>
> • Pagar las cuotas dentro de los 2 primeros días hábiles del mes.
> • En caso de mora > 1 mes, mi hijo será suspendido pero las cuotas seguirán generándose.
> • No hay reembolsos por bajas voluntarias.
> • No hay descuentos por vacaciones o faltas.
> • Los recargos por pago tardío son aplicables.

**BD**: `consent_financiero`

---

#### ☐ 10. Comportamiento y sanciones
> Me comprometo a mantener conducta respetuosa en las instalaciones y a NO:
>
> • Gritar instrucciones técnicas al equipo durante partidos.
> • Interferir en las decisiones del entrenador.
> • Publicar comentarios negativos del club en redes sociales.
> • Ingresar a vestidores o zona técnica.
>
> Comprendo que la falta grave puede causar la baja de mi hijo del club.

**BD**: `consent_conducta`

---

### GRUPO 2 — OPCIONALES (el padre puede rechazarlos sin afectar la inscripción)

Estos aparecen en una segunda sección visualmente separada con encabezado:

> **📸 Autorizaciones opcionales**
> *Puedes aceptar o rechazar cada una. Podrás cambiar tu decisión más adelante desde tu perfil.*

---

#### ☐ 11. Uso de imagen en redes sociales
> Autorizo el uso de fotografías y videos de mi hijo(a) en las **redes sociales oficiales de TuzosJrz** (Instagram, Facebook, YouTube, TikTok) para difusión de actividades del club.
>
> Puedo revocar esta autorización en cualquier momento desde mi perfil.

**BD**: `consent_imagen_rrss`

---

#### ☐ 12. Uso de imagen en material promocional
> Autorizo el uso de imagen de mi hijo(a) en material promocional del club: posters, folletos, revistas, banners, website oficial.

**BD**: `consent_imagen_promocional`

---

#### ☐ 13. Transferencia de datos al Club Pachuca
> Autorizo que TuzosJrz comparta información deportiva y de desempeño de mi hijo(a) con el **Club Pachuca** para fines de scouting deportivo o visibilización de talento juvenil.
>
> ⚠️ Esto no garantiza ningún proceso formal de reclutamiento.

**BD**: `consent_pachuca_scouting`

---

#### ☐ 14. Notificaciones comerciales
> Autorizo recibir notificaciones sobre torneos externos, eventos deportivos, promociones de patrocinadores u ofertas relacionadas con la actividad deportiva de mi hijo(a).

**BD**: `consent_notif_comerciales`

---

#### ☐ 15. Encuestas y estudios
> Autorizo participar en encuestas de satisfacción y estudios internos del club para mejorar el servicio.

**BD**: `consent_encuestas`

---

## 📸 CONFIRMACIÓN FINAL

Después de los checkboxes, botón grande dorado:

```
┌────────────────────────────────────────────────┐
│  ⚠️  Verifica que aceptaste TODOS              │
│      los obligatorios (10 puntos)              │
│                                                │
│  [ ACEPTAR Y CONTINUAR →  ]                    │
└────────────────────────────────────────────────┘
```

Si faltan obligatorios: botón deshabilitado + mensaje "Debes aceptar todos los puntos obligatorios (falta X)".

---

## 🗄️ DATOS QUE SE GUARDAN EN BD

Al aceptar, en Supabase se crea un registro en la tabla `consents`:

```sql
create table consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  document_type text not null,          -- 'reglamento', 'privacidad', 'terminos', etc.
  document_version text not null,       -- 'v2.0'
  consent_given boolean not null,
  consent_data jsonb,                   -- para custodia: qué opción, doc
  accepted_at timestamptz default now(),
  ip_address inet,
  user_agent text,
  device_fingerprint text
);

create index idx_consents_user on consents(user_id, document_type);
```

Esto queda como **evidencia legal** de qué aceptó cada tutor, cuándo y en qué versión.

---

## 🔄 RE-ACEPTACIÓN CUANDO CAMBIAN LOS DOCUMENTOS

Cuando TuzosJrz publica una nueva versión de cualquier documento:

1. Al abrir la App, aparece un **modal bloqueante**:
   > "Actualizamos nuestros documentos legales. Por favor revisa y acepta los cambios para seguir usando la App."
2. Muestra los documentos que cambiaron con las diferencias resaltadas.
3. El tutor debe re-aceptar antes de poder usar la app.
4. Se crea un nuevo registro en `consents` con el nuevo `document_version`.

---

## 📱 UX RECOMENDADA

**Para hacer el proceso NO agobiante**:

1. **Barra de progreso** arriba: "8 de 15 aceptados"
2. Los obligatorios en color primario con badge "**OBLIGATORIO**"
3. Los opcionales en gris con badge "**OPCIONAL**"
4. Cada checkbox debe permitir **abrir el documento completo** en un modal (no salir de la app)
5. Al final: **resumen visual** de lo que aceptó vs rechazó
6. Botón "**Descargar mi acuse**" que le manda por correo un PDF con todo lo que aceptó

---

## 🎨 MOCKUP DE PANTALLA (para diseño)

Puedo diseñar la pantalla en el prototipo si quieres — solo dime "diseña la pantalla de consentimientos" y la agrego a la app.

---

## ✅ CHECKLIST DE IMPLEMENTACIÓN PARA GENSPARK CODE

- [ ] Tabla `consents` en Supabase
- [ ] Pantalla de consentimientos en flow de registro
- [ ] Modal para leer cada documento sin salir
- [ ] Bloqueo hasta aceptar todos los obligatorios
- [ ] Guardar timestamp + IP + versión en cada consent
- [ ] Envío de acuse por email al completar (con Resend)
- [ ] Sistema de re-aceptación cuando cambia versión
- [ ] Sección "Mis consentimientos" en perfil para revocar opcionales
- [ ] Registro de auditoría (log) de cambios en consents

---

*Este checklist protege legalmente a TuzosJrz y da transparencia total al tutor.*
