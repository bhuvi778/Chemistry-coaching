# Daily Target Scheduling - Quick Reference

## 🎯 What's New?

Your Daily Target Practice system now has **scheduling capabilities**! Create tests that become available at specific dates and times.

---

## ⚡ Quick Start

### For Admins - Create a Scheduled Test

1. Go to **Admin Panel** → **Manage Practice Tests**
2. Click **"New Test"**
3. Fill in the form:
   - **Title**: Name your test
   - **Exam Type**: Select target exam
   - **Start Date** ⭐: When test becomes available (Date + Time)
   - **Exam Date**: Target exam date
   - **Duration, Marks, etc.**: As usual
4. Click **"Create Test"**

**That's it!** The test will automatically:
- Appear in "Upcoming" until the start date/time
- Move to "Active" when the start date/time arrives
- Be locked for students until it's available

---

## 👀 What Students See

### Active Tests Tab
- ✅ Tests available NOW
- 🟢 Green gradient, unlocked icon
- 📝 Click to start test immediately

### Upcoming Tests Tab  
- ⏰ Tests scheduled for later
- 🟠 Orange gradient, locked icon
- 🔒 Cannot start until scheduled time
- Shows "Starts in X days" and exact date/time

---

## 💡 Common Scenarios

### Scenario 1: Daily Practice
```
Create 7 tests for the week
Set start dates:
- Monday 9:00 AM
- Tuesday 9:00 AM
- Wednesday 9:00 AM
... and so on
```

### Scenario 2: Weekend Mock Tests
```
Create monthly tests
Set start dates:
- Every Saturday 10:00 AM
- 4 tests total for the month
```

### Scenario 3: Immediate Test
```
Set start date to current date/time
Test appears in "Active" immediately
Works like before - no change!
```

---

## 🔑 Key Features

| Feature | Description |
|---------|-------------|
| **Auto-Categorization** | Tests automatically sorted into Active/Upcoming |
| **Real-time Updates** | Status changes when start time arrives |
| **Access Control** | Backend prevents early access attempts |
| **Visual Indicators** | Clear colors and icons show test status |
| **Countdown Display** | Shows days/time until test starts |
| **Exam Filters** | Work across both Active and Upcoming tabs |

---

## 📝 Admin Panel Changes

### New Field in Test Form
```
Start Date (When test becomes available) *
[Date and Time Picker]
💡 Test will appear in "Upcoming" until this date/time
```

### Test List Display
Now shows:
- 🎯 Questions count
- ⏱️ Duration
- ▶️ **Starts**: [Date & Time]
- 📅 **Exam**: [Date]

---

## 🎨 Visual Guide

### Active Test Card
```
┌─────────────────────────────┐
│ 🎯  [Green Gradient]   JEE  │
│                     3 days  │
│                             │
│ JEE Main Mock Test 1        │
│ Practice for upcoming exam  │
│                             │
│ ┌─────┬─────┬─────┬─────┐  │
│ │ 50  │ 180 │ 200 │ Feb │  │
│ │ Qs  │ min │ Mks │ 15  │  │
│ └─────┴─────┴─────┴─────┘  │
│                             │
│ [▶ Start Test →]            │
└─────────────────────────────┘
```

### Upcoming Test Card
```
┌─────────────────────────────┐
│ 🔒  [Orange Gradient]  JEE  │
│              Starts in 5    │
│                    days     │
│ JEE Main Mock Test 2        │
│ Practice for upcoming exam  │
│                             │
│ ┌─────┬─────┬─────┬─────┐  │
│ │ 50  │ 180 │ 200 │ Jan │  │
│ │ Qs  │ min │ Mks │ 25  │  │
│ └─────┴─────┴─────┴─────┘  │
│                             │
│ 🔒 Available on Jan 25, 9AM │
└─────────────────────────────┘
```

---

## ✅ Implementation Checklist

- [x] Backend model updated with `startDate` field
- [x] API returns tests categorized as active/upcoming
- [x] Access control prevents early test access
- [x] Frontend displays Active/Upcoming tabs
- [x] Visual indicators (colors, icons, badges)
- [x] Admin panel includes start date field
- [x] Countdown and status displays
- [x] Backward compatible with existing tests

---

## 🚀 Next Steps

1. **Restart your server** (if not done already)
2. **Go to Admin Panel** → Manage Practice Tests
3. **Create a test** with a future start date
4. **Check frontend** to see it in "Upcoming"
5. **Wait for start time** or change it to now to test

---

## 📚 Full Documentation

For detailed information, see: `DAILY_TARGET_SCHEDULING_GUIDE.md`

---

## 🎉 Benefits

✨ **Better Organization**: Clear separation of current and future tests
✨ **Student Planning**: Know when tests become available  
✨ **Motivation**: Countdown creates urgency
✨ **Flexibility**: Easy to schedule test series
✨ **Professional**: Modern scheduling like real exam platforms

**Your Daily Target Practice is now even more powerful!** 🚀
