/**
 * Layout extractor - Flexbox, auto-layout, and spacing
 * Handles Penpot's flex system, padding, margins, and layout child properties
 */

import { roundValue } from './base-extractor';

export interface LayoutStyles {
  display?: string;
  flexDirection?: string;
  flexWrap?: string;
  justifyContent?: string;
  alignItems?: string;
  alignContent?: string;
  alignSelf?: string;
  flexGrow?: string;
  flexShrink?: string;
  flexBasis?: string;
  gap?: string;
  rowGap?: string;
  columnGap?: string;
  paddingTop?: string;
  paddingRight?: string;
  paddingBottom?: string;
  paddingLeft?: string;
  marginTop?: string;
  marginRight?: string;
  marginBottom?: string;
  marginLeft?: string;
}

/**
 * Extract flex layout properties from Penpot's flex object
 */
export function extractFlexLayout(shape: any): LayoutStyles {
  const styles: LayoutStyles = {};

  if (!shape?.flex || typeof shape.flex !== 'object') {
    return styles;
  }

  const flex = shape.flex;

  try {
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
      styles.rowGap = `${roundValue(flex.rowGap)}px`;
    }
    if (typeof flex.columnGap === 'number' && flex.columnGap > 0) {
      styles.columnGap = `${roundValue(flex.columnGap)}px`;
    }

    // 📦 PADDING FROM FLEX OBJECT
    // Individual padding sides (priority)
    if (typeof flex.topPadding === 'number' && flex.topPadding > 0) {
      styles.paddingTop = `${roundValue(flex.topPadding)}px`;
    }
    if (typeof flex.rightPadding === 'number' && flex.rightPadding > 0) {
      styles.paddingRight = `${roundValue(flex.rightPadding)}px`;
    }
    if (typeof flex.bottomPadding === 'number' && flex.bottomPadding > 0) {
      styles.paddingBottom = `${roundValue(flex.bottomPadding)}px`;
    }
    if (typeof flex.leftPadding === 'number' && flex.leftPadding > 0) {
      styles.paddingLeft = `${roundValue(flex.leftPadding)}px`;
    }

    // Alternative: vertical and horizontal padding (fallback)
    if (typeof flex.verticalPadding === 'number' && flex.verticalPadding > 0 && 
        !styles.paddingTop && !styles.paddingBottom) {
      styles.paddingTop = `${roundValue(flex.verticalPadding)}px`;
      styles.paddingBottom = `${roundValue(flex.verticalPadding)}px`;
    }
    if (typeof flex.horizontalPadding === 'number' && flex.horizontalPadding > 0 && 
        !styles.paddingLeft && !styles.paddingRight) {
      styles.paddingLeft = `${roundValue(flex.horizontalPadding)}px`;
      styles.paddingRight = `${roundValue(flex.horizontalPadding)}px`;
    }

  } catch (error) {
    console.warn("Error extracting flex layout styles:", error);
  }

  return styles;
}

/**
 * Extract layout child properties (for elements inside auto-layout)
 */
export function extractLayoutChild(shape: any): LayoutStyles {
  const styles: LayoutStyles = {};

  if (!shape?.layoutChild || typeof shape.layoutChild !== 'object') {
    return styles;
  }

  const layoutChild = shape.layoutChild;

  try {
    // Flex properties
    if (typeof layoutChild.flexGrow === 'number' && layoutChild.flexGrow !== 0) {
      styles.flexGrow = String(layoutChild.flexGrow);
    }
    if (typeof layoutChild.flexShrink === 'number' && layoutChild.flexShrink !== 1) {
      styles.flexShrink = String(layoutChild.flexShrink);
    }
    if (typeof layoutChild.flexBasis === 'number') {
      styles.flexBasis = `${roundValue(layoutChild.flexBasis)}px`;
    }

    // Alignment
    if (layoutChild.alignSelf && typeof layoutChild.alignSelf === 'string') {
      styles.alignSelf = layoutChild.alignSelf;
    }

    // Margins (spacing around child in layout)
    if (typeof layoutChild.marginTop === 'number' && layoutChild.marginTop > 0) {
      styles.marginTop = `${roundValue(layoutChild.marginTop)}px`;
    }
    if (typeof layoutChild.marginRight === 'number' && layoutChild.marginRight > 0) {
      styles.marginRight = `${roundValue(layoutChild.marginRight)}px`;
    }
    if (typeof layoutChild.marginBottom === 'number' && layoutChild.marginBottom > 0) {
      styles.marginBottom = `${roundValue(layoutChild.marginBottom)}px`;
    }
    if (typeof layoutChild.marginLeft === 'number' && layoutChild.marginLeft > 0) {
      styles.marginLeft = `${roundValue(layoutChild.marginLeft)}px`;
    }

  } catch (error) {
    console.warn("Error extracting layout child styles:", error);
  }

  return styles;
}

/**
 * Extract legacy layout properties (fallback)
 */
export function extractLegacyLayout(shape: any): LayoutStyles {
  const styles: LayoutStyles = {};

  if (!shape?.layout || typeof shape.layout !== 'object') {
    return styles;
  }

  const layout = shape.layout;

  try {
    // Display type (only if not already set)
    if (layout.display && typeof layout.display === 'string') {
      styles.display = layout.display;
    }

    // Flex properties
    if (layout.flexDirection && typeof layout.flexDirection === 'string') {
      styles.flexDirection = layout.flexDirection;
    }
    if (layout.flexWrap && typeof layout.flexWrap === 'string') {
      styles.flexWrap = layout.flexWrap;
    }
    if (layout.justifyContent && typeof layout.justifyContent === 'string') {
      styles.justifyContent = layout.justifyContent;
    }
    if (layout.alignItems && typeof layout.alignItems === 'string') {
      styles.alignItems = layout.alignItems;
    }
    if (layout.alignContent && typeof layout.alignContent === 'string') {
      styles.alignContent = layout.alignContent;
    }

    // Gap
    if (typeof layout.rowGap === 'number' && layout.rowGap > 0) {
      styles.rowGap = `${roundValue(layout.rowGap)}px`;
    }
    if (typeof layout.columnGap === 'number' && layout.columnGap > 0) {
      styles.columnGap = `${roundValue(layout.columnGap)}px`;
    }
    if (typeof layout.gap === 'number' && layout.gap > 0) {
      styles.gap = `${roundValue(layout.gap)}px`;
    }

    // Padding (fallback)
    if (typeof layout.paddingTop === 'number' && layout.paddingTop > 0) {
      styles.paddingTop = `${roundValue(layout.paddingTop)}px`;
    }
    if (typeof layout.paddingRight === 'number' && layout.paddingRight > 0) {
      styles.paddingRight = `${roundValue(layout.paddingRight)}px`;
    }
    if (typeof layout.paddingBottom === 'number' && layout.paddingBottom > 0) {
      styles.paddingBottom = `${roundValue(layout.paddingBottom)}px`;
    }
    if (typeof layout.paddingLeft === 'number' && layout.paddingLeft > 0) {
      styles.paddingLeft = `${roundValue(layout.paddingLeft)}px`;
    }

  } catch (error) {
    console.warn("Error extracting legacy layout styles:", error);
  }

  return styles;
}