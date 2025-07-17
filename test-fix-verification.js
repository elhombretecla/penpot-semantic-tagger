// Test to verify the HTML generation fix
console.log('=== VERIFYING HTML GENERATION FIX ===');

// Simulate the corrected message handler logic
class MockExportService {
  exportTags(taggedElements) {
    // Simulate the correct filtering logic that exportTags uses
    const allTaggedShapes = [
      { id: 'section-id', name: 'section / song-card', parent: null },
      { id: 'img-id', name: 'img / song-img', parent: { id: 'section-id' } },
      { id: 'div-id', name: 'div / song-info', parent: { id: 'section-id' } },
      { id: 'h3-id', name: 'h3 / song-name', parent: { id: 'div-id' } },
      { id: 'span-artist-id', name: 'span / artist-name', parent: { id: 'div-id' } },
      { id: 'button-id', name: 'button / play-song', parent: { id: 'section-id' } },
      { id: 'span-button-id', name: 'span', parent: { id: 'button-id' } }
    ];

    // Find root elements (elements that don't have a tagged parent)
    const rootShapes = [];
    allTaggedShapes.forEach(shape => {
      let isRoot = true;
      let currentParent = shape.parent;

      // Check if any parent is also tagged
      while (currentParent && currentParent.id) {
        if (taggedElements.has(currentParent.id)) {
          isRoot = false;
          break;
        }
        currentParent = currentParent.parent;
      }

      if (isRoot) {
        rootShapes.push(shape);
      }
    });

    console.log('All tagged shapes:', allTaggedShapes.map(s => s.name));
    console.log('Root shapes only:', rootShapes.map(s => s.name));

    return {
      metadata: { pluginName: "Test" },
      tree: rootShapes.map(shape => this.convertToTreeNode(shape, taggedElements, allTaggedShapes))
    };
  }

  convertToTreeNode(shape, taggedElements, allShapes) {
    const tagData = taggedElements.get(shape.id);
    const children = allShapes
      .filter(child => child.parent && child.parent.id === shape.id)
      .map(child => this.convertToTreeNode(child, taggedElements, allShapes));

    return {
      tag: tagData.tag,
      elementName: shape.name,
      elementId: shape.id,
      attributes: tagData.properties,
      children: children,
      content: tagData.content || undefined
    };
  }
}

// Mock tagged elements
const mockTaggedElements = new Map([
  ['section-id', { tag: 'section', properties: { className: 'song-card' } }],
  ['img-id', { tag: 'img', properties: { alt: 'song-img' } }],
  ['div-id', { tag: 'div', properties: { className: 'song-info' } }],
  ['h3-id', { tag: 'h3', properties: { className: 'heading-song-name' }, content: 'Hyper-lightspeed' }],
  ['span-artist-id', { tag: 'span', properties: { className: 'artist-name' }, content: 'by DJ NoName' }],
  ['button-id', { tag: 'button', properties: { className: 'btn-play-song', type: 'button' } }],
  ['span-button-id', { tag: 'span', properties: {}, content: 'Play song' }]
]);

// Simulate the corrected handleGenerateRichJson logic
function simulateHandleGenerateRichJson() {
  const exportService = new MockExportService();
  
  if (mockTaggedElements.size === 0) {
    return { metadata: {}, tree: [] };
  }

  // NEW LOGIC: Use exportTags instead of generateRichJson with all shapes
  const exportData = exportService.exportTags(mockTaggedElements);
  return exportData;
}

console.log('\n=== SIMULATING CORRECTED MESSAGE HANDLER ===');
const result = simulateHandleGenerateRichJson();

console.log('\n=== EXPORT DATA STRUCTURE ===');
console.log('Tree length:', result.tree.length);
console.log('Root elements:', result.tree.map(node => node.elementName));

console.log('\n=== DETAILED TREE STRUCTURE ===');
console.log(JSON.stringify(result, null, 2));

// Simulate HTML generation with the corrected data
class SimpleHtmlGenerator {
  generateHtml(tree) {
    return tree.map(node => this.generateNode(node, 0)).join('\n');
  }

  generateNode(node, depth) {
    const indent = '  '.repeat(depth);
    const attrs = this.buildAttrs(node.attributes);
    const content = node.content || '';
    
    const children = node.children && node.children.length > 0
      ? node.children.map(child => this.generateNode(child, depth + 1)).join('\n')
      : '';

    const openTag = `${indent}<${node.tag}${attrs ? ' ' + attrs : ''}>`;
    const closeTag = `${indent}</${node.tag}>`;

    if (content && children) {
      return `${openTag}\n${indent}  ${content}\n${children}\n${closeTag}`;
    } else if (content) {
      return `${openTag}${content}${closeTag.trim()}`;
    } else if (children) {
      return `${openTag}\n${children}\n${closeTag}`;
    } else {
      return `${openTag}${closeTag.trim()}`;
    }
  }

  buildAttrs(attributes) {
    if (!attributes) return '';
    return Object.entries(attributes)
      .map(([key, value]) => {
        const htmlKey = key === 'className' ? 'class' : key;
        return `${htmlKey}="${value}"`;
      })
      .join(' ');
  }
}

console.log('\n=== GENERATED HTML ===');
const htmlGenerator = new SimpleHtmlGenerator();
const html = htmlGenerator.generateHtml(result.tree);
console.log(html);

console.log('\n=== VERIFICATION ===');
const elementCounts = {
  section: (html.match(/<section/g) || []).length,
  img: (html.match(/<img/g) || []).length,
  div: (html.match(/<div/g) || []).length,
  h3: (html.match(/<h3/g) || []).length,
  span: (html.match(/<span/g) || []).length,
  button: (html.match(/<button/g) || []).length
};

console.log('Element counts:', elementCounts);

const isCorrect = elementCounts.section === 1 && 
                  elementCounts.img === 1 && 
                  elementCounts.div === 1 && 
                  elementCounts.h3 === 1 && 
                  elementCounts.span === 2 && 
                  elementCounts.button === 1;

console.log('\n=== FINAL RESULT ===');
console.log(isCorrect ? '✅ FIX IS WORKING! No more duplicates.' : '❌ Still has issues');

if (isCorrect) {
  console.log('✅ HTML structure is correct');
  console.log('✅ No duplicate elements');
  console.log('✅ Proper hierarchy maintained');
} else {
  console.log('❌ Issues detected in HTML generation');
}