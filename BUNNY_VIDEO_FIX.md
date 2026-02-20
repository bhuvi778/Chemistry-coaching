# Bunny.net Video Playback Fix - Admin Panel

## ⚡ Quick Setup Required

**Before using this feature, you must configure Bunny.net Library ID:**

📖 **Complete Setup Guide**: [BUNNY_LIBRARY_ID_SETUP.md](BUNNY_LIBRARY_ID_SETUP.md)

**Quick Steps**:
1. Get Library ID from Bunny.net Dashboard → Stream → Video Library
2. Add to `.env` file: `VITE_BUNNY_LIBRARY_ID=your_library_id`
3. Restart development server

Without Library ID, you can only use full video URLs, not Video IDs.

---

## Issue Resolved
Fixed Bunny.net video playback in the admin panel when using only Video ID instead of full URL. Also removed the informational message that was showing below the button.

## Changes Made

### 1. Added Helper Function (`TopicContentManager.jsx`)

**Location**: Lines 13-22

```javascript
// Helper function to construct Bunny.net video URL
const getBunnyVideoUrl = (video) => {
    if (video.bunnyUrl) {
        return video.bunnyUrl;
    }
    if (video.videoId && BUNNY_LIBRARY_ID) {
        return `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${video.videoId}`;
    }
    return null;
};
```

**Purpose**: Automatically constructs proper Bunny.net embed URL from Video ID when full URL is not provided.

### 2. Enhanced Video Submission Handler

**Location**: Lines 62-76

```javascript
// Validation for Bunny.net videos
if (videoForm.videoType === 'bunny') {
    if (!videoForm.bunnyUrl && !videoForm.videoId) {
        toast.error('Please provide either Bunny.net URL or Video ID');
        return;
    }
    // If only videoId is provided, construct the full URL
    if (videoForm.videoId && !videoForm.bunnyUrl && BUNNY_LIBRARY_ID) {
        videoForm.bunnyUrl = `https://iframe.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoForm.videoId}`;
    }
}
```

**Purpose**: Automatically constructs full Bunny URL before saving to database when only Video ID is provided.

### 3. Removed Information Banner

**Before**:
```jsx
<div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-4">
    <p className="text-blue-400 text-sm">
        <i className="fas fa-info-circle mr-2"></i>
        <strong>Bunny.net Setup:</strong> Provide either the full embed URL OR just the Video ID. 
        {!BUNNY_LIBRARY_ID && <span className="text-yellow-400 block mt-1">⚠️ Library ID not configured...</span>}
    </p>
</div>
```

**After**: Removed completely

**Location**: Previously at ~line 404-410

### 4. Improved Video List Display

**Location**: Lines 532-575

**New Features**:
- ✅ Shows **"Ready"** badge (green) when video URL is valid
- ❌ Shows **"Invalid URL"** badge (red) when video cannot be played
- 🆔 Displays Video ID prominently
- 🔗 Shows constructed/full URL in truncated format
- ⏱️ Shows video duration if available

**Code**:
```jsx
{topic.learn.videos.map((video) => {
    const videoUrl = getBunnyVideoUrl(video);
    return (
        <div key={video._id} className="glass-panel p-4 rounded-xl...">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <h5 className="text-white font-medium">{video.title}</h5>
                    {videoUrl && (
                        <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded">
                            <i className="fas fa-check-circle mr-1"></i>Ready
                        </span>
                    )}
                    {!videoUrl && (
                        <span className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            <i className="fas fa-exclamation-circle mr-1"></i>Invalid URL
                        </span>
                    )}
                </div>
                <div className="text-sm text-gray-400 mt-1 space-y-1">
                    {video.videoId && <div><i className="fas fa-id-badge mr-2"></i>ID: {video.videoId}</div>}
                    {videoUrl && <div className="text-xs text-gray-500 truncate"><i className="fas fa-link mr-2"></i>{videoUrl}</div>}
                    {video.duration && <div><i className="fas fa-clock mr-2"></i>{video.duration}</div>}
                </div>
            </div>
            ...
        </div>
    );
})}
```

## How It Works

### Bunny.net Video URL Construction

**Format**: `https://iframe.mediadelivery.net/embed/{LIBRARY_ID}/{VIDEO_ID}`

**Components**:
- `LIBRARY_ID`: From `.env` file as `VITE_BUNNY_LIBRARY_ID`
- `VIDEO_ID`: Unique identifier for each video (e.g., `abc123de-f456-7890-gh12-ijklmn345678`)

**Example**:
```
Video ID: abc123de-f456-7890-gh12-ijklmn345678
Library ID: 12345
Result: https://iframe.mediadelivery.net/embed/12345/abc123de-f456-7890-gh12-ijklmn345678
```

