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
  width?: string;
  height?: string;
  position?: string;
  zIndex?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  // Grid container properties
  gridTemplateRows?: string;
  gridTemplateColumns?: string;
  justifyItems?: string;
  // Grid cell properties
  gridRow?: string;
  gridColumn?: string;
  gridArea?: string;
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
    // 📏 SIZING PROPERTIES - Handle horizontalSizing and verticalSizing
    // These properties determine how the element behaves in flex containers
    const horizontalSizing = layoutChild.horizontalSizing;
    const verticalSizing = layoutChild.verticalSizing;

    if (horizontalSizing && typeof horizontalSizing === 'string') {
      switch (horizontalSizing) {
        case 'fill':
          styles.flexGrow = '1';
          break;
        case 'auto':
          styles.width = 'auto';
          break;
        case 'fit-content':
          styles.width = 'fit-content';
          break;
        case 'fix':
          // 'fix' means fixed size - keep the original width from positioning
          // Don't set any special width property, let the fixed width from positioning extractor be used
          break;
      }
    }

    if (verticalSizing && typeof verticalSizing === 'string') {
      switch (verticalSizing) {
        case 'fill':
          styles.alignSelf = 'stretch';
          break;
        case 'auto':
          styles.height = 'auto';
          break;
        case 'fit-content':
          styles.height = 'fit-content';
          break;
        case 'fix':
          // 'fix' means fixed size - keep the original height from positioning
          // Don't set any special height property, let the fixed height from positioning extractor be used
          break;
      }
    }

    // Flex properties (only set if not already handled by sizing properties)
    if (typeof layoutChild.flexGrow === 'number' && layoutChild.flexGrow !== 0 && !styles.flexGrow) {
      styles.flexGrow = String(layoutChild.flexGrow);
    }
    if (typeof layoutChild.flexShrink === 'number' && layoutChild.flexShrink !== 1) {
      styles.flexShrink = String(layoutChild.flexShrink);
    }
    if (typeof layoutChild.flexBasis === 'number') {
      styles.flexBasis = `${roundValue(layoutChild.flexBasis)}px`;
    }

    // Alignment (only set if not already handled by verticalSizing)
    if (layoutChild.alignSelf && typeof layoutChild.alignSelf === 'string' && !styles.alignSelf) {
      styles.alignSelf = layoutChild.alignSelf;
    }

    // 🎯 POSITIONING PROPERTIES
    // Absolute positioning
    if (layoutChild.absolute === true) {
      styles.position = 'absolute';
    }

    // Z-index (stack order)
    if (typeof layoutChild.zIndex === 'number' && layoutChild.zIndex !== 0) {
      styles.zIndex = String(layoutChild.zIndex);
    }

    // 📏 MARGIN PROPERTIES
    // Individual margins (priority over combined margins)
    if (typeof layoutChild.topMargin === 'number' && layoutChild.topMargin !== 0) {
      styles.marginTop = `${roundValue(layoutChild.topMargin)}px`;
    }
    if (typeof layoutChild.rightMargin === 'number' && layoutChild.rightMargin !== 0) {
      styles.marginRight = `${roundValue(layoutChild.rightMargin)}px`;
    }
    if (typeof layoutChild.bottomMargin === 'number' && layoutChild.bottomMargin !== 0) {
      styles.marginBottom = `${roundValue(layoutChild.bottomMargin)}px`;
    }
    if (typeof layoutChild.leftMargin === 'number' && layoutChild.leftMargin !== 0) {
      styles.marginLeft = `${roundValue(layoutChild.leftMargin)}px`;
    }

    // Combined margins (fallback if individual margins not set)
    if (typeof layoutChild.horizontalMargin === 'number' && layoutChild.horizontalMargin !== 0 && 
        !styles.marginLeft && !styles.marginRight) {
      styles.marginLeft = `${roundValue(layoutChild.horizontalMargin)}px`;
      styles.marginRight = `${roundValue(layoutChild.horizontalMargin)}px`;
    }
    if (typeof layoutChild.verticalMargin === 'number' && layoutChild.verticalMargin !== 0 && 
        !styles.marginTop && !styles.marginBottom) {
      styles.marginTop = `${roundValue(layoutChild.verticalMargin)}px`;
      styles.marginBottom = `${roundValue(layoutChild.verticalMargin)}px`;
    }

    // 📐 SIZE CONSTRAINTS
    // Maximum dimensions
    if (typeof layoutChild.maxWidth === 'number' && layoutChild.maxWidth > 0) {
      styles.maxWidth = `${roundValue(layoutChild.maxWidth)}px`;
    }
    if (typeof layoutChild.maxHeight === 'number' && layoutChild.maxHeight > 0) {
      styles.maxHeight = `${roundValue(layoutChild.maxHeight)}px`;
    }

    // Minimum dimensions
    if (typeof layoutChild.minWidth === 'number' && layoutChild.minWidth > 0) {
      styles.minWidth = `${roundValue(layoutChild.minWidth)}px`;
    }
    if (typeof layoutChild.minHeight === 'number' && layoutChild.minHeight > 0) {
      styles.minHeight = `${roundValue(layoutChild.minHeight)}px`;
    }

  } catch (error) {
    console.warn("Error extracting layout child styles:", error);
  }

  return styles;
}

