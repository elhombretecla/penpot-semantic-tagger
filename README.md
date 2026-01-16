# Semantic Tagging Plugin for Penpot

An advanced plugin for Penpot that allows assigning semantic tags (HTML and UI components) to design elements, facilitating code export and collaboration between designers and developers.

<img width="1497" height="888" alt="cover-plugin" src="https://github.com/user-attachments/assets/d191c09c-0df3-41aa-9e47-a1197eb72f5c" />

## 🚀 Main Features

- **Auto-Tagging**: Automatically tags elements based on layer naming conventions
- **Tree Structure**: Exports elements with parent-child hierarchy using the `children` property
- **Detailed Styles**: Captures complete CSS properties (colors, typography, borders, shadows)
- **Layout Information**: Automatically detects Flexbox and Grid properties
- **Semantic Tagging**: Assigns standard HTML tags and components from popular libraries (Material UI, Chakra UI, Bootstrap)
- **Custom Properties**: Defines attributes, CSS classes, events, and specific properties
- **Advanced JSON Export**: Exports with tree structure and complete metadata
- **Intuitive Interface**: Responsive UI that adapts to Penpot's theme
- **Reactive Selection**: Automatically responds to selection changes on the canvas

## 📦 Installation and Setup

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Access to Penpot (web or desktop)

### Installation Steps

1. **Clone or download the project**
```bash
git clone <repository-url>
cd semantic-tagging-plugin
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm run dev
```

4. **Install in Penpot**
   - Open Penpot in your browser
   - Go to Plugins → Manage Plugins
   - Click "Install Plugin"
   - Paste the manifest URL: `http://localhost:4400/manifest.json`
   - The plugin will appear in your plugins panel
     
<img width="2128" height="1892" alt="plugin-tags" src="https://github.com/user-attachments/assets/ab58b59c-cbc0-480b-8025-1d5bdc6af2cd" />

## 🎯 How to Use the Plugin

### 1. Basic Tagging

1. **Select an element** on the Penpot canvas
2. **Open the plugin** from the plugins panel
3. **Choose a tag** from the dropdown or enter a custom one:
   - Basic HTML: `div`, `button`, `input`, `img`, etc.
   - Material UI: `MuiButton`, `MuiTextField`, `MuiCard`, etc.
   - Chakra UI: `ChakraButton`, `ChakraInput`, `ChakraBox`, etc.
   - Bootstrap: `BsButton`, `BsCard`, `BsNavbar`, etc.

### 2. Property Assignment

The plugin automatically suggests properties based on the selected tag:

**For `button`:**
- `type`: button, submit, reset
- `onClick`: function name

**For `input`:**
- `type`: text, password, email, number
- `placeholder`: help text
- `required`: true/false

**For `MuiButton`:**
- `variant`: contained, outlined, text
- `color`: primary, secondary, error
- `onClick`: handler function

### 3. Custom Properties

- Click **"+ Add Property"** for additional fields
- Define custom key-value pairs
- Useful for CSS classes, ARIA attributes, custom data

### 4. Tag Management

- **Apply**: Save the tag and properties to the element
- **Remove**: Remove the tag from the selected element
- **View Tagged**: List all tagged elements in the project

### 5. 🏷️ Auto-Tagging

The most powerful feature of the plugin: automatically tags elements based on layer names.

**Naming Conventions:**
- `button/primary` → `<button className="btn-primary" type="button">`
- `input/email` → `<input type="email">`
- `nav/main` → `<nav className="nav-main">`
- `MuiButton/contained/primary` → `<MuiButton variant="contained" color="primary">`

**How to use:**
1. Name your layers following the conventions (see `auto-tagging-examples.md`)
2. Select elements or groups on the canvas
3. Enable the checkbox "Auto-tag using layer name"
4. Click "🏷️ Auto-Tag Selection"
5. The plugin will recursively process all elements and their children

### 6. 🎨 Code Generation

Transform your tagged design elements into clean, production-ready HTML and CSS code:

**How to use:**
1. Tag your design elements using any of the methods above
2. Click **"Generate HTML & CSS"** in the Code Generation section
3. Review the generated code in the HTML and CSS text areas
4. Click **"Copy HTML"** or **"Copy CSS"** to copy to clipboard
5. Paste directly into your project

**Features:**
- **Clean HTML Structure**: Semantic, properly nested HTML elements
- **Production-Ready CSS**: Organized styles with proper class names
- **Automatic Style Extraction**: Colors, typography, spacing, layout properties
- **Smart Class Generation**: Uses your custom className or generates from element names
- **Flexbox & Grid Support**: Automatically detects and generates layout CSS
- **Smart CSS Scoping**: Automatically prevents CSS collisions between boards and within the same board (see below)
- **Copy to Clipboard**: One-click copying with visual feedback

**Example Output:**
```html
<div class="hero-section">
  <h1 class="main-heading">Welcome to Our Platform</h1>
  <p class="hero-description">Build amazing experiences...</p>
  <div class="cta-buttons">
    <button class="btn-primary" type="button">Get Started</button>
    <button class="btn-secondary" type="button">Learn More</button>
  </div>
</div>
```

### 7. Export

- Click **"Export Tags (JSON)"**
- A modal opens with structured information
- Copy to clipboard or save to a .json file
- Includes project metadata, positions, sizes, and properties

### 🎯 Smart CSS Scoping by Board

The plugin automatically detects and resolves CSS selector collisions between boards (frames/artboards). This ensures that elements with the same class name in different boards don't interfere with each other.

**Key behaviors:**

