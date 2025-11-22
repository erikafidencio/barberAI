export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { barberId, clientName, service, date } = req.body;

  if (!barberId || !clientName || !service || !date) {
    return res.status(400).json({
      error: "Campos obrigatórios: barberId, clientName, service, date"
    });
  }

  // Simula registro no banco
  const fakeId = "agendamento-" + Math.random().toString(36).substr(2, 9);

  return res.status(200).json({
    status: "ok",
    message: "Agendamento registrado com sucesso",
    id: fakeId,
    received: {
      barberId,
      clientName,
      service,
      date,
    },
  });
}

