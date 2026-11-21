# 🚀 Deployment Instructions for Rise of the Hero

This guide will help you deploy your incremental RPG to GitHub Pages and other hosting platforms.

## ⚡ Quick Deploy (10 Minutes)

### Method 1: Vercel (Fastest & Most Reliable)

**Step 1:** Install Vercel CLI
```bash
npm install -g vercel
```

**Step 2:** Deploy from your local directory
```bash
vercel --prod
```

**Step 3:** Open https://inc-web-game.vercel.app to see your game live!

### Method 2: Netlify (Free & Flexible)

**Step 1:** Install Netlify CLI (or use the browser interface)
```bash
npm install -g netlify-cli
```

**Step 2:** Create a deployment token at https://app.netlify.com/auth/token

**Step 3:** Deploy from local:
```bash
netlify deploy --prod
```

**OR** Simply upload to Netlify UI (https://app.netlify.com) → Add site → Select "GitHub" → Choose your repo.

### Method 3: GitHub Pages (Free)

**Step 1:** Go to your repository on GitHub

**Step 2:** Navigate to Settings → Pages

**Step 3:** Configure the source tab:
- Branch: `main` (or `master` if not set in steps above)
- Folder: `/`

**Step 4:** Save settings

Wait ~2 minutes, then visit: `https://<your-username>.github.io/inc-web-game/`

---

## 📦 Advanced Deployment Options

### Docker Deployment (For Production Servers)

Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY . .

RUN chmod +x index.html

EXPOSE 8080
CMD ["node", "index.html"]
```

Deploy to any Docker-compatible host (AWS, Google Cloud, DigitalOcean).

### Heroku Deployment

```bash
heroku create inc-web-game
git push heroku main
```

---

## 🎯 Post-Deployment Checklist

1. ✅ Test the game on different browsers
2. ✅ Check mobile responsiveness
3. ✅ Verify auto-save functionality
4. ✅ Add your own customizations in `js/main.js`
5. ✅ Deploy to production!

## 🆘 Troubleshooting

**Issue: Game not loading after deploy**
- Solution: Ensure you've committed files with git and pushed to GitHub. Vercel/Netlify/GitHub Pages will detect unpushed changes on their next build.

**Issue: Wrong content showing**
- Solution: Check your file structure. The index.html MUST be the entry point at root level.

---

## 🎮 Get Playing!

Once deployed, share your game URL with friends and see who can reach the highest level!
