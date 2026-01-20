# Daily Target Practice - Scheduling Feature Guide

## 🎯 Overview

The Daily Target Practice system now includes **scheduling functionality** that allows you to create tests that become available at specific dates and times. Tests are automatically categorized as **Active** (available now) or **Upcoming** (scheduled for future).

---

## ✨ New Features

### 1. **Test Scheduling**
- Set a **Start Date & Time** when creating or editing tests
- Tests automatically appear in "Upcoming" until their start date/time
- Tests move to "Active" when their start date/time arrives
- Real-time status updates based on current date/time

### 2. **Tabbed Interface**
- **Active Tests Tab**: Shows tests that are currently available to take
- **Upcoming Tests Tab**: Shows tests scheduled for the future
- Tab badges show count of tests in each category
- Filters work across both tabs

### 3. **Visual Indicators**
- **Active Tests**: Green/cyan gradient, unlocked icon, "Start Test" button
- **Upcoming Tests**: Amber/orange gradient, locked icon, countdown display
- Clear visual distinction between available and scheduled tests

### 4. **Smart Access Control**
- Students cannot access tests before their scheduled start time
- Backend validation prevents premature test access
- Friendly error messages for early access attempts

---

## 🎮 How to Use (Admin)

### Creating a Scheduled Test

1. **Navigate to Admin Panel**
   - Go to `/admin`
   - Click on **"Manage Practice Tests"**

2. **Create New Test**
   - Click **"New Test"** button
   - Fill in the test details:

#### Required Fields:

**Title**: Name of the test
```
Example: "JEE Main Mock Test - Week 1"
```

**Exam Type**: Select from dropdown
```
Options: NEET, JEE, IAT, NEST, CUET UG, BITSAT, IIT JAM, CUET PG, 
         CSIR NET, GATE, TIFR, PSTET, Master Cadre, UPSC Mains, 
         Foundation, All
```

**Start Date** ⭐ NEW
```
When the test becomes available to students
Format: Date and Time picker
Example: 2026-01-25 09:00 AM

💡 Tip: Test will appear in "Upcoming" until this date/time
```

**Exam Date**
```
Target exam date (for countdown display)
Format: Date picker
Example: 2026-02-15
```

**Duration**: Time limit in minutes
```
Example: 180 (for 3 hours)
```

**Total Marks**: Maximum score
```
Example: 300
```

**Passing Marks**: Minimum score to pass
```
Example: 120
```

3. **Click "Create Test"**

### Scheduling Examples

#### Example 1: Immediate Test
```
Start Date: Today, current time
Exam Date: 30 days from now
→ Test appears in "Active" immediately
```

#### Example 2: Weekly Test Series
```
Test 1 - Start Date: Monday 9:00 AM
Test 2 - Start Date: Wednesday 9:00 AM  
Test 3 - Start Date: Friday 9:00 AM
→ Tests appear in "Upcoming" until their scheduled time
```

#### Example 3: Month-Long Preparation
```
Start Date: January 20, 2026 - 6:00 AM
Exam Date: February 20, 2026
→ Test becomes available on Jan 20 at 6 AM
→ Shows "30 days left" countdown
```

---

## 👨‍🎓 How It Works (Student View)

### Viewing Tests

1. **Navigate to My Daily Target**
   - Click on **"My Daily Target"** from main menu

2. **Select Exam Type** (Optional)
   - Filter by your target exam (NEET, JEE, etc.)
   - Or view "All Exams"

3. **Switch Between Tabs**
   - **Active Tests**: Tests you can take right now
   - **Upcoming Tests**: Tests scheduled for later

### Active Tests

**Visual Appearance:**
- 🟢 Green/Cyan gradient background
- 🎯 Bullseye icon
- ✅ "Start Test" button (clickable)
- 📊 Shows days until exam date

**Actions:**
- Click anywhere on the card to start the test
- View test details (questions, duration, marks)
- Take the test immediately

### Upcoming Tests

**Visual Appearance:**
- 🟠 Amber/Orange gradient background
- 🔒 Lock icon
- ⏰ "Starts in X days" badge
- 🚫 Grayed out, non-clickable
- 📅 Shows exact start date/time

**Information Displayed:**
- When the test will become available
- All test details (questions, duration, marks)
- Cannot start until scheduled time

**Example Display:**
```
🔒 JEE Main Mock Test 1
   Starts in 3 days
   Available on: Jan 25, 2026, 9:00 AM
```

---

## 🔧 Technical Details

### Database Schema

