# Subject Structure Implementation Plan

## Date: 2026-02-10

## Overview
Implementing a comprehensive subject structure update across the entire application with standardized chemistry subject categories.

---

## 1. Subject Categories (Mandatory)

### New Standard Subjects:
1. **Physical Chemistry**
2. **Inorganic Chemistry**
3. **Organic Chemistry**
4. **Practical**

### Display Labels (Frontend Tags):
- Physical
- Inorganic
- Organic
- Practical

---

## 2. Implementation Scope

### Backend Changes:

#### A. Database Models to Update:
1. ✅ `PYQChapter.js` - Update subject enum
2. ✅ `PYQQuestion.js` - Update subject enum
3. ✅ `DPPSChapter.js` - Update subject enum
4. ✅ `NCERTChapter.js` - Add subject field
5. ✅ `NCERTTopic.js` - Add subject field
6. ✅ `NCERTQuestion.js` - Add subject field
7. ✅ `FlashCardChapter.js` - Update subject enum
8. ✅ `ConceptChapter.js` - Update subject enum
9. ✅ `ConceptNote.js` - Update subject enum
10. ✅ `FreeQuiz.js` - Update subject enum
11. ✅ `AssertionReasonChapter.js` - Add subject field

#### B. API Routes to Update:
1. ✅ `pyqRoutes.js` - Add subject filtering
2. ✅ `dppsRoutes.js` - Add subject filtering
3. ✅ `ncertRoutes.js` - Add subject filtering
4. ✅ `flashCardRoutes.js` - Add subject filtering
5. ✅ `conceptRoutes.js` - Add subject filtering

### Frontend Changes:

#### A. Subject Pill Tabs Component:
Create reusable `SubjectTabs.jsx` component with:
- Pill-style design
- Active state highlighting
- Click handlers
- Responsive layout

#### B. Pages to Update:
1. ✅ `PYQChapterList.jsx` - Add subject tabs
2. ✅ `PYQTopicList.jsx` - Show subject tags
3. ✅ `DPPS.jsx` - Add subject tabs
4. ✅ `NCERTLineByLine.jsx` - Add subject tabs
5. ✅ `NCERTQuestions.jsx` - Add subject tabs
6. ✅ `NCERTExemplars.jsx` - Add subject tabs
7. ✅ `FlashCards.jsx` - Add subject tabs
8. ✅ `ConceptWiseNotes.jsx` - Add subject tabs

#### C. Search Integration:
- Update search to work with subject filters
- Combine subject + search query
- Clear subject when needed

---

## 3. Database Migration Strategy

### Option 1: Update Existing Data (Recommended)
```javascript
// Migration script to update existing records
// Map old subjects to new subjects
const subjectMapping = {
  'Chemistry': 'Physical Chemistry', // Default mapping
  'Physics': null, // Keep as is (not chemistry)
  'Biology': null, // Keep as is (not chemistry)
  'Mathematics': null // Keep as is (not chemistry)
};
```

### Option 2: Keep Both (Backward Compatible)
- Keep old subject field for non-chemistry subjects
- Add new chemistry-specific subject field
- Frontend decides which to use based on context

---

## 4. UI Design Specifications

### Subject Pills Design:
```css
/* Active Pill */
.subject-pill-active {
  background: linear-gradient(to-r, cyan-500, blue-500);
  color: white;
  shadow: cyan-500/50;
}

/* Inactive Pill */
.subject-pill-inactive {
  background: gray-800;
  color: gray-400;
  border: gray-700;
}
```

### Subject Tags (Flash Card Style):
```css
.subject-tag {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.subject-tag-physical {
  background: purple-500/20;
  color: purple-400;
  border: purple-500/30;
}

.subject-tag-inorganic {
  background: green-500/20;
  color: green-400;
  border: green-500/30;
}

.subject-tag-organic {
  background: orange-500/20;
  color: orange-400;
  border: orange-500/30;
}

.subject-tag-practical {
  background: blue-500/20;
  color: blue-400;
  border: blue-500/30;
}
```

