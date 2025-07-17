// Debug script to understand the hierarchy issue
console.log('=== DEBUGGING HIERARCHY ISSUE ===');

// Let's trace through what should happen with the user's example:
console.log('\nExpected processing flow:');
console.log('1. section/song-card (HAS TAG) processes its children:');
console.log('   - img/song-img (HAS TAG) → should be direct child');
console.log('   - div/song-info (HAS TAG) → should be direct child');
console.log('   - button/play-song (HAS TAG) → should be direct child');

console.log('\n2. div/song-info (HAS TAG) processes its children:');
console.log('   - h3/song-name (HAS TAG) → should be child of div');
console.log('   - span/artist-name (HAS TAG) → should be child of div');

console.log('\n3. button/play-song (HAS TAG) processes its children:');
console.log('   - span (HAS TAG) → should be child of button');

console.log('\n=== PROBLEM ANALYSIS ===');
console.log('The issue is that img/song-img appears as child of button instead of section');
console.log('This suggests that the processing order or hierarchy logic is wrong');

console.log('\n=== EXPECTED JSON STRUCTURE ===');
const expectedStructure = {
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

console.log(JSON.stringify(expectedStructure, null, 2));