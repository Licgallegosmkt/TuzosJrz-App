# Handoff: TuzosJrz — App de Gestión Deportiva

**Repositorio destino**: `Licgallegosmkt/TuzosJrz-App`
**Dominio del proyecto**: `tuzosjrz.com` (ya comprado)
**Pasarela de pagos**: Clip.mx
**Admin principal**: `tuzosjrz@gmail.com`

---

## 🎯 Overview

**TuzosJrz** es la app oficial de la **Filial oficial del Club Pachuca** para administrar una escuela de fútbol formativo con múltiples categorías (Sub-8 a Sub-16). La app conecta a **3 tipos de usuarios**:

- 🛡️ **Admin** — el directivo que administra todo el club
- 🏃 **Entrenador** — staff deportivo asignado a una o más categorías
- 👪 **Padre / tutor** — familias de los jugadores

Cubre: **pagos híbridos** (tarjeta, SPEI, wallet, WhatsApp link, transferencia manual, efectivo), asistencias, convocatorias, **pizarra táctica avanzada** con materiales de entrenamiento, chat con supervisión admin, calendario, notificaciones, gestión de tutores/coaches, snacks rotativos, cumpleaños, **documentos escaneados con descarga masiva ZIP para torneos**, splash + login + ruteo automático por rol.

---

## 📁 Sobre los archivos de diseño

Los archivos en este paquete son un **prototipo interactivo funcional en HTML + React (via Babel Standalone) + localStorage**. Es referencia visual de alta fidelidad — muestra exactamente cómo se ve y comporta cada pantalla, pero **no es código de producción**.

**Tarea de implementación**: recrear estos diseños en el codebase target (recomendado: **Next.js 14 + React + Tailwind CSS + Supabase + Clip.mx**) reemplazando:
- `localStorage` → base de datos Supabase con Row Level Security
- Login mockeado → OAuth real Google/Apple con Supabase Auth
- Simulador de pagos → integración real Clip
- File uploads a `localStorage` → Supabase Storage
- Chats mockeados → Supabase Realtime
- Notificaciones simuladas → OneSignal o FCM

---

## 🎨 Fidelidad

**Alta fidelidad (hi-fi)** para todo el sistema visual:
- Colores exactos (identidad Pachuca — azul + dorado)
- Tipografía Barlow Condensed + Inter
- Spacing, radius, sombras y estados finales
- Interacciones y transiciones animadas (splash con bounce, docs con progress bar)

---

## 🎨 Design Tokens

### Colores

```js
// Marca (Pachuca)
primary:      '#1D3D8A'   // Azul Pachuca (headers, botones primarios)
primaryDark:  '#0F2560'   // Azul oscuro (gradientes)
gold:         '#F5B301'   // Dorado (acentos, badges, CTAs importantes)

// Neutrales
ink:          '#0B1220'   // Texto principal
inkSoft:      '#3B4658'   // Texto secundario
muted:        '#6B7280'   // Placeholder / metadata
line:         '#E6E8EE'   // Bordes
bg:           '#F4F5F8'   // Fondo app
card:         '#FFFFFF'   // Fondo cards

// Estado
ok:           '#16A34A'   // Verde (pagado, apto, presente)
warn:         '#F59E0B'   // Ámbar (pendiente, recuperación)
err:          '#DC2626'   // Rojo (atrasado, lesionado, ausente)
```

### Colores de materiales (aros, chalecos, platos, áreas)
```js
red: '#DC2626' | yellow: '#F5B301' | blue: '#2563EB' | green: '#16A34A' | orange: '#EA580C'
```

### Tipografía

```css
/* Google Fonts */
font-family: 'Inter', -apple-system, 'SF Pro', system-ui, sans-serif;   /* UI */
font-family: 'Barlow Condensed', Impact, sans-serif;                    /* Display */
```

- **Inter**: todo el texto UI, formularios, cards
- **Barlow Condensed**: dorsales de jugadores, títulos de secciones, números grandes

### Border radius
```
sm: 6-8px  (chips, inputs) | md: 10-14px (cards, botones)
lg: 16-20px (cards principales) | xl: 24-28px (sheets, hero corners)
full: 999px (pills, círculos)
```

---

## 🗺️ Arquitectura de pantallas por rol

