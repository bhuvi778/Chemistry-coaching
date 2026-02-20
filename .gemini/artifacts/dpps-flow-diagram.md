# DPPS Redesign - User Flow Diagram

## 📊 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         DPPS MODULE - USER FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 1: LANDING PAGE (/dpps)                                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  ╔═══════════════════════════════════════════════════════════╗    │  │
│  │  ║         Daily Practice Problem Sets (DPPS)                ║    │  │
│  │  ╚═══════════════════════════════════════════════════════════╝    │  │
│  │                                                                     │  │
│  │  Select Your Class:                                                │  │
│  │                                                                     │  │
│  │  ┌─────────────────────┐      ┌─────────────────────┐            │  │
│  │  │                     │      │                     │            │  │
│  │  │    CLASS 11         │      │    CLASS 12         │            │  │
│  │  │                     │      │                     │            │  │
│  │  │  🎓 Gradient Card   │      │  🎓 Gradient Card   │            │  │
│  │  │  Hover Animation    │      │  Hover Animation    │            │  │
│  │  │                     │      │                     │            │  │
│  │  └─────────────────────┘      └─────────────────────┘            │  │
│  │         ↓ Click                       ↓ Click                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 2: DIFFICULTY SELECTION (After Class Selection)                   │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Breadcrumb: DPPS > Class 11                                      │  │
│  │  ────────────────────────────────────────────────────────────────  │  │
│  │                                                                     │  │
│  │  Select Difficulty Level:                                          │  │
│  │                                                                     │  │
│  │  ┌──────────┐    ┌──────────┐    ┌──────────┐                    │  │
│  │  │  EASY    │    │  MEDIUM  │    │  TOUGH   │                    │  │
│  │  │          │    │          │    │          │                    │  │
│  │  │  🟢      │    │  🟡      │    │  🔴      │                    │  │
│  │  │  Green   │    │  Yellow  │    │  Red     │                    │  │
│  │  │  Card    │    │  Card    │    │  Card    │                    │  │
│  │  └──────────┘    └──────────┘    └──────────┘                    │  │
│  │       ↓               ↓               ↓                            │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 3: CHAPTERS VIEW (Filtered by Class + Difficulty)                 │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  Breadcrumb: DPPS > Class 11 > Easy                               │  │
│  │  ────────────────────────────────────────────────────────────────  │  │
│  │                                                                     │  │
│  │  🔍 Search: [________________]                                     │  │
│  │                                                                     │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │  │
│  │  │ Atomic Structure│  │ Chemical Bonding│  │ Thermodynamics  │  │  │
│  │  │ ─────────────── │  │ ─────────────── │  │ ─────────────── │  │  │
│  │  │ 🎓 Class: 11    │  │ 🎓 Class: 11    │  │ 🎓 Class: 11    │  │  │
│  │  │ 📊 Easy         │  │ 📊 Easy         │  │ 📊 Easy         │  │  │
│  │  │ ⏱️  30 mins     │  │ ⏱️  45 mins     │  │ ⏱️  60 mins     │  │  │
│  │  │ 📝 15 Questions │  │ 📝 20 Questions │  │ 📝 25 Questions │  │  │
│  │  │ ✅ 60% Done     │  │ ⚪ Not Started  │  │ ✅ 100% Done    │  │  │
│  │  │                 │  │                 │  │                 │  │  │
│  │  │ [Start Test] ─► │  │ [Start Test] ─► │  │ [Start Test] ─► │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │  │
│  │                                                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓ Click "Start Test"
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 4: TEST INSTRUCTIONS (/dpps/test/:chapterId)                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  ╔═══════════════════════════════════════════════════════════╗    │  │
│  │  ║              Atomic Structure - Test                      ║    │  │
│  │  ╚═══════════════════════════════════════════════════════════╝    │  │
│  │                                                                     │  │
│  │  🎓 Class 11  |  📊 Easy  |  ⏱️  30 minutes                       │  │
│  │                                                                     │  │
│  │  Test Instructions:                                                │  │
│  │  ✅ You have 30 minutes to complete all questions                 │  │
│  │  ✅ Timer starts when you click "Start Test"                      │  │
│  │  ✅ You can navigate between questions                            │  │
│  │  ⚠️  Test will auto-submit when time expires                      │  │
│  │  ⚠️  Once submitted, you cannot resume                            │  │
│  │  ✅ Results will be shown immediately                             │  │
│  │                                                                     │  │
│  │  [← Back]                              [▶ Start Test]             │  │
│  │                                                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓ Click "Start Test"
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 5: TIMED TEST INTERFACE (Timer Running)                           │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  ╔═══════════════════════════════════════════════════════════╗    │  │
│  │  ║  Atomic Structure  |  Q 1/15  |  Attempted: 3/15  |  ⏱️ 28:45 ║  │  │
│  │  ╚═══════════════════════════════════════════════════════════╝    │  │
│  │  ────────────────────────────────────────────────────────────────  │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────┐  ┌──────────────────────┐   │  │
│  │  │ QUESTION PANEL                  │  │ QUESTION NAVIGATOR   │   │  │
│  │  │                                 │  │                      │   │  │
│  │  │ Question 1:                     │  │ ┌─┬─┬─┬─┬─┐         │   │  │
│  │  │ What is the atomic number of... │  │ │1│2│3│4│5│         │   │  │
│  │  │                                 │  │ └─┴─┴─┴─┴─┘         │   │  │
│  │  │ Options:                        │  │ ┌─┬─┬─┬─┬─┐         │   │  │
│  │  │ ○ A) 6                          │  │ │6│7│8│9│10│        │   │  │
│  │  │ ● B) 8  ← Selected              │  │ └─┴─┴─┴─┴─┘         │   │  │
│  │  │ ○ C) 12                         │  │ ┌─┬─┬─┬─┬─┐         │   │  │
│  │  │ ○ D) 16                         │  │ │11│12│13│14│15│    │   │  │
│  │  │                                 │  │ └─┴─┴─┴─┴─┘         │   │  │
│  │  │                                 │  │                      │   │  │
│  │  │ [← Previous]      [Next →]      │  │ Legend:              │   │  │
│  │  │                                 │  │ 🟢 Answered          │   │  │
│  │  │            [Submit Test]        │  │ ⚪ Not Answered      │   │  │
│  │  │                                 │  │ 🔵 Current           │   │  │
│  │  └─────────────────────────────────┘  │                      │   │  │
│  │                                        │ [Submit Test]        │   │  │
│  │                                        └──────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Timer Behavior:                                                         │
│  • Green (>50% time remaining)                                          │
│  • Yellow (25-50% time remaining)                                       │
│  • Orange (10-25% time remaining)                                       │
│  • Red + Pulse (<10% time remaining)                                    │
│  • Auto-submit at 00:00                                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                    ↓ Submit or Timeout
┌─────────────────────────────────────────────────────────────────────────┐
│  STEP 6: TEST RESULTS (/dpps/results/:sessionId)                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  ╔═══════════════════════════════════════════════════════════╗    │  │
│  │  ║  ✅ Test Completed  (or ⏱️  Auto-submitted)               ║    │  │
│  │  ╚═══════════════════════════════════════════════════════════╝    │  │
│  │                                                                     │  │
│  │  ╔═══════════════════════════════════════════════════════════╗    │  │
│  │  ║              Test Results                                  ║    │  │
│  │  ╚═══════════════════════════════════════════════════════════╝    │  │
│  │                                                                     │  │
│  │  Atomic Structure                                                  │  │
│  │  🎉 Excellent Work! 👏                                             │  │
│  │                                                                     │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐          │  │
│  │  │   80%    │  │    12    │  │    10    │  │    2     │          │  │
│  │  │  Score   │  │ Attempted│  │ Correct  │  │ Incorrect│          │  │
│  │  │  10/12   │  │  out of  │  │  83%     │  │    3     │          │  │
│  │  │          │  │    15    │  │ accuracy │  │unattempted│         │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘          │  │
│  │                                                                     │  │
│  │  Time Limit: 30 min  |  Time Taken: 25m 30s  |  Manual Submit     │  │
│  │                                                                     │  │
│  │  [👁️  Show Question Review]                                        │  │
│  │                                                                     │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ QUESTION REVIEW (Toggleable)                                │  │  │
│  │  │                                                              │  │  │
│  │  │ ✅ Question 1: Correct                                       │  │  │
│  │  │    Your Answer: B) 8  ✓                                     │  │  │
│  │  │    💡 Solution: The atomic number of oxygen is 8...         │  │  │
│  │  │                                                              │  │  │
│  │  │ ❌ Question 2: Incorrect                                     │  │  │
│  │  │    Your Answer: A) 6  ✗                                     │  │  │
│  │  │    Correct Answer: C) 12  ✓                                 │  │  │
│  │  │    💡 Solution: The atomic number of carbon is 6...         │  │  │
│  │  │                                                              │  │  │
│  │  │ ⚪ Question 3: Not Attempted                                 │  │  │
│  │  │    Correct Answer: D) 16  ✓                                 │  │  │
│  │  │    💡 Solution: The atomic number of sulfur is 16...        │  │  │
│  │  │                                                              │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  │                                                                     │  │
│  │  [🏠 Back to DPPS]              [🔄 Retake Test]                   │  │
│  │                                                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        ADMIN PANEL FLOW                                  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│  ADMIN: MANAGE DPPS                                                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                                                                     │  │
│  │  [+ Add Chapter]                                                   │  │
│  │                                                                     │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │  │
│  │  │ Atomic Structure│  │ Chemical Bonding│  │ Thermodynamics  │  │  │
│  │  │ ─────────────── │  │ ─────────────── │  │ ─────────────── │  │  │
│  │  │ Class: 11       │  │ Class: 12       │  │ Class: 11       │  │  │
│  │  │ Easy            │  │ Medium          │  │ Tough           │  │  │
│  │  │ 30 mins         │  │ 45 mins         │  │ 60 mins         │  │  │
│  │  │                 │  │                 │  │                 │  │  │
│  │  │ [✏️ Edit] [🗑️ Del] │  │ [✏️ Edit] [🗑️ Del] │  │ [✏️ Edit] [🗑️ Del] │  │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │  │
│  │         ↓ Click                                                    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  CHAPTER: Atomic Structure                                         │  │
│  │  [+ Add Question]                                                  │  │
│  │                                                                     │  │
│  │  Q1: What is the atomic number...  [✏️ Edit] [🗑️ Delete]           │  │
│  │      Class: 11 | Easy | MCQ | 1 mark                              │  │
│  │                                                                     │  │
│  │  Q2: Which element has...          [✏️ Edit] [🗑️ Delete]           │  │
│  │      Class: 11 | Easy | MCQ | 1 mark                              │  │
│  │                                                                     │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  ADD/EDIT CHAPTER FORM                                             │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Chapter Name: [_____________________]                        │  │  │
│  │  │ Subject: [Chemistry ▼]                                       │  │  │
│  │  │ Description: [_____________________]                         │  │  │
│  │  │                                                               │  │  │
│  │  │ Class Level: [11 ▼] ⭐ NEW                                   │  │  │
│  │  │ Difficulty: [Easy ▼]                                         │  │  │
│  │  │ Time Limit: [30] minutes ⭐ NEW                              │  │  │
│  │  │                                                               │  │  │
│  │  │ Icon: [fa-atom]                                              │  │  │
│  │  │ Color: [cyan ▼]                                              │  │  │
│  │  │ Order: [1]                                                   │  │  │
│  │  │ ☑ Active                                                     │  │  │
│  │  │                                                               │  │  │
│  │  │ [Create/Update]  [Cancel]                                    │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │  ADD/EDIT QUESTION FORM                                            │  │
│  │  ┌─────────────────────────────────────────────────────────────┐  │  │
│  │  │ Question: [Rich Text Editor]                                 │  │  │
│  │  │ Options:                                                     │  │  │
│  │  │   Option 1: [Rich Text Editor]                               │  │  │
│  │  │   Option 2: [Rich Text Editor]                               │  │  │
│  │  │   Option 3: [Rich Text Editor]                               │  │  │
│  │  │   Option 4: [Rich Text Editor]                               │  │  │
│  │  │ Correct Answer: [_____________________]                      │  │  │
│  │  │ Solution: [Rich Text Editor]                                 │  │  │
│  │  │ Hint: [_____________________]                                │  │  │
│  │  │                                                               │  │  │
│  │  │ Class Level: [11 ▼] ⭐ NEW                                   │  │  │
│  │  │ Difficulty: [Easy ▼]                                         │  │  │
│  │  │ Type: [MCQ ▼]                                                │  │  │
│  │  │ Marks: [1]                                                   │  │  │
│  │  │ ☑ Active                                                     │  │  │
│  │  │                                                               │  │  │
│  │  │ [Create/Update]  [Cancel]                                    │  │  │
│  │  └─────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│                        DATA FLOW DIAGRAM                                 │
└─────────────────────────────────────────────────────────────────────────┘

