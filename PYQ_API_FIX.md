# PYQ API URL Fix

## Issue
The PYQ pages were getting 404 errors when trying to fetch data from the API because the API URL was incorrectly configured.

## Root Cause
The PYQ pages were using:
```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await axios.get(`${baseURL}/api/pyq/chapters`, ...);
```

But `.env` has:
```
VITE_API_URL=/api
```

This resulted in requests going to `/api/api/pyq/chapters` (double `/api`) instead of `/api/pyq/chapters`.

## Solution
Changed all PYQ pages to use the same pattern as other services (NTA Abhyas, NCERT, etc.):

```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await axios.get(`${API_BASE_URL}/pyq/chapters`, ...);
```

Now:
- **Production**: Uses `/api/pyq/chapters` (correct)
- **Development**: Uses `http://localhost:5000/api/pyq/chapters` (correct)

## Files Fixed

### 1. PYQChapterList.jsx
**Before:**
```javascript
const response = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/pyq/chapters`, {
```

**After:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await axios.get(`${API_BASE_URL}/pyq/chapters`, {
```

### 2. PYQTopicList.jsx
**Before:**
```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const chapterResponse = await axios.get(`${baseURL}/api/pyq/chapters/${chapterId}`);
const topicsResponse = await axios.get(`${baseURL}/api/pyq/topics/chapter/${chapterId}`);
```

**After:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const chapterResponse = await axios.get(`${API_BASE_URL}/pyq/chapters/${chapterId}`);
const topicsResponse = await axios.get(`${API_BASE_URL}/pyq/topics/chapter/${chapterId}`);
```

### 3. PYQPractice.jsx
**Before:**
```javascript
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const response = await axios.get(`${baseURL}/api/pyq/questions`, {
```

**After:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const response = await axios.get(`${API_BASE_URL}/pyq/questions`, {
```

## API Endpoints Now Working

✅ `GET /api/pyq/chapters?examName=JEE Main&subject=Physics`
✅ `GET /api/pyq/chapters/:chapterId`
✅ `GET /api/pyq/topics/chapter/:chapterId`
✅ `GET /api/pyq/questions?topicId=:topicId`

## Build Status

```
✓ built in 12.51s
Exit code: 0
```

## Testing

### Test Flow:
1. Navigate to `/pyq`
2. Click "JEE Main"
3. Click "Physics"
4. **Should now load chapters successfully** ✅
5. Search for "Thermo"
6. Click "Thermodynamics"
7. **Should now load topics successfully** ✅
8. Click a topic
9. **Should now load questions successfully** ✅

### Expected API Calls:
```
GET /api/pyq/chapters?examName=JEE%20Main&subject=Physics&isActive=true
GET /api/pyq/chapters/65a1b2c3d4e5f6g7h8i9j0k1
GET /api/pyq/topics/chapter/65a1b2c3d4e5f6g7h8i9j0k1
GET /api/pyq/questions?topicId=65a1b2c3d4e5f6g7h8i9j0k2&isActive=true
```

## Environment Variables

### Development (.env.local)
```
VITE_API_URL=http://localhost:5000/api
```

### Production (.env)
```
VITE_API_URL=/api
```

## Consistency with Other Services

Now all services use the same pattern:

### NTA Abhyas
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### NCERT
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### DPPS
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

### PYQ (Now Fixed)
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

**Status**: ✅ **Fixed and Deployed**
**Date**: February 6, 2026
**Issue**: 404 errors on PYQ API calls
**Solution**: Corrected API URL pattern to match other services