### 🛡️ Admin — 5 tabs + acceso a grid "Gestión del club"
| Tab | Pantalla |
|---|---|
| Inicio | `Dashboard` + `AdminExtras` grid (4×2) |
| Jugadores | `Players` + `PlayerProfile` |
| Pagos | `Payments` (histórico admin) |
| Asistencia | `Attendance` |
| Perfil | `AdminProfile` |

**Grid "Gestión del club" (accesible desde Dashboard)**:
`Pizarra · Entrenadores · Tutores · Aprobar pagos · Calendario · Chat · Reportes · Torneos`

### 🏃 Entrenador — 6 tabs
`Inicio · Plantilla · Asistencia · Pizarra · Chat · Perfil`

### 👪 Padre — 5 tabs
`Inicio · Mi hijo · Agenda · Chat · Perfil`

---

## 🚀 Flujo de apertura de la app (nuevo)

```
Abrir app
    ↓
📱 Splash screen (3s, logo animado, fondo azul Pachuca)
    ↓
    ¿Hay sesión activa?
        SÍ → Ruteo automático a Home según rol
        NO ↓
🔐 Login (Google / Apple / Email magic link)
    ↓
    Detección de rol por email:
        tuzosjrz@gmail.com o admin@…     → 🛡️ Admin
        cualquier email con "coach"      → 🏃 Coach
        cualquier otro                   → 👪 Padre
    ↓
Home correspondiente al rol
```

**Archivo**: `screens/AuthFlow.jsx` — contiene `SplashScreen`, `LoginScreen`, `NoAccountScreen`, `detectRoleFromEmail()`, `getSession()`, `saveSession()`, `clearSession()`.

---

## 📱 Especificaciones por pantalla

### 1. Splash Screen (`SplashScreen`)
- 3 segundos de duración
- Fondo azul Pachuca degradado con stripes diagonales
- Logo TuzosJrz XL (200px) con animación bouncy (cubic-bezier scale)
- 3 puntitos dorados con bounce infinito abajo (loader)
- Subtítulo "FILIAL OFICIAL DEL CLUB PACHUCA" en dorado

### 2. Login Screen (`LoginScreen`)
- Hero azul con logo grande (130px)
- Botón blanco **"Continuar con Google"** con logo Google multicolor
- Botón negro **"Continuar con Apple"** con logo Apple
- Toggle **"Iniciar sesión con correo"** → input email + "Enviar enlace mágico"
- Card "¿Primera vez? → Pide tu invitación al club"
- Card amarilla de ayuda (solo prototipo) con correos de ejemplo por rol

### 3. Dashboard Admin
- Hero con logo TuzosJrz + "FILIAL OFICIAL DEL CLUB PACHUCA · Temporada 2026"
- **Campana con badge rojo (3)** en header → abre `NotificationsCenter`
- KPIs (3 col): jugadores · asistencia % · monto por cobrar
- Quick actions (4 col): Pasar lista · Cobrar · Pizarra · Nuevo evento
- Próximo (carrusel de eventos)
- Pagos · Septiembre (card con barra apilada)
- Asistencia por categoría (barras)
- Área médica (alerta si hay casos)
- **🎂 Cumpleañeros del mes** (card dorada)
- Actividad reciente
- **Grid "Gestión del club" (4×2)**: Pizarra · Entrenadores · Tutores · Aprobar pagos · Calendario · Chat · Reportes · Torneos

### 4. Pizarra táctica (`Tactics`)
- Toggle **11v11 / 8v8** grande
- **8 formaciones 11v11**: 4-3-3, 4-4-2, 3-5-2, 4-2-3-1, 4-1-4-1, 3-4-3, 4-3-1-2, 4-4-1-1
- **7 formaciones 8v8**: 3-2-2, 3-3-1, 2-3-2, 3-1-3, 2-4-1, 3-2-1-1, 4-2-1
- **Cancha realista** con líneas oficiales, arcos de esquina (4), mowing stripes, círculo central con escudo Pachuca
- Fichas de jugadores drag-and-drop (azul local, dorado visitante)
- **Modo fullscreen** con panel lateral colapsable (260px, 4 tabs):
  - 👥 **Jugadores**: formación activa
  - 🧡 **Materiales**: catálogo de 11 tipos (aros, vallas alta/baja, escalera agilidad, pelota medicinal, balón, portería, chaleco, plato, área rect/círculo)
  - ↗️ **Flechas**: 7 tipos (simple, ondulada, punteada, curva, línea punteada, doble, rotación)
  - 💾 **Guardar**: plantillas persistentes en localStorage
