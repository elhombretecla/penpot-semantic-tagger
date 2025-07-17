// Interfaces for the tagging system
interface TagData {
  tag: string;
  properties: Record<string, string>;
  elementId: string;
  elementName: string;
  elementType?: string;
  content?: string;
  imageUrl?: string;
  styles?: StylesData;
  layout?: LayoutData;
  children?: TagData[];
}

interface StylesData {
  backgroundColor?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  lineHeight?: string;
  border?: string;
  borderRadius?: string;
  boxShadow?: string;
  opacity?: string;
  width?: string;
  height?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  margin?: string;
  padding?: string;
}

interface LayoutData {
  display?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
  gridTemplateColumns?: string;
  gridTemplateRows?: string;
}

interface PluginMessage {
  type: string;
  data?: any;
}

// Constants for metadata storage
const PLUGIN_DATA_KEY = "semantic-tags";
const PLUGIN_NAMESPACE = "semantic-tagging-plugin";

// Open the plugin interface
penpot.ui.open("Semantic Tagging", `?theme=${penpot.theme}`, {
  width: 320,
  height: 600
});

// Plugin state
let taggedElements: Map<string, TagData> = new Map();

// Plugin initialization
function initPlugin() {
  loadExistingTags();
  sendSelectionUpdate();
}

// Load existing tags (simplified version)
function loadExistingTags() {
  try {
    // For now, just initialize empty - persistence will be handled differently
    taggedElements.clear();

    // Send loaded data to UI
    penpot.ui.sendMessage({
      source: "penpot",
      type: "tags-loaded",
      data: Array.from(taggedElements.values())
    });
  } catch (error) {
    console.warn("Error loading existing tags:", error);
  }
}

// Save tags (simplified version)
function saveTagsToFile() {
  try {
    // For now, just keep in memory during session
    console.log("Tags saved in memory:", taggedElements.size);
  } catch (error) {
    console.error("Error saving tags:", error);
  }
}

// Send selection update to UI
function sendSelectionUpdate() {
  const selection = penpot.selection;
  const selectionData = selection.map(element => ({
    id: element.id,
    name: element.name || "Unnamed",
    type: element.type
  }));

  penpot.ui.sendMessage({
    source: "penpot",
    type: "selection-update",
    data: selectionData
  });
}

// Extract styles from Penpot element
function extractStyles(element: any): StylesData {
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

    // Background and fills
    if (element?.fills && Array.isArray(element.fills) && element.fills.length > 0) {
      const fill = element.fills[0];
      if (fill?.fillColor && typeof fill.fillColor === 'object') {
        const { r, g, b, alpha = 1 } = fill.fillColor;
        if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
          styles.backgroundColor = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
        }
      }
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
    if (element?.fontColor && typeof element.fontColor === 'object') {
      const { r, g, b, alpha = 1 } = element.fontColor;
      if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
        styles.color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
      }
    }

    // Border radius (rounded to integers)
    if ((element?.rx && typeof element.rx === 'number') || (element?.ry && typeof element.ry === 'number')) {
      const radius = element.rx || element.ry || 0;
      styles.borderRadius = `${Math.round(radius)}px`;
    }

    // Opacity
    if (element?.opacity !== undefined && element.opacity !== null && typeof element.opacity === 'number' && element.opacity !== 1) {
      styles.opacity = String(element.opacity);
    }

    // Strokes (borders) - rounded stroke width
    if (element?.strokes && Array.isArray(element.strokes) && element.strokes.length > 0) {
      const stroke = element.strokes[0];
      if (stroke?.strokeColor && stroke?.strokeWidth && typeof stroke.strokeWidth === 'number') {
        const { r, g, b, alpha = 1 } = stroke.strokeColor;
        if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
          const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
          styles.border = `${Math.round(stroke.strokeWidth)}px solid ${color}`;
        }
      }
    }

    // Shadow effects - rounded shadow values
    if (element?.shadows && Array.isArray(element.shadows) && element.shadows.length > 0) {
      const shadow = element.shadows[0];
      if (shadow?.color && shadow?.offsetX !== undefined && shadow.offsetX !== null) {
        const { r, g, b, alpha = 1 } = shadow.color;
        if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
          const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
          const blur = Math.round(shadow.blur || 0);
          const spread = Math.round(shadow.spread || 0);
          styles.boxShadow = `${Math.round(shadow.offsetX)}px ${Math.round(shadow.offsetY || 0)}px ${blur}px ${spread}px ${color}`;
        }
      }
    }
  } catch (error) {
    console.warn("Error extracting styles:", error);
  }

  return styles;
}

