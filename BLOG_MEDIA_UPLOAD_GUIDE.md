# 📝 Blog Media Upload Guide

## ✅ Feature Status: FULLY IMPLEMENTED

Your blog management system already has complete support for uploading multiple videos and images! This guide will show you how to use these features.

---

## 🎥 Video Upload Features

### Option 1: Upload Video Files
You can upload actual video files from your computer:

1. Navigate to **Admin Panel → Manage Blogs**
2. Click **"Create New Blog"** or **"Edit"** an existing blog
3. Scroll to the **"Videos"** section
4. Under **"Upload Video Files:"**, click the file input
5. **Select multiple video files** at once (Ctrl+Click or Shift+Click)
6. Click "Open" - all videos will be uploaded automatically
7. Each video will appear in a purple card with a delete button

**Supported Formats:** All video formats (mp4, webm, avi, mov, etc.)
**File Size Limit:** 500MB per video
**Multiple Upload:** ✅ Yes - select as many as you want at once

### Option 2: Add Video URLs
You can also paste YouTube or Vimeo embed URLs:

1. In the same **"Videos"** section
2. Under **"Or paste YouTube/Vimeo URL:"**
3. Paste the embed URL (e.g., `https://www.youtube.com/embed/VIDEO_ID`)
4. Press **Enter** to add it
5. Repeat for multiple URLs

**Mix & Match:** You can combine uploaded video files AND external URLs in the same blog post!

### Managing Videos
- Each video appears in a purple card showing the filename/URL
- Click the **X button** to remove any video
- Videos are stored in `/server/uploads/` directory
- Videos are served via `/api/uploads/FILENAME`

---

## 🖼️ Image Upload Features

### Featured Image
This is the main thumbnail for your blog:

1. In the blog form, find **"Featured Image"**
2. Click the file input and select **one image**
3. Preview appears immediately below
4. Upload a new image to replace it

### Additional Images (Gallery)
Upload multiple images for a gallery within the blog post:

1. Scroll to **"Additional Images"** section
2. Click the file input
3. **Select multiple images** at once (Ctrl+Click or Shift+Click)
4. All images upload automatically
5. Preview appears in a 2-column grid
6. Hover over any image to see the delete button

**Supported Formats:** JPG, PNG, GIF, WebP, SVG
**File Size Limit:** 500MB per image (though images should be much smaller)
**Multiple Upload:** ✅ Yes - select as many as you want at once

---

## 📍 Step-by-Step: Creating a Blog with Media

### Step 1: Open the Blog Form
```
Admin Panel → Manage Blogs → Create New Blog
```

### Step 2: Fill Basic Information
- **Title:** Your blog title
- **Excerpt:** Brief description (shown on blog cards)
- **Category:** Select from dropdown
- **Tags:** Type and press Enter to add

### Step 3: Upload Featured Image
- Click file input under "Featured Image"
- Select one image
- Preview appears automatically

### Step 4: Upload Multiple Videos
**Method A - Upload Files:**
- Click file input under "Upload Video Files"
- Select multiple video files (Ctrl+Click)
- Wait for upload confirmation

**Method B - Add URLs:**
- Paste YouTube/Vimeo embed URL
- Press Enter
- Repeat for more URLs

### Step 5: Upload Multiple Images
- Click file input under "Additional Images"
- Select multiple images (Ctrl+Click)
- All images appear in grid preview
- Remove any by hovering and clicking X

### Step 6: Write Content
- Use the rich text editor for blog content
- You can also embed images/videos in the content using the editor toolbar

### Step 7: Save
- Click **"Create Blog"** or **"Update Blog"**
- All media is saved with the blog post

---

## 🔧 Technical Details

### Backend Implementation
**File:** `/server/app.js`
- Upload endpoint: `POST /api/upload`
- Uses Multer for file handling
- Files stored in `/server/uploads/`
- Files served via `/api/uploads/` static route
- Max file size: 500MB
- Timeout: 5 minutes for large uploads

