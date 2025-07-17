import { ExportData, ExportMetadata, TagData } from '../types';
import { PLUGIN_CONFIG } from '../core/constants';
import { extractComprehensiveStyles } from '../utils/style-extractor';
import { extractContent } from '../utils/content-extractor';
import { analyzeLayoutProperties } from '../utils/layout-analyzer';

/**
 * Service for handling export functionality
 */
export class ExportService {
  /**
   * Main function to generate rich JSON structure from selected Penpot shapes
   * @param selectedShapes Array of selected Penpot shape objects
   * @param taggedElements Map of tagged elements
   * @returns Complete JSON object with metadata and tree structure
   */
  generateRichJson(selectedShapes: any[], taggedElements: Map<string, TagData>): ExportData {
    // Generate metadata
    const metadata: ExportMetadata = {
      pluginName: PLUGIN_CONFIG.name,
      version: PLUGIN_CONFIG.version,
      exportDate: new Date().toISOString(),
      fileName: penpot.currentFile?.name || "Untitled",
      pageName: penpot.currentPage?.name || "Untitled Page"
    };

    // Process each selected shape into the tree structure
    const tree: any[] = [];
    
    selectedShapes.forEach(shape => {
      const processedNode = this.processShape(shape, taggedElements);
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
   * @param taggedElements Map of tagged elements
   * @returns Node object following the specified structure, or null if no tag found
   */
  private processShape(shape: any, taggedElements: Map<string, TagData>): any | null {
    if (!shape) return null;

    // Check if this shape has a semantic tag
    const tagData = taggedElements.get(shape.id);
    if (!tagData) {
      // If no tag, still process children in case they have tags
      if (shape.children && Array.isArray(shape.children)) {
        const childNodes = shape.children
          .map((child: any) => this.processShape(child, taggedElements))
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
        
        const childNode = this.processShape(child, taggedElements);
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
   * Export tags as JSON with rich tree structure
   * @param taggedElements Map of tagged elements
   * @returns Export data ready for download
   */
  exportTags(taggedElements: Map<string, TagData>): ExportData {
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

    // Use the generateRichJson function to create the export data
    return this.generateRichJson(selectedShapes, taggedElements);
  }
}