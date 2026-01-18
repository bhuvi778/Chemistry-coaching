# Flash Card System - User Flow & Screenshots Reference

## 📱 User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                     STUDENT FLOW                             │
└─────────────────────────────────────────────────────────────┘

1. ENTRY POINT
   ↓
   Navbar → Study Material → Flash Card
   OR
   Direct URL: /flash-cards
   
2. CHAPTER SELECTION (/flash-cards)
   ┌──────────────────────────────────────┐
   │  Flash Cards                         │
   │  Master chemistry concepts...        │
   │                                      │
   │  Select a Chapter                    │
   │  ┌────────┐ ┌────────┐ ┌────────┐  │
   │  │ [Icon] │ │ [Icon] │ │ [Icon] │  │
   │  │Solutions│ │Electro │ │Kinetics│  │
   │  │66 cards │ │64 cards│ │60 cards│  │
   │  │11 topics│ │9 topics│ │7 topics│  │
   │  │66 due   │ │64 due  │ │60 due  │  │
   │  └────────┘ └────────┘ └────────┘  │
   └──────────────────────────────────────┘
   ↓ (Click any chapter)

3. TOPIC SELECTION (/flash-cards/:chapterId)
   ┌──────────────────────────────────────┐
   │  ← Back to chapters                  │
   │                                      │
   │  Solutions                           │
   │  Select topics to practice...        │
   │                                      │
   │  ┌────┬────┬────┬────┐              │
   │  │ 66 │ 0  │ 0  │ 0  │              │
   │  │New │Lrn │Rev │Mst │              │
   │  └────┴────┴────┴────┘              │
   │                                      │
   │  Topics          [Select All]        │
   │  ☑ Classification of Solutions       │
   │     3 due • 3 cards                  │
   │  ☑ Concentration Terms               │
   │     5 due • 5 cards                  │
   │  ☐ Henry's Law                       │
   │     6 due • 6 cards                  │
   │                                      │
   │  [Start Practice (2 topics)]         │
   └──────────────────────────────────────┘
   ↓ (Click Start Practice)

4. PRACTICE MODE (/flash-cards/:chapterId/practice)
   
   FRONT OF CARD (Question):
   ┌──────────────────────────────────────┐
   │  Card 1 of 14        ✓0  ✗0         │
   │  ████░░░░░░░░░░░░░░░░░░░░░░░░       │
   │                                      │
   │  ┌────────────────────────────────┐ │
   │  │                                │ │
   │  │        QUESTION                │ │
   │  │                                │ │
   │  │  Name a solution where liquid  │ │
   │  │  is solute and solid is        │ │
   │  │  solvent.                      │ │
   │  │                                │ │
   │  │  Click to reveal answer        │ │
   │  │                                │ │
   │  └────────────────────────────────┘ │
   │           [Medium]                   │
   └──────────────────────────────────────┘
   ↓ (Click card to flip)

   BACK OF CARD (Answer):
   ┌──────────────────────────────────────┐
   │  Card 1 of 14        ✓0  ✗0         │
   │  ████░░░░░░░░░░░░░░░░░░░░░░░░       │
   │                                      │
   │  ┌────────────────────────────────┐ │
   │  │                                │ │
   │  │         ANSWER                 │ │
   │  │                                │ │
   │  │  Amalgam (mercury dissolved    │ │
   │  │  in solid metals)              │ │
   │  │                                │ │
   │  └────────────────────────────────┘ │
   │           [Medium]                   │
   │                                      │
   │   [✗ Wrong]      [✓ Correct]        │
   │                                      │
   │        Exit Practice                 │
   └──────────────────────────────────────┘
   ↓ (After all cards)

5. RESULTS SCREEN
   ┌──────────────────────────────────────┐
   │         🏆                           │
   │                                      │
   │    Practice Complete!                │
   │    Great job! Here's how you did:    │
   │                                      │
   │  ┌────┐  ┌────┐  ┌────┐            │
   │  │ 14 │  │ 12 │  │ 2  │            │
   │  │Tot │  │✓Cor│  │✗Wrg│            │
   │  └────┘  └────┘  └────┘            │
   │                                      │
   │         86%                          │
   │       Accuracy                       │
   │                                      │
   │  [🔄 Practice Again] [← Back]       │
   └──────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│                     ADMIN FLOW                               │
└─────────────────────────────────────────────────────────────┘

1. LOGIN
   /admin → Enter credentials → Dashboard

2. NAVIGATE TO FLASH CARDS
   Sidebar → Click "Flash Cards"

