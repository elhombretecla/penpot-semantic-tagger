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
 * Debug grid elements with detailed grid properties
 */
export function debugGridElement(shape: any): void {
  // Only debug elements that might have grid properties
  if (!shape?.grid && !shape?.layoutCell) {
    return;
  }

  console.log('🔲 DEBUG: Grid element found!');
  console.log('Element name:', shape.name);
  console.log('Element type:', shape.type);
  console.log('Element ID:', shape.id);

  // Log all available properties to see what's available
  console.log('📋 All available properties:', Object.keys(shape).sort());

  // Check for grid object (container properties)
  console.log('🔲 Grid object:', shape.grid);
  if (shape.grid) {
    console.log('  grid keys:', Object.keys(shape.grid));

    // Alignment properties
    console.log('  🎯 Alignment:');
    console.log('    alignItems:', shape.grid.alignItems);
    console.log('    alignContent:', shape.grid.alignContent);
    console.log('    justifyItems:', shape.grid.justifyItems);
    console.log('    justifyContent:', shape.grid.justifyContent);

    // Gap properties
    console.log('  📏 Gaps:');
    console.log('    rowGap:', shape.grid.rowGap);
    console.log('    columnGap:', shape.grid.columnGap);

    // Padding properties
    console.log('  📦 Padding:');
    console.log('    topPadding:', shape.grid.topPadding);
    console.log('    rightPadding:', shape.grid.rightPadding);
    console.log('    bottomPadding:', shape.grid.bottomPadding);
    console.log('    leftPadding:', shape.grid.leftPadding);
    console.log('    verticalPadding:', shape.grid.verticalPadding);
    console.log('    horizontalPadding:', shape.grid.horizontalPadding);

    // Sizing properties
    console.log('  📐 Sizing:');
    console.log('    horizontalSizing:', shape.grid.horizontalSizing);
    console.log('    verticalSizing:', shape.grid.verticalSizing);

    // Grid structure
    console.log('  🏗️ Grid Structure:');
    console.log('    dir:', shape.grid.dir);
    console.log('    rows:', shape.grid.rows);
    console.log('    columns:', shape.grid.columns);

    if (shape.grid.rows && Array.isArray(shape.grid.rows)) {
      console.log('    rows details:', shape.grid.rows.map((row: any, index: number) =>
        `Row ${index}: type=${row.type}, value=${row.value}`
      ));
    }

    if (shape.grid.columns && Array.isArray(shape.grid.columns)) {
      console.log('    columns details:', shape.grid.columns.map((col: any, index: number) =>
        `Col ${index}: type=${col.type}, value=${col.value}`
      ));
    }
  }

  // Check layoutCell object (grid item properties)
  console.log('📱 LayoutCell object:', shape.layoutCell);
  if (shape.layoutCell) {
    console.log('  layoutCell keys:', Object.keys(shape.layoutCell));

    console.log('  🎯 Grid Positioning:');
    console.log('    position:', shape.layoutCell.position);
    console.log('    row:', shape.layoutCell.row);
    console.log('    column:', shape.layoutCell.column);
    console.log('    rowSpan:', shape.layoutCell.rowSpan);
    console.log('    columnSpan:', shape.layoutCell.columnSpan);
    console.log('    areaName:', shape.layoutCell.areaName);
  }

  console.log('🔲 DEBUG: End of grid element inspection\n');
}

/**
 * Debug flex elements with detailed sizing properties
 */
export function debugFlexElement(shape: any): void {
  // Only debug elements that might have flex properties
  if (!shape?.flex && !shape?.layoutChild) {
    return;
  }

  console.log('🔧 DEBUG: Flex element found!');
  console.log('Element name:', shape.name);
  console.log('Element type:', shape.type);
  console.log('Element ID:', shape.id);

  // Log all available properties to see what's available
  console.log('📋 All available properties:', Object.keys(shape).sort());

  // Check for sizing properties at root level
  console.log('📏 Root-level sizing properties:');
  console.log('  horizontalSizing:', shape.horizontalSizing);
  console.log('  verticalSizing:', shape.verticalSizing);

  // Check flex object
  console.log('🔧 Flex object:', shape.flex);
  if (shape.flex) {
    console.log('  flex keys:', Object.keys(shape.flex));
    console.log('  flex.horizontalSizing:', shape.flex.horizontalSizing);
    console.log('  flex.verticalSizing:', shape.flex.verticalSizing);
  }

  // Check layoutChild object
  console.log('👶 LayoutChild object:', shape.layoutChild);
  if (shape.layoutChild) {
    console.log('  layoutChild keys:', Object.keys(shape.layoutChild));

    // Sizing properties
    console.log('  📏 Sizing:');
    console.log('    horizontalSizing:', shape.layoutChild.horizontalSizing);
    console.log('    verticalSizing:', shape.layoutChild.verticalSizing);

    // Positioning properties
    console.log('  🎯 Positioning:');
    console.log('    absolute:', shape.layoutChild.absolute);
    console.log('    zIndex:', shape.layoutChild.zIndex);
    console.log('    alignSelf:', shape.layoutChild.alignSelf);

    // Flex properties
    console.log('  🔧 Flex:');
    console.log('    flexGrow:', shape.layoutChild.flexGrow);
    console.log('    flexShrink:', shape.layoutChild.flexShrink);
    console.log('    flexBasis:', shape.layoutChild.flexBasis);

    // Margin properties
    console.log('  📐 Margins:');
    console.log('    topMargin:', shape.layoutChild.topMargin);
    console.log('    rightMargin:', shape.layoutChild.rightMargin);
    console.log('    bottomMargin:', shape.layoutChild.bottomMargin);
    console.log('    leftMargin:', shape.layoutChild.leftMargin);
    console.log('    horizontalMargin:', shape.layoutChild.horizontalMargin);
    console.log('    verticalMargin:', shape.layoutChild.verticalMargin);

    // Size constraints
    console.log('  📏 Size Constraints:');
    console.log('    maxWidth:', shape.layoutChild.maxWidth);
    console.log('    maxHeight:', shape.layoutChild.maxHeight);
    console.log('    minWidth:', shape.layoutChild.minWidth);
    console.log('    minHeight:', shape.layoutChild.minHeight);
  }

  // Check any property containing "sizing"
  console.log('🔎 Properties containing "sizing":');
  Object.keys(shape).forEach(key => {
    if (key.toLowerCase().includes('sizing')) {
      console.log(`  ${key}:`, shape[key]);
    }
  });

  console.log('🔧 DEBUG: End of flex element inspection\n');
}

