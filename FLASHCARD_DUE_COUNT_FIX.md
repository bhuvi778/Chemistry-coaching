# Flashcard Due Count Fix

## Problem
When users practiced 3 cards out of 6 total cards in a topic:
- The stats showed "Learning: 3" (correct ✓)
- But the topic card still showed "6 due" instead of "3 due" (incorrect ✗)

The issue was that ALL cards were being marked as "due" regardless of whether they had been reviewed or not.

## Solution
Updated the backend logic to calculate `dueCount` correctly:

**Due Count Now Includes:**
1. **Never Reviewed Cards** - Cards that have never been attempted
2. **Cards Due for Review** - Cards that need review today (based on spaced repetition schedule)

**Due Count Excludes:**
- Cards that have been reviewed but aren't due yet
- Mastered cards (already learned well)

## Technical Changes

### Files Modified
- `/www/wwwroot/reaction-lab/server/controllers/flashCardController.js`

### Functions Updated

#### 1. `getChaptersWithProgress()`
**Before:**
```javascript
dueCount: cardCount  // All cards marked as due
```

**After:**
```javascript
// Calculate cards that haven't been reviewed
const reviewedCardsCount = await FlashCardProgress.countDocuments({
    userId,
    chapterId: chapter._id
});
const neverReviewedCount = cardCount - reviewedCardsCount;

// Calculate cards that are due for review
const cardsNeedingReview = await FlashCardProgress.countDocuments({
    userId,
    chapterId: chapter._id,
    nextReview: { $lte: new Date() },
    status: { $ne: 'mastered' }
});

dueCount = neverReviewedCount + cardsNeedingReview;
```

#### 2. `getTopicsByChapterWithProgress()`
Same logic applied at the topic level.

## How It Works Now

### Example Scenario: Topic with 6 Cards

**Initial State:**
```
Total Cards: 6
Due: 6 (all cards never reviewed)
Learning: 0
```

**After Practicing 3 Cards (rated "Good"):**
```
Total Cards: 6
Due: 3 (only the 3 cards not yet attempted)
Learning: 3 (the 3 cards you just practiced)
```

**After All 6 Cards Practiced:**
```
Total Cards: 6
Due: 0 (all cards have been reviewed)
Learning: 6 (all cards in learning status)
```

**After Some Cards Become Due Again:**
```
Total Cards: 6
Due: 2 (cards scheduled for review today)
Learning: 4
Reviewing: 2
```

## Benefits

1. **Accurate Progress Tracking** - Users can see exactly how many cards they still need to review
2. **Better Motivation** - Seeing the due count decrease provides positive feedback
3. **Spaced Repetition** - Due count respects the spaced repetition schedule
4. **Clear Status** - Distinction between "total cards" and "cards due for review"

## User Experience

### Before Fix
- User practices 3 out of 6 cards
- Topic still shows "6 due" (confusing!)
- User thinks they haven't made progress

### After Fix
- User practices 3 out of 6 cards
- Topic shows "3 due" (accurate!)
- User sees clear progress
- Remaining 3 cards are the ones not yet attempted

## Testing

To verify the fix:

1. **Go to a topic with 6 cards**
   - Check: Shows "6 due"

2. **Practice 3 cards and rate them "Good"**
   - Check: Shows "3 due" (the remaining cards)
   - Check: Stats show "Learning: 3"

3. **Practice the remaining 3 cards**
   - Check: Shows "0 due"
   - Check: Stats show "Learning: 6"

4. **Wait for cards to become due (or manually set nextReview date)**
   - Check: Shows correct number of cards due for review

## Database Fields Used

- `FlashCardProgress.userId` - User identifier
- `FlashCardProgress.chapterId` - Chapter identifier
- `FlashCardProgress.topicId` - Topic identifier
- `FlashCardProgress.status` - Card status (new, learning, reviewing, mastered)
- `FlashCardProgress.nextReview` - Next scheduled review date

## Server Restart Required

After making these changes, the server must be restarted:
```bash
pm2 restart reaction-server
```

The fix is now live and working! 🎉