- **No collisions = No changes**: If the same selector only appears in one board, the CSS is generated exactly as before with no prefixes.
- **Automatic collision detection**: When the same selector (e.g., `.circle`) appears in multiple boards with different styles, the plugin automatically applies scoping.
- **Minimal HTML changes**: Board IDs are only added to the HTML when strictly necessary for scoping.

**How it works:**

1. The plugin analyzes all CSS selectors across all boards
2. If a selector appears in multiple boards, it prefixes each rule with the board's scope selector
3. Board scope selector priority:
   - Uses the board's existing `id` attribute (e.g., `#scene-1`)
   - Uses the board's existing `className` (e.g., `.hero-section`)
   - Auto-generates an ID (e.g., `#board-abc123`) only when no id/class exists

**Example - No collision (unchanged output):**

If `.circle` only appears in one board:
```css
.circle {
  width: 40px;
  height: 40px;
  background-color: #ff0000;
}
```

**Example - With collision (automatic scoping):**

If `.circle` appears in multiple boards with different styles:
```css
#board-1 .circle {
  width: 40px;
  height: 40px;
  background-color: #ff0000;
}

#board-2 .circle {
  width: 60px;
  height: 60px;
  background-color: #00ff00;
}
```

**Benefits:**
- Existing projects without collisions produce identical CSS
- No manual intervention needed for multi-board designs
- Styles are isolated per board when needed
- HTML stays clean unless scoping requires ID injection

### 🔀 Local Scope Collision Resolution

When multiple elements share the same CSS selector but have **different styles within the same board**, the plugin automatically resolves the conflict to preserve all styles.

**How it works:**

1. The plugin detects when the same selector (e.g., `.button`) appears multiple times with different CSS properties
2. It attempts to scope the conflicting rules using an ancestor element's selector:
   - Looks for a parent with an `id` attribute
   - Falls back to a parent with a `className`
3. If no suitable ancestor exists, it auto-generates a unique ID for the element

**Example - Same selector, different styles in same board:**

Given this structure:
```html
<div class="container-a">
  <div class="button">Blue button</div>
</div>
<div class="container-b">
  <div class="button">Gray button</div>
</div>
```

The plugin generates:
```css
.container-a .button {
  background-color: #0066ff;
}

.container-b .button {
  background-color: #999999;
}
```

**Fallback with auto-generated IDs:**

If neither element has a distinguishing ancestor, the plugin injects unique IDs:
```css
#el-abc123 {
  background-color: #0066ff;
}

.button {
  background-color: #999999;
}
```

**Key guarantees:**
- No styles are ever lost due to selector collisions
- Elements without collisions are not modified
- ID/class injection happens only when strictly necessary
- Existing class names and IDs are always preferred over auto-generated ones

## 🛠️ Development

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production build
npm run build
```

## 📊 Enhanced Export Format 

The exported JSON file includes a clean structure:

### 🌳 Tree Structure (Recommended for Development)

```json
{
  "metadata": {
    "pluginName": "Semantic Tagging Plugin",
    "version": "2.0.0",
    "exportDate": "2025-01-16T10:30:00.000Z",
    "fileName": "Login Page Design",
    "pageName": "Desktop Version",
    "totalElements": 5,
    "description": "Enhanced export with tree structure, styles, content, and layout information"
  },
  "tree": [
    {
      "tag": "div",
      "properties": {
        "className": "profile-card"
      },
      "elementId": "group-123",
      "elementName": "Profile Card",
      "elementType": "group",
      "styles": {
        "backgroundColor": "rgba(255, 255, 255, 1)",
        "borderRadius": "8px",
        "boxShadow": "0px 4px 12px rgba(0, 0, 0, 0.1)",
        "width": "320px",
        "height": "400px"
      },
      "layout": {
        "display": "flex",
        "flexDirection": "column",
        "alignItems": "center",
        "gap": "16px"
      },
      "children": [
        {
          "tag": "img",
          "properties": {
            "alt": "User profile picture"
          },
          "elementName": "avatar",
          "elementType": "image",
          "imageUrl": "assets/user-avatar.png",
          "styles": {
            "width": "80px",
            "height": "80px",
            "borderRadius": "50%"
          },
          "children": []
        },
        {
          "tag": "h2",
          "elementName": "user-name",
          "elementType": "text",
          "content": "Ana García",
          "styles": {
            "fontSize": "18px",
            "fontWeight": "700",
            "color": "rgba(0, 0, 0, 0.85)"
          },
          "children": []
        }
      ]
    }
  ]
}
```


## 🔧 Customization

### Adding New UI Libraries

Edit `index.html` to add new optgroups:

```html
<optgroup label="Ant Design">
  <option value="AntButton">AntButton</option>
  <option value="AntInput">AntInput</option>
</optgroup>
```

### Suggested Properties

Modify the `getSuggestedProperties()` function in `main.ts`:

```typescript
const suggestions: Record<string, Array<{key: string, value: string, placeholder: string}>> = {
  "AntButton": [
    { key: "type", value: "primary", placeholder: "primary, default, dashed" },
    { key: "size", value: "middle", placeholder: "large, middle, small" }
  ]
};
```

## 🌐 Production Configuration

The plugin uses a simplified approach for image URLs that works reliably in both development and production environments.

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is under the MIT License. See the `LICENSE` file for more details.

## 🔗 Useful Links

- [Penpot Plugins Documentation](https://help.penpot.app/plugins/)
- [Penpot API Reference](https://penpot.app/plugins-api/)
- [Official Plugins Repository](https://github.com/penpot/penpot-plugins)
- [Penpot Community](https://community.penpot.app/)

## 📞 Support

If you encounter issues or have suggestions:
- Open an issue in the repository
- Join the Penpot community
- Check the official documentation

---
Made with ❤️ and Open Source | [Piweek](https://piweek.com)
