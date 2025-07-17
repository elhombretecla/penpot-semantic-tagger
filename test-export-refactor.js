/**
 * Test file demonstrating the new generateRichJson function
 * This would be used in a testing environment with mock Penpot data
 */

// Mock Penpot shape data for testing with decimal values
const mockShapes = [
  {
    id: "header-1",
    name: "Header Container",
    type: "board",
    x: 0.5,
    y: 2.7,
    width: 1200.4000244140625,
    height: 80.6652907513391,
    fills: [{
      fillColor: { r: 1, g: 1, b: 1, alpha: 1 }
    }],
    strokes: [{
      strokeColor: { r: 0.9, g: 0.9, b: 0.9, alpha: 1 },
      strokeWidth: 1.5
    }],
    shadows: [{
      color: { r: 0, g: 0, b: 0, alpha: 0.1 },
      offsetX: 2.3,
      offsetY: 4.7,
      blur: 8.2,
      spread: 1.1
    }],
    children: [
      {
        id: "logo-1",
        name: "Logo",
        type: "text",
        x: 32.5,
        y: 24.3,
        width: 100.2,
        height: 32.7,
        characters: "LOGO",
        fontFamily: "Inter",
        fontSize: 24.5,
        fontWeight: 700,
        fontColor: { r: 0.2, g: 0.3, b: 0.4, alpha: 1 },
        fills: [{
          fillColor: { r: 0.9, g: 0.9, b: 0.9, alpha: 1 }
        }],
        rx: 4.2
      },
      {
        id: "nav-1",
        name: "Navigation",
        type: "group",
        x: 400,
        y: 20,
        width: 300,
        height: 40,
        children: [
          {
            id: "nav-home",
            name: "Home Link",
            type: "text",
            x: 400,
            y: 28,
            width: 50,
            height: 24,
            characters: "Home",
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: 400,
            fontColor: { r: 0.2, g: 0.2, b: 0.2, alpha: 1 }
          },
          {
            id: "nav-about",
            name: "About Link", 
            type: "text",
            x: 482,
            y: 28,
            width: 60,
            height: 24,
            characters: "About",
            fontFamily: "Inter",
            fontSize: 16,
            fontWeight: 400,
            fontColor: { r: 0.2, g: 0.2, b: 0.2, alpha: 1 }
          }
        ]
      },
      {
        id: "cta-1",
        name: "CTA Button",
        type: "rect",
        x: 1000,
        y: 20,
        width: 120,
        height: 40,
        rx: 6,
        fills: [{
          fillColor: { r: 0, g: 0.48, b: 1, alpha: 1 }
        }],
        characters: "Get Started",
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: 600,
        fontColor: { r: 1, g: 1, b: 1, alpha: 1 }
      }
    ]
  }
];

// Mock tagged elements (would come from the plugin's taggedElements Map)
const mockTaggedElements = new Map([
  ["header-1", {
    tag: "header",
    properties: { className: "header-container" },
    elementId: "header-1",
    elementName: "Header Container"
  }],
  ["logo-1", {
    tag: "a",
    properties: { href: "/", className: "logo-link" },
    elementId: "logo-1", 
    elementName: "Logo"
  }],
  ["nav-1", {
    tag: "nav",
    properties: { className: "main-navigation" },
    elementId: "nav-1",
    elementName: "Navigation"
  }],
  ["nav-home", {
    tag: "a",
    properties: { href: "/home", className: "nav-link" },
    elementId: "nav-home",
    elementName: "Home Link"
  }],
  ["nav-about", {
    tag: "a", 
    properties: { href: "/about", className: "nav-link" },
    elementId: "nav-about",
    elementName: "About Link"
  }],
  ["cta-1", {
    tag: "button",
    properties: { type: "button", className: "cta-button" },
    elementId: "cta-1",
    elementName: "CTA Button"
  }]
]);

// Mock penpot object for testing
const mockPenpot = {
  currentFile: { name: "Test Design" },
  currentPage: { name: "Test Page" }
};

/**
 * Test implementation of generateRichJson function
 * This demonstrates the expected output structure
 */
