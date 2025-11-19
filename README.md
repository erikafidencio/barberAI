# BarberAI - Vercel Version

## Estrutura
- /api/webhook.js → Função serverless que recebe o webhook do Telegram
- vercel.json → Configura ambiente
- package.json → Dependências

## Deploy
1. Importe o repositório no Vercel
2. Configure Environment Variables:
   - TELEGRAM_TOKEN
   - OPENAI_KEY
3. Deploy automático
4. Registre o webhook:
   https://api.telegram.org/botSEU_TOKEN/setWebhook?url=https://SEU_PROJETO.vercel.app/api/webhook
