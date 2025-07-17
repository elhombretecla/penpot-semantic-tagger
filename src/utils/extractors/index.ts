/**
 * Main style extractor - Unified interface for all style extraction
 * Combines all specialized extractors into a cohesive system
 */

import { StylesData } from '../../types';
import { isInFlexContainer } from './base-extractor';
import { extractPositioning } from './positioning-extractor';
import { extractTypography } from './typography-extractor';
import { extractFlexLayout, extractLayoutChild, extractLegacyLayout } from './layout-extractor';
import { 
  extractBackground, 
  extractBorders, 
  extractBorderRadius, 
  extractEffects, 
  extractMiscVisual 
} from './visual-extractor';
import { debugElement } from './debug-extractor';

/**
 * Legacy function for backward compatibility
 * @deprecated Use extractComprehensiveStyles instead
 */
export function extractStyles(element: any): StylesData {
  // Simple extraction for legacy compatibility
  const styles: StylesData = {};

  try {
    // Basic positioning
    if (typeof element?.x === 'number') styles.left = `${Math.round(element.x)}px`;
    if (typeof element?.y === 'number') styles.top = `${Math.round(element.y)}px`;
    if (typeof element?.width === 'number') styles.width = `${Math.round(element.width)}px`;
    if (typeof element?.height === 'number') styles.height = `${Math.round(element.height)}px`;

    // Basic typography
    if (element?.fontFamily && typeof element.fontFamily === 'string') {
      styles.fontFamily = element.fontFamily;
    }
    if (typeof element?.fontSize === 'number') {
      styles.fontSize = `${Math.round(element.fontSize)}px`;
    }
    if (element?.fontWeight !== undefined && element.fontWeight !== null) {
      styles.fontWeight = String(element.fontWeight);
    }

    // Basic border radius
    if (typeof element?.borderRadius === 'number' && element.borderRadius > 0) {
      styles.borderRadius = `${Math.round(element.borderRadius)}px`;
    }

  } catch (error) {
    console.warn("Error in legacy style extraction:", error);
  }

  return styles;
}

/**
 * Main comprehensive style extraction function
 * Combines all specialized extractors for complete style coverage
 */
export function extractComprehensiveStyles(shape: any, _isInFlexContainer: boolean = false): Record<string, string> {
  const allStyles: Record<string, string> = {};

  try {
    // 🐛 DEBUG: Log properties for debugging (can be disabled in production)
    debugElement(shape);

    // 📐 POSITIONING AND DIMENSIONS
    const positioningStyles = extractPositioning(shape);
    Object.assign(allStyles, positioningStyles);

    // 🎨 VISUAL STYLES
    const backgroundStyles = extractBackground(shape);
    Object.assign(allStyles, backgroundStyles);

    const borderStyles = extractBorders(shape);
    Object.assign(allStyles, borderStyles);

    const borderRadiusStyles = extractBorderRadius(shape);
    Object.assign(allStyles, borderRadiusStyles);

    const effectStyles = extractEffects(shape);
    Object.assign(allStyles, effectStyles);

    const miscVisualStyles = extractMiscVisual(shape);
    Object.assign(allStyles, miscVisualStyles);

    // 📝 TYPOGRAPHY (for text elements)
    const typographyStyles = extractTypography(shape);
    Object.assign(allStyles, typographyStyles);

    // 🔧 LAYOUT STYLES
    // Priority: Flex layout > Layout child > Legacy layout
    const flexLayoutStyles = extractFlexLayout(shape);
    Object.assign(allStyles, flexLayoutStyles);

    const layoutChildStyles = extractLayoutChild(shape);
    Object.assign(allStyles, layoutChildStyles);

    // Legacy layout (only apply properties not already set)
    const legacyLayoutStyles = extractLegacyLayout(shape);
    Object.keys(legacyLayoutStyles).forEach(key => {
      const typedKey = key as keyof typeof legacyLayoutStyles;
      if (!allStyles[key] && legacyLayoutStyles[typedKey]) {
        allStyles[key] = legacyLayoutStyles[typedKey]!;
      }
    });

    // 📱 RESPONSIVE BEHAVIOR
    // For text elements in flex containers, remove absolute positioning
    if (shape?.type === 'text' && isInFlexContainer(shape)) {
      delete allStyles.position;
      delete allStyles.left;
      delete allStyles.top;
    }

    // Clean up undefined values
    Object.keys(allStyles).forEach(key => {
      if (allStyles[key] === undefined || allStyles[key] === null) {
        delete allStyles[key];
      }
    });

  } catch (error) {
    console.warn("Error extracting comprehensive styles:", error);
  }

  return allStyles;
}

// Export all individual extractors for advanced usage
export {
  extractPositioning,
  extractTypography,
  extractFlexLayout,
  extractLayoutChild,
  extractLegacyLayout,
  extractBackground,
  extractBorders,
  extractBorderRadius,
  extractEffects,
  extractMiscVisual,
  debugElement
};