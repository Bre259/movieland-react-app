# BackIcon Component Usage Guide

## Overview

The `BackIcon` component is a flexible and reusable back navigation button for your React application. It provides multiple styling options and can be customized to fit various design needs.

## Basic Usage

```jsx
import BackIcon from './BackIcon';

// Simple usage - will use browser's back functionality
<BackIcon />

// Custom click handler
<BackIcon onClick={() => console.log('Going back!')} />
```

## Props

| Prop        | Type     | Default                 | Description                               |
| ----------- | -------- | ----------------------- | ----------------------------------------- |
| `onClick`   | function | `window.history.back()` | Custom click handler                      |
| `size`      | number   | 24                      | Icon size in pixels                       |
| `color`     | string   | '#333'                  | Icon color                                |
| `className` | string   | ''                      | Additional CSS classes                    |
| `label`     | string   | 'Back'                  | Text label for the button                 |
| `showLabel` | boolean  | true                    | Whether to show the text label            |
| `style`     | string   | 'arrow'                 | Icon style: 'arrow', 'chevron', or 'text' |

## Examples

### Basic Back Button

```jsx
<BackIcon onClick={() => navigate(-1)} />
```

### Minimal Icon-Only Button

```jsx
<BackIcon showLabel={false} className="minimal" onClick={handleBack} />
```

### Different Sizes

```jsx
<BackIcon size={16} className="compact" label="Back" />
<BackIcon size={24} label="Back" />
<BackIcon size={32} className="large" label="Back" />
```

### Different Styles

```jsx
<BackIcon style="arrow" label="Arrow Style" />
<BackIcon style="chevron" label="Chevron Style" />
<BackIcon style="text" label="Text Style" />
```

### Color Variants

```jsx
<BackIcon className="primary" label="Primary" />
<BackIcon className="secondary" label="Secondary" />
<BackIcon className="success" label="Success" />
<BackIcon className="danger" label="Danger" />
```

## CSS Classes

The component comes with several predefined CSS classes:

- `.minimal` - Icon-only, circular button
- `.compact` - Smaller padding and font size
- `.large` - Larger padding and font size
- `.primary` - Primary color scheme
- `.secondary` - Secondary color scheme
- `.success` - Success color scheme
- `.danger` - Danger color scheme

## Integration Examples

### In a Page Header

```jsx
function PageHeader({ title, onBack }) {
  return (
    <header className="page-header">
      <BackIcon onClick={onBack} className="minimal" />
      <h1>{title}</h1>
    </header>
  );
}
```

### In a Modal

```jsx
function Modal({ isOpen, onClose, children }) {
  return (
    <div className={`modal ${isOpen ? "open" : ""}`}>
      <div className="modal-header">
        <BackIcon onClick={onClose} label="Close" className="secondary" />
      </div>
      {children}
    </div>
  );
}
```

### In Navigation

```jsx
function MovieDetails({ movie, onBack }) {
  return (
    <div className="movie-details">
      <div className="details-header">
        <BackIcon onClick={onBack} label="Back to Movies" className="primary" />
      </div>
      {/* Movie details content */}
    </div>
  );
}
```

## Accessibility

The component includes built-in accessibility features:

- Proper ARIA labels
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## Browser Support

The component uses modern SVG icons and CSS features. It supports:

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Customization

You can extend the component by:

1. **Adding custom CSS classes**
2. **Overriding CSS variables**
3. **Creating wrapper components**

### Custom CSS Example

```css
.my-custom-back-icon {
  background: linear-gradient(45deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
}

.my-custom-back-icon:hover {
  transform: scale(1.05);
}
```

## Common Use Cases

1. **Page Navigation** - Return to previous page
2. **Modal Dialogs** - Close modal windows
3. **Wizards/Steps** - Go to previous step
4. **Detail Views** - Return to list view
5. **Breadcrumb Navigation** - Navigate up hierarchy

## Tips

- Use the `minimal` class for tight spaces
- Combine with React Router's `useNavigate` hook
- Consider using different icon styles for different contexts
- Test with screen readers for accessibility
- Use consistent styling across your application
