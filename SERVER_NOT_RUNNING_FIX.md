# Server Not Running - Quick Fix Guide

## Error: "Error submitting crossword. Please try again."

This error means the **backend server is not running**.

## Solution: Start the Server

### Step 1: Open Server Terminal
```bash
cd c:\Users\Lenovo\Desktop\reaction-lab\server
```

### Step 2: Start the Server
```bash
npm run dev
```

OR

```bash
node server.js
```

### Step 3: Check if Server Started
You should see:
```
Server running on port 5000
MongoDB connected successfully
```

## Common Issues

### Issue 1: "Cannot find module"
**Solution**: Install dependencies
```bash
npm install
```

### Issue 2: "Port 5000 already in use"
**Solution**: Kill the process or use different port
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or change port in server.js
const PORT = process.env.PORT || 5001;
```

### Issue 3: MongoDB Connection Error
**Solution**: Check internet connection
- MongoDB Atlas needs internet
- Check MongoDB URI in server.js

## How to Test

### 1. Check Server is Running
Open browser: http://localhost:5000
Should see: "Cannot GET /" (this is normal)

### 2. Check API Endpoint
Open browser: http://localhost:5000/api/crosswords
Should see: `[]` or list of crosswords

### 3. Try Adding Crossword Again
- Go to Admin Panel
- Fill form
- Click "Add Crossword"
- Should work now!

## Environment Variables

Create `.env` file in server folder:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
```

## Quick Commands

**Start Server**:
```bash
cd server
npm run dev
```

**Start Frontend** (separate terminal):
```bash
npm run dev
```

**Both should be running**:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Debugging

### Check Browser Console (F12)
Look for:
```
Submitting to: http://localhost:5000/api/crosswords
Form data: { title: "...", ... }
Response status: 201
```

### Check Server Terminal
Look for:
```
Received crossword data: { title: "...", ... }
Crossword saved successfully: 507f1f77bcf86cd799439011
```

## Still Not Working?

1. **Check VITE_API_URL**:
   - Create `.env` file in root (not server folder)
   - Add: `VITE_API_URL=http://localhost:5000`
   - Restart frontend

2. **Check CORS**:
   - Server allows localhost:5173
   - Check server.js CORS config

3. **Check Network Tab** (F12 → Network):
   - See if request is being sent
   - Check request URL
   - Check response

## Success Indicators

✅ Server terminal shows: "Server running on port 5000"
✅ Server terminal shows: "MongoDB connected"
✅ Browser console shows: "Response status: 201"
✅ Alert shows: "Crossword added successfully!"
✅ Crossword appears in list below

## Need Help?

1. Open browser console (F12)
2. Try adding crossword
3. Copy all console messages
4. Share the error messages
