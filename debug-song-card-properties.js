// Debug script to examine the actual properties of the song-card element
// This will help us identify the correct property names in Penpot

console.log("=== DEBUGGING SONG-CARD ELEMENT PROPERTIES ===\n");

// Function to deeply inspect a Penpot shape object
function inspectShapeProperties(shape, shapeName) {
  console.log(`\n🔍 INSPECTING: ${shapeName} (${shape.type})`);
  console.log(`ID: ${shape.id}`);
  console.log(`Name: ${shape.name}`);
  console.log(`Dimensions: ${shape.width}x${shape.height} at (${shape.x}, ${shape.y})`);
  
  console.log("\n📋 ALL AVAILABLE PROPERTIES:");
  const allProps = Object.keys(shape).sort();
  allProps.forEach(prop => {
    const value = shape[prop];
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      console.log(`${prop}: [Object] - ${Object.keys(value).join(', ')}`);
    } else if (Array.isArray(value)) {
      console.log(`${prop}: [Array(${value.length})] - ${value.length > 0 ? JSON.stringify(value[0]) : 'empty'}`);
    } else {
      console.log(`${prop}: ${typeof value} = ${value}`);
    }
  });
  
  // Focus on border-radius related properties
  console.log("\n🔘 BORDER-RADIUS RELATED PROPERTIES:");
  const radiusProps = ['rx', 'ry', 'radius', 'radii', 'cornerRadius', 'borderRadius'];
  radiusProps.forEach(prop => {
    if (shape.hasOwnProperty(prop)) {
      console.log(`✅ ${prop}: ${JSON.stringify(shape[prop])}`);
    } else {
      console.log(`❌ ${prop}: not found`);
    }
  });
  
  // Focus on padding related properties
  console.log("\n📦 PADDING RELATED PROPERTIES:");
  const paddingProps = [
    'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',
    'paddingX', 'paddingY', 'horizontalPadding', 'verticalPadding'
  ];
  paddingProps.forEach(prop => {
    if (shape.hasOwnProperty(prop)) {
      console.log(`✅ ${prop}: ${JSON.stringify(shape[prop])}`);
    } else {
      console.log(`❌ ${prop}: not found`);
    }
  });
  
  // Check layout object
  if (shape.layout) {
    console.log("\n🎨 LAYOUT OBJECT PROPERTIES:");
    Object.keys(shape.layout).forEach(key => {
      console.log(`layout.${key}: ${JSON.stringify(shape.layout[key])}`);
    });
  } else {
    console.log("\n❌ No layout object found");
  }
  
  // Check fills for background
  if (shape.fills && Array.isArray(shape.fills)) {
    console.log("\n🎨 FILLS ARRAY:");
    shape.fills.forEach((fill, index) => {
      console.log(`fills[${index}]:`, JSON.stringify(fill, null, 2));
    });
  } else {
    console.log("\n❌ No fills array found");
  }
  
  // Check strokes for borders
  if (shape.strokes && Array.isArray(shape.strokes)) {
    console.log("\n✒️ STROKES ARRAY:");
    shape.strokes.forEach((stroke, index) => {
      console.log(`strokes[${index}]:`, JSON.stringify(stroke, null, 2));
    });
  } else {
    console.log("\n❌ No strokes array found");
  }
  
  // Check for any property containing "pad" or "radius"
  console.log("\n🔎 PROPERTIES CONTAINING 'pad' OR 'radius':");
  allProps.forEach(prop => {
    if (prop.toLowerCase().includes('pad') || prop.toLowerCase().includes('radius')) {
      console.log(`🎯 ${prop}: ${JSON.stringify(shape[prop])}`);
    }
  });
  
  console.log("\n" + "=".repeat(80));
}

// Mock function to simulate what would happen in the actual plugin
function simulatePluginExecution() {
  console.log("This script should be run within the Penpot plugin context.");
  console.log("In the actual plugin, it would:");
  console.log("1. Get the current page: penpot.currentPage");
  console.log("2. Find shapes by name or ID");
  console.log("3. Inspect the song-card element specifically");
  console.log("4. Look for elements with 'song-card' in the name");
  
  console.log("\n📝 TO USE THIS SCRIPT:");
  console.log("1. Copy this function into your plugin code");
  console.log("2. Call it when processing the song-card element");
  console.log("3. Check the console output in Penpot's developer tools");
  
  console.log("\n🎯 WHAT TO LOOK FOR:");
  console.log("- Properties that might contain border-radius values");
  console.log("- Properties that might contain padding values");
  console.log("- The exact structure of the layout object");
  console.log("- Any auto-layout or frame-specific properties");
}

// Example of how to integrate this into the actual plugin
function debugInPlugin() {
  console.log(`
// Add this to your export service or style extractor:

// In processShape method, before extracting styles:
if (shape.name && shape.name.includes('song-card')) {
  console.log('=== DEBUGGING SONG-CARD ===');
  inspectShapeProperties(shape, shape.name);
}

// Or in extractComprehensiveStyles function:
export function extractComprehensiveStyles(shape: any, _isInFlexContainer: boolean = false): Record<string, string> {
  // Add debug logging for specific elements
  if (shape?.name && shape.name.includes('song-card')) {
    console.log('🐛 DEBUG: Song-card element found');
    console.log('Shape object:', shape);
    console.log('Available properties:', Object.keys(shape));
  }
  
  // ... rest of the function
}
  `);
}

simulatePluginExecution();
debugInPlugin();

console.log("\n🚀 NEXT STEPS:");
console.log("1. Add debug logging to the actual plugin code");
console.log("2. Export the song-card element and check console");
console.log("3. Identify the correct property names for border-radius and padding");
console.log("4. Update the style extractor with the correct property names");