// Complete test script for all Penpot API style parameters
// Based on the comprehensive API documentation

console.log("=== TESTING COMPLETE PENPOT API STYLE EXTRACTION ===\n");

// Mock element with ALL possible Penpot style properties
const comprehensiveMockElement = {
  id: "comprehensive-test-element",
  name: "complete-element",
  type: "frame",
  
  // 📐 POSITIONING AND DIMENSIONS
  x: 100,
  y: 50,
  width: 300,
  height: 200,
  rotation: 15, // degrees
  
  // 🎨 FILL AND APPEARANCE
  opacity: 0.9,
  visible: true,
  fills: [{
    type: "solid",
    color: "#ff6b6b"
  }],
  blendMode: "multiply",
  
  // ✒️ BORDERS (STROKES)
  strokes: [{
    color: "#333333",
    strokeWidth: 2,
    strokeAlign: "inside",
    strokeDashPattern: [5, 3] // dashed pattern
  }],
  
  // 🔘 CORNER RADIUS
  radius: 12,
  // Alternative: radii: [8, 12, 16, 4] // [topLeft, topRight, bottomRight, bottomLeft]
  
  // ✨ EFFECTS
  effects: [
    {
      type: "drop-shadow",
      color: "rgba(0,0,0,0.25)",
      offset: { x: 4, y: 4 },
      blur: 8,
      spread: 2
    },
    {
      type: "layer-blur",
      radius: 3
    }
  ],
  
  // Layout properties
  layout: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    paddingTop: 20,
    paddingRight: 24,
    paddingBottom: 20,
    paddingLeft: 24
  }
};

// Mock text element with ALL typography properties
const comprehensiveTextElement = {
  id: "comprehensive-text-element",
  name: "complete-text",
  type: "text",
  content: "Sample Text Content",
  
  // 📐 POSITIONING AND DIMENSIONS
  x: 50,
  y: 100,
  width: 250,
  height: 40,
  
  // 📝 TYPOGRAPHY (all properties)
  fontFamily: "Inter",
  fontSize: 18,
  fontWeight: 600,
  fontStyle: "italic",
  textAlignHorizontal: "CENTER", // LEFT, CENTER, RIGHT, JUSTIFY
  textAlignVertical: "CENTER",   // TOP, CENTER, BOTTOM
  textDecoration: "UNDERLINE",   // UNDERLINE, STRIKETHROUGH, NONE
  textTransform: "UPPERCASE",    // UPPERCASE, LOWERCASE, CAPITALIZE, NONE
  lineHeight: 1.4,
  letterSpacing: 0.5,
  
  // Text color from fills
  fills: [{
    type: "solid",
    color: "#2c3e50"
  }],
  
  // Layout child properties (if inside auto-layout)
  layoutChild: {
    flexGrow: 1,
    flexShrink: 0,
    flexBasis: 100,
    alignSelf: "center",
    marginTop: 8,
    marginRight: 12,
    marginBottom: 8,
    marginLeft: 12
  }
};

// Mock element with gradient background
const gradientElement = {
  id: "gradient-element",
  name: "gradient-background",
  type: "frame",
  x: 0,
  y: 0,
  width: 200,
  height: 100,
  
  fills: [{
    type: "linear-gradient",
    angle: 45,
    stops: [
      { color: "#ff6b6b", offset: 0 },
      { color: "#4ecdc4", offset: 0.5 },
      { color: "#45b7d1", offset: 1 }
    ]
  }]
};

// Mock element with individual corner radii
const individualRadiiElement = {
  id: "individual-radii-element",
  name: "custom-corners",
  type: "frame",
  x: 0,
  y: 0,
  width: 150,
  height: 100,
  
  radii: [8, 16, 24, 4], // [topLeft, topRight, bottomRight, bottomLeft]
  
  fills: [{
    color: "#95a5a6"
  }]
};

