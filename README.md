# Semantic Tagging Plugin for Penpot

An advanced plugin for Penpot that allows assigning semantic tags (HTML and UI components) to design elements, facilitating code export and collaboration between designers and developers.

## 🚀 Features

- **Semantic Tagging**: Assign standard HTML tags and components from popular libraries (Material UI, Chakra UI, Bootstrap)
- **Custom Properties**: Define attributes, CSS classes, events, and specific properties for each element
- **Data Persistence**: Tags are saved in the Penpot file and persist between sessions
- **JSON Export**: Export all tags and metadata in structured JSON format
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

### 5. Export

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

## 📊 Export Format

The exported JSON file includes:

```json
{
  "metadata": {
    "pluginName": "Semantic Tagging Plugin",
    "version": "1.0.0",
    "exportDate": "2024-01-15T10:30:00.000Z",
    "fileName": "My Design",
    "totalElements": 5
  },
  "elements": [
    {
      "tag": "MuiButton",
      "properties": {
        "variant": "contained",
        "color": "primary",
        "onClick": "handleSubmit"
      },
      "elementId": "uuid-123",
      "elementName": "Submit Button",
      "elementType": "rectangle",
      "position": { "x": 100, "y": 200 },
      "size": { "width": 120, "height": 40 }
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