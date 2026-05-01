export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const { message } = req.body;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CLAUDE_API_KEY,
        "anthropic-version": "2023-06-01"
      },
     body: JSON.stringify({
  model: "claude-3-haiku-20240307",
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

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const reply = data.content?.[0]?.text;

    res.status(200).json({
      reply: reply || "Claude respondió vacío 🤔"
    });

  } catch (err) {
    res.status(500).json({ error: "Error interno" });
  }
}