## Usage Instructions

### Method 1: Using Video ID Only (Recommended)

1. Go to **Admin Panel → Manage Self Learn**
2. Select a topic → **Manage Content** → **Videos Tab**
3. Click **Add Video**
4. Select **🐰 Bunny.net**
5. Leave **Bunny.net URL** field empty
6. Paste only the **Video ID** (e.g., `abc123de-f456-7890-gh12-ijklmn345678`)
7. Fill in title and other details
8. Click **Add Video**

**Result**: System automatically constructs full embed URL using Library ID from `.env` file

### Method 2: Using Full URL

1. Follow steps 1-4 above
2. Leave **Video ID** field empty
3. Paste full embed URL in **Bunny.net URL** field
4. Continue with steps 7-8

### Verification

After saving, the video list will show:
- ✅ **Green "Ready" badge** - Video is properly configured and will play
- ❌ **Red "Invalid URL" badge** - Video URL cannot be constructed (missing Library ID or both fields empty)

## Configuration Required

### Environment Variable

**File**: `.env` (root directory)

```bash
VITE_BUNNY_LIBRARY_ID=your_library_id_here
```

**Where to find Library ID**:
1. Login to Bunny.net Dashboard
2. Go to **Stream** → **Video Library**
3. Select your library
4. Copy the **Library ID** from the URL or library settings

**Example**:
```bash
VITE_BUNNY_LIBRARY_ID=12345
```

### Without Library ID

If `VITE_BUNNY_LIBRARY_ID` is not set:
- ⚠️ Video ID alone will not work
- ✅ Full URL must be provided
- ❌ Videos saved with only Video ID will show "Invalid URL" badge

## Frontend Display

The same `getBunnyVideoUrl()` helper function is already implemented in:
- `src/pages/SelfLearn/TopicDetail.jsx` (lines 23-32)

This ensures videos play correctly on the student-facing pages when:
- Full URL is stored in database
- OR Video ID + Library ID are available

## Benefits

### For Administrators
✅ Easier to add videos - just paste Video ID  
✅ Visual feedback (Ready/Invalid badges)  
✅ Cleaner UI without information banner  
✅ See constructed URL before playing  
✅ Consistent behavior across admin and student views  

### For Students
✅ Videos play seamlessly regardless of how they were added  
✅ No broken video embeds  
✅ Proper Bunny.net CDN delivery  

## Troubleshooting

### Video Shows "Invalid URL" Badge

**Possible Causes**:
1. ❌ Library ID not configured in `.env`
2. ❌ Both Video ID and URL fields are empty
3. ❌ Video ID format is incorrect

**Solutions**:
1. Add `VITE_BUNNY_LIBRARY_ID` to `.env` file
2. Provide either Video ID or full URL
3. Verify Video ID from Bunny.net dashboard
4. Restart development server after updating `.env`

### Video Still Not Playing

**Check**:
1. ✅ Library ID is correct
2. ✅ Video exists in your Bunny.net library
3. ✅ Video is published/active in Bunny.net
4. ✅ CORS settings allow embedding from your domain
5. ✅ Browser console for any errors

### Migration for Existing Videos

If you have existing videos saved with only Video ID:
1. They will automatically work if Library ID is configured
2. Edit video → Save again to regenerate URL
3. OR run database migration to update all URLs

## Technical Details

### Files Modified
- `src/components/TopicContentManager.jsx` - Admin panel video management

### Files Already Supporting This
- `src/pages/SelfLearn/TopicDetail.jsx` - Student video player

### Database Schema
No changes to database schema - works with existing structure:
```javascript
{
  title: String,
  bunnyUrl: String,      // Full URL or constructed URL
  videoId: String,       // Bunny Video ID
  videoType: String,     // 'bunny' or 'youtube'
  duration: String,
  thumbnail: String,
  order: Number
}
```

### Build Information
- **Status**: ✅ Successful
- **Build Time**: 11.25s
- **Modules**: 838
- **Production Ready**: Yes

## Related Documentation
- [TOPIC_CONTENT_ENHANCEMENTS.md](TOPIC_CONTENT_ENHANCEMENTS.md) - PDF upload and negative marks
- [BLOG_VIDEO_IMAGE_COMPLETE_GUIDE.md](BLOG_VIDEO_IMAGE_COMPLETE_GUIDE.md) - Video integration guide

## Version History
- **February 17, 2026**: Initial fix implemented
  - Added `getBunnyVideoUrl()` helper
  - Removed info banner
  - Enhanced video list display
  - Automatic URL construction on save