### Frontend Implementation
**File:** `/src/pages/Admin/ManageBlogs.jsx`

**Video Upload Handler (Lines 214-239):**
```javascript
const handleVideoFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    // Uploads multiple files in parallel
    // Adds all URLs to videoUrls array
}
```

**Image Upload Handler (Lines 248-273):**
```javascript
const handleAdditionalImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    // Uploads multiple files in parallel
    // Adds all URLs to additionalImages array
}
```

### Database Schema
**File:** `/server/models/Blog.js`

```javascript
videoUrls: [{
    type: String,
    trim: true
}],
additionalImages: [{
    type: String,
    trim: true
}]
```

---

## 💡 Tips & Best Practices

### For Videos:
1. **Compress videos** before uploading to reduce file size
2. Use **YouTube/Vimeo URLs** for very large videos to save server space
3. **Recommended format:** MP4 (H.264) for best compatibility
4. **Optimal resolution:** 1080p or 720p

### For Images:
1. **Optimize images** before uploading (use tools like TinyPNG)
2. **Recommended format:** WebP for best compression, or JPG
3. **Optimal size:** 1920x1080 or smaller
4. **File size:** Keep under 500KB per image for fast loading

### General:
1. **Upload in batches:** Select all files at once rather than one by one
2. **Check preview:** Always verify media appears correctly before saving
3. **Remove unused:** Delete any media you don't need to save storage
4. **Test on frontend:** After saving, view the blog post to ensure media displays correctly

---

## 🐛 Troubleshooting

### "No file uploaded" Error
- **Cause:** File input is empty
- **Solution:** Make sure you selected files before clicking upload

### Upload Takes Too Long
- **Cause:** Large file size or slow connection
- **Solution:** 
  - Compress videos/images before uploading
  - Upload fewer files at once
  - Check your internet connection

### Video Doesn't Play
- **Cause:** Unsupported format or corrupt file
- **Solution:**
  - Convert to MP4 (H.264)
  - Try uploading a different file
  - Use YouTube/Vimeo URL instead

### Images Don't Display
- **Cause:** File path issue or unsupported format
- **Solution:**
  - Check browser console for errors
  - Ensure image format is JPG, PNG, or WebP
  - Re-upload the image

### "File too large" Error
- **Cause:** File exceeds 500MB limit
- **Solution:**
  - Compress the file
  - For videos, use external hosting (YouTube/Vimeo)

---

## 📊 Current Configuration

| Setting | Value |
|---------|-------|
| Max File Size | 500MB |
| Upload Timeout | 5 minutes |
| Supported Video Formats | All (mp4, webm, avi, mov, etc.) |
| Supported Image Formats | JPG, PNG, GIF, WebP, SVG |
| Multiple Upload | ✅ Enabled |
| Storage Location | `/server/uploads/` |
| Public URL | `/api/uploads/FILENAME` |

---

## 🎯 Quick Reference

### Video Upload
```
Admin Panel → Manage Blogs → Create/Edit Blog
→ Videos Section
→ Upload Video Files (multiple) OR Paste URLs
→ Press Enter to add URLs
→ Click X to remove
```

### Image Upload
```
Admin Panel → Manage Blogs → Create/Edit Blog
→ Additional Images Section
→ Select Multiple Files
→ Preview in Grid
→ Hover & Click X to remove
```

---

## ✨ What's Already Working

✅ Upload multiple video files at once  
✅ Add video URLs (YouTube/Vimeo)  
✅ Mix uploaded videos and URL videos  
✅ Upload multiple images at once  
✅ Preview all media before saving  
✅ Remove individual media items  
✅ All media saved to database  
✅ All media served correctly on frontend  
✅ 500MB file size support  
✅ 5-minute upload timeout  

---

## 🚀 Next Steps

Your blog media upload system is **fully functional**! Just:

1. Go to Admin Panel → Manage Blogs
2. Create or edit a blog
3. Upload your videos and images
4. Save and publish

**No additional setup required!** 🎉
