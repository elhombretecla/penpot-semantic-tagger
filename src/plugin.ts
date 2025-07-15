// Interfaces for the tagging system
interface TagData {
  tag: string;
  properties: Record<string, string>;
  elementId: string;
  elementName: string;
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

// Apply tag to selected elements
function applyTagToElements(tag: string, properties: Record<string, string>, elementIds: string[]) {
  elementIds.forEach(elementId => {
    const element = penpot.currentPage?.getShapeById(elementId);
    if (element) {
      // Create tag data
      const tagData: TagData = {
        tag,
        properties,
        elementId,
        elementName: element.name || "Unnamed"
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

// Export tags as JSON
function exportTags() {
  const tagsArray = Array.from(taggedElements.values());

  // Create more complete export structure
  const exportData = {
    metadata: {
      pluginName: "Semantic Tagging Plugin",
      version: "1.0.0",
      exportDate: new Date().toISOString(),
      fileName: penpot.currentFile?.name || "Untitled",
      totalElements: tagsArray.length
    },
    elements: tagsArray.map(tagData => {
      const element = penpot.currentPage?.getShapeById(tagData.elementId);
      return {
        ...tagData,
        elementType: element?.type || "unknown",
        position: element ? { x: element.x, y: element.y } : null,
        size: element ? { width: element.width, height: element.height } : null
      };
    })
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
