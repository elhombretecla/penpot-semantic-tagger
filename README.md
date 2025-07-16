# Semantic Tagging Plugin for Penpot

An advanced plugin for Penpot that allows assigning semantic tags (HTML and UI components) to design elements, facilitating code export and collaboration between designers and developers.

## 🚀 Main Features

- **Smart Auto-Tagging**: Automatically tags elements based on layer naming conventions
- **Tree Structure**: Exports elements with parent-child hierarchy using the `children` property
- **Detailed Styles**: Captures complete CSS properties (colors, typography, borders, shadows)
- **Layout Information**: Automatically detects Flexbox and Grid properties
- **Enhanced View**: Improved interface showing content, styles, and layout of each element
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

### 5. 🏷️ Smart Auto-Tagging (NEW)

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

**Benefits:**
- **10x Productivity**: Tag complete components in seconds
- **Consistency**: Establishes a common "language" between design and development
- **Scalability**: Perfect for teams and large projects

### 6. Export

- Click **"Export Tags (JSON)"**
- A modal opens with structured information
- Copy to clipboard or save to a .json file
- Includes project metadata, positions, sizes, and properties

## 📁 Project Structure

```
semantic-tagging-plugin/
├── src/
│   ├── main.ts          # User interface logic
│   ├── plugin.ts        # Plugin logic (backend)
│   ├── style.css        # Interface styles
│   └── vite-env.d.ts    # Type definitions
├── public/
│   └── manifest.json    # Plugin manifest
├── index.html           # Interface HTML
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── README.md           # This file
```

## 🛠️ Development

### Available Scripts

```bash
# Development with auto-reload
npm run dev

# Production build
npm run build
```

### Plugin Architecture

**Frontend (main.ts)**:
- Handles user interface
- Processes forms and events
- Communicates with backend via postMessage

**Backend (plugin.ts)**:
- Interacts with Penpot API
- Manages metadata and persistence
- Handles selection and state changes

**Communication**:
- Bidirectional messages between UI and plugin
- Penpot events (selection, theme, page)
- Persistence in file metadata

## 📊 Enhanced Export Format 

The exported JSON file now includes a clean structure:

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

### 📋 New Properties Included

**Content and Media:**
- `content`: Real text extracted from the element
- `imageUrl`: Image asset URL

**Consolidated CSS Styles (single source of truth):**
- **Positioning**: `left`, `top`, `width`, `height` (always included)
- **Colors**: `backgroundColor`, `color` extracted from Penpot
- **Typography**: `fontFamily`, `fontSize`, `fontWeight`, `textAlign`, `lineHeight`
- **Borders**: `border`, `borderRadius`
- **Effects**: `boxShadow`, `opacity`
- **Spacing**: `padding`, `margin`

**Layout Information (automatically inferred):**
- `display`: flex, grid, etc.
- `flexDirection`: row, column
- `justifyContent`, `alignItems`: Alignment
- `gap`: Spacing between elements

**Hierarchy:**
- `children`: Array with direct child elements
- Nested structure that reflects the real design hierarchy
- **Unique IDs**: Each element has its unique `elementId` from Penpot

### 🎯 Latest Improvements

1. **No Redundancy**: Only `tree` structure, removed duplicate `elements` list
2. **Consolidated Styles**: All visual information in single `styles` object
3. **Unique IDs**: Each element maintains its real Penpot ID
4. **Complete Content**: Automatic extraction of text and images

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

## 🐛 Troubleshooting

### Plugin doesn't load
- Verify the development server is running
- Confirm the manifest URL: `http://localhost:4400/manifest.json`
- Check browser console for errors

### Tags don't save
- Ensure you have write permissions in the file
- Verify the element is selected before applying
- Check that the Penpot file is saved

### Export doesn't work
- Verify there are tagged elements
- Confirm the browser allows clipboard access
- Check JavaScript console for errors

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