// Extract content from element
function extractContent(element: any): { content?: string; imageUrl?: string } {
  const result: { content?: string; imageUrl?: string } = {};

  try {
    // Text content
    if (element?.type === 'text' && element?.characters && typeof element.characters === 'string') {
      result.content = element.characters;
    }

    // Image URL (for image elements)
    if (element?.type === 'image' && element?.imageData) {
      // In a real implementation, you might want to export the image
      const imageName = (element?.name && typeof element.name === 'string') ? element.name : 'image';
      result.imageUrl = `assets/${imageName}.png`;
    }
  } catch (error) {
    console.warn("Error extracting content:", error);
  }

  return result;
}

// Analyze layout properties of a group/frame
function analyzeLayout(element: any): LayoutData {
  const layout: LayoutData = {};

  try {
    // Check if element has children
    if (!element?.children || !Array.isArray(element.children) || element.children.length === 0) {
      return layout;
    }

    const children = element.children;
    
    // Analyze children positioning to infer layout
    if (children.length > 1) {
      // Check if children are arranged horizontally or vertically
      const positions = children
        .filter((child: any) => child && typeof child.x === 'number' && typeof child.y === 'number' && typeof child.width === 'number' && typeof child.height === 'number')
        .map((child: any) => ({ 
          x: child.x, 
          y: child.y, 
          width: child.width, 
          height: child.height 
        }));
      
      if (positions.length < 2) {
        return layout;
      }
      
      // Sort by position to analyze arrangement
      const sortedByX = [...positions].sort((a, b) => a.x - b.x);
      const sortedByY = [...positions].sort((a, b) => a.y - b.y);
      
      // Check for horizontal arrangement (similar Y positions)
      const yValues = positions.map((p: any) => p.y);
      const xValues = positions.map((p: any) => p.x);
      const yVariance = Math.max(...yValues) - Math.min(...yValues);
      const xVariance = Math.max(...xValues) - Math.min(...xValues);
      
      if (yVariance < 20 && xVariance > 50) {
        // Likely horizontal arrangement
        layout.display = "flex";
        layout.flexDirection = "row";
        
        // Analyze spacing
        if (sortedByX.length > 1) {
          const gaps = [];
          for (let i = 1; i < sortedByX.length; i++) {
            const gap = sortedByX[i].x - (sortedByX[i-1].x + sortedByX[i-1].width);
            if (gap > 0) gaps.push(gap);
          }
          if (gaps.length > 0) {
            const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
            layout.gap = `${Math.round(avgGap)}px`;
          }
        }
        
      } else if (xVariance < 20 && yVariance > 50) {
        // Likely vertical arrangement
        layout.display = "flex";
        layout.flexDirection = "column";
        
        // Analyze spacing
        if (sortedByY.length > 1) {
          const gaps = [];
          for (let i = 1; i < sortedByY.length; i++) {
            const gap = sortedByY[i].y - (sortedByY[i-1].y + sortedByY[i-1].height);
            if (gap > 0) gaps.push(gap);
          }
          if (gaps.length > 0) {
            const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
            layout.gap = `${Math.round(avgGap)}px`;
          }
        }
      }
      
      // Analyze alignment
      if (layout.display === "flex" && positions.length > 0) {
        // Check horizontal alignment for vertical layouts
        if (layout.flexDirection === "column") {
          const leftAligned = positions.every((p: any) => Math.abs(p.x - positions[0].x) < 10);
          const centerAligned = positions.every((p: any) => Math.abs((p.x + p.width/2) - (positions[0].x + positions[0].width/2)) < 10);
          
          if (leftAligned) layout.alignItems = "flex-start";
          else if (centerAligned) layout.alignItems = "center";
          else layout.alignItems = "flex-start";
        }
        
        // Check vertical alignment for horizontal layouts
        if (layout.flexDirection === "row") {
          const topAligned = positions.every((p: any) => Math.abs(p.y - positions[0].y) < 10);
          const centerAligned = positions.every((p: any) => Math.abs((p.y + p.height/2) - (positions[0].y + positions[0].height/2)) < 10);
          
          if (topAligned) layout.alignItems = "flex-start";
          else if (centerAligned) layout.alignItems = "center";
          else layout.alignItems = "flex-start";
        }
      }
    }
  } catch (error) {
    console.warn("Error analyzing layout:", error);
  }

  return layout;
}

