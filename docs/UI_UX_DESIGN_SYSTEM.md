# FoodHub UI/UX Design System

## 🎨 Design Philosophy

**"Clarity over Complexity"**

FoodHub's design prioritizes:
1. **Simplicity**: Minimal cognitive load
2. **Speed**: Fast interactions, instant feedback
3. **Trust**: Professional, reliable appearance
4. **Accessibility**: Usable by everyone
5. **Mobile-First**: Optimized for small screens

## 🎯 Design Principles

### 1. Progressive Disclosure
Show only what's needed, when it's needed.
- Menu → Cart → Checkout → Confirmation
- Each step focuses on one task

### 2. Consistent Patterns
Same interactions work the same way everywhere.
- All buttons have consistent styling
- All cards have the same structure
- All forms follow the same layout

### 3. Immediate Feedback
Users always know what's happening.
- Loading states for async actions
- Success animations for completions
- Error messages with clear solutions

### 4. Forgiving Design
Prevent errors, make recovery easy.
- Confirmation dialogs for destructive actions
- Clear error messages
- Easy undo/cancel options

## 🎨 Visual Design System

### Color Palette

#### Primary Colors (Food Orange)
```css
--primary-50:  #fff7ed  /* Lightest tint */
--primary-100: #ffedd5
--primary-200: #fed7aa
--primary-300: #fdba74
--primary-400: #fb923c
--primary-500: #FF6B35  /* Main brand color */
--primary-600: #ea580c  /* Hover state */
--primary-700: #c2410c
--primary-800: #9a3412
--primary-900: #7c2d12  /* Darkest shade */
```

**Usage:**
- Primary actions (Place Order, Confirm)
- Brand elements (logo, headers)
- Active states
- Links and highlights

#### Success Colors (Green)
```css
--success-500: #10B981  /* Main success color */
--success-600: #16a34a  /* Hover state */
```

**Usage:**
- Delivery confirmation
- Success messages
- Positive status indicators
- Completed states

#### Neutral Colors (Grays)
```css
--neutral-50:  #fafafa  /* Background */
--neutral-100: #f5f5f5  /* Card background */
--neutral-200: #e5e5e5  /* Borders */
--neutral-300: #d4d4d4
--neutral-400: #a3a3a3
--neutral-500: #737373  /* Body text */
--neutral-600: #525252
--neutral-700: #404040  /* Headings */
--neutral-800: #262626
--neutral-900: #171717  /* Darkest text */
```

#### Status Colors
```css
--yellow-100: #fef3c7  /* Pending */
--yellow-800: #92400e

--blue-100: #dbeafe    /* Confirmed */
--blue-800: #1e40af

--purple-100: #f3e8ff  /* Out for Delivery */
--purple-800: #6b21a8

--red-100: #fee2e2     /* Cancelled */
--red-800: #991b1b
```

### Typography

#### Font Family
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

**Why Inter?**
- Excellent readability at small sizes
- Professional appearance
- Wide language support
- Free and open-source

#### Type Scale
```css
/* Headings */
h1: 32px / 2rem    font-weight: 600  /* Page titles */
h2: 24px / 1.5rem  font-weight: 600  /* Section titles */
h3: 20px / 1.25rem font-weight: 600  /* Card titles */
h4: 18px / 1.125rem font-weight: 600 /* Subsections */

/* Body */
base: 16px / 1rem   font-weight: 400  /* Body text */
sm:   14px / 0.875rem font-weight: 400 /* Secondary text */
xs:   12px / 0.75rem  font-weight: 400 /* Captions */

/* Special */
lg:   18px / 1.125rem font-weight: 500 /* Emphasized text */
xl:   20px / 1.25rem  font-weight: 600 /* Large numbers */
2xl:  24px / 1.5rem   font-weight: 700 /* Prices */
```

#### Line Height
```css
tight:  1.25  /* Headings */
normal: 1.5   /* Body text */
relaxed: 1.75 /* Long-form content */
```

### Spacing System

**8px Grid System**
```css
0:   0px
1:   4px   (0.25rem)
2:   8px   (0.5rem)   /* Base unit */
3:   12px  (0.75rem)
4:   16px  (1rem)     /* Standard spacing */
5:   20px  (1.25rem)
6:   24px  (1.5rem)   /* Section spacing */
8:   32px  (2rem)     /* Large spacing */
12:  48px  (3rem)     /* Extra large spacing */
16:  64px  (4rem)     /* Page margins */
```

