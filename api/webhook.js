import axios from "axios";

export default async function handler(req, res) {
  const message = req.body.message?.text;
  const chatId = req.body.message?.chat.id;

  if (!message || !chatId) {
    return res.status(200).send("ok");
  }

  // Envia mensagem do usuário para o LLM
  const llmResponse = await axios.post(
    process.env.VERCEL_URL + "/api/llm",
    { messageFromUser: message }
  );

  const { assistant_message, action } = llmResponse.data;

  // Primeiro envia a resposta do assistente
  await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
    chat_id: chatId,
    text: assistant_message
  });

  // Se o LLM quer fazer uma ação (buscar horários ou agendar)
  if (action && action.type) {
    if (action.type === "check_times") {
      const r = await axios.get(
        process.env.VERCEL_URL + "/api/available-times",
        { params: action.params }
      );

      const times = r.data.availableTimes.join(", ");

      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `Horários disponíveis: ${times}`
      });
    }

    if (action.type === "create_schedule") {
      const r = await axios.post(
        process.env.VERCEL_URL + "/api/schedule",
        action.params
      );

      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: `Agendamento confirmado! ID: ${r.data.id}`
      });
    }
  }

  res.status(200).send("ok");
}