/**
 * Debug image elements with detailed image properties
 */
export function debugImageElement(shape: any): void {
  // Only debug image elements or elements with image fills
  if (shape?.type !== 'image' && !hasImageFills(shape)) {
    return;
  }

  console.log('🖼️ DEBUG: Image element found!');
  console.log('Element name:', shape.name);
  console.log('Element type:', shape.type);
  console.log('Element ID:', shape.id);

  // Log all available properties to see what's available
  console.log('📋 All available properties:', Object.keys(shape).sort());

  // Image-specific properties
  console.log('🖼️ Image Properties:');
  console.log('  flipX:', shape.flipX);
  console.log('  flipY:', shape.flipY);
  console.log('  proportionLock:', shape.proportionLock);

  // For image elements, show shape-level image properties
  if (shape.type === 'image') {
    console.log('  🔍 Shape-level image properties:');
    console.log('    imageData:', shape.imageData);
    console.log('    imageId:', shape.imageId);
    console.log('    imageUrl:', shape.imageUrl);
    console.log('    image:', shape.image);

    // Show all properties that might contain image references
    Object.keys(shape).forEach(key => {
      if (key.toLowerCase().includes('image') || key.toLowerCase().includes('media')) {
        console.log(`    ${key}:`, shape[key]);
      }
    });
  }

  // Check fills for image data
  console.log('🎨 Fills (image data):');
  if (shape.fills && Array.isArray(shape.fills)) {
    shape.fills.forEach((fill: any, index: number) => {
      console.log(`  Fill ${index} (complete object):`, JSON.stringify(fill, null, 2));
      if (fill?.type === 'image' || fill?.fillImage) {
        console.log(`    🖼️ Image fill detected:`);
        console.log(`      type:`, fill.type);
        console.log(`      url:`, fill.url);
        console.log(`      imageData:`, fill.imageData);
        console.log(`      imageId:`, fill.imageId);
        console.log(`      imageHash:`, fill.imageHash);
        console.log(`      id:`, fill.id);
        console.log(`      fillImage:`, fill.fillImage);
        console.log(`      data:`, fill.data ? `${fill.data.substring(0, 50)}...` : undefined);

        // Check all properties that might contain image references
        console.log(`      🔍 All fill properties:`, Object.keys(fill));
        Object.keys(fill).forEach(key => {
          if (key.toLowerCase().includes('image') || key.toLowerCase().includes('id') || key.toLowerCase().includes('url')) {
            console.log(`        ${key}:`, fill[key]);
          }
        });
      }
    });
  } else {
    console.log('  No fills found or fills is not an array');
  }

  // Check exports (potential image sources)
  console.log('📤 Exports:');
  if (shape.exports && Array.isArray(shape.exports)) {
    shape.exports.forEach((exportConfig: any, index: number) => {
      console.log(`  Export ${index}:`, exportConfig);
    });
  }

  // Check plugin data for image references
  console.log('🔌 Plugin Data:');
  if (shape.getPluginDataKeys && typeof shape.getPluginDataKeys === 'function') {
    try {
      const keys = shape.getPluginDataKeys();
      console.log('  Available plugin data keys:', keys);
      keys.forEach((key: string) => {
        if (key.toLowerCase().includes('image') || key.toLowerCase().includes('url')) {
          console.log(`    ${key}:`, shape.getPluginData(key));
        }
      });
    } catch (e) {
      console.log('  Plugin data access failed:', e);
    }
  }

  // Check any property containing "image" or "url"
  console.log('🔎 Properties containing "image" or "url":');
  Object.keys(shape).forEach(key => {
    if (key.toLowerCase().includes('image') || key.toLowerCase().includes('url')) {
      console.log(`  ${key}:`, shape[key]);
    }
  });

  console.log('🖼️ DEBUG: End of image element inspection\n');
}

/**
 * Helper function to check if a shape has image fills
 */
function hasImageFills(shape: any): boolean {
  if (!shape?.fills || !Array.isArray(shape.fills)) {
    return false;
  }

  return shape.fills.some((fill: any) =>
    fill?.type === 'image' || fill?.fillImage || fill?.imageData || fill?.url
  );
}

/**
 * Main debug function that handles all element types
 */
export function debugElement(shape: any): void {
  try {
    debugSongCard(shape);
    debugTextElement(shape);
    debugImageElement(shape);
    debugGridElement(shape);
    debugFlexElement(shape);
  } catch (error) {
    console.warn("Error in debug logging:", error);
  }
}