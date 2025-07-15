import "./style.css";

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

// Global plugin state
let currentSelection: any[] = [];
let taggedElements: Map<string, TagData> = new Map();

// Set initial theme
const searchParams = new URLSearchParams(window.location.search);
document.body.dataset.theme = searchParams.get("theme") ?? "light";

// DOM elements
const selectionStatus = document.getElementById("selection-status")!;
const taggingSection = document.getElementById("tagging-section")!;
const elementName = document.getElementById("element-name")!;
const tagSelect = document.getElementById("tag-select") as HTMLSelectElement;
const customTagInput = document.getElementById("custom-tag") as HTMLInputElement;
const propertiesList = document.getElementById("properties-list")!;
const addPropertyBtn = document.getElementById("add-property")!;
const applyTagBtn = document.getElementById("apply-tag")!;
const removeTagBtn = document.getElementById("remove-tag")!;
const taggedElementsList = document.getElementById("tagged-elements")!;
const exportTagsBtn = document.getElementById("export-tags")!;

// Initialization
function init() {
  setupEventListeners();
  updateUI();
  requestSelectionUpdate();
}

// Set up event listeners
function setupEventListeners() {
  // Button to add properties
  addPropertyBtn.addEventListener("click", () => addPropertyField());
  
  // Button to apply tag
  applyTagBtn.addEventListener("click", applyTag);
  
  // Button to remove tag
  removeTagBtn.addEventListener("click", removeTag);
  
  // Button to export tags
  exportTagsBtn.addEventListener("click", exportTags);
  
  // Tag selector change
  tagSelect.addEventListener("change", onTagSelectChange);
  
  // Custom input
  customTagInput.addEventListener("input", onCustomTagInput);
}

// Handle tag selector changes
function onTagSelectChange() {
  if (tagSelect.value) {
    customTagInput.value = "";
    updatePropertiesForTag(tagSelect.value);
  }
}

// Handle custom input
function onCustomTagInput() {
  if (customTagInput.value) {
    tagSelect.value = "";
  }
}

// Update suggested properties based on tag
function updatePropertiesForTag(tag: string) {
  // Clear existing properties
  propertiesList.innerHTML = "";
  
  // Get suggested properties based on tag type
  const suggestedProperties = getSuggestedProperties(tag);
  
  suggestedProperties.forEach(prop => {
    addPropertyField(prop.key, prop.value, prop.placeholder);
  });
}

// Get suggested properties for a tag
function getSuggestedProperties(tag: string): Array<{key: string, value: string, placeholder: string}> {
  const suggestions: Record<string, Array<{key: string, value: string, placeholder: string}>> = {
    "button": [
      { key: "type", value: "button", placeholder: "button, submit, reset" },
      { key: "onClick", value: "", placeholder: "handleClick" }
    ],
    "input": [
      { key: "type", value: "text", placeholder: "text, password, email, number" },
      { key: "placeholder", value: "", placeholder: "Enter your text..." },
      { key: "required", value: "true", placeholder: "true, false" }
    ],
    "a": [
      { key: "href", value: "", placeholder: "https://example.com" },
      { key: "target", value: "_blank", placeholder: "_blank, _self" }
    ],
    "img": [
      { key: "src", value: "", placeholder: "path/image.jpg" },
      { key: "alt", value: "", placeholder: "Image description" }
    ],
    "MuiButton": [
      { key: "variant", value: "contained", placeholder: "contained, outlined, text" },
      { key: "color", value: "primary", placeholder: "primary, secondary, error" },
      { key: "onClick", value: "", placeholder: "handleClick" }
    ],
    "MuiTextField": [
      { key: "label", value: "", placeholder: "Field label" },
      { key: "variant", value: "outlined", placeholder: "outlined, filled, standard" },
      { key: "required", value: "false", placeholder: "true, false" }
    ],
    "ChakraButton": [
      { key: "colorScheme", value: "blue", placeholder: "blue, red, green, purple" },
      { key: "size", value: "md", placeholder: "xs, sm, md, lg" },
      { key: "onClick", value: "", placeholder: "handleClick" }
    ]
  };
  
  return suggestions[tag] || [
    { key: "className", value: "", placeholder: "css-class-name" }
  ];
}

