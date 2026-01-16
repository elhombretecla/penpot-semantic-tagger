/**
 * CodeGenerator Service
 * Converts hierarchical JSON tree structure into clean HTML and CSS code
 * 
 * Features:
 * - Smart CSS scoping by board: Automatically detects CSS selector collisions
 *   between boards and applies scoping only when necessary to avoid conflicts.
 * - Local scope collision resolution: When elements share the same selector but
 *   have different styles within the same board, the plugin scopes by ancestor
 *   or auto-generates unique identifiers to preserve all styles.
 */

export interface CodeGeneratorNode {
  tag: string;
  elementName: string;
  elementId?: string;
  elementType?: string;
  attributes?: Record<string, string>;
  styles?: Record<string, string>;
  layout?: Record<string, string>;
  content?: string;
  children?: CodeGeneratorNode[];
}

/**
 * Represents a selector in the ancestor chain that can be used for scoping
 */
interface AncestorSelector {
  elementId: string;
  selector: string;       // e.g., "#my-id" or ".my-class"
  needsInjection: boolean; // true if we need to inject this selector into HTML
}

/**
 * Internal interface to track CSS rules with full context for collision detection
 * Includes both board-level and local (ancestor) context for smart scoping
 */
interface CssRuleContext {
  elementId: string;              // The element this rule belongs to
  baseSelector: string;           // The CSS selector for this element (e.g., ".button")
  cssBody: string;                // The CSS properties as a string
  cssSignature: string;           // Normalized signature for style comparison
  boardScope: string | null;      // Board-level scope selector
  boardElementId: string | null;  // Board element ID
  ancestorChain: AncestorSelector[]; // Chain of ancestor selectors (closest first)
}

/**
 * Tracks which boards need their IDs injected into HTML due to CSS collisions
 */
interface BoardScopeInfo {
  elementId: string;
  scopeSelector: string;
  needsInjection: boolean; // true if we generated the id and need to inject it
}

/**
 * Tracks which elements need IDs/classes injected for local scope disambiguation
 */
interface ElementInjectionInfo {
  elementId: string;
  injectedSelector: string;  // e.g., "#el-abc123" or ".auto-abc123"
  injectedAttribute: 'id' | 'className';
  injectedValue: string;     // e.g., "el-abc123"
}

export class CodeGenerator {
  /**
   * Tracks boards that need ID injection due to CSS collisions between boards
   * This is populated during CSS generation and used during HTML generation
   */
  private boardsNeedingInjection: Map<string, BoardScopeInfo> = new Map();

  /**
   * Tracks individual elements that need ID/class injection due to local scope collisions
   * (same selector, different styles within the same board)
   */
  private elementsNeedingInjection: Map<string, ElementInjectionInfo> = new Map();

  /**
   * Cache of node data for ancestor lookups during CSS emission
   */
  private nodeDataCache: Map<string, CodeGeneratorNode> = new Map();

