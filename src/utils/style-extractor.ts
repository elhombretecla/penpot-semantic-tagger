/**
 * Style extractor - Main interface (refactored to use modular architecture)
 * This file now delegates to specialized extractors for better maintainability
 */

import { StylesData } from '../types';
import { 
  extractStyles as legacyExtractStyles, 
  extractComprehensiveStyles as comprehensiveExtractStyles 
} from './extractors';

/**
 * Extract styles from Penpot element (legacy version for compatibility)
 * @deprecated Use extractComprehensiveStyles for full functionality
 */
export function extractStyles(element: any): StylesData {
  return legacyExtractStyles(element);
}

/**
 * Extract comprehensive styles with all positioning and dimensional data as CSS strings
 * Based on complete Penpot Plugin API documentation with ALL style parameters
 * @param shape Penpot shape object
 * @param _isInFlexContainer Whether this element is inside a flex/grid container (unused but kept for API compatibility)
 * @returns Styles object with CSS-ready string values
 */
export function extractComprehensiveStyles(shape: any, _isInFlexContainer: boolean = false): Record<string, string> {
  return comprehensiveExtractStyles(shape, _isInFlexContainer);
}

// Re-export individual extractors for advanced usage
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
} from './extractors';