# Concept Note Card Component

## Overview
The `ConceptNoteCard` is a premium, interactive card component designed to display concept-wise notes in a visually stunning way. It features flip animations, subject-specific theming, difficulty badges, and practice question previews.

## Features

### 🎨 Dynamic Theming
- **Subject-Specific Colors**: Each chemistry subject has its own color gradient and icon
  - Physical Chemistry: Blue to Indigo (⚛️ Atom icon)
  - Organic Chemistry: Green to Emerald (🍃 Leaf icon)
  - Inorganic Chemistry: Purple to Pink (🧪 Flask icon)
  - General Chemistry: Orange to Red (📚 Book icon)
  - Chemistry (default): Cyan to Teal (🧪 Vial icon)

### 🔄 Flip Animation
- **3D Card Flip**: Smooth 180° rotation to reveal the back of the card
- **Front Side**: Shows concept name, preview content, stats, and action button
- **Back Side**: Displays practice questions preview and visual resources

### ✨ Premium Design
- **Glassmorphism**: Modern glass panel effect with backdrop blur
- **Glow Effects**: Subject-specific glow on hover
- **Animated Gradients**: Dynamic background patterns
- **Smooth Transitions**: All interactions are buttery smooth

### 📝 Content Display
- **Concept Name**: Bold, prominent title
- **Content Preview**: Truncated HTML content (150 characters)
- **Images**: Grid display of visual resources
- **Practice Questions**: Preview of questions with difficulty badges

### 🎯 Difficulty Levels
- **Easy**: Green badge
- **Medium**: Yellow badge
- **Hard**: Red badge

## Usage

### Basic Example

```jsx
import ConceptNoteCard from '../components/ConceptNoteCard';

function MyComponent() {
  const handleCardClick = (concept) => {
    console.log('Card clicked:', concept);
    // Navigate to concept detail page or open modal
  };

  return (
    <ConceptNoteCard
      conceptName="Electrochemistry Basics"
      content="<p>Electrochemistry is the branch of chemistry...</p>"
      images={[
        { url: "image-url.jpg", caption: "Diagram 1" }
      ]}
      practiceQuestions={[
        {
          question: "What is the standard electrode potential?",
          options: ["0.00 V", "1.00 V", "-1.00 V", "0.76 V"],
          correctAnswer: 0,
          difficulty: "Easy",
          explanation: "By convention, SHE is 0.00 V"
        }
      ]}
      subject="Physical Chemistry"
      difficulty="Medium"
      onClick={handleCardClick}
    />
  );
}
```

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `conceptName` | string | ✅ Yes | - | Name of the concept |
| `content` | string | ✅ Yes | - | HTML content of the concept |
| `images` | array | ❌ No | `[]` | Array of image objects with `url` and `caption` |
| `practiceQuestions` | array | ❌ No | `[]` | Array of practice question objects |
| `subject` | string | ❌ No | `'Chemistry'` | Subject name for theming |
| `difficulty` | string | ❌ No | `'Medium'` | Difficulty level: Easy, Medium, or Hard |
| `onClick` | function | ❌ No | - | Callback when card is clicked |
| `className` | string | ❌ No | `''` | Additional CSS classes |

### Practice Question Object Structure

```javascript
{
  question: "Question text",
  options: ["Option 1", "Option 2", "Option 3", "Option 4"],
  correctAnswer: 0, // Index of correct option
  difficulty: "Easy", // Easy, Medium, or Hard
  explanation: "Explanation text"
}
```

### Image Object Structure

```javascript
{
  url: "https://example.com/image.jpg",
  caption: "Image description"
}
```

## Integration with Existing System

### Using with ConceptWiseNotes Data

```jsx
import ConceptNoteCard from '../components/ConceptNoteCard';

function ConceptGrid({ concepts, subject }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {concepts.map((concept, index) => (
        <ConceptNoteCard
          key={index}
          conceptName={concept.conceptName}
          content={concept.content}
          images={concept.images}
          practiceQuestions={concept.practiceQuestions}
          subject={subject}
          difficulty={concept.difficulty || 'Medium'}
          onClick={() => {
            // Navigate to concept detail
            window.location.href = `/concept/${concept._id}`;
          }}
        />
      ))}
    </div>
  );
}
```

## Demo Page

Visit `/concept-card-demo` to see the component in action with sample data.

The demo page includes:
- 6 sample concept cards covering different subjects
- Interactive flip functionality
- Modal view for selected concepts
- Instructions and feature highlights

## Styling

The component uses:
- **Tailwind CSS** for utility classes
- **Custom CSS** for 3D transforms and animations
- **Glass panel** effect from your existing design system

### Custom Scrollbar

The back of the card includes a custom scrollbar for the practice questions list:
- Width: 4px
- Track: Semi-transparent gray
- Thumb: Cyan with hover effect

## Browser Compatibility

The component uses modern CSS features:
- `transform-style: preserve-3d`
- `backface-visibility: hidden`
- `backdrop-filter: blur()`

Supported browsers:
- ✅ Chrome 76+
- ✅ Firefox 72+
- ✅ Safari 13+
- ✅ Edge 79+

## Performance Considerations

- **Image Loading**: Images are lazy-loaded by default
- **Content Truncation**: Long content is truncated to prevent layout issues
- **Smooth Animations**: Hardware-accelerated transforms for 60fps animations

## Customization

### Changing Subject Colors

Edit the `subjectColors` object in the component:

```javascript
const subjectColors = {
  'Your Subject': {
    gradient: 'from-color-500 to-color-600',
    icon: 'fa-icon-name',
    glow: 'rgba(r, g, b, 0.3)'
  }
};
```

### Adjusting Content Preview Length

Change the `maxLength` parameter in `getPreviewContent`:

```javascript
getPreviewContent(content, 200) // Show 200 characters instead of 150
```

## Accessibility

- ✅ Keyboard navigation support
- ✅ ARIA labels for interactive elements
- ✅ Semantic HTML structure
- ✅ Color contrast meets WCAG AA standards

## Future Enhancements

Potential improvements:
- [ ] Add bookmark/favorite functionality
- [ ] Include progress tracking
- [ ] Add sharing capabilities
- [ ] Implement card animations on scroll
- [ ] Add audio pronunciation for concept names
- [ ] Include related concepts suggestions

## Support

For issues or questions:
1. Check the demo page at `/concept-card-demo`
2. Review the sample code in `ConceptCardDemo.jsx`
3. Ensure all dependencies are installed
4. Verify Tailwind CSS configuration includes necessary utilities

## License

This component is part of the Reaction Lab project.