// Add property field
function addPropertyField(key: string = "", value: string = "", placeholder: string = "") {
  const propertyItem = document.createElement("div");
  propertyItem.className = "property-item";
  
  propertyItem.innerHTML = `
    <input type="text" class="input property-key" placeholder="Property" value="${key}">
    <input type="text" class="input property-value" placeholder="${placeholder || 'Value'}" value="${value}">
    <button type="button" data-appearance="secondary" title="Remove property" class="btn-remove">-</button>
  `;
  
  // Event listener to remove property
  propertyItem.querySelector(".btn-remove")?.addEventListener("click", () => {
    propertyItem.remove();
  });
  
  propertiesList.appendChild(propertyItem);
}

// Apply tag to selected element
function applyTag() {
  if (currentSelection.length === 0) {
    alert("No elements selected");
    return;
  }
  
  const tag = customTagInput.value.trim() || tagSelect.value;
  if (!tag) {
    alert("Select or enter a tag");
    return;
  }
  
  // Collect properties
  const properties: Record<string, string> = {};
  const propertyItems = propertiesList.querySelectorAll(".property-item");
  
  propertyItems.forEach(item => {
    const keyInput = item.querySelector(".property-key") as HTMLInputElement;
    const valueInput = item.querySelector(".property-value") as HTMLInputElement;
    
    if (keyInput && valueInput && keyInput.value.trim() && valueInput.value.trim()) {
      properties[keyInput.value.trim()] = valueInput.value.trim();
    }
  });
  
  // Send message to main plugin
  const message: PluginMessage = {
    type: "apply-tag",
    data: {
      tag,
      properties,
      elementIds: currentSelection.map(el => el.id)
    }
  };
  
  parent.postMessage(message, "*");
}

// Remove tag from selected element
function removeTag() {
  if (currentSelection.length === 0) {
    alert("No elements selected");
    return;
  }
  
  const message: PluginMessage = {
    type: "remove-tag",
    data: {
      elementIds: currentSelection.map(el => el.id)
    }
  };
  
  parent.postMessage(message, "*");
}

// Remove tag from specific element (from tagged elements list)
function removeTagFromElement(elementId: string) {
  const message: PluginMessage = {
    type: "remove-tag",
    data: {
      elementIds: [elementId]
    }
  };
  
  parent.postMessage(message, "*");
}

// Export all tags as JSON
function exportTags() {
  const message: PluginMessage = {
    type: "export-tags"
  };
  
  parent.postMessage(message, "*");
}

// Request selection update
function requestSelectionUpdate() {
  parent.postMessage({ type: "get-selection" }, "*");
}

// Show JSON data for manual copying
function downloadJsonFile(data: any) {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    
    // Create modal to show JSON
    const modal = document.createElement("div");
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      box-sizing: border-box;
    `;
    
    const content = document.createElement("div");
    content.style.cssText = `
      background: var(--db-primary);
      border-radius: 8px;
      padding: 20px;
      overflow: auto;
      height: -webkit-fill-available;
      width: -webkit-fill-available;
    `;
    
    content.innerHTML = `
      <h2 style="margin-top: 0;">Tag Export</h2>
      <p style="margin-bottom: 16px;">Copy the following JSON and save it to a .json file:</p>
      <textarea readonly style="
        width: 100%;
        height: 80%;
        font-family: monospace;
        font-size: 14px;
        background: var(--db-secondary);
        border-radius: 4px;
        padding: 10px;
        color: var(--app-blue);
        resize: vertical;
        box-sizing: border-box;
      ">${jsonString}</textarea>
      <div style="margin-top: 15px; display: flex; gap: 10px;">
        <button id="copy-json" data-appearance="primary">Copy to Clipboard</button>
        <button id="close-modal" data-appearance="secondary">Close</button>
      </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Event listeners
    const textarea = content.querySelector("textarea")!;
    const copyBtn = content.querySelector("#copy-json")!;
    const closeBtn = content.querySelector("#close-modal")!;
    
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(jsonString);
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy to Clipboard";
        }, 2000);
      } catch (error) {
        // Fallback for browsers that don't support clipboard API
        textarea.select();
        document.execCommand('copy');
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy to Clipboard";
        }, 2000);
      }
    });
    
    closeBtn.addEventListener("click", () => {
      document.body.removeChild(modal);
    });
    
    // Close with Escape
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.body.removeChild(modal);
        document.removeEventListener("keydown", handleEscape);
      }
    };
    document.addEventListener("keydown", handleEscape);
    
    // Automatically select all text
    textarea.select();
    
  } catch (error) {
    console.error("Error showing JSON:", error);
    alert("Error exporting tags");
  }
}

