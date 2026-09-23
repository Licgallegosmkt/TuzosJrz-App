# Datos del club para carga inicial

Formato listo para poblar Supabase al arrancar la app en Genspark Code.

---

## 🛡️ Club

```json
{
  "name": "TuzosJrz",
  "subtitle": "Filial oficial del Club Pachuca",
  "domain": "tuzosjrz.com",
  "admin_email": "tuzosjrz@gmail.com",
  "address": "«Por confirmar»",
  "bank_data": {
    "bank": "«Por confirmar»",
    "holder": "«Por confirmar»",
    "clabe": "«Por confirmar»"
  }
}
```

## 👤 Admin principal

```json
{
  "email": "tuzosjrz@gmail.com",
  "role": "admin",
  "full_name": "«Nombre del admin»"
}
```

## 🏃 Entrenadores (rellenar)

```json
[
  { "name": "Coach ...", "email": "coach.xxx@tuzosjrz.com", "phone": "+52 ...", "categories": ["Sub-12"] },
  { "name": "Coach ...", "email": "coach.yyy@tuzosjrz.com", "phone": "+52 ...", "categories": ["Sub-10", "Sub-14"] }
]
```

## ⚽ Categorías y cuotas

```json
[
  { "name": "Sub-8",  "monthly_fee": 0, "age_min": 7,  "age_max": 8  },
  { "name": "Sub-10", "monthly_fee": 0, "age_min": 9,  "age_max": 10 },
  { "name": "Sub-12", "monthly_fee": 0, "age_min": 11, "age_max": 12 },
  { "name": "Sub-14", "monthly_fee": 0, "age_min": 13, "age_max": 14 },
  { "name": "Sub-16", "monthly_fee": 0, "age_min": 15, "age_max": 16 }
]
```

**⚠️ Reemplazar `monthly_fee: 0` con las cuotas reales antes de arrancar.**

## 💳 Clip

Cuando la cuenta Clip esté lista:
```
CLIP_PUBLIC_KEY=«pk_...»
CLIP_PRIVATE_KEY=«sk_...»  (nunca commitear, va en secrets de Vercel)
CLIP_WEBHOOK_SECRET=«...»
```

## 📄 Documentos del club (URLs cuando estén en Supabase Storage)

- `aviso_privacidad_url`: «pendiente subir»
- `reglamento_url`: «pendiente subir»
- `logo_url`: `assets/tuzosjrz-logo.png` (ya incluido en bundle)
- `crest_pachuca_url`: `assets/pachuca-crest.png` (ya incluido en bundle)

## 🐙 GitHub

- **Repo**: `Licgallegosmkt/TuzosJrz-App` (privado)
- **Default branch**: `main`

## 🌐 Deploy

- **Dominio**: `tuzosjrz.com` (ya comprado)
- **Recomendado**: Vercel (conecta directo con GitHub)
- **Alternativa**: Netlify

## 📱 App Store / Play Store (fase 2)

- **Icono app**: 1024×1024 (versión cuadrada del `tuzosjrz-logo.png`)
- **Splash screen**: ya diseñada en `screens/AuthFlow.jsx`
