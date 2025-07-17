// Test script to debug hierarchy issues
console.log('Testing hierarchy logic...');

// Simulate the problematic structure from the user's example
const mockTaggedElements = new Map([
  ['section-id', { tag: 'section', properties: { className: 'song-card' } }],
  ['img-id', { tag: 'img', properties: { alt: 'song-img' } }],
  ['div-id', { tag: 'div', properties: { className: 'song-info' } }],
  ['h3-id', { tag: 'h3', properties: { className: 'heading-song-name' } }],
  ['span-artist-id', { tag: 'span', properties: { className: 'artist-name' } }],
  ['button-id', { tag: 'button', properties: { className: 'btn-play-song', type: 'button' } }],
  ['span-button-id', { tag: 'span', properties: {} }]
]);

// Mock shape structure that matches the user's Penpot design
const mockShape = {
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

console.log('Mock structure created');
console.log('Expected hierarchy:');
console.log('- section/song-card');
console.log('  - img/song-img');
console.log('  - div/song-info');
console.log('    - h3/song-name');
console.log('    - span/artist-name');
console.log('  - button/play-song');
console.log('    - span');

// The issue is that img/song-img appears as child of button instead of section
console.log('\nProblem: img/song-img appears as child of button instead of section');