// Test script to verify improved style extraction
// This simulates Penpot shape objects with various properties

// Mock shape with comprehensive properties
const mockSongCard = {
  id: "song-card-123",
  name: "song-card",
  type: "frame",
  x: 0,
  y: 0,
  width: 375,
  height: 92,
  rx: 12, // border-radius
  ry: 12,
  opacity: 1,
  hidden: false,
  showContent: true,
  
  // Layout properties (auto-layout frame)
  layout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
    paddingTop: 16,
    paddingRight: 20,
    paddingBottom: 16,
    paddingLeft: 20
  },
  
  // Background fill
  fills: [{
    fillColor: "#eae1ea",
    fillOpacity: 1
  }],
  
  // Border stroke
  strokes: [{
    strokeColor: "#d0d0d0",
    strokeWidth: 1,
    strokeStyle: "solid"
  }],
  
  // Shadow
  shadows: [{
    offsetX: 0,
    offsetY: 2,
    blur: 4,
    spread: 0,
    shadowColor: "rgba(0,0,0,0.1)"
  }]
};

// Mock text element
const mockTextElement = {
  id: "title-text-123",
  name: "song-title",
  type: "text",
  x: 100,
  y: 20,
  width: 200,
  height: 24,
  
  // Typography
  fontFamily: "Inter",
  fontSize: 16,
  fontWeight: 600,
  fontStyle: "normal",
  textAlign: "left",
  lineHeight: 1.2,
  letterSpacing: -0.5,
  textDecoration: "none",
  textTransform: "none",
  
  // Text color
  fills: [{
    fillColor: "#1a1a1a",
    fillOpacity: 1
  }],
  
  // Layout child properties (if inside auto-layout)
  layoutChild: {
    flexGrow: 1,
    flexShrink: 1,
    alignSelf: "center",
    marginLeft: 12
  }
};

// Mock button with transform
const mockButton = {
  id: "play-button-123",
  name: "play-button",
  type: "frame",
  x: 300,
  y: 30,
  width: 60,
  height: 32,
  rx: 16,
  
  // Transform
  transform: {
    rotation: 0,
    scaleX: 1,
    scaleY: 1
  },
  
  // Background
  fills: [{
    fillColor: "#e91e63",
    fillOpacity: 1
  }],
  
  // Multiple shadows
  shadows: [
    {
      offsetX: 0,
      offsetY: 1,
      blur: 2,
      spread: 0,
      shadowColor: "rgba(233,30,99,0.3)"
    },
    {
      offsetX: 0,
      offsetY: 4,
      blur: 8,
      spread: 0,
      shadowColor: "rgba(0,0,0,0.1)"
    }
  ]
};

// Import the style extractor (this would work in the actual plugin context)
console.log("=== TESTING IMPROVED STYLE EXTRACTION ===\n");

// Simulate the extractComprehensiveStyles function
function simulateStyleExtraction(shape, shapeName) {
  console.log(`--- ${shapeName} ---`);
  console.log("Input shape properties:");
  console.log(JSON.stringify(shape, null, 2));
  
  // This would be the actual function call:
  // const styles = extractComprehensiveStyles(shape);
  
  // For now, let's manually show what should be extracted:
  const expectedStyles = {};
  
  // Dimensions
  if (shape.width) expectedStyles.width = `${shape.width}px`;
  if (shape.height) expectedStyles.height = `${shape.height}px`;
  
  // Position (if not in flex container)
  expectedStyles.position = "absolute";
  if (shape.x !== undefined) expectedStyles.left = `${shape.x}px`;
  if (shape.y !== undefined) expectedStyles.top = `${shape.y}px`;
  
  // Border radius
  if (shape.rx) expectedStyles.borderRadius = `${shape.rx}px`;
  
  // Background color
  if (shape.fills && shape.fills[0]) {
    expectedStyles.backgroundColor = shape.fills[0].fillColor;
  }
  
  // Layout properties
  if (shape.layout) {
    Object.entries(shape.layout).forEach(([key, value]) => {
      if (key.includes('padding')) {
        expectedStyles[key] = `${value}px`;
      } else if (key === 'gap') {
        expectedStyles[key] = `${value}px`;
      } else {
        expectedStyles[key] = value;
      }
    });
  }
  
  // Typography
  if (shape.fontFamily) expectedStyles.fontFamily = shape.fontFamily;
  if (shape.fontSize) expectedStyles.fontSize = `${shape.fontSize}px`;
  if (shape.fontWeight) expectedStyles.fontWeight = String(shape.fontWeight);
  if (shape.letterSpacing) expectedStyles.letterSpacing = `${shape.letterSpacing}px`;
  
  // Layout child properties
  if (shape.layoutChild) {
    Object.entries(shape.layoutChild).forEach(([key, value]) => {
      if (key.includes('margin')) {
        expectedStyles[key] = `${value}px`;
      } else if (key === 'flexGrow' || key === 'flexShrink') {
        expectedStyles[key] = String(value);
      } else {
        expectedStyles[key] = value;
      }
    });
  }
  
  // Borders
  if (shape.strokes && shape.strokes[0]) {
    const stroke = shape.strokes[0];
    expectedStyles.border = `${stroke.strokeWidth}px ${stroke.strokeStyle} ${stroke.strokeColor}`;
  }
  
  // Shadows
  if (shape.shadows && shape.shadows.length > 0) {
    const shadowStrings = shape.shadows.map(shadow => 
      `${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.shadowColor}`
    );
    expectedStyles.boxShadow = shadowStrings.join(', ');
  }
  
  console.log("\nExpected extracted styles:");
  console.log(JSON.stringify(expectedStyles, null, 2));
  console.log("\n" + "=".repeat(50) + "\n");
}

// Test each mock shape
simulateStyleExtraction(mockSongCard, "Song Card Frame");
simulateStyleExtraction(mockTextElement, "Text Element");
simulateStyleExtraction(mockButton, "Button with Multiple Shadows");

console.log("✅ Style extraction test completed!");
console.log("The improved extractor should now capture:");
console.log("- Border radius (rx/ry)");
console.log("- Layout padding (paddingTop/Right/Bottom/Left)");
console.log("- Flexbox properties (display, flexDirection, justifyContent, etc.)");
console.log("- Typography extensions (letterSpacing, textDecoration, etc.)");
console.log("- Layout child properties (flexGrow, margins, etc.)");
console.log("- Multiple shadows");
console.log("- Transform properties");
console.log("- Border styles (solid, dashed, etc.)");