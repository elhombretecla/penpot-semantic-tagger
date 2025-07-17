/**
 * Utility script to debug Penpot data structure
 * This can be used to inspect the actual structure of Penpot shape objects
 */

// Function to inspect and log the structure of a Penpot shape
function inspectPenpotShape(shape) {
  // Create a simplified representation of the shape
  const simplifiedShape = {
    id: shape.id,
    name: shape.name,
    type: shape.type,
    hasChildren: !!shape.children && Array.isArray(shape.children),
    childrenCount: shape.children ? shape.children.length : 0,
    properties: {}
  };

  // Check for color-related properties
  const colorProperties = [
    'fills', 'fillColor', 'fill', 'color', 'fontColor', 
    'textColor', 'backgroundColor', 'stroke', 'strokes'
  ];

  colorProperties.forEach(prop => {
    if (shape[prop] !== undefined) {
      simplifiedShape.properties[prop] = {
        type: typeof shape[prop],
        value: shape[prop],
        structure: Array.isArray(shape[prop]) ? 'array' : 
                  (typeof shape[prop] === 'object' ? 'object' : 'primitive')
      };
    }
  });

  // Log the simplified structure
  console.log('Shape Structure:', JSON.stringify(simplifiedShape, null, 2));

  // If it has fills, inspect the first fill in detail
  if (shape.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
    console.log('First Fill Structure:', JSON.stringify(shape.fills[0], null, 2));
  }

  // If it has strokes, inspect the first stroke in detail
  if (shape.strokes && Array.isArray(shape.strokes) && shape.strokes.length > 0) {
    console.log('First Stroke Structure:', JSON.stringify(shape.strokes[0], null, 2));
  }

  // If it has text properties, inspect them
  if (shape.type === 'text') {
    const textProps = {
      fontFamily: shape.fontFamily,
      fontSize: shape.fontSize,
      fontWeight: shape.fontWeight,
      fontStyle: shape.fontStyle,
      fontColor: shape.fontColor,
      textColor: shape.textColor,
      color: shape.color
    };
    console.log('Text Properties:', JSON.stringify(textProps, null, 2));
  }
}

// Example usage in the plugin:
// This function would be called for each shape to debug
function debugPenpotData(shapes) {
  console.log('=== DEBUGGING PENPOT DATA STRUCTURE ===');
  console.log(`Inspecting ${shapes.length} shapes`);
  
  shapes.forEach((shape, index) => {
    console.log(`\n--- Shape ${index + 1} ---`);
    inspectPenpotShape(shape);
    
    // Recursively inspect children (first level only for brevity)
    if (shape.children && Array.isArray(shape.children) && shape.children.length > 0) {
      console.log(`\n--- Children of Shape ${index + 1} ---`);
      shape.children.forEach((child, childIndex) => {
        console.log(`\n--- Child ${childIndex + 1} ---`);
        inspectPenpotShape(child);
      });
    }
  });
}

// Export the debug function
module.exports = { debugPenpotData, inspectPenpotShape };