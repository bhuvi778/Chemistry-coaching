# Backend Connection Issue - Render Deployment

## Problem
The frontend is trying to connect to `http://localhost:5000/api` instead of your Render backend URL.

## Solution

### Option 1: Set Environment Variable (Recommended)

Create or update `.env.local` file in the root directory:

```env
VITE_API_URL=https://your-backend-name.onrender.com/api
```

**Replace `your-backend-name.onrender.com` with your actual Render backend URL**

### Option 2: Update DataContext Directly

In `src/context/DataContext.jsx`, line 34, change:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

To:

```javascript
const API_URL = import.meta.env.VITE_API_URL || 'https://your-backend-name.onrender.com/api';
```

## How to Find Your Render Backend URL

1. Go to https://dashboard.render.com
2. Click on your backend service
3. Copy the URL (should be like: `https://something.onrender.com`)
4. Add `/api` at the end

## After Setting the URL

1. Restart your development server:
   ```
   Ctrl+C (to stop)
   npm run dev (to restart)
   ```

2. Clear browser cache or hard refresh (Ctrl+Shift+R)

3. Try creating audio books/study materials/magazines again

## Testing the Connection

Open browser console and check:
- Network tab should show requests to your Render URL
- Console should log "Sending audio book data:" when you submit
- If successful, you'll see "Audio book added successfully:"

## Common Issues

### CORS Error
If you see CORS error, make sure your Render backend has CORS enabled for your frontend domain.

### 404 Error
Check that the Render backend is deployed and running.

### Timeout
Render free tier may sleep after inactivity. First request might take 30-60 seconds to wake up the server.

## What I Fixed

Updated these functions in DataContext.jsx:
- `addAudioBook()` - Better error handling
- `addStudyMaterial()` - Better error handling  
- `addMagazine()` - Better error handling

All now:
- Log data being sent
- Check response status
- Throw errors properly
- Return created items
- Update UI immediately