// Apply tag to selected elements
function applyTagToElements(tag: string, properties: Record<string, string>, elementIds: string[]) {
  elementIds.forEach(elementId => {
    const element = penpot.currentPage?.getShapeById(elementId);
    if (element) {
      // Extract comprehensive data
      const styles = extractStyles(element);
      const { content, imageUrl } = extractContent(element);
      const layout = analyzeLayout(element);

      // Create enhanced tag data
      const tagData: TagData = {
        tag,
        properties,
        elementId,
        elementName: element.name || "Unnamed",
        elementType: element.type,
        styles,
        layout: Object.keys(layout).length > 0 ? layout : undefined,
        content,
        imageUrl,
        children: [] // Will be populated during export
      };

      // Save to local map (memory only for now)
      taggedElements.set(elementId, tagData);

      // Confirm to UI
      penpot.ui.sendMessage({
        source: "penpot",
        type: "tag-applied",
        data: tagData
      });
    }
  });

  // Save to file
  saveTagsToFile();
}

// Remove tag from elements
function removeTagFromElements(elementIds: string[]) {
  elementIds.forEach(elementId => {
    const element = penpot.currentPage?.getShapeById(elementId);
    if (element) {
      // Remove from local map
      taggedElements.delete(elementId);

      // Confirm to UI
      penpot.ui.sendMessage({
        source: "penpot",
        type: "tag-removed",
        data: { elementId }
      });
    }
  });

  // Save to file
  saveTagsToFile();
}

/**
 * Main function to generate rich JSON structure from selected Penpot shapes
 * @param selectedShapes Array of selected Penpot shape objects
 * @returns Complete JSON object with metadata and tree structure
 */
function generateRichJson(selectedShapes: any[]): any {
  // Generate metadata
  const metadata = {
    pluginName: "Semantic Tagging Plugin",
    version: "1.2.0",
    exportDate: new Date().toISOString(),
    fileName: penpot.currentFile?.name || "Untitled",
    pageName: penpot.currentPage?.name || "Untitled Page"
  };

  // Process each selected shape into the tree structure
  const tree: any[] = [];
  
  selectedShapes.forEach(shape => {
    const processedNode = processShape(shape);
    if (processedNode) {
      if (Array.isArray(processedNode)) {
        // If processShape returns multiple nodes (children without tagged parent)
        tree.push(...processedNode);
      } else {
        tree.push(processedNode);
      }
    }
  });

  return {
    metadata,
    tree
  };
}

/**
 * Recursive helper function to process a single Penpot shape into a node object
 * @param shape Penpot shape object
 * @returns Node object following the specified structure, or null if no tag found
 */
function processShape(shape: any): any | null {
  if (!shape) return null;

  // Check if this shape has a semantic tag
  const tagData = taggedElements.get(shape.id);
  if (!tagData) {
    // If no tag, still process children in case they have tags
    if (shape.children && Array.isArray(shape.children)) {
      const childNodes = shape.children
        .map((child: any) => processShape(child))
        .filter((node: any) => node !== null);
      
      // If children have tags but parent doesn't, return the children as separate root nodes
      return childNodes.length > 0 ? childNodes : null;
    }
    return null;
  }

  // Analyze layout properties for containers first
  const layout = analyzeLayoutProperties(shape);
  
  // Determine if this is a flex/grid container
  const isFlexContainer = layout && (layout.display === "flex" || layout.display === "grid");
  
  // Extract comprehensive styles - all positioning and dimensional data goes here
  // Pass the parent context to determine if absolute positioning is needed
  const styles = extractComprehensiveStyles(shape, isFlexContainer);
  
  // Extract content and image data
  const { content, imageUrl } = extractContent(shape);
  
  // Process children recursively
  const children: any[] = [];
  if (shape.children && Array.isArray(shape.children)) {
    // Pass down information about whether this is a flex/grid container to children
    shape.children.forEach((child: any) => {
      // Set a flag on the child to indicate it's inside a flex/grid container
      child._isInFlexContainer = isFlexContainer;
      
      const childNode = processShape(child);
      if (childNode) {
        if (Array.isArray(childNode)) {
          // If child returned multiple nodes, add them all
          children.push(...childNode);
        } else {
          children.push(childNode);
        }
      }
    });
  }

  // Merge layout properties into styles object
  const mergedStyles = { ...styles };
  if (layout && Object.keys(layout).length > 0) {
    Object.entries(layout).forEach(([key, value]) => {
      mergedStyles[key] = value;
    });
  }
  
  // Check if this element is in a flex container (passed down from parent)
  const isInFlexContainer = shape._isInFlexContainer === true;
  
  // Only include position and coordinates if not in a flex container
  if (isInFlexContainer) {
    delete mergedStyles.position;
    delete mergedStyles.left;
    delete mergedStyles.top;
  }

  // Build the node object according to specification
  const node: any = {
    tag: tagData.tag,
    elementName: shape.name || "Unnamed",
    elementType: shape.type || "unknown",
    elementId: shape.id,
    attributes: { ...tagData.properties }, // HTML attributes from user metadata
    styles: mergedStyles, // CSS styles including layout properties
    children: children
  };

  // Add optional properties only if they exist
  if (content) {
    node.content = content;
  }
  
  if (imageUrl) {
    node.source = imageUrl;
  }

  return node;
}

