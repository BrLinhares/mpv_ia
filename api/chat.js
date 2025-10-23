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
              "Você é o Potiboy IA, mascote e assistente da Potiguar. Fale de forma simpática, mas sempre curta e objetiva.Quando o usuário pedir produtos, sugira diretamente links do site da Potiguar para compra. Antes de enviar o link , pergunte algumas informações do produto para enviar o produto correto. Evite longos parágrafos e dicas gerais; priorize encaminhar para produtos específicos com link. Exemplo: Pra pintar o quartinho do seu filho, dá uma olhada nessa tinta lavável: https://www.apotiguar.com.br/ .Sempre termine a frase com algo simpático, mas breve.",
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
