# PYQ Subject Structure - Visual Guide

## UI Components Overview

### 1. Subject Filter Tabs (Pill Style)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Filter by Subject:                                                     │
│                                                                         │
│  ┌─────────────┐  ┌──────────┐  ┌───────────┐  ┌─────────┐  ┌──────────┐
│  │ All Subjects│  │ Physical │  │ Inorganic │  │ Organic │  │ Practical│
│  │  (Active)   │  │          │  │           │  │         │  │          │
│  └─────────────┘  └──────────┘  └───────────┘  └─────────┘  └──────────┘
│   Cyan Gradient    Purple        Green         Orange       Blue       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Active State:**
- Gradient background (color-specific)
- White text
- Shadow effect
- Slightly larger

**Inactive State:**
- Gray background
- Colored text
- Border
- Hover effect

---

### 2. Chapter Card with Subject Tag

```
┌───────────────────────────────────────────────────────────────┐
│                                                               │
│  [Physical] [Morning Shift] [Batch A]                        │  ← Tags
│                                                               │
│  Chapter 06                                                   │
│                                                               │
│  ┌────┐  Thermodynamics                    [15 Unattempted] │
│  │ 🔥 │                                     [10 Attempted]   │
│  └────┘  Laws of thermodynamics...                           │
│                                                               │
│  [5 Topics]  [25 Questions]                                  │
│                                                               │
│  In Progress                                          40%    │
│  ████████░░░░░░░░░░░░░                                        │
│                                                               │
│  [View Topics →]                                              │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

### 3. Subject Tag Variations

#### Small (sm):
```
[Physical]  [Inorganic]  [Organic]  [Practical]
```

#### Medium (md):
```
[🔬 Physical]  [⚗️ Inorganic]  [🌿 Organic]  [🔬 Practical]
```

#### Large (lg):
```
[🔬 Physical Chemistry]  [⚗️ Inorganic Chemistry]
```

---

## Color Scheme

### Physical Chemistry (Purple)
```
Active Pill:
┌──────────────────────────────────┐
│ 🔬 Physical                      │
│ Gradient: Purple-500 → Purple-600│
│ Shadow: Purple-500/50            │
└──────────────────────────────────┘

Tag:
┌─────────────┐
│ 🔬 Physical │  Background: Purple-500/20
│             │  Text: Purple-400
│             │  Border: Purple-500/30
└─────────────┘
```

### Inorganic Chemistry (Green)
```
Active Pill:
┌──────────────────────────────────┐
│ ⚗️ Inorganic                     │
│ Gradient: Green-500 → Emerald-600│
│ Shadow: Green-500/50             │
└──────────────────────────────────┘

Tag:
┌──────────────┐
│ ⚗️ Inorganic │  Background: Green-500/20
│              │  Text: Green-400
│              │  Border: Green-500/30
└──────────────┘
```

### Organic Chemistry (Orange)
```
Active Pill:
┌──────────────────────────────────┐
│ 🌿 Organic                       │
│ Gradient: Orange-500 → Amber-600 │
│ Shadow: Orange-500/50            │
└──────────────────────────────────┘

Tag:
┌────────────┐
│ 🌿 Organic │  Background: Orange-500/20
│            │  Text: Orange-400
│            │  Border: Orange-500/30
└────────────┘
```

### Practical (Blue)
```
Active Pill:
┌──────────────────────────────────┐
│ 🔬 Practical                     │
│ Gradient: Blue-500 → Cyan-600    │
│ Shadow: Blue-500/50              │
└──────────────────────────────────┘

Tag:
┌──────────────┐
│ 🔬 Practical │  Background: Blue-500/20
│              │  Text: Blue-400
│              │  Border: Blue-500/30
└──────────────┘
```

---

## Page Layout

### PYQ Chapter List Page

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  ← Back to Exam Selection                                      │
│                                                                 │
│  JEE MAIN - PYQs                                               │
│  Chapter-wise Previous Year Questions                          │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Filter by Subject:                                      │  │
│  │                                                         │  │
│  │ [All] [Physical] [Inorganic] [Organic] [Practical]    │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [📚 25 Chapters]                                              │
│                                                                 │
│  ┌────────────────────────────────────────────────────┐        │
│  │ 🔍 Search chapters...                              │        │
│  └────────────────────────────────────────────────────┘        │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Chapter  │  │ Chapter  │  │ Chapter  │                    │
│  │   Card   │  │   Card   │  │   Card   │                    │
│  │          │  │          │  │          │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │ Chapter  │  │ Chapter  │  │ Chapter  │                    │
│  │   Card   │  │   Card   │  │   Card   │                    │
│  │          │  │          │  │          │                    │
│  └──────────┘  └──────────┘  └──────────┘                    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## User Interaction Flow

### Scenario 1: Filter by Subject

```
Step 1: User sees all subjects
┌────────────────────────────────────────┐
│ [All*] [Physical] [Inorganic] [Organic]│
│                                        │
│ Showing: 25 chapters (all subjects)   │
└────────────────────────────────────────┘

