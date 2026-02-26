# LifeHelpQuote — Life Insurance Lead Capture

## Deploy to Vercel

### Option A: CLI (fastest)
```bash
cd lifehelpquote
npm install
npx vercel --prod
```

### Option B: GitHub
1. Push this folder to a GitHub repo
2. Go to vercel.com/new → Import the repo
3. Framework: Next.js (auto-detected)
4. Deploy

### Point Cloudflare DNS
After deploy, Vercel gives you a URL like `lifehelpquote-xxxx.vercel.app`.

In Cloudflare:
1. Go to DNS settings for lifehelpquote.com
2. Add CNAME record:
   - Name: `@`
   - Target: `cname.vercel-dns.com`
   - Proxy: OFF (DNS only — gray cloud)
3. Add CNAME record:
   - Name: `www`
   - Target: `cname.vercel-dns.com`
   - Proxy: OFF (DNS only — gray cloud)

In Vercel:
1. Go to project Settings → Domains
2. Add `lifehelpquote.com`
3. Add `www.lifehelpquote.com`
4. Vercel will auto-provision SSL

### Leads
Leads log to Vercel server logs (Functions tab).
Uncomment the webhook or Supabase section in `app/api/leads/route.js` for real-time delivery.