/**
 * Extract comprehensive styles with all positioning and dimensional data as CSS strings
 * @param shape Penpot shape object
 * @param isInFlexContainer Whether this element is inside a flex/grid container
 * @returns Styles object with CSS-ready string values
 */
function extractComprehensiveStyles(shape: any, isInFlexContainer: boolean = false): Record<string, string> {
  const styles: Record<string, string> = {};

  try {
    // Helper function to convert color object to CSS rgba string
    function colorToCssRgba(colorObj: any): string | null {
      if (!colorObj) return null;
      
      // Handle different color object formats
      let r, g, b, alpha = 1;
      
      if (typeof colorObj.r === 'number' && typeof colorObj.g === 'number' && typeof colorObj.b === 'number') {
        r = colorObj.r;
        g = colorObj.g;
        b = colorObj.b;
        alpha = typeof colorObj.alpha === 'number' ? colorObj.alpha : 1;
        
        // Check if values are in 0-1 range (Penpot standard) or 0-255 range
        const needsScaling = (r <= 1 && g <= 1 && b <= 1);
        
        return `rgba(${Math.round(needsScaling ? r * 255 : r)}, ${Math.round(needsScaling ? g * 255 : g)}, ${Math.round(needsScaling ? b * 255 : b)}, ${alpha})`;
      }
      
      // Handle hex format
      if (typeof colorObj === 'string' && colorObj.startsWith('#')) {
        return colorObj;
      }
      
      return null;
    }

    // ESSENTIAL: Dimensions - always include these (rounded to integers)
    if (typeof shape?.width === 'number') {
      styles.width = `${Math.round(shape.width)}px`;
    }
    if (typeof shape?.height === 'number') {
      styles.height = `${Math.round(shape.height)}px`;
    }

    // Only apply absolute positioning if not in a flex/grid container
    // Elements in flex/grid containers should use the container's layout system
    if (!shape._isInFlexContainer) {
      styles.position = "absolute"; // Default positioning for Penpot elements
      if (typeof shape?.x === 'number') {
        styles.left = `${Math.round(shape.x)}px`;
      }
      if (typeof shape?.y === 'number') {
        styles.top = `${Math.round(shape.y)}px`;
      }
    }

    // Background and fills - Enhanced to handle different color formats
    // Try multiple approaches to find background color
    let bgColor = null;
    
    // 1. Try fills array first (most common in Penpot)
    if (shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
      const fill = shape.fills[0];
      
      // Try fillColor property
      if (fill?.fillColor) {
        bgColor = colorToCssRgba(fill.fillColor);
      }
      
      // Try color property if fillColor didn't work
      if (!bgColor && fill?.color) {
        bgColor = colorToCssRgba(fill.color);
      }
      
      // Try fill.value for some Penpot versions
      if (!bgColor && fill?.value) {
        bgColor = colorToCssRgba(fill.value);
      }
    }
    
    // 2. Try direct backgroundColor property
    if (!bgColor && shape?.backgroundColor) {
      bgColor = colorToCssRgba(shape.backgroundColor);
    }
    
    // 3. Try direct fill property
    if (!bgColor && shape?.fill) {
      bgColor = colorToCssRgba(shape.fill);
    }
    
    // 4. Try direct color property if it's not a text element
    // (for text elements, color is used for text color)
    if (!bgColor && shape?.color && shape.type !== 'text') {
      bgColor = colorToCssRgba(shape.color);
    }
    
    // Apply the background color if found
    if (bgColor) {
      styles.backgroundColor = bgColor;
    }

    // Typography properties
    if (shape?.fontFamily && typeof shape.fontFamily === 'string') {
      styles.fontFamily = shape.fontFamily;
    }
    if (typeof shape?.fontSize === 'number') {
      styles.fontSize = `${Math.round(shape.fontSize)}px`;
    }
    if (shape?.fontWeight !== undefined && shape.fontWeight !== null) {
      styles.fontWeight = String(shape.fontWeight);
    }
    if (shape?.fontStyle && typeof shape.fontStyle === 'string') {
      styles.fontStyle = shape.fontStyle;
    }
    if (shape?.textAlign && typeof shape.textAlign === 'string') {
      styles.textAlign = shape.textAlign;
    }
    if (shape?.lineHeight !== undefined && shape.lineHeight !== null) {
      styles.lineHeight = String(shape.lineHeight);
    }

    // Text color - Enhanced to handle different color formats
    // Try multiple approaches to find text color
    let textColor = null;
    
    // For text elements, try to find the text color using various properties
    if (shape.type === 'text' || shape.characters) {
      // 1. Try fontColor property (most common in Penpot)
      if (!textColor && shape?.fontColor) {
        textColor = colorToCssRgba(shape.fontColor);
      }
      
      // 2. Try textColor property
      if (!textColor && shape?.textColor) {
        textColor = colorToCssRgba(shape.textColor);
      }
      
      // 3. Try color property directly
      if (!textColor && shape?.color) {
        textColor = colorToCssRgba(shape.color);
      }
      
      // 4. Try content.color property (used in some Penpot versions)
      if (!textColor && shape?.content?.color) {
        textColor = colorToCssRgba(shape.content.color);
      }
      
      // 5. Try text.color property (used in some Penpot versions)
      if (!textColor && shape?.text?.color) {
        textColor = colorToCssRgba(shape.text.color);
      }
      
      // 6. Try fills for text (sometimes Penpot uses fills for text color)
      if (!textColor && shape?.fills && Array.isArray(shape.fills) && shape.fills.length > 0) {
        const fill = shape.fills[0];
        if (fill?.fillColor) {
          textColor = colorToCssRgba(fill.fillColor);
        } else if (fill?.color) {
          textColor = colorToCssRgba(fill.color);
        }
      }
      
      // Apply the text color if found
      if (textColor) {
        styles.color = textColor;
      } else {
        // Default text color if nothing found but it's a text element
        styles.color = "rgba(0, 0, 0, 1)";
      }
    }

    // Border radius (rounded to integers)
    if (typeof shape?.rx === 'number' || typeof shape?.ry === 'number') {
      const radius = shape.rx || shape.ry || 0;
      styles.borderRadius = `${Math.round(radius)}px`;
    }

    // Borders from strokes - Enhanced to handle different stroke color formats
    if (shape?.strokes && Array.isArray(shape.strokes) && shape.strokes.length > 0) {
      const stroke = shape.strokes[0];
      
      // Try to get stroke color
      let strokeColor = null;
      
      if (stroke?.strokeColor) {
        strokeColor = colorToCssRgba(stroke.strokeColor);
      } else if (stroke?.color) {
        strokeColor = colorToCssRgba(stroke.color);
      } else if (stroke?.stroke) {
        strokeColor = colorToCssRgba(stroke.stroke);
      }
      
      // Get stroke width
      const strokeWidth = typeof stroke?.strokeWidth === 'number' ? stroke.strokeWidth : 
                         (typeof stroke?.width === 'number' ? stroke.width : null);
      
      // Apply border style if we have both color and width
      if (strokeColor && strokeWidth !== null) {
        styles.border = `${Math.round(strokeWidth)}px solid ${strokeColor}`;
      }
    }

    // Box shadow from effects - Enhanced to handle different shadow formats
    if (shape?.shadows && Array.isArray(shape.shadows) && shape.shadows.length > 0) {
      const shadow = shape.shadows[0];
      
      // Try to get shadow color
      let shadowColor = null;
      
      if (shadow?.color) {
        shadowColor = colorToCssRgba(shadow.color);
      } else if (shadow?.shadowColor) {
        shadowColor = colorToCssRgba(shadow.shadowColor);
      }
      
      // Get shadow parameters with fallbacks
      if (shadowColor && shadow?.offsetX !== undefined) {
        const offsetX = Math.round(shadow.offsetX || 0);
        const offsetY = Math.round(shadow.offsetY || 0);
        const blur = Math.round(shadow.blur || shadow.blurRadius || 0);
        const spread = Math.round(shadow.spread || shadow.spreadRadius || 0);
        
        styles.boxShadow = `${offsetX}px ${offsetY}px ${blur}px ${spread}px ${shadowColor}`;
      }
    }

    // Opacity
    if (typeof shape?.opacity === 'number' && shape.opacity !== 1) {
      styles.opacity = String(shape.opacity);
    }

  } catch (error) {
    console.warn("Error extracting comprehensive styles:", error);
  }

  return styles;
}

