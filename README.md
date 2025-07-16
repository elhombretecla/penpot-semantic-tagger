# Semantic Tagging Plugin for Penpot

Un plugin avanzado para Penpot que permite asignar etiquetas semánticas (HTML y componentes UI) a elementos de diseño, facilitando la exportación de código y la colaboración entre diseñadores y desarrolladores.

## 🚀 Características Principales

### ✨ Nuevas Funcionalidades v2.0

- **🌳 Estructura de Árbol**: Exporta elementos con jerarquía padre-hijo usando la propiedad `children`
- **📝 Contenido Real**: Extrae automáticamente el texto y URLs de imágenes de los elementos
- **🎨 Estilos Detallados**: Captura propiedades CSS completas (colores, tipografía, bordes, sombras)
- **📐 Información de Layout**: Detecta automáticamente propiedades de Flexbox y Grid
- **🔍 Vista Enriquecida**: Interfaz mejorada que muestra contenido, estilos y layout de cada elemento

### 🎯 Características Existentes

- **Etiquetado Semántico**: Asigna etiquetas HTML estándar y componentes de librerías populares (Material UI, Chakra UI, Bootstrap)
- **Propiedades Personalizadas**: Define atributos, clases CSS, eventos y propiedades específicas
- **Persistencia de Datos**: Las etiquetas se guardan en el archivo de Penpot
- **Exportación JSON Avanzada**: Exporta con estructura de árbol y metadatos completos
- **Interfaz Intuitiva**: UI responsiva que se adapta al tema de Penpot
- **Selección Reactiva**: Responde automáticamente a cambios de selección en el canvas

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

## 📊 Formato de Exportación Mejorado v2.0

El archivo JSON exportado ahora incluye dos estructuras:

### 🌳 Estructura de Árbol (Recomendada para Desarrollo)

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

### 📋 Nuevas Propiedades Incluidas

**Contenido y Media:**
- `content`: Texto real extraído del elemento
- `imageUrl`: URL del asset de imagen

**Estilos CSS Consolidados (única fuente de verdad):**
- **Posicionamiento**: `left`, `top`, `width`, `height` (siempre incluidos)
- **Colores**: `backgroundColor`, `color` extraídos de Penpot
- **Tipografía**: `fontFamily`, `fontSize`, `fontWeight`, `textAlign`, `lineHeight`
- **Bordes**: `border`, `borderRadius`
- **Efectos**: `boxShadow`, `opacity`
- **Espaciado**: `padding`, `margin`

**Información de Layout (inferida automáticamente):**
- `display`: flex, grid, etc.
- `flexDirection`: row, column
- `justifyContent`, `alignItems`: Alineación
- `gap`: Espaciado entre elementos

**Jerarquía:**
- `children`: Array con elementos hijos directos
- Estructura anidada que refleja la jerarquía real del diseño
- **IDs únicos**: Cada elemento tiene su `elementId` único de Penpot

### 🎯 Mejoras v2.0

1. **Sin Redundancia**: Solo estructura `tree`, eliminada lista `elements` duplicada
2. **Estilos Consolidados**: Toda información visual en objeto `styles` único
3. **IDs Únicos**: Cada elemento mantiene su ID real de Penpot
4. **Contenido Completo**: Extracción automática de texto e imágenes

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