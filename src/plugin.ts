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
    // Position and dimensions - ALWAYS include these as they're essential
    if (element?.x !== undefined && element.x !== null && typeof element.x === 'number') {
      styles.left = `${element.x}px`;
    }
    if (element?.y !== undefined && element.y !== null && typeof element.y === 'number') {
      styles.top = `${element.y}px`;
    }
    if (element?.width && typeof element.width === 'number') {
      styles.width = `${element.width}px`;
    }
    if (element?.height && typeof element.height === 'number') {
      styles.height = `${element.height}px`;
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
      styles.fontSize = `${element.fontSize}px`;
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

    // Border radius
    if ((element?.rx && typeof element.rx === 'number') || (element?.ry && typeof element.ry === 'number')) {
      const radius = element.rx || element.ry || 0;
      styles.borderRadius = `${radius}px`;
    }

    // Opacity
    if (element?.opacity !== undefined && element.opacity !== null && typeof element.opacity === 'number' && element.opacity !== 1) {
      styles.opacity = String(element.opacity);
    }

    // Strokes (borders)
    if (element?.strokes && Array.isArray(element.strokes) && element.strokes.length > 0) {
      const stroke = element.strokes[0];
      if (stroke?.strokeColor && stroke?.strokeWidth && typeof stroke.strokeWidth === 'number') {
        const { r, g, b, alpha = 1 } = stroke.strokeColor;
        if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
          const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
          styles.border = `${stroke.strokeWidth}px solid ${color}`;
        }
      }
    }

    // Shadow effects
    if (element?.shadows && Array.isArray(element.shadows) && element.shadows.length > 0) {
      const shadow = element.shadows[0];
      if (shadow?.color && shadow?.offsetX !== undefined && shadow.offsetX !== null) {
        const { r, g, b, alpha = 1 } = shadow.color;
        if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
          const color = `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${alpha})`;
          const blur = shadow.blur || 0;
          const spread = shadow.spread || 0;
          styles.boxShadow = `${shadow.offsetX}px ${shadow.offsetY || 0}px ${blur}px ${spread}px ${color}`;
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
      const yValues = positions.map(p => p.y);
      const xValues = positions.map(p => p.x);
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
          const leftAligned = positions.every(p => Math.abs(p.x - positions[0].x) < 10);
          const centerAligned = positions.every(p => Math.abs((p.x + p.width/2) - (positions[0].x + positions[0].width/2)) < 10);
          
          if (leftAligned) layout.alignItems = "flex-start";
          else if (centerAligned) layout.alignItems = "center";
          else layout.alignItems = "flex-start";
        }
        
        // Check vertical alignment for horizontal layouts
        if (layout.flexDirection === "row") {
          const topAligned = positions.every(p => Math.abs(p.y - positions[0].y) < 10);
          const centerAligned = positions.every(p => Math.abs((p.y + p.height/2) - (positions[0].y + positions[0].height/2)) < 10);
          
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

// Build tree structure from flat tagged elements
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

// Export tags as JSON with tree structure
function exportTags() {
  const treeStructure = buildTreeStructure();
  const tagsArray = Array.from(taggedElements.values());

  // Create clean export structure with only tree (no redundancy)
  const exportData = {
    metadata: {
      pluginName: "Semantic Tagging Plugin",
      version: "2.0.0",
      exportDate: new Date().toISOString(),
      fileName: penpot.currentFile?.name || "Untitled",
      pageName: penpot.currentPage?.name || "Untitled Page",
      totalElements: tagsArray.length,
      description: "Enhanced export with tree structure, styles, content, and layout information"
    },
    // Only tree structure - no redundant flat list
    tree: treeStructure
  };

  // Send data to UI to handle download
  penpot.ui.sendMessage({
    source: "penpot",
    type: "export-data",
    data: exportData
  });
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