/**
 * Analyze layout properties by examining children positioning and arrangement
 * @param shape Penpot shape object
 * @returns Layout object with flex properties if layout is detected
 */
function analyzeLayoutProperties(shape: any): Record<string, string> {
  const layout: Record<string, string> = {};

  try {
    // Only analyze layout for elements with children
    if (!shape?.children || !Array.isArray(shape.children) || shape.children.length < 2) {
      return layout;
    }

    const children = shape.children.filter((child: any) => 
      child && 
      typeof child.x === 'number' && 
      typeof child.y === 'number' && 
      typeof child.width === 'number' && 
      typeof child.height === 'number'
    );

    if (children.length < 2) return layout;

    // Calculate positions and dimensions
    interface PositionData {
      x: number;
      y: number;
      width: number;
      height: number;
      centerX: number;
      centerY: number;
    }

    const positions: PositionData[] = children.map((child: any) => ({
      x: child.x,
      y: child.y,
      width: child.width,
      height: child.height,
      centerX: child.x + child.width / 2,
      centerY: child.y + child.height / 2
    }));

    // Sort positions for analysis
    const sortedByX = [...positions].sort((a, b) => a.x - b.x);
    const sortedByY = [...positions].sort((a, b) => a.y - b.y);

    // Calculate variance in positions
    const yPositions = positions.map((p: PositionData) => p.y);
    const xPositions = positions.map((p: PositionData) => p.x);
    const yVariance = Math.max(...yPositions) - Math.min(...yPositions);
    const xVariance = Math.max(...xPositions) - Math.min(...xPositions);

    // Determine layout direction
    const ALIGNMENT_THRESHOLD = 20; // pixels
    const SPACING_THRESHOLD = 50; // pixels

    if (yVariance < ALIGNMENT_THRESHOLD && xVariance > SPACING_THRESHOLD) {
      // Horizontal layout detected
      layout.display = "flex";
      layout.flexDirection = "row";

      // Calculate gaps between elements
      const gaps: number[] = [];
      for (let i = 1; i < sortedByX.length; i++) {
        const gap = sortedByX[i].x - (sortedByX[i-1].x + sortedByX[i-1].width);
        if (gap >= 0) gaps.push(gap);
      }

      if (gaps.length > 0) {
        const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
        if (avgGap > 0) {
          layout.gap = `${Math.round(avgGap)}px`;
        }
      }

      // Determine horizontal justification
      const containerWidth = shape.width || 0;
      const totalChildrenWidth = positions.reduce((sum: number, pos: PositionData) => sum + pos.width, 0);
      const totalGaps = gaps.reduce((sum: number, gap: number) => sum + gap, 0);
      const remainingSpace = containerWidth - totalChildrenWidth - totalGaps;

      if (remainingSpace > 20) {
        // Check if elements are distributed
        const firstX = sortedByX[0].x;
        const lastX = sortedByX[sortedByX.length - 1].x + sortedByX[sortedByX.length - 1].width;
        const usedWidth = lastX - firstX;
        
        if (usedWidth > containerWidth * 0.8) {
          layout.justifyContent = "space-between";
        } else if (firstX > containerWidth * 0.1) {
          layout.justifyContent = "center";
        }
      }

      // Determine vertical alignment
      const centerYs = positions.map((p: PositionData) => p.centerY);
      const centerYVariance = Math.max(...centerYs) - Math.min(...centerYs);
      
      if (centerYVariance < ALIGNMENT_THRESHOLD) {
        layout.alignItems = "center";
      } else {
        const topYs = positions.map((p: PositionData) => p.y);
        const topYVariance = Math.max(...topYs) - Math.min(...topYs);
        if (topYVariance < ALIGNMENT_THRESHOLD) {
          layout.alignItems = "flex-start";
        }
      }

    } else if (xVariance < ALIGNMENT_THRESHOLD && yVariance > SPACING_THRESHOLD) {
      // Vertical layout detected
      layout.display = "flex";
      layout.flexDirection = "column";

      // Calculate gaps between elements
      const gaps: number[] = [];
      for (let i = 1; i < sortedByY.length; i++) {
        const gap = sortedByY[i].y - (sortedByY[i-1].y + sortedByY[i-1].height);
        if (gap >= 0) gaps.push(gap);
      }

      if (gaps.length > 0) {
        const avgGap = gaps.reduce((sum: number, gap: number) => sum + gap, 0) / gaps.length;
        if (avgGap > 0) {
          layout.gap = `${Math.round(avgGap)}px`;
        }
      }

      // Determine horizontal alignment
      const centerXs = positions.map((p: PositionData) => p.centerX);
      const centerXVariance = Math.max(...centerXs) - Math.min(...centerXs);
      
      if (centerXVariance < ALIGNMENT_THRESHOLD) {
        layout.alignItems = "center";
      } else {
        const leftXs = positions.map((p: PositionData) => p.x);
        const leftXVariance = Math.max(...leftXs) - Math.min(...leftXs);
        if (leftXVariance < ALIGNMENT_THRESHOLD) {
          layout.alignItems = "flex-start";
        }
      }

      // Determine vertical justification
      const containerHeight = shape.height || 0;
      const totalChildrenHeight = positions.reduce((sum: number, pos: PositionData) => sum + pos.height, 0);
      const totalGaps = gaps.reduce((sum: number, gap: number) => sum + gap, 0);
      const remainingSpace = containerHeight - totalChildrenHeight - totalGaps;

      if (remainingSpace > 20) {
        const firstY = sortedByY[0].y;
        const lastY = sortedByY[sortedByY.length - 1].y + sortedByY[sortedByY.length - 1].height;
        const usedHeight = lastY - firstY;
        
        if (usedHeight > containerHeight * 0.8) {
          layout.justifyContent = "space-between";
        } else if (firstY > containerHeight * 0.1) {
          layout.justifyContent = "center";
        }
      }
    }

  } catch (error) {
    console.warn("Error analyzing layout properties:", error);
  }

  return layout;
}

