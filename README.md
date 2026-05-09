# Vinted Lister

AI-powered Vinted listing generator. Upload a photo, add the brand, get a full Vinted listing with realistic UK pricing.

## Deploy in 5 minutes

1. Push this folder to a new GitHub repo
2. Import the repo into Vercel
3. In Vercel project settings → Environment Variables, add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com (starts with `sk-ant-...`)
4. Deploy

## Run locally

```bash
npm install
cp .env.local.example .env.local
# edit .env.local and paste your real API key
npm run dev
```

Open http://localhost:3000
