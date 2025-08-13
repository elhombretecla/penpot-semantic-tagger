import "./style.css";
import { TagData, StylesData, LayoutData, PluginMessage } from './types';
import { CodeGenerator, CodeGeneratorNode } from './services/code-generator';

// Declare Prism global for TypeScript
declare global {
  interface Window {
    Prism?: {
      highlightElement: (element: Element) => void;
    };
  }
}

const Prism = window.Prism;

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

// Auto-tagging elements
const autoTagEnabledCheckbox = document.getElementById("auto-tag-enabled") as HTMLInputElement;
const autoTagSelectionBtn = document.getElementById("auto-tag-selection")!;
const autoTagFeedback = document.getElementById("auto-tag-feedback")!;

// Code generation elements
const generateCodeBtn = document.getElementById("generate-code")!;
const htmlOutput = document.getElementById("html-output")!;
const cssOutput = document.getElementById("css-output")!;
const copyHtmlBtn = document.getElementById("copy-html")!;
const copyCssBtn = document.getElementById("copy-css")!;

// Initialize code generator
const codeGenerator = new CodeGenerator();

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
  
  // Auto-tagging functionality
  autoTagSelectionBtn.addEventListener("click", autoTagSelection);
  
  // Code generation functionality
  generateCodeBtn.addEventListener("click", generateCode);
  copyHtmlBtn.addEventListener("click", () => copyToClipboard("HTML"));
  copyCssBtn.addEventListener("click", () => copyToClipboard("CSS"));
  
  // Collapsible sections functionality
  setupCollapsibleSections();
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

// Auto-tagging functionality
function autoTagSelection() {
  if (!autoTagEnabledCheckbox.checked) {
    showAutoTagFeedback("Auto-tagging is disabled. Enable the option to continue.", "info");
    return;
  }

  if (currentSelection.length === 0) {
    showAutoTagFeedback("Please select at least one group or layer.", "error");
    return;
  }

  // Send message to main plugin to start auto-tagging
  const message: PluginMessage = {
    type: "auto-tag-selection",
    data: {
      elementIds: currentSelection.map(el => el.id)
    }
  };
  
  parent.postMessage(message, "*");
}

// Show feedback message for auto-tagging
function showAutoTagFeedback(message: string, type: "success" | "error" | "info") {
  autoTagFeedback.textContent = message;
  autoTagFeedback.className = `auto-tag-feedback ${type}`;
  autoTagFeedback.style.display = "block";
  
  // Hide after 5 seconds
  setTimeout(() => {
    autoTagFeedback.style.display = "none";
  }, 5000);
}

// Parse layer name for auto-tagging (unused - kept for reference)
/*
function parseLayerName(layerName: string): { tag: string; properties: Record<string, string> } | null {
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
*/

// Generate HTML and CSS code from tagged elements
function generateCode() {
  if (taggedElements.size === 0) {
    showCodeGenerationFeedback("No tagged elements found. Please tag some elements first.", "error");
    return;
  }

  try {
    // Request rich JSON data from the plugin
    const message: PluginMessage = {
      type: "generate-rich-json"
    };
    
    parent.postMessage(message, "*");
  } catch (error) {
    console.error("Error generating code:", error);
    showCodeGenerationFeedback("Error generating code. Please try again.", "error");
  }
}

// Process the rich JSON data and generate HTML/CSS
function processRichJsonForCodeGeneration(exportData: any) {
  try {
    if (!exportData || !exportData.tree || exportData.tree.length === 0) {
      showCodeGenerationFeedback("No valid data found for code generation.", "error");
      return;
    }

    // Convert the export data tree to CodeGeneratorNode format
    const codeNodes: CodeGeneratorNode[] = exportData.tree.map((node: any) => convertToCodeGeneratorNode(node));

    // Generate HTML and CSS
    const htmlCode = codeGenerator.generateHtml(codeNodes);
    const cssCode = codeGenerator.generateCss(codeNodes);

    // Update the UI with syntax highlighting
    updateCodeDisplay(htmlOutput, htmlCode, 'html');
    updateCodeDisplay(cssOutput, cssCode, 'css');

    showCodeGenerationFeedback(`✅ Code generated successfully! ${codeNodes.length} root element(s) processed.`, "success");
  } catch (error) {
    console.error("Error processing rich JSON:", error);
    showCodeGenerationFeedback("Error processing data for code generation.", "error");
  }
}

