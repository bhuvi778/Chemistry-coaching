# Exam Filter Update Script

This document lists all pages that need exam filter updates and their status.

## Pages with Exam Filters

### ✅ COMPLETED
1. **MyDailyTarget.jsx** - Filter buttons updated
2. **ManagePracticeTests.jsx** - Admin dropdown updated  
3. **ManageConceptNotes.jsx** - Admin dropdown updated
4. **ScoreMatchBatches.jsx** - Filter buttons updated
5. **Puzzle.jsx** - Dropdown updated

### 🔄 PENDING - Dropdown Filters
6. **FreeQuiz.jsx** - Needs dropdown update
7. **StudyMaterials.jsx** - Needs dropdown update
8. **ChemSnaps.jsx** - Needs dropdown update
9. **Lectures.jsx** - Needs dropdown update

### 🔄 PENDING - Admin Pages
10. **ManageFreeQuizzes.jsx** - Needs dropdown update
11. **ManageCrosswords.jsx** - Needs dropdown update
12. **ManageVideos.jsx** - Needs dropdown update
13. **ManageChemSnaps.jsx** - Needs dropdown update
14. **ManagePuzzleSets.jsx** - Needs dropdown update
15. **ManageStudyMaterials.jsx** - Needs dropdown update

## Standard Exam Dropdown Template

```jsx
<select
    value={selectedExam}
    onChange={(e) => setSelectedExam(e.target.value)}
    className="..."
>
    <option value="all">All Exams</option>
    <optgroup label="UG Entrance Exams">
        <option value="NEET">NEET</option>
        <option value="JEE">JEE</option>
        <option value="IAT">IAT</option>
        <option value="NEST">NEST</option>
        <option value="CUET UG">CUET UG</option>
        <option value="BITSAT">BITSAT</option>
    </optgroup>
    <optgroup label="PG Entrance Exams">
        <option value="IIT JAM">IIT JAM</option>
        <option value="CUET PG">CUET PG</option>
    </optgroup>
    <optgroup label="Research Level Exams">
        <option value="CSIR NET">CSIR NET</option>
        <option value="GATE">GATE</option>
        <option value="TIFR">TIFR</option>
    </optgroup>
    <optgroup label="Competitive Exams (Govt. Job)">
        <option value="PSTET">PSTET</option>
        <option value="Master Cadre">Master Cadre</option>
        <option value="UPSC - Mains (Chemistry)">UPSC - Mains (Chemistry)</option>
    </optgroup>
    <optgroup label="Legacy/Other">
        <option value="BOARDS">BOARDS</option>
        <option value="OLYMPIAD">OLYMPIAD</option>
        <option value="Foundation">Foundation</option>
    </optgroup>
</select>
```

## Notes
- All dropdowns should use optgroups for better organization
- Admin pages should include all categories
- Frontend pages may include legacy options for backward compatibility
- Maintain consistent ordering across all pages
