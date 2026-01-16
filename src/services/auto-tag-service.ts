import { TagData } from '../types';
import { extractStyles } from '../utils/style-extractor';
import { extractContent } from '../utils/content-extractor';
import { analyzeLayout } from '../utils/layout-analyzer';

/**
 * Result of parsing inline CSS-like selectors from a tag token
 */
interface InlineSelectorResult {
  tag: string;
  id?: string;
  classes?: string[];
}

/**
 * Parse inline CSS-like selectors (#id, .class) from a tag token.
 * Only parses the first segment (before any "/").
 * 
 * Examples:
 * - "div" -> { tag: "div" }
 * - "div#main" -> { tag: "div", id: "main" }
 * - "div.utility" -> { tag: "div", classes: ["utility"] }
 * - "div#main.utility.big" -> { tag: "div", id: "main", classes: ["utility", "big"] }
 * 
 * @param raw - The raw tag token string (first segment before "/")
 * @returns Parsed result with tag, optional id, and optional classes array
 */
export function parseInlineSelector(raw: string): InlineSelectorResult {
  if (!raw || raw.trim() === '') {
    return { tag: '' };
  }

  const trimmed = raw.trim();
  
  // Find the first occurrence of # or . to determine where the tag name ends
  const hashIndex = trimmed.indexOf('#');
  const dotIndex = trimmed.indexOf('.');
  
  // If neither # nor . exists, return the whole string as tag
  if (hashIndex === -1 && dotIndex === -1) {
    return { tag: trimmed };
  }

  // Find the end of the tag name (first # or . encountered)
  let tagEndIndex: number;
  if (hashIndex === -1) {
    tagEndIndex = dotIndex;
  } else if (dotIndex === -1) {
    tagEndIndex = hashIndex;
  } else {
    tagEndIndex = Math.min(hashIndex, dotIndex);
  }

  const tag = trimmed.substring(0, tagEndIndex);
  
  // If tag is empty after extraction, use the original (invalid syntax, fallback)
  if (!tag) {
    return { tag: trimmed };
  }

  const remainder = trimmed.substring(tagEndIndex);
  
  let id: string | undefined;
  const classes: string[] = [];

  // Parse the remainder for #id and .class tokens
  // Use regex to find all #id and .class occurrences
  const tokenRegex = /([#.])([^#.]+)/g;
  let match;
  
  while ((match = tokenRegex.exec(remainder)) !== null) {
    const type = match[1];
    const value = match[2].trim();
    
    // Skip empty values or values with spaces (invalid)
    if (!value || value.includes(' ')) {
      continue;
    }

    if (type === '#') {
      // Only take the first id (if multiple # are present, first wins)
      if (!id) {
        // Basic validation: id should be a valid identifier (alphanumeric, -, _)
        if (/^[a-zA-Z_][a-zA-Z0-9_-]*$/.test(value)) {
          id = value;
        }
      }
    } else if (type === '.') {
      // Basic validation: class should be a valid identifier
      if (/^[a-zA-Z_-][a-zA-Z0-9_-]*$/.test(value)) {
        classes.push(value);
      }
    }
  }

  const result: InlineSelectorResult = { tag };
  if (id) {
    result.id = id;
  }
  if (classes.length > 0) {
    result.classes = classes;
  }
  
  return result;
}

/**
 * Merge inline classes with existing className property.
 * Preserves existing classes and adds new ones without duplicates.
 * 
 * @param existingClassName - Current className value (may be undefined)
 * @param inlineClasses - Array of classes to add
 * @returns Merged className string with no duplicates, normalized spaces
 */
function mergeClassNames(existingClassName: string | undefined, inlineClasses: string[]): string {
  const existingClasses = existingClassName 
    ? existingClassName.trim().split(/\s+/).filter(c => c !== '')
    : [];
  
  // Create a Set for deduplication, preserving order of existing classes
  const classSet = new Set(existingClasses);
  
  // Add inline classes (only if not already present)
  for (const cls of inlineClasses) {
    if (!classSet.has(cls)) {
      classSet.add(cls);
    }
  }
  
  return Array.from(classSet).join(' ');
}

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

    // Parse inline selectors (#id, .class) from the first segment
    const parsed = parseInlineSelector(parts[0]);
    const tag = parsed.tag;
    
    // If tag is empty after parsing, skip this element
    if (!tag) {
      return null;
    }
    
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

    // Apply inline selector id and classes with merge policy:
    // - id: only set if properties.id doesn't exist
    // - className: merge without duplicates, preserving existing
    if (parsed.id && !properties.id) {
      properties.id = parsed.id;
    }
    
    if (parsed.classes && parsed.classes.length > 0) {
      properties.className = mergeClassNames(properties.className, parsed.classes);
    }

    return { tag, properties };
  }
}

/**
 * Self-check test cases for parseInlineSelector and merge logic.
 * Run this function during development to verify the implementation.
 * 
 * @returns Object with passed/failed counts and detailed results
 */
