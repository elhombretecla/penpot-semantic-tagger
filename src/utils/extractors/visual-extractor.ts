/**
 * Visual effects extractor - Colors, borders, shadows, and visual effects
 * Handles fills, strokes, border-radius, shadows, opacity, and other visual properties
 */

import { roundValue } from './base-extractor';
import { extractBackgroundColor, extractStrokeColor, extractShadowColor } from '../color-utils';

export interface VisualStyles {
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundPosition?: string;
  backgroundRepeat?: string;
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
  transform?: string;
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
 * Extract image-specific properties and background images
 */
export function extractImageStyles(shape: any): VisualStyles {
  const styles: VisualStyles = {};

  try {
    // 🖼️ DIRECT IMAGE ELEMENTS
    if (shape?.type === 'image') {
      // For direct image elements, we need to get the image URL/data
      // This could be from fills, exports, or image data
      
      // Check if there's image data available
      if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
        const imageFill = shape.fills.find((fill: any) => fill?.type === 'image' || fill?.fillImage);
        if (imageFill) {
          // Extract image URL or data
          const imageUrl = extractImageUrl(imageFill, shape);
          if (imageUrl) {
            styles.backgroundImage = `url(${imageUrl})`;
            
            // Default image background properties for proper display
            styles.backgroundSize = 'cover';
            styles.backgroundPosition = 'center';
            styles.backgroundRepeat = 'no-repeat';
          }
        }
      }

      // Handle image transformations
      if (shape?.flipX === true || shape?.flipY === true) {
        const transforms: string[] = [];
        if (shape.flipX) transforms.push('scaleX(-1)');
        if (shape.flipY) transforms.push('scaleY(-1)');
        if (transforms.length > 0) {
          styles.transform = transforms.join(' ');
        }
      }
    }

    // 🎨 IMAGE FILLS IN OTHER ELEMENTS
    // Check for image fills in non-image elements (like rectangles with image fills)
    if (shape?.type !== 'image' && shape?.fills && Array.isArray(shape.fills)) {
      const imageFill = shape.fills.find((fill: any) => 
        fill?.type === 'image' || 
        fill?.fillImage || 
        (fill?.fillImage && fill.fillImage.id)
      );
      if (imageFill) {
        console.log('🖼️ Processing image fill for non-image element:', imageFill);
        const imageUrl = extractImageUrl(imageFill, shape);
        if (imageUrl) {
          console.log('🖼️ Generated image URL:', imageUrl);
          // For non-image elements with image fills, use as background
          styles.backgroundImage = `url(${imageUrl})`;
          styles.backgroundSize = 'cover';
          styles.backgroundPosition = 'center';
          styles.backgroundRepeat = 'no-repeat';
        }
      }
    }

  } catch (error) {
    console.warn("Error extracting image styles:", error);
  }

  return styles;
}

/**
 * Helper function to extract image URL from various sources
 * Based on Penpot's Image API and ImageData interface
 * Generates URLs in Penpot's standard format: http://localhost:3449/assets/by-file-media-id/{id}
 */
