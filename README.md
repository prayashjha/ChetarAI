# 🚀 Chetar AI

<p align="center">
  <strong>Soch Se Zyada ✨</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="License" />
  <img src="https://img.shields.io/badge/API-100%25%20Free-green.svg" alt="Free API" />
  <img src="https://img.shields.io/badge/No%20API%20Key-Required-success.svg" alt="No API Key" />
  <img src="https://img.shields.io/badge/Deploy-Cloudflare%20Pages-orange.svg" alt="Deploy" />
</p>

---

## 🌟 Live Demo

**[🔗 chetar-ai.pages.dev](https://chetar-ai.pages.dev)**

---

## 📖 About

**Chetar AI** ek free AI chat aur image generation app hai jo 100% free APIs use karta hai — **koi API key nahi chahiye!** 

Ye app Pollinations AI ke free APIs pe based hai jo unlimited text generation aur image generation provide karte hain bina kisi authentication ke.

---

## ✨ Features

- 🤖 **AI Chat** — Hinglish mein baat karo, coding help lo, kahani likhwao
- 🎨 **AI Image Generation** — Text se images banao (powered by Flux model)
- 🌙 **Dark Mode** — Light/Dark theme toggle
- 💾 **Chat History** — LocalStorage mein save hota hai
- 🎤 **Voice Input** — Speech recognition (Chrome supported)
- 📋 **Code Blocks** — Syntax highlighting + copy button
- 📥 **Export Chat** — Download chat as text file
- 📱 **Responsive** — Mobile + Desktop friendly
- ⚡ **Typewriter Effect** — Smooth AI response animation
- 🚀 **No Build Step** — Static files, direct deploy
- 🔒 **No API Keys** — 100% free, no signup needed

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| HTML5 | Structure |
| Tailwind CSS | Styling (via CDN) |
| Vanilla JavaScript | Logic |
| Pollinations AI | Text & Image Generation API |
| LocalStorage | Data persistence |
| Cloudflare Pages | Hosting |

---

## 🔌 How Pollinations Free API Works

Chetar AI uses **Pollinations AI** — a completely free, open-source AI API that requires **NO API keys, NO signup, NO rate limits**.

### Text API (Chat)
```
POST https://text.pollinations.ai/openai
Body: {
  model: "openai",
  messages: [
    { role: "system", content: "..." },
    { role: "user", content: "..." }
  ]
}
```

### Image API
```
GET https://image.pollinations.ai/prompt/{ENCODED_PROMPT}?width=1024&height=1024&nologo=true&enhance=true&model=flux
```

That's it! No authentication, no keys, just free AI. 🎉

---

## 🚀 Deploy to Cloudflare Pages (Step-by-Step)

### ⚠️ IMPORTANT: App not opening? Common fixes:
- **Build command:** `npm run build`
- **Output directory:** `dist`
- Make sure you're deploying the `dist/` folder, NOT the root folder
- If using direct upload, upload the contents of `dist/` folder

### Method 1: Direct Upload (Easiest - No Build Needed!)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Create application** → **Pages**
3. Select **Upload assets** (direct upload)
4. Name your project: `chetar-ai`
5. **Upload the `dist/` folder contents** (index.html, favicon.svg, _headers, _redirects)
6. Click **Deploy Site**
7. Done! 🎉 Your app is live!

### Method 2: GitHub Integration (Auto-deploy on push)

1. Push this repo to GitHub
2. Go to Cloudflare Dashboard → **Workers & Pages** → **Create application**
3. Select **Pages** → **Connect to Git**
4. Connect your GitHub account
5. Select this repository
6. **Configure build settings EXACTLY:**
   - **Framework preset:** None
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `/` (leave as default)
7. Click **Save and Deploy**
8. Wait for build to complete (~30 seconds)

### Method 3: Cloudflare CLI (Wrangler)

```bash
npm install -g wrangler
wrangler login
wrangler pages deploy dist --project-name=chetar-ai
```

---

## 🌐 Add Custom Domain

1. Go to your Cloudflare Pages project dashboard
2. Click **Custom domains** tab
3. Click **Set up a custom domain**
4. Enter your domain (e.g., `chetar.yourdomain.com`)
5. If your domain is on Cloudflare already:
   - It will auto-configure DNS
   - Just click **Activate domain**
6. If domain is on another provider (GoDaddy, Namecheap, etc.):
   - Add a **CNAME** record:
     ```
     Type: CNAME
     Name: chetar (or @)
     Target: chetar-ai.pages.dev
     ```
   - Or add an **A** record with Cloudflare's IPs
7. Wait for DNS propagation (5 mins to 24 hours)
8. SSL certificate is auto-provisioned by Cloudflare! 🔒

### If app shows blank page after custom domain:
- Check browser console (F12) for errors
- Make sure Cloudflare Pages build completed successfully
- Try hard refresh (Ctrl+Shift+R)
- Check that `dist/` folder has `index.html`

---

## 🔑 No API Key Needed!

Ye app **100% free** hai kyunki:

- ✅ Pollinations AI is open-source and free
- ✅ No API keys required for any endpoint
- ✅ No user authentication needed
- ✅ No backend server required
- ✅ All data stays in browser (localStorage)
- ✅ No costs, ever

---

## 📁 Project Structure

```
chetar-ai/
├── index.html          # Main HTML file
├── README.md           # This file
├── LICENSE             # MIT License
├── _headers            # Cloudflare security headers
├── _redirects          # SPA routing for Cloudflare
├── public/
│   └── favicon.svg     # App icon
└── src/
    ├── App.tsx         # Main React component
    ├── main.tsx        # Entry point
    └── index.css       # Styles
```

---

## 🎨 Branding

- **Name:** Chetar AI
- **Tagline:** Soch Se Zyada
- **Creator:** Prayash
- **Logo:** Letter "C" with gradient (Blue → Purple)
- **Theme:** Clean, minimal, Gemini-inspired but 100% original
- **Copyright:** MIT License — use freely!

---

## 🤝 Contributing

Feel free to fork, modify, and deploy your own version! 

```bash
# Clone
git clone https://github.com/yourusername/chetar-ai.git
cd chetar-ai

# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 🙏 Credits

- **AI Engine:** [Pollinations AI](https://pollinations.ai) — Free & Open Source
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Icons:** [Lucide Icons](https://lucide.dev)
- **Hosting:** [Cloudflare Pages](https://pages.cloudflare.com)

---

<p align="center">
  Made with ❤️ by <strong>Prayash</strong>
</p>

<p align="center">
  <em>Soch Se Zyada ✨</em>
</p>
