import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const TELEGRAM_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;
const OPENAI_KEY = process.env.OPENAI_KEY;

async function sendMessage(chatId, text) {
  try {
    await axios.post(`${TELEGRAM_URL}/sendMessage`, { chat_id: chatId, text });
  } catch (err) {
    console.error('sendMessage error:', err?.response?.data || err.message);
  }
}

app.post('/webhook', async (req, res) => {
  const msg = req.body.message;
  if (!msg) return res.send("ok");

  const chatId = msg.chat.id;
  const text = msg.text || "";

  let reply = "IA não configurada.";
  if (OPENAI_KEY) {
    try {
      const r = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "Você é BarberAI, um atendente simpático, humano e educado." },
            { role: "user", content: text }
          ]
        },
        { headers: { Authorization: `Bearer ${OPENAI_KEY}` } }
      );
      reply = r.data.choices[0].message.content;
    } catch (err) {
      reply = "Erro ao acessar IA.";
    }
  }

  await sendMessage(chatId, reply);
  res.send("ok");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("BarberAI rodando na porta " + PORT));