// Update user interface
function updateUI() {
  if (currentSelection.length === 0) {
    selectionStatus.textContent = "Select an element on the canvas to get started";
    taggingSection.style.display = "none";
  } else {
    const element = currentSelection[0];
    selectionStatus.textContent = `${currentSelection.length} element(s) selected`;
    elementName.textContent = element.name || "Unnamed";
    taggingSection.style.display = "block";
    
    // Load existing tag if available
    loadExistingTag(element.id);
  }
  
  updateTaggedElementsList();
}

// Load existing tag for an element
function loadExistingTag(elementId: string) {
  const existingTag = taggedElements.get(elementId);
  
  if (existingTag) {
    // Load tag
    if (isStandardTag(existingTag.tag)) {
      tagSelect.value = existingTag.tag;
      customTagInput.value = "";
    } else {
      tagSelect.value = "";
      customTagInput.value = existingTag.tag;
    }
    
    // Load properties
    propertiesList.innerHTML = "";
    Object.entries(existingTag.properties).forEach(([key, value]) => {
      addPropertyField(key, value);
    });
  } else {
    // Clear form
    tagSelect.value = "";
    customTagInput.value = "";
    propertiesList.innerHTML = "";
  }
}

// Check if it's a standard tag
function isStandardTag(tag: string): boolean {
  const options = Array.from(tagSelect.options);
  return options.some(option => option.value === tag);
}

// Format properties for display
function formatProperties(properties: Record<string, string>): string {
  const entries = Object.entries(properties);
  if (entries.length === 0) return "";
  
  return entries
    .map(([key, value]) => `${key}="${value}"`)
    .join(" ");
}

// Update tagged elements list
function updateTaggedElementsList() {
  if (taggedElements.size === 0) {
    taggedElementsList.innerHTML = '<div class="empty-state">No tagged elements</div>';
    return;
  }
  
  taggedElementsList.innerHTML = "";
  
  taggedElements.forEach((tagData) => {
    const item = document.createElement("div");
    item.className = "tagged-element-item";
    
    const propertiesText = formatProperties(tagData.properties);
    const hasProperties = propertiesText.length > 0;
    
    item.innerHTML = `
      <div class="tagged-element-info">
        <div class="tagged-element-header">
          <span class="tagged-element-name">${tagData.elementName}</span>
          <span class="tagged-element-tag">${tagData.tag}</span>
        </div>
        ${hasProperties ? `<div class="tagged-element-properties">${propertiesText}</div>` : ''}
      </div>
      <button type="button" class="remove-tag-btn" data-appearance="primary" data-variant="destructive" title="Remove tag" data-element-id="${tagData.elementId}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.5">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14zM10 11v6M14 11v6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        </svg>
      </button>
    `;
    
    // Add event listener for the remove button
    const removeBtn = item.querySelector('.remove-tag-btn');
    removeBtn?.addEventListener('click', () => {
      removeTagFromElement(tagData.elementId);
    });
    
    taggedElementsList.appendChild(item);
  });
}

// Listen for messages from main plugin
window.addEventListener("message", (event) => {
  const message = event.data;
  
  if (message.source === "penpot") {
    // Theme change
    if (message.type === "themechange") {
      document.body.dataset.theme = message.theme;
    }
    // Selection update
    else if (message.type === "selection-update") {
      currentSelection = message.data || [];
      updateUI();
    }
    // Tag applied confirmation
    else if (message.type === "tag-applied") {
      const { elementId, elementName, tag, properties } = message.data;
      taggedElements.set(elementId, { tag, properties, elementId, elementName });
      updateTaggedElementsList();
    }
    // Tag removed confirmation
    else if (message.type === "tag-removed") {
      const { elementId } = message.data;
      taggedElements.delete(elementId);
      updateTaggedElementsList();
      updateUI(); // Update form
    }
    // Loaded tags data
    else if (message.type === "tags-loaded") {
      taggedElements.clear();
      message.data.forEach((tagData: TagData) => {
        taggedElements.set(tagData.elementId, tagData);
      });
      updateTaggedElementsList();
      updateUI();
    }
    // Export data received
    else if (message.type === "export-data") {
      downloadJsonFile(message.data);
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