// Build tree structure from flat tagged elements (legacy function - kept for compatibility)
function buildTreeStructure(): TagData[] {
  const tagsArray = Array.from(taggedElements.values());
  const elementMap = new Map<string, TagData>();
  const rootElements: TagData[] = [];

  // First pass: create enhanced tag data for all elements
  tagsArray.forEach(tagData => {
    const element = penpot.currentPage?.getShapeById(tagData.elementId);
    if (element) {
      // Re-extract data to ensure it's up to date
      const styles = extractStyles(element);
      const { content, imageUrl } = extractContent(element);
      const layout = analyzeLayout(element);

      const enhancedTagData: TagData = {
        ...tagData,
        elementType: element.type,
        styles,
        layout: Object.keys(layout).length > 0 ? layout : undefined,
        content,
        imageUrl,
        children: []
      };

      elementMap.set(tagData.elementId, enhancedTagData);
    }
  });

  // Second pass: build parent-child relationships
  elementMap.forEach((tagData, elementId) => {
    const element = penpot.currentPage?.getShapeById(elementId);
    if (element && element.parent) {
      const parentTagData = elementMap.get(element.parent.id);
      if (parentTagData) {
        // This element has a tagged parent, add it as a child
        parentTagData.children!.push(tagData);
      } else {
        // Parent is not tagged, this is a root element
        rootElements.push(tagData);
      }
    } else {
      // No parent or parent not found, this is a root element
      rootElements.push(tagData);
    }
  });

  return rootElements;
}

