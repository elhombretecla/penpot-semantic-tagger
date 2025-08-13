/**
 * Test utilities for URL detection
 * This file can be used to test the URL detection logic in different environments
 */

import { getPenpotBaseUrl, configurePenpotBaseUrl } from './penpot-config';

/**
 * Test the URL detection in the current environment
 */
export function testUrlDetection(): void {
  console.log('🧪 Testing Penpot URL detection...');
  
  // Test automatic detection
  const autoDetectedUrl = getPenpotBaseUrl();
  console.log('🔍 Auto-detected URL:', autoDetectedUrl);
  
  // Test environment information
  if (typeof window !== 'undefined') {
    console.log('🌍 Environment details:', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      href: window.location.href,
      referrer: document.referrer,
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      hasParent: window.parent !== window
    });
  }
  
  // Test manual configuration
  console.log('🧪 Testing manual configuration...');
  configurePenpotBaseUrl('https://design.penpot.app');
  const manualUrl = getPenpotBaseUrl();
  console.log('🔧 Manual URL:', manualUrl);
  
  // Reset to auto-detection
  configurePenpotBaseUrl('');
  const resetUrl = getPenpotBaseUrl();
  console.log('🔄 Reset to auto-detection:', resetUrl);
}

/**
 * Simulate different environments for testing
 */
export function simulateEnvironments(): void {
  console.log('🧪 Simulating different environments...');
  
  const testCases = [
    'https://design.penpot.app',
    'https://my-company.penpot.app',
    'https://penpot.example.com',
    'http://localhost:3449',
    'http://localhost:3000'
  ];
  
  testCases.forEach(url => {
    console.log(`🧪 Testing with base URL: ${url}`);
    configurePenpotBaseUrl(url);
    
    // Simulate building an image URL
    const testImageId = 'e7c4c89b-e760-8199-8006-91e0f8ffc445';
    const imageUrl = `${getPenpotBaseUrl()}/assets/by-file-media-id/${testImageId}`;
    console.log(`🖼️ Generated image URL: ${imageUrl}`);
  });
  
  // Reset
  configurePenpotBaseUrl('');
}