// Test to simulate the exact export process and identify the hierarchy issue
console.log('=== TESTING EXPORT PROCESS ===');

// Mock the exact structure from the user's problematic JSON
const mockTaggedElements = new Map([
  ['cb48b94c-2e94-801c-8006-81b0d4f817d4', { tag: 'section', properties: { className: 'song-card' } }],
  ['cb48b94c-2e94-801c-8006-81b0dc54946d', { tag: 'img', properties: { alt: 'song-img' } }],
  ['cb48b94c-2e94-801c-8006-81b0fba339de', { tag: 'div', properties: { className: 'song-info' } }],
  ['cb48b94c-2e94-801c-8006-81b0e8804be0', { tag: 'h3', properties: { className: 'heading-song-name' } }],
  ['cb48b94c-2e94-801c-8006-81b0e8804bdf', { tag: 'span', properties: { className: 'artist-name' } }],
  ['cb48b94c-2e94-801c-8006-81b1ec45df1f', { tag: 'button', properties: { className: 'btn-play-song', type: 'button' } }],
  ['cb48b94c-2e94-801c-8006-81b21bdbb49c', { tag: 'span', properties: {} }]
]);

// Mock the exact shape structure that would produce the problematic JSON
const mockShapes = [
  {
    id: 'cb48b94c-2e94-801c-8006-81b0d4f817d4',
    name: 'section / song-card',
    type: 'board',
    children: [
      {
        id: 'cb48b94c-2e94-801c-8006-81b0dc54946d',
        name: 'img / song-img',
        type: 'ellipse',
        children: []
      },
      {
        id: 'cb48b94c-2e94-801c-8006-81b0fba339de',
        name: 'div / song-info',
        type: 'board',
        children: [
          {
            id: 'cb48b94c-2e94-801c-8006-81b0e8804be0',
            name: 'h3 / song-name',
            type: 'text',
            children: []
          },
          {
            id: 'cb48b94c-2e94-801c-8006-81b0e8804bdf',
            name: 'span / artist-name',
            type: 'text',
            children: []
          }
        ]
      },
      {
        id: 'cb48b94c-2e94-801c-8006-81b1ec45df1f',
        name: 'button / play-song',
        type: 'board',
        children: [
          {
            id: 'cb48b94c-2e94-801c-8006-81b21bdbb49c',
            name: 'span',
            type: 'text',
            children: []
          }
        ]
      }
    ]
  }
];

console.log('\n=== ANALYSIS ===');
console.log('Root shape: section/song-card (HAS TAG)');
console.log('Direct children of section:');
console.log('  1. img/song-img (HAS TAG) - should be direct child');
console.log('  2. div/song-info (HAS TAG) - should be direct child');
console.log('  3. button/play-song (HAS TAG) - should be direct child');

console.log('\nThe problem: img/song-img appears as child of button in the JSON');
console.log('This suggests the processing order or logic is incorrect');

console.log('\n=== ROOT DETECTION TEST ===');
// Test the root detection logic
const allTaggedShapeIds = Array.from(mockTaggedElements.keys());
console.log('All tagged shape IDs:', allTaggedShapeIds);

// Simulate finding root elements
const rootShapes = [];
allTaggedShapeIds.forEach(shapeId => {
  // Find the shape in our mock structure
  const findShape = (shapes, id) => {
    for (const shape of shapes) {
      if (shape.id === id) return shape;
      if (shape.children) {
        const found = findShape(shape.children, id);
        if (found) return found;
      }
    }
    return null;
  };
  
  const shape = findShape(mockShapes, shapeId);
  if (shape) {
    // Check if it has a tagged parent (simplified logic)
    let isRoot = true;
    // In this case, only section/song-card should be root
    if (shapeId !== 'cb48b94c-2e94-801c-8006-81b0d4f817d4') {
      isRoot = false; // All others have section as tagged parent
    }
    
    if (isRoot) {
      rootShapes.push(shape);
      console.log('Root shape found:', shape.name);
    }
  }
});

console.log('\nExpected: Only section/song-card should be root');
console.log('Root shapes count:', rootShapes.length);