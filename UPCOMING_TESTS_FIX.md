# Daily Target - Upcoming Tests Issue & Resolution

## Problem Identified
The "Upcoming Tests" tab was empty because the existing practice tests in the database were created **before** the `startDate` field was added to the schema. 

### Root Cause
- The `PracticeTest` model has `startDate` with a default value of `Date.now`
- **However**, this default only applies to NEW documents being created
- Existing documents in the database did NOT have the `startDate` field at all
- Without `startDate`, the backend logic couldn't determine if a test was "upcoming" or "active"

## Solution Applied

### 1. Updated Existing Tests
Added `startDate` field to all existing tests that were missing it:
```javascript
db.practicetests.updateMany(
  {startDate: {$exists: false}}, 
  {$set: {startDate: new Date()}}
)
```
**Result**: 3 tests updated with current date as startDate (making them "active")

### 2. Created Sample Upcoming Tests
Added 2 new tests with future startDates to demonstrate the "Upcoming" functionality:

#### Test 1: JEE Advanced Mock Test - Coming Soon
- **Start Date**: 2026-01-22 10:00 UTC (2 days from now)
- **Exam Date**: 2026-02-28
- **Status**: UPCOMING
- **Questions**: 2 questions added

#### Test 2: NEET Practice Test - Upcoming
- **Start Date**: 2026-01-25 08:00 UTC (5 days from now)
- **Exam Date**: 2026-03-05
- **Status**: UPCOMING
- **Questions**: 1 question added

## Current Test Distribution

### Active Tests (3)
1. JEE Main Mock Test - Physical Chemistry
2. JEE Main Mock Test - Organic Chemistry
3. NEET Main Mock Test - Inorganic Chemistry

### Upcoming Tests (2)
1. JEE Advanced Mock Test - Coming Soon (starts in ~2 days)
2. NEET Practice Test - Upcoming (starts in ~5 days)

## How to Create Upcoming Tests in Admin Panel

When creating a new test in the admin panel, make sure to:

1. **Set Start Date**: Choose a future date/time when the test should become available
2. **Set Exam Date**: Choose a date after the start date (when the test period ends)
3. **Add Questions**: Tests need questions to display properly
4. **Set isActive**: Keep this as `true` (this just means the test is published, not necessarily available)

### Example Timeline
```
Current Time: 2026-01-20 06:00
├─ Start Date: 2026-01-22 10:00  ← Test appears in "Upcoming"
├─ [Test becomes available]       ← Test moves to "Active"
├─ Exam Date: 2026-02-28 00:00   ← Test disappears (completed)
```

## Verification

You can verify the test categorization with this MongoDB query:
```javascript
const now = new Date();
db.practicetests.find({}).forEach(test => {
  const start = new Date(test.startDate);
  const exam = new Date(test.examDate);
  let status;
  if (now < start) status = 'UPCOMING';
  else if (now >= start && now < exam) status = 'ACTIVE';
  else status = 'COMPLETED';
  console.log(test.title, '→', status);
});
```

## Important Notes

⚠️ **For Future Migrations**: If you ever reset or import test data, make sure all tests have a `startDate` field, otherwise they won't appear in either tab.

✅ **Backend Logic**: The categorization happens in `practiceTestController.js` → `getAllTests()` function

✅ **Frontend Display**: The tabs and countdown timers are in `MyDailyTarget.jsx`

## Testing the Fix

1. **Visit the Daily Target page**
2. **Click "Active Tests" tab**: Should see 3 tests (available now)
3. **Click "Upcoming Tests" tab**: Should see 2 tests with countdown timers
4. **Try clicking an upcoming test**: Should show "locked" state with availability date
5. **Wait for countdown**: When startDate arrives, test automatically moves to "Active" tab

The system is now working correctly! 🎉
