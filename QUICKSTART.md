# 🚀 Quick Start - Push to GitHub & Deploy

## 1️⃣ Push to GitHub (5 minutes)

```bash
# Step 1: Create empty repo on GitHub.com/new (DO NOT init with files)

# Step 2: Add remote (replace with your username)
git remote add origin https://github.com/YOUR_USERNAME/meoryou.git

# Step 3: Rename branch to main (optional)
git branch -m master main

# Step 4: Push
git push -u origin main
```

**Done! Your code is on GitHub** ✅

---

## 2️⃣ Deploy Frontend to Vercel (3 minutes)

1. Go to https://vercel.com/new
2. Sign in with GitHub
3. Select `meoryou` repository
4. Set **Root Directory** to `client`
5. Set **Build Command** to `npm run build`
6. Set **Output Directory** to `dist`
7. Add environment variable:
   - Key: `VITE_SERVER_URL`
   - Value: (leave blank for now, update later)
8. Click **Deploy**

**Your frontend is live!** 🎉
Get URL from Vercel dashboard (e.g., `meoryou.vercel.app`)

---

## 3️⃣ Deploy Backend to Render (3 minutes)

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New+" → "Web Service"
4. Select `meoryou` repository
5. Fill in:
   - **Name**: `meoryou-server`
   - **Region**: Choose closest
   - **Environment**: Node
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
6. Add environment variable:
   - Key: `NODE_ENV`
   - Value: `production`
7. Click **Create Web Service**

**Your backend is live!** 🎉
Get URL from Render (e.g., `meoryou-server.onrender.com`)

---

## 4️⃣ Connect Frontend to Backend (1 minute)

1. Go back to Vercel → Your project → Settings → Environment Variables
2. Update `VITE_SERVER_URL`:
   - Value: `https://meoryou-server.onrender.com` (use your actual Render URL)
3. Click **Save**
4. Vercel auto-redeploys

**They're connected!** ✅

---

## ✅ Final Links

| What | URL |
|------|-----|
| 🌐 Live Game | `https://meoryou.vercel.app` |
| ⚙️ Backend API | `https://meoryou-server.onrender.com` |
| 💻 Code | `https://github.com/YOUR_USERNAME/meoryou` |

---

## 📝 Full Documentation

- **README.md** - Project overview
- **DEPLOYMENT.md** - Detailed deployment guide
- **deploy-setup.sh** - Run to check git status

---

## 🆘 Help

- **Frontend build fails**: Check Vercel logs, ensure root directory is `client`
- **Backend won't start**: Check Render logs, ensure build command runs
- **Can't connect**: Check CORS in `server/index.js`, update to specific domain
- **WebSocket fails**: Most providers support it; check browser console

---

**You're all set! 🚀**
