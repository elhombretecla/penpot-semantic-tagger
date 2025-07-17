// Debug script to examine padding and border-radius properties in Penpot elements

console.log("=== DEBUGGING PADDING AND BORDER-RADIUS PROPERTIES ===");

// Get current page
const currentPage = penpot.currentPage;
if (!currentPage) {
  console.log("No current page found");
} else {
  console.log(`Current page: ${currentPage.name}`);
  
  // Get all shapes in the page
  const allShapes = currentPage.children || [];
  console.log(`Total shapes in page: ${allShapes.length}`);
  
  // Look for shapes that might be the song-card
  allShapes.forEach((shape, index) => {
    console.log(`\n--- Shape ${index + 1}: ${shape.name || 'Unnamed'} (${shape.type}) ---`);
    console.log(`ID: ${shape.id}`);
    console.log(`Dimensions: ${shape.width}x${shape.height}`);
    console.log(`Position: (${shape.x}, ${shape.y})`);
    
    // Check for border radius properties
    console.log("\n🔍 Border Radius Properties:");
    console.log(`rx: ${shape.rx}`);
    console.log(`ry: ${shape.ry}`);
    console.log(`borderRadius: ${shape.borderRadius}`);
    console.log(`cornerRadius: ${shape.cornerRadius}`);
    console.log(`radius: ${shape.radius}`);
    
    // Check for padding properties
    console.log("\n📦 Padding Properties:");
    console.log(`padding: ${shape.padding}`);
    console.log(`paddingTop: ${shape.paddingTop}`);
    console.log(`paddingRight: ${shape.paddingRight}`);
    console.log(`paddingBottom: ${shape.paddingBottom}`);
    console.log(`paddingLeft: ${shape.paddingLeft}`);
    console.log(`paddingX: ${shape.paddingX}`);
    console.log(`paddingY: ${shape.paddingY}`);
    console.log(`horizontalPadding: ${shape.horizontalPadding}`);
    console.log(`verticalPadding: ${shape.verticalPadding}`);
    console.log(`innerPadding: ${shape.innerPadding}`);
    
    // Check for layout properties that might contain padding
    console.log("\n🎨 Layout Properties:");
    console.log(`layoutPadding: ${shape.layoutPadding}`);
    console.log(`layoutGap: ${shape.layoutGap}`);
    console.log(`gap: ${shape.gap}`);
    console.log(`spacing: ${shape.spacing}`);
    
    // Check for frame-specific properties
    if (shape.type === 'frame' || shape.type === 'group') {
      console.log("\n🖼️ Frame/Group Properties:");
      console.log(`frameType: ${shape.frameType}`);
      console.log(`layoutType: ${shape.layoutType}`);
      console.log(`layoutDirection: ${shape.layoutDirection}`);
      console.log(`layoutWrap: ${shape.layoutWrap}`);
      console.log(`layoutAlignItems: ${shape.layoutAlignItems}`);
      console.log(`layoutJustifyContent: ${shape.layoutJustifyContent}`);
      console.log(`layoutGap: ${shape.layoutGap}`);
      console.log(`layoutPaddingTop: ${shape.layoutPaddingTop}`);
      console.log(`layoutPaddingRight: ${shape.layoutPaddingRight}`);
      console.log(`layoutPaddingBottom: ${shape.layoutPaddingBottom}`);
      console.log(`layoutPaddingLeft: ${shape.layoutPaddingLeft}`);
    }
    
    // Check for style-related properties
    console.log("\n🎭 Style Properties:");
    console.log(`fills: ${JSON.stringify(shape.fills)}`);
    console.log(`strokes: ${JSON.stringify(shape.strokes)}`);
    console.log(`shadows: ${JSON.stringify(shape.shadows)}`);
    
    // Look for any property that might contain "pad" or "radius"
    console.log("\n🔎 All properties containing 'pad' or 'radius':");
    Object.keys(shape).forEach(key => {
      if (key.toLowerCase().includes('pad') || key.toLowerCase().includes('radius')) {
        console.log(`${key}: ${shape[key]}`);
      }
    });
    
    // If this looks like the song-card (has children and reasonable dimensions)
    if (shape.children && shape.children.length > 0 && shape.width > 300 && shape.height < 150) {
      console.log("\n🎵 This might be the song-card! Full object keys:");
      console.log(Object.keys(shape).sort());
      
      console.log("\n📋 Full shape object (first level):");
      const shapeInfo = {};
      Object.keys(shape).forEach(key => {
        const value = shape[key];
        if (typeof value === 'object' && value !== null) {
          shapeInfo[key] = `[${typeof value}] ${Array.isArray(value) ? `Array(${value.length})` : 'Object'}`;
        } else {
          shapeInfo[key] = value;
        }
      });
      console.log(JSON.stringify(shapeInfo, null, 2));
    }
  });
}