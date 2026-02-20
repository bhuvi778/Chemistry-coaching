# Bunny.net Library ID Setup Guide

## Quick Setup

### Step 1: Login to Bunny.net
1. Go to [https://dash.bunny.net](https://dash.bunny.net)
2. Login with your credentials

### Step 2: Get Library ID
1. Click on **Stream** from the left sidebar
2. Click on **Video Library**
3. Select your video library (or create one if you don't have)
4. The **Library ID** will be visible in:
   - **URL**: `https://dash.bunny.net/stream/{LIBRARY_ID}/videos`
   - **Library Settings**: Listed as "Video Library ID"

### Step 3: Update .env File
1. Open `.env` file in the root directory
2. Find this line:
   ```bash
   VITE_BUNNY_LIBRARY_ID=
   ```
3. Add your Library ID:
   ```bash
   VITE_BUNNY_LIBRARY_ID=123456
   ```
   Replace `123456` with your actual Library ID

### Step 4: Restart Development Server
```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

## Example

If your Bunny.net video library URL is:
```
https://dash.bunny.net/stream/284537/videos
```

Then your Library ID is: **284537**

Your `.env` file should have:
```bash
VITE_BUNNY_LIBRARY_ID=284537
```

## Verification

### Test Video ID
After setting Library ID, you can test with any video from your library:

1. Go to **Admin Panel → Manage Self Learn**
2. Select any topic → **Manage Content** → **Videos**
3. Add a new video:
   - Select **🐰 Bunny.net**
   - **Leave URL field empty**
   - Paste only **Video ID** (e.g., `abc123de-f456-7890-gh12-ijklmn345678`)
   - Fill title and details
   - Click **Add Video**

4. Check the video list:
   - ✅ **Green "Ready" badge** = Configuration is correct
   - ❌ **Red "Invalid URL" badge** = Library ID is missing or incorrect

### Testing on Frontend
1. Go to the Self Learn section
2. Select a chapter and topic
3. Click on the video
4. Video should play without errors

## How It Works

When you provide only Video ID, the system constructs the full embed URL:

```
https://iframe.mediadelivery.net/embed/{LIBRARY_ID}/{VIDEO_ID}
```

**Example**:
- Library ID: `284537`
- Video ID: `abc123de-f456-7890-gh12-ijklmn345678`
- Result: `https://iframe.mediadelivery.net/embed/284537/abc123de-f456-7890-gh12-ijklmn345678`

## Troubleshooting

### Problem: Videos show "Invalid URL" badge

**Solution 1**: Check Library ID
```bash
# Open .env file
# Make sure VITE_BUNNY_LIBRARY_ID has a value
VITE_BUNNY_LIBRARY_ID=284537  # Should have a number, not empty
```

**Solution 2**: Restart Server
```bash
# Environment variables are loaded on server start
# Stop and restart the development server
npm run dev
```

**Solution 3**: Clear Browser Cache
```bash
# Hard refresh in browser
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R
```

### Problem: Videos not playing on frontend

**Check 1**: Video exists in Bunny.net
- Login to Bunny.net
- Go to Stream → Video Library
- Verify the video with that ID exists

**Check 2**: Video is published
- In Bunny.net, make sure video is:
  - ✅ Finished processing
  - ✅ Published (not draft)
  - ✅ Not deleted

**Check 3**: Domain whitelist
- Go to Library Settings → Security
- Check if your domain is whitelisted
- Add `ace2examz.com` if not present

### Problem: Library ID not found

**Where to find it**:
1. **From URL**: 
   - Navigate to any page in your video library
   - Check the URL: `/stream/{THIS_IS_YOUR_ID}/...`

2. **From Library Settings**:
   - Click on library name
   - Click **Settings**
   - Look for "Video Library ID" or "Library ID"

3. **From API Key page**:
   - Go to Account → API Keys
   - Library ID is shown for each library

## Production Deployment

### Important Notes:
1. **.env file is NOT deployed** to production
2. Environment variables must be set on your hosting platform

### For Vercel:
1. Go to project settings
2. Navigate to **Environment Variables**
3. Add:
   - **Key**: `VITE_BUNNY_LIBRARY_ID`
   - **Value**: Your Library ID
   - **Environment**: Production, Preview, Development

### For Other Platforms:
- **Netlify**: Site Settings → Build & Deploy → Environment
- **Railway**: Project → Variables
- **Heroku**: Settings → Config Vars
- **Render**: Environment → Environment Variables

## Security Notes

✅ **Safe to expose**: Library ID is safe to be public (it's in frontend code)  
❌ **Keep secret**: Never expose Bunny.net API Key  
❌ **Keep secret**: Never expose Bunny.net Access Key

## Multiple Libraries

If you have multiple Bunny.net video libraries for different purposes:

```bash
# For Self Learn videos
VITE_BUNNY_LIBRARY_ID=284537

# For other sections (if needed, modify code to support)
# VITE_BUNNY_LECTURES_LIBRARY_ID=284538
# VITE_BUNNY_COURSES_LIBRARY_ID=284539
```

Currently, the system uses one Library ID for all videos. If you need different IDs for different sections, code modifications are required.

## Related Files

- `.env` - Main environment configuration (not in git)
- `.env.example` - Template with all variables
- `src/components/TopicContentManager.jsx` - Admin video management
- `src/pages/SelfLearn/TopicDetail.jsx` - Student video player

## Support

For Bunny.net specific issues:
- Documentation: [https://docs.bunny.net](https://docs.bunny.net)
- Support: [https://support.bunny.net](https://support.bunny.net)

For implementation issues:
- Check [BUNNY_VIDEO_FIX.md](BUNNY_VIDEO_FIX.md) for technical details
- Check [TOPIC_CONTENT_ENHANCEMENTS.md](TOPIC_CONTENT_ENHANCEMENTS.md) for feature overview
