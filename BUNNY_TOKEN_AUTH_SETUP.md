# Bunny.net Token Authentication Setup Guide 🔐

This guide explains how to implement **token-based authentication** for Bunny.net video playback using signed URLs.

## ✅ What's Been Implemented

The system now supports **secure video playback** with token authentication:
- Backend generates **signed URLs** with expiration time
- Frontend fetches signed URLs automatically
- Videos require valid tokens to play
- Tokens expire after 1 hour (configurable)

---

## 🔧 Step-by-Step Configuration

### Step 1: Get Security Key from Bunny.net Dashboard

1. **Login** to Bunny.net: https://dash.bunny.net
2. Navigate to: **Stream** → **Video Library** → **585188**
3. Go to: **Settings** → **Security** tab
4. Scroll to: **"Security Key"** section
5. **Copy** the security key (long alphanumeric string)
   - Example format: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Step 2: Configure Environment Variable

1. Open `/www/wwwroot/reaction-lab/.env` file
2. Find: `BUNNY_SECURITY_KEY=your-security-key-here`
3. **Replace** with your actual security key:
   ```env
   BUNNY_SECURITY_KEY=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
   ```
4. Save the file

### Step 3: Restart Backend Server

Token generation happens on the backend, so restart required:

```bash
# If server is running, stop it (Ctrl + C)
# Then restart:
npm run dev
# or for production:
node server/server.js
```

### Step 4: Enable Token Authentication in Bunny.net

**IMPORTANT:** Make sure token authentication is **ENABLED** in Bunny dashboard:

1. Go to: **Stream** → **Library (585188)** → **Settings** → **Security**
2. Find: **"Embed view token authentication"** toggle
3. Make sure it's **ENABLED** (green/on)
4. **Save** changes

---

## 🎥 How It Works

### URL Generation Flow:

1. **Student** opens topic and selects video
2. **Frontend** requests signed URL from backend:
   ```javascript
   POST /api/self-learn/generate-signed-url
   Body: { videoId: "abc123" }
   ```
3. **Backend** generates signed URL:
   - Creates signature using: `SHA256(libraryId + securityKey + expirationTime + videoId)`
   - Returns URL with token and expiration
4. **Frontend** displays video with signed URL
5. **Bunny.net** validates token before serving video

### Signed URL Format:
```
https://iframe.mediadelivery.net/embed/585188/{videoId}?token={signature}&expires={timestamp}&autoplay=false&preload=true&responsive=true
```

---

## 🔍 Testing

### Test the Setup:

1. **Check Security Key Configuration**:
   ```bash
   cd /www/wwwroot/reaction-lab
   cat .env | grep BUNNY_SECURITY_KEY
   ```
   Should show your actual key (not "your-security-key-here")

2. **Test Backend Endpoint**:
   ```bash
   curl -X POST http://localhost:5001/api/self-learn/generate-signed-url \
     -H "Content-Type: application/json" \
     -d '{"videoId":"your-video-id"}'
   ```
   Should return: `{"signedUrl":"https://iframe...","expiresAt":1234567890}`

3. **Test in Browser**:
   - Go to: Self Learn section
   - Select a topic with Bunny.net video
   - Video should load with "Loading secure video..." message
   - Then play automatically with signed URL

---

## 🚨 Troubleshooting

### Issue: "403 Forbidden" Error Still Appears

**Cause:** Security key missing or incorrect

**Solution:**
1. Verify security key in `.env` matches Bunny dashboard
2. Restart backend server
3. Check browser console for errors
4. Test backend endpoint directly (see Testing section)

### Issue: "Security key not configured" Error

**Cause:** Environment variable not set or still has placeholder

**Solution:**
1. Open `.env` file
2. Replace `your-security-key-here` with actual key
3. Restart backend: `npm run dev`

### Issue: Video Loads But Won't Play

**Cause:** Token expired or invalid

**Solution:**
1. Check token expiration time (1 hour default)
2. Refresh page to get new token
3. Verify security key matches Bunny dashboard

### Issue: Backend Endpoint Returns 500 Error

**Cause:** Security key not configured

**Solution:**
```bash
# Check .env file
cat .env | grep BUNNY_SECURITY_KEY

# Should show actual key, not placeholder
# If showing placeholder, update it
```

---

## 🛠️ Configuration Options

### Change Token Expiration Time

Edit `/www/wwwroot/reaction-lab/server/routes/selfLearnRoutes.js`:

```javascript
// Current: 1 hour (3600 seconds)
const expirationTime = Math.floor(Date.now() / 1000) + 3600;

// Change to 2 hours:
const expirationTime = Math.floor(Date.now() / 1000) + 7200;

// Change to 30 minutes:
const expirationTime = Math.floor(Date.now() / 1000) + 1800;
```

### Disable Token Authentication (Fallback)

If you want to quickly disable token auth:

1. Go to Bunny.net Dashboard
2. **Toggle OFF**: "Embed view token authentication"
3. Videos will play without tokens
4. Domain restrictions will apply instead

---

## 📁 Files Modified

1. **Backend:**
   - `/server/routes/selfLearnRoutes.js` - Added signed URL endpoint
   - `/.env` - Added security key configuration

2. **Frontend:**
   - `/src/pages/SelfLearn/TopicDetail.jsx` - Added signed URL fetching

---

## 🚀 Production Deployment

### Environment Variables Required:

When deploying to production (Vercel, Netlify, etc.), set:

1. `BUNNY_SECURITY_KEY` - Your security key from Bunny dashboard
2. `VITE_BUNNY_LIBRARY_ID` - Library ID (585188)
3. `VITE_API_URL` - Your backend API URL

**Example (Vercel):**
```
Dashboard → Project → Settings → Environment Variables:
- BUNNY_SECURITY_KEY = a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
- VITE_BUNNY_LIBRARY_ID = 585188
- VITE_API_URL = https://yourdomain.com:5001/api
```

---

## ✅ Verification Checklist

- [ ] Security key copied from Bunny.net Dashboard → Settings → Security
- [ ] `BUNNY_SECURITY_KEY` set in `.env` file (not placeholder)
- [ ] Backend server restarted after `.env` change
- [ ] "Embed view token authentication" ENABLED in Bunny dashboard
- [ ] Backend endpoint tested and returns signed URL
- [ ] Frontend loads videos without 403 error
- [ ] Tokens expire after configured time (1 hour default)

---

## 📚 Additional Resources

- **Bunny.net Security Docs**: https://docs.bunny.net/docs/stream-security
- **Token Authentication Guide**: https://docs.bunny.net/docs/stream-token-authentication
- **Library ID Setup**: See `BUNNY_LIBRARY_ID_SETUP.md`

---

**Need Help?** Check browser console and backend logs for detailed error messages.
