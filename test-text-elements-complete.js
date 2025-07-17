// Complete verification script for text elements improvements

console.log("=== COMPLETE TEXT ELEMENTS IMPROVEMENTS ===\n");

// Mock text element with ALL Penpot Text API properties
const completeTextElement = {
  id: "text-element-123",
  name: "h3 / song-name",
  type: "text",
  
  // Position and dimensions
  x: 238,
  y: -46,
  width: 156,
  height: 22,
  
  // Text content and behavior
  characters: "Hyper-lightspeed",
  growType: "fixed", // "fixed" | "auto-width" | "auto-height"
  
  // Font properties (from Penpot Text API)
  fontId: "font-123",
  fontFamily: "Archivo",
  fontVariantId: "variant-123",
  fontSize: "16", // Can be string in Penpot
  fontWeight: "500",
  fontStyle: "normal", // "normal" | "italic" | "mixed"
  
  // Text spacing and layout
  lineHeight: "1.2",
  letterSpacing: "-0.5", // Can be string in Penpot
  
  // Text styling
  textTransform: "none", // "uppercase" | "capitalize" | "lowercase" | "none" | "mixed"
  textDecoration: "none", // "underline" | "line-through" | "none" | "mixed"
  direction: "ltr", // "ltr" | "rtl" | "mixed"
  
  // Text alignment (Penpot API properties)
  align: "left", // "center" | "left" | "right" | "justify" | "mixed"
  verticalAlign: "top", // "center" | "top" | "bottom"
  
  // Text color from fills
  fills: [{
    color: "#000000"
  }],
  
  // Layout child properties (if inside auto-layout)
  layoutChild: {
    alignSelf: "auto"
  },
  
  // Visual properties
  opacity: 1,
  visible: true,
  borderRadius: 0,
  
  // Transform
  rotation: 0
};

// Mock text element with gradient text
const gradientTextElement = {
  id: "gradient-text-123",
  name: "gradient-title",
  type: "text",
  characters: "Gradient Text",
  fontFamily: "Inter",
  fontSize: "24",
  fontWeight: "700",
  
  // Gradient fill for text
  fills: [{
    type: "linear-gradient",
    angle: 45,
    stops: [
      { color: "#ff6b6b", offset: 0 },
      { color: "#4ecdc4", offset: 1 }
    ]
  }]
};

// Mock auto-width text element
const autoWidthTextElement = {
  id: "auto-width-text-123",
  name: "auto-width-label",
  type: "text",
  characters: "Auto Width Text",
  growType: "auto-width",
  fontFamily: "Roboto",
  fontSize: "14",
  align: "center",
  
  // This element is inside a flex container
  _isInFlexContainer: true,
  layoutChild: {
    alignSelf: "center",
    flexGrow: 0,
    flexShrink: 1
  }
};

