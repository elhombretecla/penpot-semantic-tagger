/**
 * Typography extractor - Complete Penpot Text API implementation
 * Handles all text-related properties including fonts, spacing, alignment, and styling
 */

import { parseNumericValue, extractStringValue, isMixedValue, roundValue } from './base-extractor';
import { extractTextColor } from '../color-utils';

export interface TypographyStyles {
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  fontStyle?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textAlign?: string;
  textDecoration?: string;
  textTransform?: string;
  direction?: string;
  color?: string;
  whiteSpace?: string;
  overflowWrap?: string;
  overflow?: string;
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  background?: string;
  webkitBackgroundClip?: string;
  webkitTextFillColor?: string;
  backgroundClip?: string;
  width?: string;
  height?: string;
}

/**
 * Extract typography styles from a Penpot text element
 */
export function extractTypography(shape: any): TypographyStyles {
  const styles: TypographyStyles = {};

  // Only process text elements
  if (shape?.type !== 'text') {
    return styles;
  }

  try {
    // 🔤 FONT PROPERTIES
    // Font family
    const fontFamily = extractStringValue(shape.fontFamily);
    if (fontFamily) {
      styles.fontFamily = fontFamily;
    }

    // Font size - can be string or number in Penpot
    if (shape?.fontSize && !isMixedValue(shape.fontSize)) {
      const fontSize = parseNumericValue(shape.fontSize);
      if (fontSize !== null) {
        styles.fontSize = `${roundValue(fontSize)}px`;
      }
    }

    // Font weight
    if (shape?.fontWeight && !isMixedValue(shape.fontWeight)) {
      styles.fontWeight = String(shape.fontWeight);
    }

    // Font style
    const fontStyle = extractStringValue(shape.fontStyle);
    if (fontStyle) {
      styles.fontStyle = fontStyle;
    }

    // 📏 TEXT SPACING AND LAYOUT
    // Line height
    if (shape?.lineHeight && !isMixedValue(shape.lineHeight)) {
      if (typeof shape.lineHeight === 'string') {
        styles.lineHeight = shape.lineHeight;
      } else if (typeof shape.lineHeight === 'number') {
        styles.lineHeight = String(shape.lineHeight);
      }
    }

    // Letter spacing
    if (shape?.letterSpacing && !isMixedValue(shape.letterSpacing)) {
      const letterSpacing = parseNumericValue(shape.letterSpacing);
      if (letterSpacing !== null) {
        styles.letterSpacing = `${letterSpacing}px`;
      }
    }

    // 🎯 TEXT ALIGNMENT
    // Horizontal alignment
    if (shape?.align && !isMixedValue(shape.align)) {
      const alignMap: Record<string, string> = {
        'left': 'left',
        'center': 'center',
        'right': 'right',
        'justify': 'justify'
      };
      styles.textAlign = alignMap[shape.align] || shape.align;
    }

    // Vertical alignment - convert to flexbox
    if (shape?.verticalAlign && typeof shape.verticalAlign === 'string') {
      const verticalAlignMap: Record<string, string> = {
        'top': 'flex-start',
        'center': 'center',
        'bottom': 'flex-end'
      };
      const alignValue = verticalAlignMap[shape.verticalAlign];
      if (alignValue && !styles.display) {
        styles.display = 'flex';
        styles.flexDirection = 'column';
        styles.justifyContent = alignValue;
      }
    }

    // 🎨 TEXT STYLING
    // Text decoration
    if (shape?.textDecoration && !isMixedValue(shape.textDecoration)) {
      const decorationMap: Record<string, string> = {
        'underline': 'underline',
        'line-through': 'line-through',
        'none': 'none'
      };
      styles.textDecoration = decorationMap[shape.textDecoration] || shape.textDecoration;
    }

    // Text transform
    if (shape?.textTransform && !isMixedValue(shape.textTransform)) {
      const transformMap: Record<string, string> = {
        'uppercase': 'uppercase',
        'lowercase': 'lowercase',
        'capitalize': 'capitalize',
        'none': 'none'
      };
      styles.textTransform = transformMap[shape.textTransform] || shape.textTransform;
    }

    // Text direction
    const direction = extractStringValue(shape.direction);
    if (direction) {
      styles.direction = direction;
    }

    // 📐 TEXT BOX BEHAVIOR
    // Grow type affects how the text box behaves
    if (shape?.growType && typeof shape.growType === 'string') {
      switch (shape.growType) {
        case 'auto-width':
          styles.whiteSpace = 'nowrap';
          styles.width = 'auto';
          break;
        case 'auto-height':
          styles.height = 'auto';
          styles.overflowWrap = 'break-word';
          break;
        case 'fixed':
          styles.overflow = 'hidden';
          break;
      }
    }

    // 🎨 TEXT COLOR AND EFFECTS
    // Text color from fills
    if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0 && shape.fills !== 'mixed') {
      const fill = shape.fills[0];
      
      if (fill?.color) {
        styles.color = fill.color;
      }
      
      // Handle text gradients
      if (fill?.type === 'linear-gradient' && fill?.stops) {
        const gradientStops = fill.stops.map((stop: any) => 
          `${stop.color} ${roundValue(stop.offset * 100)}%`
        ).join(', ');
        const angle = fill.angle || 0;
        styles.background = `linear-gradient(${angle}deg, ${gradientStops})`;
        styles.webkitBackgroundClip = 'text';
        styles.webkitTextFillColor = 'transparent';
        styles.backgroundClip = 'text';
      }
    }

    // Fallback text color extraction
    if (!styles.color) {
      const textColor = extractTextColor(shape);
      if (textColor) {
        styles.color = textColor;
      }
    }

  } catch (error) {
    console.warn("Error extracting typography styles:", error);
  }

  return styles;
}