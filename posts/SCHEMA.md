# 📋 Cómo crear un post nuevo para el Blog

## Flujo de trabajo

1. Crea un archivo `.json` en la carpeta `posts/`
2. Nómbralo con el slug del post (sin espacios, sin tildes, en minúsculas)  
   Ejemplo: `mercurio-retrogrado-mayo-2026.json`
3. Súbelo a GitHub → el blog lo detecta automáticamente

---

## Prompt para generar el JSON con IA

Copia esto y pégalo en Claude (o cualquier IA), luego pega tu contenido al final:

---

```
Eres asistente de contenido para el blog "Entre Diosas Girasol" de Fergis Marrero.
Tu tarea es convertir el contenido que te doy en un archivo JSON válido siguiendo este schema exacto.

REGLAS:
- El campo "id" debe ser el título en minúsculas, sin tildes, con guiones en vez de espacios
- El campo "fecha" en formato YYYY-MM-DD
- Los "tags" solo pueden ser: "clima-astral", "emociones", "relaciones", "reflexiones"
- Los "tagLabels" son el texto visible del tag (con emoji)
- El campo "bloques" es el array con el contenido en orden

TIPOS DE BLOQUE DISPONIBLES:
- "lead"      → Párrafo de entrada en cursiva grande (solo uno, al inicio)
- "parrafo"   → Párrafo normal
- "h3"        → Subtítulo de sección (incluye el emoji en el texto)
- "callout"   → Caja destacada con borde dorado (para frases clave)
- "casas"     → Grid de las 12 casas astrológicas (ver estructura abajo)
- "divisor"   → Línea divisora con texto al centro
- "cita"      → Bloque oscuro de reflexión final (con campo "emoji")

SCHEMA COMPLETO:
{
  "id": "slug-del-post",
  "titulo": "Título del post",
  "fecha": "YYYY-MM-DD",
  "emoji": "🌕",
  "tags": ["clima-astral"],
  "tagLabels": ["🌙 Clima Astral"],
  "resumen": "Una o dos frases que resumen el post. Aparece en la card del blog.",
  "lecturaMin": 5,
  "bloques": [
    { "tipo": "lead", "texto": "..." },
    { "tipo": "parrafo", "texto": "..." },
    { "tipo": "h3", "texto": "🌻 Título de sección" },
    { "tipo": "callout", "texto": "..." },
    {
      "tipo": "casas",
      "items": [
        { "casa": "Casa 1", "texto": "..." },
        { "casa": "Casa 2", "texto": "..." },
        { "casa": "Casa 3", "texto": "..." },
        { "casa": "Casa 4", "texto": "..." },
        { "casa": "Casa 5", "texto": "..." },
        { "casa": "Casa 6", "texto": "..." },
        { "casa": "Casa 7", "texto": "..." },
        { "casa": "Casa 8", "texto": "..." },
        { "casa": "Casa 9", "texto": "..." },
        { "casa": "Casa 10", "texto": "..." },
        { "casa": "Casa 11", "texto": "..." },
        { "casa": "Casa 12", "texto": "..." }
      ]
    },
    { "tipo": "divisor", "texto": "Texto del divisor" },
    { "tipo": "cita", "texto": "...", "emoji": "🌻 ✨" }
  ]
}

Devuelve SOLO el JSON válido, sin explicaciones ni markdown. Empieza con { y termina con }.

CONTENIDO A CONVERTIR:
[PEGA AQUÍ TU CONTENIDO]
```

---

## Referencia rápida de tipos de bloque

| Tipo | Cuándo usarlo |
|------|---------------|
| `lead` | Primera frase gancho del post (solo una vez) |
| `parrafo` | Texto corriente |
| `h3` | Nuevo subtema o sección |
| `callout` | Frase importante, conclusión parcial |
| `casas` | Cuando el post incluye las 12 casas astrológicas |
| `divisor` | Separar dos secciones grandes |
| `cita` | Reflexión final o frase para guardar |

---

## Ejemplo de nombre de archivo

| Título del post | Nombre del archivo |
|---|---|
| Luna Nueva en Tauro — Mayo 2026 | `luna-nueva-tauro-mayo-2026.json` |
| Mercurio Retrógrado: qué esperar | `mercurio-retrogrado-que-esperar.json` |
| Cómo soltar un vínculo que duele | `como-soltar-vinculo-que-duele.json` |

---

## Tags disponibles

| Tag (id) | Label visible |
|---|---|
| `clima-astral` | 🌙 Clima Astral |
| `emociones` | 🧠 Emociones |
| `relaciones` | 💔 Relaciones |
| `reflexiones` | 🔮 Reflexiones |

Un post puede tener más de un tag. Ejemplo:
```json
"tags": ["clima-astral", "relaciones"],
"tagLabels": ["🌙 Clima Astral", "💔 Relaciones"]
```
