import { TagData } from '../types';
import { extractStyles } from '../utils/style-extractor';
import { extractContent } from '../utils/content-extractor';
import { analyzeLayout } from '../utils/layout-analyzer';

/**
 * Service for auto-tagging functionality
 */
export class AutoTagService {
  /**
   * Auto-tag elements based on layer names
   */
  autoTagElements(elementIds: string[], taggedElements: Map<string, TagData>): {
    taggedCount: number;
    processedElements: string[];
    appliedTags: TagData[];
  } {
    let taggedCount = 0;
    let processedElements: string[] = [];
    let appliedTags: TagData[] = [];

    // Recursive function to process each node
    const processNode = (element: any): void => {
      if (!element) return;

      const layerName = element.name || '';
      const parsedTag = this.parseLayerNameForAutoTag(layerName);
      
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
        appliedTags.push(tagData);
        taggedCount++;
      }

      // Process children recursively
      if (element.children && Array.isArray(element.children)) {
        element.children.forEach((child: any) => processNode(child));
      }
    };

    // Process each selected element
    elementIds.forEach(elementId => {
      const element = penpot.currentPage?.getShapeById(elementId);
      if (element) {
        processNode(element);
      }
    });

    return {
      taggedCount,
      processedElements,
      appliedTags
    };
  }

  /**
   * Parse layer name for auto-tagging
   */
  private parseLayerNameForAutoTag(layerName: string): { tag: string; properties: Record<string, string> } | null {
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
}