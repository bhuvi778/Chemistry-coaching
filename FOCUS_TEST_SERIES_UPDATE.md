# Focus Test Series Feature Update

## Summary
Added "Focus Test Series" as a new course category option throughout the application, including both frontend filtering and backend admin panel support.

## Changes Made

### 1. Frontend - AllCourses Page (`src/pages/AllCourses.jsx`)
- ✅ Added "Focus Test Series" option to mobile dropdown filter
- ✅ Added "Focus Test Series" button to desktop sidebar filter with bullseye icon
- ✅ Implemented URL query parameter support for direct navigation from navbar
- ✅ Added useEffect hook to automatically filter courses when navigating from navbar dropdown

**New Category:**
- **Value:** `focus-test-series`
- **Display Name:** Focus Test Series
- **Icon:** `fa-bullseye` (FontAwesome)

### 2. Backend - Admin Panel (`src/pages/Admin/ManageCourses.jsx`)
- ✅ Added "Focus Test Series" checkbox to Program Type Categories section
- ✅ Admins can now tag courses with the "focus-test-series" category
- ✅ Courses can have multiple categories including the new Focus Test Series option

### 3. Navigation - Navbar (`src/components/Layout/Navbar.jsx`)
- ✅ Converted simple "Courses" link to a dropdown menu (similar to Study Material)
- ✅ Added dropdown menu with the following options:
  - All Programs
  - Live Batch
  - Recorded Courses
  - Test Series
  - **Focus Test Series** (NEW)
  - 1-1 Tutoring
  - Mentorship

**Dropdown Features:**
- Hover to open/close
- Smooth animations
- Color-coded icons for each category
- Direct links with query parameters for filtering

## How It Works

### For Users:
1. Click "Courses" in the navbar to see the dropdown
2. Select "Focus Test Series" to view only focus test series courses
3. Or navigate to `/courses` and use the sidebar/mobile filter to select "Focus Test Series"

### For Admins:
1. Go to Admin Panel → Manage Courses
2. When adding/editing a course, check the "Focus Test Series" checkbox under "Program Type Categories"
3. Courses tagged with "focus-test-series" will appear when users filter by this category

## Category Filtering Logic
Courses are filtered using two dimensions:
1. **Exam Category** (JEE, NEET, IAT, NEST, CSIR NET, GATE, IIT JAM, TIFR)
2. **Program Type Categories** (Live Batch, Recorded, Test Series, Focus Test Series, etc.)

A course can belong to:
- One exam category (e.g., JEE)
- Multiple program type categories (e.g., both "test-series" and "focus-test-series")

## Technical Details

### URL Query Parameters
- Format: `/courses?category=focus-test-series`
- Automatically applied when clicking navbar dropdown options
- Preserved in browser history for back/forward navigation

### State Management
- Uses React hooks (useState, useEffect)
- URL parameters sync with component state
- Smooth transitions between category filters

## Icons Used
- **Focus Test Series:** `fa-bullseye` (pink color in navbar)
- **Test Series:** `fa-clipboard-check` (green color in navbar)
- **All Programs:** `fa-th-large` (cyan color)
- **Live Batch:** `fa-video` (blue color)
- **Recorded:** `fa-play-circle` (purple color)

## Testing Checklist
- [ ] Navbar dropdown opens/closes smoothly
- [ ] Clicking "Focus Test Series" in navbar navigates to filtered view
- [ ] Sidebar filter shows "Focus Test Series" option
- [ ] Mobile dropdown includes "Focus Test Series"
- [ ] Admin panel shows "Focus Test Series" checkbox
- [ ] Courses tagged with "focus-test-series" appear in filtered results
- [ ] URL parameters work correctly
- [ ] Multiple category selection works in admin panel