function testGenerateRichJson(selectedShapes, taggedElements, penpot) {
  // Generate metadata
  const metadata = {
    pluginName: "Semantic Tagging Plugin",
    version: "1.2.0", 
    exportDate: new Date().toISOString(),
    fileName: penpot.currentFile?.name || "Untitled",
    pageName: penpot.currentPage?.name || "Untitled Page"
  };

  // Process each selected shape into the tree structure
  const tree = selectedShapes
    .map(shape => testProcessShape(shape, taggedElements))
    .filter(node => node !== null);

  return {
    metadata,
    tree
  };
}

/**
 * Test implementation of processShape function
 */
function testProcessShape(shape, taggedElements, parentContext = {}) {
  if (!shape) return null;

  // Check if this shape has a semantic tag
  const tagData = taggedElements.get(shape.id);
  if (!tagData) {
    // If no tag, still process children in case they have tags
    if (shape.children && Array.isArray(shape.children)) {
      const childNodes = shape.children
        .map(child => testProcessShape(child, taggedElements, parentContext))
        .filter(node => node !== null);
      
      return childNodes.length > 0 ? childNodes : null;
    }
    return null;
  }

  // Analyze layout first
  const layout = testAnalyzeLayout(shape);
  
  // Determine if this is a flex/grid container
  const isFlexContainer = layout && (layout.display === "flex" || layout.display === "grid");
  
  // Create a new context for children
  const childContext = {
    ...parentContext,
    isInFlexContainer: isFlexContainer || parentContext.isInFlexContainer
  };
  
  // Extract comprehensive styles
  const styles = testExtractStyles(shape, parentContext);
  
  // Extract content
  const content = shape.characters || undefined;
  const imageUrl = shape.type === 'image' ? `assets/${shape.name || 'image'}.png` : undefined;
  
  // Process children recursively
  const children = [];
  if (shape.children && Array.isArray(shape.children)) {
    shape.children.forEach(child => {
      const childNode = testProcessShape(child, taggedElements, childContext);
      if (childNode) {
        if (Array.isArray(childNode)) {
          children.push(...childNode);
        } else {
          children.push(childNode);
        }
      }
    });
  }

  // Merge layout properties into styles object
  const mergedStyles = { ...styles };
  if (layout && Object.keys(layout).length > 0) {
    Object.entries(layout).forEach(([key, value]) => {
      mergedStyles[key] = value;
    });
  }
  
  // Build the node object
  const node = {
    tag: tagData.tag,
    elementName: shape.name || "Unnamed",
    elementType: shape.type || "unknown", 
    elementId: shape.id,
    attributes: { ...tagData.properties },
    styles: mergedStyles, // CSS styles including layout properties
    children: children
  };

  // Add optional properties
  if (content) node.content = content;
  if (imageUrl) node.source = imageUrl;

  return node;
}

/**
 * Test implementation of style extraction with enhanced color detection
 * @param {Object} shape - The shape object to extract styles from
 * @param {Object} parentContext - Context information passed from parent
 * @returns {Object} - CSS styles object
 */
