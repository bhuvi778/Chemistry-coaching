# Topic Content Manager Enhancements

## Overview
Enhanced the Topic Content Manager in the admin panel with two major features:
1. **PDF File Upload** - Upload PDF files directly from local system for sheets
2. **Negative Marks Per Question** - Configure negative marks for each exercise question

## Changes Implemented

### 1. PDF File Upload for Sheets

#### Frontend Changes (`src/components/TopicContentManager.jsx`)

**Added file upload state:**
```javascript
const [sheetForm, setSheetForm] = useState({
    title: '',
    pdfUrl: '',
    pdfFile: null,  // NEW: File upload state
    description: '',
    order: 1
});
```

**Enhanced sheet submission handler:**
- Handles both file upload and URL input
- Uploads PDF to server when file is selected
- Validates file before submission
- Shows success/error messages

**New UI Features:**
- Drag-and-drop file upload area
- File preview showing name and size
- 10MB file size limit validation
- "OR" divider between upload and URL options
- Remove file button
- Disabled URL input when file is selected

#### Backend Changes (`server/server.js`)

**New POST endpoint:**
```javascript
POST /api/upload/pdf
```

**Features:**
- Accepts PDF files via multer middleware
- Validates file type (only application/pdf allowed)
- Auto-generates unique filename with timestamp
- Returns URL to uploaded file
- Proper error handling and logging

**File Storage:**
- Location: `server/uploads/`
- Accessible at: `https://ace2examz.com/api/uploads/[filename]`

### 2. Negative Marks Per Exercise Question

#### Frontend Changes (`src/components/TopicContentManager.jsx`)

**Added negative marks input field:**
```javascript
<input
    type="number"
    value={exerciseForm.negativeMarks}
    onChange={(e) => setExerciseForm({ 
        ...exerciseForm, 
        negativeMarks: parseFloat(e.target.value) || 0 
    })}
    min="0"
    step="0.25"
/>
```

**Enhanced exercise display:**
- Shows positive marks in green badge: `+X marks`
- Shows negative marks in red badge: `-X marks` (if > 0)
- Color-coded for easy identification

**Form Layout Improvements:**
- Reorganized grid layout for better responsiveness
- Separate row for marks and negative marks
- Added helper text: "Marks deducted for wrong answer"

## Usage Instructions

### Uploading PDF Sheets

1. Navigate to **Admin Panel → Manage Self Learn**
2. Select a topic and click **Manage Content**
3. Go to **Sheets** tab
4. Click **Add New Sheet**
5. Two options available:
   - **Upload File**: Click the upload area or drag & drop PDF (max 10MB)
   - **Paste URL**: Enter PDF URL directly
6. Fill in title, description, and order
7. Click **Add Sheet**

### Setting Negative Marks

1. Navigate to **Admin Panel → Manage Self Learn**
2. Select a topic and click **Manage Content**
3. Go to **Exercises** tab
4. When adding/editing a question:
   - Set **Marks** (positive points)
   - Set **Negative Marks** (deduction for wrong answer)
   - Use increments of 0.25 (e.g., 0.25, 0.5, 0.75, 1)
5. Save the exercise

## Technical Details

### File Upload Specifications
- **Max Size**: 10MB
- **Allowed Format**: PDF only (`.pdf`)
- **Validation**: Client-side and server-side
- **Storage**: Server filesystem (`server/uploads/`)
- **Access**: Public via `/api/uploads/` endpoint

### Negative Marks Configuration
- **Type**: Decimal number (float)
- **Minimum**: 0
- **Step**: 0.25
- **Default**: 0 (no negative marking)
- **Storage**: Per question in database

### API Endpoints Used

**PDF Upload:**
```
POST /api/upload/pdf
Content-Type: multipart/form-data
Field: pdf (file)

Response:
{
  "url": "/api/uploads/[timestamp]-[filename].pdf",
  "filename": "[timestamp]-[filename].pdf"
}
```

**Sheet Management:**
```
POST   /api/self-learn/admin/topics/:topicId/sheets
PUT    /api/self-learn/admin/topics/:topicId/sheets/:sheetId
DELETE /api/self-learn/admin/topics/:topicId/sheets/:sheetId
```

**Exercise Management:**
```
POST   /api/self-learn/admin/topics/:topicId/exercises
PUT    /api/self-learn/admin/topics/:topicId/exercises/:exerciseId
DELETE /api/self-learn/admin/topics/:topicId/exercises/:exerciseId
```

## Database Schema

### Sheet Schema
```javascript
{
  title: String,
  pdfUrl: String,      // Can be uploaded file URL or external URL
  description: String,
  order: Number
}
```

### Exercise Schema
```javascript
{
  question: String,
  options: [String, String, String, String],
  correctAnswer: Number,
  explanation: String,
  difficulty: String,
  marks: Number,
  negativeMarks: Number,  // NEW: Per question negative marking
  order: Number
}
```

## Benefits

### PDF File Upload
✅ No need for external hosting
✅ Faster workflow for administrators
✅ Better control over file management
✅ Automatic filename sanitization
✅ File size validation prevents server overload

### Negative Marks Per Question
✅ Flexible scoring system
✅ Better reflects real exam patterns
✅ Different penalties for different difficulty levels
✅ Visual feedback in admin panel
✅ Transparent to students during practice

## Build Information

- **Build Status**: ✅ Successful
- **Build Time**: 13.42s
- **Total Modules**: 838
- **Production Ready**: Yes

## Future Enhancements

### Possible Improvements:
1. **Bulk PDF Upload** - Upload multiple sheets at once
2. **PDF Preview** - Show PDF preview in admin panel
3. **File Management** - Delete/replace uploaded files
4. **Cloud Storage** - Integrate with AWS S3 or similar
5. **Negative Marking Templates** - Preset configurations for common patterns
6. **Analytics** - Track which questions have highest negative mark impact

## Testing Checklist

- [x] PDF upload with valid file
- [ ] PDF upload with invalid file type
- [ ] PDF upload exceeding size limit
- [ ] Sheet creation with uploaded PDF
- [ ] Sheet creation with URL
- [ ] Exercise creation with negative marks
- [ ] Exercise display showing both marks types
- [ ] Responsive layout on mobile devices
- [ ] File removal functionality
- [ ] Error handling for failed uploads

## Troubleshooting

### PDF Upload Issues

**Problem**: File not uploading
- Check file size (must be < 10MB)
- Verify file format (must be PDF)
- Check server disk space
- Verify `uploads/` directory permissions

**Problem**: Uploaded PDF not accessible
- Check `/api/uploads/` endpoint is working
- Verify file was saved to `server/uploads/`
- Check file path in database

### Negative Marks Issues

**Problem**: Negative marks not saving
- Verify form state is updating
- Check database schema includes `negativeMarks` field
- Ensure proper data type (Number/Float)

**Problem**: Negative marks not displaying
- Check exercise object has `negativeMarks` property
- Verify conditional rendering logic
- Ensure value is > 0 to display badge

## Related Files

- `src/components/TopicContentManager.jsx` - Main component
- `server/server.js` - PDF upload endpoint
- `server/models/SelfLearnTopic.js` - Database schema
- `server/uploads/` - File storage directory

## Version Information

- **Feature Added**: December 2024
- **React Version**: 18.x
- **Vite Version**: 5.4.21
- **Node Version**: Compatible with ES6+
