# Self Learn Admin Panel - Quick Start Guide

## 🎯 Quick Overview

The Self Learn admin panel now has a powerful **Content Manager** for each topic with three tabs:
- 🎥 **Videos** (Bunny.net)
- 📄 **Sheets** (PDFs)
- ✅ **Exercises** (MCQ Tests)

---

## 📖 Step-by-Step Guide

### Step 1: Access the Admin Panel
1. Navigate to: **Admin → Manage Self Learn**
2. You'll see a hierarchical tree: **Chapters → Topics**

### Step 2: Create Chapter (if needed)
1. Click **"+ Add Chapter"** button (top right)
2. Fill in:
   - Exam Type: NEET / JEE / PSTET
   - Subject: Physical / Organic / Inorganic Chemistry
   - Chapter Name
   - Description (optional)
3. Click **Submit**

### Step 3: Create Topic
1. Click **"+ Topic"** button on any chapter
2. Fill in:
   - Topic Name (e.g., "Aldehydes and Ketones")
   - Description (optional)
3. Click **Submit**

### Step 4: Manage Topic Content 🎯
1. Find your topic in the list
2. Click **"Manage Content"** button (gradient blue button)
3. **Content Manager Modal opens** with 3 tabs

---

## 🎥 Adding Videos (Bunny.net)

### Required Information:
- Title: Display name for the video
- Bunny.net URL: Full video URL from Bunny CDN
- Video ID: Unique identifier from Bunny.net

### Steps:
1. Click **Videos** tab
2. Fill in the **Add Video** form:
   ```
   Title:        "Introduction to Aldehydes"
   Bunny URL:    https://video.bunnycdn.com/your-library/your-video
   Video ID:     abc123-def456
   Duration:     15:30 (optional)
   Thumbnail:    https://... (optional)
   ```
3. Click **"Add Video"**
4. Video appears in the list below
5. Use **Edit** (✏️) to modify or **Delete** (🗑️) to remove

### Viewing Videos:
- Each video shows title, URL, Video ID, and duration
- Count appears in topic badge: 🎥 2

---

## 📄 Adding Sheets (PDFs)

### Required Information:
- Title: Name of the PDF sheet
- PDF URL: Link to the uploaded PDF file
- Description: Brief explanation (optional)

### Steps:
1. Click **Sheets** tab
2. **First**: Upload your PDF to the server
   - Use your file manager or upload system
   - Copy the resulting URL
3. Fill in the **Add Sheet** form:
   ```
   Title:        "Class Notes - Aldehydes"
   PDF URL:      https://ace2examz.com/uploads/aldehydes-notes.pdf
   Description:  Comprehensive notes covering all topics
   ```
4. Click **"Add Sheet"**
5. Sheet appears with a **"View PDF"** link
6. Use **Edit** (✏️) or **Delete** (🗑️) as needed

### Viewing Sheets:
- Each sheet shows title, description, and PDF link
- Count appears in topic badge: 📄 3

---

## ✅ Adding Exercises (MCQ Questions)

### Required Information:
- Question text
- 4 options (A, B, C, D)
- Correct answer (0-3)
- Difficulty level
- Marks and explanation

### Steps:
1. Click **Exercises** tab
2. Fill in the **Add Exercise Question** form:
   ```
   Question:     Which compound is an aldehyde?
   Option 1:     CH3CHO
   Option 2:     CH3COCH3
   Option 3:     CH3OH
   Option 4:     CH3COOH
   Correct:      Option 1
   Difficulty:   Medium
   Marks:        4
   Explanation:  CH3CHO (acetaldehyde) has -CHO group
   ```
3. Click **"Add Exercise"**
4. Exercise appears with **color-coded correct answer** (green)
5. Use **Edit** (✏️) or **Delete** (🗑️) as needed

### Viewing Exercises:
- Questions show with difficulty badge (Easy/Medium/Hard)
- Correct answer highlighted in green
- Explanation shown in blue info box
- Count appears in topic badge: ✅ 15

---

## 📊 Understanding Topic Badges

After adding content, each topic shows **three badges**:

```
🎥 2    →  2 videos added
📄 3    →  3 PDF sheets added
✅ 15   →  15 exercise questions added
```

These update **automatically** when you add/edit/delete content!

---

## 💡 Best Practices

### For Videos:
✅ Use descriptive titles: "Introduction to...", "Advanced Concepts..."
✅ Always include Video ID from Bunny.net
✅ Add duration for better UX: "10:30", "25:45"
✅ Order videos logically (basic → advanced)