function testExtractStyles(shape, parentContext = {}) {
  const styles = {};

  // Helper function to convert color object to CSS rgba string
  function colorToCssRgba(colorObj) {
    if (!colorObj) return null;
    
    // Handle different color object formats
    let r, g, b, alpha = 1;
    
    if (typeof colorObj.r === 'number' && typeof colorObj.g === 'number' && typeof colorObj.b === 'number') {
      r = colorObj.r;
      g = colorObj.g;
      b = colorObj.b;
      alpha = typeof colorObj.alpha === 'number' ? colorObj.alpha : 1;
      
      // Check if values are in 0-1 range (Penpot standard) or 0-255 range
      const needsScaling = (r <= 1 && g <= 1 && b <= 1);
      
      return `rgba(${Math.round(needsScaling ? r * 255 : r)}, ${Math.round(needsScaling ? g * 255 : g)}, ${Math.round(needsScaling ? b * 255 : b)}, ${alpha})`;
    }
    
    // Handle hex format
    if (typeof colorObj === 'string' && colorObj.startsWith('#')) {
      return colorObj;
    }
    
    return null;
  }

  // Essential dimensions and positioning - rounded to integers
  if (typeof shape.width === 'number') styles.width = `${Math.round(shape.width)}px`;
  if (typeof shape.height === 'number') styles.height = `${Math.round(shape.height)}px`;
  
  // Only apply absolute positioning if not in a flex container
  if (!parentContext.isInFlexContainer) {
    styles.position = "absolute";
    if (typeof shape.x === 'number') styles.left = `${Math.round(shape.x)}px`;
    if (typeof shape.y === 'number') styles.top = `${Math.round(shape.y)}px`;
  }

  // Background and fills - Enhanced to handle different color formats
  // Try multiple approaches to find background color
  let bgColor = null;
  
  // 1. Try fills array first (most common in Penpot)
  if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
    const fill = shape.fills[0];
    
    // Try fillColor property
    if (fill?.fillColor) {
      bgColor = colorToCssRgba(fill.fillColor);
    }
    
    // Try color property if fillColor didn't work
    if (!bgColor && fill?.color) {
      bgColor = colorToCssRgba(fill.color);
    }
    
    // Try fill.value for some Penpot versions
    if (!bgColor && fill?.value) {
      bgColor = colorToCssRgba(fill.value);
    }
  }
  
  // 2. Try direct backgroundColor property
  if (!bgColor && shape?.backgroundColor) {
    bgColor = colorToCssRgba(shape.backgroundColor);
  }
  
  // 3. Try direct fill property
  if (!bgColor && shape?.fill) {
    bgColor = colorToCssRgba(shape.fill);
  }
  
  // 4. Try direct color property if it's not a text element
  if (!bgColor && shape?.color && shape.type !== 'text') {
    bgColor = colorToCssRgba(shape.color);
  }
  
  // Apply the background color if found
  if (bgColor) {
    styles.backgroundColor = bgColor;
  }

  // Typography properties
  if (shape?.fontFamily) styles.fontFamily = shape.fontFamily;
  if (typeof shape?.fontSize === 'number') styles.fontSize = `${Math.round(shape.fontSize)}px`;
  if (shape?.fontWeight) styles.fontWeight = String(shape.fontWeight);
  if (shape?.fontStyle) styles.fontStyle = shape.fontStyle;
  if (shape?.textAlign) styles.textAlign = shape.textAlign;
  if (shape?.lineHeight) styles.lineHeight = String(shape.lineHeight);

  // Text color - Enhanced to handle different color formats
  // Try multiple approaches to find text color
  let textColor = null;
  
  // For text elements, try to find the text color using various properties
  if (shape.type === 'text' || shape.characters) {
    // 1. Try fontColor property (most common in Penpot)
    if (!textColor && shape?.fontColor) {
      textColor = colorToCssRgba(shape.fontColor);
    }
    
    // 2. Try textColor property
    if (!textColor && shape?.textColor) {
      textColor = colorToCssRgba(shape.textColor);
    }
    
    // 3. Try color property directly
    if (!textColor && shape?.color) {
      textColor = colorToCssRgba(shape.color);
    }
    
    // 4. Try content.color property (used in some Penpot versions)
    if (!textColor && shape?.content?.color) {
      textColor = colorToCssRgba(shape.content.color);
    }
    
    // 5. Try fills for text (sometimes Penpot uses fills for text color)
    if (!textColor && shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
      const fill = shape.fills[0];
      if (fill?.fillColor) {
        textColor = colorToCssRgba(fill.fillColor);
      } else if (fill?.color) {
        textColor = colorToCssRgba(fill.color);
      }
    }
    
    // Apply the text color if found
    if (textColor) {
      styles.color = textColor;
    } else {
      // Default text color if nothing found but it's a text element
      styles.color = "rgba(0, 0, 0, 1)";
    }
  }

  // Border radius - rounded
  if (shape.rx || shape.ry) {
    styles.borderRadius = `${Math.round(shape.rx || shape.ry)}px`;
  }

  // Borders from strokes - Enhanced to handle different stroke color formats
  if (shape?.strokes && Array.isArray(shape.strokes) && shape.strokes.length > 0) {
    const stroke = shape.strokes[0];
    
    // Try to get stroke color
    let strokeColor = null;
    
    if (stroke?.strokeColor) {
      strokeColor = colorToCssRgba(stroke.strokeColor);
    } else if (stroke?.color) {
      strokeColor = colorToCssRgba(stroke.color);
    } else if (stroke?.stroke) {
      strokeColor = colorToCssRgba(stroke.stroke);
    }
    
    // Get stroke width
    const strokeWidth = typeof stroke?.strokeWidth === 'number' ? stroke.strokeWidth : 
                       (typeof stroke?.width === 'number' ? stroke.width : null);
    
    // Apply border style if we have both color and width
    if (strokeColor && strokeWidth !== null) {
      styles.border = `${Math.round(strokeWidth)}px solid ${strokeColor}`;
    }
  }

  // Box shadow - Enhanced to handle different shadow formats
  if (shape?.shadows && Array.isArray(shape.shadows) && shape.shadows.length > 0) {
    const shadow = shape.shadows[0];
    
    // Try to get shadow color
    let shadowColor = null;
    
    if (shadow?.color) {
      shadowColor = colorToCssRgba(shadow.color);
    } else if (shadow?.shadowColor) {
      shadowColor = colorToCssRgba(shadow.shadowColor);
    }
    
    // Get shadow parameters with fallbacks
    if (shadowColor && shadow?.offsetX !== undefined) {
      const offsetX = Math.round(shadow.offsetX || 0);
      const offsetY = Math.round(shadow.offsetY || 0);
      const blur = Math.round(shadow.blur || shadow.blurRadius || 0);
      const spread = Math.round(shadow.spread || shadow.spreadRadius || 0);
      
      styles.boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`;
    }
  }

  // Opacity
  if (typeof shape?.opacity === 'number' && shape.opacity !== 1) {
    styles.opacity = String(shape.opacity);
  }

  return styles;
}

/**
 * Test implementation of layout analysis
 */
function testAnalyzeLayout(shape) {
  const layout = {};

  if (!shape.children || shape.children.length < 2) return layout;

  const children = shape.children.filter(child => 
    typeof child.x === 'number' && typeof child.y === 'number'
  );

  if (children.length < 2) return layout;

  // Analyze positioning
  const yPositions = children.map(c => c.y);
  const xPositions = children.map(c => c.x);
  const yVariance = Math.max(...yPositions) - Math.min(...yPositions);
  const xVariance = Math.max(...xPositions) - Math.min(...xPositions);

  // Detect horizontal layout
  if (yVariance < 20 && xVariance > 50) {
    layout.display = "flex";
    layout.flexDirection = "row";
    layout.alignItems = "center";
    
    // Calculate gap
    const sortedByX = [...children].sort((a, b) => a.x - b.x);
    if (sortedByX.length > 1) {
      const gap = sortedByX[1].x - (sortedByX[0].x + (sortedByX[0].width || 0));
      if (gap > 0) layout.gap = `${gap}px`;
    }
  }
  // Detect vertical layout  
  else if (xVariance < 20 && yVariance > 50) {
    layout.display = "flex";
    layout.flexDirection = "column";
    layout.alignItems = "flex-start";
    
    // Calculate gap
    const sortedByY = [...children].sort((a, b) => a.y - b.y);
    if (sortedByY.length > 1) {
      const gap = sortedByY[1].y - (sortedByY[0].y + (sortedByY[0].height || 0));
      if (gap > 0) layout.gap = `${gap}px`;
    }
  }

  return layout;
}

// Run the test
console.log("Testing generateRichJson function...");
const result = testGenerateRichJson(mockShapes, mockTaggedElements, mockPenpot);
console.log("Generated JSON structure:");
console.log(JSON.stringify(result, null, 2));

// Verify the structure matches specification
console.log("\n=== Verification ===");
console.log("✓ Has metadata object:", !!result.metadata);
console.log("✓ Has tree array:", Array.isArray(result.tree));
console.log("✓ Tree has nodes:", result.tree.length > 0);

if (result.tree[0]) {
  const node = result.tree[0];
  console.log("✓ Node has tag:", !!node.tag);
  console.log("✓ Node has elementName:", !!node.elementName);
  console.log("✓ Node has elementType:", !!node.elementType);
  console.log("✓ Node has elementId:", !!node.elementId);
  console.log("✓ Node has attributes:", !!node.attributes);
  console.log("✓ Node has styles:", !!node.styles);
  console.log("✓ Node has children array:", Array.isArray(node.children));
  console.log("✓ Styles include position:", !!node.styles.position);
  console.log("✓ Styles include dimensions:", !!(node.styles.width && node.styles.height));
}

console.log("\n=== Test Complete ===");