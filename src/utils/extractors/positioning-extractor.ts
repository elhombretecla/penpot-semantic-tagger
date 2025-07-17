/**
 * Positioning and dimensions extractor
 * Handles x, y, width, height, rotation, and positioning logic
 */

import { roundValue, isInFlexContainer } from './base-extractor';

export interface PositioningStyles {
  width?: string;
  height?: string;
  position?: string;
  left?: string;
  top?: string;
  transform?: string;
}

/**
 * Extract positioning and dimensional styles from a Penpot shape
 */
export function extractPositioning(shape: any): PositioningStyles {
  const styles: PositioningStyles = {};

  try {
    // Essential dimensions - always include these
    if (typeof shape?.width === 'number') {
      styles.width = `${roundValue(shape.width)}px`;
    }
    if (typeof shape?.height === 'number') {
      styles.height = `${roundValue(shape.height)}px`;
    }

    // Position coordinates - only if not in flex/grid container
    if (!isInFlexContainer(shape)) {
      styles.position = "absolute"; // Default positioning for Penpot elements
      
      if (typeof shape?.x === 'number') {
        styles.left = `${roundValue(shape.x)}px`;
      }
      if (typeof shape?.y === 'number') {
        styles.top = `${roundValue(shape.y)}px`;
      }
    }

    // Rotation - transform: rotate()
    if (typeof shape?.rotation === 'number' && shape.rotation !== 0) {
      styles.transform = `rotate(${shape.rotation}deg)`;
    }

  } catch (error) {
    console.warn("Error extracting positioning styles:", error);
  }

  return styles;
}