  /**
   * Generate HTML string from JSON tree
   * Note: Call generateCss() first if you need smart scoping, as it populates
   * the boardsNeedingInjection map used to determine which boards need IDs.
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

    // Build attributes, potentially injecting IDs/classes for CSS scoping
    const attributes = this.getAttributesWithInjection(node);
    const attributesString = this.buildAttributesString(attributes);
    
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
   * Get attributes for a node, injecting IDs/classes if needed for CSS scoping
   * Handles both board-level injection and element-level (local scope) injection
   */
  private getAttributesWithInjection(node: CodeGeneratorNode): Record<string, string> | undefined {
    if (!node.elementId) {
      return node.attributes;
    }

    let attributes = node.attributes;
    let needsClone = false;

    // Check if this board needs ID injection (board-level collision)
    const boardInfo = this.boardsNeedingInjection.get(node.elementId);
    if (boardInfo && boardInfo.needsInjection) {
      if (!needsClone) {
        attributes = { ...node.attributes };
        needsClone = true;
      }
      const generatedId = boardInfo.scopeSelector.replace('#', '');
      attributes!.id = generatedId;
    }

    // Check if this element needs injection (local scope collision)
    const elementInfo = this.elementsNeedingInjection.get(node.elementId);
    if (elementInfo) {
      if (!needsClone) {
        attributes = { ...node.attributes };
        needsClone = true;
      }
      if (elementInfo.injectedAttribute === 'id') {
        attributes!.id = elementInfo.injectedValue;
      } else {
        // Append to existing className or set new
        const existingClass = attributes!.className || '';
        attributes!.className = existingClass 
          ? `${existingClass} ${elementInfo.injectedValue}`
          : elementInfo.injectedValue;
      }
    }
    
    return attributes;
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
   * Generate CSS string from JSON tree with smart scoping
   * 
   * Smart scoping handles two types of collisions:
   * 1. Board-level: Same selector in different boards → prefix with board scope
   * 2. Local-level: Same selector with different styles in same board → 
   *    prefix with ancestor scope or inject unique identifier
   * 
   * If no collisions exist, CSS is output unchanged.
   * 
   * @param jsonTree Array of root nodes from the JSON export
   * @returns Formatted CSS string
   */
  generateCss(jsonTree: CodeGeneratorNode[]): string {
    if (!jsonTree || jsonTree.length === 0) {
      return '';
    }

    // Reset all injection tracking for new generation
    this.boardsNeedingInjection.clear();
    this.elementsNeedingInjection.clear();
    this.nodeDataCache.clear();

    // Phase 1: Build node cache for ancestor lookups
    jsonTree.forEach(node => this.cacheNodeData(node));

    // Phase 2: Collect all CSS rules with full context (board + ancestors)
    const cssRules: CssRuleContext[] = [];
    
    jsonTree.forEach(node => {
      // Each root node is treated as a board (frame/artboard)
      const boardScope = this.calculateBoardScopeInfo(node);
      this.collectCssRulesWithFullContext(node, cssRules, boardScope, []);
    });

    // Phase 3: Group rules by baseSelector
    const selectorGroups = this.groupRulesBySelector(cssRules);
    
    // Phase 4: Detect board-level collisions (same selector in different boards)
    const boardCollidingSelectors = this.detectBoardCollisions(selectorGroups);

    // Phase 5: Detect local-level collisions (same selector, different styles, same board)
    const localCollisions = this.detectLocalCollisions(selectorGroups);

    // Phase 6: Mark boards that need ID injection for board-level collisions
    this.markBoardsForInjection(cssRules, boardCollidingSelectors);

    // Phase 7: Resolve local collisions and mark elements for injection if needed
    const resolvedLocalScopes = this.resolveLocalCollisions(localCollisions);

    // Phase 8: Emit final CSS with all scoping applied
    return this.emitFinalCssWithLocalScoping(
      selectorGroups, 
      boardCollidingSelectors, 
      resolvedLocalScopes
    );
  }

  /**
   * Cache all nodes for ancestor lookups during CSS emission
   */
  private cacheNodeData(node: CodeGeneratorNode): void {
    if (node.elementId) {
      this.nodeDataCache.set(node.elementId, node);
    }
    if (node.children) {
      node.children.forEach(child => this.cacheNodeData(child));
    }
  }

  /**
   * Compute a normalized signature for CSS body to compare styles
   * This allows detecting when two elements have different styles
   */
  private computeCssSignature(cssBody: string): string {
    // Normalize: sort properties, trim whitespace, lowercase
    return cssBody
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .sort()
      .join('|')
      .toLowerCase();
  }

  /**
   * Get the selector for a node (id or className) if available
   */
  private getNodeSelector(node: CodeGeneratorNode): AncestorSelector | null {
    if (!node.elementId) return null;

    // Priority 1: existing id
    if (node.attributes?.id) {
      return {
        elementId: node.elementId,
        selector: `#${node.attributes.id}`,
        needsInjection: false
      };
    }

    // Priority 2: existing className
    if (node.attributes?.className) {
      const classes = node.attributes.className.split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        return {
          elementId: node.elementId,
          selector: `.${classes.join('.')}`,
          needsInjection: false
        };
      }
    }

    return null;
  }

  /**
   * Determine the scope selector for a board node
   * Priority: 1) existing id, 2) existing className, 3) generated id
   */
  private calculateBoardScopeInfo(node: CodeGeneratorNode): BoardScopeInfo | null {
    // Check if this is a board (frame type at root level)
    if (!this.isBoard(node)) {
      return null;
    }

    const elementId = node.elementId || '';

    // Priority 1: Use existing id attribute
    if (node.attributes?.id) {
      return {
        elementId,
        scopeSelector: `#${node.attributes.id}`,
        needsInjection: false
      };
    }

    // Priority 2: Use existing className attribute (first class)
    if (node.attributes?.className) {
      const classes = node.attributes.className.split(/\s+/).filter(c => c);
      if (classes.length > 0) {
        return {
          elementId,
          scopeSelector: `.${classes.join('.')}`,
          needsInjection: false
        };
      }
    }

    // Priority 3: Generate a stable id based on elementId (only used if collision detected)
    if (elementId) {
      return {
        elementId,
        scopeSelector: `#board-${this.sanitizeIdForCss(elementId)}`,
        needsInjection: true // Will be injected into HTML only if needed
      };
    }

    return null;
  }