function extractImageUrl(imageFill: any, shape: any): string | null {
  try {
    // Method 1: Direct URL from fill (external images or already formatted Penpot URLs)
    if (imageFill?.url && typeof imageFill.url === 'string') {
      return imageFill.url;
    }

    // Method 2: Image data with ID (Penpot's ImageData interface)
    if (imageFill?.imageData) {
      const imageData = imageFill.imageData;
      
      // Check if we have a direct URL in imageData
      if (imageData.url && typeof imageData.url === 'string') {
        return imageData.url;
      }
      
      // Use the image ID to construct Penpot-style URL
      if (imageData.id) {
        return buildPenpotImageUrl(imageData.id);
      }
    }

    // Method 2.1: Check for fillImage property (alternative structure) - PRIORITY
    if (imageFill?.fillImage) {
      const fillImage = imageFill.fillImage;
      if (fillImage.id && typeof fillImage.id === 'string') {
        console.log('🖼️ Found image ID in fillImage:', fillImage.id);
        return buildPenpotImageUrl(fillImage.id);
      }
      if (fillImage.url && typeof fillImage.url === 'string') {
        console.log('🖼️ Found image URL in fillImage:', fillImage.url);
        return fillImage.url;
      }
    }

    // Method 3: Direct image data properties (from shape itself if it's an image)
    if (shape?.type === 'image') {
      // Check for image-specific properties
      if (shape.imageData?.id) {
        return buildPenpotImageUrl(shape.imageData.id);
      }
      
      // Check for direct image URL on the shape
      if (shape.imageUrl && typeof shape.imageUrl === 'string') {
        return shape.imageUrl;
      }
      
      // Check for image ID directly on the shape
      if (shape.imageId && typeof shape.imageId === 'string') {
        return buildPenpotImageUrl(shape.imageId);
      }
    }

    // Method 4: Image ID directly in fill
    if (imageFill?.imageId && typeof imageFill.imageId === 'string') {
      return buildPenpotImageUrl(imageFill.imageId);
    }

    // Method 5: Check for image ID directly in fill (alternative property names)
    if (imageFill?.id && typeof imageFill.id === 'string') {
      // Only use this if it looks like a Penpot image ID (UUID format)
      if (isValidPenpotImageId(imageFill.id)) {
        return buildPenpotImageUrl(imageFill.id);
      }
    }

    // Method 5.1: Check for common image ID property names in fill
    const imageIdProperties = ['imageId', 'image_id', 'mediaId', 'media_id', 'fileId', 'file_id'];
    for (const prop of imageIdProperties) {
      if (imageFill?.[prop] && typeof imageFill[prop] === 'string') {
        if (isValidPenpotImageId(imageFill[prop])) {
          return buildPenpotImageUrl(imageFill[prop]);
        }
      }
    }

    // Method 6: Base64 data (embedded images)
    if (imageFill?.data && typeof imageFill.data === 'string') {
      // Determine the media type for the data URL
      const mimeType = imageFill.mtype || imageFill.imageData?.mtype || 'image/png';
      return `data:${mimeType};base64,${imageFill.data}`;
    }

    // Method 7: Image hash or reference (convert to Penpot URL if possible)
    if (imageFill?.imageHash && typeof imageFill.imageHash === 'string') {
      if (isValidPenpotImageId(imageFill.imageHash)) {
        return buildPenpotImageUrl(imageFill.imageHash);
      } else {
        return `penpot-hash://${imageFill.imageHash}`;
      }
    }

    // Method 8: Export-based image generation (for complex cases)
    // This creates a reference that can be resolved later through the export API
    if (shape?.export && typeof shape.export === 'function') {
      return `penpot-export://${shape.id}`;
    }

    // Method 9: Plugin data might contain image references
    if (shape?.getPluginData && typeof shape.getPluginData === 'function') {
      try {
        // Check common plugin data keys for image URLs
        const imageKeys = ['imageUrl', 'image', 'backgroundImage', 'src', 'imageId'];
        for (const key of imageKeys) {
          const imageData = shape.getPluginData(key);
          if (imageData && typeof imageData === 'string') {
            // If it looks like a Penpot image ID, convert to proper URL
            if (isValidPenpotImageId(imageData)) {
              return buildPenpotImageUrl(imageData);
            } else {
              return imageData;
            }
          }
        }
      } catch (e) {
        // Plugin data access might fail, continue with other methods
      }
    }

    return null;
  } catch (error) {
    console.warn("Error extracting image URL:", error);
    return null;
  }
}

/**
 * Build a Penpot-style image URL from an image ID
 * Format: http://localhost:3449/assets/by-file-media-id/{id}
 */
function buildPenpotImageUrl(imageId: string): string {
  // Get the base URL from the current environment
  // In a real plugin, you might want to detect this dynamically
  const baseUrl = getPenpotBaseUrl();
  return `${baseUrl}/assets/by-file-media-id/${imageId}`;
}

/**
 * Get the base URL for Penpot assets
 * This tries to detect the current Penpot instance URL
 */
function getPenpotBaseUrl(): string {
  try {
    // Try to get the base URL from the current window location
    if (typeof window !== 'undefined' && window.location) {
      const { protocol, hostname, port } = window.location;
      const portPart = port ? `:${port}` : '';
      return `${protocol}//${hostname}${portPart}`;
    }
    
    // Fallback to common Penpot development URL
    return 'http://localhost:3449';
  } catch (error) {
    // If we can't detect the URL, use the default development URL
    return 'http://localhost:3449';
  }
}

/**
 * Check if a string looks like a valid Penpot image ID (UUID format)
 */
function isValidPenpotImageId(id: string): boolean {
  // Penpot typically uses UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
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

    // Transformations (rotation, flip)
    const transforms: string[] = [];
    
    // Rotation (for all elements)
    if (typeof shape?.rotation === 'number' && shape.rotation !== 0) {
      transforms.push(`rotate(${shape.rotation}deg)`);
    }

    // Flip transformations (for non-image elements only, as image elements handle this separately)
    if (shape?.type !== 'image') {
      if (shape?.flipX === true) {
        transforms.push('scaleX(-1)');
      }
      if (shape?.flipY === true) {
        transforms.push('scaleY(-1)');
      }
    }

    if (transforms.length > 0) {
      styles.transform = transforms.join(' ');
    }

  } catch (error) {
    console.warn("Error extracting miscellaneous visual styles:", error);
  }

  return styles;
}