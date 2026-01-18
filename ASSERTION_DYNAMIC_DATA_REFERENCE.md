# Quick Reference: Dynamic Data Display Locations

## 🎯 AssertionReason.jsx (Main Page)

### Top Statistics Badges (Lines 78-103)

```jsx
{/* Total Questions Badge */}
<div className="px-5 py-2.5 rounded-lg bg-purple-500/10 border border-purple-500/30">
    <i className="fas fa-layer-group text-purple-400"></i>
    <span className="text-white font-semibold">
        {stats.totalQuestions} Questions  {/* ← DYNAMIC from backend */}
    </span>
</div>

{/* Total Chapters Badge */}
<div className="px-5 py-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
    <i className="fas fa-book text-blue-400"></i>
    <span className="text-white font-semibold">
        {stats.totalChapters} Chapters  {/* ← DYNAMIC from backend */}
    </span>
</div>

{/* Due Today Badge */}
<div className="px-5 py-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30">
    <i className="fas fa-clock text-amber-400"></i>
    <span className="text-white font-semibold">
        {stats.dueToday} Due Today  {/* ← DYNAMIC from backend */}
    </span>
</div>

{/* Mastered Badge */}
<div className="px-5 py-2.5 rounded-lg bg-green-500/10 border border-green-500/30">
    <i className="fas fa-check-circle text-green-400"></i>
    <span className="text-white font-semibold">
        {stats.mastered} Mastered  {/* ← DYNAMIC from backend */}
    </span>
</div>
```

**Data Source:** `GET /api/assertion-reason/chapters?userId={userId}`

**Backend Response:**
```json
{
    "chapters": [...],
    "stats": {
        "totalQuestions": 680,
        "totalChapters": 18,
        "dueToday": 677,
        "mastered": 0
    }
}
```

---

### Chapter Cards Grid (Lines 110-167)

```jsx
{chapters.map((chapter) => (
    <div key={chapter._id} className="glass-panel rounded-xl p-6">
        {/* Chapter Icon */}
        <div style={{ 
            backgroundColor: `${chapter.iconColor}20`,  {/* ← DYNAMIC */}
            color: chapter.iconColor  {/* ← DYNAMIC */}
        }}>
            <i className={chapter.icon || 'fas fa-bolt'}></i>  {/* ← DYNAMIC */}
        </div>

        {/* Due Count Badge */}
        {chapter.dueCount > 0 && (  {/* ← DYNAMIC condition */}
            <div className="px-3 py-1 rounded-full bg-amber-500/20">
                <span className="text-amber-400 font-bold">
                    {chapter.dueCount} due  {/* ← DYNAMIC from backend */}
                </span>
            </div>
        )}

        {/* Chapter Name */}
        <h3 className="text-xl font-bold text-white">
            {chapter.name}  {/* ← DYNAMIC from backend */}
        </h3>

        {/* Question Count */}
        <div className="flex items-center gap-4">
            <span>
                <i className="fas fa-question-circle"></i>
                {chapter.questionCount} questions  {/* ← DYNAMIC from backend */}
            </span>
        </div>

        {/* Progress Bar */}
        {chapter.progress > 0 && (  {/* ← DYNAMIC condition */}
            <div className="mt-3">
                <span className="text-xs font-semibold text-cyan-400">
                    {chapter.progress}%  {/* ← DYNAMIC from backend */}
                </span>
                <div className="w-full h-2 bg-gray-700 rounded-full">
                    <div 
                        className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
                        style={{ width: `${chapter.progress}%` }}  {/* ← DYNAMIC width */}
                    ></div>
                </div>
            </div>
        )}
    </div>
))}
```

**Data Source:** Same API as above

**Backend Response (per chapter):**
```json
{
    "_id": "chapter123",
    "name": "Chemical Kinetics",
    "icon": "fas fa-bolt",
    "iconColor": "#8b5cf6",
    "questionCount": 25,
    "dueCount": 22,
    "progress": 12
}
```

---

## 📖 AssertionReasonChapter.jsx (Chapter Detail Page)

### Chapter Header (Lines 77-79)

```jsx
<div className="glass-panel rounded-xl p-8">
    <h1 className="text-3xl font-bold text-white">
        {chapter.name}  {/* ← DYNAMIC from backend */}
    </h1>
    <p className="text-cyan-400">Choose your practice mode to begin</p>
</div>
```

---

### Status Badges (Lines 82-98)

