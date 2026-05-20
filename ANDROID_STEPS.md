# FUTURETECHGAD Android build notes

This project is built as a mobile-first Next.js website with an Android-installable PWA manifest.
That means Android users can install it from Chrome after the website is hosted with HTTPS.

## PowerShell steps for the website

```powershell
cd "C:\Users\Admin\Documents\New project"
npm install
Copy-Item .env.example .env.local
notepad .env.local
npm run build
npm run dev
```

Open `http://localhost:3000`.

## Supabase setup

1. Create a Supabase project.
2. Paste the values into `.env.local`.
3. Open Supabase SQL Editor.
4. Run `supabase/schema.sql`.
5. Sign up from the website and confirm the email.

New users receive 1000 coins through the `profiles.coin_balance` default.

## Android install

1. Deploy the website to Vercel or another HTTPS host.
2. Open the website on Android Chrome.
3. Tap the browser menu.
4. Tap `Add to Home screen` or `Install app`.

For a Play Store APK/AAB, wrap the hosted website as a Trusted Web Activity using Bubblewrap after deployment:

```powershell
npm install -g @bubblewrap/cli
bubblewrap init --manifest https://YOUR-DOMAIN.com/manifest.webmanifest
bubblewrap build
```
