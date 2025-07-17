/**
 * Debug extractor - Comprehensive debugging system
 * Provides detailed logging for song-card and text elements
 */

/**
 * Debug song-card elements with comprehensive property logging
 */
export function debugSongCard(shape: any): void {
  if (!shape?.name || !shape.name.includes('song-card')) {
    return;
  }

  console.log('🐛 DEBUG: Song-card element found!');
  console.log('Element name:', shape.name);
  console.log('Element type:', shape.type);
  console.log('Element ID:', shape.id);
  
  // Log all available properties
  console.log('📋 All available properties:', Object.keys(shape).sort());
  
  // Check for border-radius properties
  console.log('🔘 Border-radius checks:');
  console.log('  rx:', shape.rx);
  console.log('  ry:', shape.ry);
  console.log('  radius:', shape.radius);
  console.log('  radii:', shape.radii);
  console.log('  borderRadius:', shape.borderRadius);
  console.log('  cornerRadius:', shape.cornerRadius);
  
  // Check for padding properties - extended search
  console.log('📦 Padding checks:');
  console.log('  padding:', shape.padding);
  console.log('  paddingX:', shape.paddingX);
  console.log('  paddingY:', shape.paddingY);
  console.log('  horizontalPadding:', shape.horizontalPadding);
  console.log('  verticalPadding:', shape.verticalPadding);
  
  // Check layout object
  console.log('🎨 Layout object:', shape.layout);
  if (shape.layout) {
    console.log('  layout keys:', Object.keys(shape.layout));
    console.log('  layout.paddingTop:', shape.layout.paddingTop);
    console.log('  layout.paddingRight:', shape.layout.paddingRight);
    console.log('  layout.paddingBottom:', shape.layout.paddingBottom);
    console.log('  layout.paddingLeft:', shape.layout.paddingLeft);
  }
  
  // Check flex object (alternative layout structure)
  console.log('🔧 Flex object:', shape.flex);
  if (shape.flex) {
    console.log('  flex keys:', Object.keys(shape.flex));
  }
  
  // Check layoutCell object
  console.log('📱 LayoutCell object:', shape.layoutCell);
  if (shape.layoutCell) {
    console.log('  layoutCell keys:', Object.keys(shape.layoutCell));
  }
  
  // Check layoutChild object
  console.log('👶 LayoutChild object:', shape.layoutChild);
  if (shape.layoutChild) {
    console.log('  layoutChild keys:', Object.keys(shape.layoutChild));
  }
  
  // Check fills for background
  console.log('🎨 Fills:', shape.fills);
  
  // Check any property containing "pad" or "radius"
  console.log('🔎 Properties containing "pad" or "radius":');
  Object.keys(shape).forEach(key => {
    if (key.toLowerCase().includes('pad') || key.toLowerCase().includes('radius')) {
      console.log(`  ${key}:`, shape[key]);
    }
  });
  
  console.log('🐛 DEBUG: End of song-card inspection\n');
}

/**
 * Debug text elements with detailed typography logging
 */
export function debugTextElement(shape: any): void {
  if (shape?.type !== 'text') {
    return;
  }

  console.log('🐛 DEBUG: Text element found!');
  console.log('Element name:', shape.name);
  console.log('Element type:', shape.type);
  console.log('Element ID:', shape.id);
  
  // Log text-specific properties
  console.log('📝 Text properties:');
  console.log('  characters:', shape.characters);
  console.log('  growType:', shape.growType);
  
  // Font properties (from Penpot Font API)
  console.log('🔤 Font properties:');
  console.log('  fontId:', shape.fontId);
  console.log('  fontFamily:', shape.fontFamily);
  console.log('  fontVariantId:', shape.fontVariantId);
  console.log('  fontSize:', shape.fontSize, typeof shape.fontSize);
  console.log('  fontWeight:', shape.fontWeight, typeof shape.fontWeight);
  console.log('  fontStyle:', shape.fontStyle);
  
  // Text styling properties
  console.log('🎨 Text styling:');
  console.log('  lineHeight:', shape.lineHeight, typeof shape.lineHeight);
  console.log('  letterSpacing:', shape.letterSpacing, typeof shape.letterSpacing);
  console.log('  textTransform:', shape.textTransform);
  console.log('  textDecoration:', shape.textDecoration);
  console.log('  direction:', shape.direction);
  console.log('  align:', shape.align);
  console.log('  verticalAlign:', shape.verticalAlign);
  
  // Check positioning
  console.log('📐 Position properties:');
  console.log('  x:', shape.x);
  console.log('  y:', shape.y);
  console.log('  width:', shape.width);
  console.log('  height:', shape.height);
  console.log('  _isInFlexContainer:', shape._isInFlexContainer);
  
  // Check layout child properties
  console.log('👶 LayoutChild:', shape.layoutChild);
  if (shape.layoutChild) {
    console.log('  layoutChild keys:', Object.keys(shape.layoutChild));
  }
  
  // Check fills (text color)
  console.log('🎨 Fills (text color):', shape.fills);
  
  console.log('🐛 DEBUG: End of text element inspection\n');
}

/**
 * Main debug function that handles all element types
 */
export function debugElement(shape: any): void {
  try {
    debugSongCard(shape);
    debugTextElement(shape);
  } catch (error) {
    console.warn("Error in debug logging:", error);
  }
}