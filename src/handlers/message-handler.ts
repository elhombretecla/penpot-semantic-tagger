import { PluginMessage } from '../types';
import { TagService } from '../services/tag-service';
import { ExportService } from '../services/export-service';
import { AutoTagService } from '../services/auto-tag-service';

/**
 * Handler for UI messages
 */
export class MessageHandler {
  constructor(
    private tagService: TagService,
    private exportService: ExportService,
    private autoTagService: AutoTagService
  ) { }

  /**
   * Handle incoming messages from UI
   */
  handleMessage(message: PluginMessage): void {
    switch (message.type) {
      case "get-selection":
        this.sendSelectionUpdate();
        break;

      case "apply-tag":
        this.handleApplyTag(message.data);
        break;

      case "remove-tag":
        this.handleRemoveTag(message.data);
        break;

      case "export-tags":
        this.handleExportTags();
        break;

      case "auto-tag-selection":
        this.handleAutoTagSelection(message.data);
        break;

      case "generate-rich-json":
        this.handleGenerateRichJson();
        break;

      default:
        console.warn("Unrecognized message:", message.type);
    }
  }

  /**
   * Send selection update to UI
   */
  private sendSelectionUpdate(): void {
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

  /**
   * Handle apply tag message
   */
  private handleApplyTag(data: any): void {
    if (data) {
      const appliedTags = this.tagService.applyTagToElements(
        data.tag,
        data.properties,
        data.elementIds
      );

      // Send confirmation for each applied tag
      appliedTags.forEach(tagData => {
        penpot.ui.sendMessage({
          source: "penpot",
          type: "tag-applied",
          data: tagData
        });
      });

      // Save to file
      this.tagService.saveTagsToFile();
    }
  }

  /**
   * Handle remove tag message
   */
  private handleRemoveTag(data: any): void {
    if (data) {
      const removedIds = this.tagService.removeTagFromElements(data.elementIds);

      // Send confirmation for each removed tag
      removedIds.forEach(elementId => {
        penpot.ui.sendMessage({
          source: "penpot",
          type: "tag-removed",
          data: { elementId }
        });
      });

      // Save to file
      this.tagService.saveTagsToFile();
    }
  }

  /**
   * Handle export tags message
   */
  private handleExportTags(): void {
    const exportData = this.exportService.exportTags(this.tagService.getTaggedElements());

    // Send data to UI to handle download
    penpot.ui.sendMessage({
      source: "penpot",
      type: "export-data",
      data: exportData
    });
  }

  /**
   * Handle auto-tag selection message
   */
  private handleAutoTagSelection(data: any): void {
    if (data && data.elementIds) {
      const result = this.autoTagService.autoTagElements(
        data.elementIds,
        this.tagService.getTaggedElements()
      );

      // Send confirmation for each applied tag
      result.appliedTags.forEach(tagData => {
        penpot.ui.sendMessage({
          source: "penpot",
          type: "tag-applied",
          data: tagData
        });
      });

      // Send completion message
      penpot.ui.sendMessage({
        source: "penpot",
        type: "auto-tag-complete",
        data: {
          taggedCount: result.taggedCount,
          processedElements: result.processedElements
        }
      });

      // Save to file
      this.tagService.saveTagsToFile();
    }
  }

  /**
   * Handle generate rich JSON message for code generation
   */
  private handleGenerateRichJson(): void {
    const taggedElements = this.tagService.getTaggedElements();
    
    if (taggedElements.size === 0) {
      penpot.ui.sendMessage({
        source: "penpot",
        type: "rich-json-data",
        data: { metadata: {}, tree: [] }
      });
      return;
    }

    // Get all tagged shapes from the current page
    const taggedShapeIds = Array.from(taggedElements.keys());
    const selectedShapes: any[] = [];

    taggedShapeIds.forEach(shapeId => {
      const shape = penpot.currentPage?.getShapeById(shapeId);
      if (shape) {
        selectedShapes.push(shape);
      }
    });

    // Generate rich JSON using the export service
    const exportData = this.exportService.generateRichJson(selectedShapes, taggedElements);

    // Send the rich JSON data to UI for code generation
    penpot.ui.sendMessage({
      source: "penpot",
      type: "rich-json-data",
      data: exportData
    });
  }
}