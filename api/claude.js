export default async function handler(req, res) {
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
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();

    // 👇 AGREGA ESTO
    console.log("CLAUDE RESPONSE:", data);

    res.status(200).json(data); // 👈 devuelve TODO
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