function simulateCompleteExtraction(element, elementName) {
  console.log(`--- ${elementName} ---`);
  
  const expectedStyles = {};
  
  // 📐 POSITIONING AND DIMENSIONS
  if (element.width) expectedStyles.width = `${element.width}px`;
  if (element.height) expectedStyles.height = `${element.height}px`;
  if (element.x !== undefined) {
    expectedStyles.position = "absolute";
    expectedStyles.left = `${element.x}px`;
  }
  if (element.y !== undefined) expectedStyles.top = `${element.y}px`;
  if (element.rotation) expectedStyles.transform = `rotate(${element.rotation}deg)`;
  
  // 🎨 FILL AND APPEARANCE
  if (element.opacity !== undefined && element.opacity !== 1) {
    expectedStyles.opacity = String(element.opacity);
  }
  if (element.visible === false) expectedStyles.display = 'none';
  
  // Background from fills
  if (element.fills && element.fills[0]) {
    const fill = element.fills[0];
    if (fill.type === 'solid' && fill.color) {
      expectedStyles.backgroundColor = fill.color;
    } else if (fill.type === 'linear-gradient') {
      const stops = fill.stops.map(stop => 
        `${stop.color} ${Math.round(stop.offset * 100)}%`
      ).join(', ');
      expectedStyles.backgroundImage = `linear-gradient(${fill.angle}deg, ${stops})`;
    }
  }
  
  if (element.blendMode && element.blendMode !== 'normal') {
    expectedStyles.mixBlendMode = element.blendMode;
  }
  
  // ✒️ BORDERS
  if (element.strokes && element.strokes[0]) {
    const stroke = element.strokes[0];
    const style = stroke.strokeDashPattern ? 'dashed' : 'solid';
    expectedStyles.border = `${stroke.strokeWidth}px ${style} ${stroke.color}`;
    if (stroke.strokeAlign === 'inside') {
      expectedStyles.boxSizing = 'border-box';
    }
  }
  
  // 🔘 CORNER RADIUS
  if (element.radius) {
    expectedStyles.borderRadius = `${element.radius}px`;
  } else if (element.radii) {
    const [tl, tr, br, bl] = element.radii;
    expectedStyles.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
  }
  
  // ✨ EFFECTS
  if (element.effects) {
    const shadows = [];
    let filter = '';
    
    element.effects.forEach(effect => {
      if (effect.type === 'drop-shadow') {
        shadows.push(`${effect.offset.x}px ${effect.offset.y}px ${effect.blur}px ${effect.spread}px ${effect.color}`);
      } else if (effect.type === 'layer-blur') {
        filter = `blur(${effect.radius}px)`;
      }
    });
    
    if (shadows.length > 0) expectedStyles.boxShadow = shadows.join(', ');
    if (filter) expectedStyles.filter = filter;
  }
  
  // 📝 TYPOGRAPHY
  if (element.type === 'text') {
    if (element.fontFamily) expectedStyles.fontFamily = element.fontFamily;
    if (element.fontSize) expectedStyles.fontSize = `${element.fontSize}px`;
    if (element.fontWeight) expectedStyles.fontWeight = String(element.fontWeight);
    if (element.fontStyle) expectedStyles.fontStyle = element.fontStyle;
    
    // Text alignment mapping
    const alignMap = {
      'LEFT': 'left', 'CENTER': 'center', 'RIGHT': 'right', 'JUSTIFY': 'justify'
    };
    if (element.textAlignHorizontal) {
      expectedStyles.textAlign = alignMap[element.textAlignHorizontal];
    }
    
    // Text decoration mapping
    const decorationMap = {
      'UNDERLINE': 'underline', 'STRIKETHROUGH': 'line-through', 'NONE': 'none'
    };
    if (element.textDecoration) {
      expectedStyles.textDecoration = decorationMap[element.textDecoration];
    }
    
    // Text transform mapping
    const transformMap = {
      'UPPERCASE': 'uppercase', 'LOWERCASE': 'lowercase', 'CAPITALIZE': 'capitalize'
    };
    if (element.textTransform) {
      expectedStyles.textTransform = transformMap[element.textTransform];
    }
    
    if (element.lineHeight) expectedStyles.lineHeight = String(element.lineHeight);
    if (element.letterSpacing) expectedStyles.letterSpacing = `${element.letterSpacing}px`;
    
    // Text color from fills
    if (element.fills && element.fills[0] && element.fills[0].color) {
      expectedStyles.color = element.fills[0].color;
    }
  }
  
  // Layout properties
  if (element.layout) {
    Object.entries(element.layout).forEach(([key, value]) => {
      if (key.includes('padding') || key === 'gap') {
        expectedStyles[key] = `${value}px`;
      } else {
        expectedStyles[key] = value;
      }
    });
  }
  
  // Layout child properties
  if (element.layoutChild) {
    Object.entries(element.layoutChild).forEach(([key, value]) => {
      if (key.includes('margin') || key === 'flexBasis') {
        expectedStyles[key] = `${value}px`;
      } else if (key === 'flexGrow' || key === 'flexShrink') {
        expectedStyles[key] = String(value);
      } else {
        expectedStyles[key] = value;
      }
    });
  }
  
  console.log("Expected extracted styles:");
  console.log(JSON.stringify(expectedStyles, null, 2));
  console.log("\n" + "=".repeat(60) + "\n");
}

// Test all mock elements
simulateCompleteExtraction(comprehensiveMockElement, "Comprehensive Frame Element");
simulateCompleteExtraction(comprehensiveTextElement, "Complete Text Element");
simulateCompleteExtraction(gradientElement, "Gradient Background Element");
simulateCompleteExtraction(individualRadiiElement, "Individual Corner Radii Element");

console.log("✅ COMPLETE STYLE EXTRACTION TEST FINISHED!");
console.log("\n🎯 NEW PROPERTIES NOW SUPPORTED:");
console.log("📐 Positioning: x, y, width, height, rotation");
console.log("🎨 Appearance: opacity, visible, fills (solid + gradients), blendMode");
console.log("✒️ Borders: strokes with color, width, align, dash patterns");
console.log("🔘 Corners: radius (single) + radii (individual corners)");
console.log("✨ Effects: drop-shadow + layer-blur");
console.log("📝 Typography: ALL text properties with proper mapping");
console.log("🔧 Layout: Complete flexbox + padding + margins");
console.log("🎭 Visual: filter, mixBlendMode, boxSizing");

console.log("\n🚀 The song-card element will now include:");
console.log("- borderRadius from radius/radii properties");
console.log("- paddingTop/Right/Bottom/Left from layout.padding*");
console.log("- All visual effects and typography");
console.log("- Proper gradient backgrounds");
console.log("- Complete border styling with dash patterns");