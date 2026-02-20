# Previous Year Questions (PYQ) System - Complete Implementation Guide

## Overview
A comprehensive system for managing and practicing Previous Year Questions from competitive exams (JEE Main, JEE Advanced, NEST, IAT, NEET, BITSAT).

## System Architecture

### Database Models Created

#### 1. PYQChapter (`/server/models/PYQChapter.js`)
Organizes questions by exam and subject.

**Fields:**
- `examName`: JEE Main | JEE Advanced | NEST | IAT | NEET | BITSAT
- `subject`: Physics | Chemistry | Mathematics | Biology
- `chapterName`: String (required)
- `chapterNumber`: String
- `description`: String
- `icon`: Font Awesome icon class (default: 'fa-book')
- `color`: UI color theme
- `order`: Display order
- `isActive`: Boolean
- Timestamps: createdAt, updatedAt

**Indexes:**
- `examName + subject + order`
- `isActive`

#### 2. PYQTopic (`/server/models/PYQTopic.js`)
Sub-categorizes questions within chapters.

**Fields:**
- `chapterId`: Reference to PYQChapter
- `topicName`: String (required)
- `description`: String
- `order`: Display order
- `isActive`: Boolean
- Timestamps

**Indexes:**
- `chapterId + order`
- `isActive`

#### 3. PYQQuestion (`/server/models/PYQQuestion.js`)
Stores individual questions with complete metadata.

**Fields:**
- `chapterId`: Reference to PYQChapter
- `topicId`: Reference to PYQTopic
- `examName`: Exam identifier
- `yearBadge`: "JEE Main 2022 – 25 July, Shift 2"
- `examYear`: Number (for filtering)
- `subject`: Subject name
- `question`: Question text (required)
- `questionImage`: URL to uploaded image
- `hint`: Short guiding hint (required)
- `difficulty`: Easy | Medium | Hard
- `questionType`: Single Correct | Multiple Correct | Numerical
- `options`: Array of strings (4 options for MCQs)
- `correctAnswer`: String (A/B/C/D or number)
- `solution`: Detailed solution text
- `solutionImage`: URL to solution image
- `tags`: Array of strings
- `isActive`: Boolean
- `order`: Display order
- Timestamps

**Indexes:**
- `chapterId + topicId`
- `examName + examYear` (descending)
- `subject + difficulty`
- `isActive`

#### 4. PYQProgress (`/server/models/PYQProgress.js`)
Tracks user progress and performance.

**Fields:**
- `userId`: String (required, indexed)
- `questionId`: Reference to PYQQuestion
- `chapterId`: Reference to PYQChapter
- `topicId`: Reference to PYQTopic
- `status`: Correct | Incorrect | Partially Correct | Unattempted
- `userAnswer`: String
- `isCompleted`: Boolean
- `attempts`: Number
- `timeSpent`: Number (seconds)
- `lastAttemptedAt`: Date
- Timestamps

**Indexes:**
- `userId + questionId` (unique)
- `userId + chapterId`
- `userId + topicId`
- `userId + status`

## API Endpoints

### Base URL: `/api/pyq`

### Chapter Endpoints

#### GET `/api/pyq/chapters`
Get all chapters with optional filters.

**Query Parameters:**
- `examName`: Filter by exam
- `subject`: Filter by subject
- `isActive`: Filter by active status

**Response:**
```json
[
  {
    "_id": "...",
    "examName": "JEE Main",
    "subject": "Physics",
    "chapterName": "Thermodynamics",
    "chapterNumber": "Chapter 12",
    "description": "...",
    "icon": "fa-fire",
    "color": "red",
    "order": 12,
    "isActive": true
  }
]
```

#### GET `/api/pyq/chapters/:id`
Get single chapter by ID.

#### POST `/api/pyq/chapters`
Create new chapter.

**Request Body:**
```json
{
  "examName": "JEE Main",
  "subject": "Physics",
  "chapterName": "Thermodynamics",
  "chapterNumber": "Chapter 12",
  "description": "Heat, work, and energy",
  "icon": "fa-fire",
  "color": "red",
  "order": 12
}
```

#### PUT `/api/pyq/chapters/:id`
Update chapter.

