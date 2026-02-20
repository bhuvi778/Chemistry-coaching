# Practice Test Rich Text Editor Fix

## Issue
The ReactQuill rich text editor toolbar was appearing on the **Options** input fields and **Explanation** textarea in the Practice Test question form, when it should only appear on the **Question** field.

## Root Cause
ReactQuill's global CSS was bleeding through and affecting other input elements in the form, causing the toolbar to appear where it shouldn't.

## Solution Implemented

### 1. **Added Specific CSS Classes**
- Added `practice-test-question-editor` class to the ReactQuill wrapper div
- Added `practice-test-option-input` class to all option input fields
- Added `practice-test-explanation-input` class to the explanation textarea

### 2. **Created Scoped CSS Rules**
Added custom CSS at the end of the `ManagePracticeTests.jsx` file that:

- **Ensures toolbar only appears in question field:**
  ```css
  .practice-test-question-editor .ql-toolbar {
      display: block !important;
  }
  ```

- **Hides stray toolbars elsewhere:**
  ```css
  .ql-toolbar:not(.practice-test-question-editor .ql-toolbar) {
      display: none !important;
  }
  ```

- **Protects option inputs and explanation textarea:**
  - Explicitly sets background, border, color, and padding
  - Uses `!important` to override any Quill CSS
  - Prevents Quill from affecting regular input/textarea elements

### 3. **Key Changes Made**

**File:** `/www/wwwroot/reaction-lab/src/pages/Admin/ManagePracticeTests.jsx`

1. Line 720: Updated question wrapper div
   ```jsx
   <div className="quill-wrapper practice-test-question-editor">
   ```

2. Line 741: Updated option input className
   ```jsx
   className="practice-test-option-input w-full px-4 py-3..."
   ```

3. Line 791: Updated explanation textarea className
   ```jsx
   className="practice-test-explanation-input w-full px-4 py-3..."
   ```

4. Lines 824-899: Added custom CSS to scope ReactQuill properly

## Result
- ✅ Rich text editor toolbar now **only appears** on the Question field
- ✅ Options remain as **regular text input fields** (no toolbar)
- ✅ Explanation remains as a **regular textarea** (no toolbar)
- ✅ All fields maintain proper styling and functionality

## Testing
To verify the fix:
1. Navigate to Admin Panel → Practice Tests
2. Click "Add Question" on any test
3. Verify that:
   - Question field has the rich text editor toolbar
   - Option fields are plain text inputs (no toolbar)
   - Explanation field is a plain textarea (no toolbar)