- **Toolbar de capas**: mostrar/ocultar jugadores/materiales/flechas
- **Menú contextual** al seleccionar: cambiar color (5 swatches), duplicar, rotar, eliminar
- **Handles**: resize (dorado) + rotate (azul) al seleccionar material

### 5. Sistema de Documentos (`Documents` — NUEVO)
Archivo: `screens/Documents.jsx`

- **2 categorías obligatorias fijas**:
  - 🪪 Identificación del deportista (pasaporte, credencial colegio)
  - 📄 CURP (formato actual)
- **Documentos libres**: el usuario les pone nombre custom (ej. "Autorización torneo")
- **Barra de progreso de completitud** (`docsCompletionForPlayer(playerId)`)
- **Banner amarillo persistente** en Home del padre si faltan docs (`DocsWarningBanner`)
- **Barra mini de % en lista de jugadores admin** (`DocsProgressPill`)
- Auto-aceptación (admin solo revisa si es sospechoso)
- Formatos aceptados: JPG, PNG, PDF + captura directa desde cámara (móvil)
- Compresión automática de imágenes (max 1200px, JPEG 85%)

**Permisos**:
- Padre, coach y admin pueden subir
- Padre y admin pueden eliminar
- Todos pueden ver
- Admin y coach pueden descargar (individual + ZIP)

### 6. Visor y descarga de documentos (`DocViewer`, `downloadDoc`, `downloadAllDocsForPlayer`)
- **👁 Ver**: modal fullscreen negro con imagen escalada o PDF embed
- **⬇ Descargar individual**: nombre limpio `diego_hernandez_curp.pdf`
- **📦 Descargar TODOS (ZIP) por jugador**: botón dorado grande arriba en tab Docs — genera ZIP con carpeta + manifest.txt
- Dependencia: `assets/jszip.min.js` (JSZip 3.10.1)

### 7. Paquete para torneo (`TournamentExport` — NUEVO)
Nueva pantalla admin dedicada al bulk download para inscripciones.

- Nombre del paquete editable ("Torneo Interfilial 2026")
- Selector de categoría con chips
- Botones rápidos: "Seleccionar todos" / "Solo con docs completos"
- Lista de jugadores con checkbox + avatar + barra de % de docs + chip "Incompleto" si aplica
- Resumen dinámico (jugadores seleccionados / completos / incompletos)
- Genera ZIP con carpeta por jugador + `_manifest.txt` global

### 8. PayFlow (`PayFlow` — flujo híbrido padre)
6 métodos de pago con badge "✓ El club absorbe comisiones · Pagas exacto":

**Pago instantáneo (Clip)**:
- 💳 Tarjeta con **tarjeta visual animada** (número, brand auto-detectado, expiry en vivo). Badges: `🔒 PCI-DSS · Clip · 3D Secure`.
- 📱 Apple Pay / Google Pay (auto-detecta OS)
- 🏧 SPEI (referencia única `TZ######`, CLABE copyable)

**Compartir link**:
- 🔗 WhatsApp con preview real de burbuja verde

**Pago manual (requiere aprobación admin)**:
- 📤 Transferencia bancaria con comprobante (dropzone imagen/PDF)
- 💵 Efectivo (contactos con teléfono para entregar)

Referencias generadas: `CLIP-XXXXXXX`.

### 9. AdminPaymentInbox (aprobación de comprobantes)
- Tabs: Pendientes / Aprobados / Rechazados
- Sheet detalle con preview del comprobante bancario tipo BBVA real
- Banner verde ✓ "El monto coincide"
- Botones: Rechazar (motivo) / Aprobar

### 10. Chat completo
- Grupos por categoría con avatar cuadrado "U12"
- DMs con tag COACH/ADMIN/PADRE
- Vista tipo WhatsApp con burbujas verdes/blancas
- Mensajes fijados con banner amarillo 📌
- **Admin Supervision**: banner rojo "MODO SUPERVISOR", composer bloqueado

