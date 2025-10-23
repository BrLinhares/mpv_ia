export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Método não permitido" });
  }

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
            content:
              "Você é o Potiboy IA, mascote e assistente virtual da Potiguar. Fale de forma simpática e nordestina, ajude com dúvidas sobre materiais de construção, acabamentos e reformas. Sugira produtos com links da Potiguar quando fizer sentido.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    // 👇 Captura o corpo da resposta completa
    const data = await response.json();

    // 👇 Loga no console (pode ver no painel do Vercel)
    console.log("🔍 OpenAI response:", JSON.stringify(data, null, 2));

    // 👇 Verifica se veio resposta válida
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Resposta inesperada da OpenAI API");
    }

    // 👇 Retorna a resposta do modelo
    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("💥 Erro no Potiboy:", err);
    res.status(500).json({
      reply: "Opa, deu ruim! Tive um probleminha pra responder agora. Tente de novo rapidinho, tá bom?",
    });
  }
}
