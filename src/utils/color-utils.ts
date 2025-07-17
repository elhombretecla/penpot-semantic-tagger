/**
 * Utility functions for color conversion and handling
 */

/**
 * Convert color object to CSS rgba string
 * @param colorObj Color object from Penpot
 * @returns CSS rgba string or null if conversion fails
 */
export function colorToCssRgba(colorObj: any): string | null {
  if (!colorObj) return null;
  
  // Handle different color object formats
  let r, g, b, alpha = 1;
  
  if (typeof colorObj.r === 'number' && typeof colorObj.g === 'number' && typeof colorObj.b === 'number') {
    r = colorObj.r;
    g = colorObj.g;
    b = colorObj.b;
    alpha = typeof colorObj.alpha === 'number' ? colorObj.alpha : 1;
    
    // Check if values are in 0-1 range (Penpot standard) or 0-255 range
    const needsScaling = (r <= 1 && g <= 1 && b <= 1);
    
    return `rgba(${Math.round(needsScaling ? r * 255 : r)}, ${Math.round(needsScaling ? g * 255 : g)}, ${Math.round(needsScaling ? b * 255 : b)}, ${alpha})`;
  }
  
  // Handle hex format
  if (typeof colorObj === 'string' && colorObj.startsWith('#')) {
    return colorObj;
  }
  
  return null;
}

/**
 * Extract background color from shape using multiple fallback approaches
 * @param shape Penpot shape object
 * @returns CSS color string or null
 */
export function extractBackgroundColor(shape: any): string | null {
  let bgColor = null;
  
  // 1. Try fills array first (most common in Penpot)
  if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
    const fill = shape.fills[0];
    
    // Try fillColor property
    if (fill?.fillColor) {
      bgColor = colorToCssRgba(fill.fillColor);
    }
    
    // Try color property if fillColor didn't work
    if (!bgColor && fill?.color) {
      bgColor = colorToCssRgba(fill.color);
    }
    
    // Try fill.value for some Penpot versions
    if (!bgColor && fill?.value) {
      bgColor = colorToCssRgba(fill.value);
    }
  }
  
  // 2. Try direct backgroundColor property
  if (!bgColor && shape?.backgroundColor) {
    bgColor = colorToCssRgba(shape.backgroundColor);
  }
  
  // 3. Try direct fill property
  if (!bgColor && shape?.fill) {
    bgColor = colorToCssRgba(shape.fill);
  }
  
  // 4. Try direct color property if it's not a text element
  // (for text elements, color is used for text color)
  if (!bgColor && shape?.color && shape.type !== 'text') {
    bgColor = colorToCssRgba(shape.color);
  }
  
  return bgColor;
}

/**
 * Extract text color from shape using multiple fallback approaches
 * @param shape Penpot shape object
 * @returns CSS color string or default black color
 */
export function extractTextColor(shape: any): string | null {
  let textColor = null;
  
  // For text elements, try to find the text color using various properties
  if (shape.type === 'text' || shape.characters) {
    // 1. Try fontColor property (most common in Penpot)
    if (!textColor && shape?.fontColor) {
      textColor = colorToCssRgba(shape.fontColor);
    }
    
    // 2. Try textColor property
    if (!textColor && shape?.textColor) {
      textColor = colorToCssRgba(shape.textColor);
    }
    
    // 3. Try color property directly
    if (!textColor && shape?.color) {
      textColor = colorToCssRgba(shape.color);
    }
    
    // 4. Try content.color property (used in some Penpot versions)
    if (!textColor && shape?.content?.color) {
      textColor = colorToCssRgba(shape.content.color);
    }
    
    // 5. Try text.color property (used in some Penpot versions)
    if (!textColor && shape?.text?.color) {
      textColor = colorToCssRgba(shape.text.color);
    }
    
    // 6. Try fills for text (sometimes Penpot uses fills for text color)
    if (!textColor && shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
      const fill = shape.fills[0];
      if (fill?.fillColor) {
        textColor = colorToCssRgba(fill.fillColor);
      } else if (fill?.color) {
        textColor = colorToCssRgba(fill.color);
      }
    }
    
    // Default text color if nothing found but it's a text element
    if (!textColor) {
      textColor = "rgba(0, 0, 0, 1)";
    }
  }
  
  return textColor;
}

/**
 * Extract stroke color from shape
 * @param stroke Stroke object from Penpot
 * @returns CSS color string or null
 */
export function extractStrokeColor(stroke: any): string | null {
  let strokeColor = null;
  
  if (stroke?.strokeColor) {
    strokeColor = colorToCssRgba(stroke.strokeColor);
  } else if (stroke?.color) {
    strokeColor = colorToCssRgba(stroke.color);
  } else if (stroke?.stroke) {
    strokeColor = colorToCssRgba(stroke.stroke);
  }
  
  return strokeColor;
}

/**
 * Extract shadow color from shadow object
 * @param shadow Shadow object from Penpot
 * @returns CSS color string or null
 */
export function extractShadowColor(shadow: any): string | null {
  let shadowColor = null;
  
  if (shadow?.color) {
    shadowColor = colorToCssRgba(shadow.color);
  } else if (shadow?.shadowColor) {
    shadowColor = colorToCssRgba(shadow.shadowColor);
  }
  
  return shadowColor;
}