### 11. Calendario mes/semana
- Toggle Mes/Semana
- Nav de mes con arrows
- Punteitos de color por evento (azul entreno, dorado partido, morado torneo)
- Vista semana con timeline vertical
- Sheet al tocar día con CTAs por rol

### 12. Crear evento (`CreateEventFlow`)
4 tipos: Entrenamiento · Partido oficial · Partido amistoso · Evento del club

**Crear Partido** (4 pasos con progress bar dorado):
1. Detalles (rival, fecha, hora, cita, uniforme, ubicación con `LocationPicker`, notas)
2. Convocatoria (lista aptos, excluye lesionados, contadores)
3. **🍎 Snack** (rotación automática, quien menos ha llevado va primero)
4. Revisar (card "vs Rival" tipo cartel + resumen + notif)

### 13. Sistema de Snacks
Archivo: `screens/Snacks.jsx`
- Persistente en localStorage por categoría
- Algoritmo: menos veces llevado → dentro de empate, más tiempo atrás
- Widget "próximo snack" en Home Padre y Coach
- Fila "Después:" con siguientes 3 en cola

### 14. Cumpleañeros del mes
En Dashboard admin (`BirthdaysBlock`):
- Card dorada con próximo cumpleaños destacado (día grande + nombre + edad + "Hoy/Mañana/En X días")
- Chips compactos con avatares del resto del mes
- Los pasados aparecen atenuados

### 15. Perfil (Admin/Coach/Parent)
Una sola pantalla con:
- Hero con `PhotoAvatar` editable + nombre + rol
- Mis datos (tap-to-edit inline)
- **Datos del club** (solo admin): nombre, dirección, escudo
- **Cuenta bancaria** (solo admin): banco, titular, CLABE
- **Biografía** (solo coach)
- **Contacto emergencia** (solo padre)
- **Método de pago guardado** (solo padre): tarjeta enmascarada
- **Mis hijos vinculados** (solo padre)
- Seguridad, apariencia (tema), ayuda, cerrar sesión (conectado a `window.tzLogout`)

---

## 🔐 Matriz de permisos completa

| Módulo | Admin | Coach | Padre |
|---|---|---|---|
| Ver categorías | ✅ Todas | Solo asignadas | Solo hijos |
| Ver jugadores | ✅ | ✅ (scope) | Solo hijo |
| Ver ficha médica | ✅ | ✅ | ✅ readonly |
| Editar ficha médica | ✅ | ✅ | ❌ |
| Editar perfil deportivo | ✅ | ✅ | ❌ |
| **Foto de jugador** | ✅ subir | ✅ subir | ❌ solo ver |
| **Foto propia** | ✅ | ✅ | ✅ |
| Ver montos de pago | ✅ | ❌ (solo semáforo) | Solo propio |
| Cobrar | ✅ | ❌ | Solo propio |
| Aprobar pagos manuales | ✅ | ❌ | ❌ |
| **Ver documentos** | ✅ | ✅ | ✅ |
| **Subir documentos** | ✅ | ✅ | ✅ |
| **Descargar documentos** | ✅ | ✅ | ✅ |
| **Descargar ZIP masivo (torneo)** | ✅ | ✅ (su categoría) | ❌ |
| Asistencia | ✅ | ✅ (scope) | Ver propio |
| Pizarra táctica | ✅ | ✅ | ❌ |
| Convocar a partido | ✅ | ✅ (scope) | Confirmar propio |
| Chat | ✅ | ✅ (scope) | ✅ |
| Supervisar chats | ✅ | ❌ | ❌ |
| Gestionar tutores | ✅ | ❌ | ❌ |
| Gestionar entrenadores | ✅ | ❌ | ❌ |
| Reportes | ✅ | ❌ | ❌ |
| Crear eventos | ✅ (todas) | ✅ (su cat.) | ❌ |

---

## 💾 Modelo de datos Supabase

