/**
 * Base extractor utilities and common functions
 */

/**
 * Safely parse a numeric value from string or number
 */
export function parseNumericValue(value: any): number | null {
  if (typeof value === 'number') {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? null : parsed;
  }
  return null;
}

/**
 * Check if a value is "mixed" (Penpot's way of indicating multiple values)
 */
export function isMixedValue(value: any): boolean {
  return value === 'mixed';
}

/**
 * Safely get a CSS pixel value from a numeric input
 */
export function toCSSPixels(value: any): string | null {
  const numValue = parseNumericValue(value);
  return numValue !== null ? `${Math.round(numValue)}px` : null;
}

/**
 * Check if an element is in a flex container
 */
export function isInFlexContainer(shape: any): boolean {
  return shape._isInFlexContainer === true || !!shape.layoutChild;
}

/**
 * Safely extract string value, ignoring "mixed" values
 */
export function extractStringValue(value: any): string | null {
  if (typeof value === 'string' && !isMixedValue(value)) {
    return value;
  }
  return null;
}

/**
 * Round numeric values for consistent CSS output
 */
export function roundValue(value: number): number {
  return Math.round(value);
}