// Update code display with syntax highlighting
function updateCodeDisplay(element: HTMLElement, code: string, language: string) {
  const codeElement = element.querySelector('code');
  if (!codeElement) return;

  if (!code || code.trim() === '') {
    codeElement.textContent = `Generated ${language.toUpperCase()} will appear here...`;
    element.classList.add('empty');
    return;
  }

  element.classList.remove('empty');
  codeElement.textContent = code;
  codeElement.className = `language-${language}`;
  
  // Apply syntax highlighting if Prism is available
  if (Prism) {
    Prism.highlightElement(codeElement);
  }
}

// Convert export node to CodeGeneratorNode format
function convertToCodeGeneratorNode(node: any): CodeGeneratorNode {
  const codeNode: CodeGeneratorNode = {
    tag: node.tag,
    elementName: node.elementName,
    attributes: node.attributes || {},
    styles: node.styles || {},
    content: node.content
  };

  // Process children recursively
  if (node.children && Array.isArray(node.children) && node.children.length > 0) {
    codeNode.children = node.children.map((child: any) => convertToCodeGeneratorNode(child));
  }

  return codeNode;
}

// Copy content to clipboard
async function copyToClipboard(type: string) {
  // Get the actual code content from the display elements
  const element = type === "HTML" ? htmlOutput : cssOutput;
  const codeElement = element.querySelector('code');
  const actualContent = codeElement?.textContent || '';
  
  if (!actualContent || actualContent.trim() === '' || actualContent.includes('will appear here')) {
    showCodeGenerationFeedback(`No ${type} code to copy. Generate code first.`, "error");
    return;
  }

  try {
    await navigator.clipboard.writeText(actualContent);
    
    // Visual feedback
    const button = type === "HTML" ? copyHtmlBtn : copyCssBtn;
    const originalText = button.textContent;
    
    button.textContent = "Copied!";
    button.classList.add("copy-success");
    
    setTimeout(() => {
      button.textContent = originalText;
      button.classList.remove("copy-success");
    }, 2000);

    showCodeGenerationFeedback(`${type} code copied to clipboard!`, "success");
  } catch (error) {
    console.error("Error copying to clipboard:", error);
    
    // Fallback: create a temporary textarea for copying
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = actualContent;
    tempTextarea.style.position = 'fixed';
    tempTextarea.style.left = '-9999px';
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    
    try {
      document.execCommand('copy');
      showCodeGenerationFeedback(`${type} code copied to clipboard!`, "success");
    } catch (fallbackError) {
      showCodeGenerationFeedback("Unable to copy to clipboard. Please select and copy manually.", "error");
    } finally {
      document.body.removeChild(tempTextarea);
    }
  }
}

// Show feedback message for code generation
function showCodeGenerationFeedback(message: string, type: "success" | "error" | "info") {
  // Create or update feedback element
  let feedbackElement = document.getElementById("code-generation-feedback");
  
  if (!feedbackElement) {
    feedbackElement = document.createElement("div");
    feedbackElement.id = "code-generation-feedback";
    feedbackElement.className = "auto-tag-feedback"; // Reuse existing styles
    
    // Insert after the generate button
    const controlsSection = document.querySelector(".code-generation-controls");
    if (controlsSection) {
      controlsSection.appendChild(feedbackElement);
    }
  }
  
  feedbackElement.textContent = message;
  feedbackElement.className = `auto-tag-feedback ${type}`;
  feedbackElement.style.display = "block";
  
  // Hide after 5 seconds
  setTimeout(() => {
    feedbackElement.style.display = "none";
  }, 5000);
}

