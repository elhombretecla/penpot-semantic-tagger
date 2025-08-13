/**
 * Penpot configuration utilities
 * Provides centralized configuration for Penpot-specific settings
 */

import { setPenpotBaseUrl, getCurrentPenpotBaseUrl } from './extractors/visual-extractor';

/**
 * Initialize Penpot configuration based on environment detection
 */
export function initializePenpotConfig(): void {
  const detectedUrl = getCurrentPenpotBaseUrl();
  console.log('🔧 Penpot configuration initialized with base URL:', detectedUrl);
  
  // Log environment information for debugging
  if (typeof window !== 'undefined') {
    console.log('🔧 Environment info:', {
      hostname: window.location.hostname,
      protocol: window.location.protocol,
      port: window.location.port,
      referrer: document.referrer,
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
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
 * Get the current Penpot base URL
 */
export function getPenpotBaseUrl(): string {
  return getCurrentPenpotBaseUrl();
}

/**
 * Common Penpot production URLs for reference
 */
export const COMMON_PENPOT_URLS = {
  OFFICIAL_CLOUD: 'https://design.penpot.app',
  LOCALHOST_DEV: 'http://localhost:3449',
  LOCALHOST_ALT: 'http://localhost:3000'
} as const;