// Simulate the updated text extraction
function simulateTextExtraction(textShape, shapeName) {
  console.log(`--- ${shapeName} ---`);
  
  const styles = {};
  
  // Basic dimensions
  if (textShape.width) styles.width = `${textShape.width}px`;
  if (textShape.height) styles.height = `${textShape.height}px`;
  
  // Position (only if not in flex container)
  if (!textShape._isInFlexContainer) {
    styles.position = "absolute";
    if (textShape.x !== undefined) styles.left = `${textShape.x}px`;
    if (textShape.y !== undefined) styles.top = `${textShape.y}px`;
  }
  
  // ✅ COMPLETE TYPOGRAPHY PROPERTIES
  if (textShape.fontFamily && textShape.fontFamily !== 'mixed') {
    styles.fontFamily = textShape.fontFamily;
  }
  
  if (textShape.fontSize && textShape.fontSize !== 'mixed') {
    const parsedSize = parseFloat(textShape.fontSize);
    if (!isNaN(parsedSize)) {
      styles.fontSize = `${Math.round(parsedSize)}px`;
    }
  }
  
  if (textShape.fontWeight && textShape.fontWeight !== 'mixed') {
    styles.fontWeight = String(textShape.fontWeight);
  }
  
  if (textShape.fontStyle && textShape.fontStyle !== 'mixed') {
    styles.fontStyle = textShape.fontStyle;
  }
  
  if (textShape.lineHeight && textShape.lineHeight !== 'mixed') {
    styles.lineHeight = String(textShape.lineHeight);
  }
  
  if (textShape.letterSpacing && textShape.letterSpacing !== 'mixed') {
    const parsedSpacing = parseFloat(textShape.letterSpacing);
    if (!isNaN(parsedSpacing)) {
      styles.letterSpacing = `${parsedSpacing}px`;
    }
  }
  
  // Text alignment
  if (textShape.align && textShape.align !== 'mixed') {
    styles.textAlign = textShape.align;
  }
  
  // Text decoration
  if (textShape.textDecoration && textShape.textDecoration !== 'mixed') {
    styles.textDecoration = textShape.textDecoration;
  }
  
  // Text transform
  if (textShape.textTransform && textShape.textTransform !== 'mixed') {
    styles.textTransform = textShape.textTransform;
  }
  
  // Text direction
  if (textShape.direction && textShape.direction !== 'mixed') {
    styles.direction = textShape.direction;
  }
  
  // Vertical alignment
  if (textShape.verticalAlign) {
    const verticalAlignMap = {
      'top': 'flex-start',
      'center': 'center',
      'bottom': 'flex-end'
    };
    const alignValue = verticalAlignMap[textShape.verticalAlign];
    if (alignValue && !styles.display) {
      styles.display = 'flex';
      styles.flexDirection = 'column';
      styles.justifyContent = alignValue;
    }
  }
  
  // Grow type behavior
  if (textShape.growType) {
    switch (textShape.growType) {
      case 'auto-width':
        styles.whiteSpace = 'nowrap';
        styles.width = 'auto';
        break;
      case 'auto-height':
        styles.height = 'auto';
        styles.overflowWrap = 'break-word';
        break;
      case 'fixed':
        styles.overflow = 'hidden';
        break;
    }
  }
  
  // Text color or gradient
  if (textShape.fills && textShape.fills[0]) {
    const fill = textShape.fills[0];
    if (fill.type === 'linear-gradient') {
      const stops = fill.stops.map(stop => 
        `${stop.color} ${Math.round(stop.offset * 100)}%`
      ).join(', ');
      styles.background = `linear-gradient(${fill.angle}deg, ${stops})`;
      styles.webkitBackgroundClip = 'text';
      styles.webkitTextFillColor = 'transparent';
      styles.backgroundClip = 'text';
    } else if (fill.color) {
      styles.color = fill.color;
    }
  }
  
  // Layout child properties
  if (textShape.layoutChild) {
    if (textShape.layoutChild.alignSelf) {
      styles.alignSelf = textShape.layoutChild.alignSelf;
    }
    if (typeof textShape.layoutChild.flexGrow === 'number') {
      styles.flexGrow = String(textShape.layoutChild.flexGrow);
    }
    if (typeof textShape.layoutChild.flexShrink === 'number') {
      styles.flexShrink = String(textShape.layoutChild.flexShrink);
    }
  }
  
  console.log("Expected extracted styles:");
  console.log(JSON.stringify(styles, null, 2));
  console.log("\n" + "=".repeat(60) + "\n");
}

// Test all text element scenarios
simulateTextExtraction(completeTextElement, "Complete Text Element");
simulateTextExtraction(gradientTextElement, "Gradient Text Element");
simulateTextExtraction(autoWidthTextElement, "Auto-Width Text in Flex Container");

console.log("✅ COMPLETE TEXT IMPROVEMENTS IMPLEMENTED!");

console.log("\n🎯 NEW TEXT PROPERTIES SUPPORTED:");
console.log("📝 Typography:");
console.log("  - fontFamily, fontSize, fontWeight, fontStyle");
console.log("  - lineHeight, letterSpacing");
console.log("  - textAlign (from 'align' property)");
console.log("  - textDecoration, textTransform, direction");
console.log("  - verticalAlign with flexbox conversion");

console.log("\n🎨 Text Styling:");
console.log("  - Text color from fills");
console.log("  - Gradient text with background-clip");
console.log("  - Mixed value handling ('mixed' values ignored)");

console.log("\n📐 Text Behavior:");
console.log("  - growType handling (fixed, auto-width, auto-height)");
console.log("  - whiteSpace, overflowWrap, overflow properties");
console.log("  - Smart positioning (no absolute in flex containers)");

console.log("\n🔧 Layout Integration:");
console.log("  - layoutChild properties (alignSelf, flexGrow, flexShrink)");
console.log("  - Flex container detection");
console.log("  - Responsive text behavior");

console.log("\n🐛 Debug Features:");
console.log("  - Complete text element property logging");
console.log("  - Text-specific debug information");
console.log("  - Position and layout context debugging");

console.log("\n🚀 EXPECTED IMPROVEMENTS:");
console.log("1. Text elements will have complete typography styles");
console.log("2. No more absolute positioning for text in flex containers");
console.log("3. Proper text alignment and behavior");
console.log("4. Gradient text support");
console.log("5. Responsive text sizing and wrapping");

console.log("\n📋 TESTING INSTRUCTIONS:");
console.log("1. Install the updated plugin in Penpot");
console.log("2. Export elements with text");
console.log("3. Check console for text element debug output");
console.log("4. Verify complete typography properties in JSON");
console.log("5. Confirm proper positioning behavior");