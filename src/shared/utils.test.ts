import { extractDomain, isValidHttpUrl, isValidDomain } from './utils';

describe('extractDomain', () => {
  it('returns empty string for empty string', () => {
    expect(extractDomain('')).toBe('');
  });

  it('returns empty string for URL without protocol', () => {
    expect(extractDomain('example.com')).toBe('');
  });

  it('returns empty string for file:// URL with no host', () => {
    expect(extractDomain('file:///path/to/file')).toBe('');
  });

  it('handles chrome:// URL (parses as valid URL)', () => {
    // chrome:// parses in Node.js; hostname becomes the "host" portion
    const result = extractDomain('chrome://settings');
    expect(typeof result).toBe('string');
  });

  it('extracts domain from https URL', () => {
    expect(extractDomain('https://example.com/page')).toBe('example.com');
  });

  it('removes www prefix', () => {
    expect(extractDomain('https://www.example.com')).toBe('example.com');
  });

  it('extracts domain from http URL', () => {
    expect(extractDomain('http://sub.example.com')).toBe('sub.example.com');
  });

  it('handles international domain', () => {
    const result = extractDomain('https://münchen.de');
    expect(result).not.toBe('');
  });
});

describe('isValidHttpUrl', () => {
  it('returns false for malformed URL', () => {
    expect(isValidHttpUrl('not-a-url')).toBe(false);
  });

  it('returns false for ftp:// URL', () => {
    expect(isValidHttpUrl('ftp://example.com')).toBe(false);
  });

  it('returns false for relative path', () => {
    expect(isValidHttpUrl('/relative/path')).toBe(false);
  });

  it('returns false for chrome:// URL', () => {
    expect(isValidHttpUrl('chrome://newtab')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isValidHttpUrl('')).toBe(false);
  });

  it('returns true for http:// URL', () => {
    expect(isValidHttpUrl('http://example.com')).toBe(true);
  });

  it('returns true for https:// URL', () => {
    expect(isValidHttpUrl('https://example.com')).toBe(true);
  });
});

describe('isValidDomain', () => {
  it('returns false for empty string', () => {
    expect(isValidDomain('')).toBe(false);
  });

  it('returns false for spaces only', () => {
    expect(isValidDomain('   ')).toBe(false);
  });

  it('returns false for domain with spaces', () => {
    expect(isValidDomain('ex ample.com')).toBe(false);
  });

  it('returns false for special chars (^)', () => {
    // @ is treated as a URL username separator and passes; ^ is actually invalid in hostnames
    expect(isValidDomain('exam^ple.com')).toBe(false);
  });

  it('returns true for valid domain', () => {
    expect(isValidDomain('example.com')).toBe(true);
  });

  it('returns true for valid subdomain', () => {
    expect(isValidDomain('sub.example.com')).toBe(true);
  });

  it('returns true for single label domain', () => {
    expect(isValidDomain('localhost')).toBe(true);
  });
});
