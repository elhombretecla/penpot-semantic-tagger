/**
 * Visual effects extractor - Colors, borders, shadows, and visual effects
 * Handles fills, strokes, border-radius, shadows, opacity, and other visual properties
 */

import { roundValue } from './base-extractor';
import { extractBackgroundColor, extractStrokeColor, extractShadowColor } from '../color-utils';

export interface VisualStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  opacity?: string;
  visibility?: string;
  display?: string;
  mixBlendMode?: string;
  border?: string;
  borderRadius?: string;
  boxSizing?: string;
  boxShadow?: string;
  filter?: string;
  overflow?: string;
  zIndex?: string;
}

/**
 * Extract background and fill styles
 */
export function extractBackground(shape: any): VisualStyles {
  const styles: VisualStyles = {};

  try {
    // Opacity
    if (typeof shape?.opacity === 'number' && shape.opacity !== 1) {
      styles.opacity = String(shape.opacity);
    }

    // Visibility
    if (shape?.visible === false) {
      styles.display = 'none';
    }

    // Background from fills array
    if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
      const fill = shape.fills[0];
      
      if (fill?.color) {
        styles.backgroundColor = fill.color;
      }
      
      // Handle gradients
      if (fill?.type === 'linear-gradient' && fill?.stops) {
        const gradientStops = fill.stops.map((stop: any) => 
          `${stop.color} ${roundValue(stop.offset * 100)}%`
        ).join(', ');
        const angle = fill.angle || 0;
        styles.backgroundImage = `linear-gradient(${angle}deg, ${gradientStops})`;
      } else if (fill?.type === 'radial-gradient' && fill?.stops) {
        const gradientStops = fill.stops.map((stop: any) => 
          `${stop.color} ${roundValue(stop.offset * 100)}%`
        ).join(', ');
        styles.backgroundImage = `radial-gradient(circle, ${gradientStops})`;
      }
    }

    // Fallback background color extraction
    if (!styles.backgroundColor) {
      const bgColor = extractBackgroundColor(shape);
      if (bgColor) {
        styles.backgroundColor = bgColor;
      }
    }

    // Blend mode
    if (shape?.blendMode && typeof shape.blendMode === 'string' && shape.blendMode !== 'normal') {
      styles.mixBlendMode = shape.blendMode;
    }

  } catch (error) {
    console.warn("Error extracting background styles:", error);
  }

  return styles;
}

/**
 * Extract border and stroke styles
 */
export function extractBorders(shape: any): VisualStyles {
  const styles: VisualStyles = {};

  try {
    // Borders from strokes
    if (shape?.strokes && Array.isArray(shape.strokes) && shape.strokes.length > 0) {
      const stroke = shape.strokes[0];
      const strokeColor = extractStrokeColor(stroke);
      
      // Get stroke width
      const strokeWidth = typeof stroke?.strokeWidth === 'number' ? stroke.strokeWidth : 
                         (typeof stroke?.width === 'number' ? stroke.width : null);
      
      if (strokeColor && strokeWidth !== null && strokeWidth > 0) {
        // Stroke style (solid, dashed, etc.)
        let borderStyle = 'solid';
        if (stroke?.strokeDashPattern && Array.isArray(stroke.strokeDashPattern) && stroke.strokeDashPattern.length > 0) {
          borderStyle = 'dashed';
        }
        
        styles.border = `${roundValue(strokeWidth)}px ${borderStyle} ${strokeColor}`;
        
        // Stroke align affects box-sizing
        if (stroke?.strokeAlign === 'inside') {
          styles.boxSizing = 'border-box';
        } else if (stroke?.strokeAlign === 'outside') {
          styles.boxSizing = 'content-box';
        }
      }
    }

  } catch (error) {
    console.warn("Error extracting border styles:", error);
  }

  return styles;
}

/**
 * Extract border-radius styles
 */
