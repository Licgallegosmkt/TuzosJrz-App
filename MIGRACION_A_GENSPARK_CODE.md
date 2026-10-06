# 🚀 Migración de TuzosJrz a Genspark Code

**Este documento es tu guía paso a paso para llevar el prototipo a producción SIN necesitar un desarrollador.**

---

## 🎯 ¿Qué es Genspark Code y por qué es tu mejor opción?

**Genspark Design** (donde estás ahora) es una herramienta de **diseño** — genera prototipos visuales interactivos con datos falsos.

**Genspark Code** es una herramienta de **desarrollo** — toma diseños y los convierte en apps reales con:
- 🗄️ Base de datos real (los datos persisten para siempre)
- 🔐 Autenticación real (login con Google, Apple, email)
- 💰 Pagos reales (Stripe, MercadoPago)
- 🔔 Push notifications reales (a celulares)
- 🌐 URL pública (`tuzosjrz.com`)
- ☁️ Se actualiza automáticamente cuando haces cambios

**Ventaja clave**: puedes seguir iterando aquí en Design Y en Code al mismo tiempo. Los cambios visuales aquí se pueden llevar allá.

---

## 📋 ANTES de migrar — Preparación

### 1. Compra tu dominio (día 1)
Ve a [Namecheap](https://namecheap.com) o [GoDaddy México](https://www.godaddy.com/es-mx) y compra:
- `tuzosjrz.com` — ~$180 MXN/año
- Alternativas si no está disponible: `tuzosjrz.mx`, `tuzosjrz.app`

### 2. Crea las cuentas de servicios (día 1-3)

Todas gratis para empezar:

| Servicio | URL | Para qué | Plan gratuito |
|---|---|---|---|
| **Supabase** | [supabase.com](https://supabase.com) | Base de datos + auth | 500 MB, 50K usuarios/mes |
| **Cloudflare** | [cloudflare.com](https://cloudflare.com) | DNS + CDN + protección | Ilimitado |
| **OneSignal** | [onesignal.com](https://onesignal.com) | Push notifications | 10K usuarios gratis |
| **Sentry** | [sentry.io](https://sentry.io) | Detectar errores | 5K eventos/mes |
| **Resend** | [resend.com](https://resend.com) | Emails transaccionales | 3K emails/mes |
| **UploadThing** | [uploadthing.com](https://uploadthing.com) | Subir fotos/docs | 2 GB gratis |

Guarda todas las credenciales (API keys) en un archivo seguro — las vas a necesitar.

### 3. Prepara las cuentas de pagos (día 3-7)
Para poder cobrar cuotas reales:
- **Stripe México** ([stripe.com/mx](https://stripe.com/mx)) — mejor UX, requiere RFC del club
- **MercadoPago** ([mercadopago.com.mx](https://mercadopago.com.mx)) — más fácil de habilitar
- **CLABE del banco del club** — para SPEI directo (ya tienes)

### 4. Requisitos legales (semana 1-2)
Necesitas 3 documentos legales antes de recibir usuarios reales:

1. **Términos y Condiciones**
   - Puedes generar uno base gratis en [Termly.io](https://termly.io)
   - Revisa que mencione: uso permitido, pagos, cancelaciones, propiedad intelectual

2. **Aviso de Privacidad**
   - **Obligatorio en México** por la Ley Federal de Protección de Datos
   - Especial atención: datos de menores requieren consentimiento del tutor
   - Generador gratis: [gob.mx](https://www.gob.mx/tramites/ficha/aviso-de-privacidad/INAI4859)

3. **Consentimiento para uso de imagen**
   - Fotos de los niños en la app / redes sociales
   - Los papás deben firmar digitalmente

**Consejo**: consulta un abogado mexicano especializado en tech por 1-2 horas (~$3,000 MXN). Vale muchísimo la pena.

---

## 🚚 CÓMO migrar — Paso a paso

### Paso 1: Abre Genspark Code

Ve a la plataforma Genspark Code (busca el enlace en tu cuenta principal de Genspark).

### Paso 2: Crea un nuevo proyecto

- Elige **"Nuevo proyecto en blanco"**
- Nombre: `TuzosJrz App`
- Framework: **Next.js + Supabase** (recomendado — es lo más compatible)

### Paso 3: Sube este bundle completo

En Genspark Code:
1. Ve a **Import → Upload folder**
2. Sube toda la carpeta `design_handoff_tuzosjrz/source_files/`
3. Espera que se procesen los archivos

Genspark Code detectará automáticamente:
- Los 25 componentes de pantalla
- Los datos mock (los convertirá en tablas reales)
- Los estados del prototipo
- La estructura de rutas

### Paso 4: Dile a Genspark Code qué hacer

En el prompt inicial, copia exactamente esto:

```
Migra este prototipo de TuzosJrz a una aplicación funcional real con:

BACKEND:
- Base de datos: Supabase con las tablas descritas en BACKEND_SCHEMA.md
- Autenticación: Supabase Auth con Google + Apple + email/password
- Storage: Supabase Storage para fotos de jugadores y documentos
- Realtime: Chat y notificaciones live vía Supabase Realtime

FRONTEND:
- Framework: Next.js 14 con App Router
- Deploy: Vercel
- Estilos: preservar exactamente los estilos actuales del prototipo
- Componentes: mantener la estructura de screens/ actual

INTEGRACIONES:
- Pagos: Stripe Checkout para tarjetas + integración SPEI vía openpay
- Push: OneSignal para notificaciones móviles
- Email: Resend para transaccionales
- Storage de imágenes: UploadThing
- Mapas: Google Maps embed para sedes

FLUJOS CRÍTICOS QUE DEBEN FUNCIONAR:
1. Auth con roles (admin, coach, padre) según email
2. Pagos recurrentes de cuotas + histórico
3. MatchLive con eventos en tiempo real
4. Chat con reacciones y anuncios oficiales
5. Documentos con validación y aprobación
6. Push automáticos por eventos (goles, cambios de partido, anuncios)

Prioridad: PWA primero (Progressive Web App para móvil), después considerar wrapper nativo iOS/Android con Capacitor.
```

Genspark Code trabajará por ti durante ~30-60 min armando toda la infraestructura.

### Paso 5: Conecta tus servicios

Genspark Code te pedirá las API keys de:
- Supabase (URL + anon key + service role key)
- Stripe (publishable + secret)
- OneSignal (App ID + REST key)
- Resend (API key)
- UploadThing (secret + app ID)

Pégalas cuando te pregunte. **NUNCA las compartas en un chat público.**

### Paso 6: Verifica que funcione

Genspark Code te dará una URL temporal tipo `https://tuzosjrz-preview.vercel.app`. Pruébala:
- Registra un usuario de prueba
- Crea un partido
- Registra un pago
- Todo debe persistir aunque cierres el navegador

### Paso 7: Conecta tu dominio real

En Vercel Dashboard:
1. Domain Settings → Add domain → `tuzosjrz.com`
2. Configura los DNS en Cloudflare como te indique
3. Espera ~15 min → tu app estará en `tuzosjrz.com`

### Paso 8: PWA para instalar como app

La app ya funcionará como PWA — los papás pueden:
- iPhone: Safari → Compartir → **Añadir a inicio**
- Android: Chrome → menú → **Instalar app**

Con esto ya tienes una "app" en su celular con ícono TuzosJrz sin pasar por las tiendas.

---

## 🧪 Piloto controlado (semanas 3-6)

Antes de invitar a todo el club, prueba con 1 categoría:

### Semana 1 — Setup interno
- Dar de alta al staff (admin + coaches) — máx 5 personas
- Cargar la lista de jugadores de Sub-12 (~15 chicos)
- Verificar que puedes crear eventos, cobrar pagos de prueba, chat

### Semana 2 — Invitar tutores piloto
- Enviar por WhatsApp el enlace de registro a las 15 familias piloto
- Screen share con 2-3 papás mostrándoles cómo usar la app
- Recoger sus dudas — hacer ajustes rápidos

### Semana 3-4 — Uso real
- Todo lo del club se hace por la app durante 3-4 semanas
- Reunión semanal con papás piloto para feedback
- Fixar bugs / ajustar copy / mejorar flujos confusos

### Semana 5-6 — Preparar rollout
- Con feedback aplicado, invitar al resto del club
- Comunicación oficial vía WhatsApp del club
- Video tutorial de 2-3 min para papás mayores

---

## 📱 Fase 2: App nativa (opcional, mes 3-4)

Si el piloto va bien y quieren estar en las tiendas:

### Opción rápida: Capacitor
- Envuelve tu web app como app nativa
- Cuesta ~$4,000-8,000 MXN de un dev freelance
- 2-3 semanas
- Publicable en App Store y Google Play
- Aprovecha 100% el código de la web

Cuentas requeridas:
- **Apple Developer Program**: $99 USD/año
- **Google Play Console**: $25 USD (una vez)

### Opción completa: React Native / Expo
- App nativa real, mejor performance
- $15,000-40,000 MXN dev freelance
- 1-2 meses
- Mejor experiencia para el usuario

---

## 🎨 Cómo seguir iterando en el diseño

Después de migrar, puedes seguir usándome aquí en Design para:
- Diseñar features nuevas antes de codearlas
- Iterar visuales sin tocar producción
- Prototipos rápidos de ideas

**Workflow ideal**:
1. Tienes idea nueva → probar en Design (aquí)
2. Cuando te guste → pedirle a Genspark Code que la implemente
3. Deploy automático a producción

---

## 💰 Costos estimados mensuales (fase piloto ~50 usuarios)

| Concepto | Costo mensual |
|---|---|
| Dominio | $15 MXN (~$180/año) |
| Supabase Free | $0 |
| Vercel Free (hosting) | $0 |
| OneSignal Free | $0 |
| Resend Free | $0 |
| UploadThing Free | $0 |
| Stripe (por transacción) | 3.6% + $3 MXN por pago |
| Google Workspace (email club) | $60 MXN/usuario |
| **TOTAL fijo** | **~$150 MXN/mes** |

**Al escalar a ~200 familias**: sube a ~$800-1,200 MXN/mes (planes Pro de Supabase y Vercel).

---

## ⚠️ Errores comunes a evitar

1. **NO subas API keys a GitHub público** — Genspark Code las maneja seguras, pero no las pegues en el código directo
2. **NO cobres pagos reales antes de probar con dinero de prueba** — Stripe tiene modo test
3. **NO expongas datos de menores sin consentimiento firmado** — problema legal serio
4. **NO uses fotos de niños en RRSS sin autorización de los tutores** — pide consentimiento explícito
5. **NO abras al público antes del piloto** — vas a tener bugs, mejor con familias amigas que perdonan

---

## 🆘 ¿Te atoras? Aquí ayuda

- **Genspark Code docs**: [ver documentación oficial]
- **Supabase Discord**: comunidad activa, muy útil
- **Stack Overflow**: para errores técnicos
- **Vuelve aquí a Design**: para iterar UI

---

## ✅ Checklist final antes de publicar

Antes de anunciar la app a todo el club, verifica:

- [ ] Dominio comprado y funcionando (`tuzosjrz.com`)
- [ ] Términos y Condiciones publicados
- [ ] Aviso de Privacidad publicado
- [ ] Cuentas de pagos verificadas (Stripe/MercadoPago)
- [ ] Piloto con 1 categoría exitoso (mínimo 3 semanas)
- [ ] Backup automático de la BD configurado
- [ ] Al menos 2 personas del staff saben usar el admin
- [ ] Video tutorial para padres grabado
- [ ] Grupo WhatsApp de soporte creado
- [ ] Contrato con Pachuca sobre uso de marca "filial"
- [ ] Plan de comunicación de lanzamiento listo

---

**¡Éxito con TuzosJrz! 🐎⚽🚀**

Cuando estés listo para migrar, abre Genspark Code y sigue esta guía. Yo aquí en Design sigo disponible para lo que necesites.
