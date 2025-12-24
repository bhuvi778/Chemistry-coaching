# Backend MVC Structure

## Directory Structure

```
server/
├── config/
│   └── database.js          # MongoDB connection configuration
├── controllers/
│   └── videoController.js   # Video business logic
├── middleware/
│   └── cache.js             # Caching middleware
├── models/
│   ├── Video.js            # Video schema (already existed)
│   ├── Course.js
│   └── ...                 # Other models
├── routes/
│   └── videoRoutes.js      # Video route definitions
├── server.js               # Main application (old - 962 lines)
├── server.new.js           # New MVC structure (clean)
└── package.json
```

## MVC Pattern Implemented

### ✅ Models (Already existed)
- Located in `/models/`
- Define data schema and database interactions
- Example: `Video.js`, `Course.js`, etc.

### ✅ Controllers (NEW)
- Located in `/controllers/`
- Contain business logic
- Handle request processing
- Example: `videoController.js`

Functions:
- `getVideos()` - Fetch all videos
- `getVideoById()` - Fetch single video
- `createVideo()` - Create new video
- `updateVideo()` - Update existing video
- `deleteVideo()` - Delete video

### ✅ Routes (NEW)  
- Located in `/routes/`
- Define API endpoints
- Connect URLs to controller functions
- Example: `videoRoutes.js`

Routes defined:
- `GET /api/videos` → getVideos
- `GET /api/videos/:id` → getVideoById
- `POST /api/videos` → createVideo
- `PUT /api/videos/:id` → updateVideo
- `DELETE /api/videos/:id` → deleteVideo

### ✅ Middleware (NEW)
- Located in `/middleware/`
- Reusable functions for request processing
- Example: `cache.js` (caching logic)

### ✅ Config (NEW)
- Located in `/config/`
- Configuration files
- Example: `database.js` (MongoDB connection)

## Benefits of MVC Structure

1. **Separation of Concerns** - Each layer has a specific responsibility
2. **Maintainability** - Easy to find and update code
3. **Scalability** - Easy to add new features
4. **Testability** - Can test each layer independently
5. **Readability** - Clear organization (server.js: 962 lines → ~50 lines)

## Current Status

### ✅ Completed
- Video routes fully refactored to MVC
- Cache middleware extracted
- Database config extracted
- New `server.new.js` created with clean structure

### ⏳ Pending Refactor
All other routes still in old `server.js`:
- Courses (4 routes)
- Enquiries (3 routes)
- Contacts (3 routes)
- AudioBooks (5 routes)
- Study Materials (5 routes)
- Magazines (4 routes)
- Feedback (3 routes)
- Webinar Cards (4 routes)
- Doubts (6 routes)
- Crosswords (5 routes)
- Puzzle Sets (4 routes)

**Total: ~46 routes** to be refactored

## Next Steps

1. Test the new video MVC structure
2. Refactor remaining routes one by one
3. Remove old server.js once all routes migrated
4. Add authentication middleware for admin routes

## How to Test

1. Backup current server.js:
   ```bash
   cp server.js server.backup.js
   ```

2. The new MVC structure is ready in:
   - `/controllers/videoController.js`
   - `/routes/videoRoutes.js`
   - `/middleware/cache.js`
   - `/config/database.js`
   - `/server.new.js`

3. Once confirmed working, can replace server.js with the new structure
