export default function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const { barberId, date } = req.query;

  if (!barberId || !date) {
    return res.status(400).json({
      error: "Você deve enviar barberId e date como query params",
      example: "/api/available-times?barberId=1&date=2025-11-22"
    });
  }

  // Horários fixos simulados — podemos depois conectar a um banco
  const allTimes = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "16:00",
    "17:00"
  ];

  // Aqui você depois puxa do banco: horários ocupados
  // Por enquanto vamos simular
  const takenTimes = ["10:00", "14:30"]; // simulação

  const available = allTimes.filter(t => !takenTimes.includes(t));

  res.status(200).json({
    status: "ok",
    barberId,
    date,
    availableTimes: available
  });
}

