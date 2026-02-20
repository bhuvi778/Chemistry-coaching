# Featured Batches - Random Course Display

## 🎲 What Changed

The **Featured Batches** section on the Home page now displays **random courses** every time the website is refreshed, instead of always showing the same first 3 courses.

## ✨ Implementation Details

### Before
```javascript
const featuredCourses = Array.isArray(courses) ? courses.slice(0, 3) : [];
```
- Always showed the first 3 courses
- Static display
- No variation on refresh

### After
```javascript
const [featuredCourses, setFeaturedCourses] = useState([]);

// Fisher-Yates shuffle algorithm for true randomization
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Select random courses on component mount and when courses change
useEffect(() => {
  if (Array.isArray(courses) && courses.length > 0) {
    const shuffled = shuffleArray(courses);
    const randomCourses = shuffled.slice(0, Math.min(3, courses.length));
    setFeaturedCourses(randomCourses);
  }
}, [courses]);
```

## 🔧 How It Works

1. **Fisher-Yates Shuffle Algorithm**: 
   - Industry-standard algorithm for true randomization
   - Ensures every course has an equal chance of being selected
   - O(n) time complexity - very efficient

2. **React State Management**:
   - Uses `useState` to store the randomly selected courses
   - Uses `useEffect` to shuffle courses when component mounts or courses data changes

3. **Smart Selection**:
   - Shuffles all available courses
   - Selects the first 3 from the shuffled array
   - Handles edge cases (fewer than 3 courses available)

## 🎯 User Experience

### What Users Will See:
- ✅ Different courses on every page refresh
- ✅ Fair rotation of all available courses
- ✅ Same smooth UI and animations
- ✅ No loading delays or flickering

### When Randomization Happens:
- 🔄 On initial page load
- 🔄 When navigating back to home page
- 🔄 When browser is refreshed (F5 or Ctrl+R)
- 🔄 When courses data is updated in the backend

## 📊 Benefits

1. **Better Course Visibility**: All courses get equal exposure
2. **Increased Engagement**: Users see different content on each visit
3. **Fair Promotion**: No course is permanently "hidden" below the fold
4. **Fresh Experience**: Website feels dynamic and updated

## 🧪 Testing

To test the randomization:

1. **Visit the home page**: `http://localhost:5173`
2. **Note the 3 featured courses** displayed
3. **Refresh the page** (F5 or Ctrl+R)
4. **Observe different courses** appearing in the Featured Batches section
5. **Repeat** multiple times to see the variety

## 🔍 Technical Notes

### Why Fisher-Yates?
- **Unbiased**: Every permutation has equal probability
- **Efficient**: Single pass through the array
- **In-place**: Minimal memory overhead
- **Industry Standard**: Used by major platforms

### Edge Cases Handled:
- ✅ Empty courses array
- ✅ Fewer than 3 courses available
- ✅ Courses data not yet loaded
- ✅ Courses array is null or undefined

## 🎨 No Visual Changes

The UI remains exactly the same:
- Same card design
- Same layout and spacing
- Same animations and hover effects
- Same "Explore All Batches" button

Only the **content** (which courses are shown) changes randomly.

## 🚀 Performance

- **No Performance Impact**: Shuffling is O(n) and happens once per load
- **No API Calls**: Uses existing courses data
- **No Delays**: Instant randomization
- **Memory Efficient**: Creates only one shuffled copy

## 📝 Code Location

**File**: `/www/wwwroot/reaction-lab/src/pages/Home.jsx`

**Lines Modified**: 1-35 (imports and course selection logic)

## 🎉 Result

Every time a user visits or refreshes the home page, they'll see a **fresh selection** of 3 random courses from your entire course catalog, giving all your courses equal visibility and keeping the website experience dynamic and engaging!
