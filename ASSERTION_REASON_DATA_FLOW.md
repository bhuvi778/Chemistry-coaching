# Assertion & Reason - Dynamic Data Flow Documentation

## Overview
The Assertion & Reason feature displays **100% dynamic data** from the backend. All statistics, counts, and progress indicators are calculated in real-time based on user progress and database content.

---

## 📊 Data Flow Architecture

```
Database (MongoDB)
    ↓
Backend Controller (assertionReasonController.js)
    ↓
API Routes (/api/assertion-reason/*)
    ↓
Frontend Components (React)
    ↓
User Interface (Cards, Badges, Stats)
```

---

## 🎯 Main Page: AssertionReason.jsx

### 1. **Total Statistics Badges** (Top of page)
Located at lines 78-103, these badges display overall statistics:

| Badge | Data Source | Backend Calculation |
|-------|-------------|---------------------|
| **Total Questions** | `stats.totalQuestions` | Sum of all questions across all chapters |
| **Total Chapters** | `stats.totalChapters` | Count of active chapters in database |
| **Due Today** | `stats.dueToday` | New questions + questions due for review |
| **Mastered** | `stats.mastered` | Questions with status='mastered' |

**API Endpoint:** `GET /api/assertion-reason/chapters?userId={userId}`

**Backend Logic (lines 63-78):**
```javascript
const totalQuestions = chaptersWithProgress.reduce((sum, ch) => sum + ch.questionCount, 0);
const totalDue = chaptersWithProgress.reduce((sum, ch) => sum + ch.dueCount, 0);
const totalMastered = await AssertionReasonProgress.countDocuments({
    userId,
    status: 'mastered'
});
```

### 2. **Chapter Cards** (Grid display)
Located at lines 110-167, each card shows:

| Display Element | Data Source | Backend Calculation |
|----------------|-------------|---------------------|
| **Chapter Name** | `chapter.name` | From AssertionReasonChapter model |
| **Question Count** | `chapter.questionCount` | Count of questions in chapter |
| **Due Count** | `chapter.dueCount` | New questions + questions needing review |
| **Progress Bar** | `chapter.progress` | (Completed cards / Total cards) × 100 |

**Backend Logic (lines 15-61):**
```javascript
// Question count
const questionCount = await AssertionReasonQuestion.countDocuments({
    chapterId: chapter._id
});

// Due count calculation
const neverReviewedCount = questionCount - reviewedCount;
const cardsNeedingReview = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId: chapter._id,
    nextReview: { $lte: new Date() },
    status: { $ne: 'mastered' }
});
const dueCount = neverReviewedCount + cardsNeedingReview;

// Progress calculation
const completedCards = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId: chapter._id,
    nextReview: { $gt: new Date() }
});
const progress = questionCount > 0 ? Math.round((completedCards / questionCount) * 100) : 0;
```

---

## 📖 Chapter Detail Page: AssertionReasonChapter.jsx

### 1. **Status Badges** (Chapter statistics)
Located at lines 82-98, these show the breakdown of question statuses:

| Badge | Data Source | Backend Calculation | Description |
|-------|-------------|---------------------|-------------|
| **New** | `chapter.newCount` | Total questions - reviewed questions | Questions never seen |
| **Learning** | `chapter.learningCount` | Progress with status='learning' | Questions being learned |
| **Reviewing** | `chapter.reviewingCount` | Progress with status='reviewing' | Questions in review phase |
| **Mastered** | `chapter.masteredCount` | Progress with status='mastered' | Fully mastered questions |

**API Endpoint:** `GET /api/assertion-reason/chapters/{chapterId}?userId={userId}`

**Backend Logic (lines 101-122):**
```javascript
const newCount = totalCount - await AssertionReasonProgress.countDocuments({
    userId,
    chapterId
});

const learningCount = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    status: 'learning'
});

const reviewingCount = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    status: 'reviewing'
});

const masteredCount = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    status: 'mastered'
});
```

### 2. **Action Buttons**
Located at lines 132-147:

| Button | Data Displayed | Calculation |
|--------|----------------|-------------|
| **Review Due** | `chapter.dueCount` | New + cards needing review |
| **Practice All** | `chapter.totalCount` | Total questions in chapter |

---

## 🔄 How Data Updates Dynamically

### When User Practices Questions:

1. **User answers a question** → Frontend calls `updateQuestionProgress` API
2. **Backend updates progress** → Uses SM-2 spaced repetition algorithm
3. **Status changes** → Question moves from 'new' → 'learning' → 'reviewing' → 'mastered'
4. **Next review date set** → Based on user performance (quality rating 1-5)
5. **User returns to chapter list** → Fresh data fetched with updated counts

