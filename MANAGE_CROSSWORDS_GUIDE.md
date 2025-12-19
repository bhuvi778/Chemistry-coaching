# Manage Crosswords - Admin Panel Guide

## Overview
Admin panel में अब एक separate **"Manage Crosswords"** option है sidebar में, जहाँ से आप directly crossword puzzles add, edit, और delete कर सकते हैं।

## How to Access

### Step 1: Login to Admin Panel
1. Navigate to `/admin`
2. Enter admin credentials
3. Click "Login"

### Step 2: Go to Manage Crosswords
1. In the sidebar, click **"Manage Crosswords"**
2. Icon: Grid icon (fa-th)
3. Color: Cyan background when active

## Adding a New Crossword

### Form Fields

#### 1. Title (Required)
**Example**: "JEE Advanced - Organic Chemistry Crossword"

#### 2. Description (Required)
**Example**: "Test your knowledge of SN1, SN2, E1, E2 reactions with 15 challenging clues"

#### 3. Chapter (Required)
**Example**: "Organic Chemistry"

**Suggested Chapters**:
- Physical Chemistry
- Organic Chemistry
- Inorganic Chemistry
- Analytical Chemistry
- Biochemistry

#### 4. Topic (Required)
**Example**: "Reaction Mechanisms"

**Suggested Topics**:
- Thermodynamics
- Chemical Kinetics
- Nomenclature
- Stereochemistry
- Periodic Table
- Coordination Compounds

#### 5. Crossword URL (Required) ⭐
**Example**: `https://crosswordlabs.com/embed/chemistry-9935`

**How to Get URL**:
1. Go to https://crosswordlabs.com/
2. Click "Create a Crossword"
3. Enter your words and clues
4. Click "Create"
5. Click "Share"
6. Copy the **embed URL**
7. Paste here

**URL Format**:
```
https://crosswordlabs.com/embed/your-crossword-name-1234
```

#### 6. Exam Type (Dropdown)
**Options**:
- All Exams
- JEE (Main & Advanced)
- NEET
- GATE
- AIIMS
- IAT, NEST, KVPY, TIFR
- CSIR NET, IIT JAM
- OLYMPIAD
- CUET
- BOARDS

#### 7. Difficulty (Dropdown)
**Options**:
- Easy (Green badge)
- Medium (Yellow badge)
- Hard (Red badge)

#### 8. Thumbnail (Optional)
**Upload**: PNG, JPG, WEBP (Max 5MB)
**Features**:
- Click to upload
- Drag and drop
- Preview after upload

## Example: Adding a Crossword

### Step-by-Step

**1. Fill the Form**:
```
Title: JEE Advanced - SN1 vs SN2 Reactions
Description: Identify the correct mechanism for each reaction. 15 questions covering nucleophilic substitution reactions.
Chapter: Organic Chemistry
Topic: Reaction Mechanisms
Crossword URL: https://crosswordlabs.com/embed/sn1-sn2-reactions-1234
Exam Type: JEE (Main & Advanced)
Difficulty: Hard
Thumbnail: [Upload image]
```

**2. Click "Add Crossword"**

**3. Success!**
- Crossword added to database
- Appears in list below
- Visible on `/puzzle` page

## Managing Existing Crosswords

### View All Crosswords
- Scroll down to see list
- Shows: Title, Description, Tags, URL
- Count displayed: "All Crosswords (X)"

### Edit Crossword
1. Click **Edit** icon (pencil)
2. Form fills with current data
3. Make changes
4. Click "Update Crossword"

### Delete Crossword
1. Click **Delete** icon (trash)
2. Confirm deletion
3. Crossword removed from database

### Preview Crossword
- Click the URL link
- Opens in new tab
- Test the crossword

## Crossword Card Display

Each crossword shows:
- **Title** (large, bold)
- **Description** (gray text)
- **Tags**:
  - Chapter (cyan badge)
  - Topic (purple badge)
  - Exam Type (blue badge)
  - Difficulty (color-coded badge)
- **URL** (clickable link with external icon)
- **Actions**: Edit | Delete

## Creating Crosswords on CrosswordLabs

### Quick Guide

**Step 1: Go to CrosswordLabs**
```
https://crosswordlabs.com/
```

**Step 2: Create Crossword**
1. Click "Create a Crossword"
2. Enter title (e.g., "Chemistry Reactions")
3. Add words and clues:
   ```
   Word: SUBSTITUTION
   Clue: SN1 and SN2 are types of this reaction
   
   Word: NUCLEOPHILE
   Clue: Electron-rich species that attacks carbon
   ```

**Step 3: Generate**
1. Click "Create"
2. Wait for generation
3. Test the crossword

**Step 4: Get Embed URL**
1. Click "Share" button
2. Find "Embed" section
3. Copy the URL:
   ```
   https://crosswordlabs.com/embed/chemistry-reactions-9935
   ```

**Step 5: Add to System**
1. Go to Admin Panel → Manage Crosswords
2. Paste URL in "Crossword URL" field
3. Fill other details
4. Save

## Best Practices

### Titles
✅ **Good**:
- "JEE Advanced - Organic Chemistry Crossword"
- "NEET - Periodic Table Trends"
- "Class 11 - Thermodynamics Basics"

❌ **Bad**:
- "Crossword 1"
- "Chemistry"
- "Test"

### Descriptions
✅ **Good**:
- "Test your knowledge of SN1, SN2, E1, E2 reactions with 15 challenging clues"
- "Master periodic table trends with this interactive crossword covering atomic radius, electronegativity, and ionization energy"

❌ **Bad**:
- "A crossword"
- "Chemistry puzzle"

### Chapters
✅ **Good**:
- "Organic Chemistry"
- "Physical Chemistry"
- "Inorganic Chemistry"

❌ **Bad**:
- "Chemistry"
- "Science"
- "Chapter 1"

### Topics
✅ **Good**:
- "Reaction Mechanisms"
- "Periodic Table Trends"
- "Thermodynamics"

❌ **Bad**:
- "Topic 1"
- "Chemistry"

### URLs
✅ **Good**:
- `https://crosswordlabs.com/embed/chemistry-9935`
- `https://crosswordlabs.com/embed/organic-reactions-5678`

❌ **Bad**:
- `https://crosswordlabs.com/` (homepage, not embed)
- `http://example.com` (not a crossword)

## Troubleshooting

### Issue: Crossword URL Not Working
**Solution**:
- Ensure URL starts with `https://`
- Use embed URL, not regular URL
- Test URL in browser first

### Issue: Thumbnail Not Uploading
**Solution**:
- Check file size (max 5MB)
- Use PNG, JPG, or WEBP format
- Try drag and drop

### Issue: Crossword Not Appearing on Puzzle Page
**Solution**:
- Check if crossword was saved
- Refresh puzzle page
- Clear browser cache

## Summary

✅ **Admin Panel Updated**:
- New "Manage Crosswords" option in sidebar
- Full CRUD functionality (Create, Read, Update, Delete)
- Form with all required fields
- Thumbnail upload support

✅ **Easy to Use**:
- Create crossword on crosswordlabs.com
- Copy embed URL
- Paste in admin panel
- Fill other details
- Save

✅ **Features**:
- List all crosswords
- Edit existing crosswords
- Delete crosswords
- Preview crossword URLs
- Upload thumbnails

**Now you can directly add crossword puzzles from the admin panel!** 🎉