**Usage Guidelines:**
- **4px (1)**: Icon spacing, tight layouts
- **8px (2)**: Element padding, small gaps
- **16px (4)**: Card padding, button padding
- **24px (6)**: Section spacing, card gaps
- **32px (8)**: Page sections, large gaps

### Border Radius
```css
--radius-sm:     4px   /* Small elements */
--radius-button: 8px   /* Buttons, inputs */
--radius-card:   12px  /* Cards, modals */
--radius-lg:     16px  /* Large containers */
--radius-full:   9999px /* Pills, badges */
```

### Shadows

#### Elevation System
```css
/* Card Shadow (Elevation 1) */
shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.1),
             0 1px 2px 0 rgba(0, 0, 0, 0.06);

/* Card Hover (Elevation 2) */
shadow-card-hover: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                   0 2px 4px -1px rgba(0, 0, 0, 0.06);

/* Button Shadow (Elevation 1) */
shadow-button: 0 1px 2px 0 rgba(0, 0, 0, 0.05);

/* Modal Shadow (Elevation 3) */
shadow-modal: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
              0 4px 6px -2px rgba(0, 0, 0, 0.05);

/* Dropdown Shadow (Elevation 2) */
shadow-dropdown: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
                 0 2px 4px -1px rgba(0, 0, 0, 0.06);
```

## 🧩 Component Library

### Buttons

#### Primary Button
```jsx
<button className="btn btn-primary">
  Place Order
</button>
```
**Style:**
- Background: `primary-500`
- Text: White
- Padding: `16px 24px`
- Border Radius: `8px`
- Font Weight: 500
- Shadow: `shadow-button`
- Hover: `primary-600` + lift effect

**Usage:** Main actions (Place Order, Confirm, Submit)

#### Secondary Button
```jsx
<button className="btn btn-secondary">
  Cancel
</button>
```
**Style:**
- Background: White
- Text: `neutral-700`
- Border: `1px solid neutral-300`
- Hover: `neutral-50` background

**Usage:** Secondary actions (Cancel, Back, View Details)

#### Success Button
```jsx
<button className="btn btn-success">
  Confirm Delivery
</button>
```
**Style:**
- Background: `success-500`
- Text: White
- Hover: `success-600`

**Usage:** Positive confirmations (Delivery confirmed, Payment received)

#### Button Sizes
```jsx
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Default</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Cards

#### Basic Card
```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```
**Style:**
- Background: White
- Padding: `16px`
- Border Radius: `12px`
- Shadow: `shadow-card`

#### Hoverable Card
```jsx
<div className="card card-hover">
  <h3>Menu Item</h3>
</div>
```
**Interaction:**
- Hover: Lift effect + `shadow-card-hover`
- Cursor: Pointer
- Transition: 200ms ease

### Inputs

#### Text Input
```jsx
<input 
  type="text" 
  className="input" 
  placeholder="Enter your name"
/>
```
**Style:**
- Padding: `12px 16px`
- Border: `1px solid neutral-300`
- Border Radius: `8px`
- Focus: `2px ring primary-500`

#### Input with Error
```jsx
<input className="input input-error" />
<p className="text-sm text-red-600 mt-1">
  This field is required
</p>
```

### Badges

#### Status Badges
```jsx
<span className="badge badge-pending">Pending</span>
<span className="badge badge-confirmed">Confirmed</span>
<span className="badge badge-out-for-delivery">Out for Delivery</span>
<span className="badge badge-delivered">Delivered</span>
<span className="badge badge-cancelled">Cancelled</span>
```

**Style:**
- Padding: `4px 10px`
- Border Radius: `9999px` (pill shape)
- Font Size: `12px`
- Font Weight: 500

### Loading States

#### Spinner
```jsx
<div className="spinner" />
```

#### Button Loading
```jsx
<button className="btn btn-primary" disabled>
  <div className="spinner-sm" />
  Loading...
