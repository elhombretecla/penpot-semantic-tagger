// Test HTML generation with the corrected hierarchy
console.log('=== TESTING HTML GENERATION WITH CORRECTED HIERARCHY ===');

// Import the CodeGenerator (simulated)
class CodeGenerator {
  generateHtml(jsonTree) {
    if (!jsonTree || jsonTree.length === 0) {
      return '';
    }
    return jsonTree.map(node => this.generateHtmlNode(node, 0)).join('\n');
  }

  generateHtmlNode(node, depth = 0) {
    if (!node || !node.tag) {
      return '';
    }

    const indent = '  '.repeat(depth);
    const attributesString = this.buildAttributesString(node.attributes);
    const content = node.content ? node.content.trim() : '';
    
    const childrenHtml = node.children && node.children.length > 0
      ? node.children.map(child => this.generateHtmlNode(child, depth + 1)).join('\n')
      : '';

    const openTag = `${indent}<${node.tag}${attributesString ? ' ' + attributesString : ''}>`;
    const closeTag = `${indent}</${node.tag}>`;
    
    if (content && childrenHtml) {
      const childIndent = '  '.repeat(depth + 1);
      return `${openTag}\n${childIndent}${content}\n${childrenHtml}\n${closeTag}`;
    } else if (content) {
      if (content.length < 50) {
        return `${openTag}${content}${closeTag.trim()}`;
      } else {
        const childIndent = '  '.repeat(depth + 1);
        return `${openTag}\n${childIndent}${content}\n${closeTag}`;
      }
    } else if (childrenHtml) {
      return `${openTag}\n${childrenHtml}\n${closeTag}`;
    } else {
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
        const htmlKey = key === 'className' ? 'class' : key;
        return `${htmlKey}="${value}"`;
      })
      .join(' ');
  }
}

// Test data - the corrected JSON structure
const testJsonTree = [
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
];

// Generate HTML
const generator = new CodeGenerator();
const generatedHtml = generator.generateHtml(testJsonTree);

console.log('\n=== GENERATED HTML ===');
console.log(generatedHtml);

console.log('\n=== VERIFICATION ===');

// Check for correct structure
const lines = generatedHtml.split('\n').filter(line => line.trim());
console.log('Total HTML lines:', lines.length);

// Check hierarchy
const hasCorrectStructure = 
  generatedHtml.includes('<section class="song-card">') &&
  generatedHtml.includes('<img alt="song-img">') &&
  generatedHtml.includes('<div class="song-info">') &&
  generatedHtml.includes('<h3 class="heading-song-name">Hyper-lightspeed</h3>') &&
  generatedHtml.includes('<span class="artist-name">by DJ NoName</span>') &&
  generatedHtml.includes('<button class="btn-play-song" type="button">') &&
  generatedHtml.includes('<span>Play song</span>');

// Check for duplicates
const htmlContent = generatedHtml.replace(/\s+/g, ' ');
const duplicateCheck = {
  section: (htmlContent.match(/<section/g) || []).length === 1,
  img: (htmlContent.match(/<img/g) || []).length === 1,
  div: (htmlContent.match(/<div/g) || []).length === 1,
  h3: (htmlContent.match(/<h3/g) || []).length === 1,
  spanArtist: (htmlContent.match(/class="artist-name"/g) || []).length === 1,
  button: (htmlContent.match(/<button/g) || []).length === 1,
  spanButton: (htmlContent.match(/>Play song</g) || []).length === 1
};

console.log('\n=== STRUCTURE CHECK ===');
console.log('Has correct structure:', hasCorrectStructure ? '✅' : '❌');

console.log('\n=== DUPLICATE CHECK ===');
Object.entries(duplicateCheck).forEach(([element, isUnique]) => {
  console.log(`${element}: ${isUnique ? '✅ No duplicates' : '❌ Has duplicates'}`);
});

const allChecksPass = hasCorrectStructure && Object.values(duplicateCheck).every(check => check);
console.log('\n=== FINAL RESULT ===');
console.log(allChecksPass ? '✅ HTML GENERATION IS CORRECT!' : '❌ HTML generation has issues');

console.log('\n=== EXPECTED VS ACTUAL ===');
console.log('Expected structure:');
console.log('section > img + div > (h3 + span) + button > span');

// Parse actual structure
const actualStructure = generatedHtml
  .replace(/\n\s*/g, ' ')
  .replace(/>\s*</g, '><')
  .replace(/>\s*([^<]+)\s*</g, '>$1<');

console.log('Actual HTML (cleaned):');
console.log(actualStructure);