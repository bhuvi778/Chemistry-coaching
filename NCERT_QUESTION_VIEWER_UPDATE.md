# NCERT Question Viewer - One-by-One Display Update

## Summary
Updated the NCERT Question Viewer to display questions **one by one** instead of showing all questions at once. This matches the UI pattern used in the NCERT Line by Line feature.

## Changes Made

### File: `/www/wwwroot/reaction-lab/src/pages/NCERTQuestionViewer.jsx`

#### 1. Added State for Current Question Index
- Added `currentQuestionIndex` state to track which question is currently being displayed
- Initialized to `0` to show the first question by default

#### 2. Added Navigation Functions
- **`handleNextQuestion()`**: Moves to the next question and scrolls to top
- **`handlePreviousQuestion()`**: Moves to the previous question and scrolls to top
- Both functions include smooth scrolling for better UX

#### 3. Updated Question Display Logic
- Changed from `questions.map()` (showing all questions) to displaying only the current question
- Used an IIFE (Immediately Invoked Function Expression) to render the single question
- Maintained all existing functionality (answer selection, submission, feedback, hints, solutions)

#### 4. Added Navigation Controls
- **Previous Button**: Disabled when on the first question
- **Next Button**: Disabled when on the last question
- **Progress Indicator**: Shows "X / Y" format (e.g., "1 / 10")
- Styled with appropriate colors and hover effects

## Features

### Question Flow
1. User sees only one question at a time
2. User selects an answer and submits
3. Feedback is shown (correct/incorrect)
4. User can view hints, solutions, or retry
5. User clicks "Next" to move to the next question
6. Process repeats for all questions

### Navigation
- **Previous/Next buttons** for manual navigation
- **Progress counter** shows current position
- **Smooth scrolling** when changing questions
- **Disabled states** for buttons at boundaries

### Applies To
This update affects all NCERT question tabs:
- ✅ NCERT Questions (Questions tab)
- ✅ NCERT Exemplars (Exemplars tab)
- ✅ Diagram Based Questions (Diagrams tab)

**Note**: NCERT Line by Line already had this one-by-one pattern and remains unchanged.

## UI/UX Benefits
1. **Focused Learning**: Students concentrate on one question at a time
2. **Less Overwhelming**: No long scrolling through multiple questions
3. **Clear Progress**: Visual indicator shows how many questions remain
4. **Consistent Experience**: Matches the NCERT Line by Line UI pattern
5. **Better Mobile Experience**: Easier navigation on smaller screens

## Testing Recommendations
1. Navigate through all questions using Next/Previous buttons
2. Verify answer submission and feedback work correctly
3. Test retry functionality on incorrect answers
4. Confirm hints and solutions display properly
5. Check that progress counter updates correctly
6. Test on mobile devices for responsive behavior
