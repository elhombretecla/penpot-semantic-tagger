import { StylesData } from '../types';
import { 
  extractBackgroundColor, 
  extractTextColor, 
  extractStrokeColor, 
  extractShadowColor 
} from './color-utils';

/**
 * Extract styles from Penpot element (legacy version for compatibility)
 */
export function extractStyles(element: any): StylesData {
  const styles: StylesData = {};

  try {
    // Position and dimensions - ALWAYS include these as they're essential (rounded to integers)
    if (element?.x !== undefined && element.x !== null && typeof element.x === 'number') {
      styles.left = `${Math.round(element.x)}px`;
    }
    if (element?.y !== undefined && element.y !== null && typeof element.y === 'number') {
      styles.top = `${Math.round(element.y)}px`;
    }
    if (element?.width && typeof element.width === 'number') {
      styles.width = `${Math.round(element.width)}px`;
    }
    if (element?.height && typeof element.height === 'number') {
      styles.height = `${Math.round(element.height)}px`;
    }

    // Background color
    const bgColor = extractBackgroundColor(element);
    if (bgColor) {
      styles.backgroundColor = bgColor;
    }

    // Text properties
    if (element?.fontFamily && typeof element.fontFamily === 'string') {
      styles.fontFamily = element.fontFamily;
    }
    if (element?.fontSize && typeof element.fontSize === 'number') {
      styles.fontSize = `${Math.round(element.fontSize)}px`;
    }
    if (element?.fontWeight !== undefined && element.fontWeight !== null) {
      styles.fontWeight = String(element.fontWeight);
    }
    if (element?.textAlign && typeof element.textAlign === 'string') {
      styles.textAlign = element.textAlign;
    }
    if (element?.lineHeight !== undefined && element.lineHeight !== null) {
      styles.lineHeight = String(element.lineHeight);
    }

    // Text color
    const textColor = extractTextColor(element);
    if (textColor) {
      styles.color = textColor;
    }

    // Border radius (rounded to integers)
    if ((element?.rx && typeof element.rx === 'number') || (element?.ry && typeof element.ry === 'number')) {
      const radius = element.rx || element.ry || 0;
      styles.borderRadius = `${Math.round(radius)}px`;
    }

    // Opacity
    if (element?.opacity !== undefined && element.opacity !== null && typeof element.opacity === 'number' && element.opacity !== 1) {
      styles.opacity = String(element.opacity);
    }

    // Strokes (borders) - rounded stroke width
    if (element?.strokes && Array.isArray(element.strokes) && element.strokes.length > 0) {
      const stroke = element.strokes[0];
      const strokeColor = extractStrokeColor(stroke);
      
      if (strokeColor && stroke?.strokeWidth && typeof stroke.strokeWidth === 'number') {
        styles.border = `${Math.round(stroke.strokeWidth)}px solid ${strokeColor}`;
      }
    }

    // Shadow effects - rounded shadow values
    if (element?.shadows && Array.isArray(element.shadows) && element.shadows.length > 0) {
      const shadow = element.shadows[0];
      const shadowColor = extractShadowColor(shadow);
      
      if (shadowColor && shadow?.offsetX !== undefined && shadow.offsetX !== null) {
        const blur = Math.round(shadow.blur || 0);
        const spread = Math.round(shadow.spread || 0);
        styles.boxShadow = `${Math.round(shadow.offsetX)}px ${Math.round(shadow.offsetY || 0)}px ${blur}px ${spread}px ${shadowColor}`;
      }
    }
  } catch (error) {
    console.warn("Error extracting styles:", error);
  }

  return styles;
}

/**
 * Extract comprehensive styles with all positioning and dimensional data as CSS strings
 * @param shape Penpot shape object
 * @param _isInFlexContainer Whether this element is inside a flex/grid container (unused but kept for API compatibility)
 * @returns Styles object with CSS-ready string values
 */
export function extractComprehensiveStyles(shape: any, _isInFlexContainer: boolean = false): Record<string, string> {
  const styles: Record<string, string> = {};

  try {
    // ESSENTIAL: Dimensions - always include these (rounded to integers)
    if (typeof shape?.width === 'number') {
      styles.width = `${Math.round(shape.width)}px`;
    }
    if (typeof shape?.height === 'number') {
      styles.height = `${Math.round(shape.height)}px`;
    }

    // Only apply absolute positioning if not in a flex/grid container
    // Elements in flex/grid containers should use the container's layout system
    if (!shape._isInFlexContainer) {
      styles.position = "absolute"; // Default positioning for Penpot elements
      if (typeof shape?.x === 'number') {
        styles.left = `${Math.round(shape.x)}px`;
      }
      if (typeof shape?.y === 'number') {
        styles.top = `${Math.round(shape.y)}px`;
      }
    }

    // Background color
    const bgColor = extractBackgroundColor(shape);
    if (bgColor) {
      styles.backgroundColor = bgColor;
    }

    // Typography properties
    if (shape?.fontFamily && typeof shape.fontFamily === 'string') {
      styles.fontFamily = shape.fontFamily;
    }
    if (typeof shape?.fontSize === 'number') {
      styles.fontSize = `${Math.round(shape.fontSize)}px`;
    }
    if (shape?.fontWeight !== undefined && shape.fontWeight !== null) {
      styles.fontWeight = String(shape.fontWeight);
    }
    if (shape?.fontStyle && typeof shape.fontStyle === 'string') {
      styles.fontStyle = shape.fontStyle;
    }
    if (shape?.textAlign && typeof shape.textAlign === 'string') {
      styles.textAlign = shape.textAlign;
    }
    if (shape?.lineHeight !== undefined && shape.lineHeight !== null) {
      styles.lineHeight = String(shape.lineHeight);
    }

    // Text color
    const textColor = extractTextColor(shape);
    if (textColor) {
      styles.color = textColor;
    }

    // Border radius (rounded to integers)
    if (typeof shape?.rx === 'number' || typeof shape?.ry === 'number') {
      const radius = shape.rx || shape.ry || 0;
      styles.borderRadius = `${Math.round(radius)}px`;
    }

    // Borders from strokes
    if (shape?.strokes && Array.isArray(shape.strokes) && shape.strokes.length > 0) {
      const stroke = shape.strokes[0];
      const strokeColor = extractStrokeColor(stroke);
      
      // Get stroke width
      const strokeWidth = typeof stroke?.strokeWidth === 'number' ? stroke.strokeWidth : 
                         (typeof stroke?.width === 'number' ? stroke.width : null);
      
      // Apply border style if we have both color and width
      if (strokeColor && strokeWidth !== null) {
        styles.border = `${Math.round(strokeWidth)}px solid ${strokeColor}`;
      }
    }

    // Box shadow from effects
    if (shape?.shadows && Array.isArray(shape.shadows) && shape.shadows.length > 0) {
      const shadow = shape.shadows[0];
      const shadowColor = extractShadowColor(shadow);
      
      // Get shadow parameters with fallbacks
      if (shadowColor && shadow?.offsetX !== undefined) {
        const offsetX = Math.round(shadow.offsetX || 0);
        const offsetY = Math.round(shadow.offsetY || 0);
        const blur = Math.round(shadow.blur || shadow.blurRadius || 0);
        const spread = Math.round(shadow.spread || shadow.spreadRadius || 0);
        
        styles.boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`;
      }
    }

    // Opacity
    if (typeof shape?.opacity === 'number' && shape.opacity !== 1) {
      styles.opacity = String(shape.opacity);
    }

  } catch (error) {
    console.warn("Error extracting comprehensive styles:", error);
  }

  return styles;
}