**PracticeTest Model** - New Field:
```javascript
{
  startDate: {
    type: Date,
    required: true,
    default: Date.now  // Immediate availability by default
  }
}
```

### API Response

**GET /api/practice-tests/tests**
```json
{
  "active": [
    {
      "_id": "...",
      "title": "Available Test",
      "startDate": "2026-01-15T09:00:00Z",
      "status": "active",
      ...
    }
  ],
  "upcoming": [
    {
      "_id": "...",
      "title": "Scheduled Test",
      "startDate": "2026-01-25T09:00:00Z",
      "status": "upcoming",
      ...
    }
  ]
}
```

### Access Control

**Backend Validation:**
```javascript
// In getTestById controller
if (new Date(test.startDate) > new Date()) {
  return res.status(403).json({ 
    message: 'This test is not available yet',
    startDate: test.startDate,
    status: 'upcoming'
  });
}
```

---

## 📊 Use Cases

### 1. Daily Practice Series
```
Create 30 tests, one for each day of the month
Each test starts at 6:00 AM on its designated day
Students get a new test every morning
```

### 2. Weekly Mock Tests
```
Create 4 tests for the month
Schedule for every Saturday at 10:00 AM
Students can plan their weekend practice
```

### 3. Countdown to Exam
```
Create progressive difficulty tests
Schedule them leading up to the actual exam
Final test starts 1 day before exam
```

### 4. Batch-Specific Tests
```
Different batches get access at different times
Morning batch: 9:00 AM
Evening batch: 5:00 PM
Same test, different start times
```

---

## 🎨 UI/UX Features

### Color Coding
- **Active**: Green (#10b981) → Cyan (#06b6d4)
- **Upcoming**: Amber (#f59e0b) → Orange (#f97316)

### Icons
- **Active**: `fa-bullseye` (target icon)
- **Upcoming**: `fa-lock` (locked icon)
- **Start Date**: `fa-play-circle`
- **Exam Date**: `fa-calendar`

### Animations
- Hover effects on active tests (scale up)
- No hover on upcoming tests (cursor: not-allowed)
- Smooth tab transitions
- Badge count updates

---

## 🚀 Best Practices

### For Admins

1. **Set Realistic Start Times**
   - Consider student time zones
   - Avoid midnight or very early morning times
   - Give students enough time to complete

2. **Plan Ahead**
   - Create tests in advance
   - Schedule a series for consistent practice
   - Update start dates if plans change

3. **Clear Naming**
   - Include date or week number in title
   - Example: "Week 1 - Organic Chemistry"
   - Helps students track progress

4. **Test Your Schedule**
   - Create a test with near-future start date
   - Verify it appears in "Upcoming"
   - Check it moves to "Active" at scheduled time

### For Students

1. **Check Upcoming Tests**
   - Plan your study schedule
   - Know when new tests become available
   - Set reminders for important tests

2. **Use Filters**
   - Focus on your target exam
   - Reduce clutter from other exam types
   - Find relevant tests quickly

---

## 🔍 Troubleshooting

### Test Not Appearing in Active

**Problem**: Test is past start date but still in "Upcoming"

**Solutions**:
1. Refresh the page (F5)
2. Check if start date/time is correct in admin panel
3. Verify server time is correct
4. Clear browser cache

### Cannot Edit Start Date

**Problem**: Start date field is not editable

**Solutions**:
1. Click "Edit" button on the test
2. Ensure you're in edit mode (modal should say "Edit Test")
3. Check admin permissions

### Students See Different Status

**Problem**: Admin sees "Active" but student sees "Upcoming"

**Solutions**:
1. Check server time vs local time
2. Ensure database has correct timezone
3. Verify student's browser time is correct

---

## 📝 Migration Notes

### Existing Tests

All existing tests without a `startDate` will:
- Automatically get `startDate = Date.now()` (current time)
- Appear in "Active" tests immediately
- Work exactly as before

### No Breaking Changes

- All existing functionality preserved
- Backward compatible with old data
- No action required for existing tests

---

## 🎉 Summary

The scheduling feature transforms Daily Target Practice into a powerful tool for:

✅ **Structured Learning**: Plan test series in advance
✅ **Time Management**: Students know when tests are available
✅ **Motivation**: Countdown creates urgency
✅ **Organization**: Clear separation of current and future tests
✅ **Flexibility**: Easy to reschedule or adjust timing

**Start scheduling your tests today and help students prepare more effectively!**

---

## 📞 Need Help?

If you need assistance with:
- Setting up scheduled tests
- Customizing the scheduling logic
- Adding more features
- Troubleshooting issues

Just let me know! 🚀