</button>
```

#### Skeleton Loader
```jsx
<div className="animate-pulse">
  <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2" />
  <div className="h-4 bg-neutral-200 rounded w-1/2" />
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large desktops */
```

### Mobile-First Approach
```jsx
{/* Mobile: Stack vertically */}
<div className="flex flex-col md:flex-row gap-4">
  <div className="w-full md:w-1/2">Left</div>
  <div className="w-full md:w-1/2">Right</div>
</div>
```

### Touch Targets
**Minimum size: 44x44px** (Apple HIG, Material Design)

```jsx
{/* Good: Large enough for touch */}
<button className="min-h-[44px] min-w-[44px]">
  <Icon size={20} />
</button>
```

## 🎭 Micro-Interactions

### Transitions
```css
/* Default transition */
transition: all 200ms ease-in-out;

/* Specific properties */
transition: transform 200ms ease-out,
            opacity 200ms ease-in;
```

### Animations

#### Fade In
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 200ms ease-in;
}
```

#### Slide Up
```css
@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
.animate-slide-up {
  animation: slideUp 300ms ease-out;
}
```

#### Button Hover
```css
.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
```

### Success States
```jsx
{/* Checkmark animation */}
<div className="flex items-center gap-2 text-success-600">
  <Check className="animate-scale-in" />
  <span>Order confirmed!</span>
</div>
```

## 📐 Layout Patterns

### Page Layout
```jsx
<div className="min-h-screen bg-neutral-50">
  {/* Header */}
  <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
    <div className="max-w-7xl mx-auto px-4 py-4">
      {/* Header content */}
    </div>
  </header>

  {/* Main Content */}
  <main className="max-w-7xl mx-auto px-4 py-6">
    {/* Page content */}
  </main>
</div>
```

### Grid Layout (Menu)
```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {products.map(product => (
    <MenuCard key={product.id} product={product} />
  ))}
</div>
```

### Two-Column Layout (Checkout)
```jsx
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Main content (2/3) */}
  <div className="lg:col-span-2">
    <CheckoutForm />
  </div>
  
  {/* Sidebar (1/3) */}
  <div className="lg:col-span-1">
    <OrderSummary />
  </div>
</div>
```

## ♿ Accessibility

### WCAG 2.1 AA Compliance

#### Color Contrast
- **Normal text**: Minimum 4.5:1
- **Large text (18px+)**: Minimum 3:1
- **UI components**: Minimum 3:1

#### Keyboard Navigation
```jsx
{/* All interactive elements must be keyboard accessible */}
<button 
  className="btn"
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Click me
</button>
```

#### Screen Reader Support
```jsx
{/* Use semantic HTML */}
<nav aria-label="Main navigation">
  <ul>
    <li><a href="/menu">Menu</a></li>
  </ul>
</nav>

{/* Provide alt text */}
<img src="food.jpg" alt="Jollof rice with grilled chicken" />

{/* Use ARIA labels */}
<button aria-label="Close modal">
  <X size={20} />
</button>
```

#### Focus Indicators
```css
/* Visible focus ring */
.btn:focus {
  outline: 2px solid var(--primary-500);
  outline-offset: 2px;
}
```

## 📊 Design Metrics

### Performance Budget
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1

### Image Optimization
- **Format**: WebP with JPEG fallback
- **Compression**: 80% quality
- **Lazy Loading**: Below the fold
- **Responsive**: Multiple sizes via srcset

## 🎨 Brand Guidelines

### Logo Usage
- **Minimum size**: 32px height
- **Clear space**: 16px on all sides
- **Color variations**: Full color, white, black

### Voice & Tone
- **Friendly**: Warm, approachable language
- **Clear**: Simple, direct communication
- **Helpful**: Anticipate user needs
- **Professional**: Trustworthy, reliable

### Writing Style
- **Headings**: Sentence case
- **Buttons**: Action verbs (Place Order, not Submit)
- **Error messages**: Explain what happened + how to fix
- **Success messages**: Celebrate the action

## 📱 Platform-Specific Patterns

### iOS
- **Safe areas**: Respect notch and home indicator
- **Haptic feedback**: On important actions
- **Swipe gestures**: Back navigation

### Android
- **Material ripple**: Touch feedback
- **FAB**: Floating action button for primary action
- **Bottom sheets**: For secondary actions

### Web
- **Hover states**: Desktop interactions
- **Keyboard shortcuts**: Power user features
- **Breadcrumbs**: Navigation context
