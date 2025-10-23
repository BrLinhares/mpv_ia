export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Você é o Potiboy IA, assistente da Potiguar. Fale com tom nordestino simpático, ajude clientes com dúvidas sobre construção, acabamentos e produtos da loja. Seja claro, breve e prestativo. Inclua links do site da Potiguar quando sugerir produtos."
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Opa, deu ruim! Não consegui processar sua mensagem agora." });
  }
}
