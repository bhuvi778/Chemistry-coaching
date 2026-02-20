# NCERT Question Viewer - Auto-Advance Update

## Summary
Updated the NCERT Question Viewer to **auto-advance to the next question** when users click on difficulty rating buttons (Hard/Medium/Easy). The progress bar now shows question progress and updates in real-time.

## Changes Made

### File: `/www/wwwroot/reaction-lab/src/pages/NCERTQuestionViewer.jsx`

#### 1. Added Auto-Advance Function
- **`handleDifficultyRating(difficulty)`**: New function that:
  - Logs the difficulty rating (can be saved to backend)
  - Auto-advances to the next question
  - Shows completion message on the last question

#### 2. Updated Progress Bar
- **Always visible** (not conditional)
- Shows **question progress**: "X / Y" format (e.g., "3 / 10")
- Progress bar fills based on current question position
- Bottom text shows: "X answered · Y correct"
- Updates in real-time as user progresses

#### 3. Updated Difficulty Rating Buttons
- **Hard, Medium, Easy buttons** now have `onClick` handlers
- Clicking any of these buttons advances to the next question
- **Retry button** does NOT advance (allows user to retry the same question)

#### 4. Removed Navigation Buttons
- Removed Previous/Next button section
- Questions now advance automatically via difficulty rating
- Cleaner, more streamlined interface

#### 5. Added Completion Message
- When user rates the last question, shows congratulations alert
- Displays final score: "X/Y correct"

## User Flow

### Question Answering Flow:
1. **View Question** - User sees current question (e.g., "1 / 10")
2. **Select Answer** - User picks an option
3. **Submit** - User clicks "Submit Answer"
4. **Get Feedback** - See if answer is correct/incorrect
5. **Rate Difficulty** - Click Hard/Medium/Easy button
6. **Auto-Advance** - Next question appears automatically
7. **Repeat** - Continue until all questions completed

### Special Cases:
- **Wrong Answer + Retry**: Clicking "Retry" does NOT advance, allows re-attempting
- **Last Question**: After rating, shows completion message with final score
- **Progress Bar**: Updates immediately when moving to next question

## Features

### ✅ Auto-Advance
- Click **Hard/Medium/Easy** → Next question appears
- No need for separate "Next" button
- Smooth, seamless experience

### ✅ Real-Time Progress
- Progress bar always visible
- Shows current position: "3 / 10"
- Visual bar fills as you progress
- Shows answered count and correct count

### ✅ Retry Functionality
- **Retry button** (only on wrong answers) does NOT advance
- Allows user to try the same question again
- Other buttons advance normally

### ✅ Completion Tracking
- Tracks which questions are answered
- Tracks which answers are correct
- Shows final score at completion

## UI Elements

### Progress Bar (Top Right)
```
┌─────────────────────────────┐
│ Question Progress      3/10 │
│ ████████░░░░░░░░░░░░░░░░░░ │
│ 3 answered · 2 correct      │
└─────────────────────────────┘
```

### Difficulty Rating Buttons
```
[Retry] [Hard] [Medium] [Easy]
  ↑       ↓       ↓       ↓
  │       └───────┴───────┘
  │              │
  │         Auto-advance
  │         to next Q
  │
  No advance
  (retry same Q)
```

## Applies To
This update affects all NCERT question tabs:
- ✅ **NCERT Questions** tab
- ✅ **NCERT Exemplars** tab
- ✅ **Diagram Based Questions** tab

## Benefits

1. **Faster Navigation**: No need to click separate "Next" button
2. **Natural Flow**: Rating difficulty feels like natural progression
3. **Clear Progress**: Always see where you are in the question set
4. **Less Clicks**: One action (rating) does two things (feedback + navigation)
5. **Better UX**: Matches flashcard-style learning patterns

## Technical Details

### State Management
- `currentQuestionIndex`: Tracks which question is displayed
- `submittedQuestions`: Set of answered question IDs
- Progress bar calculates: `(currentIndex + 1) / totalQuestions * 100`

### Auto-Advance Logic
```javascript
handleDifficultyRating(difficulty) {
  if (isLastQuestion) {
    showCompletionMessage();
  } else {
    moveToNextQuestion();
  }
}
```

### Progress Calculation
- **Question Progress**: Based on `currentQuestionIndex`
- **Answered Count**: Based on `submittedQuestions.size`
- **Correct Count**: Based on correct answers in `submittedQuestions`

## Testing Checklist
- [x] Build completes successfully
- [ ] Progress bar shows correct position
- [ ] Hard/Medium/Easy buttons advance to next question
- [ ] Retry button does NOT advance
- [ ] Progress bar updates when advancing
- [ ] Completion message shows on last question
- [ ] Final score is accurate
- [ ] Works on all three tabs (Questions, Exemplars, Diagrams)

## Future Enhancements (Optional)
- Save difficulty ratings to backend for spaced repetition
- Add keyboard shortcuts (1=Hard, 2=Medium, 3=Easy)
- Add option to review all questions at the end
- Show detailed analytics after completion
