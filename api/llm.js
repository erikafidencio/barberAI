import OpenAI from "openai";

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function handler(req, res) {
  const { messageFromUser } = req.body;

  const prompt = `
  ${process.env.SYSTEM_PROMPT}
  Usuário: ${messageFromUser}
  `;

  const completion = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      { role: "system", content: process.env.SYSTEM_PROMPT },
      { role: "user", content: messageFromUser },
    ]
  });

  const result = completion.choices[0].message.content;

  res.status(200).json(JSON.parse(result));
}