/**
 * Extract grid layout properties from Penpot's grid object
 */
export function extractGridLayout(shape: any): LayoutStyles {
  const styles: LayoutStyles = {};

  if (!shape?.grid || typeof shape.grid !== 'object') {
    return styles;
  }

  const grid = shape.grid;

  try {
    // Set display to grid for elements with grid properties
    styles.display = 'grid';

    // 🎯 ALIGNMENT PROPERTIES
    // Align items (default alignment for grid items)
    if (grid.alignItems && typeof grid.alignItems === 'string') {
      styles.alignItems = grid.alignItems;
    }

    // Align content (alignment of grid within container)
    if (grid.alignContent && typeof grid.alignContent === 'string') {
      styles.alignContent = grid.alignContent;
    }

    // Justify items (default justification for grid items)
    if (grid.justifyItems && typeof grid.justifyItems === 'string') {
      styles.justifyItems = grid.justifyItems;
    }

    // Justify content (justification of grid within container)
    if (grid.justifyContent && typeof grid.justifyContent === 'string') {
      styles.justifyContent = grid.justifyContent;
    }

    // 📏 GAP PROPERTIES
    if (typeof grid.rowGap === 'number' && grid.rowGap > 0) {
      styles.rowGap = `${roundValue(grid.rowGap)}px`;
    }
    if (typeof grid.columnGap === 'number' && grid.columnGap > 0) {
      styles.columnGap = `${roundValue(grid.columnGap)}px`;
    }

    // 📦 PADDING FROM GRID OBJECT
    // Individual padding sides (priority)
    if (typeof grid.topPadding === 'number' && grid.topPadding > 0) {
      styles.paddingTop = `${roundValue(grid.topPadding)}px`;
    }
    if (typeof grid.rightPadding === 'number' && grid.rightPadding > 0) {
      styles.paddingRight = `${roundValue(grid.rightPadding)}px`;
    }
    if (typeof grid.bottomPadding === 'number' && grid.bottomPadding > 0) {
      styles.paddingBottom = `${roundValue(grid.bottomPadding)}px`;
    }
    if (typeof grid.leftPadding === 'number' && grid.leftPadding > 0) {
      styles.paddingLeft = `${roundValue(grid.leftPadding)}px`;
    }

    // Combined padding (fallback if individual padding not set)
    if (typeof grid.verticalPadding === 'number' && grid.verticalPadding > 0 && 
        !styles.paddingTop && !styles.paddingBottom) {
      styles.paddingTop = `${roundValue(grid.verticalPadding)}px`;
      styles.paddingBottom = `${roundValue(grid.verticalPadding)}px`;
    }
    if (typeof grid.horizontalPadding === 'number' && grid.horizontalPadding > 0 && 
        !styles.paddingLeft && !styles.paddingRight) {
      styles.paddingLeft = `${roundValue(grid.horizontalPadding)}px`;
      styles.paddingRight = `${roundValue(grid.horizontalPadding)}px`;
    }

    // 📐 GRID TEMPLATE PROPERTIES
    // Convert rows array to grid-template-rows
    if (grid.rows && Array.isArray(grid.rows) && grid.rows.length > 0) {
      const rowTracks = grid.rows.map((track: any) => convertTrackToCSS(track)).join(' ');
      if (rowTracks) {
        styles.gridTemplateRows = rowTracks;
      }
    }

    // Convert columns array to grid-template-columns
    if (grid.columns && Array.isArray(grid.columns) && grid.columns.length > 0) {
      const columnTracks = grid.columns.map((track: any) => convertTrackToCSS(track)).join(' ');
      if (columnTracks) {
        styles.gridTemplateColumns = columnTracks;
      }
    }

    // 📏 SIZING PROPERTIES (for grid container itself)
    // Handle horizontalSizing and verticalSizing for the grid container
    if (grid.horizontalSizing && typeof grid.horizontalSizing === 'string') {
      switch (grid.horizontalSizing) {
        case 'fill':
          styles.width = '100%';
          break;
        case 'auto':
          styles.width = 'auto';
          break;
        case 'fit-content':
          styles.width = 'fit-content';
          break;
      }
    }

    if (grid.verticalSizing && typeof grid.verticalSizing === 'string') {
      switch (grid.verticalSizing) {
        case 'fill':
          styles.height = '100%';
          break;
        case 'auto':
          styles.height = 'auto';
          break;
        case 'fit-content':
          styles.height = 'fit-content';
          break;
      }
    }

  } catch (error) {
    console.warn("Error extracting grid layout styles:", error);
  }

  return styles;
}

