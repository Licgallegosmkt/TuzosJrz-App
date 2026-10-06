# 🔄 Cómo actualizar tu repositorio en GitHub

Repo: `Licgallegosmkt/TuzosJrz-App`

Esta guía es para cuando YA tienes el repo creado y quieres subir la versión nueva (sin usar terminal).

---

## 🅰️ Método fácil — desde el navegador (recomendado)

### 1. Descarga y descomprime el ZIP
- Descarga `design_handoff_tuzosjrz.zip` desde Genspark
- Descomprímelo en tu computadora

### 2. Entra a tu repo
Abre https://github.com/Licgallegosmkt/TuzosJrz-App

### 3. Sube los archivos actualizados
1. Clic en **Add file → Upload files**
2. Arrastra **el contenido** de la carpeta descomprimida (no la carpeta en sí):
   - `source_files/`
   - `documentos_legales/`
   - `README.md`, `MIGRACION_A_GENSPARK_CODE.md`, `BACKEND_SCHEMA.md`, etc.
3. GitHub detecta los archivos con el mismo nombre y **los reemplaza** automáticamente
4. Los archivos nuevos (ej. `ConsentsScreen.jsx`) se agregan solos

> ⚠️ GitHub web permite máx. 100 archivos por subida. Si te marca error, sube primero `source_files/screens/` y luego el resto.

### 4. Escribe el mensaje del commit
Abajo, en "Commit changes":
```
v6 — Consentimientos, calendario híbrido, MatchLive, pizarra mejorada, alta de jugadores
```
Clic en **Commit changes** ✅

### 5. GitHub Pages se actualiza solo
Si tienes Pages activo, en 1–3 minutos tu link público mostrará la nueva versión.
Revisa el progreso en la pestaña **Actions**.

---

## 🅱️ Método con GitHub Desktop (si lo usas)

1. Abre GitHub Desktop → selecciona `TuzosJrz-App`
2. Clic **Repository → Show in Explorer/Finder**
3. Copia el contenido nuevo encima de la carpeta local (reemplazar)
4. En GitHub Desktop verás la lista de cambios
5. Escribe el resumen → **Commit to main** → **Push origin**

---

## 🅲️ Método con terminal (para devs)

```bash
cd TuzosJrz-App
# copia aquí el contenido nuevo del ZIP (reemplazando)
git add .
git commit -m "v6 — Consentimientos, calendario híbrido, MatchLive, pizarra, alta de jugadores"
git push origin main
```

---

## 🗑️ ¿Y si borré o renombré archivos?

Subir por web **no borra** archivos viejos. Si un archivo ya no existe en la versión nueva:
1. Ábrelo en GitHub
2. Ícono 🗑️ (Delete file) → Commit

En esta versión **no se eliminó ningún archivo**, solo se agregaron/actualizaron.

---

## 📋 Qué cambió en esta versión (v6)

**Archivos nuevos**
- `source_files/screens/ConsentsScreen.jsx`
- `documentos_legales/` (6 documentos)
- `COMO_ACTUALIZAR_GITHUB.md` (este)
- `MAPA_FUNCIONALIDADES.md`

**Archivos actualizados**
- `TuzosJrz.html`, `app.jsx`, `data.js`
- `screens/Players.jsx` — botón ➕ con 3 opciones (nuevo jugador, invitar tutor, importar CSV)
- `screens/Tactics.jsx` — toolbar superior, menús desplegables, resize 4 esquinas, flechas eliminables
- `screens/Materials.jsx` — materiales al doble de tamaño, zonas redimensionables
- `screens/EventDetail.jsx` — "Añadir a mi calendario"
- `screens/Profile.jsx` — sincronización webcal
- `screens/MatchLive.jsx` — simplificado (sin asistencias ni cambios) + logo en tarjeta
- `screens/Chat.jsx` — reacciones + anuncios con push
- `screens/ParentOnboarding.jsx` — paso de consentimientos

---

## ✅ Checklist después de subir

- [ ] La pestaña **Actions** muestra ✓ verde
- [ ] Abre tu URL de Pages → carga la app
- [ ] Recarga con **Ctrl+Shift+R** (o Cmd+Shift+R) para evitar caché
- [ ] Prueba: login → Jugadores → ➕
