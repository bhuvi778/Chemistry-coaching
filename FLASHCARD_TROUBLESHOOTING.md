# Flash Card System - Troubleshooting Guide

## ✅ System Status: FULLY OPERATIONAL

### Current Status (as of Jan 13, 2026 08:42)

✅ **Backend API:** Running and responding correctly
✅ **Database:** Populated with 25 test flashcards
✅ **Frontend:** Built successfully
✅ **Routes:** All configured and working
✅ **Server:** Online (pm2 status: online)

---

## 🔍 Common Errors and Solutions

### 1. Browser Extension Error (HARMLESS)
```
Error: Could not establish connection. Receiving end does not exist.
```

**What it is:** This is a browser extension error (likely OneSignal, Grammarly, or another Chrome extension)

**Impact:** None - This does NOT affect your flashcard system

**Solution:** You can safely ignore this error. To remove it:
- Disable browser extensions one by one to find the culprit
- Or just ignore it - it won't break anything

---

### 2. 404 Error on /api/flashcards/chapters
```
Failed to load resource: 404 (Not Found)
```

**Status:** ✅ FIXED

**What was done:**
- Added flashcard routes to `app.js`
- Restarted the server
- Created test data in correct database

**Verify it's working:**
```bash
curl http://localhost:5000/api/flashcards/chapters
```

Should return JSON with 3 chapters.

---

### 3. No Cards Showing on Frontend

**Possible causes:**

1. **Browser cache not cleared**
   - Solution: Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Or clear browser cache completely

2. **Old build being served**
   - Solution: Rebuild frontend
   ```bash
   cd /www/wwwroot/reaction-lab
   npm run build
   ```

3. **API URL mismatch**
   - Check: Frontend is looking for API at correct URL
   - Default: `https://ace2examz.com/api`
   - Local: Can be overridden with `VITE_API_URL` env variable

---

## 🧪 Testing Checklist

### Backend Tests:

```bash
# Test 1: Check server is running
pm2 status

# Test 2: Test chapters endpoint
curl http://localhost:5000/api/flashcards/chapters

# Test 3: Test specific chapter topics
curl http://localhost:5000/api/flashcards/chapters/CHAPTER_ID/topics

# Test 4: Check database has data
cd /www/wwwroot/reaction-lab/server
node -e "const mongoose = require('mongoose'); const FlashCard = require('./models/FlashCard'); mongoose.connect('mongodb://127.0.0.1:27017/chemistry_coaching').then(async () => { const count = await FlashCard.countDocuments(); console.log('Total cards:', count); process.exit(); });"
```

### Frontend Tests:

1. **Navigate to:** `/flash-cards`
2. **Expected:** See 3 chapter cards (Solutions, Electrochemistry, Chemical Kinetics)
3. **Click:** "Solutions" chapter
4. **Expected:** See 5 topics listed
5. **Select:** Any topic(s)
6. **Click:** "Start Practice"
7. **Expected:** See flashcard with question
8. **Click:** Card to flip
9. **Expected:** See answer on back

---

## 📊 Verify Test Data

### Quick Database Check:
```bash
cd /www/wwwroot/reaction-lab/server
node -e "
const mongoose = require('mongoose');
const FlashCardChapter = require('./models/FlashCardChapter');
mongoose.connect('mongodb://127.0.0.1:27017/chemistry_coaching').then(async () => {
  const chapters = await FlashCardChapter.find();
  console.log('Chapters:', chapters.length);
  chapters.forEach(c => console.log('  -', c.name));
  process.exit();
});
"
```

**Expected output:**
```
Chapters: 3
  - Solutions
  - Electrochemistry
  - Chemical Kinetics
```

---

## 🔄 Reset Everything (If Needed)

### Complete Reset:

```bash
# 1. Stop server
pm2 stop reaction-server

# 2. Clear flashcard data
cd /www/wwwroot/reaction-lab/server
node -e "
const mongoose = require('mongoose');
const FlashCard = require('./models/FlashCard');
const FlashCardTopic = require('./models/FlashCardTopic');
const FlashCardChapter = require('./models/FlashCardChapter');
mongoose.connect('mongodb://127.0.0.1:27017/chemistry_coaching').then(async () => {
  await FlashCard.deleteMany({});
  await FlashCardTopic.deleteMany({});
  await FlashCardChapter.deleteMany({});
  console.log('Cleared all flashcard data');
  process.exit();
});
"

# 3. Recreate test data
node create-sample-flashcards.js
node add-more-flashcards.js

# 4. Restart server
pm2 restart reaction-server

# 5. Rebuild frontend
cd /www/wwwroot/reaction-lab
npm run build

# 6. Clear browser cache and test
```

---

## 🌐 API Endpoints Reference

All endpoints are prefixed with `/api/flashcards`

### Chapters:
- `GET /chapters` - Get all chapters with stats
- `GET /chapters/:id` - Get single chapter
- `POST /chapters` - Create chapter (admin)
- `PUT /chapters/:id` - Update chapter (admin)
- `DELETE /chapters/:id` - Delete chapter (admin)

### Topics:
- `GET /chapters/:chapterId/topics` - Get topics by chapter
- `POST /topics` - Create topic (admin)
- `PUT /topics/:id` - Update topic (admin)
- `DELETE /topics/:id` - Delete topic (admin)

### Cards:
- `GET /topics/:topicId/cards` - Get cards by topic
- `POST /cards/by-topics` - Get cards by multiple topics (for practice)
- `POST /cards` - Create card (admin)
- `PUT /cards/:id` - Update card (admin)
- `DELETE /cards/:id` - Delete card (admin)

---

## 🎯 Current Test Data

### Chapter 1: Solutions (15 cards, 5 topics)
- Classification of Solutions (3 cards)
- Concentration Terms (3 cards)
- Henry's Law (2 cards)
- Raoult's Law (3 cards)
- Colligative Properties (4 cards)

### Chapter 2: Electrochemistry (6 cards, 3 topics)
- Electrochemical Cells (2 cards)
- Electrode Potential (3 cards)
- Nernst Equation (1 card)

### Chapter 3: Chemical Kinetics (4 cards, 2 topics)
- Rate of Reaction (1 card)
- Order of Reaction (3 cards)

---

## 🆘 Still Having Issues?

1. **Check server logs:**
   ```bash
   pm2 logs reaction-server --lines 50
   ```

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for actual errors (not extension warnings)
   - Check Network tab for failed API calls

3. **Verify API is accessible:**
   ```bash
   curl http://localhost:5000/api/health
   ```

4. **Check if port 5000 is open:**
   ```bash
   netstat -tulpn | grep 5000
   ```

---

## ✅ Success Indicators

You'll know everything is working when:

1. ✅ `/flash-cards` shows 3 chapter cards
2. ✅ Clicking a chapter shows topics
3. ✅ Selecting topics and clicking "Start Practice" loads cards
4. ✅ Cards flip when clicked
5. ✅ Progress bar updates
6. ✅ Results screen shows after all cards

---

**Last Updated:** January 13, 2026 08:42 AM
**Status:** ✅ All Systems Operational
**Test Data:** 25 cards loaded