/**
 * Helper function to convert Penpot Track to CSS grid track value
 */
function convertTrackToCSS(track: any): string {
  if (!track || typeof track !== 'object') {
    return 'auto';
  }

  try {
    // Based on TrackType from Penpot API
    switch (track.type) {
      case 'flex':
        // Flexible track (fr unit)
        const flexValue = track.value || 1;
        return `${flexValue}fr`;
      
      case 'fixed':
        // Fixed size track
        const fixedValue = track.value || 100;
        return `${roundValue(fixedValue)}px`;
      
      case 'percent':
        // Percentage track
        const percentValue = track.value || 100;
        return `${roundValue(percentValue)}%`;
      
      case 'auto':
        // Auto-sized track
        return 'auto';
      
      case 'min-content':
        return 'min-content';
      
      case 'max-content':
        return 'max-content';
      
      default:
        return 'auto';
    }
  } catch (error) {
    console.warn("Error converting track to CSS:", error);
    return 'auto';
  }
}

/**
 * Extract grid cell properties (for elements inside grid layout)
 */
export function extractLayoutCell(shape: any): LayoutStyles {
  const styles: LayoutStyles = {};

  if (!shape?.layoutCell || typeof shape.layoutCell !== 'object') {
    return styles;
  }

  const layoutCell = shape.layoutCell;

  try {
    // 📐 GRID POSITIONING PROPERTIES
    // Handle different positioning modes
    if (layoutCell.position === 'manual') {
      // Manual positioning with specific row/column
      let gridRowValue = '';
      let gridColumnValue = '';

      // Row positioning
      if (typeof layoutCell.row === 'number') {
        const startRow = layoutCell.row + 1; // CSS Grid is 1-indexed
        const rowSpan = layoutCell.rowSpan || 1;
        if (rowSpan > 1) {
          gridRowValue = `${startRow} / span ${rowSpan}`;
        } else {
          gridRowValue = String(startRow);
        }
      }

      // Column positioning
      if (typeof layoutCell.column === 'number') {
        const startColumn = layoutCell.column + 1; // CSS Grid is 1-indexed
        const columnSpan = layoutCell.columnSpan || 1;
        if (columnSpan > 1) {
          gridColumnValue = `${startColumn} / span ${columnSpan}`;
        } else {
          gridColumnValue = String(startColumn);
        }
      }

      if (gridRowValue) styles.gridRow = gridRowValue;
      if (gridColumnValue) styles.gridColumn = gridColumnValue;

    } else if (layoutCell.position === 'area' && layoutCell.areaName) {
      // Named grid area positioning
      styles.gridArea = layoutCell.areaName;

    } else if (layoutCell.position === 'auto') {
      // Auto positioning - let CSS Grid handle it
      // Only set span if specified
      if (layoutCell.rowSpan && layoutCell.rowSpan > 1) {
        styles.gridRow = `span ${layoutCell.rowSpan}`;
      }
      if (layoutCell.columnSpan && layoutCell.columnSpan > 1) {
        styles.gridColumn = `span ${layoutCell.columnSpan}`;
      }
    }

  } catch (error) {
    console.warn("Error extracting layout cell styles:", error);
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