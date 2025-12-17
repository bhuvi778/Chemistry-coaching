# Render Backend Deployment Fix

## Problem
Render is trying to build the frontend (Vite) but run the backend (Node.js), causing the error:
```
Error: Cannot find module '/opt/render/project/src/server.js'
```

## Solution: Deploy Backend Separately

### Option 1: Update Existing Render Service (Quick Fix)

1. Go to https://dashboard.render.com
2. Click on your backend service
3. Go to **Settings**
4. Update these fields:

**Root Directory:**
```
server
```

**Build Command:**
```
npm install
```

**Start Command:**
```
node server.js
```

5. Click **Save Changes**
6. Go to **Manual Deploy** → **Clear build cache & deploy**

### Option 2: Create New Backend Service (Recommended)

1. Go to Render Dashboard
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:

```
Name: reaction-lab-backend
Environment: Node
Region: Singapore
Branch: main

Root Directory: server
Build Command: npm install
Start Command: node server.js

Plan: Free
```

5. Add Environment Variables:
   - `NODE_ENV` = `production`
   - `MONGODB_URI` = `your-mongodb-connection-string`

6. Click **Create Web Service**

### Option 3: Use render.yaml (Automatic)

If you want to use `render.yaml` for automatic deployments:

1. Make sure `render.yaml` is in the root directory ✅ (already done)
2. The file should look like this:

```yaml
services:
  - type: web
    name: reaction-lab-backend
    env: node
    region: singapore
    plan: free
    rootDir: server
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
```

3. Push to GitHub:
```bash
git add render.yaml
git commit -m "fix: update render config for backend"
git push origin main
```

4. Render will detect the `render.yaml` and deploy correctly

## Why This Happens

**Your Project Structure:**
```
reaction-lab/
├── src/              ← Frontend code
├── server/           ← Backend code
│   └── server.js     ← Backend entry point
├── package.json      ← Frontend dependencies
├── vite.config.js    ← Frontend build config
└── render.yaml       ← Render config
```

**What Render Was Doing (Wrong):**
1. Building from root directory
2. Running `npm run build` (frontend Vite build)
3. Creating `dist/` folder
4. Trying to run `node server.js` from root
5. Can't find `server.js` → Error ❌

**What Render Should Do (Correct):**
1. Change to `server/` directory
2. Run `npm install` (backend dependencies)
3. Run `node server.js` (backend server)
4. Server starts successfully ✅

## Verify the Fix

After deploying, check:

1. **Render Logs:**
   ```
   ✓ Connected to MongoDB
   ✓ Server running on port 5000
   ```

2. **Test API:**
   Open: `https://your-backend.onrender.com/api/courses`
   Should see JSON data

3. **Test Frontend Connection:**
   - Go to your frontend
   - Try creating audio book
   - Should work now! ✅

## Common Issues

### Issue: "Cannot find module"
**Solution:** Make sure `rootDir: server` is set

### Issue: "npm ERR! missing script: build"
**Solution:** Remove build command or set it to `npm install`

### Issue: "CORS error"
**Solution:** Add your frontend URL to CORS in `server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'https://your-frontend.vercel.app'  // Add this
];
```

## After Successful Deployment

1. Copy your Render backend URL
2. Update `.env.local` in frontend:
   ```env
   VITE_API_URL=https://your-backend.onrender.com/api
   ```
3. Restart frontend dev server
4. Test creating audio books, study materials, magazines
5. Should all work now! ✅

## Quick Checklist

- [ ] Render service configured with `rootDir: server`
- [ ] Build command: `npm install`
- [ ] Start command: `node server.js`
- [ ] Environment variables set (MONGODB_URI)
- [ ] Deployment successful (check logs)
- [ ] API endpoint accessible
- [ ] Frontend `.env.local` updated with Render URL
- [ ] Test audio books - working ✅
- [ ] Test study materials - working ✅
- [ ] Test magazines - working ✅

---

**Follow Option 1 (Update Settings) for the quickest fix!** 🚀
