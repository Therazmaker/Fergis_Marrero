# 📋 Cómo crear un post nuevo para el Blog

## Flujo de trabajo

1. Crea un archivo `.json` en la carpeta `posts/`
2. Nómbralo con el slug del post (sin espacios, sin tildes, en minúsculas)
3. Agrega el nombre del archivo (sin `.json`) al array `POST_FILES` en tu `blog.html`
4. Súbelo a GitHub → el blog lo detecta automáticamente

---

## Prompt para generar el JSON con IA

Copia este prompt y pega tu contenido al final:

```
Eres asistente de contenido para el blog "Entre Diosas Girasol" de Fergis Marrero.
Tu tarea es convertir el contenido que te doy en un archivo JSON válido siguiendo este schema.

REGLAS:
- El campo "id" debe ser el título en minúsculas, sin tildes, con guiones en vez de espacios
- El campo "fecha" en formato YYYY-MM-DD
- Los "tags" deben coincidir con los filtros definidos en el blog.
- El campo "bloques" es el array con el contenido en orden

TIPOS DE BLOQUE DISPONIBLES:
- "lead"      → Párrafo de entrada en cursiva grande (solo uno, al inicio)
- "parrafo"   → Párrafo normal
- "h3"        → Subtítulo de sección (incluye el emoji en el texto)
- "callout"   → Caja destacada con borde dorado
- "divisor"   → Línea divisora con texto al centro
- "cita"      → Bloque oscuro de reflexión final (con campo "emoji")

SCHEMA:
{
  "id": "slug-del-post",
  "titulo": "Título del post",
  "fecha": "YYYY-MM-DD",
  "emoji": "🌻",
  "tags": ["reflexiones"],
  "tagLabels": ["💭 Reflexiones"],
  "resumen": "Resumen para la card.",
  "lecturaMin": 3,
  "bloques": [
    { "tipo": "lead", "texto": "..." },
    { "tipo": "h3", "texto": "🌻 Título" },
    { "tipo": "parrafo", "texto": "..." },
    { "tipo": "callout", "texto": "..." },
    { "tipo": "divisor", "texto": "..." },
    { "tipo": "cita", "texto": "...", "emoji": "🌻 ✨" }
  ]
}

Devuelve SOLO el JSON válido.

CONTENIDO:
[PEGA AQUÍ TU CONTENIDO]
```

---

## Tags disponibles (Filtros del blog)

Estos son los valores que debes usar en el campo `"tags"` para que el blog los filtre correctamente:

| Tag (id) | Label visible |
|---|---|
| `amor-propio` | 💛 Amor propio |
| `relaciones-vinculos` | 💞 Relaciones y vínculos |
| `autoconocimiento` | 🌙 Autoconocimiento |
| `reflexiones` | 💭 Reflexiones |
| `bienestar-emocional` | 🌿 Bienestar emocional |
| `patrones-creencias` | ✨ Patrones y creencias |

> **Nota:** Un post puede tener más de un tag.
> Ejemplo: `"tags": ["reflexiones", "bienestar-emocional"]`

---

## Referencia de bloques

| Tipo | Uso |
|---|---|
| `lead` | Introducción breve (cursiva). |
| `h3` | Título de sección con emoji. |
| `callout` | Destacado importante (borde dorado). |
| `divisor` | Línea de separación con texto. |
| `cita` | Reflexión final en bloque oscuro. |
