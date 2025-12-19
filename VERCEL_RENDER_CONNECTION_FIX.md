# Fix: Connect Vercel Frontend to Render Backend

## Problem
Frontend (Vercel) cannot connect to Backend (Render) because `VITE_API_URL` is not set.

## Solution: Add Environment Variable in Vercel

### Step 1: Get Your Render Backend URL
Your Render backend URL should look like:
```
https://your-app-name.onrender.com
```

Example:
```
https://chemistry-coaching-api.onrender.com
```

### Step 2: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Select your project

2. **Go to Settings**
   - Click "Settings" tab
   - Click "Environment Variables" in sidebar

3. **Add New Variable**
   - Name: `VITE_API_URL`
   - Value: `https://your-app-name.onrender.com`
   - Environment: Select all (Production, Preview, Development)
   - Click "Save"

4. **Redeploy**
   - Go to "Deployments" tab
   - Click "..." on latest deployment
   - Click "Redeploy"
   - Wait for deployment to finish

### Step 3: Verify

After redeployment:
1. Open your Vercel site
2. Go to Admin Panel
3. Try adding a crossword
4. Should work now! ✅

## Alternative: Create .env File (For Local Development)

Create `.env` file in project root:
```env
VITE_API_URL=https://your-app-name.onrender.com
```

**Important**: 
- File name: `.env` (with dot at start)
- Location: Root folder (same level as package.json)
- Don't commit to Git (already in .gitignore)

## How to Find Your Render URL

1. Go to Render Dashboard: https://dashboard.render.com
2. Click on your backend service
3. Copy the URL at top (looks like: `https://xyz.onrender.com`)

## Common Issues

### Issue 1: Still showing localhost
**Solution**: Clear browser cache and hard reload (Ctrl+Shift+R)

### Issue 2: CORS Error
**Solution**: Add your Vercel URL to CORS in `server/server.js`:
```javascript
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://your-vercel-app.vercel.app',  // Add this
  'https://chemistry-coaching.vercel.app'
];
```

### Issue 3: 404 Not Found
**Solution**: Check Render backend is running:
- Visit: `https://your-app.onrender.com/api/crosswords`
- Should see: `[]` or list of crosswords

## Environment Variables Needed

### Vercel (Frontend)
```
VITE_API_URL=https://your-backend.onrender.com
```

### Render (Backend)
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

## Testing

### 1. Test Backend (Render)
Open in browser:
```
https://your-backend.onrender.com/api/crosswords
```
Should see JSON response (empty array or data)

### 2. Test Frontend (Vercel)
1. Open your Vercel site
2. Open browser console (F12)
3. Go to Admin → Manage Crosswords
4. Try adding crossword
5. Check console for:
   ```
   Submitting to: https://your-backend.onrender.com/api/crosswords
   Response status: 201
   ```

## Quick Fix Checklist

- [ ] Get Render backend URL
- [ ] Add `VITE_API_URL` in Vercel
- [ ] Redeploy Vercel
- [ ] Clear browser cache
- [ ] Test adding crossword
- [ ] Check browser console for errors

## Success Indicators

✅ Browser console shows Render URL (not localhost)
✅ Network tab shows request to Render
✅ Response status: 201
✅ Alert: "Crossword added successfully!"
✅ Crossword appears in list

## Still Not Working?

### Check Browser Console (F12)
Look for:
```
Submitting to: https://your-backend.onrender.com/api/crosswords
```

If you see `http://localhost:5000`:
- Environment variable not set correctly
- Need to redeploy Vercel
- Clear browser cache

### Check Network Tab (F12 → Network)
- Filter: XHR
- Look for POST request to /api/crosswords
- Check request URL
- Check response

## Example Configuration

### Vercel Environment Variables
```
Name: VITE_API_URL
Value: https://chemistry-api.onrender.com
Environments: Production, Preview, Development
```

### After Setting
Frontend will use:
```javascript
const API_URL = import.meta.env.VITE_API_URL; 
// = "https://chemistry-api.onrender.com"
```

Instead of:
```javascript
const API_URL = 'http://localhost:5000'; // ❌ Wrong
```

## Important Notes

1. **VITE_ prefix is required** for Vite environment variables
2. **No trailing slash** in URL: `https://api.com` not `https://api.com/`
3. **Must redeploy** after adding env variables
4. **Clear cache** after redeployment

## Need Your Render URL?

Share your Render backend URL and I can help configure it!

Format should be:
```
https://your-service-name.onrender.com
```
