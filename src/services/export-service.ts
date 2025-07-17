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
      const processedNode = this.processShape(shape, taggedElements, true);
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
   * Check if a shape or any of its descendants have tags
   * @param shape Penpot shape object
   * @param taggedElements Map of tagged elements
   * @returns boolean indicating if shape tree contains any tagged elements
   */
  private hasTaggedDescendants(shape: any, taggedElements: Map<string, TagData>): boolean {
    if (!shape) return false;

    // Check if this shape has a tag
    if (taggedElements.has(shape.id)) {
      return true;
    }

    // Check children recursively
    if (shape.children && Array.isArray(shape.children)) {
      return shape.children.some((child: any) => this.hasTaggedDescendants(child, taggedElements));
    }

    return false;
  }

  /**
   * Recursive helper function to process a single Penpot shape into a node object
   * @param shape Penpot shape object
   * @param taggedElements Map of tagged elements
   * @param isRootLevel Whether this is a root-level call (for handling untagged containers)
   * @returns Node object following the specified structure, or array of nodes, or null
   */
  private processShape(shape: any, taggedElements: Map<string, TagData>, isRootLevel: boolean = false): any | null {
    if (!shape) return null;

    // Check if this shape has a semantic tag
    const tagData = taggedElements.get(shape.id);

    if (!tagData) {
      // If no tag, only return children at root level to avoid breaking hierarchy
      if (isRootLevel && shape.children && Array.isArray(shape.children)) {
        const taggedChildren: any[] = [];

        shape.children.forEach((child: any) => {
          // Only process direct children that have tags
          if (taggedElements.has(child.id)) {
            const childResult = this.processShape(child, taggedElements, false);
            if (childResult) {
              taggedChildren.push(childResult);
            }
          }
        });

        return taggedChildren.length > 0 ? taggedChildren : null;
      }
      // At non-root levels, return null to maintain hierarchy
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

    // Process children recursively - maintain strict visual hierarchy
    const children: any[] = [];
    if (shape.children && Array.isArray(shape.children)) {
      // Sort children to maintain visual order (left-to-right, top-to-bottom)
      const sortedChildren = [...shape.children].sort((a: any, b: any) => {
        // Sort by vertical position first (top to bottom)
        if (a.y !== b.y) {
          return a.y - b.y;
        }
        // Then by horizontal position (left to right)
        return a.x - b.x;
      });

      // Process each direct child in visual order
      sortedChildren.forEach((child: any) => {
        // Set a flag on the child to indicate it's inside a flex/grid container
        child._isInFlexContainer = isFlexContainer;

        // Check if child has a tag first
        if (taggedElements.has(child.id)) {
          // Child has tag - process it normally as direct child
          const childResult = this.processShape(child, taggedElements, false);
          if (childResult) {
            children.push(childResult);
          }
        } else {
          // Child doesn't have tag - check if it has tagged descendants
          if (this.hasTaggedDescendants(child, taggedElements)) {
            // Process the child to get its tagged descendants
            const childResult = this.processShape(child, taggedElements, false);
            if (childResult) {
              if (Array.isArray(childResult)) {
                children.push(...childResult);
              } else {
                children.push(childResult);
              }
            }
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
    const allTaggedShapes: any[] = [];
    const rootShapes: any[] = [];

    // Collect all tagged shapes from the current page
    taggedShapeIds.forEach(shapeId => {
      const shape = penpot.currentPage?.getShapeById(shapeId);
      if (shape) {
        allTaggedShapes.push(shape);
      }
    });

    // Find root elements (elements that don't have a tagged parent)
    // This logic determines which elements should be processed as top-level nodes
    allTaggedShapes.forEach(shape => {
      let isRoot = true;
      let currentParent = shape.parent;

      // Check if any parent is also tagged
      while (currentParent && currentParent.id) {
        if (taggedElements.has(currentParent.id)) {
          isRoot = false;
          break;
        }
        currentParent = currentParent.parent;
      }

      if (isRoot) {
        rootShapes.push(shape);
      }
    });

    // Sort root shapes to maintain visual order from Penpot
    // This ensures the JSON output respects the visual hierarchy order
    rootShapes.sort((a, b) => {
      // If shapes have the same parent, sort by their index in parent's children
      if (a.parent && b.parent && a.parent.id === b.parent.id) {
        const parentChildren = a.parent.children || [];
        const indexA = parentChildren.findIndex((child: any) => child.id === a.id);
        const indexB = parentChildren.findIndex((child: any) => child.id === b.id);
        return indexA - indexB;
      }

      // For shapes with different parents or no parent, maintain current order
      return 0;
    });

    // Use the generateRichJson function to create the export data with only root shapes
    return this.generateRichJson(rootShapes, taggedElements);
  }
}