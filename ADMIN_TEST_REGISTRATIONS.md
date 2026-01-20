# Admin Panel - Test Registrations Viewer

## Overview
Created a comprehensive admin panel page to view all test registrations with complete user details and test scores.

## Location
**Admin Dashboard → Test Registrations**

Navigate to: `/admin` → Login → Click "Test Registrations" in sidebar

## Features

### 📊 **Statistics Dashboard**
Three key metrics displayed at the top:
- **Total Registrations**: Total number of users registered
- **Attempted**: Users who completed the test
- **Not Attempted**: Users who registered but haven't taken the test yet

### 🔍 **Filtering & Search**
1. **Filter by Test**: Dropdown to view registrations for specific tests
2. **Search**: Real-time search across:
   - User name
   - Email address
   - Mobile number
   - Test title

### 📥 **Export Functionality**
- **Export to CSV** button
- Downloads all filtered registrations
- Includes: Name, Email, Mobile, Test, Registration Date, Attempt Status, Attempt Date

### 📋 **Registration Table**

Displays comprehensive information in a sortable table:

#### **Columns:**

1. **User Details**
   - Full Name
   - Email Address (with icon)
   - Mobile Number (with icon)

2. **Test**
   - Test Title
   - Exam Type Badge (color-coded)

3. **Registered**
   - Date and time of registration

4. **Status**
   - ✅ **Attempted** (Green badge)
   - ⏰ **Pending** (Amber badge)

5. **Score** (NEW!)
   - **Marks**: e.g., "45/100"
   - **Percentage**: Color-coded
     - Green: ≥75%
     - Yellow: 50-74%
     - Red: <50%
   - **Time Taken**: e.g., "25m 30s"
   - Shows "-" if not attempted
   - Shows "No result found" if attempted but result missing

6. **Attempted At**
   - Date and time when test was completed
   - Shows "-" if not attempted

## API Endpoints Used

### Backend Routes:
```javascript
// Get all registrations (last 100)
GET /api/practice-tests/admin/registrations

// Get registrations for specific test
GET /api/practice-tests/admin/tests/:testId/registrations
```

### Response Format:
```json
[
  {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "mobile": "9876543210",
    "testId": {
      "_id": "...",
      "title": "JEE Practice Test 1",
      "examType": "JEE",
      "totalMarks": 100
    },
    "registeredAt": "2026-01-20T06:00:00.000Z",
    "hasAttempted": true,
    "attemptedAt": "2026-01-20T07:30:00.000Z",
    "result": {
      "marksObtained": 75,
      "totalMarks": 100,
      "percentage": 75.00,
      "timeTaken": 1530
    }
  }
]
```

## How It Works

### 1. **Data Fetching**
- On page load, fetches all registrations from backend
- Backend automatically includes test results for attempted tests
- Results are matched by testId

### 2. **Score Calculation**
- Backend fetches the latest `TestResult` for each registration
- Includes: marks obtained, total marks, percentage, time taken
- Only shown for users who have attempted the test

### 3. **Real-Time Updates**
- Refresh the page to see latest registrations
- New registrations appear automatically
- Scores update when users complete tests

## Use Cases

### 📈 **Track Engagement**
- See how many users registered vs attempted
- Identify drop-off rates
- Monitor test popularity

### 👥 **User Management**
- View complete user contact information
- Export for email campaigns
- Build contact database

### 📊 **Performance Analysis**
- See user scores at a glance
- Identify high/low performers
- Track completion rates

### 📧 **Follow-Up**
- Export pending users for reminder emails
- Contact users who didn't attempt
- Send congratulations to high scorers

## Visual Design

### **Color Coding:**
- 🔵 Blue: Test type badges
- 🟢 Green: Attempted status, high scores (≥75%)
- 🟡 Yellow: Medium scores (50-74%)
- 🔴 Red: Low scores (<50%)
- 🟠 Amber: Pending status

### **Layout:**
- Responsive table design
- Hover effects on rows
- Glassmorphism panels
- Gradient stat cards
- Icon-based UI

## Sample View

```
┌─────────────────────────────────────────────────────────────────────┐
│ Test Registrations                                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  [Total: 50]  [Attempted: 35]  [Not Attempted: 15]                  │
│                                                                       │
│  Filter: [All Tests ▼]  Search: [________]  [Export CSV]            │
│                                                                       │
│  User Details      │ Test         │ Status    │ Score      │ Time   │
│  ─────────────────────────────────────────────────────────────────  │
│  John Doe          │ JEE Test 1   │ ✅ Attempted │ 75/100    │ 25m   │
│  john@email.com    │ [JEE]        │            │ 75.00%    │       │
│  9876543210        │              │            │           │       │
│  ─────────────────────────────────────────────────────────────────  │
│  Jane Smith        │ NEET Test 2  │ ⏰ Pending  │ -         │ -     │
│  jane@email.com    │ [NEET]       │            │           │       │
│  9123456789        │              │            │           │       │
└─────────────────────────────────────────────────────────────────────┘
```

## Access Control

**Admin Only**: This page is only accessible to logged-in administrators through the admin dashboard.

## Benefits

✅ **Complete Visibility**: See all user registrations in one place
✅ **Performance Tracking**: Monitor user scores and completion
✅ **Data Export**: Download for external analysis
✅ **Contact Database**: Build marketing/communication lists
✅ **Engagement Metrics**: Track registration vs attempt rates
✅ **User Insights**: Understand user behavior and performance

## Future Enhancements (Optional)

1. **Email Integration**: Send emails directly from the panel
2. **Advanced Filters**: Filter by score range, date range
3. **Detailed Analytics**: Charts and graphs for trends
4. **Bulk Actions**: Select multiple users for actions
5. **Individual User View**: Click to see detailed user history
6. **Pagination**: Handle thousands of registrations
7. **Sort Options**: Sort by any column

The admin panel is now fully functional and ready to track all test registrations with scores! 🎉
