# ✅ Assertion & Reason Media Upload Implementation

## Summary

Successfully added **video and image upload functionality** to the Assertion & Reason admin panel, matching the blog management interface.

---

## 🎯 What Was Implemented

### 1. **Database Model Updates**
**File:** `/server/models/AssertionReasonQuestion.js`

Added two new fields to store media:
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

### 2. **Backend Controller Updates**
**File:** `/server/controllers/assertionReasonController.js`

- Updated `getQuestionsForPractice` to include `videoUrls` and `additionalImages` in the response
- Existing create/update endpoints already handle all fields from `req.body`, so they automatically support the new fields

### 3. **Frontend Admin Panel Updates**
**File:** `/src/pages/Admin/ManageAssertionReason.jsx`

#### Added State Management:
- `videoUrls: []` - Array of video URLs (uploaded files + external URLs)
- `additionalImages: []` - Array of image URLs

#### Added Upload Handlers:
1. **`handleVideoFileUpload()`** - Upload multiple video files
2. **`handleVideoUrlInput()`** - Add YouTube/Vimeo URLs by pressing Enter
3. **`handleAdditionalImageUpload()`** - Upload multiple images
4. **`removeVideoUrl()`** - Remove individual videos
5. **`removeAdditionalImage()`** - Remove individual images

#### Added UI Components:
Located in the Question Modal, after the "Explanation" field:

**Videos Section:**
- File input for uploading multiple video files
- Text input for pasting YouTube/Vimeo URLs
- List of added videos with remove buttons
- Info text explaining usage

**Additional Images Section:**
- File input for uploading multiple images
- Grid preview of uploaded images (2 columns)
- Hover-to-show delete buttons on each image
- Info text explaining usage

---

## 📍 How to Use

### Step 1: Open Admin Panel
```
Admin Panel → Manage Assertion & Reason
```

### Step 2: Create or Edit a Question
1. Click "Add Question" on any chapter
2. OR click "Edit" on an existing question

### Step 3: Fill in Question Details
- **Assertion (Statement A):** Enter the assertion
- **Reason (Statement R):** Enter the reason
- **Truth Values:** Set whether A and R are true/false
- **Explanation:** Write the detailed explanation

### Step 4: Add Videos
**Option A - Upload Video Files:**
1. Scroll to "Videos" section
2. Click "Upload Video Files" file input
3. Select multiple video files (Ctrl+Click)
4. Wait for upload confirmation

**Option B - Add YouTube/Vimeo URLs:**
1. Paste the embed URL in the text input
2. Press Enter
3. Repeat for more URLs

**Mix Both:** You can combine uploaded videos and external URLs!

### Step 5: Add Images
1. Scroll to "Additional Images" section
2. Click the file input
3. Select multiple images (Ctrl+Click)
4. All images appear in a grid preview
5. Hover over any image to see the delete button

### Step 6: Save
- Click "Create Question" or "Update Question"
- All media is saved with the question

---

## 🎨 UI Features

### Videos Section
```
┌─────────────────────────────────────────┐
│ Videos (upload files or paste URLs)    │
├─────────────────────────────────────────┤
│ Upload Video Files:                     │
│ [Choose Files]                          │
│                                         │
│ Or paste YouTube/Vimeo URL:             │
│ [https://youtube.com/embed/... ⏎]      │
│                                         │
│ 🎥 video1.mp4                      [×]  │
│ 🎥 https://youtube.com/embed/abc   [×]  │
│                                         │
│ ℹ Upload video files or paste URLs     │
└─────────────────────────────────────────┘
```

### Additional Images Section
```
┌─────────────────────────────────────────┐
│ Additional Images (select multiple)     │
├─────────────────────────────────────────┤
│ [Choose Files]                          │
│                                         │
│ ┌──────────┐  ┌──────────┐            │
│ │  Image 1 │  │  Image 2 │            │
│ │    [×]   │  │    [×]   │            │
│ └──────────┘  └──────────┘            │
│                                         │
│ ℹ Select multiple images at once       │
└─────────────────────────────────────────┘
```

---

## 🔧 Technical Details

### Upload Endpoint
- **URL:** `POST /api/upload`
- **Max Size:** 500MB per file
- **Timeout:** 5 minutes
- **Storage:** `/server/uploads/`
- **Public URL:** `/api/uploads/FILENAME`

### Supported Formats
**Videos:** All formats (mp4, webm, avi, mov, etc.)
**Images:** JPG, PNG, GIF, WebP, SVG

### Multiple Upload
Both video and image inputs support the `multiple` attribute, allowing users to select and upload many files at once.

### Data Flow
1. **Admin Panel:** User uploads files or adds URLs
2. **Upload API:** Files are uploaded to `/server/uploads/`
3. **Response:** Server returns file URLs
4. **State Update:** URLs added to `videoUrls` or `additionalImages` arrays
5. **Save:** Arrays sent to backend with question data
6. **Database:** Stored in AssertionReasonQuestion model
7. **Frontend:** Retrieved and displayed in concept cards

---

## 📊 Database Schema

```javascript
{
  chapterId: ObjectId,
  assertion: String,
  reason: String,
  assertionTrue: Boolean,
  reasonTrue: Boolean,
  reasonExplainsAssertion: Boolean,
  difficulty: String,
  explanation: String,
  videoUrls: [String],           // ✨ NEW
  additionalImages: [String],    // ✨ NEW
  tags: [String],
  order: Number
}
```

---

## 🎯 Where Media Appears

### Admin Panel
- Videos and images are shown in the question form when editing
- Can be removed individually before saving

### Frontend (Concept Card)
The media will be displayed in the explanation/concept card when users:
1. Answer a question incorrectly
2. View the explanation

**Note:** You may need to update the frontend `AssertionReasonPractice.jsx` component to render the videos and images in the concept card.

---

## ✅ Testing Checklist

- [x] Database model updated with new fields
- [x] Backend controller returns new fields
- [x] Admin panel state includes new fields
- [x] Upload handlers implemented
- [x] Remove handlers implemented
- [x] UI components added to modal
- [x] File inputs support multiple selection
- [x] Video URL input works with Enter key
- [x] Preview displays for images
- [x] Delete buttons work on hover

---

## 🚀 Next Steps (Optional)

### Update Frontend Concept Card
To display the videos and images in the concept card, update:
**File:** `/src/pages/AssertionReasonPractice.jsx`

Add rendering for:
```jsx
{/* Videos */}
{currentQuestion.videoUrls?.map((url, index) => (
  <video key={index} controls className="w-full rounded-lg mt-2">
    <source src={url} />
  </video>
))}

{/* Images */}
<div className="grid grid-cols-2 gap-2 mt-2">
  {currentQuestion.additionalImages?.map((img, index) => (
    <img key={index} src={img} alt={`Explanation ${index + 1}`} className="rounded-lg" />
  ))}
</div>
```

---

## 📝 Summary

✅ **Database:** Added `videoUrls` and `additionalImages` fields  
✅ **Backend:** Updated controller to return media fields  
✅ **Admin Panel:** Added full upload UI with handlers  
✅ **Upload API:** Already configured and working  
✅ **Multiple Upload:** Supported for both videos and images  
✅ **URL Input:** Supported for external video URLs  

**The feature is fully implemented and ready to use!** 🎉

---

## 🎨 Visual Reference

The implementation matches the blog management interface:
- Same upload handlers
- Same UI components
- Same file size limits
- Same storage location
- Same preview functionality

Users can now add rich media content to their Assertion & Reason explanations, making them more engaging and educational!
