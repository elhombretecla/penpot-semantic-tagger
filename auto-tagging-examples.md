# 🏷️ Auto-Tagging Guide

## Naming Conventions for Auto-Tagging

The plugin can automatically tag elements based on layer names using the format: `tag/modifier/extra`

### 📝 Basic Examples

| Layer Name | Generated Tag | Automatic Properties |
|------------|---------------|---------------------|
| `button/primary` | `button` | `className: "btn-primary"`, `type: "button"` |
| `button/submit` | `button` | `className: "btn-submit"`, `type: "submit"` |
| `input/email` | `input` | `type: "email"` |
| `input/password/Password` | `input` | `type: "password"`, `placeholder: "Password"` |
| `nav/main` | `nav` | `className: "nav-main"` |
| `div/container` | `div` | `className: "container"` |
| `header/main-header` | `header` | `className: "main-header"` |

### 🔗 Links and Navigation

| Layer Name | Generated Tag | Automatic Properties |
|------------|---------------|---------------------|
| `a/external` | `a` | `target: "_blank"`, `rel: "noopener noreferrer"` |
| `a/external/https://example.com` | `a` | `target: "_blank"`, `rel: "noopener noreferrer"`, `href: "https://example.com"` |

### 🖼️ Images

| Layer Name | Generated Tag | Automatic Properties |
|------------|---------------|---------------------|
| `img/User Avatar` | `img` | `alt: "User Avatar"` |
| `img/Logo/logo.png` | `img` | `alt: "Logo"`, `src: "logo.png"` |

### 🎨 Material UI

| Layer Name | Generated Tag | Automatic Properties |
|------------|---------------|---------------------|
| `MuiButton/contained` | `MuiButton` | `variant: "contained"` |
| `MuiButton/outlined/primary` | `MuiButton` | `variant: "outlined"`, `color: "primary"` |
| `MuiTextField/outlined/Email` | `MuiTextField` | `variant: "outlined"`, `label: "Email"` |

### 🌈 Chakra UI

| Layer Name | Generated Tag | Automatic Properties |
|------------|---------------|---------------------|
| `ChakraButton/blue` | `ChakraButton` | `colorScheme: "blue"` |
| `ChakraButton/red/lg` | `ChakraButton` | `colorScheme: "red"`, `size: "lg"` |

### 📋 Headings and Text

| Layer Name | Generated Tag | Automatic Properties |
|------------|---------------|---------------------|
| `h1/main-title` | `h1` | `className: "heading-main-title"` |
| `h2/section-header` | `h2` | `className: "heading-section-header"` |

## 🚀 How to Use Auto-Tagging

### Step 1: Name Your Layers
In Penpot, name your layers following the conventions:
- `button/primary` for a primary button
- `input/email` for an email field
- `nav/main` for main navigation

### Step 2: Select Elements
- Select one or more groups/elements on the canvas
- You can select parent elements and all children will be processed recursively

### Step 3: Auto-Tag
1. Make sure the "Auto-tag using layer name" checkbox is enabled
2. Click "🏷️ Auto-Tag Selection"
3. The plugin will automatically process all elements and their children

### Step 4: Review Results
- You'll see a confirmation message with the number of tagged elements
- Elements will appear in the "Tagged Elements" list
- You can export the JSON with all structured information

## 💡 Pro Tips

### 🎯 Naming Strategy
- **Consistency**: Always use the same `tag/modifier` format
- **Descriptive**: `button/cta-primary` is better than `button/btn1`
- **Hierarchical**: For groups, use names like `section/hero` or `div/card-container`

### 🔄 Recursive Processing
- If you select a parent group, all child elements will be processed automatically
- Perfect for tagging complete components at once

### 🎨 Combining with Manual Tagging
- Use auto-tagging for basic structure
- Manually refine specific elements that need additional properties

## 📊 Example Result

After auto-tagging, you get a clean and structured JSON:

```json
{
  "tree": [
    {
      "tag": "header",
      "properties": { "className": "main-header" },
      "elementId": "unique-id-1",
      "styles": { "width": "100%", "height": "80px" },
      "children": [
        {
          "tag": "nav",
          "properties": { "className": "nav-main" },
          "elementId": "unique-id-2",
          "children": [
            {
              "tag": "button",
              "properties": { 
                "className": "btn-primary",
                "type": "button"
              },
              "elementId": "unique-id-3",
              "content": "Get Started",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

This functionality completely transforms the workflow between design and development! 🎉