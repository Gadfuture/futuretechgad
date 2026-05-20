# FUTURETECHGAD

Android-first mining and coin trading web app built with Next.js and Supabase.

## Features

- email login and signup
- 1000 free mined coins for every new account
- miner shop with 50 coin starter miner earning 10 coins per day
- maximum 1000 coin miner earning 250 coins per day
- live pending mining balance and claim action
- internal coin trading panel for BTC, USDT, LTC, BNB, ETH, and TRX
- withdrawal request form for TRX, BNB, and USDT wallet addresses
- minimum withdrawal of 3000 coins for a $1 request
- dark 3D-style floating crypto coin background
- Android-installable PWA manifest

## PowerShell quick start

```powershell
cd "C:\Users\Admin\Documents\New project"
npm install
Copy-Item .env.example .env.local
notepad .env.local
npm run build
npm run dev
```

Then open:

```powershell
http://localhost:3000
```

## Environment values

Fill these in `.env.local`:

```powershell
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Database

Run this file in the Supabase SQL Editor:

```powershell
supabase/schema.sql
```

The service role key is required because miner, trade, and withdrawal actions update balances from the server.

## Android

See `ANDROID_STEPS.md` for Android install and APK/AAB wrapping notes.

## Netlify deployment

Netlify supports modern Next.js apps through its OpenNext adapter. This repo includes
`netlify.toml` with the production build command.

PowerShell deploy steps:

```powershell
cd "C:\Users\Admin\Documents\New project"
npm run build
npm install -g netlify-cli
netlify login
netlify init
netlify env:set NEXT_PUBLIC_SITE_URL https://YOUR-SITE.netlify.app
netlify env:set NEXT_PUBLIC_SUPABASE_URL your_supabase_url
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY your_supabase_anon_key
netlify env:set SUPABASE_SERVICE_ROLE_KEY your_service_role_key
netlify deploy --build --prod
```