Frontend                    API Routes                  Database
────────                    ──────────                  ────────

DPPS.jsx ──────────────► GET /api/dpps/chapters ──────► DPPSChapter
   │                      ?classLevel=11                    │
   │                      &difficultyLevel=Easy             │
   │                                                         │
   │◄─────────────────── Filtered Chapters ◄────────────────┘
   │
   │
DPPSTest.jsx ──────────► POST /api/dpps/test-sessions ──► DPPSTestSession
   │                      { userId, chapterId }              │
   │                                                          │
   │◄─────────────────── Test Session Created ◄──────────────┘
   │                      { sessionId, questions,
   │                        timeLimit, startTime }
   │
   │ (During Test)
   │
   ├──────────────────► PUT /api/dpps/test-sessions/:id/answer
   │                     { questionId, answer, timeSpent }
   │                                  │
   │                                  ├──────────► DPPSTestSession
   │                                  │             (update answers)
   │                                  │
   │                                  └──────────► DPPSProgress
   │                                                (save progress)
   │
   │ (On Submit/Timeout)
   │
   ├──────────────────► PUT /api/dpps/test-sessions/:id/submit
   │                     { isAutoSubmit }
   │                                  │
   │                                  ├──────────► Calculate Results
   │                                  │             (server-side)
   │                                  │
   │                                  └──────────► Save to DB
   │
   │◄─────────────────── Results ◄───────────────────────────┘
   │                      { score, percentage,
   │                        correctAnswers, etc. }
   │
   │
DPPSTestResults.jsx ──► GET /api/dpps/test-sessions/:id/results
   │                                  │
   │                                  └──────────► DPPSTestSession
   │                                                (with populated
   │                                                 questions)
   │◄─────────────────── Full Results ◄──────────────────────┘
                          { session, questions,
                            answers, solutions }

┌─────────────────────────────────────────────────────────────────────────┐
│                     KEY DESIGN DECISIONS                                 │
└─────────────────────────────────────────────────────────────────────────┘

1. THREE-TIER NAVIGATION
   └─► Class (Primary) → Difficulty (Secondary) → Chapters (Final)
   
2. COMPLETE DATA SEPARATION
   └─► Class 11 and Class 12 data never mix
   
3. SERVER-SIDE VALIDATION
   └─► Timer, results, and answers validated on server
   
4. AUTO-SUBMIT MECHANISM
   └─► Client-side timer + Server-side validation
   
5. IMMEDIATE RESULTS
   └─► No delay, instant feedback after submission
   
6. RICH TEXT SUPPORT
   └─► Questions, options, and solutions support formatting
   
7. PROGRESS TRACKING
   └─► Individual question time tracking
   
8. ADMIN CONTROL
   └─► Complete control over class, difficulty, and time limits
