# PYQ System - Quick Start Guide

## ✅ System Status

**Backend**: ✅ Running
**Database**: ✅ Connected
**Sample Data**: ✅ Loaded
**API Endpoints**: ✅ Active at `/api/pyq`

## 📊 Sample Data Loaded

### JEE Main - Physics - Thermodynamics
- **Chapter**: Thermodynamics (Chapter 12)
- **Topics**: 
  1. First Law of Thermodynamics
  2. Heat Engines and Carnot Cycle
- **Questions**: 4 questions (2022-2023)

### JEE Main - Chemistry - Organic Chemistry
- **Chapter**: Organic Chemistry - Basic Principles (Chapter 13)
- **Topics**: 
  1. IUPAC Nomenclature
- **Questions**: 1 question (2023)

### NEET - Biology - Cell Biology
- **Chapter**: Cell: The Unit of Life (Chapter 8)
- **Topics**: 
  1. Cell Organelles
- **Questions**: 2 questions (2022-2023)

## 🧪 Test the API

### 1. Get All Chapters

```bash
curl http://localhost:5000/api/pyq/chapters
```

**Expected Response**: Array of 3 chapters

### 2. Get JEE Main Physics Chapters

```bash
curl "http://localhost:5000/api/pyq/chapters?examName=JEE%20Main&subject=Physics"
```

**Expected Response**: Thermodynamics chapter

### 3. Get Topics for Thermodynamics

First, get the chapter ID from step 1, then:

```bash
curl http://localhost:5000/api/pyq/topics/chapter/CHAPTER_ID_HERE
```

**Expected Response**: 2 topics

### 4. Get All Questions

```bash
curl http://localhost:5000/api/pyq/questions
```

**Expected Response**: Array of 7 questions

### 5. Get Questions for Thermodynamics

```bash
curl "http://localhost:5000/api/pyq/questions?chapterId=CHAPTER_ID_HERE"
```

**Expected Response**: 4 questions

### 6. Filter by Difficulty

```bash
curl "http://localhost:5000/api/pyq/questions?difficulty=Easy"
```

**Expected Response**: Easy questions only

### 7. Filter by Year

```bash
curl "http://localhost:5000/api/pyq/questions?examYear=2023"
```

**Expected Response**: 2023 questions

### 8. Create User Progress

```bash
curl -X POST http://localhost:5000/api/pyq/progress \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "testuser123",
    "questionId": "QUESTION_ID_HERE",
    "chapterId": "CHAPTER_ID_HERE",
    "topicId": "TOPIC_ID_HERE",
    "status": "Correct",
    "userAnswer": "B",
    "timeSpent": 60
  }'
```

### 9. Get User Progress

```bash
curl http://localhost:5000/api/pyq/progress/testuser123
```

### 10. Get User Statistics

```bash
curl http://localhost:5000/api/pyq/stats/testuser123
```

## 🎯 Quick Test Workflow

### Step 1: Get Chapters
```bash
curl http://localhost:5000/api/pyq/chapters | jq
```

Copy a `_id` from the response.

### Step 2: Get Topics for that Chapter
```bash
curl http://localhost:5000/api/pyq/topics/chapter/YOUR_CHAPTER_ID | jq
```

Copy a topic `_id`.

### Step 3: Get Questions for that Topic
```bash
curl "http://localhost:5000/api/pyq/questions?topicId=YOUR_TOPIC_ID" | jq
```

### Step 4: Practice a Question
Copy a question `_id` and submit an answer:

```bash
curl -X POST http://localhost:5000/api/pyq/progress \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "student001",
    "questionId": "YOUR_QUESTION_ID",
    "chapterId": "YOUR_CHAPTER_ID",
    "topicId": "YOUR_TOPIC_ID",
    "status": "Correct",
    "userAnswer": "B",
    "timeSpent": 45
  }' | jq
```

### Step 5: Check Your Stats
```bash
curl http://localhost:5000/api/pyq/stats/student001 | jq
```

## 📝 Sample Question Structure

Here's what a question looks like in the database:

```json
{
  "_id": "65a1b2c3d4e5f6g7h8i9j0k1",
  "examName": "JEE Main",
  "yearBadge": "JEE Main 2022 – 25 July, Shift 2",
  "examYear": 2022,
  "subject": "Physics",
  "chapterId": {
    "_id": "...",
    "chapterName": "Thermodynamics",
    "chapterNumber": "Chapter 12"
  },
  "topicId": {
    "_id": "...",
    "topicName": "First Law of Thermodynamics"
  },
  "question": "A gas is compressed from volume V to V/2 at constant pressure P. The work done on the gas is:",
  "hint": "Work done at constant pressure = P × ΔV",
  "difficulty": "Easy",
  "questionType": "Single Correct",
  "options": ["PV/2", "-PV/2", "PV", "-PV"],
  "correctAnswer": "B",
  "solution": "Work done W = P(V_final - V_initial) = P(V/2 - V) = -PV/2. The negative sign indicates work is done on the gas.",
  "isActive": true,
  "order": 1,
  "createdAt": "2024-01-15T10:00:00.000Z",
  "updatedAt": "2024-01-15T10:00:00.000Z"
}
```