```sql
-- Users (extends auth.users)
users (id, email, full_name, phone, photo_url, role, created_at)
-- Club
clubs (id, name, subtitle, address, crest_url, bank_data jsonb, aviso_privacidad_url)
-- Categorías
categories (id, club_id, name, monthly_fee, age_min, age_max)
-- Coaches asignados
category_coaches (category_id, coach_id) PRIMARY KEY (both)
-- Jugadores
players (id, club_id, category_id, first_name, last_name, number, position,
         birth_date, photo_url, medical jsonb, created_at)
-- Tutores (many-to-many)
player_tutors (player_id, tutor_id, relation, is_primary, emergency_contact jsonb,
               address, approved, approved_at, invite_code)
-- Documentos (NUEVO)
player_documents (
  id, player_id, category text,        -- 'identification' | 'curp' | 'free'
  name text, file_name, file_type, file_url,  -- URL a Supabase Storage
  uploaded_by uuid, uploaded_at, status,       -- 'ok' | 'suspicious' | 'rejected'
  expires_at date NULL
)
-- Eventos
events (id, club_id, category_id, kind, title, starts_at, call_time, location jsonb,
        rival, uniform, notes, created_by, score jsonb)
-- Convocatoria
event_callups (event_id, player_id, status, reason)
-- Snacks
event_snacks (event_id PRIMARY, player_id, brought, brought_at)
-- Asistencia
attendance (id, event_id, player_id, status char(1), recorded_by, recorded_at)
-- Pagos
payments (id, club_id, player_id, paid_by, concept, amount, method, status,
          clip_transaction_id, reference, receipt_url, metadata jsonb,
          approved_by, reject_reason, created_at, paid_at)
-- Chats
chats (id, club_id, kind, category_id, title)
chat_members (chat_id, user_id, role, last_read_at)
messages (id, chat_id, author_id, text, attachments jsonb, pinned, created_at)
-- Notificaciones
notifications (id, user_id, kind, title, body, metadata jsonb, read_at, created_at)
-- Plantillas de pizarra
tactic_templates (id, club_id, created_by, name, mode, formation, items jsonb, created_at)
```

### Row Level Security críticas
- **Padres**: `player_tutors.tutor_id = auth.uid()` → ven solo sus jugadores; `payments.paid_by = auth.uid()` → solo sus pagos.
- **Coaches**: `category_coaches.coach_id = auth.uid()` → ven jugadores/eventos de sus categorías; NO ven montos (usar view).
- **Admin**: acceso total dentro de su `club_id`.

---

## 💳 Integración Clip.mx

**Webhooks**: endpoint `/api/clip/webhook` para eventos (payment.succeeded, payment.failed).

**Flujo**:
1. Padre inicia pago desde `PayFlow` con método `card`.
2. Frontend → `POST /api/payments/create` → backend crea intent en Clip → devuelve token.
3. Padre completa pago en Clip SDK.
4. Clip llama webhook → backend actualiza `payments.status = 'paid'` + `clip_transaction_id`.
5. Frontend recibe evento realtime (Supabase Realtime) → muestra success.

**Env vars**:
```
CLIP_PUBLIC_KEY=...
CLIP_PRIVATE_KEY=... (nunca commitear, va en Vercel secrets)
CLIP_WEBHOOK_SECRET=...
```

---

## 🔔 Notificaciones Push

Servicio recomendado: **OneSignal** o **Firebase Cloud Messaging**.

Eventos que disparan push:
- Nueva convocatoria → padres de convocados
- Pago aprobado/rechazado → padre que pagó
- Nueva solicitud de tutor → admin
- Mensaje en chat → miembros (excepto autor)
- Documento subido por padre → admin
- Recordatorio 24h y 2h antes → padres convocados
- Cambio de estado médico → padre + admin

---

## 📱 PWA + iOS/Android

Fase 1: **PWA** (Progressive Web App) instalable desde navegador.
Fase 2: **Capacitor** para App Store + Google Play cuando crezcan.

Meta tags requeridas:
```html
<meta name="theme-color" content="#1D3D8A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<link rel="apple-touch-icon" href="/icons/icon-180.png">
```

---

## 🖼️ Assets incluidos

- `assets/tuzosjrz-logo.png` — Logo oficial TuzosJrz (601×600 PNG con transparencia)
- `assets/pachuca-crest.png` — Escudo Club Pachuca (1024×1024 PNG con transparencia) — usado en centro de pizarra
- `assets/jszip.min.js` — JSZip 3.10.1 (para descargas ZIP)
- `assets/TuzosJrz-QR.png` — QR de prueba del prototipo