// Setup collapsible sections functionality
function setupCollapsibleSections() {
  const collapsibleHeaders = document.querySelectorAll('.collapsible-header');
  
  collapsibleHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const sectionName = header.getAttribute('data-section');
      const content = document.querySelector(`[data-content="${sectionName}"]`) as HTMLElement;
      const arrow = header.querySelector('.collapse-arrow') as HTMLElement;
      
      if (content && arrow) {
        const isCollapsed = content.classList.contains('collapsed');
        
        if (isCollapsed) {
          // Expand
          content.classList.remove('collapsed');
          arrow.classList.remove('collapsed');
        } else {
          // Collapse
          content.classList.add('collapsed');
          arrow.classList.add('collapsed');
        }
      }
    });
  });
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

// Format styles for display
function formatStyles(styles?: StylesData): string {
  if (!styles) return "";
  
  const relevantStyles = Object.entries(styles)
    .filter(([_, value]) => value && value !== "")
    .slice(0, 3); // Show only first 3 styles to avoid clutter
  
  if (relevantStyles.length === 0) return "";
  
  return relevantStyles
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
}

// Format layout for display
function formatLayout(layout?: LayoutData): string {
  if (!layout) return "";
  
  const relevantLayout = Object.entries(layout)
    .filter(([_, value]) => value && value !== "")
    .slice(0, 2); // Show only first 2 layout properties
  
  if (relevantLayout.length === 0) return "";
  
  return relevantLayout
    .map(([key, value]) => `${key}: ${value}`)
    .join("; ");
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
    const stylesText = formatStyles(tagData.styles);
    const layoutText = formatLayout(tagData.layout);
    const hasProperties = propertiesText.length > 0;
    const hasStyles = stylesText.length > 0;
    const hasLayout = layoutText.length > 0;
    const hasContent = tagData.content && tagData.content.trim().length > 0;
    const hasImageUrl = tagData.imageUrl && tagData.imageUrl.length > 0;
    
    // Build additional info sections
    let additionalInfo = "";
    
    if (hasContent) {
      const truncatedContent = tagData.content!.length > 30 
        ? tagData.content!.substring(0, 30) + "..." 
        : tagData.content!;
      additionalInfo += `<div class="tagged-element-content">📝 "${truncatedContent}"</div>`;
    }
    
    if (hasImageUrl) {
      additionalInfo += `<div class="tagged-element-image">🖼️ ${tagData.imageUrl}</div>`;
    }
    
    if (hasStyles) {
      additionalInfo += `<div class="tagged-element-styles">🎨 ${stylesText}</div>`;
    }
    
    if (hasLayout) {
      additionalInfo += `<div class="tagged-element-layout">📐 ${layoutText}</div>`;
    }
    
    item.innerHTML = `
      <div class="tagged-element-info">
        <div class="tagged-element-header">
          <span class="tagged-element-name">${tagData.elementName}</span>
          <span class="tagged-element-tag">&lt;${tagData.tag}&gt;</span>
          ${tagData.elementType ? `<span class="tagged-element-type">(${tagData.elementType})</span>` : ''}
        </div>
        ${hasProperties ? `<div class="tagged-element-properties">️${propertiesText}</div>` : ''}
        ${additionalInfo}
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
    // Auto-tag complete feedback
    else if (message.type === "auto-tag-complete") {
      const { taggedCount } = message.data;
      if (taggedCount > 0) {
        showAutoTagFeedback(`✅ ${taggedCount} elements were successfully tagged.`, "success");
      } else {
        showAutoTagFeedback("ℹ️ No elements with valid names were found to tag.", "info");
      }
      updateTaggedElementsList();
    }
    // Rich JSON data received for code generation
    else if (message.type === "rich-json-data") {
      processRichJsonForCodeGeneration(message.data);
    }
  }
});

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
