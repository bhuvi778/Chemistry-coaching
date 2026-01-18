# Flashcard Learning Progress Tracking

## Overview
Implemented real-time progress tracking for flashcards that updates the stats boxes (New, Learning, Reviewing, Mastered) based on user practice sessions.

## How It Works

### Card Status Progression
When a user practices flashcards, each card progresses through different statuses based on their performance:

1. **New** - Cards that have never been reviewed
2. **Learning** - Cards that have been reviewed once with good quality (≥4)
3. **Reviewing** - Cards that have been reviewed 3+ times successfully
4. **Mastered** - Cards that have been reviewed 5+ times successfully

### Quality Ratings
Users rate their knowledge of each card:
- **Again** (Quality 1) - Resets to "Learning" status
- **Hard** (Quality 3) - Stays in current status
- **Good** (Quality 4) - Progresses to next status
- **Easy** (Quality 5) - Progresses to next status

## Backend Changes

### 1. New API Endpoint
**File**: `/www/wwwroot/reaction-lab/server/controllers/flashCardController.js`

Added `getChapterStats()` function that:
- Counts cards by status (new, learning, reviewing, mastered)
- Handles cards that have never been reviewed
- Returns breakdown of all card statuses for a chapter

**Endpoint**: `GET /api/flashcards/chapters/:chapterId/stats?userId=<userId>`

**Response**:
```json
{
  "new": 45,
  "learning": 12,
  "reviewing": 8,
  "mastered": 5,
  "total": 70
}
```

### 2. Route Configuration
**File**: `/www/wwwroot/reaction-lab/server/routes/flashCardRoutes.js`

Added route:
```javascript
router.get('/chapters/:chapterId/stats', flashCardController.getChapterStats);
```

## Frontend Changes

### 1. Stats Fetching
**File**: `/www/wwwroot/reaction-lab/src/pages/FlashCardTopics.jsx`

Updated `fetchChapterAndTopics()` to:
- Fetch real stats from the new API endpoint
- Display actual card counts by status
- Update stats in real-time

### 2. Auto-Refresh on Focus
Added window focus listener to automatically refresh stats when:
- User returns from practice session
- User switches back to the browser tab
- Ensures stats are always up-to-date

## User Flow

1. **User selects a chapter** → Sees current stats (New, Learning, Reviewing, Mastered)
2. **User practices flashcards** → Rates each card (Again, Hard, Good, Easy)
3. **Backend updates progress** → Card status changes based on quality rating
4. **User returns to topics page** → Stats automatically refresh to show updated counts
5. **Learning count increases** → As cards move from "New" to "Learning" status

## Example Scenario

### Initial State
```
New: 50 cards
Learning: 0 cards
Reviewing: 0 cards
Mastered: 0 cards
```

### After First Practice Session (10 cards rated "Good")
```
New: 40 cards
Learning: 10 cards  ← Increased!
Reviewing: 0 cards
Mastered: 0 cards
```

### After More Practice (5 cards reviewed 3+ times)
```
New: 35 cards
Learning: 10 cards
Reviewing: 5 cards  ← Increased!
Mastered: 0 cards
```

### After Mastering Some Cards (3 cards reviewed 5+ times)
```
New: 35 cards
Learning: 7 cards
Reviewing: 2 cards
Mastered: 3 cards  ← Increased!
```

## Database Schema

The progress is tracked in the `FlashCardProgress` model with these fields:
- `userId` - User identifier
- `cardId` - Flashcard identifier
- `chapterId` - Chapter identifier
- `topicId` - Topic identifier
- `status` - Current status (new, learning, reviewing, mastered)
- `reviewCount` - Number of times reviewed
- `lastReviewed` - Last review date
- `nextReview` - Next scheduled review date
- `interval` - Days until next review

## Benefits

1. **Real-time Feedback** - Users see their progress immediately
2. **Motivation** - Visual representation of learning progress
3. **Spaced Repetition** - Cards are scheduled for review based on performance
4. **Accurate Tracking** - Backend tracks every review session
5. **Auto-refresh** - Stats update automatically when returning to the page

## Testing

To test the feature:

1. Go to Flashcards page
2. Select a chapter
3. Note the current stats (especially "Learning" count)
4. Click "Practice All" or "Review Due Cards"
5. Practice some flashcards and rate them
6. Click "Exit Practice" or "Back to Topics"
7. Observe that the "Learning" count has increased!

## Files Modified

1. `/www/wwwroot/reaction-lab/server/controllers/flashCardController.js` - Added getChapterStats function
2. `/www/wwwroot/reaction-lab/server/routes/flashCardRoutes.js` - Added stats route
3. `/www/wwwroot/reaction-lab/src/pages/FlashCardTopics.jsx` - Updated to fetch and display real stats

## Next Steps

The system is now fully functional! The stats will update automatically as users practice flashcards. The "Learning" counter (and other counters) will increase based on actual user progress.
