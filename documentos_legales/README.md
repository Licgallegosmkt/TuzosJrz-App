# 📋 Documentos Legales TuzosJrz
## Filial Oficial del Club Pachuca

Esta carpeta contiene los **5 documentos legales y operativos** para lanzar la app TuzosJrz y proteger legalmente al club, coaches, familias y a los menores.

---

## 📂 Contenido

| Doc | Nombre | Propósito | Para quién |
|---|---|---|---|
| 1 | **Reglamento Interno v2** | Documento maestro que rige la operación completa del club | Todos (imprimir + firma) |
| 2 | **Aviso de Privacidad** | Cumple con LFPDPPP (obligatorio en México) | Firmar por tutor |
| 3 | **Términos de Uso de la App** | Rige el uso de la aplicación digital | Aceptar en la app |
| 4 | **Checklist de Consentimientos** | Guía técnica para implementar registro | Solo dev / Genspark Code |
| 5 | **Resumen 1 página** | Reglas esenciales para colgar/entregar | Padres nuevos |

---

## ⚖️ Marco legal cubierto

Estos documentos cumplen con:

✅ **Ley Federal de Protección de Datos Personales en Posesión de los Particulares** (LFPDPPP)
✅ **Reglamento de la LFPDPPP**
✅ **Lineamientos del Aviso de Privacidad emitidos por el INAI**
✅ **Ley General de los Derechos de Niñas, Niños y Adolescentes**
✅ **Código de Comercio** (validez de aceptación electrónica)
✅ **Código Federal de Procedimientos Civiles** (firma electrónica)
✅ Protecciones específicas para el **uso de imagen de menores**
✅ Protección de la relación con el **Club Pachuca** como filial

---

## 🚀 Cómo usarlos

### Paso 1 — Revisión legal profesional
Aunque los documentos están redactados con base en las mejores prácticas y marco legal mexicano, **te recomiendo ENFÁTICAMENTE**:

1. Contactar un **abogado especializado en tech/protección de datos** en México
2. Revisar los 5 documentos con él (2-3 horas de consulta, ~$3,000-6,000 MXN)
3. Ajustar cualquier cláusula específica a tu situación (razón social, RFC, casos particulares)
4. Firmar y sellar la versión final

### Paso 2 — Personalización final
Antes de usarlos, completa:
- [ ] Fechas exactas de vigencia
- [ ] Código postal en dirección
- [ ] Porcentaje de recargo por mora (Sección 7.6 del Reglamento)
- [ ] Confirmar teléfono / correo de contacto oficial
- [ ] Firmar la razón social exacta (si tienes RFC)
- [ ] Datos bancarios finales verificados

### Paso 3 — Publicación
Una vez ajustados:

1. **Imprimir**: Reglamento Interno + Aviso Privacidad + Resumen 1-página para inscripciones presenciales
2. **Subir a app**: Los mismos + Términos de Uso, para aceptación digital
3. **Publicar en website**: Aviso de Privacidad debe estar accesible en `tuzosjrz.com/privacidad` conforme LFPDPPP
4. **Colgar en instalaciones**: Resumen 1-página en corcho / pared visible
5. **Entregar a familias existentes**: nueva firma requerida cuando se lance la app

### Paso 4 — Implementación en la app
El **documento #4 (Checklist de Consentimientos)** es la guía técnica que le vas a pasar a Genspark Code. Contiene:
- Cada checkbox que debe aparecer
- El texto exacto que debe mostrar
- Qué se guarda en la base de datos
- Estructura de tabla SQL sugerida
- UX recomendada

---

## 🔄 Actualizaciones futuras

**Cuando modifiques cualquier documento**:

1. Cambia el número de versión (ej. v2.0 → v2.1)
2. Actualiza la fecha
3. Notifica a padres actuales por app + email
4. Muestra modal bloqueante en la app con los cambios resaltados
5. Requiere re-aceptación antes de continuar usando la app
6. Guarda registro en tabla `consents` con nueva versión

---

## 💡 Cambios clave vs. tu reglamento anterior

Estas son las **mejoras / adiciones** respecto al reglamento original que subiste:

### ✨ Nuevo — Sección 1: Naturaleza jurídica
Aclara que TuzosJrz ≠ Pachuca profesional. Protege ante confusiones y evita responsabilidad por promesas.

### ✨ Nuevo — Sección 4.3: Comportamiento en la banca (REFORZADO)
Especificas prohibición de gritar instrucciones técnicas (situación que viviste).

### ✨ Nuevo — Sección 4.5: Redes sociales
Prohibe comentarios negativos en redes como **causal de baja** (situación que viviste).

### ✨ Nuevo — Sección 4.6: Custodia legal
Manejo formal de padres divorciados / custodia compartida (situación que viviste).

### ✨ Nuevo — Sección 3.2: Uniforme oficial (REFORZADO)
Prohíbe uniformes de otras marcas y personalización sin permiso (situaciones que viviste).

### ✨ Nuevo — Sección 7.4: Bajas, reingresos y devoluciones
Explícito sobre "no reembolsos" y qué pasa si te vas y regresas.

### ✨ Nuevo — Sección 8: Régimen disciplinario progresivo
Escala clara de sanciones nivel 1 a 4 con debido proceso.

### ✨ Nuevo — Sección 9: Emergencias médicas
Autorización preventiva + responsabilidad de gastos.

### ✨ Nuevo — Sección 10: Uso de imagen y RRSS
Regulación completa de fotos, videos y publicaciones.

### ✨ Nuevo — Sección 11: Uso de la app
Prohibiciones específicas del chat / cuenta / notificaciones.

### ✨ Nuevo — Aviso de Privacidad **completo**
Tu doc anterior tenía 3 líneas; este cumple 100% con INAI + protección reforzada de menores.

### ✨ Nuevo — Términos de Uso de la App
Documento nuevo específico para la parte digital (chat, pagos online, notificaciones).

---

## ⚠️ Nota final importante

**Estos documentos son propuesta profesional bien fundamentada, pero NO reemplazan el consejo legal formal.**

Antes de usarlos con clientes reales, **contrata revisión de abogado**. Es una inversión pequeña que te ahorra problemas grandes.

Recomendaciones para encontrar abogado:
- Buscar "abogado protección de datos INAI" en tu ciudad
- Barra Mexicana de Abogados
- Referencias en tu red del ámbito deportivo
- Servicios legales de tu banco (algunos incluyen)

---

## 📞 Contacto

Si necesitas ajustes específicos, más situaciones documentadas, o quieres diseñar la pantalla de consentimientos en la app, vuelve a la conversación de Genspark Design.

---

*TuzosJrz — Filial Oficial del Club Pachuca*
*Documentos elaborados con base en marco legal mexicano vigente*
