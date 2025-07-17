// Test to simulate step-by-step processing and identify where hierarchy breaks
console.log('=== STEP-BY-STEP PROCESSING TEST ===');

// Mock the exact structure from the user's example
const mockTaggedElements = new Map([
  ['section-id', { tag: 'section', properties: { className: 'song-card' } }],
  ['img-id', { tag: 'img', properties: { alt: 'song-img' } }],
  ['div-id', { tag: 'div', properties: { className: 'song-info' } }],
  ['h3-id', { tag: 'h3', properties: { className: 'heading-song-name' } }],
  ['span-artist-id', { tag: 'span', properties: { className: 'artist-name' } }],
  ['button-id', { tag: 'button', properties: { className: 'btn-play-song', type: 'button' } }],
  ['span-button-id', { tag: 'span', properties: {} }]
]);

// Mock shape structure
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

console.log('\n=== PROCESSING SIMULATION ===');
console.log('1. Processing section/song-card (HAS TAG):');
console.log('   - Should process its 3 direct children');
console.log('   - Child 1: img/song-img (HAS TAG) → should become direct child');
console.log('   - Child 2: div/song-info (HAS TAG) → should become direct child');
console.log('   - Child 3: button/play-song (HAS TAG) → should become direct child');

console.log('\n2. Processing div/song-info (HAS TAG):');
console.log('   - Should process its 2 direct children');
console.log('   - Child 1: h3/song-name (HAS TAG) → should become child of div');
console.log('   - Child 2: span/artist-name (HAS TAG) → should become child of div');

console.log('\n3. Processing button/play-song (HAS TAG):');
console.log('   - Should process its 1 direct child');
console.log('   - Child 1: span (HAS TAG) → should become child of button');

console.log('\n=== EXPECTED RESULT ===');
const expectedResult = {
  tag: 'section',
  elementName: 'section / song-card',
  children: [
    {
      tag: 'img',
      elementName: 'img / song-img',
      children: []
    },
    {
      tag: 'div',
      elementName: 'div / song-info',
      children: [
        {
          tag: 'h3',
          elementName: 'h3 / song-name',
          children: []
        },
        {
          tag: 'span',
          elementName: 'span / artist-name',
          children: []
        }
      ]
    },
    {
      tag: 'button',
      elementName: 'button / play-song',
      children: [
        {
          tag: 'span',
          elementName: 'span',
          children: []
        }
      ]
    }
  ]
};

console.log(JSON.stringify(expectedResult, null, 2));

console.log('\n=== PROBLEM ANALYSIS ===');
console.log('The user\'s JSON shows img/song-img as child of button instead of section');
console.log('This means something is wrong in the children processing logic');
console.log('All direct children of section have tags, so they should all be processed normally');
console.log('There should be NO flattening or array spreading at this level');