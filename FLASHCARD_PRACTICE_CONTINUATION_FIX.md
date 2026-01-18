# Flashcard Practice Session Continuation Fix

## Problems Fixed

### Problem 1: Cards Reset to Beginning
**Issue:** When you practiced 3 out of 6 cards and came back later, the practice session would start from card 1 again instead of showing cards 4-6.

**User Experience Before:**
- Practice cards 1, 2, 3
- Exit practice
- Come back and click "Practice All"
- System shows cards 1, 2, 3 again (already done!) ❌

**User Experience After:**
- Practice cards 1, 2, 3
- Exit practice
- Come back and click "Practice All"
- System shows cards 4, 5, 6 (the remaining cards!) ✅

### Problem 2: Stats Not Updating When Exiting Early
**Issue:** When you practiced 5 out of 6 cards and exited, the stats wouldn't update to show you completed 5 cards.

**User Experience Before:**
- Practice 5 cards and rate them
- Exit practice early (before finishing all 6)
- Stats don't update ❌
- Due count still shows 6 ❌

**User Experience After:**
- Practice 5 cards and rate them
- Exit practice early
- Stats update immediately ✅
- Due count shows 1 (only the remaining card) ✅

## Technical Solution

### Backend Changes

**File:** `/www/wwwroot/reaction-lab/server/controllers/flashCardController.js`

**Function:** `getCardsByTopics()`

**Before:**
```javascript
// Returned ALL cards regardless of progress
const cards = await FlashCard.find({ topicId: { $in: topicIds } })
    .populate('topicId', 'name')
    .populate('chapterId', 'name')
    .sort({ order: 1, createdAt: 1 });
res.json(cards);
```

**After:**
```javascript
// Get all cards
const allCards = await FlashCard.find({ topicId: { $in: topicIds } })
    .populate('topicId', 'name')
    .populate('chapterId', 'name')
    .sort({ order: 1, createdAt: 1 });

// Get user's progress
const progressRecords = await FlashCardProgress.find({
    userId,
    cardId: { $in: cardIds }
});

// Filter to only return cards that are DUE
const dueCards = allCards.filter(card => {
    const progress = progressMap.get(card._id.toString());
    
    // Never reviewed? It's due!
    if (!progress) return true;
    
    // Mastered? Skip it!
    if (progress.status === 'mastered') return false;
    
    // Due for review? Include it!
    if (progress.nextReview && progress.nextReview <= new Date()) {
        return true;
    }
    
    return false;
});

res.json(dueCards);
```

### Frontend Changes

**File:** `/www/wwwroot/reaction-lab/src/pages/FlashCardPractice.jsx`

**Updated:** `fetchCards()` function to send userId

**Before:**
```javascript
const response = await axios.post(`${API_URL}/flashcards/cards/by-topics`, {
    topicIds
});
```

**After:**
```javascript
const userId = localStorage.getItem('userId') || 'guest';
const response = await axios.post(`${API_URL}/flashcards/cards/by-topics`, {
    topicIds,
    userId  // Now sends userId!
});
```

## How It Works Now

### Card Filtering Logic

The system now filters cards based on their review status:

1. **Never Reviewed Cards** → Always included (due)
2. **Cards in Learning/Reviewing** → Included if nextReview date has passed
3. **Mastered Cards** → Excluded (already learned well)

### Example Scenario: 6 Cards Total

**Session 1: Practice 3 Cards**
```
Start Practice:
- Shows: Card 1, 2, 3 (never reviewed)
- Practice all 3, rate them "Good"
- Exit practice

Stats Update:
- Due: 3 (cards 4, 5, 6)
- Learning: 3 (cards 1, 2, 3)
```

**Session 2: Continue Practice**
```
Start Practice:
- Shows: Card 4, 5, 6 (the remaining cards!)
- NOT cards 1, 2, 3 (already reviewed)
- Practice 2 more (cards 4, 5)
- Exit early

Stats Update:
- Due: 1 (only card 6 left)
- Learning: 5 (cards 1-5)
```

**Session 3: Finish Remaining**
```
Start Practice:
- Shows: Card 6 (the last one!)
- Practice and rate it
- Complete!

Stats Update:
- Due: 0 (all done!)
- Learning: 6 (all cards)
```

## Benefits

### 1. Smart Continuation
✅ Always picks up where you left off
✅ No need to review cards you've already done
✅ Efficient use of study time

### 2. Real-time Progress
✅ Stats update immediately after each card
✅ Due count decreases as you progress
✅ Learning count increases as you practice

### 3. Spaced Repetition
✅ Cards come back for review when scheduled
✅ Mastered cards don't clutter your practice queue
✅ Focus on cards that need attention

### 4. Flexible Practice
✅ Can exit anytime without losing progress
✅ Progress is saved after each card rating
✅ Can practice in multiple short sessions

## User Flow Examples

### Example 1: Full Session
```
1. Topic has 6 cards, all new
2. Click "Practice All"
3. System shows all 6 cards
4. Practice all 6, rate each one
5. Complete!
6. Stats: Due: 0, Learning: 6
```

### Example 2: Partial Sessions
```
Session 1:
1. Topic has 6 cards, all new
2. Click "Practice All"
3. Practice 3 cards, rate them
4. Exit early
5. Stats: Due: 3, Learning: 3

Session 2:
1. Click "Practice All" again
2. System shows remaining 3 cards (4, 5, 6)
3. Practice 2 cards, rate them
4. Exit early
5. Stats: Due: 1, Learning: 5

Session 3:
1. Click "Practice All" again
2. System shows last card (6)
3. Practice and rate it
4. Complete!
5. Stats: Due: 0, Learning: 6
```

### Example 3: Review Session
```
After a few days:
1. Some cards are due for review
2. Click "Review Due Cards"
3. System shows only cards scheduled for today
4. Practice and rate them
5. Stats update based on ratings
```

## Database Schema

**FlashCardProgress Collection:**
```javascript
{
    userId: String,
    cardId: ObjectId,
    chapterId: ObjectId,
    topicId: ObjectId,
    status: String,  // 'new', 'learning', 'reviewing', 'mastered'
    reviewCount: Number,
    lastReviewed: Date,
    nextReview: Date,  // Used to determine if card is due
    interval: Number
}
```

## Testing Checklist

- [x] Practice 3 out of 6 cards
- [x] Exit and return - should show cards 4-6
- [x] Practice 2 more cards (4-5)
- [x] Exit early - stats should show 5 learning, 1 due
- [x] Return and practice last card
- [x] Stats should show 6 learning, 0 due
- [x] All cards reviewed - practice should show "No cards due"

## Server & Build Status

✅ Server restarted successfully
✅ Frontend built successfully
✅ Changes are live!

## How to Test

1. **Refresh your browser** (Ctrl+Shift+R)
2. **Go to any topic with 6 cards**
3. **Practice 3 cards and rate them**
4. **Exit practice**
5. **Click "Practice All" again**
6. **Verify:** Should show cards 4, 5, 6 (not 1, 2, 3)
7. **Practice 2 more cards**
8. **Exit early**
9. **Check stats:** Should show "Learning: 5, Due: 1"

The system now intelligently tracks your progress and continues from where you left off! 🎉