---

## 📂 Archivos del proyecto

**Shell + config** (raíz):
- `TuzosJrz.html` — HTML principal + welcome overlay + loader
- `app.jsx` — Router principal (auth + tabs + rol switcher + Tweaks)
- `data.js` — Mock data (jugadores, formaciones, cumpleaños, paymentsSummary)

**Componentes** (`components/`):
- `UI.jsx` — TZ tokens, Icon, Avatar, Chip, Card, SectionTitle, TabBar, ScreenHeader, StatusDot
- `PhotoAvatar.jsx` — Avatar con upload por permisos

**Pantallas** (`screens/`):
- `AuthFlow.jsx` — Splash + Login + NoAccount + detectRoleFromEmail
- `Dashboard.jsx` — Admin home + AdminExtras + BirthdaysBlock + ClubCrest
- `Players.jsx` — Lista + perfil admin
- `Payments.jsx` — Cobros admin (legacy simple)
- `PaymentFlow.jsx` — Flujo híbrido padre (6 métodos Clip)
- `PaymentInbox.jsx` — Aprobación admin
- `Attendance.jsx` — Pasar lista
- `Tactics.jsx` — Pizarra extendida (materiales + capas + plantillas)
- `Materials.jsx` — Catálogo con SVGs propios
- `Documents.jsx` — Sistema de documentos + visor + descargas
- `TournamentExport.jsx` — Bulk ZIP para inscripciones
- `AdminCoaches.jsx` — Gestión de entrenadores
- `AdminInvites.jsx` — Solicitudes de tutores
- `AdminReports.jsx` — Reportes exportables
- `Calendar.jsx` — Mes/semana
- `Chat.jsx` — Grupos + DMs + supervisión
- `Notifications.jsx` — Centro de notificaciones
- `CreateEvent.jsx` — Flujo crear eventos (4 pasos partido)
- `Snacks.jsx` — Sistema rotación
- `Profile.jsx` — Perfiles 3 roles
- `ParentOnboarding.jsx` — Alta padre (4 pantallas)
- `ParentHome.jsx` — Home padre + perfil hijo
- `Coach.jsx` — Home coach + roster + perfil + convocatoria

**Starters (Genspark, opcional en producción)**:
- `ios_frame.jsx` — Frame iPhone (solo para prototipo)
- `tweaks_panel.jsx` — Panel de ajustes (solo para prototipo)
- `image_slot.js` — Web component drop image

---

## 🚀 Roadmap sugerido — 4 sprints

### Sprint 1 (Semana 1-2) — Foundation
- Setup Next.js 14 + Tailwind + Supabase + shadcn/ui
- Auth Google + Apple con detección de rol
- Tablas + RLS policies
- Layout con tab bars por rol
- Splash + Login funcional

### Sprint 2 (Semana 2-3) — Contenido base
- Categorías + entrenadores + cuotas
- Jugadores CRUD + PhotoAvatar con Supabase Storage
- Perfil jugador con médica + docs
- **Sistema de documentos con Supabase Storage**
- Onboarding padre (registro + aprobación admin)

### Sprint 3 (Semana 3-4) — Operación diaria
- Calendario + crear eventos + convocatorias + snacks
- Asistencia
- Chat en tiempo real (Supabase Realtime)
- Notificaciones (OneSignal)

### Sprint 4 (Semana 4) — Pagos + Pulido
- Integración Clip (checkout + webhooks)
- Aprobación de comprobantes admin
- **Descarga ZIP para torneos**
- Reportes básicos
- PWA install prompt

### Fase 5 (más adelante)
- Pizarra táctica con guardado en nube
- Reportes PDF/Excel reales
- Empaquetado Capacitor para App Store/Play Store

---

## 📞 Info del cliente

- **Admin**: `tuzosjrz@gmail.com`
- **Dominio**: `tuzosjrz.com` (ya comprado)
- **Pasarela**: Clip.mx (cuenta activa o en proceso)
- **Presupuesto mensual**: ~$500 MXN (dominio + hosting + Supabase)
- **Cuenta bancaria del club**: lista
- **Logo oficial**: incluido en `assets/tuzosjrz-logo.png`
- **Repo GitHub**: `Licgallegosmkt/TuzosJrz-App`