export function extractBorderRadius(shape: any): VisualStyles {
  const styles: VisualStyles = {};

  try {
    // Primary: borderRadius property
    if (typeof shape?.borderRadius === 'number' && shape.borderRadius > 0) {
      styles.borderRadius = `${roundValue(shape.borderRadius)}px`;
    }
    // Individual corner radii
    else if (typeof shape?.borderRadiusTopLeft === 'number' || 
             typeof shape?.borderRadiusTopRight === 'number' || 
             typeof shape?.borderRadiusBottomRight === 'number' || 
             typeof shape?.borderRadiusBottomLeft === 'number') {
      
      const tl = roundValue(shape.borderRadiusTopLeft || 0);
      const tr = roundValue(shape.borderRadiusTopRight || 0);
      const br = roundValue(shape.borderRadiusBottomRight || 0);
      const bl = roundValue(shape.borderRadiusBottomLeft || 0);
      
      // If all corners are the same, use shorthand
      if (tl === tr && tr === br && br === bl && tl > 0) {
        styles.borderRadius = `${tl}px`;
      } 
      // If corners are different, specify each one
      else if (tl > 0 || tr > 0 || br > 0 || bl > 0) {
        styles.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
      }
    }
    // Fallback to legacy properties
    else if (typeof shape?.radius === 'number' && shape.radius > 0) {
      styles.borderRadius = `${roundValue(shape.radius)}px`;
    } else if (shape?.radii && Array.isArray(shape.radii) && shape.radii.length === 4) {
      const [tl, tr, br, bl] = shape.radii.map((r: number) => roundValue(r));
      if (tl === tr && tr === br && br === bl) {
        if (tl > 0) styles.borderRadius = `${tl}px`;
      } else {
        styles.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
      }
    } else if (typeof shape?.rx === 'number' && shape.rx > 0) {
      styles.borderRadius = `${roundValue(shape.rx)}px`;
    } else if (typeof shape?.ry === 'number' && shape.ry > 0) {
      styles.borderRadius = `${roundValue(shape.ry)}px`;
    }

  } catch (error) {
    console.warn("Error extracting border-radius styles:", error);
  }

  return styles;
}

/**
 * Extract shadow and effect styles
 */
export function extractEffects(shape: any): VisualStyles {
  const styles: VisualStyles = {};

  try {
    // Effects from effects array
    if (shape?.effects && Array.isArray(shape.effects) && shape.effects.length > 0) {
      const dropShadows: string[] = [];
      let blurFilter = '';
      
      shape.effects.forEach((effect: any) => {
        if (effect?.type === 'drop-shadow') {
          const shadowColor = effect.color || 'rgba(0,0,0,0.25)';
          const offsetX = roundValue(effect.offset?.x || 0);
          const offsetY = roundValue(effect.offset?.y || 0);
          const blur = roundValue(effect.blur || 0);
          const spread = roundValue(effect.spread || 0);
          
          dropShadows.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`);
        } else if (effect?.type === 'layer-blur') {
          const blurRadius = roundValue(effect.radius || 0);
          if (blurRadius > 0) {
            blurFilter = `blur(${blurRadius}px)`;
          }
        }
      });
      
      if (dropShadows.length > 0) {
        styles.boxShadow = dropShadows.join(', ');
      }
      
      if (blurFilter) {
        styles.filter = blurFilter;
      }
    }

    // Legacy shadows support
    if (shape?.shadows && Array.isArray(shape.shadows) && shape.shadows.length > 0) {
      const shadows = shape.shadows
        .filter((shadow: any) => shadow && shadow.style !== 'inner-shadow')
        .map((shadow: any) => {
          const shadowColor = extractShadowColor(shadow);
          if (shadowColor && shadow?.offsetX !== undefined) {
            const offsetX = roundValue(shadow.offsetX || 0);
            const offsetY = roundValue(shadow.offsetY || 0);
            const blur = roundValue(shadow.blur || 0);
            const spread = roundValue(shadow.spread || 0);
            return `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`;
          }
          return null;
        })
        .filter(Boolean);
      
      if (shadows.length > 0 && !styles.boxShadow) {
        styles.boxShadow = shadows.join(', ');
      }
    }

  } catch (error) {
    console.warn("Error extracting effects styles:", error);
  }

  return styles;
}

/**
 * Extract miscellaneous visual properties
 */
export function extractMiscVisual(shape: any): VisualStyles {
  const styles: VisualStyles = {};

  try {
    // Hidden state
    if (shape?.hidden === true) {
      styles.visibility = 'hidden';
    }

    // Overflow (for frames)
    if (shape?.showContent === false) {
      styles.overflow = 'hidden';
    }

    // Z-index (from layer order)
    if (typeof shape?.zIndex === 'number') {
      styles.zIndex = String(shape.zIndex);
    }

  } catch (error) {
    console.warn("Error extracting miscellaneous visual styles:", error);
  }

  return styles;
}