### For Sheets:
✅ Upload PDFs to server first
✅ Use consistent naming: "Class Notes - Topic Name"
✅ Add descriptions to explain content
✅ Keep PDFs organized by topic

### For Exercises:
✅ Write clear, unambiguous questions
✅ Ensure only ONE correct answer
✅ Add explanations for learning value
✅ Mix difficulty levels (20% Easy, 60% Medium, 20% Hard)
✅ Use standard marks: 4 marks, -1 negative

---

## 🔄 Editing Content

### Edit Video:
1. Click **Edit** button (✏️) on video
2. Form fills with existing data
3. Modify as needed
4. Click **"Update Video"**
5. Changes appear immediately

### Edit Sheet:
1. Click **Edit** button (✏️) on sheet
2. Modify title, URL, or description
3. Click **"Update Sheet"**

### Edit Exercise:
1. Click **Edit** button (✏️) on exercise
2. Modify question, options, or answer
3. Click **"Update Exercise"**

---

## 🗑️ Deleting Content

1. Click **Delete** button (🗑️) on any item
2. **Confirmation dialog** appears
3. Click **"OK"** to confirm deletion
4. Item removed immediately
5. Count badge updates automatically

---

## ⚡ Quick Tips

### Efficiency Boosters:
- **Add videos first** → Then sheets → Then exercises
- **Keep Content Manager open** → Add multiple items at once
- **Use Cancel** → If you change your mind while editing
- **Check counts** → Verify all content added correctly

### Common Workflow:
```
1. Create Chapter
2. Create Topics (multiple)
3. For each topic:
   → Manage Content
   → Add 2-3 videos
   → Add 1-2 PDF sheets
   → Add 10-20 exercises
   → Close modal (auto-saves)
4. Repeat for all topics
```

---

## 🎨 UI Features

### Tab Navigation:
- **Active tab**: Cyan color with underline
- **Inactive tabs**: Gray, clickable
- **Counts in parentheses**: (2), (3), (15)

### Forms:
- **Required fields**: Red asterisk (*)
- **Optional fields**: No asterisk
- **Validation**: Red border if incomplete
- **Submit disabled**: When form invalid or loading

### Content Lists:
- **Color-coded by type**: Blue (videos), Purple (sheets), Green (exercises)
- **Hover effects**: Smooth transitions
- **Action buttons**: Right side of each item
- **Empty state**: Helpful message when no content

---

## ❓ FAQ

**Q: Do changes save automatically?**
A: Yes! All changes save immediately when you click Add/Update/Delete.

**Q: Can I add content in any order?**
A: Yes, you can add videos, sheets, and exercises in any order.

**Q: What happens if I close the modal?**
A: All saved changes persist. Topic list refreshes to show new counts.

**Q: Can I add the same video to multiple topics?**
A: Yes, just enter the same Bunny.net URL and Video ID.

**Q: How do I upload PDFs?**
A: Upload via file manager first, then paste the URL in the form.

**Q: Can I preview videos before adding?**
A: Not in admin panel. Test the Bunny.net URL in a browser first.

---

## 🚀 Example Workflow

### Creating a Complete Topic:

**Topic**: "Aldehydes and Ketones"

#### Step 1: Videos (3 videos)
1. "Introduction to Carbonyl Group" - 12:30
2. "Nomenclature and Structure" - 18:45
3. "Chemical Reactions" - 25:15

#### Step 2: Sheets (2 PDFs)
1. "Class Notes - Complete Chapter"
2. "Quick Reference - Reactions"

#### Step 3: Exercises (15 questions)
- 3 Easy questions
- 9 Medium questions
- 3 Hard questions

**Result**: Topic badge shows **🎥 3  📄 2  ✅ 15**

---

## ✅ Checklist for Complete Topic

- [ ] Topic created with descriptive name
- [ ] At least 2-3 videos added (Bunny.net)
- [ ] At least 1 PDF sheet added
- [ ] 10-20 exercise questions added
- [ ] Mix of difficulty levels (Easy/Medium/Hard)
- [ ] All explanations added to exercises
- [ ] Counts verified in topic badge
- [ ] Content tested on frontend

---

## 🎉 You're Ready!

You now have everything needed to manage Self Learn content professionally:

✅ Add videos from Bunny.net
✅ Upload and manage PDF sheets
✅ Create comprehensive exercise banks
✅ Edit and delete content easily
✅ Track content with live counts

**Happy content creation!** 🚀
