/**
 * Penpot configuration utilities
 * Provides centralized configuration for Penpot-specific settings
 */

import { setPenpotBaseUrl } from './extractors/visual-extractor';

/**
 * Initialize Penpot configuration with simplified URL handling
 */
export function initializePenpotConfig(): void {
  const detectedUrl = getPenpotBaseUrl();
  console.log('🔧 Penpot configuration initialized with base URL:', detectedUrl);

  // Log environment information for debugging
  if (typeof window !== 'undefined') {
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    console.log('🔧 Environment info:', {
      hostname: window.location.hostname,
      isLocalhost,
      baseUrl: detectedUrl
    });
  }
}

/**
 * Manually configure Penpot base URL for specific deployments
 * @param url The base URL to use (e.g., 'https://design.penpot.app')
 */
export function configurePenpotBaseUrl(url: string): void {
  setPenpotBaseUrl(url);
}

/**
 * Get the current Penpot base URL (matches the logic in visual-extractor)
 */
export function getPenpotBaseUrl(): string {
  // Check if we're in a development environment
  if (typeof window !== 'undefined' && window.location) {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:3449';
    }
  }

  // For all other cases (production), use the official Penpot cloud URL
  return 'https://design.penpot.app';
}

/**
 * Common Penpot production URLs for reference
 */
export const COMMON_PENPOT_URLS = {
  OFFICIAL_CLOUD: 'https://design.penpot.app',
  LOCALHOST_DEV: 'http://localhost:3449',
  LOCALHOST_ALT: 'http://localhost:3000'
} as const;