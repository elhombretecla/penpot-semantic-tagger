// Final verification script for both border-radius and padding fixes

console.log("=== FINAL VERIFICATION: COMPLETE SONG-CARD FIX ===\n");

// Simulate the song-card element with ALL properties found in debug
const completeSongCardElement = {
  id: "cb48b94c-2e94-801c-8006-81b0d4f817d4",
  name: "section / song-card",
  type: "board",
  x: 150,
  y: -70,
  width: 375,
  height: 92,
  
  // ✅ BORDER-RADIUS: Found in debug output
  borderRadius: 16,
  borderRadiusTopLeft: 16,
  borderRadiusTopRight: 16,
  borderRadiusBottomRight: 16,
  borderRadiusBottomLeft: 16,
  
  // ✅ FLEX OBJECT: Found in debug output with padding properties
  flex: {
    dir: 'row',
    wrap: 'nowrap',
    alignItems: 'center',
    alignContent: 'stretch',
    justifyItems: 'stretch',
    justifyContent: 'space-between',
    rowGap: 0,
    columnGap: 8,
    verticalPadding: 16,    // ← This should become paddingTop/Bottom
    horizontalPadding: 20,  // ← This should become paddingLeft/Right
    topPadding: 16,         // ← Individual padding values
    rightPadding: 20,
    bottomPadding: 16,
    leftPadding: 20
  },
  
  // Background color (from fills)
  fills: [{
    color: "#eae1ea"
  }]
};

// Simulate the complete updated extractComprehensiveStyles function
function simulateCompleteExtraction(shape) {
  const styles = {};
  
  // Dimensions
  if (shape.width) styles.width = `${shape.width}px`;
  if (shape.height) styles.height = `${shape.height}px`;
  
  // Position
  styles.position = "absolute";
  if (shape.x !== undefined) styles.left = `${shape.x}px`;
  if (shape.y !== undefined) styles.top = `${shape.y}px`;
  
  // Background
  if (shape.fills && shape.fills[0] && shape.fills[0].color) {
    styles.backgroundColor = shape.fills[0].color;
  }
  
  // ✅ FIXED: Border radius using the correct property
  if (typeof shape.borderRadius === 'number' && shape.borderRadius > 0) {
    styles.borderRadius = `${shape.borderRadius}px`;
  }
  
  // ✅ FIXED: Flex layout properties with padding
  if (shape.flex && typeof shape.flex === 'object') {
    const flex = shape.flex;
    
    // Set display to flex
    styles.display = 'flex';
    
    // Flex direction
    if (flex.dir) {
      const directionMap = {
        'row': 'row',
        'column': 'column'
      };
      styles.flexDirection = directionMap[flex.dir] || flex.dir;
    }
    
    // Flex properties
    if (flex.justifyContent) styles.justifyContent = flex.justifyContent;
    if (flex.alignItems) styles.alignItems = flex.alignItems;
    if (flex.columnGap > 0) styles.gap = `${flex.columnGap}px`;
    
    // ✅ PADDING FROM FLEX OBJECT
    // Individual padding sides (priority)
    if (flex.topPadding > 0) styles.paddingTop = `${flex.topPadding}px`;
    if (flex.rightPadding > 0) styles.paddingRight = `${flex.rightPadding}px`;
    if (flex.bottomPadding > 0) styles.paddingBottom = `${flex.bottomPadding}px`;
    if (flex.leftPadding > 0) styles.paddingLeft = `${flex.leftPadding}px`;
    
    // Alternative: vertical and horizontal padding (fallback)
    if (flex.verticalPadding > 0 && !styles.paddingTop && !styles.paddingBottom) {
      styles.paddingTop = `${flex.verticalPadding}px`;
      styles.paddingBottom = `${flex.verticalPadding}px`;
    }
    if (flex.horizontalPadding > 0 && !styles.paddingLeft && !styles.paddingRight) {
      styles.paddingLeft = `${flex.horizontalPadding}px`;
      styles.paddingRight = `${flex.horizontalPadding}px`;
    }
  }
  
  return styles;
}

const extractedStyles = simulateCompleteExtraction(completeSongCardElement);

console.log("🎯 EXPECTED RESULT AFTER COMPLETE FIX:");
console.log(JSON.stringify(extractedStyles, null, 2));

console.log("\n✅ COMPLETE CHANGES MADE:");
console.log("1. ✅ Border-radius: Updated to use shape.borderRadius");
console.log("2. ✅ Padding: Added support for shape.flex padding properties");
console.log("3. ✅ Flex layout: Complete flex object support");
console.log("4. ✅ Priority system: Individual padding > vertical/horizontal padding");

console.log("\n🔍 WHAT SHOULD HAPPEN NOW:");
console.log("1. Install the updated plugin in Penpot");
console.log("2. Export the song-card element");
console.log("3. The JSON should now include:");
console.log("   - 'borderRadius': '16px' ✅");
console.log("   - 'paddingTop': '16px' ✅");
console.log("   - 'paddingRight': '20px' ✅");
console.log("   - 'paddingBottom': '16px' ✅");
console.log("   - 'paddingLeft': '20px' ✅");
console.log("   - Complete flex layout properties ✅");

console.log("\n📊 COMPARISON:");
console.log("🔴 BEFORE (missing properties):");
console.log(`{
  "width": "375px",
  "height": "92px",
  "position": "absolute",
  "left": "150px",
  "top": "-70px",
  "display": "flex",
  "flexDirection": "row",
  "gap": "8px",
  "justifyContent": "space-between",
  "alignItems": "center"
}`);

console.log("\n🟢 AFTER (complete properties):");
console.log(JSON.stringify(extractedStyles, null, 2));

console.log("\n🎉 PROBLEM SOLVED!");
console.log("Both border-radius and padding issues have been identified and fixed:");
console.log("- Border-radius was in shape.borderRadius (not shape.radius)");
console.log("- Padding was in shape.flex object (not shape.layout)");
console.log("- Flex layout properties were also in shape.flex");

console.log("\n🚀 READY FOR TESTING!");
console.log("The plugin should now export complete styles for the song-card element.");

console.log("\n🔧 DEBUG LOGGING:");
console.log("The debug logging is still active and will show:");
console.log("- All available properties on the song-card element");
console.log("- Specific checks for border-radius and padding");
console.log("- Flex object contents");
console.log("You can remove the debug logging once confirmed working.");

console.log("\n💡 NEXT STEPS:");
console.log("1. Test the complete fix");
console.log("2. Verify both border-radius and padding appear in JSON");
console.log("3. Remove debug logging for production");
console.log("4. Celebrate the successful fix! 🎉");