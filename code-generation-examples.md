# Code Generation Examples

This document shows examples of how the Penpot Semantic Tagging Plugin generates HTML and CSS code from your tagged design elements.

## How It Works

1. **Tag Your Elements**: Use the plugin to assign HTML tags and properties to your Penpot design elements
2. **Generate Code**: Click "Generate HTML & CSS" to convert your tagged elements into clean code
3. **Copy & Use**: Copy the generated HTML and CSS to use in your projects

## Example 1: Simple Hero Section

### Input (Tagged Elements in Penpot)
```
Group: "hero-section" → Tagged as <div> with className="hero-section"
├── Text: "Welcome" → Tagged as <h1> with className="main-heading"  
├── Text: "Description" → Tagged as <p> with className="hero-description"
└── Group: "buttons" → Tagged as <div> with className="cta-buttons"
    ├── Rectangle: "Get Started" → Tagged as <button> with className="btn-primary"
    └── Rectangle: "Learn More" → Tagged as <button> with className="btn-secondary"
```

### Generated HTML
```html
<div class="hero-section" id="hero">
  <h1 class="main-heading">
    Welcome to Our Platform
  </h1>
  <p class="hero-description">
    Build amazing experiences with our powerful design tools and seamless workflow.
  </p>
  <div class="cta-buttons">
    <button class="btn-primary" type="button">
      Get Started
    </button>
    <button class="btn-secondary" type="button">
      Learn More
    </button>
  </div>
</div>
```

### Generated CSS
```css
.hero-section {
  width: 1440px;
  background-color: #F8F9FA;
  padding: 32px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  justify-content: center;
  align-items: center;
}

.main-heading {
  font-size: 48px;
  font-weight: 700;
  color: #1A202C;
  text-align: center;
  margin-bottom: 16px;
}

.hero-description {
  font-size: 18px;
  color: #4A5568;
  text-align: center;
  max-width: 600px;
  line-height: 1.6;
}

.cta-buttons {
  margin-top: 32px;
  display: flex;
  gap: 16px;
  justify-content: center;
}

.btn-primary {
  background-color: #3182CE;
  color: white;
  padding: 12px 24px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}

.btn-secondary {
  background-color: transparent;
  color: #3182CE;
  padding: 12px 24px;
  border-radius: 6px;
  border: 2px solid #3182CE;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
}
```

## Example 2: Navigation Bar

### Input (Tagged Elements)
```
Group: "navbar" → Tagged as <nav> with className="navbar"
├── Text: "Logo" → Tagged as <div> with className="logo"
├── Group: "nav-links" → Tagged as <ul> with className="nav-links"
│   ├── Text: "Home" → Tagged as <li> with className="nav-item"
│   ├── Text: "About" → Tagged as <li> with className="nav-item"
│   └── Text: "Contact" → Tagged as <li> with className="nav-item"
└── Rectangle: "Sign In" → Tagged as <button> with className="sign-in-btn"
```

### Generated HTML
```html
<nav class="navbar">
  <div class="logo">
    Brand Logo
  </div>
  <ul class="nav-links">
    <li class="nav-item">Home</li>
    <li class="nav-item">About</li>
    <li class="nav-item">Contact</li>
  </ul>
  <button class="sign-in-btn" type="button">
    Sign In
  </button>
</nav>
```

## Example 3: Form Elements

### Input (Tagged Elements)
```
Group: "contact-form" → Tagged as <form> with className="contact-form"
├── Text: "Name" → Tagged as <label> with for="name"
├── Rectangle: "Name Input" → Tagged as <input> with type="text", id="name"
├── Text: "Email" → Tagged as <label> with for="email"  
├── Rectangle: "Email Input" → Tagged as <input> with type="email", id="email"
└── Rectangle: "Submit" → Tagged as <button> with type="submit"
```

### Generated HTML
```html
<form class="contact-form">
  <label for="name">Name</label>
  <input type="text" id="name" class="form-input">
  <label for="email">Email</label>
  <input type="email" id="email" class="form-input">
  <button type="submit" class="submit-btn">
    Submit
  </button>
</form>
```

## Key Features

### Automatic Style Extraction
- **Colors**: Background colors, text colors, border colors
- **Typography**: Font size, font weight, text alignment, line height
- **Spacing**: Padding, margins, gaps
- **Layout**: Flexbox and Grid properties
- **Dimensions**: Width, height, border radius
- **Effects**: Box shadows, opacity

### Smart CSS Class Generation
- Uses your custom `className` properties when provided
- Falls back to sanitized element names (e.g., "Hero Section" → "hero-section")
- Generates semantic, readable class names

### Hierarchical Structure
- Maintains parent-child relationships from your Penpot design
- Properly nests HTML elements
- Preserves layout context (flex containers, grid layouts)

### Clean, Production-Ready Code
- Properly indented HTML and CSS
- Semantic HTML structure
- Efficient CSS with no redundancy
- Ready to copy and paste into your projects

## Tips for Better Code Generation

1. **Use Semantic Tags**: Choose appropriate HTML tags (header, nav, main, section, article)
2. **Add Class Names**: Provide meaningful className properties for better CSS organization
3. **Structure Your Design**: Group related elements to create proper HTML hierarchy
4. **Use Text Content**: Add actual text content to your design elements
5. **Consistent Naming**: Use consistent naming conventions for your layers and groups

## Supported HTML Tags

### Basic HTML
- div, span, p, h1-h6
- button, input, textarea, select, label
- img, a, ul, li
- nav, main, header, footer, section, article, aside

### UI Framework Components
- **Material UI**: MuiButton, MuiTextField, MuiCard, etc.
- **Chakra UI**: ChakraButton, ChakraInput, ChakraBox, etc.
- **Bootstrap**: BsButton, BsCard, BsNavbar, etc.

The plugin automatically handles the conversion of design properties to appropriate CSS styles, making it easy to go from design to code in minutes rather than hours.