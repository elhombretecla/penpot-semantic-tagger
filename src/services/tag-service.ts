import { TagData } from '../types';
import { extractStyles } from '../utils/style-extractor';
import { extractContent } from '../utils/content-extractor';
import { analyzeLayout } from '../utils/layout-analyzer';

/**
 * Service for managing semantic tags
 */
export class TagService {
  private taggedElements: Map<string, TagData> = new Map();

  /**
   * Get all tagged elements
   */
  getTaggedElements(): Map<string, TagData> {
    return this.taggedElements;
  }

  /**
   * Get tagged element by ID
   */
  getTaggedElement(elementId: string): TagData | undefined {
    return this.taggedElements.get(elementId);
  }

  /**
   * Apply tag to elements
   */
  applyTagToElements(tag: string, properties: Record<string, string>, elementIds: string[]): TagData[] {
    const appliedTags: TagData[] = [];

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

        // Save to local map
        this.taggedElements.set(elementId, tagData);
        appliedTags.push(tagData);
      }
    });

    return appliedTags;
  }

  /**
   * Remove tag from elements
   */
  removeTagFromElements(elementIds: string[]): string[] {
    const removedIds: string[] = [];

    elementIds.forEach(elementId => {
      const element = penpot.currentPage?.getShapeById(elementId);
      if (element) {
        // Remove from local map
        this.taggedElements.delete(elementId);
        removedIds.push(elementId);
      }
    });

    return removedIds;
  }

  /**
   * Clear all tags
   */
  clearAllTags(): void {
    this.taggedElements.clear();
  }

  /**
   * Build tree structure from flat tagged elements (legacy function - kept for compatibility)
   */
  buildTreeStructure(): TagData[] {
    const tagsArray = Array.from(this.taggedElements.values());
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

  /**
   * Load existing tags (simplified version)
   */
  loadExistingTags(): TagData[] {
    try {
      // For now, just initialize empty - persistence will be handled differently
      this.taggedElements.clear();
      return Array.from(this.taggedElements.values());
    } catch (error) {
      console.warn("Error loading existing tags:", error);
      return [];
    }
  }

  /**
   * Save tags (simplified version)
   */
  saveTagsToFile(): void {
    try {
      // For now, just keep in memory during session
      console.log("Tags saved in memory:", this.taggedElements.size);
    } catch (error) {
      console.error("Error saving tags:", error);
    }
  }
}