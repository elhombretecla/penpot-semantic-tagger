import { TagService } from '../services/tag-service';

/**
 * Handler for Penpot events
 */
export class EventHandler {
  constructor(private tagService: TagService) {}

  /**
   * Initialize event listeners
   */
  initializeEventListeners(): void {
    // Listen for selection changes
    penpot.on("selectionchange", () => {
      this.sendSelectionUpdate();
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
      this.handlePageChange();
    });

    // Listen when file is closed (to clean state)
    penpot.on("filechange", () => {
      this.handleFileChange();
    });
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
   * Handle page change event
   */
  private handlePageChange(): void {
    const loadedTags = this.tagService.loadExistingTags();
    
    // Send loaded data to UI
    penpot.ui.sendMessage({
      source: "penpot",
      type: "tags-loaded",
      data: loadedTags
    });

    this.sendSelectionUpdate();
  }

  /**
   * Handle file change event
   */
  private handleFileChange(): void {
    this.tagService.clearAllTags();
    const loadedTags = this.tagService.loadExistingTags();
    
    // Send loaded data to UI
    penpot.ui.sendMessage({
      source: "penpot",
      type: "tags-loaded",
      data: loadedTags
    });

    this.sendSelectionUpdate();
  }
}