export function runInlineSelectorTests(): { passed: number; failed: number; results: string[] } {
  const results: string[] = [];
  let passed = 0;
  let failed = 0;

  const assert = (name: string, condition: boolean, details: string = '') => {
    if (condition) {
      passed++;
      results.push(`✓ ${name}`);
    } else {
      failed++;
      results.push(`✗ ${name}${details ? ': ' + details : ''}`);
    }
  };

  // Test parseInlineSelector function
  
  // Case 1: Plain tag without selectors (no changes expected)
  const case1 = parseInlineSelector('div');
  assert('Plain "div"', case1.tag === 'div' && !case1.id && !case1.classes,
    `got tag="${case1.tag}", id="${case1.id}", classes=${JSON.stringify(case1.classes)}`);

  // Case 2: Tag with id
  const case2 = parseInlineSelector('div#main');
  assert('Tag with id "div#main"', 
    case2.tag === 'div' && case2.id === 'main' && !case2.classes,
    `got tag="${case2.tag}", id="${case2.id}", classes=${JSON.stringify(case2.classes)}`);

  // Case 3: Tag with single class
  const case3 = parseInlineSelector('div.utility');
  assert('Tag with class "div.utility"', 
    case3.tag === 'div' && !case3.id && 
    case3.classes?.length === 1 && case3.classes[0] === 'utility',
    `got tag="${case3.tag}", id="${case3.id}", classes=${JSON.stringify(case3.classes)}`);

  // Case 4: Tag with multiple classes
  const case4 = parseInlineSelector('div.utility.big');
  assert('Multiple classes "div.utility.big"', 
    case4.tag === 'div' && !case4.id && 
    case4.classes?.length === 2 && 
    case4.classes[0] === 'utility' && case4.classes[1] === 'big',
    `got tag="${case4.tag}", id="${case4.id}", classes=${JSON.stringify(case4.classes)}`);

  // Case 5: Tag with id and multiple classes
  const case5 = parseInlineSelector('div#main.utility.big');
  assert('Id and classes "div#main.utility.big"', 
    case5.tag === 'div' && case5.id === 'main' && 
    case5.classes?.length === 2 && 
    case5.classes[0] === 'utility' && case5.classes[1] === 'big',
    `got tag="${case5.tag}", id="${case5.id}", classes=${JSON.stringify(case5.classes)}`);

  // Case 6: Complex component name with selectors
  const case6 = parseInlineSelector('button#cta.primary');
  assert('Button with id and class "button#cta.primary"', 
    case6.tag === 'button' && case6.id === 'cta' && 
    case6.classes?.length === 1 && case6.classes[0] === 'primary',
    `got tag="${case6.tag}", id="${case6.id}", classes=${JSON.stringify(case6.classes)}`);

  // Case 7: MUI component with selectors
  const case7 = parseInlineSelector('MuiButton#submit.large');
  assert('MuiButton with selectors "MuiButton#submit.large"', 
    case7.tag === 'MuiButton' && case7.id === 'submit' && 
    case7.classes?.length === 1 && case7.classes[0] === 'large',
    `got tag="${case7.tag}", id="${case7.id}", classes=${JSON.stringify(case7.classes)}`);

  // Case 8: Class before id (both should be parsed)
  const case8 = parseInlineSelector('span.highlight#special');
  assert('Class before id "span.highlight#special"', 
    case8.tag === 'span' && case8.id === 'special' && 
    case8.classes?.length === 1 && case8.classes[0] === 'highlight',
    `got tag="${case8.tag}", id="${case8.id}", classes=${JSON.stringify(case8.classes)}`);

  // Case 9: Empty string
  const case9 = parseInlineSelector('');
  assert('Empty string', case9.tag === '',
    `got tag="${case9.tag}"`);

  // Case 10: Only whitespace
  const case10 = parseInlineSelector('   ');
  assert('Whitespace only', case10.tag === '',
    `got tag="${case10.tag}"`);

  // Test mergeClassNames function
  
  // Case 11: Merge with no existing className
  const merge1 = mergeClassNames(undefined, ['foo', 'bar']);
  assert('Merge with no existing', merge1 === 'foo bar',
    `got "${merge1}"`);

  // Case 12: Merge with existing className
  const merge2 = mergeClassNames('existing', ['new']);
  assert('Merge with existing', merge2 === 'existing new',
    `got "${merge2}"`);

  // Case 13: Merge with duplicates
  const merge3 = mergeClassNames('foo baz', ['bar', 'foo']);
  assert('Merge with duplicates', merge3 === 'foo baz bar',
    `got "${merge3}"`);

  // Case 14: Merge with multiple spaces in existing
  const merge4 = mergeClassNames('  foo   bar  ', ['baz']);
  assert('Merge normalizes spaces', merge4 === 'foo bar baz',
    `got "${merge4}"`);

  // Case 15: Empty inline classes
  const merge5 = mergeClassNames('existing', []);
  assert('Empty inline classes', merge5 === 'existing',
    `got "${merge5}"`);

  console.log(`\n=== Inline Selector Tests ===`);
  console.log(`Passed: ${passed}, Failed: ${failed}`);
  results.forEach(r => console.log(r));
  
  return { passed, failed, results };
}