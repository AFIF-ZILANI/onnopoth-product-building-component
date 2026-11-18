# Product Building Competition (Using AI) — OnnoPoth

Next.js (App Router) + Tailwind CSS website for the online competition.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your real Gmail credentials
npm run dev                  # http://localhost:3000
```

## Environment variables (server-only)

| Variable | Where to set it |
| --- | --- |
| `GMAIL_USER` | `.env.local` locally, Vercel Environment Variables in production |
| `GMAIL_APP_PASSWORD` | same |
| `RECEIVER_EMAIL` | same (use `tauhidrana00@gmail.com`) |

These are read only in `app/api/register/route.js` and are never sent to the browser.

## Editable content

Everything editable (dates, deadlines, phone, prizes, submission link, social links, nav)
lives in **`lib/config.js`**. The full rulebook lives in **`lib/rulebook.js`**.

## Commands

```bash
npm run dev     # development
npm run build   # production build
npm start       # serve the production build
```

Deploy by importing the GitHub repo into Vercel and adding the three environment variables.
