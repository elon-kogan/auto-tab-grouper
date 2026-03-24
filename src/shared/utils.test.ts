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

  it('handles chrome:// URL (parses hostname as "settings")', () => {
    // chrome:// is parsed as a valid URL in Node.js; hostname = "settings"
    expect(extractDomain('chrome://settings')).toBe('settings');
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
    expect(isValidDomain('exam^ple.com')).toBe(false);
  });

  it('returns true for domain containing @ (known limitation)', () => {
    // new URL('https://legit.com@evil.com').hostname === 'evil.com'
    // The URL parser treats @ as a userinfo separator, so isValidDomain passes
    // but the effective hostname is evil.com — callers should be aware of this.
    expect(isValidDomain('legit.com@evil.com')).toBe(true);
  });

  it('returns true for domain with port (known limitation)', () => {
    // new URL('https://example.com:8080').hostname === 'example.com' (port stripped)
    // isValidDomain passes, but extractDomain also strips the port, so
    // storing 'example.com:8080' as a rule will never match any tab URL.
    expect(isValidDomain('example.com:8080')).toBe(true);
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