### Progress Status Flow:
```
NEW (never seen)
    ↓ (quality >= 4)
LEARNING (interval: 1 day)
    ↓ (quality >= 4)
REVIEWING (interval: 3+ days)
    ↓ (interval >= 21 days)
MASTERED (fully learned)
```

### Due Count Calculation:
```javascript
dueCount = neverReviewedQuestions + questionsWithNextReview <= today
```

---

## 🎨 Frontend Display Logic

### AssertionReason.jsx (Main Page)

**Fetching Data:**
```javascript
const fetchChapters = async () => {
    const userId = localStorage.getItem('userId') || 'guest';
    const timestamp = Date.now(); // Cache buster
    const response = await axios.get(
        `${API_URL}/assertion-reason/chapters?userId=${userId}&_t=${timestamp}`
    );
    
    setChapters(response.data.chapters || []);
    setStats(response.data.stats || stats);
};
```

**Displaying Stats:**
```jsx
<div className="text-white font-semibold">
    {stats.totalQuestions} Questions
</div>
<div className="text-white font-semibold">
    {stats.dueToday} Due Today
</div>
```

**Displaying Chapter Cards:**
```jsx
{chapters.map((chapter) => (
    <div key={chapter._id}>
        <h3>{chapter.name}</h3>
        <span>{chapter.questionCount} questions</span>
        {chapter.dueCount > 0 && (
            <span>{chapter.dueCount} due</span>
        )}
        {chapter.progress > 0 && (
            <div style={{ width: `${chapter.progress}%` }} />
        )}
    </div>
))}
```

### AssertionReasonChapter.jsx (Chapter Detail)

**Fetching Data:**
```javascript
const fetchChapterDetails = async () => {
    const userId = localStorage.getItem('userId') || 'guest';
    const response = await axios.get(
        `${API_URL}/assertion-reason/chapters/${chapterId}?userId=${userId}`
    );
    
    setChapter(response.data.chapter);
};
```

**Displaying Status Badges:**
```jsx
<div className="text-2xl font-bold">{chapter.newCount}</div>
<div className="text-2xl font-bold">{chapter.learningCount}</div>
<div className="text-2xl font-bold">{chapter.reviewingCount}</div>
<div className="text-2xl font-bold">{chapter.masteredCount}</div>
```

---

## 🗄️ Database Models

### AssertionReasonChapter
```javascript
{
    name: String,
    description: String,
    icon: String,
    iconColor: String,
    order: Number,
    isActive: Boolean
}
```

### AssertionReasonQuestion
```javascript
{
    chapterId: ObjectId,
    assertion: String,
    reason: String,
    assertionTrue: Boolean,
    reasonTrue: Boolean,
    reasonExplainsAssertion: Boolean,
    difficulty: String,
    order: Number
}
```

### AssertionReasonProgress
```javascript
{
    userId: String,
    questionId: ObjectId,
    chapterId: ObjectId,
    status: String, // 'new', 'learning', 'reviewing', 'mastered'
    repetitions: Number,
    easeFactor: Number,
    interval: Number,
    nextReview: Date,
    lastReview: Date
}
```

---

## 🔍 Key Features

### ✅ Real-time Statistics
- All counts update immediately after practice sessions
- No hardcoded values - everything from database
- User-specific progress tracking

### ✅ Spaced Repetition Algorithm (SM-2)
- Questions scheduled based on performance
- Automatic status progression
- Optimal learning intervals

### ✅ Cache Busting
- Timestamp parameter prevents stale data
- Fresh data on every page load
- Accurate real-time counts

### ✅ User-Specific Data
- Each user has independent progress
- Guest mode supported
- Progress persists across sessions

---

## 🚀 How to Verify Dynamic Data

1. **Check Total Statistics:**
   - Open browser DevTools → Network tab
   - Navigate to `/assertion-reason`
   - Look for API call to `/api/assertion-reason/chapters`
   - Verify response contains `stats` object with dynamic counts

2. **Check Chapter Cards:**
   - Each chapter card shows `questionCount` and `dueCount`
   - These values come from the same API response
   - Values change as you practice questions

3. **Check Chapter Detail Page:**
   - Navigate to a specific chapter
   - API call to `/api/assertion-reason/chapters/{chapterId}`
   - Response contains `newCount`, `learningCount`, `reviewingCount`, `masteredCount`
   - All calculated in real-time from database

4. **Practice and Verify Updates:**
   - Complete a practice session
   - Return to chapter list
   - Observe updated counts (due count decreases, mastered increases)

---

## 📝 Summary

**Everything is dynamic!** The Assertion & Reason feature:

✅ Fetches all data from backend APIs  
✅ Displays real-time statistics based on user progress  
✅ Updates counts automatically after practice  
✅ Uses spaced repetition for optimal learning  
✅ Supports multiple users with independent progress  
✅ No hardcoded or mock data in production  

The system is fully functional and ready for use!