// Export tags as JSON with rich tree structure using the new generateRichJson function
function exportTags() {
  // Get all shapes that have been tagged
  const taggedShapeIds = Array.from(taggedElements.keys());
  const selectedShapes: any[] = [];

  // Collect all tagged shapes from the current page
  taggedShapeIds.forEach(shapeId => {
    const shape = penpot.currentPage?.getShapeById(shapeId);
    if (shape) {
      selectedShapes.push(shape);
    }
  });

  // Use the new generateRichJson function to create the export data
  const exportData = generateRichJson(selectedShapes);

  // Send data to UI to handle download
  penpot.ui.sendMessage({
    source: "penpot",
    type: "export-data",
    data: exportData
  });
}

// Auto-tag elements based on layer names
function autoTagElements(elementIds: string[]) {
  let taggedCount = 0;
  let processedElements: string[] = [];

  // Recursive function to process each node
  function processNode(element: any): void {
    if (!element) return;

    const layerName = element.name || '';
    const parsedTag = parseLayerNameForAutoTag(layerName);
    
    if (parsedTag) {
      // Extract comprehensive data
      const styles = extractStyles(element);
      const { content, imageUrl } = extractContent(element);
      const layout = analyzeLayout(element);

      // Create enhanced tag data
      const tagData: TagData = {
        tag: parsedTag.tag,
        properties: parsedTag.properties,
        elementId: element.id,
        elementName: element.name || "Unnamed",
        elementType: element.type,
        styles,
        layout: Object.keys(layout).length > 0 ? layout : undefined,
        content,
        imageUrl,
        children: [] // Will be populated during export
      };

      // Save to local map
      taggedElements.set(element.id, tagData);
      processedElements.push(element.id);
      taggedCount++;

      // Confirm to UI
      penpot.ui.sendMessage({
        source: "penpot",
        type: "tag-applied",
        data: tagData
      });
    }

    // Process children recursively
    if (element.children && Array.isArray(element.children)) {
      element.children.forEach((child: any) => processNode(child));
    }
  }

  // Process each selected element
  elementIds.forEach(elementId => {
    const element = penpot.currentPage?.getShapeById(elementId);
    if (element) {
      processNode(element);
    }
  });

  // Send feedback to UI
  penpot.ui.sendMessage({
    source: "penpot",
    type: "auto-tag-complete",
    data: {
      taggedCount,
      processedElements
    }
  });

  // Save to file
  saveTagsToFile();
}

