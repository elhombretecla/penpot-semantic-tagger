// Debug the HTML generation issue
console.log('=== DEBUGGING HTML GENERATION ISSUE ===');

// Simulate the exact CodeGenerator from the TypeScript file
class CodeGenerator {
  generateHtml(jsonTree) {
    if (!jsonTree || jsonTree.length === 0) {
      return '';
    }

    console.log('Input jsonTree length:', jsonTree.length);
    console.log('Input jsonTree structure:');
    jsonTree.forEach((node, index) => {
      console.log(`Node ${index}:`, node.tag, node.elementName);
    });

    const htmlNodes = jsonTree.map(node => this.generateHtmlNode(node, 0));
    return htmlNodes.join('\n');
  }

  generateHtmlNode(node, depth = 0) {
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

  buildAttributesString(attributes) {
    if (!attributes || Object.keys(attributes).length === 0) {
      return '';
    }

    return Object.entries(attributes)
      .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      .map(([key, value]) => {
        // Convert className to class for standard HTML
        const htmlKey = key === 'className' ? 'class' : key;
        return `${htmlKey}="${value}"`;
      })
      .join(' ');
  }
}

// Test with the EXACT JSON structure that's causing problems
const problematicJson = {
  "metadata": {
    "pluginName": "Semantic Tagging Plugin",
    "version": "1.2.0",
    "exportDate": "2025-07-17T19:40:08.677Z",
    "fileName": "Localhost - Piweek Demo",
    "pageName": "Demo example"
  },
  "tree": [
    {
      "tag": "section",
      "elementName": "section / song-card",
      "elementType": "board",
      "elementId": "cb48b94c-2e94-801c-8006-81b0d4f817d4",
      "attributes": {
        "className": "song-card"
      },
      "styles": {
        "width": "375px",
        "height": "92px",
        "position": "absolute",
        "left": "-153px",
        "top": "551px",
        "backgroundColor": "#f5f0f0",
        "display": "flex",
        "flexDirection": "row",
        "gap": "8px",
        "justifyContent": "space-between",
        "alignItems": "center"
      },
      "children": [
        {
          "tag": "img",
          "elementName": "img / song-img",
          "elementType": "ellipse",
          "elementId": "cb48b94c-2e94-801c-8006-81b0dc54946d",
          "attributes": {
            "alt": "song-img"
          },
          "styles": {
            "width": "60px",
            "height": "60px",
            "border": "2px solid #ffffff"
          },
          "children": []
        },
        {
          "tag": "div",
          "elementName": "div / song-info",
          "elementType": "board",
          "elementId": "cb48b94c-2e94-801c-8006-81b0fba339de",
          "attributes": {
            "className": "song-info"
          },
          "styles": {
            "width": "156px",
            "height": "44px"
          },
          "children": [
            {
              "tag": "h3",
              "elementName": "h3 / song-name",
              "elementType": "text",
              "elementId": "cb48b94c-2e94-801c-8006-81b0e8804be0",
              "attributes": {
                "className": "heading-song-name"
              },
              "styles": {
                "width": "156px",
                "height": "22px",
                "position": "absolute",
                "left": "-65px",
                "top": "575px",
                "backgroundColor": "#000000",
                "fontFamily": "Archivo",
                "fontWeight": "500",
                "fontStyle": "normal",
                "lineHeight": "1.2",
                "color": "#000000"
              },
              "children": [],
              "content": "Hyper-lightspeed"
            },
            {
              "tag": "span",
              "elementName": "span / artist-name",
              "elementType": "text",
              "elementId": "cb48b94c-2e94-801c-8006-81b0e8804bdf",
              "attributes": {
                "className": "artist-name"
              },
              "styles": {
                "width": "156px",
                "height": "17px",
                "position": "absolute",
                "left": "-65px",
                "top": "603px",
                "backgroundColor": "#787878",
                "fontFamily": "Archivo",
                "fontWeight": "300",
                "fontStyle": "normal",
                "lineHeight": "1.2",
                "color": "#787878"
              },
              "children": [],
              "content": "by DJ NoName"
            }
          ]
        },
        {
          "tag": "button",
          "elementName": "button / play-song",
          "elementType": "board",
          "elementId": "cb48b94c-2e94-801c-8006-81b1ec45df1f",
          "attributes": {
            "className": "btn-play-song",
            "type": "button"
          },
          "styles": {
            "width": "103px",
            "height": "40px",
            "backgroundColor": "#df44a0"
          },
          "children": [
            {
              "tag": "span",
              "elementName": "span",
              "elementType": "text",
              "elementId": "cb48b94c-2e94-801c-8006-81b21bdbb49c",
              "attributes": {},
              "styles": {
                "width": "71px",
                "height": "20px",
                "position": "absolute",
                "left": "115px",
                "top": "587px",
                "backgroundColor": "#ffffff",
                "fontFamily": "Archivo",
                "fontWeight": "500",
                "fontStyle": "normal",
                "lineHeight": "1.2",
                "color": "#ffffff"
              },
              "children": [],
              "content": "Play song"
            }
          ]
        }
      ]
    }
  ]
};

console.log('\n=== TESTING WITH EXACT JSON ===');
const generator = new CodeGenerator();

// Test with the tree array directly
const html = generator.generateHtml(problematicJson.tree);

console.log('\n=== GENERATED HTML ===');
console.log(html);

console.log('\n=== ANALYSIS ===');
const htmlLines = html.split('\n').filter(line => line.trim());
console.log('Total lines:', htmlLines.length);

// Check for duplicates
const sectionCount = (html.match(/<section/g) || []).length;
const imgCount = (html.match(/<img/g) || []).length;
const divCount = (html.match(/<div/g) || []).length;
const h3Count = (html.match(/<h3/g) || []).length;
const spanCount = (html.match(/<span/g) || []).length;
const buttonCount = (html.match(/<button/g) || []).length;

console.log('Element counts:');
console.log('- section:', sectionCount);
console.log('- img:', imgCount);
console.log('- div:', divCount);
console.log('- h3:', h3Count);
console.log('- span:', spanCount);
console.log('- button:', buttonCount);

console.log('\n=== EXPECTED COUNTS ===');
console.log('- section: 1');
console.log('- img: 1');
console.log('- div: 1');
console.log('- h3: 1');
console.log('- span: 2 (artist-name + button text)');
console.log('- button: 1');

const isCorrect = sectionCount === 1 && imgCount === 1 && divCount === 1 && 
                  h3Count === 1 && spanCount === 2 && buttonCount === 1;

console.log('\n=== RESULT ===');
console.log(isCorrect ? '✅ HTML is correct' : '❌ HTML has duplicates or missing elements');

// If there's an issue, let's trace the problem
if (!isCorrect) {
  console.log('\n=== DEBUGGING TREE STRUCTURE ===');
  console.log('Tree length:', problematicJson.tree.length);
  console.log('Root element:', problematicJson.tree[0].tag, problematicJson.tree[0].elementName);
  console.log('Root children count:', problematicJson.tree[0].children.length);
  
  problematicJson.tree[0].children.forEach((child, index) => {
    console.log(`Child ${index}:`, child.tag, child.elementName, 'children:', child.children.length);
  });
}