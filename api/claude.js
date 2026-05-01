export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Falta el mensaje" });
    }

    // Llamada a Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 300,
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: message }
            ]
          }
        ]
      })
    });

    // ⚠️ Leer como texto primero (para evitar errores JSON)
    const rawText = await response.text();

    let data;

    try {
      data = JSON.parse(rawText);
    } catch (err) {
      return res.status(500).json({
        error: "Claude devolvió texto no JSON",
        raw: rawText
      });
    }

    // Manejo de error de Claude
    if (data.error) {
      return res.status(500).json({
        error: data.error.message || "Error desconocido de Claude",
        full: data
      });
    }

    // Extraer respuesta correctamente
    const reply = data.content?.[0]?.text;

    return res.status(200).json({
      reply: reply || "Claude respondió vacío 🤔"
    });

  } catch (error) {
    return res.status(500).json({
      error: "Error interno del servidor",
      detail: error.message
    });
  }
}
