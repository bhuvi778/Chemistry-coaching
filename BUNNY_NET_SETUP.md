# Bunny.net Video Setup Guide

## Issue Fixed
Videos uploaded using only the Bunny.net Video ID were not playing because the system needs a Library ID to construct the proper embed URL.

## Configuration Steps

### 1. Get Your Bunny.net Library ID

1. Log in to your Bunny.net dashboard at https://dash.bunny.net/
2. Go to **Stream** → **Video Libraries**
3. Select your video library
4. Copy the **Library ID** (you'll find it in the URL or in the library settings)

### 2. Add Library ID to Environment Variables

Edit your `.env` file and add:

```bash
VITE_BUNNY_LIBRARY_ID=your_actual_library_id_here
```

Replace `your_actual_library_id_here` with your actual Library ID from Bunny.net.

### 3. Rebuild the Application

After adding the Library ID to `.env`:

```bash
npm run build
```

## How It Works Now

### Option 1: Full Embed URL (Always Works)
In the admin panel, paste the complete Bunny.net embed URL:
```
https://iframe.mediadelivery.net/embed/123456/abc-def-ghi
```

### Option 2: Video ID Only (Requires Library ID Configuration)
Just enter the Video ID:
```
abc-def-ghi
```

The system will automatically construct: `https://iframe.mediadelivery.net/embed/{LIBRARY_ID}/{VIDEO_ID}`

## Troubleshooting

### Videos Still Not Playing?

1. **Check Library ID**: Make sure `VITE_BUNNY_LIBRARY_ID` is set in `.env`
2. **Rebuild**: Run `npm run build` after changing `.env`
3. **Clear Cache**: Hard refresh browser (Ctrl+Shift+R)
4. **Check Video ID**: Verify the Video ID is correct in Bunny.net dashboard
5. **Privacy Settings**: Ensure your Bunny.net videos are set to "Public" or have proper access settings

### Error: "Video not available"

This means either:
- No URL or Video ID was provided
- Library ID is not configured and only Video ID was provided
- The video doesn't exist in your Bunny.net library
- Privacy settings are blocking the embed

## Testing

After configuration:
1. Go to Admin Panel → Self Learn → Manage Topics
2. Add a video using just the Video ID
3. View the topic on the frontend
4. Video should now play correctly

## Support

For Bunny.net specific issues, check their documentation:
- https://docs.bunny.net/docs/stream