#### DELETE `/api/pyq/chapters/:id`
Delete chapter (cascades to topics, questions, progress).

### Topic Endpoints

#### GET `/api/pyq/topics/chapter/:chapterId`
Get all topics for a chapter.

#### GET `/api/pyq/topics/:id`
Get single topic by ID.

#### POST `/api/pyq/topics`
Create new topic.

**Request Body:**
```json
{
  "chapterId": "...",
  "topicName": "First Law of Thermodynamics",
  "description": "Conservation of energy",
  "order": 1
}
```

#### PUT `/api/pyq/topics/:id`
Update topic.

#### DELETE `/api/pyq/topics/:id`
Delete topic (cascades to questions, progress).

### Question Endpoints

#### GET `/api/pyq/questions`
Get questions with filters.

**Query Parameters:**
- `chapterId`: Filter by chapter
- `topicId`: Filter by topic
- `examName`: Filter by exam
- `examYear`: Filter by year
- `subject`: Filter by subject
- `difficulty`: Filter by difficulty
- `questionType`: Filter by type
- `isActive`: Filter by active status

**Response:**
```json
[
  {
    "_id": "...",
    "examName": "JEE Main",
    "yearBadge": "JEE Main 2022 – 25 July, Shift 2",
    "examYear": 2022,
    "subject": "Physics",
    "question": "A heat engine...",
    "questionImage": "/uploads/...",
    "hint": "Use first law of thermodynamics",
    "difficulty": "Medium",
    "questionType": "Single Correct",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "B",
    "solution": "Detailed solution...",
    "solutionImage": "/uploads/...",
    "tags": ["thermodynamics", "heat-engine"],
    "chapterId": {...},
    "topicId": {...}
  }
]
```

#### GET `/api/pyq/questions/:id`
Get single question by ID.

#### POST `/api/pyq/questions`
Create new question (supports image upload).

**Content-Type:** `multipart/form-data`

**Form Fields:**
- All question fields
- `questionImage`: File (optional)
- `solutionImage`: File (optional)
- `options`: JSON string array
- `tags`: JSON string array

#### PUT `/api/pyq/questions/:id`
Update question (supports image upload).

#### DELETE `/api/pyq/questions/:id`
Delete question (cascades to progress).

### Progress Endpoints

#### GET `/api/pyq/progress/:userId`
Get user's progress.

**Query Parameters:**
- `chapterId`: Filter by chapter
- `topicId`: Filter by topic
- `status`: Filter by status

**Response:**
```json
[
  {
    "_id": "...",
    "userId": "user123",
    "questionId": {...},
    "chapterId": {...},
    "topicId": {...},
    "status": "Correct",
    "userAnswer": "B",
    "isCompleted": true,
    "attempts": 2,
    "timeSpent": 120,
    "lastAttemptedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### POST `/api/pyq/progress`
Update or create progress entry.

**Request Body:**
```json
{
  "userId": "user123",
  "questionId": "...",
  "chapterId": "...",
  "topicId": "...",
  "status": "Correct",
  "userAnswer": "B",
  "timeSpent": 60
}
```

#### GET `/api/pyq/stats/:userId`
Get user statistics.

**Query Parameters:**
- `examName`: Filter by exam
- `subject`: Filter by subject
- `chapterId`: Filter by chapter

**Response:**
```json
{
  "total": 100,
  "correct": 65,
  "incorrect": 20,
  "partiallyCorrect": 5,
  "unattempted": 10,
  "accuracy": 68,
  "totalTimeSpent": 7200
}
```

## Question Format Structure

### Standard Format

```
---
Exam: JEE Main
Year Badge: JEE Main 2022 – 25 July, Shift 2
Subject: Physics
Chapter: Thermodynamics
Topic: First Law of Thermodynamics

Q1. A heat engine operates between two reservoirs at temperatures 500K and 300K. 
If it absorbs 1000J of heat from the hot reservoir, what is the maximum work it can do?

Hint: Use Carnot efficiency formula
Difficulty: Medium
Question Type: Single Correct

Options:
A. 200 J
B. 400 J
C. 600 J
D. 800 J