// Parse layer name for auto-tagging (backend version)
function parseLayerNameForAutoTag(layerName: string): { tag: string; properties: Record<string, string> } | null {
  if (!layerName || layerName.trim() === "") {
    return null;
  }

  const parts = layerName.trim().split('/').map(p => p.trim()).filter(p => p !== "");
  
  if (parts.length === 0) {
    return null;
  }

  const tag = parts[0];
  const properties: Record<string, string> = {};

  // Apply intelligent parsing based on tag type
  switch (tag.toLowerCase()) {
    case 'input':
      if (parts[1]) {
        properties.type = parts[1].toLowerCase();
        if (parts[2]) {
          properties.placeholder = parts[2];
        }
      }
      break;

    case 'button':
      if (parts[1]) {
        properties.className = `btn-${parts[1].toLowerCase()}`;
        properties.type = parts[1].toLowerCase() === 'submit' ? 'submit' : 'button';
      }
      break;

    case 'a':
      if (parts[1]) {
        if (parts[1].toLowerCase() === 'external') {
          properties.target = '_blank';
          properties.rel = 'noopener noreferrer';
        }
        if (parts[2]) {
          properties.href = parts[2];
        }
      }
      break;

    case 'img':
      if (parts[1]) {
        properties.alt = parts[1];
      }
      if (parts[2]) {
        properties.src = parts[2];
      }
      break;

    case 'nav':
      if (parts[1]) {
        properties.className = `nav-${parts[1].toLowerCase()}`;
      }
      break;

    case 'div':
    case 'section':
    case 'header':
    case 'footer':
    case 'main':
    case 'aside':
      if (parts[1]) {
        properties.className = parts[1].toLowerCase().replace(/\s+/g, '-');
      }
      break;

    case 'h1':
    case 'h2':
    case 'h3':
    case 'h4':
    case 'h5':
    case 'h6':
      if (parts[1]) {
        properties.className = `heading-${parts[1].toLowerCase()}`;
      }
      break;

    // Material UI components
    case 'muibutton':
      if (parts[1]) {
        properties.variant = parts[1].toLowerCase();
      }
      if (parts[2]) {
        properties.color = parts[2].toLowerCase();
      }
      break;

    case 'muitextfield':
      if (parts[1]) {
        properties.variant = parts[1].toLowerCase();
      }
      if (parts[2]) {
        properties.label = parts[2];
      }
      break;

    // Chakra UI components
    case 'chakrabutton':
      if (parts[1]) {
        properties.colorScheme = parts[1].toLowerCase();
      }
      if (parts[2]) {
        properties.size = parts[2].toLowerCase();
      }
      break;

    default:
      // For any other tag, use the second part as className if available
      if (parts[1]) {
        properties.className = parts[1].toLowerCase().replace(/\s+/g, '-');
      }
      break;
  }

  return { tag, properties };
}

// Handle UI messages
penpot.ui.onMessage<PluginMessage>((message) => {
  switch (message.type) {
    case "get-selection":
      sendSelectionUpdate();
      break;

    case "apply-tag":
      if (message.data) {
        applyTagToElements(
          message.data.tag,
          message.data.properties,
          message.data.elementIds
        );
      }
      break;

    case "remove-tag":
      if (message.data) {
        removeTagFromElements(message.data.elementIds);
      }
      break;

    case "export-tags":
      exportTags();
      break;

    case "auto-tag-selection":
      if (message.data && message.data.elementIds) {
        autoTagElements(message.data.elementIds);
      }
      break;

    default:
      console.warn("Unrecognized message:", message.type);
  }
});

// Listen for selection changes
penpot.on("selectionchange", () => {
  sendSelectionUpdate();
});

// Listen for theme changes
penpot.on("themechange", (theme) => {
  penpot.ui.sendMessage({
    source: "penpot",
    type: "themechange",
    theme,
  });
});

// Listen for page changes (to reload tags if necessary)
penpot.on("pagechange", () => {
  loadExistingTags();
  sendSelectionUpdate();
});

// Listen when file is closed (to clean state)
penpot.on("filechange", () => {
  taggedElements.clear();
  loadExistingTags();
  sendSelectionUpdate();
});

// Initialize the plugin
initPlugin();
