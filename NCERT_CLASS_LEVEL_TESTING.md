# Testing Guide for NCERT Class Level Feature

## Quick Test Steps

### 1. Test Admin Panel - Create New Chapter
1. Navigate to: `http://localhost:5174/admin` (or your admin URL)
2. Go to "Manage NCERT" section
3. Click "Add Chapter" button
4. Fill in the form:
   - Name: "Test Chapter - Class 12"
   - Chapter Number: "Chapter 99"
   - Description: "This is a test chapter for Class 12"
   - Color: Select any color
   - Icon: Select any icon
   - **Class Level: Select "Class 12"** ← NEW FIELD
5. Click "Save"
6. Verify the chapter card shows a blue badge with "Class 12"

### 2. Test Admin Panel - Edit Existing Chapter
1. In the Manage NCERT section
2. Click the edit icon (pencil) on any existing chapter
3. Change the Class Level dropdown from "Class 11" to "Class 12" (or vice versa)
4. Click "Save"
5. Verify the badge updates on the chapter card

### 3. Test Frontend Display
1. Navigate to: `http://localhost:5174/ncert-toolbox/line-by-line`
2. Look at the chapter cards
3. Verify each card shows a class badge in the top-right corner:
   - **Class 11**: Purple-to-pink gradient badge
   - **Class 12**: Blue-to-cyan gradient badge
4. Hover over cards to see the badge remains visible

### 4. Verify Database
Run this command to check the database:
```bash
cd /www/wwwroot/reaction-lab/server
node -e "
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/reaction-lab')
  .then(async () => {
    const NCERTChapter = require('./models/NCERTChapter');
    const chapters = await NCERTChapter.find({ category: 'line-by-line' }).limit(5);
    console.log('Sample chapters:');
    chapters.forEach(ch => {
      console.log(\`- \${ch.name} (Class \${ch.classLevel || 'NOT SET'})\`);
    });
    process.exit(0);
  });
"
```

## Expected Results

### Admin Panel Chapter Card
```
┌─────────────────────────────────────────┐
│  [Edit] [Delete]                        │
│                                         │
│  📚  Chapter 1  [Class 11]              │
│      Some Basic Concepts                │
│      Description of the chapter...      │
│                                         │
│  Click to manage topics            →    │
└─────────────────────────────────────────┘
```

### Frontend Chapter Card
```
┌─────────────────────────────────────────┐
│                          [Class 11]     │ ← Gradient badge
│  📚                                     │
│  Chapter Icon                           │
│                                         │
│  Chapter 1                              │
│  Some Basic Concepts of Chemistry       │
│  Master NCERT concepts...               │
│                                         │
│  📝 5 Topics  ✓ 12 Attempted           │
│                                         │
│  Progress: ████████░░░░ 45%            │
│                                         │
│  View Topics                       →    │
└─────────────────────────────────────────┘
```

## Troubleshooting

### Issue: Class badge not showing on frontend
**Solution**: 
1. Clear browser cache (Ctrl+Shift+R)
2. Check browser console for errors
3. Verify the chapter has classLevel in database

### Issue: Class Level dropdown not showing in admin
**Solution**:
1. Hard refresh the admin page (Ctrl+Shift+R)
2. Check if frontend dev server is running
3. Verify the ManageNCERT.jsx file was updated correctly

### Issue: All chapters showing Class 11
**Solution**:
1. Run the migration script again
2. Manually update chapters from admin panel
3. Check database directly

## Visual Reference

### Badge Colors:
- **Class 11 Badge**: 
  - Background: Purple (#a855f7) to Pink (#ec4899) gradient
  - Text: White
  - Admin inline: Purple background with 20% opacity

- **Class 12 Badge**: 
  - Background: Blue (#3b82f6) to Cyan (#06b6d4) gradient
  - Text: White
  - Admin inline: Blue background with 20% opacity

## API Endpoints Used
- `GET /api/ncert/chapters/line-by-line` - Fetch chapters (now includes classLevel)
- `POST /api/ncert/chapters` - Create chapter (now accepts classLevel)
- `PUT /api/ncert/chapters/:id` - Update chapter (now accepts classLevel)

## Files Modified
1. `/server/models/NCERTChapter.js` - Schema update
2. `/src/pages/Admin/ManageNCERT.jsx` - Admin panel
3. `/src/pages/NCERTLineByLine.jsx` - Frontend display

## Success Criteria
✅ Admin can select class level when creating/editing chapters
✅ Class badges display correctly in admin panel
✅ Class badges display correctly on frontend cards
✅ Badges have correct colors (purple for 11, blue for 12)
✅ Existing chapters have default class level (11)
✅ Database schema includes classLevel field
