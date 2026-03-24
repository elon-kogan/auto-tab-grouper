/**
 * Extracts the domain from a URL, removing www prefix
 * @param url - The URL to extract domain from
 * @returns The domain name or empty string if invalid
 */
export function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch (error) {
    return '';
  }
}

/**
 * Checks if a URL is a valid HTTP/HTTPS URL
 * @param url - The URL to check
 * @returns True if the URL is HTTP or HTTPS
 */
export function isValidHttpUrl(url: string): boolean {
  return url.startsWith('http://') || url.startsWith('https://');
}

/**
 * Validates a domain string
 * @param domain - The domain to validate
 * @returns True if the domain is valid
 */
export function isValidDomain(domain: string): boolean {
  if (!domain || domain.trim().length === 0) {
    return false;
  }
  try {
    // Try to create a URL with the domain
    new URL(`https://${domain}`);
    return true;
  } catch {
    return false;
  }
}
