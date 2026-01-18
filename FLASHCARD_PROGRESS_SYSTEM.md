# Flashcard Progress Tracking System

## Overview
The flashcard system now includes comprehensive progress tracking with spaced repetition to help users learn more effectively.

## What's New

### ✨ Features Implemented

1. **Progress Tracking**
   - Tracks user progress for each flashcard
   - Shows completion percentage for chapters and topics
   - Visual progress bars throughout the interface

2. **Self-Assessment System**
   - After flipping each card, users rate how well they knew the answer:
     - **Hard** (Red) - Didn't know it well, review soon
     - **Good** (Amber) - Knew it okay, normal review interval
     - **Easy** (Green) - Knew it perfectly, longer review interval

3. **Spaced Repetition Algorithm**
   - Cards progress through stages: New → Learning → Reviewing → Mastered
   - Review intervals adjust based on performance
   - Better retention through scientifically-proven spacing

4. **Visual Feedback**
   - Progress bars on chapter cards (main page)
   - Progress bars on topic selection page
   - Overall chapter progress indicator
   - Color-coded progress (orange → cyan → green as you improve)

## How It Works

### User Journey

1. **Select a Chapter**
   - See overall progress percentage
   - See how many cards are due for review

2. **Select Topics**
   - Each topic shows individual progress
   - Overall chapter progress displayed at top
   - Stats show: New, Learning, Reviewing, Mastered cards

3. **Practice Cards**
   - View question (purple card)
   - Flip to see answer (green card)
   - Rate your knowledge: Hard, Good, or Easy

4. **Progress Updates**
   - Progress automatically saved after each card
   - Progress bars update in real-time
   - Cards move through learning stages based on performance

### Card Progression System

#### Stages:
1. **New** (0 reviews)
   - First time seeing the card
   - Starts in "new" status

2. **Learning** (1-2 reviews)
   - Actively learning the card
   - Review interval: 1 day
   - Requires 3 "Good" or "Easy" ratings to advance

3. **Reviewing** (3-4 reviews)
   - Card is being reinforced
   - Review interval: 3 days
   - Requires 5 total reviews to master

4. **Mastered** (5+ reviews)
   - Card is well-known
   - Review interval: 7 days
   - Counts toward completion percentage

### Rating System

When you flip a card, you choose:

- **Hard (Quality: 2)**
  - Resets card to "Learning" stage
  - Review again in 1 day
  - Use when you struggled to remember

- **Good (Quality: 3)**
  - Normal progression
  - Advances through stages normally
  - Use when you remembered correctly

- **Easy (Quality: 5)**
  - Faster progression
  - Advances through stages quickly
  - Use when you knew it instantly

## Technical Implementation

### Backend

#### New Model: `FlashCardProgress`
```javascript
{
  userId: String,          // User identifier
  chapterId: ObjectId,     // Reference to chapter
  topicId: ObjectId,       // Reference to topic
  cardId: ObjectId,        // Reference to card
  status: String,          // new, learning, reviewing, mastered
  reviewCount: Number,     // How many times reviewed
  lastReviewed: Date,      // When last reviewed
  nextReview: Date,        // When to review next
  interval: Number         // Days until next review
}
```

#### New API Endpoints

**Get Chapter Progress**
```
GET /api/flashcards/chapters/:chapterId/progress?userId=guest
Response: { progress: 45, completed: 9, total: 20 }
```

**Get Topic Progress**
```
GET /api/flashcards/topics/:topicId/progress?userId=guest
Response: { progress: 60, completed: 6, total: 10 }
```

**Update Card Progress**
```
POST /api/flashcards/cards/:cardId/progress
Body: { userId: "guest", quality: 5 }
Response: { status: "mastered", reviewCount: 5, ... }
```

**Get Chapters with Progress**
```
GET /api/flashcards/chapters?userId=guest
Response: [{ _id, name, progress: 45, cardCount: 20, ... }]
```

