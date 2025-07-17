// Test script to verify the border-radius fix

console.log("=== TESTING BORDER-RADIUS FIX ===\n");

// Simulate the song-card element with the properties we found in debug
const songCardElement = {
  id: "cb48b94c-2e94-801c-8006-81b0d4f817d4",
  name: "section / song-card",
  type: "board",
  x: 150,
  y: -70,
  width: 375,
  height: 92,
  
  // ✅ FOUND: These are the actual properties from debug output
  borderRadius: 16,
  borderRadiusTopLeft: 16,
  borderRadiusTopRight: 16,
  borderRadiusBottomRight: 16,
  borderRadiusBottomLeft: 16,
  
  // Layout properties (from the original JSON)
  // Note: These come from the layout analyzer, not direct properties
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 8,
  
  // Background color (from fills)
  fills: [{
    color: "#eae1ea"
  }]
};

// Simulate the updated extractComprehensiveStyles function
function simulateUpdatedExtraction(shape) {
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
  
  // Layout properties (these come from layout analyzer)
  if (shape.display) styles.display = shape.display;
  if (shape.flexDirection) styles.flexDirection = shape.flexDirection;
  if (shape.justifyContent) styles.justifyContent = shape.justifyContent;
  if (shape.alignItems) styles.alignItems = shape.alignItems;
  if (shape.gap) styles.gap = `${shape.gap}px`;
  
  return styles;
}

const extractedStyles = simulateUpdatedExtraction(songCardElement);

console.log("🎯 EXPECTED RESULT AFTER FIX:");
console.log(JSON.stringify(extractedStyles, null, 2));

console.log("\n✅ CHANGES MADE:");
console.log("1. Updated border-radius extraction to use shape.borderRadius");
console.log("2. Added support for individual corner radius properties");
console.log("3. Prioritized borderRadius over legacy rx/ry properties");

console.log("\n🔍 WHAT SHOULD HAPPEN NOW:");
console.log("1. Install the updated plugin in Penpot");
console.log("2. Export the song-card element");
console.log("3. The JSON should now include: 'borderRadius': '16px'");

console.log("\n📦 PADDING STATUS:");
console.log("❌ Padding properties were not found in the debug output");
console.log("🔍 This suggests either:");
console.log("   - Padding is not set as direct properties on the element");
console.log("   - Padding is handled differently in Penpot (CSS-level, not object-level)");
console.log("   - Padding is applied through auto-layout which we need to detect differently");

console.log("\n🚀 NEXT STEPS:");
console.log("1. Test the border-radius fix first");
console.log("2. Run the extended debug to check flex, layoutCell, layoutChild objects");
console.log("3. If padding is still not found, it might be applied at the CSS level");
console.log("4. Consider that padding might be implicit in auto-layout containers");

console.log("\n💡 PADDING INVESTIGATION:");
console.log("The visual padding you see might be:");
console.log("- Auto-layout spacing between child elements");
console.log("- CSS padding applied by Penpot's rendering engine");
console.log("- Implicit spacing from flexbox gap and alignment");
console.log("- Not exposed as direct object properties in the plugin API");