Step 2: User clicks "Physical"
┌────────────────────────────────────────┐
│ [All] [Physical*] [Inorganic] [Organic]│
│                                        │
│ Showing: 8 chapters (Physical only)   │
└────────────────────────────────────────┘

Step 3: User clicks "Physical" again (deselect)
┌────────────────────────────────────────┐
│ [All*] [Physical] [Inorganic] [Organic]│
│                                        │
│ Showing: 25 chapters (all subjects)   │
└────────────────────────────────────────┘
```

---

### Scenario 2: Search + Subject Filter

```
Step 1: Select subject
┌────────────────────────────────────────┐
│ Subject: [Organic*]                    │
│ Search: [                          ]   │
│                                        │
│ Showing: 10 Organic chapters          │
└────────────────────────────────────────┘

Step 2: Type search query
┌────────────────────────────────────────┐
│ Subject: [Organic*]                    │
│ Search: [benzene                   ]   │
│                                        │
│ Showing: 2 Organic chapters            │
│ (matching "benzene")                   │
└────────────────────────────────────────┘

Step 3: Clear subject filter
┌────────────────────────────────────────┐
│ Subject: [All*]                        │
│ Search: [benzene                   ]   │
│                                        │
│ Showing: 5 chapters from all subjects  │
│ (matching "benzene")                   │
└────────────────────────────────────────┘
```

---

## Responsive Design

### Desktop (>1024px):
```
┌─────────────────────────────────────────────────────────┐
│ [All] [Physical] [Inorganic] [Organic] [Practical]     │
│                                                         │
│ ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐       │
│ │ Card 1 │  │ Card 2 │  │ Card 3 │  │ Card 4 │       │
│ └────────┘  └────────┘  └────────┘  └────────┘       │
└─────────────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px):
```
┌─────────────────────────────────────────┐
│ [All] [Physical] [Inorganic]           │
│ [Organic] [Practical]                  │
│                                        │
│ ┌────────┐  ┌────────┐  ┌────────┐   │
│ │ Card 1 │  │ Card 2 │  │ Card 3 │   │
│ └────────┘  └────────┘  └────────┘   │
└─────────────────────────────────────────┘
```

### Mobile (<768px):
```
┌──────────────────────┐
│ [All] [Physical]    │
│ [Inorganic]         │
│ [Organic]           │
│ [Practical]         │
│                     │
│ ┌────────────────┐ │
│ │    Card 1      │ │
│ └────────────────┘ │
│                     │
│ ┌────────────────┐ │
│ │    Card 2      │ │
│ └────────────────┘ │
└──────────────────────┘
```

---

## Animation & Transitions

### Pill Click Animation:
```
Inactive → Active:
1. Background: Gray → Gradient (300ms)
2. Shadow: None → Glow (300ms)
3. Text: Gray → White (300ms)
4. Scale: 1.0 → 1.05 (200ms)
```

### Tag Hover Effect:
```
Normal → Hover:
1. Scale: 1.0 → 1.05 (200ms)
2. Shadow: None → Small (200ms)
```

### Chapter Card Hover:
```
Normal → Hover:
1. Border: Gray → Cyan (300ms)
2. Icon: Scale 1.0 → 1.1 (300ms)
3. Title: White → Cyan (300ms)
4. Arrow: Translate 0 → 8px (300ms)
```

---

## Accessibility

### Keyboard Navigation:
- Tab through pills
- Enter/Space to select
- Arrow keys to navigate

### Screen Reader:
```html
<button 
  aria-label="Filter by Physical Chemistry"
  aria-pressed="true"
  role="tab"
>
  Physical
</button>
```

### Color Contrast:
- All text meets WCAG AA standards
- Active pills: White on gradient (high contrast)
- Tags: Colored text on light background (readable)

---

## Browser Support

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers (iOS Safari, Chrome Mobile)

---

**Visual Guide Complete!**
This shows exactly how the subject structure looks and behaves in the PYQ section.