## 🔧 Common Use Cases

### 1. Student Practicing Questions
```
GET /api/pyq/chapters?examName=JEE Main&subject=Physics
  → Select chapter
GET /api/pyq/topics/chapter/:chapterId
  → Select topic
GET /api/pyq/questions?topicId=:topicId
  → Get questions
POST /api/pyq/progress
  → Submit answer
GET /api/pyq/stats/:userId
  → View performance
```

### 2. Filter Questions by Year
```
GET /api/pyq/questions?examName=JEE Main&examYear=2023
  → Get all 2023 JEE Main questions
```

### 3. Get Difficult Questions
```
GET /api/pyq/questions?difficulty=Hard&subject=Physics
  → Get hard physics questions
```

### 4. Track Chapter Progress
```
GET /api/pyq/progress/:userId?chapterId=:chapterId
  → See all attempts for a chapter
```

## 🎨 Frontend Integration (Next Steps)

### Pages to Create:

1. **Exam Selection Page** (`/pyq`)
   - Display 6 exam cards (JEE Main, JEE Advanced, NEST, IAT, NEET, BITSAT)
   - Click to go to subject selection

2. **Subject Selection Page** (`/pyq/:examName`)
   - Display subjects for selected exam
   - Physics, Chemistry, Mathematics (Biology for NEET)

3. **Chapter Listing Page** (`/pyq/:examName/:subject`)
   - Display all chapters for subject
   - Show progress indicators
   - Search functionality

4. **Topic Listing Page** (`/pyq/:examName/:subject/:chapterId`)
   - Display topics within chapter
   - Show completion status

5. **Question Practice Page** (`/pyq/:examName/:subject/:chapterId/:topicId`)
   - Display questions one by one
   - Show year badge
   - Hint button
   - Submit answer
   - Show solution after submission
   - Track time spent

6. **Progress Dashboard** (`/pyq/dashboard`)
   - Overall statistics
   - Subject-wise breakdown
   - Recent activity
   - Performance graphs

## 📦 Data Management

### Add More Questions

```bash
# Run the seed script again (it clears and re-seeds)
node server/seedPYQData.js

# Or add questions via API
curl -X POST http://localhost:5000/api/pyq/questions \
  -H "Content-Type: application/json" \
  -d '{
    "chapterId": "...",
    "topicId": "...",
    "examName": "JEE Main",
    "yearBadge": "JEE Main 2024 – 1 February, Shift 1",
    "examYear": 2024,
    "subject": "Physics",
    "question": "Your question here",
    "hint": "Your hint here",
    "difficulty": "Medium",
    "questionType": "Single Correct",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": "A",
    "solution": "Detailed solution"
  }'
```

### Bulk Import

Create a JSON file with questions and use the API to import them in a loop.

## 🚀 Production Deployment

### Environment Variables

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

### Server Commands

```bash
# Start server
pm2 start server/app.js --name reaction-server

# Restart server
pm2 restart reaction-server

# View logs
pm2 logs reaction-server
```

## 📊 Database Queries

### MongoDB Shell Queries

```javascript
// Count questions by exam
db.pyqquestions.aggregate([
  { $group: { _id: "$examName", count: { $sum: 1 } } }
])

// Get questions by year
db.pyqquestions.find({ examYear: 2023 }).count()

// Get user's correct answers
db.pyqprogresses.find({ 
  userId: "student001", 
  status: "Correct" 
}).count()
```

## ✅ Verification Checklist

- [x] Database models created
- [x] API routes implemented
- [x] Routes registered in server
- [x] Server restarted successfully
- [x] Sample data loaded
- [x] API endpoints tested
- [ ] Frontend components created
- [ ] Admin panel integration
- [ ] Image upload tested
- [ ] Progress tracking tested
- [ ] Statistics working

## 🎯 Next Immediate Steps

1. **Test the API** using the curl commands above
2. **Create frontend pages** for exam/subject/chapter selection
3. **Build question practice interface**
4. **Add admin panel** for question management
5. **Implement bulk import** for questions
6. **Add image upload** functionality

---

**Status**: ✅ Backend Complete & Running
**Sample Data**: ✅ 7 Questions Loaded
**Ready for**: Frontend Development & Testing
