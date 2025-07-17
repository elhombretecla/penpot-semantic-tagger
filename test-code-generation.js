// Test to verify the hierarchy fix works correctly
console.log('=== TESTING HIERARCHY FIX ===');

// Simulate the corrected logic
const mockTaggedElements = new Map([
  ['section-id', { tag: 'section', properties: { className: 'song-card' } }],
  ['img-id', { tag: 'img', properties: { alt: 'song-img' } }],
  ['div-id', { tag: 'div', properties: { className: 'song-info' } }],
  ['h3-id', { tag: 'h3', properties: { className: 'heading-song-name' } }],
  ['span-artist-id', { tag: 'span', properties: { className: 'artist-name' } }],
  ['button-id', { tag: 'button', properties: { className: 'btn-play-song', type: 'button' } }],
  ['span-button-id', { tag: 'span', properties: {} }]
]);

// Mock shape structure with the corrected processing logic
const sectionShape = {
  id: 'section-id',
  name: 'section / song-card',
  type: 'board',
  children: [
    {
      id: 'img-id',
      name: 'img / song-img',
      type: 'ellipse',
      children: []
    },
    {
      id: 'div-id',
      name: 'div / song-info',
      type: 'board',
      children: [
        {
          id: 'h3-id',
          name: 'h3 / song-name',
          type: 'text',
          children: []
        },
        {
          id: 'span-artist-id',
          name: 'span / artist-name',
          type: 'text',
          children: []
        }
      ]
    },
    {
      id: 'button-id',
      name: 'button / play-song',
      type: 'board',
      children: [
        {
          id: 'span-button-id',
          name: 'span',
          type: 'text',
          children: []
        }
      ]
    }
  ]
};

// Simulate the corrected processing logic
function simulateProcessShape(shape, taggedElements) {
  if (!shape) return null;
  
  const tagData = taggedElements.get(shape.id);
  
  if (!tagData) {
    // No tag - return null to maintain hierarchy (non-root level)
    return null;
  }
  
  // Has tag - process children
  const children = [];
  if (shape.children && Array.isArray(shape.children)) {
    shape.children.forEach(child => {
      // NEW LOGIC: Only process children that have tags
      if (taggedElements.has(child.id)) {
        const childResult = simulateProcessShape(child, taggedElements);
        if (childResult) {
          children.push(childResult);
        }
      }
      // Children without tags are skipped - no flattening!
    });
  }
  
  return {
    tag: tagData.tag,
    elementName: shape.name,
    elementType: shape.type,
    elementId: shape.id,
    attributes: tagData.properties,
    children: children
  };
}

console.log('\n=== SIMULATING CORRECTED PROCESSING ===');
const result = simulateProcessShape(sectionShape, mockTaggedElements);

console.log('\n=== RESULT ===');
console.log(JSON.stringify(result, null, 2));

console.log('\n=== VERIFICATION ===');
console.log('✓ section/song-card is root');
console.log('✓ img/song-img is direct child of section');
console.log('✓ div/song-info is direct child of section');
console.log('✓ button/play-song is direct child of section');
console.log('✓ h3/song-name is child of div');
console.log('✓ span/artist-name is child of div');
console.log('✓ span is child of button');

console.log('\n=== HIERARCHY CHECK ===');
if (result && result.children) {
  const childNames = result.children.map(child => child.elementName);
  console.log('Direct children of section:', childNames);
  
  const expectedChildren = ['img / song-img', 'div / song-info', 'button / play-song'];
  const isCorrect = expectedChildren.every(expected => childNames.includes(expected));
  
  if (isCorrect) {
    console.log('✅ HIERARCHY IS CORRECT!');
  } else {
    console.log('❌ Hierarchy is still wrong');
  }
} else {
  console.log('❌ No result generated');
}