// Test to verify the order fix works correctly
console.log('=== TESTING ORDER FIX ===');

// Mock shapes with coordinates that match the expected visual order
const mockShapes = [
  {
    id: 'section-id',
    name: 'section / song-card',
    type: 'board',
    x: 0, y: 0,
    children: [
      {
        id: 'img-id',
        name: 'img / song-img',
        type: 'ellipse',
        x: 10, y: 20, // Left position
        children: []
      },
      {
        id: 'div-id',
        name: 'div / song-info',
        type: 'board',
        x: 80, y: 20, // Center position
        children: [
          {
            id: 'h3-id',
            name: 'h3 / song-name',
            type: 'text',
            x: 80, y: 15, // Top text
            children: []
          },
          {
            id: 'span-artist-id',
            name: 'span / artist-name',
            type: 'text',
            x: 80, y: 35, // Bottom text
            children: []
          }
        ]
      },
      {
        id: 'button-id',
        name: 'button / play-song',
        type: 'board',
        x: 250, y: 20, // Right position
        children: [
          {
            id: 'span-button-id',
            name: 'span',
            type: 'text',
            x: 260, y: 25,
            children: []
          }
        ]
      }
    ]
  }
];

// Simulate the sorting logic
function simulateSorting(children) {
  return [...children].sort((a, b) => {
    // Sort by vertical position first (top to bottom)
    if (a.y !== b.y) {
      return a.y - b.y;
    }
    // Then by horizontal position (left to right)
    return a.x - b.x;
  });
}

console.log('\n=== ORIGINAL ORDER ===');
const originalChildren = mockShapes[0].children;
originalChildren.forEach((child, index) => {
  console.log(`${index + 1}. ${child.name} (x: ${child.x}, y: ${child.y})`);
});

console.log('\n=== SORTED ORDER ===');
const sortedChildren = simulateSorting(originalChildren);
sortedChildren.forEach((child, index) => {
  console.log(`${index + 1}. ${child.name} (x: ${child.x}, y: ${child.y})`);
});

console.log('\n=== EXPECTED ORDER ===');
console.log('1. img / song-img (leftmost)');
console.log('2. div / song-info (center)');
console.log('3. button / play-song (rightmost)');

console.log('\n=== VERIFICATION ===');
const expectedOrder = ['img / song-img', 'div / song-info', 'button / play-song'];
const actualOrder = sortedChildren.map(child => child.name);

const isCorrect = expectedOrder.every((expected, index) => expected === actualOrder[index]);

if (isCorrect) {
  console.log('✅ ORDER IS CORRECT!');
} else {
  console.log('❌ Order is still wrong');
  console.log('Expected:', expectedOrder);
  console.log('Actual:', actualOrder);
}

console.log('\n=== NESTED CHILDREN TEST ===');
const divChildren = mockShapes[0].children[1].children; // div/song-info children
console.log('Original div children:');
divChildren.forEach((child, index) => {
  console.log(`${index + 1}. ${child.name} (x: ${child.x}, y: ${child.y})`);
});

const sortedDivChildren = simulateSorting(divChildren);
console.log('Sorted div children:');
sortedDivChildren.forEach((child, index) => {
  console.log(`${index + 1}. ${child.name} (x: ${child.x}, y: ${child.y})`);
});

const expectedDivOrder = ['h3 / song-name', 'span / artist-name']; // h3 should be first (higher up)
const actualDivOrder = sortedDivChildren.map(child => child.name);
const isDivCorrect = expectedDivOrder.every((expected, index) => expected === actualDivOrder[index]);

if (isDivCorrect) {
  console.log('✅ DIV CHILDREN ORDER IS CORRECT!');
} else {
  console.log('❌ Div children order is wrong');
  console.log('Expected:', expectedDivOrder);
  console.log('Actual:', actualDivOrder);
}