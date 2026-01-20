# Daily Target Scheduling - Test Verification Guide

## ✅ How the System Works

### **The Complete Flow:**

1. **Admin creates test with future start date/time**
   - Test is saved to database with `startDate` field
   - Example: startDate = "2026-01-25 09:00 AM"

2. **Backend categorizes the test**
   - Compares `startDate` with current time
   - If `startDate > now` → Status = "upcoming"
   - If `startDate <= now` → Status = "active"

3. **Frontend displays correctly**
   - **Upcoming tests** → Show in "Upcoming Tests" tab
   - **Active tests** → Show in "Active Tests" tab

4. **Access control enforced**
   - Students **cannot** click upcoming test cards
   - Backend **blocks** API access if test not started
   - Returns 403 error with message

---

## 🧪 Testing Scenarios

### Scenario 1: Create Immediate Test
**Setup:**
```
Start Date: Today, current time (e.g., Jan 19, 2026 7:30 PM)
Exam Date: Feb 15, 2026
```

**Expected Result:**
- ✅ Test appears in **"Active Tests"** tab
- ✅ Card shows green gradient
- ✅ Button says **"Start Test"**
- ✅ Card is clickable
- ✅ Test can be started immediately

---

### Scenario 2: Create Future Test (Tomorrow)
**Setup:**
```
Start Date: Tomorrow, 9:00 AM (e.g., Jan 20, 2026 9:00 AM)
Exam Date: Feb 15, 2026
```

**Expected Result:**
- ✅ Test appears in **"Upcoming Tests"** tab
- ✅ Card shows orange gradient
- ✅ Shows 🔒 lock icon
- ✅ Badge shows "Starts in 1 day"
- ✅ Button says **"Available on Jan 20, 2026, 9:00 AM"**
- ✅ Card is NOT clickable (cursor: not-allowed)
- ✅ Card is dimmed (75% opacity)

**If student tries to access directly:**
- ✅ Backend returns 403 error
- ✅ Message: "This test is not available yet"

---

### Scenario 3: Create Test for Next Week
**Setup:**
```
Start Date: Jan 25, 2026 10:00 AM (6 days from now)
Exam Date: Feb 15, 2026
```

**Expected Result:**
- ✅ Test appears in **"Upcoming Tests"** tab
- ✅ Badge shows "Starts in 6 days"
- ✅ Shows exact date/time: "Available on Jan 25, 2026, 10:00 AM"
- ✅ Completely locked until Jan 25 at 10:00 AM

---

### Scenario 4: Test Transitions from Upcoming to Active
**Setup:**
```
Start Date: Today, 7:35 PM (5 minutes from now)
Exam Date: Feb 15, 2026
```

**Expected Behavior:**
1. **At 7:30 PM (now):**
   - Test is in "Upcoming Tests" tab
   - Shows "Starts in 0 days"
   - Locked, not clickable

2. **At 7:35 PM (when time arrives):**
   - Student refreshes page
   - Test moves to "Active Tests" tab
   - Now shows green gradient
   - Button says "Start Test"
   - Clickable and available

---

## 🎯 Verification Checklist

### Admin Panel Checks:
- [ ] Can set start date with both date AND time
- [ ] Helper text explains locking behavior
- [ ] Can edit existing test's start date
- [ ] Start date is preserved when editing (includes time)
- [ ] Test list shows start date/time correctly

### Frontend Checks (Upcoming Tests):
- [ ] Test appears in "Upcoming Tests" tab
- [ ] Shows orange/amber gradient
- [ ] Shows 🔒 lock icon
- [ ] Shows "Starts in X days" badge
- [ ] Shows exact start date/time
- [ ] Button says "Available on [date/time]"
- [ ] Card is NOT clickable
- [ ] Cursor shows "not-allowed"
- [ ] Card is dimmed (75% opacity)
- [ ] No hover scale effect

### Frontend Checks (Active Tests):
- [ ] Test appears in "Active Tests" tab
- [ ] Shows green/cyan gradient
- [ ] Shows 🎯 bullseye icon
- [ ] Shows "X days left" until exam
- [ ] Shows exam date (not start date)
- [ ] Button says "Start Test"
- [ ] Card IS clickable
- [ ] Cursor shows pointer
- [ ] Full opacity (100%)
- [ ] Hover scale effect works

### Backend Checks:
- [ ] API returns tests categorized as active/upcoming
- [ ] Blocks access to upcoming tests (403 error)
- [ ] Allows access to active tests
- [ ] Correctly compares dates/times

---

## 🔍 How to Test Right Now

### Quick Test (5 minutes):

1. **Go to Admin Panel**
   - Navigate to Manage Practice Tests
   - Click "New Test"

