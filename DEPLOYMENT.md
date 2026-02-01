# Deployment Guide - MeORYou

## GitHub Setup & Push

### 1. Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 2. Create Repository on GitHub
1. Go to https://github.com/new
2. Create a new repository named `meoryou`
3. Choose "Public" or "Private"
4. **Do NOT** initialize with README, .gitignore, or license (we have these)

### 3. Add Remote and Push
```bash
cd /Users/supa/Projects/meoryou

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/meoryou.git

# Rename branch to main (optional but recommended)
git branch -m master main

# Push to GitHub
git push -u origin main
```

---

## Vercel Deployment (Frontend)

### ✅ Why Vercel?
- Automatic deployments on git push
- Free tier available
- Built for React/Vite projects
- Preview deployments for PRs

### Step-by-Step

#### 1. Sign Up on Vercel
- Go to https://vercel.com/signup
- Sign up with GitHub (easiest)

#### 2. Import Project
1. Click "Add New" → "Project"
2. Connect your GitHub account
3. Select the `meoryou` repository
4. Click "Import"

#### 3. Configure Build Settings
On the import screen, configure:

**Root Directory**: `client`

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Environment Variables** (add these):
```
VITE_SERVER_URL = https://your-backend-url.com
```

#### 4. Deploy
Click "Deploy" and wait ~2-3 minutes. Your site is live!

**Vercel URL**: Will be something like `meoryou.vercel.app`

---

## Backend Deployment Options

### Option A: Render (Recommended Free Tier)

#### 1. Sign Up
- Go to https://render.com
- Sign up with GitHub

#### 2. Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your GitHub account
3. Select `meoryou` repository

#### 3. Configure
- **Name**: `meoryou-server`
- **Environment**: `Node`
- **Build Command**: `cd server && npm install`
- **Start Command**: `cd server && npm start`
- **Root Directory**: `/` (keep as is)

#### 4. Environment Variables
Add in Render dashboard:
```
NODE_ENV = production
PORT = 3000
```

#### 5. Deploy
Click "Create Web Service". Takes 2-3 minutes.

**Render URL**: Will be something like `meoryou-server.onrender.com`

---

### Option B: Railway (Easy Alternative)

#### 1. Sign Up
- Go to https://railway.app
- Sign up with GitHub

#### 2. Create Project
1. Click "Start a New Project"
2. Select "Deploy from GitHub repo"
3. Connect and select `meoryou`

#### 3. Configure
Railway auto-detects Node.js. Set variables:
```
NODE_ENV = production
```

#### 4. Deploy
Click "Deploy". ~1-2 minutes.

**Railway URL**: Will be auto-generated

---

### Option C: Heroku (Paid, $5/month minimum)

#### 1. Sign Up
- Go to https://heroku.com
- Create account

#### 2. Create App
```bash
heroku login
heroku create meoryou-server
```

#### 3. Deploy
```bash
git push heroku main
```

---

## Connect Frontend to Backend

After deploying backend, update Vercel environment variable:

### 1. In Vercel Dashboard
1. Go to your `meoryou` project
2. Settings → Environment Variables
3. Update `VITE_SERVER_URL` to your backend URL:
   - Render: `https://meoryou-server.onrender.com`
   - Railway: `https://your-railway-url.up.railway.app`
   - Heroku: `https://meoryou-server.herokuapp.com`

### 2. Trigger Redeploy
- Make a small commit and push to main
- Or manually redeploy in Vercel dashboard

```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

---

## Final URLs After Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://meoryou.vercel.app` |
| Backend (Render) | `https://meoryou-server.onrender.com` |
| GitHub | `https://github.com/yourusername/meoryou` |

---

## Troubleshooting

### Frontend Build Fails
- Check `client/vite.config.js`
- Ensure `VITE_SERVER_URL` is set correctly
- View build logs in Vercel dashboard

### Backend Connection Issues
- Verify `VITE_SERVER_URL` matches deployed backend
- Check CORS settings in `server/index.js`
- Update CORS origin from `"*"` to specific domain:
  ```javascript
  cors: {
    origin: "https://meoryou.vercel.app",
    methods: ["GET", "POST"]
  }
  ```

### Socket.io Connection Fails
- Check browser console for errors
- Verify backend URL is correct
- Ensure WebSocket support is enabled (most platforms support it)

---

## Monitoring

### Vercel
- Logs: Settings → Function Logs
- Analytics: available on dashboard

### Render
- Logs: accessible from service dashboard
- Free tier has limitations

### Railway
- Logs: visible in deployment dashboard

---

## Next Steps

1. ✅ Push to GitHub
2. ✅ Deploy frontend to Vercel
3. ✅ Deploy backend to Render/Railway
4. ✅ Connect them together
5. 🧪 Test the live application
6. 📊 Monitor performance and logs

Good luck! 🚀