```jsx
{/* New Questions Badge */}
<div className="px-4 py-2 rounded-lg bg-gray-700/50 border border-gray-600">
    <div className="text-2xl font-bold text-white">
        {chapter.newCount}  {/* ← DYNAMIC from backend */}
    </div>
    <div className="text-xs text-gray-400">New</div>
</div>

{/* Learning Badge */}
<div className="px-4 py-2 rounded-lg bg-amber-500/10 border border-amber-500/30">
    <div className="text-2xl font-bold text-amber-400">
        {chapter.learningCount}  {/* ← DYNAMIC from backend */}
    </div>
    <div className="text-xs text-gray-400">Learning</div>
</div>

{/* Reviewing Badge */}
<div className="px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/30">
    <div className="text-2xl font-bold text-blue-400">
        {chapter.reviewingCount}  {/* ← DYNAMIC from backend */}
    </div>
    <div className="text-xs text-gray-400">Reviewing</div>
</div>

{/* Mastered Badge */}
<div className="px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/30">
    <div className="text-2xl font-bold text-green-400">
        {chapter.masteredCount}  {/* ← DYNAMIC from backend */}
    </div>
    <div className="text-xs text-gray-400">Mastered</div>
</div>
```

**Data Source:** `GET /api/assertion-reason/chapters/{chapterId}?userId={userId}`

**Backend Response:**
```json
{
    "chapter": {
        "_id": "chapter123",
        "name": "Chemical Kinetics",
        "newCount": 22,
        "learningCount": 3,
        "reviewingCount": 0,
        "masteredCount": 0,
        "totalCount": 25,
        "dueCount": 22
    }
}
```

---

### Action Buttons (Lines 132-147)

```jsx
{/* Review Due Button */}
<button onClick={() => startPractice('due')}>
    <i className="fas fa-clock"></i>
    <span>Review Due ({chapter.dueCount})</span>  {/* ← DYNAMIC from backend */}
</button>

{/* Practice All Button */}
<button onClick={() => startPractice('all')}>
    <i className="fas fa-play"></i>
    <span>Practice All ({chapter.totalCount})</span>  {/* ← DYNAMIC from backend */}
</button>
```

---

## 🔄 Data Update Flow

### When User Practices:

1. **User answers question** → Quality rating (1-5) sent to backend
2. **Backend updates progress:**
   ```javascript
   POST /api/assertion-reason/progress/{questionId}
   Body: { userId: "user123", quality: 4 }
   ```

3. **Progress record updated:**
   - Status changes (new → learning → reviewing → mastered)
   - Next review date calculated
   - Interval updated based on performance

4. **User returns to page** → Fresh data fetched
5. **All counts update automatically:**
   - Due count decreases
   - Learning/Reviewing/Mastered counts increase
   - Progress bars update
   - Total stats recalculate

---

## 📊 Backend Calculation Summary

### Total Statistics (Main Page)
```javascript
// Total Questions
const totalQuestions = chaptersWithProgress.reduce((sum, ch) => sum + ch.questionCount, 0);

// Total Chapters
const totalChapters = chapters.length;

// Due Today
const totalDue = chaptersWithProgress.reduce((sum, ch) => sum + ch.dueCount, 0);

// Mastered
const totalMastered = await AssertionReasonProgress.countDocuments({
    userId,
    status: 'mastered'
});
```

### Per-Chapter Statistics
```javascript
// Question Count
const questionCount = await AssertionReasonQuestion.countDocuments({ chapterId });

// Due Count
const neverReviewedCount = questionCount - reviewedCount;
const cardsNeedingReview = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    nextReview: { $lte: new Date() },
    status: { $ne: 'mastered' }
});
const dueCount = neverReviewedCount + cardsNeedingReview;

// Progress Percentage
const completedCards = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    nextReview: { $gt: new Date() }
});
const progress = Math.round((completedCards / questionCount) * 100);
```

### Status Breakdown (Chapter Detail)
```javascript
// New
const newCount = totalCount - await AssertionReasonProgress.countDocuments({ userId, chapterId });

// Learning
const learningCount = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    status: 'learning'
});

// Reviewing
const reviewingCount = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    status: 'reviewing'
});

// Mastered
const masteredCount = await AssertionReasonProgress.countDocuments({
    userId,
    chapterId,
    status: 'mastered'
});
```

---

## ✅ Verification Checklist

- [x] **Total Questions** - Calculated from all chapters
- [x] **Total Chapters** - Count of active chapters
- [x] **Due Today** - Sum of all due questions
- [x] **Mastered** - Count of mastered questions
- [x] **Chapter Question Count** - Per-chapter question count
- [x] **Chapter Due Count** - New + needs review
- [x] **Chapter Progress** - Percentage completed
- [x] **New Count** - Questions never seen
- [x] **Learning Count** - Questions in learning phase
- [x] **Reviewing Count** - Questions in review phase
- [x] **Mastered Count** - Fully learned questions

**All data is 100% dynamic and fetched from the backend!** 🎉