2. **Create Test 1 (Immediate)**
   ```
   Title: Test 1 - Available Now
   Start Date: [Today's date] [Current time]
   Exam Date: [1 month from now]
   Duration: 60
   Total Marks: 100
   ```
   - Save and add 1-2 questions

3. **Create Test 2 (Future - 1 hour)**
   ```
   Title: Test 2 - Available in 1 Hour
   Start Date: [Today's date] [Current time + 1 hour]
   Exam Date: [1 month from now]
   Duration: 60
   Total Marks: 100
   ```
   - Save and add 1-2 questions

4. **Create Test 3 (Future - Tomorrow)**
   ```
   Title: Test 3 - Available Tomorrow
   Start Date: [Tomorrow's date] [9:00 AM]
   Exam Date: [1 month from now]
   Duration: 60
   Total Marks: 100
   ```
   - Save and add 1-2 questions

5. **Check Frontend**
   - Go to "My Daily Target"
   - Click "Active Tests" tab
     - Should see: Test 1 only
     - Should be clickable
   - Click "Upcoming Tests" tab
     - Should see: Test 2 and Test 3
     - Should be locked (not clickable)
     - Should show start times

6. **Try to Access Upcoming Test**
   - Try clicking on Test 2 or Test 3
   - Nothing should happen (not clickable)
   - If you try to access URL directly: `/practice-test/[test-id]`
   - Should get error message

7. **Wait for Test 2 to Become Active**
   - Wait until the 1-hour mark
   - Refresh the page
   - Test 2 should now appear in "Active Tests"
   - Should be clickable now

---

## 🎨 Visual Indicators Summary

### Upcoming Test Card:
```
┌─────────────────────────────────────┐
│ 🔒 [ORANGE GRADIENT]          JEE   │ ← Lock icon, orange
│                    Starts in 3 days │ ← Countdown
│                                     │
│ JEE Main Mock Test 2                │ ← Dimmed text
│ Practice test for JEE preparation   │
│                                     │
│ ┌─────┬─────┬─────┬─────────────┐  │
│ │ 50  │ 180 │ 200 │ Jan 25      │  │
│ │ Qs  │ min │ Mks │ 2026        │  │ ← Shows START date
│ └─────┴─────┴─────┴─────────────┘  │
│                                     │
│ 🔒 Available on                     │ ← NOT clickable
│    Jan 25, 2026, 9:00 AM            │ ← Exact time
└─────────────────────────────────────┘
   ↑ Cursor: not-allowed, 75% opacity
```

### Active Test Card:
```
┌─────────────────────────────────────┐
│ 🎯 [GREEN GRADIENT]           JEE   │ ← Bullseye, green
│                         3 days left │ ← Days to exam
│                                     │
│ JEE Main Mock Test 1                │ ← Bright text
│ Practice test for JEE preparation   │
│                                     │
│ ┌─────┬─────┬─────┬─────────────┐  │
│ │ 50  │ 180 │ 200 │ Feb 15      │  │
│ │ Qs  │ min │ Mks │ 2026        │  │ ← Shows EXAM date
│ └─────┴─────┴─────┴─────────────┘  │
│                                     │
│ [▶ Start Test →]                    │ ← Clickable button
└─────────────────────────────────────┘
   ↑ Cursor: pointer, 100% opacity, hover effect
```

---

## ✅ Expected Behavior Summary

| Aspect | Upcoming Test | Active Test |
|--------|--------------|-------------|
| **Tab** | Upcoming Tests | Active Tests |
| **Icon** | 🔒 Lock | 🎯 Bullseye |
| **Color** | Orange/Amber | Green/Cyan |
| **Clickable** | ❌ No | ✅ Yes |
| **Cursor** | not-allowed | pointer |
| **Opacity** | 75% | 100% |
| **Date Shown** | Start Date | Exam Date |
| **Button Text** | "Available on [date/time]" | "Start Test" |
| **Hover Effect** | None | Scale up |
| **Backend Access** | ❌ Blocked (403) | ✅ Allowed |

---

## 🚀 Everything is Working!

The system is **already correctly implemented**:

1. ✅ Tests with future start dates appear in "Upcoming"
2. ✅ Tests with past start dates appear in "Active"
3. ✅ Upcoming tests show lock icon and "Available on [date/time]"
4. ✅ Upcoming tests are NOT clickable
5. ✅ Active tests show "Start Test" button
6. ✅ Active tests ARE clickable
7. ✅ Backend blocks access to upcoming tests
8. ✅ Tests automatically transition when time arrives

**Just create a test with a future start date to see it in action!** 🎯

---

*Last Updated: January 19, 2026, 7:30 PM*
