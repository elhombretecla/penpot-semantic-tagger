/**
 * CodeGenerator Service
 * Converts hierarchical JSON tree structure into clean HTML and CSS code
 */

export interface CodeGeneratorNode {
  tag: string;
  elementName: string;
  attributes?: Record<string, string>;
  styles?: Record<string, string>;
  layout?: Record<string, string>;
  content?: string;
  children?: CodeGeneratorNode[];
}

export class CodeGenerator {
  /**
   * Generate HTML string from JSON tree
   * @param jsonTree Array of root nodes from the JSON export
   * @returns Formatted HTML string
   */
  generateHtml(jsonTree: CodeGeneratorNode[]): string {
    if (!jsonTree || jsonTree.length === 0) {
      return '';
    }

    const htmlNodes = jsonTree.map(node => this.generateHtmlNode(node, 0));
    return htmlNodes.join('\n');
  }

  /**
   * Recursive helper to generate HTML for a single node
   * @param node Single node object
   * @param depth Current nesting depth for indentation
   * @returns HTML string for the node and its children
   */
  private generateHtmlNode(node: CodeGeneratorNode, depth: number = 0): string {
    if (!node || !node.tag) {
      return '';
    }

    const indent = '  '.repeat(depth);
    const childIndent = '  '.repeat(depth + 1);

    // Build attributes string
    const attributesString = this.buildAttributesString(node.attributes);
    
    // Get content (text content if any)
    const content = node.content ? node.content.trim() : '';
    
    // Process children recursively
    const childrenHtml = node.children && node.children.length > 0
      ? node.children.map(child => this.generateHtmlNode(child, depth + 1)).join('\n')
      : '';

    // Build the complete HTML element
    const openTag = `${indent}<${node.tag}${attributesString ? ' ' + attributesString : ''}>`;
    const closeTag = `${indent}</${node.tag}>`;
    
    // Handle different content scenarios
    if (content && childrenHtml) {
      // Has both content and children
      return `${openTag}\n${childIndent}${content}\n${childrenHtml}\n${closeTag}`;
    } else if (content) {
      // Only has content
      if (content.length < 50) {
        // Short content on same line
        return `${openTag}${content}${closeTag.trim()}`;
      } else {
        // Long content on separate lines
        return `${openTag}\n${childIndent}${content}\n${closeTag}`;
      }
    } else if (childrenHtml) {
      // Only has children
      return `${openTag}\n${childrenHtml}\n${closeTag}`;
    } else {
      // Self-closing or empty element
      return `${openTag}${closeTag.trim()}`;
    }
  }

  /**
   * Build HTML attributes string from attributes object
   * @param attributes Object containing attribute key-value pairs
   * @returns Formatted attributes string
   */
  private buildAttributesString(attributes?: Record<string, string>): string {
    if (!attributes || Object.keys(attributes).length === 0) {
      return '';
    }

    return Object.entries(attributes)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        // Convert className to class for standard HTML
        const htmlKey = key === 'className' ? 'class' : key;
        return `${htmlKey}="${this.escapeHtml(value)}"`;
      })
      .join(' ');
  }

  /**
   * Generate CSS string from JSON tree
   * @param jsonTree Array of root nodes from the JSON export
   * @returns Formatted CSS string
   */
  generateCss(jsonTree: CodeGeneratorNode[]): string {
    if (!jsonTree || jsonTree.length === 0) {
      return '';
    }

    const cssRulesSet = new Set<string>();
    
    jsonTree.forEach(node => {
      this.collectCssRules(node, cssRulesSet);
    });

    return Array.from(cssRulesSet).join('\n\n');
  }

  /**
   * Collect unique CSS rules from node tree to avoid duplicates
   * @param node Single node object
   * @param cssRulesSet Set to store unique CSS rules
   */
  private collectCssRules(node: CodeGeneratorNode, cssRulesSet: Set<string>): void {
    if (!node) {
      return;
    }

    // Generate CSS for current node
    const selector = this.generateCssSelector(node);
    const rules = this.generateCssProperties(node);

    if (selector && rules) {
      const cssBlock = `${selector} {\n${this.indentContent(rules)}\n}`;
      cssRulesSet.add(cssBlock);
    }

    // Process children recursively
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        this.collectCssRules(child, cssRulesSet);
      });
    }
  }

  /**
   * Generate CSS selector for a node
   * @param node Node object
   * @returns CSS selector string
   */
  private generateCssSelector(node: CodeGeneratorNode): string {
    // Priority: className from attributes, then sanitized elementName
    if (node.attributes?.className) {
      return `.${node.attributes.className}`;
    }
    
    if (node.elementName) {
      const sanitizedName = this.sanitizeClassName(node.elementName);
      return `.${sanitizedName}`;
    }

    // Fallback to tag name
    return node.tag;
  }

  /**
   * Generate CSS properties from styles and layout objects
   * @param node Node object
   * @returns CSS properties string
   */
  private generateCssProperties(node: CodeGeneratorNode): string {
    const properties: string[] = [];

    // Process styles object
    if (node.styles && Object.keys(node.styles).length > 0) {
      Object.entries(node.styles).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const cssProperty = this.camelToKebab(key);
          properties.push(`${cssProperty}: ${value};`);
        }
      });
    }

    // Process layout object (merge with styles)
    if (node.layout && Object.keys(node.layout).length > 0) {
      Object.entries(node.layout).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          const cssProperty = this.camelToKebab(key);
          properties.push(`${cssProperty}: ${value};`);
        }
      });
    }

    return properties.join('\n');
  }

  /**
   * Convert camelCase to kebab-case for CSS properties
   * @param camelCase CamelCase string
   * @returns kebab-case string
   */
  private camelToKebab(camelCase: string): string {
    return camelCase.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  }

  /**
   * Sanitize element name to create valid CSS class name
   * @param elementName Element name string
   * @returns Sanitized class name
   */
  private sanitizeClassName(elementName: string): string {
    return elementName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with single
  }

  /**
   * Escape HTML special characters
   * @param text Text to escape
   * @returns Escaped text
   */
  private escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  /**
   * Add indentation to content
   * @param content Content to indent
   * @param spaces Number of spaces for indentation
   * @returns Indented content
   */
  private indentContent(content: string, spaces: number = 2): string {
    const indent = ' '.repeat(spaces);
    return content
      .split('\n')
      .map(line => line.trim() ? indent + line : line)
      .join('\n');
  }


}