---

## 5. Implementation Steps

### Phase 1: Backend Models ✅
1. Update all model schemas with new subject enum
2. Add migration script for existing data
3. Test model updates

### Phase 2: Backend APIs ✅
1. Update routes to accept subject parameter
2. Add subject filtering logic
3. Update response formatting
4. Test API endpoints

### Phase 3: Frontend Components ✅
1. Create SubjectTabs component
2. Create SubjectTag component
3. Add to component library

### Phase 4: Frontend Integration ✅
1. Add subject tabs to all relevant pages
2. Implement subject filtering
3. Integrate with search
4. Test user flows

### Phase 5: Testing & Deployment ✅
1. Test all subject filters
2. Test search + subject combination
3. Test on production
4. Monitor for issues

---

## 6. API Specifications

### Subject Filter Parameter:
```
GET /api/pyq/chapters?subject=Physical Chemistry
GET /api/dpps/chapters?subject=Organic Chemistry
GET /api/ncert/chapters?subject=Inorganic Chemistry&category=line-by-line
```

### Search + Subject:
```
GET /api/pyq/chapters?subject=Physical Chemistry&search=thermodynamics
GET /api/ncert/questions?subject=Organic Chemistry&search=benzene
```

### Response Format:
```json
{
  "_id": "...",
  "chapterName": "...",
  "subject": "Physical Chemistry",
  "subjectTag": "Physical",
  "subjectColor": "purple",
  ...
}
```

---

## 7. Frontend State Management

### Subject State:
```javascript
const [selectedSubject, setSelectedSubject] = useState('');
const [searchQuery, setSearchQuery] = useState('');

// Filter data
const filteredData = data.filter(item => {
  const matchesSubject = !selectedSubject || item.subject === selectedSubject;
  const matchesSearch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
  return matchesSubject && matchesSearch;
});
```

---

## 8. Validation Rules

### Backend Validation:
- Subject must be one of the 4 chemistry categories
- Subject is required for chemistry-related content
- Subject can be empty/null for non-chemistry content

### Frontend Validation:
- Only show chemistry subjects for chemistry modules
- Don't show subject filter for non-chemistry content
- Clear subject when switching modules

---

## 9. Backward Compatibility

### Handling Old Data:
1. Old records without subject → Show in "All" view
2. Old subject values → Map to new values via migration
3. API accepts both old and new subject values → Normalize internally

### Deprecation Plan:
1. Phase 1: Add new subject field (optional)
2. Phase 2: Migrate data to new field
3. Phase 3: Make new field required
4. Phase 4: Remove old field

---

## 10. Testing Checklist

### Backend Tests:
- [ ] Subject filtering works correctly
- [ ] Search + subject combination works
- [ ] Invalid subject values are rejected
- [ ] Empty subject is handled correctly

### Frontend Tests:
- [ ] Subject pills render correctly
- [ ] Active pill is highlighted
- [ ] Clicking pill filters data
- [ ] Search works with subject filter
- [ ] Subject tags display correctly
- [ ] Mobile responsive layout works

### Integration Tests:
- [ ] End-to-end subject filtering
- [ ] Search + filter combination
- [ ] Navigation between subjects
- [ ] Data consistency across pages

---

## 11. Documentation Updates

### API Documentation:
- Update API docs with subject parameter
- Add examples for subject filtering
- Document subject enum values

### User Documentation:
- Explain subject categories
- Show how to filter by subject
- Demonstrate search + subject

---

## 12. Rollout Plan

### Stage 1: Development
- Implement all changes in dev environment
- Test thoroughly

### Stage 2: Staging
- Deploy to staging
- User acceptance testing
- Fix any issues

### Stage 3: Production
- Deploy to production
- Monitor for errors
- Gather user feedback

---

## Status: 🚀 READY TO IMPLEMENT

All planning complete. Ready to execute implementation.