Correct Answer: B
---
```

### Database Storage

```json
{
  "examName": "JEE Main",
  "yearBadge": "JEE Main 2022 – 25 July, Shift 2",
  "examYear": 2022,
  "subject": "Physics",
  "chapterId": "...",
  "topicId": "...",
  "question": "A heat engine operates...",
  "hint": "Use Carnot efficiency formula",
  "difficulty": "Medium",
  "questionType": "Single Correct",
  "options": ["200 J", "400 J", "600 J", "800 J"],
  "correctAnswer": "B",
  "solution": "Carnot efficiency = 1 - (T_cold/T_hot)..."
}
```

## Supported Exams

1. **JEE Main** - Joint Entrance Examination Main
2. **JEE Advanced** - Joint Entrance Examination Advanced
3. **NEST** - National Entrance Screening Test
4. **IAT** - Indian Aptitude Test
5. **NEET** - National Eligibility cum Entrance Test
6. **BITSAT** - Birla Institute of Technology and Science Admission Test

## Supported Subjects

1. **Physics**
2. **Chemistry**
3. **Mathematics**
4. **Biology** (for NEET)

## Question Types

1. **Single Correct** - One correct option from 4 choices
2. **Multiple Correct** - Multiple correct options
3. **Numerical** - Numerical answer (no options)

## Difficulty Levels

1. **Easy** - Basic conceptual questions
2. **Medium** - Standard exam-level questions
3. **Hard** - Advanced/tricky questions

## Evaluation Status

1. **Correct** - User answered correctly
2. **Incorrect** - User answered incorrectly
3. **Partially Correct** - For multiple correct questions
4. **Unattempted** - Not yet attempted

## File Structure

```
server/
├── models/
│   ├── PYQChapter.js      ✅ Created
│   ├── PYQTopic.js        ✅ Created
│   ├── PYQQuestion.js     ✅ Created
│   └── PYQProgress.js     ✅ Created
├── routes/
│   └── pyqRoutes.js       ✅ Created
└── app.js                 ✅ Updated (routes registered)
```

## Next Steps

### 1. Frontend Components (To Be Created)
- Exam selection page
- Chapter listing page
- Topic listing page
- Question practice interface
- Progress dashboard
- Statistics visualization

### 2. Admin Panel Integration (To Be Created)
- Chapter management
- Topic management
- Question management (with image upload)
- Bulk question import
- Analytics dashboard

### 3. Additional Features (Future)
- Question bookmarking
- Notes on questions
- Discussion forum per question
- Performance analytics
- Personalized recommendations
- Mock tests from PYQs
- Year-wise filtering
- Exam pattern analysis

## Testing the API

### Using cURL

```bash
# Create a chapter
curl -X POST http://localhost:5000/api/pyq/chapters \
  -H "Content-Type: application/json" \
  -d '{
    "examName": "JEE Main",
    "subject": "Physics",
    "chapterName": "Thermodynamics",
    "chapterNumber": "Chapter 12"
  }'

# Get all chapters
curl http://localhost:5000/api/pyq/chapters

# Get chapters for JEE Main Physics
curl "http://localhost:5000/api/pyq/chapters?examName=JEE%20Main&subject=Physics"
```

## Server Status

✅ **Backend Server**: Restarted successfully
✅ **Routes**: Registered at `/api/pyq`
✅ **Caching**: Enabled (30 minutes)
✅ **File Upload**: Supported for question/solution images

## Important Notes

1. **Image Upload**: Questions and solutions support image uploads
2. **Cascading Deletes**: Deleting a chapter/topic deletes all associated data
3. **Progress Tracking**: Automatically tracks attempts, time, and status
4. **Caching**: API responses cached for 30 minutes for better performance
5. **Validation**: All required fields validated at model level
6. **Indexing**: Optimized indexes for fast queries

## Security Considerations

- [ ] Add authentication middleware
- [ ] Add authorization (admin vs user)
- [ ] Rate limiting on API endpoints
- [ ] Input sanitization
- [ ] File upload validation (size, type)
- [ ] CORS configuration

## Performance Optimization

✅ Database indexing
✅ Response caching (30 min)
✅ Pagination support (can be added)
- [ ] Image optimization
- [ ] CDN for static assets
- [ ] Query optimization

---

**Status**: Backend infrastructure complete and running
**Next**: Frontend components and admin panel integration
