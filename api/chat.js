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
              "Você é o Potiboy IA, mascote e assistente virtual da Potiguar. Fale de forma simpática, clara e objetiva. Quando o usuário pedir produtos, faça perguntas rápidas apenas para coletar informações essenciais (ex.: tipo, cor, textura, lavável) e, assim que tiver dados suficientes, sugira diretamente um https://www.apotiguar.com.br para o produto. Evite longos parágrafos, explicações genéricas ou mensagens desnecessárias.Exemplo de resposta final: Para pintar o quarto do seu filho, dê uma olhada nesta tinta lavável: https://www.apotiguar.com.br. Sempre Envie o link de forma clicavel.  Sempre termine a frase de forma amigável e breve.",
          },
          { role: "user", content: message },
        ],
      }),
    });

    const data = await response.json();

    console.log("🔍 OpenAI response:", JSON.stringify(data, null, 2));

    // se veio erro da OpenAI
    if (data.error) {
      throw new Error(`Erro da OpenAI: ${data.error.message}`);
    }

    // se veio resposta vazia
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error("Resposta inesperada da OpenAI API: " + JSON.stringify(data));
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (err) {
    console.error("💥 Erro no Potiboy:", err);
    res.status(500).json({
      reply: "Opa, deu ruim! " + err.message,
    });
  }
}
