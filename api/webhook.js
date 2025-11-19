import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).send("OK");
  }

  let update;
  try {
    update = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    console.log("Parse error:", e.message);
    return res.status(200).send("OK");
  }

  console.log("UPDATE:", update);

  if (!update || !update.message) {
    return res.status(200).send("OK");
  }

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
  const OPENAI_KEY = process.env.OPENAI_KEY;
  const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`;

  let reply = "IA não configurada.";

  if (OPENAI_KEY) {
    try {
      const r = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Você é BarberAI, um atendente simpático e humano."},
            { role: "user", content: text }
          ]
        },
        { headers: { "Authorization": "Bearer " + OPENAI_KEY } }
      );
      reply = r.data.choices[0].message.content;
    } catch (e) {
      reply = "Erro ao acessar IA.";
      console.log("OpenAI ERROR:", e.response?.data || e.message);
    }
  }

  try {
    await axios.post(TELEGRAM_URL, {
      chat_id: chatId,
      text: reply
    });
  } catch (e) {
    console.log("sendMessage ERROR:", e.response?.data || e.message);
  }

  return res.status(200).send("OK");
}
