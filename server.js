import express from 'express';
import axios from 'axios';

const app = express();

// Telegram envia JSON, texto ou form-data dependendo do cliente.
// Precisamos aceitar tudo para garantir que sempre funciona.
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.text({ type: "*/*" }));

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const OPENAI_KEY = process.env.OPENAI_KEY;

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_URL}/sendMessage`, {
      chat_id: chatId,
      text: text
    });
  } catch (err) {
    console.log("sendMessage error:", err.response?.data || err.message);
  }
}

app.post('/webhook', async (req, res) => {
  let update;

  // Se vier como string (text/plain), tenta converter para JSON
  try {
    update = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  } catch (e) {
    console.log("Erro ao parsear body:", e.message);
    return res.send("ok");
  }

  console.log("UPDATE RECEBIDO:", update);

  if (!update || !update.message) {
    return res.send("ok");
  }

  const chatId = update.message.chat.id;
  const text = update.message.text || "";

  let reply = "IA não configurada.";
  if (OPENAI_KEY) {
    try {
      const r = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Você é BarberAI, um atendente simpático e humano." },
            { role: "user", content: text }
          ]
        },
        { headers: { Authorization: `Bearer ${OPENAI_KEY}` } }
      );
      reply = r.data.choices[0].message.content;
    } catch (err) {
      reply = "Erro ao acessar IA.";
      console.log("OpenAI error:", err.response?.data || err.message);
    }
  }

  await sendMessage(chatId, reply);
  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("BarberAI rodando na porta " + PORT));