  /**
   * Check if a node represents a board (frame/artboard)
   * Boards are identified by their elementType being 'frame' or by being root-level containers
   */
  private isBoard(node: CodeGeneratorNode): boolean {
    // Frame type nodes are boards
    if (node.elementType === 'frame') {
      return true;
    }
    // Root-level div/section containers with children are treated as boards
    if ((node.tag === 'div' || node.tag === 'section') && node.children && node.children.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Sanitize an element ID to be valid in CSS selectors
   */
  private sanitizeIdForCss(id: string): string {
    return id
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/^-+|-+$/g, '')
      .replace(/-+/g, '-')
      .toLowerCase();
  }

  /**
   * Collect CSS rules with full context including ancestor chain for local scoping
   */
  private collectCssRulesWithFullContext(
    node: CodeGeneratorNode, 
    cssRules: CssRuleContext[], 
    currentBoardScope: BoardScopeInfo | null,
    ancestorChain: AncestorSelector[]
  ): void {
    if (!node) {
      return;
    }

    // Check if this node is itself a board (for nested frames)
    const nodeIsBoard = this.isBoard(node);
    let effectiveBoardScope = currentBoardScope;
    
    if (nodeIsBoard && !currentBoardScope) {
      // This is a root board
      effectiveBoardScope = this.calculateBoardScopeInfo(node);
    }

    // Build the ancestor chain for this node's children
    const nodeSelector = this.getNodeSelector(node);
    const newAncestorChain = nodeSelector 
      ? [nodeSelector, ...ancestorChain]  // Add current node's selector to front
      : ancestorChain;

    // Generate CSS for current node
    const baseSelector = this.generateCssSelector(node);
    const cssBody = this.generateCssProperties(node);

    if (baseSelector && cssBody) {
      cssRules.push({
        elementId: node.elementId || '',
        baseSelector,
        cssBody,
        cssSignature: this.computeCssSignature(cssBody),
        boardScope: effectiveBoardScope?.scopeSelector || null,
        boardElementId: effectiveBoardScope?.elementId || null,
        ancestorChain: [...ancestorChain] // Copy of ancestor chain (not including self)
      });
    }

    // Process children recursively with inherited board scope and updated ancestor chain
    if (node.children && node.children.length > 0) {
      node.children.forEach(child => {
        this.collectCssRulesWithFullContext(child, cssRules, effectiveBoardScope, newAncestorChain);
      });
    }
  }

  /**
   * Group CSS rules by their base selector
   */
  private groupRulesBySelector(cssRules: CssRuleContext[]): Map<string, CssRuleContext[]> {
    const groups = new Map<string, CssRuleContext[]>();
    
    cssRules.forEach(rule => {
      const existing = groups.get(rule.baseSelector) || [];
      existing.push(rule);
      groups.set(rule.baseSelector, existing);
    });

    return groups;
  }

  /**
   * Detect which selectors have board-level collisions (same selector in different boards)
   * Returns a Set of selectors that need board scoping
   */
  private detectBoardCollisions(selectorGroups: Map<string, CssRuleContext[]>): Set<string> {
    const collidingSelectors = new Set<string>();

    selectorGroups.forEach((rules, selector) => {
      // Get unique board scopes for this selector
      const uniqueBoards = new Set<string>();
      rules.forEach(rule => {
        if (rule.boardScope) {
          uniqueBoards.add(rule.boardScope);
        }
      });

      // If the same selector appears in multiple distinct boards, it's a collision
      if (uniqueBoards.size > 1) {
        collidingSelectors.add(selector);
      }
    });

    return collidingSelectors;
  }

  /**
   * Detect local-level collisions: same selector with different styles within the same board
   * Returns a map of selector -> array of rule groups that need disambiguation
   * 
   * A local collision occurs when:
   * 1. Multiple rules have the same baseSelector
   * 2. They are in the same board (or same null board)
   * 3. They have DIFFERENT cssSignatures (different styles)
   */
  private detectLocalCollisions(
    selectorGroups: Map<string, CssRuleContext[]>
  ): Map<string, CssRuleContext[][]> {
    const localCollisions = new Map<string, CssRuleContext[][]>();

    selectorGroups.forEach((rules, selector) => {
      // Group rules by board scope first
      const rulesByBoard = new Map<string, CssRuleContext[]>();
      rules.forEach(rule => {
        const boardKey = rule.boardScope || '__no_board__';
        const boardRules = rulesByBoard.get(boardKey) || [];
        boardRules.push(rule);
        rulesByBoard.set(boardKey, boardRules);
      });

      // For each board, check if there are different styles for the same selector
      const conflictingGroups: CssRuleContext[][] = [];
      
      rulesByBoard.forEach((boardRules) => {
        // Group by cssSignature within this board
        const bySignature = new Map<string, CssRuleContext[]>();
        boardRules.forEach(rule => {
          const sigRules = bySignature.get(rule.cssSignature) || [];
          sigRules.push(rule);
          bySignature.set(rule.cssSignature, sigRules);
        });

        // If there are multiple different signatures, we have a local collision
        if (bySignature.size > 1) {
          // Each signature group represents elements with identical styles
          bySignature.forEach((sigRules) => {
            conflictingGroups.push(sigRules);
          });
        }
      });

      if (conflictingGroups.length > 0) {
        localCollisions.set(selector, conflictingGroups);
      }
    });

    return localCollisions;
  }

  /**
   * Mark boards that need ID injection for scoping
   * Only marks boards that have colliding selectors AND need generated IDs
   */
  private markBoardsForInjection(cssRules: CssRuleContext[], collidingSelectors: Set<string>): void {
    cssRules.forEach(rule => {
      // Only process rules with collisions
      if (!collidingSelectors.has(rule.baseSelector)) {
        return;
      }

      // Find the board info we calculated earlier
      if (rule.boardElementId && rule.boardScope) {
        // Check if this board scope uses a generated ID (starts with #board-)
        const needsInjection = rule.boardScope.startsWith('#board-');
        
        if (!this.boardsNeedingInjection.has(rule.boardElementId)) {
          this.boardsNeedingInjection.set(rule.boardElementId, {
            elementId: rule.boardElementId,
            scopeSelector: rule.boardScope,
            needsInjection
          });
        }
      }
    });
  }

  /**
   * Resolve local collisions by finding ancestor scopes or generating unique identifiers
   * Returns a map of elementId -> final scoped selector to use
   */
  private resolveLocalCollisions(
    localCollisions: Map<string, CssRuleContext[][]>
  ): Map<string, string> {
    const resolvedScopes = new Map<string, string>();

    localCollisions.forEach((conflictingGroups, baseSelector) => {
      // For each group of rules with the same signature, we need to find a unique scope
      // Skip the first group - we'll let it use the base selector (no scoping needed)
      // Only scope subsequent groups that have different styles
      
      // First, dedupe by signature - keep only one representative per signature
      const signatureToGroup = new Map<string, CssRuleContext[]>();
      conflictingGroups.forEach(group => {
        const sig = group[0].cssSignature;
        if (!signatureToGroup.has(sig)) {
          signatureToGroup.set(sig, group);
        }
      });

      // Convert back to array for processing
      const uniqueGroups = Array.from(signatureToGroup.values());
      
      // First group gets base selector (no change needed)
      // Remaining groups need scoping
      for (let i = 1; i < uniqueGroups.length; i++) {
        const group = uniqueGroups[i];
        
        for (const rule of group) {
          // Try to find an ancestor that can provide scoping
          const ancestorScope = this.findScopingAncestor(rule, uniqueGroups, i);
          
          if (ancestorScope) {
            // Found an ancestor that differentiates this element
            resolvedScopes.set(rule.elementId, `${ancestorScope} ${baseSelector}`);
            
            // Check if ancestor needs injection
            const ancestorInChain = rule.ancestorChain.find(
              a => a.selector === ancestorScope
            );
            if (ancestorInChain && ancestorInChain.needsInjection) {
              // Mark ancestor for injection
              this.markElementForInjection(ancestorInChain);
            }
          } else {
            // No suitable ancestor - inject unique id on the element itself
            const injectedSelector = this.createElementInjection(rule.elementId);
            resolvedScopes.set(rule.elementId, injectedSelector);
          }
        }
      }
    });

    return resolvedScopes;
  }

  /**
   * Find an ancestor selector that can differentiate this rule from others
   */
  private findScopingAncestor(
    rule: CssRuleContext,
    allGroups: CssRuleContext[][],
    currentGroupIndex: number
  ): string | null {
    // Look through the ancestor chain for a selector that's unique to this rule's group
    for (const ancestor of rule.ancestorChain) {
      // Check if this ancestor selector would conflict with other groups
      let isUnique = true;
      
      for (let i = 0; i < allGroups.length; i++) {
        if (i === currentGroupIndex) continue; // Skip our own group
        
        const otherGroup = allGroups[i];
        for (const otherRule of otherGroup) {
          // Check if other rule has the same ancestor
          if (otherRule.ancestorChain.some(a => a.selector === ancestor.selector)) {
            isUnique = false;
            break;
          }
        }
        if (!isUnique) break;
      }

      if (isUnique) {
        return ancestor.selector;
      }
    }

    return null;
  }

  /**
   * Mark an ancestor element for ID/class injection
   */
  private markElementForInjection(ancestor: AncestorSelector): void {
    if (!this.elementsNeedingInjection.has(ancestor.elementId)) {
      const injectedId = `scope-${this.sanitizeIdForCss(ancestor.elementId)}`;
      this.elementsNeedingInjection.set(ancestor.elementId, {
        elementId: ancestor.elementId,
        injectedSelector: `#${injectedId}`,
        injectedAttribute: 'id',
        injectedValue: injectedId
      });
    }
  }

  /**
   * Create an injection for an element that has no suitable ancestor for scoping
   * Returns the CSS selector to use for this element
   */
  private createElementInjection(elementId: string): string {
    if (!elementId) {
      return ''; // Shouldn't happen, but safety check
    }

    const injectedId = `el-${this.sanitizeIdForCss(elementId)}`;
    
    this.elementsNeedingInjection.set(elementId, {
      elementId,
      injectedSelector: `#${injectedId}`,
      injectedAttribute: 'id',
      injectedValue: injectedId
    });

    return `#${injectedId}`;
  }

  /**
   * Emit final CSS with both board-level and local-level scoping
   */
  private emitFinalCssWithLocalScoping(
    selectorGroups: Map<string, CssRuleContext[]>, 
    boardCollidingSelectors: Set<string>,
    resolvedLocalScopes: Map<string, string>
  ): string {
    const cssBlocks: string[] = [];
    const emittedBlocks = new Set<string>(); // Avoid duplicate CSS blocks

    selectorGroups.forEach((rules, baseSelector) => {
      const hasBoardCollision = boardCollidingSelectors.has(baseSelector);

      // Group rules by their final selector to deduplicate identical styles
      const rulesByFinalSelector = new Map<string, CssRuleContext>();

      rules.forEach(rule => {
        // Check if this specific element has a local scope override
        const localScope = resolvedLocalScopes.get(rule.elementId);
        
        let finalSelector: string;
        
        if (localScope) {
          // Element has local scoping (different styles than others with same selector)
          finalSelector = localScope;
        } else if (hasBoardCollision && rule.boardScope) {
          // Board-level collision - add board scope prefix
          finalSelector = `${rule.boardScope} ${baseSelector}`;
        } else {
          // No collision - use base selector
          finalSelector = baseSelector;
        }

        // Only keep one rule per final selector (with same signature)
        // This effectively deduplicates rules with identical styles and selectors
        const dedupeKey = `${finalSelector}::${rule.cssSignature}`;
        if (!rulesByFinalSelector.has(dedupeKey)) {
          rulesByFinalSelector.set(dedupeKey, rule);
        }
      });

      // Emit each unique rule
      rulesByFinalSelector.forEach((rule, dedupeKey) => {
        const finalSelector = dedupeKey.split('::')[0];
        const cssBlock = `${finalSelector} {\n${this.indentContent(rule.cssBody)}\n}`;
        
        if (!emittedBlocks.has(cssBlock)) {
          cssBlocks.push(cssBlock);
          emittedBlocks.add(cssBlock);
        }
      });
    });

    return cssBlocks.join('\n\n');
  }

  /**
   * Legacy method: Collect unique CSS rules from node tree to avoid duplicates
   * Kept for backwards compatibility but internally uses new scoping logic
   * @param node Single node object
   * @param cssRulesSet Set to store unique CSS rules
   * @deprecated Use generateCss which handles scoping automatically
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