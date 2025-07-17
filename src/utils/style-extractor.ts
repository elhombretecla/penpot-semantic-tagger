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

    // Border radius (rounded to integers) - check multiple possible properties
    let borderRadius = 0;
    if (typeof element?.rx === 'number') {
      borderRadius = element.rx;
    } else if (typeof element?.ry === 'number') {
      borderRadius = element.ry;
    } else if (typeof element?.borderRadius === 'number') {
      borderRadius = element.borderRadius;
    } else if (typeof element?.cornerRadius === 'number') {
      borderRadius = element.cornerRadius;
    } else if (typeof element?.radius === 'number') {
      borderRadius = element.radius;
    }

    if (borderRadius > 0) {
      styles.borderRadius = `${Math.round(borderRadius)}px`;
    }

    // Padding properties - check various possible sources
    // Layout padding (for frames/groups with layout)
    if (typeof element?.layoutPaddingTop === 'number' ||
      typeof element?.layoutPaddingRight === 'number' ||
      typeof element?.layoutPaddingBottom === 'number' ||
      typeof element?.layoutPaddingLeft === 'number') {

      const paddingTop = Math.round(element.layoutPaddingTop || 0);
      const paddingRight = Math.round(element.layoutPaddingRight || 0);
      const paddingBottom = Math.round(element.layoutPaddingBottom || 0);
      const paddingLeft = Math.round(element.layoutPaddingLeft || 0);

      // Use shorthand if all sides are equal, otherwise specify individual sides
      if (paddingTop === paddingRight && paddingRight === paddingBottom && paddingBottom === paddingLeft) {
        if (paddingTop > 0) {
          styles.padding = `${paddingTop}px`;
        }
      } else {
        if (paddingTop > 0) styles.paddingTop = `${paddingTop}px`;
        if (paddingRight > 0) styles.paddingRight = `${paddingRight}px`;
        if (paddingBottom > 0) styles.paddingBottom = `${paddingBottom}px`;
        if (paddingLeft > 0) styles.paddingLeft = `${paddingLeft}px`;
      }
    }
    // Alternative padding properties
    else if (typeof element?.padding === 'number' && element.padding > 0) {
      styles.padding = `${Math.round(element.padding)}px`;
    }
    else if (typeof element?.paddingX === 'number' || typeof element?.paddingY === 'number') {
      const paddingX = Math.round(element.paddingX || 0);
      const paddingY = Math.round(element.paddingY || 0);
      if (paddingX > 0 || paddingY > 0) {
        styles.padding = `${paddingY}px ${paddingX}px`;
      }
    }
    else if (typeof element?.horizontalPadding === 'number' || typeof element?.verticalPadding === 'number') {
      const hPadding = Math.round(element.horizontalPadding || 0);
      const vPadding = Math.round(element.verticalPadding || 0);
      if (hPadding > 0 || vPadding > 0) {
        styles.padding = `${vPadding}px ${hPadding}px`;
      }
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
 * Based on complete Penpot Plugin API documentation with ALL style parameters
 * @param shape Penpot shape object
 * @param _isInFlexContainer Whether this element is inside a flex/grid container (unused but kept for API compatibility)
 * @returns Styles object with CSS-ready string values
 */
export function extractComprehensiveStyles(shape: any, _isInFlexContainer: boolean = false): Record<string, string> {
  const styles: Record<string, string> = {};

  // 🐛 DEBUG: Log properties for song-card elements
  if (shape?.name && shape.name.includes('song-card')) {
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

  // 🐛 DEBUG: Log properties for text elements
  if (shape?.type === 'text') {
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

  try {
    // 📐 POSITIONING AND DIMENSIONS
    // Essential dimensions - always include these (rounded to integers)
    if (typeof shape?.width === 'number') {
      styles.width = `${Math.round(shape.width)}px`;
    }
    if (typeof shape?.height === 'number') {
      styles.height = `${Math.round(shape.height)}px`;
    }

    // Position coordinates (x, y) - only if not in flex/grid container
    if (!shape._isInFlexContainer) {
      styles.position = "absolute"; // Default positioning for Penpot elements
      if (typeof shape?.x === 'number') {
        styles.left = `${Math.round(shape.x)}px`;
      }
      if (typeof shape?.y === 'number') {
        styles.top = `${Math.round(shape.y)}px`;
      }
    }

    // Rotation - transform: rotate()
    if (typeof shape?.rotation === 'number' && shape.rotation !== 0) {
      styles.transform = `rotate(${shape.rotation}deg)`;
    }

    // 🎨 FILL AND APPEARANCE
    // Opacity (0 to 1)
    if (typeof shape?.opacity === 'number' && shape.opacity !== 1) {
      styles.opacity = String(shape.opacity);
    }

    // Visibility (visible boolean)
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
          `${stop.color} ${Math.round(stop.offset * 100)}%`
        ).join(', ');
        const angle = fill.angle || 0;
        styles.backgroundImage = `linear-gradient(${angle}deg, ${gradientStops})`;
      } else if (fill?.type === 'radial-gradient' && fill?.stops) {
        const gradientStops = fill.stops.map((stop: any) =>
          `${stop.color} ${Math.round(stop.offset * 100)}%`
        ).join(', ');
        styles.backgroundImage = `radial-gradient(circle, ${gradientStops})`;
      }
    }

    // Blend mode
    if (shape?.blendMode && typeof shape.blendMode === 'string' && shape.blendMode !== 'normal') {
      styles.mixBlendMode = shape.blendMode;
    }

    // ✒️ BORDERS (STROKES)
    if (shape?.strokes && Array.isArray(shape.strokes) && shape.strokes.length > 0) {
      const stroke = shape.strokes[0];

      // Stroke color
      const strokeColor = extractStrokeColor(stroke);

      // Stroke width
      const strokeWidth = typeof stroke?.strokeWidth === 'number' ? stroke.strokeWidth :
        (typeof stroke?.width === 'number' ? stroke.width : null);

      if (strokeColor && strokeWidth !== null && strokeWidth > 0) {
        // Stroke style (solid, dashed, etc.)
        let borderStyle = 'solid';
        if (stroke?.strokeDashPattern && Array.isArray(stroke.strokeDashPattern) && stroke.strokeDashPattern.length > 0) {
          borderStyle = 'dashed';
        }

        styles.border = `${Math.round(strokeWidth)}px ${borderStyle} ${strokeColor}`;

        // Stroke align affects box-sizing
        if (stroke?.strokeAlign === 'inside') {
          styles.boxSizing = 'border-box';
        } else if (stroke?.strokeAlign === 'outside') {
          styles.boxSizing = 'content-box';
        }
      }
    }

    // 🔘 CORNER RADIUS
    // Based on debug output: borderRadius property contains the value
    if (typeof shape?.borderRadius === 'number' && shape.borderRadius > 0) {
      styles.borderRadius = `${Math.round(shape.borderRadius)}px`;
    }
    // Check for individual corner radii (all four corners)
    else if (typeof shape?.borderRadiusTopLeft === 'number' ||
      typeof shape?.borderRadiusTopRight === 'number' ||
      typeof shape?.borderRadiusBottomRight === 'number' ||
      typeof shape?.borderRadiusBottomLeft === 'number') {

      const tl = Math.round(shape.borderRadiusTopLeft || 0);
      const tr = Math.round(shape.borderRadiusTopRight || 0);
      const br = Math.round(shape.borderRadiusBottomRight || 0);
      const bl = Math.round(shape.borderRadiusBottomLeft || 0);

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
      styles.borderRadius = `${Math.round(shape.radius)}px`;
    } else if (shape?.radii && Array.isArray(shape.radii) && shape.radii.length === 4) {
      const [tl, tr, br, bl] = shape.radii.map((r: number) => Math.round(r));
      if (tl === tr && tr === br && br === bl) {
        if (tl > 0) styles.borderRadius = `${tl}px`;
      } else {
        styles.borderRadius = `${tl}px ${tr}px ${br}px ${bl}px`;
      }
    } else if (typeof shape?.rx === 'number' && shape.rx > 0) {
      styles.borderRadius = `${Math.round(shape.rx)}px`;
    } else if (typeof shape?.ry === 'number' && shape.ry > 0) {
      styles.borderRadius = `${Math.round(shape.ry)}px`;
    }

    // ✨ EFFECTS
    if (shape?.effects && Array.isArray(shape.effects) && shape.effects.length > 0) {
      const dropShadows: string[] = [];
      let blurFilter = '';

      shape.effects.forEach((effect: any) => {
        if (effect?.type === 'drop-shadow') {
          const shadowColor = effect.color || 'rgba(0,0,0,0.25)';
          const offsetX = Math.round(effect.offset?.x || 0);
          const offsetY = Math.round(effect.offset?.y || 0);
          const blur = Math.round(effect.blur || 0);
          const spread = Math.round(effect.spread || 0);

          dropShadows.push(`${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`);
        } else if (effect?.type === 'layer-blur') {
          const blurRadius = Math.round(effect.radius || 0);
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

    // 📝 TYPOGRAPHY (for text elements) - Complete Penpot Text API implementation
    if (shape?.type === 'text') {
      // 🔤 FONT PROPERTIES
      // Font family - direct property from Penpot Text API
      if (shape?.fontFamily && typeof shape.fontFamily === 'string' && shape.fontFamily !== 'mixed') {
        styles.fontFamily = shape.fontFamily;
      }

      // Font size - can be string or number in Penpot
      if (shape?.fontSize) {
        if (typeof shape.fontSize === 'string' && shape.fontSize !== 'mixed') {
          // Parse string font size (e.g., "16px" -> "16px")
          const parsedSize = parseFloat(shape.fontSize);
          if (!isNaN(parsedSize)) {
            styles.fontSize = `${Math.round(parsedSize)}px`;
          }
        } else if (typeof shape.fontSize === 'number') {
          styles.fontSize = `${Math.round(shape.fontSize)}px`;
        }
      }

      // Font weight - can be string or number
      if (shape?.fontWeight && shape.fontWeight !== 'mixed') {
        styles.fontWeight = String(shape.fontWeight);
      }

      // Font style - normal, italic, or mixed
      if (shape?.fontStyle && typeof shape.fontStyle === 'string' && shape.fontStyle !== 'mixed') {
        styles.fontStyle = shape.fontStyle;
      }

      // 📏 TEXT SPACING AND LAYOUT
      // Line height - can be string or number
      if (shape?.lineHeight && shape.lineHeight !== 'mixed') {
        if (typeof shape.lineHeight === 'string') {
          styles.lineHeight = shape.lineHeight;
        } else if (typeof shape.lineHeight === 'number') {
          styles.lineHeight = String(shape.lineHeight);
        }
      }

      // Letter spacing - can be string or number
      if (shape?.letterSpacing && shape.letterSpacing !== 'mixed') {
        if (typeof shape.letterSpacing === 'string') {
          const parsedSpacing = parseFloat(shape.letterSpacing);
          if (!isNaN(parsedSpacing)) {
            styles.letterSpacing = `${parsedSpacing}px`;
          }
        } else if (typeof shape.letterSpacing === 'number') {
          styles.letterSpacing = `${shape.letterSpacing}px`;
        }
      }

      // 🎯 TEXT ALIGNMENT
      // Horizontal alignment - using Penpot's 'align' property
      if (shape?.align && typeof shape.align === 'string' && shape.align !== 'mixed') {
        const alignMap: Record<string, string> = {
          'left': 'left',
          'center': 'center',
          'right': 'right',
          'justify': 'justify'
        };
        styles.textAlign = alignMap[shape.align] || shape.align;
      }

      // Vertical alignment - using Penpot's 'verticalAlign' property
      if (shape?.verticalAlign && typeof shape.verticalAlign === 'string') {
        // For text elements, vertical alignment can be handled with flexbox
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
      // Text decoration - underline, line-through, etc.
      if (shape?.textDecoration && typeof shape.textDecoration === 'string' && shape.textDecoration !== 'mixed') {
        const decorationMap: Record<string, string> = {
          'underline': 'underline',
          'line-through': 'line-through',
          'none': 'none'
        };
        styles.textDecoration = decorationMap[shape.textDecoration] || shape.textDecoration;
      }

      // Text transform - uppercase, lowercase, capitalize
      if (shape?.textTransform && typeof shape.textTransform === 'string' && shape.textTransform !== 'mixed') {
        const transformMap: Record<string, string> = {
          'uppercase': 'uppercase',
          'lowercase': 'lowercase',
          'capitalize': 'capitalize',
          'none': 'none'
        };
        styles.textTransform = transformMap[shape.textTransform] || shape.textTransform;
      }

      // Text direction - ltr, rtl
      if (shape?.direction && typeof shape.direction === 'string' && shape.direction !== 'mixed') {
        styles.direction = shape.direction;
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
            // Fixed size - use the specified dimensions
            styles.overflow = 'hidden';
            break;
        }
      }

      // 🎨 TEXT COLOR
      // Text color from fills - for text elements, fills represent text color
      if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0 && shape.fills !== 'mixed') {
        const fill = shape.fills[0];
        if (fill?.color) {
          styles.color = fill.color;
        }

        // Handle text gradients
        if (fill?.type === 'linear-gradient' && fill?.stops) {
          const gradientStops = fill.stops.map((stop: any) =>
            `${stop.color} ${Math.round(stop.offset * 100)}%`
          ).join(', ');
          const angle = fill.angle || 0;
          styles.background = `linear-gradient(${angle}deg, ${gradientStops})`;
          styles.webkitBackgroundClip = 'text';
          styles.webkitTextFillColor = 'transparent';
          styles.backgroundClip = 'text';
        }
      }

      // 🔤 SPECIAL TEXT PROPERTIES
      // Font variant ID and font ID are Penpot-specific but could be useful for debugging
      // These don't have direct CSS equivalents but could be stored as custom properties
      if (shape?.fontVariantId && typeof shape.fontVariantId === 'string' && shape.fontVariantId !== 'mixed') {
        // Could be used for CSS custom properties or data attributes
        // styles['--font-variant-id'] = shape.fontVariantId;
      }

      // 📱 RESPONSIVE TEXT BEHAVIOR
      // For text elements in flex containers, remove absolute positioning
      if (shape._isInFlexContainer || shape.layoutChild) {
        // Text in flex containers should not have absolute positioning
        delete styles.position;
        delete styles.left;
        delete styles.top;

        // Add flex child properties if available
        if (shape.layoutChild) {
          if (typeof shape.layoutChild.alignSelf === 'string') {
            styles.alignSelf = shape.layoutChild.alignSelf;
          }
        }
      }
    }

    // Layout properties for frames with auto-layout
    if (shape?.layoutChild && typeof shape.layoutChild === 'object') {
      const layoutChild = shape.layoutChild;

      // Flex properties
      if (typeof layoutChild.flexGrow === 'number' && layoutChild.flexGrow !== 0) {
        styles.flexGrow = String(layoutChild.flexGrow);
      }
      if (typeof layoutChild.flexShrink === 'number' && layoutChild.flexShrink !== 1) {
        styles.flexShrink = String(layoutChild.flexShrink);
      }
      if (typeof layoutChild.flexBasis === 'number') {
        styles.flexBasis = `${Math.round(layoutChild.flexBasis)}px`;
      }

      // Alignment
      if (layoutChild.alignSelf && typeof layoutChild.alignSelf === 'string') {
        styles.alignSelf = layoutChild.alignSelf;
      }

      // Margins (spacing around child in layout)
      if (typeof layoutChild.marginTop === 'number' && layoutChild.marginTop > 0) {
        styles.marginTop = `${Math.round(layoutChild.marginTop)}px`;
      }
      if (typeof layoutChild.marginRight === 'number' && layoutChild.marginRight > 0) {
        styles.marginRight = `${Math.round(layoutChild.marginRight)}px`;
      }
      if (typeof layoutChild.marginBottom === 'number' && layoutChild.marginBottom > 0) {
        styles.marginBottom = `${Math.round(layoutChild.marginBottom)}px`;
      }
      if (typeof layoutChild.marginLeft === 'number' && layoutChild.marginLeft > 0) {
        styles.marginLeft = `${Math.round(layoutChild.marginLeft)}px`;
      }
    }

    // 🔧 FLEX LAYOUT PROPERTIES (Penpot's auto-layout system)
    // Based on debug output: flex object contains layout and padding properties
    if (shape?.flex && typeof shape.flex === 'object') {
      const flex = shape.flex;

      // Set display to flex for elements with flex properties
      styles.display = 'flex';

      // Flex direction mapping
      if (flex.dir && typeof flex.dir === 'string') {
        const directionMap: Record<string, string> = {
          'row': 'row',
          'column': 'column',
          'row-reverse': 'row-reverse',
          'column-reverse': 'column-reverse'
        };
        styles.flexDirection = directionMap[flex.dir] || flex.dir;
      }

      // Flex wrap
      if (flex.wrap && typeof flex.wrap === 'string') {
        styles.flexWrap = flex.wrap;
      }

      // Justify content
      if (flex.justifyContent && typeof flex.justifyContent === 'string') {
        styles.justifyContent = flex.justifyContent;
      }

      // Align items
      if (flex.alignItems && typeof flex.alignItems === 'string') {
        styles.alignItems = flex.alignItems;
      }

      // Align content
      if (flex.alignContent && typeof flex.alignContent === 'string') {
        styles.alignContent = flex.alignContent;
      }

      // Gap properties
      if (typeof flex.rowGap === 'number' && flex.rowGap > 0) {
        styles.rowGap = `${Math.round(flex.rowGap)}px`;
      }
      if (typeof flex.columnGap === 'number' && flex.columnGap > 0) {
        styles.columnGap = `${Math.round(flex.columnGap)}px`;
      }

      // 📦 PADDING FROM FLEX OBJECT (This is where the padding is!)
      // Individual padding sides
      if (typeof flex.topPadding === 'number' && flex.topPadding > 0) {
        styles.paddingTop = `${Math.round(flex.topPadding)}px`;
      }
      if (typeof flex.rightPadding === 'number' && flex.rightPadding > 0) {
        styles.paddingRight = `${Math.round(flex.rightPadding)}px`;
      }
      if (typeof flex.bottomPadding === 'number' && flex.bottomPadding > 0) {
        styles.paddingBottom = `${Math.round(flex.bottomPadding)}px`;
      }
      if (typeof flex.leftPadding === 'number' && flex.leftPadding > 0) {
        styles.paddingLeft = `${Math.round(flex.leftPadding)}px`;
      }

      // Alternative: vertical and horizontal padding
      if (typeof flex.verticalPadding === 'number' && flex.verticalPadding > 0 &&
        !styles.paddingTop && !styles.paddingBottom) {
        styles.paddingTop = `${Math.round(flex.verticalPadding)}px`;
        styles.paddingBottom = `${Math.round(flex.verticalPadding)}px`;
      }
      if (typeof flex.horizontalPadding === 'number' && flex.horizontalPadding > 0 &&
        !styles.paddingLeft && !styles.paddingRight) {
        styles.paddingLeft = `${Math.round(flex.horizontalPadding)}px`;
        styles.paddingRight = `${Math.round(flex.horizontalPadding)}px`;
      }
    }

    // Layout properties for frames that are containers (fallback)
    if (shape?.layout && typeof shape.layout === 'object') {
      const layout = shape.layout;

      // Display type (only if not already set by flex)
      if (layout.display && typeof layout.display === 'string' && !styles.display) {
        styles.display = layout.display;
      }

      // Flex direction (only if not already set by flex)
      if (layout.flexDirection && typeof layout.flexDirection === 'string' && !styles.flexDirection) {
        styles.flexDirection = layout.flexDirection;
      }

      // Flex wrap
      if (layout.flexWrap && typeof layout.flexWrap === 'string' && !styles.flexWrap) {
        styles.flexWrap = layout.flexWrap;
      }

      // Justify content
      if (layout.justifyContent && typeof layout.justifyContent === 'string' && !styles.justifyContent) {
        styles.justifyContent = layout.justifyContent;
      }

      // Align items
      if (layout.alignItems && typeof layout.alignItems === 'string' && !styles.alignItems) {
        styles.alignItems = layout.alignItems;
      }

      // Align content
      if (layout.alignContent && typeof layout.alignContent === 'string' && !styles.alignContent) {
        styles.alignContent = layout.alignContent;
      }

      // Gap
      if (typeof layout.rowGap === 'number' && layout.rowGap > 0 && !styles.rowGap) {
        styles.rowGap = `${Math.round(layout.rowGap)}px`;
      }
      if (typeof layout.columnGap === 'number' && layout.columnGap > 0 && !styles.columnGap) {
        styles.columnGap = `${Math.round(layout.columnGap)}px`;
      }
      if (typeof layout.gap === 'number' && layout.gap > 0) {
        styles.gap = `${Math.round(layout.gap)}px`;
      }

      // Padding (fallback if not set by flex)
      if (typeof layout.paddingTop === 'number' && layout.paddingTop > 0 && !styles.paddingTop) {
        styles.paddingTop = `${Math.round(layout.paddingTop)}px`;
      }
      if (typeof layout.paddingRight === 'number' && layout.paddingRight > 0 && !styles.paddingRight) {
        styles.paddingRight = `${Math.round(layout.paddingRight)}px`;
      }
      if (typeof layout.paddingBottom === 'number' && layout.paddingBottom > 0 && !styles.paddingBottom) {
        styles.paddingBottom = `${Math.round(layout.paddingBottom)}px`;
      }
      if (typeof layout.paddingLeft === 'number' && layout.paddingLeft > 0 && !styles.paddingLeft) {
        styles.paddingLeft = `${Math.round(layout.paddingLeft)}px`;
      }
    }

    // Visibility and overflow
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
    console.warn("Error extracting comprehensive styles:", error);
  }

  return styles;
}