**Get Topics with Progress**
```
GET /api/flashcards/chapters/:chapterId/topics?userId=guest
Response: [{ _id, name, progress: 60, cardCount: 10, ... }]
```

### Frontend Changes

#### FlashCards.jsx
- Now displays progress percentage for each chapter
- Color-coded progress bars (orange → cyan → green)
- Shows completion stats

#### FlashCardTopics.jsx
- Shows overall chapter progress
- Individual topic progress bars
- Stats breakdown (New, Learning, Reviewing, Mastered)

#### FlashCardPractice.jsx
- Green answer cards (changed from cyan)
- Self-assessment buttons (Hard, Good, Easy)
- Automatic progress tracking
- Sends quality rating to backend

## Progress Calculation

### Chapter Progress
```
Progress = (Mastered Cards / Total Cards) × 100
```

### Topic Progress
```
Progress = (Mastered Cards in Topic / Total Cards in Topic) × 100
```

### Overall Progress
```
Overall = Average of all topic progress percentages
```

## User ID System

Currently using `'guest'` as the user ID for all users. This allows:
- Testing the system without authentication
- Shared progress across all users (good for demo)

**Future Enhancement**: Replace with actual user authentication
- Each user will have their own progress
- Progress will be personalized
- Can track individual learning patterns

## Benefits

1. **Motivation**
   - Visual progress encourages continued learning
   - Completion percentages provide clear goals
   - Color changes show improvement

2. **Effective Learning**
   - Spaced repetition improves retention
   - Self-assessment promotes active recall
   - Difficult cards reviewed more frequently

3. **Personalized Experience**
   - Progress adapts to individual performance
   - Review intervals optimize learning
   - Focus on cards that need more practice

## Testing the System

### 1. Start Fresh
```bash
# Clear all progress (optional)
cd /www/wwwroot/reaction-lab/server
node -e "
const mongoose = require('mongoose');
const FlashCardProgress = require('./models/FlashCardProgress');
mongoose.connect('mongodb://localhost:27017/chemistry_coaching').then(async () => {
  await FlashCardProgress.deleteMany({});
  console.log('Progress cleared');
  process.exit();
});
"
```

### 2. Practice Cards
1. Go to Flash Cards page
2. Select a chapter (progress shows 0%)
3. Select topics
4. Start practice
5. Rate each card (Hard, Good, or Easy)
6. Complete the session

### 3. Check Progress
1. Return to Flash Cards page
2. See updated progress percentage
3. Progress bar should show color change
4. Topic progress should reflect completion

### 4. Review Again
1. Practice the same topics again
2. Rate cards based on recall
3. Watch progress increase
4. Cards move toward "Mastered" status

## Future Enhancements

1. **User Authentication**
   - Individual progress tracking
   - Login/signup system
   - Personal learning dashboard

2. **Advanced Statistics**
   - Learning streaks
   - Time spent studying
   - Accuracy rates
   - Weak areas identification

3. **Smart Review System**
   - Only show due cards
   - Prioritize difficult cards
   - Adaptive scheduling

4. **Achievements**
   - Badges for milestones
   - Completion certificates
   - Leaderboards

5. **Study Reminders**
   - Email notifications
   - Due card alerts
   - Study streak tracking

## Troubleshooting

### Progress Not Showing
- Check browser console for errors
- Verify server is running: `pm2 status`
- Check API responses in Network tab
- Ensure userId is consistent

### Progress Not Updating
- Verify card rating is being sent
- Check server logs: `pm2 logs reaction-server`
- Ensure database connection is active
- Try clearing browser cache

### Progress Reset
- Check if userId changed
- Verify database has progress records
- Check for errors in progress save

## Summary

The flashcard system now provides:
- ✅ Real-time progress tracking
- ✅ Visual progress indicators
- ✅ Self-assessment system
- ✅ Spaced repetition algorithm
- ✅ Color-coded feedback
- ✅ Motivational completion stats

Users can now see their learning progress and the system adapts to their performance for optimal retention!
