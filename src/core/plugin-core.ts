import { PLUGIN_CONFIG } from './constants';
import { PluginMessage } from '../types';
import { TagService } from '../services/tag-service';
import { ExportService } from '../services/export-service';
import { AutoTagService } from '../services/auto-tag-service';
import { MessageHandler } from '../handlers/message-handler';
import { EventHandler } from '../handlers/event-handler';

/**
 * Core plugin class that orchestrates all services and handlers
 */
export class PluginCore {
  private tagService: TagService;
  private exportService: ExportService;
  private autoTagService: AutoTagService;
  private messageHandler: MessageHandler;
  private eventHandler: EventHandler;

  constructor() {
    // Initialize services
    this.tagService = new TagService();
    this.exportService = new ExportService();
    this.autoTagService = new AutoTagService();

    // Initialize handlers
    this.messageHandler = new MessageHandler(
      this.tagService,
      this.exportService,
      this.autoTagService
    );
    this.eventHandler = new EventHandler(this.tagService);
  }

  /**
   * Initialize the plugin
   */
  initialize(): void {
    // Open the plugin interface
    penpot.ui.open("Semantic Tagging", `?theme=${penpot.theme}`, {
      width: PLUGIN_CONFIG.width,
      height: PLUGIN_CONFIG.height
    });

    // Load existing tags
    this.loadExistingTags();

    // Send initial selection update
    this.sendSelectionUpdate();

    // Set up event listeners
    this.eventHandler.initializeEventListeners();

    // Set up message handler
    penpot.ui.onMessage((message: any) => {
      this.messageHandler.handleMessage(message as PluginMessage);
    });
  }

  /**
   * Load existing tags and send to UI
   */
  private loadExistingTags(): void {
    const loadedTags = this.tagService.loadExistingTags();

    // Send loaded data to UI
    penpot.ui.sendMessage({
      source: "penpot",
      type: "tags-loaded",
      data: loadedTags
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
}