3. MANAGE CHAPTERS (Tab 1)
   ┌──────────────────────────────────────┐
   │  [Chapters] [Topics] [Cards]         │
   │                                      │
   │  Add New Chapter                     │
   │  ┌────────────────────────────────┐ │
   │  │ Chapter Name: [Solutions    ]  │ │
   │  │ Description:  [Types of...  ]  │ │
   │  │ Icon Class:   [fas fa-flask ]  │ │
   │  │ Icon Color:   [🎨 #a855f7  ]  │ │
   │  │ Subject:      [Chemistry ▼ ]  │ │
   │  │ Order:        [1           ]  │ │
   │  │                                │ │
   │  │ [Add Chapter]                  │ │
   │  └────────────────────────────────┘ │
   │                                      │
   │  Existing Chapters                   │
   │  ┌────────────────────────────────┐ │
   │  │ 🧪 Solutions                   │ │
   │  │    Types of solutions...       │ │
   │  │    66 cards • 11 topics        │ │
   │  │    [Select][Edit][Delete]      │ │
   │  └────────────────────────────────┘ │
   └──────────────────────────────────────┘

4. MANAGE TOPICS (Tab 2)
   ┌──────────────────────────────────────┐
   │  [Chapters] [Topics] [Cards]         │
   │                                      │
   │  Selected Chapter: Solutions         │
   │                                      │
   │  Add New Topic                       │
   │  ┌────────────────────────────────┐ │
   │  │ Topic Name:   [Classification] │ │
   │  │ Description:  [Types and...  ] │ │
   │  │ Order:        [1             ] │ │
   │  │                                │ │
   │  │ [Add Topic]                    │ │
   │  └────────────────────────────────┘ │
   │                                      │
   │  Topics in Solutions                 │
   │  ┌────────────────────────────────┐ │
   │  │ Classification of Solutions    │ │
   │  │ Types and properties...        │ │
   │  │ 3 cards                        │ │
   │  │ [Select][Edit][Delete]         │ │
   │  └────────────────────────────────┘ │
   └──────────────────────────────────────┘

5. MANAGE CARDS (Tab 3)
   ┌──────────────────────────────────────┐
   │  [Chapters] [Topics] [Cards]         │
   │                                      │
   │  Chapter: Solutions                  │
   │  Topic: Classification of Solutions  │
   │                                      │
   │  Add New Card                        │
   │  ┌────────────────────────────────┐ │
   │  │ Question: [Name a solution...] │ │
   │  │                                │ │
   │  │ Answer:   [Amalgam (mercury )] │ │
   │  │                                │ │
   │  │ Difficulty: [Medium ▼]         │ │
   │  │ Tags:      [amalgam, metals]   │ │
   │  │ Order:     [1              ]   │ │
   │  │                                │ │
   │  │ [Add Card]                     │ │
   │  └────────────────────────────────┘ │
   │                                      │
   │  Cards in Classification...          │
   │  ┌────────────────────────────────┐ │
   │  │ Q: Name a solution where...    │ │
   │  │ A: Amalgam (mercury...)        │ │
   │  │ [Medium] [2 tags]              │ │
   │  │ [Edit][Delete]                 │ │
   │  └────────────────────────────────┘ │
   └──────────────────────────────────────┘
```

## 🎨 Color Coding

- **Purple (#a855f7)**: Questions, Chapter icons
- **Cyan (#06b6d4)**: Answers, Interactive elements
- **Green (#10b981)**: Correct answers
- **Red (#ef4444)**: Wrong answers
- **Amber (#f59e0b)**: Due counts
- **Gray**: Neutral elements

## 🔄 Card Flip Animation

```
FRONT (Purple)          FLIP (3D)           BACK (Cyan)
┌──────────┐                              ┌──────────┐
│          │                              │          │
│ QUESTION │  ──────────────────────────> │  ANSWER  │
│          │     Click to flip            │          │
└──────────┘                              └──────────┘
     │                                         │
     └─────────────────────────────────────────┘
              Click again to flip back
```

## 📊 Data Flow

```
Admin Panel                 Database              Student View
    │                          │                       │
    │ Create Chapter           │                       │
    ├─────────────────────────>│                       │
    │                          │                       │
    │ Add Topics               │                       │
    ├─────────────────────────>│                       │
    │                          │                       │
    │ Create Cards             │                       │
    ├─────────────────────────>│                       │
    │                          │                       │
    │                          │   Fetch Chapters      │
    │                          │<──────────────────────┤
    │                          │                       │
    │                          │   Fetch Topics        │
    │                          │<──────────────────────┤
    │                          │                       │
    │                          │   Fetch Cards         │
    │                          │<──────────────────────┤
    │                          │                       │
    │                          │   Practice Session    │
    │                          │   (No DB writes)      │
    │                          │                       │
```

## 🎯 Key Interactions

### Chapter Card Hover
```
Normal State:
┌──────────────┐
│   [Icon]     │
│   Solutions  │
│   66 cards   │
└──────────────┘

Hover State:
┌──────────────┐  ← Scales up 1.05x
│   [Icon]     │  ← Background gradient appears
│   Solutions  │  ← Text turns cyan
│   66 cards   │  ← Cursor: pointer
└──────────────┘
```

### Topic Selection
```
Unselected:
☐ Classification of Solutions
  Gray border, transparent background

Selected:
☑ Classification of Solutions
  Cyan border, cyan background (20% opacity)
```

### Progress Bar
```
Card 1 of 14:
████░░░░░░░░░░░░░░░░░░░░░░░░  (7% filled)

Card 7 of 14:
████████████████░░░░░░░░░░░░  (50% filled)

Card 14 of 14:
████████████████████████████  (100% filled)
```

## 📱 Responsive Breakpoints

- **Mobile (< 768px)**: Single column, stacked cards
- **Tablet (768px - 1024px)**: 2 columns for chapters
- **Desktop (> 1024px)**: 3 columns for chapters

## ✨ Animation Timings

- Card Flip: 500ms
- Hover Effects: 300ms
- Progress Bar: 300ms
- Button Fade-in: 300ms
- Page Transitions: Instant (React Router)

---

This visual reference matches the uploaded images and shows the complete user flow through the flashcard system!
