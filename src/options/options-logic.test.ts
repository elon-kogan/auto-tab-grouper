jest.mock('../shared/utils');

import { isValidDomain } from '../shared/utils';
import { validateGroupData, parseGroupFromInputs, parseImportedConfig } from './options-logic';

const mockIsValidDomain = isValidDomain as jest.MockedFunction<typeof isValidDomain>;

beforeEach(() => {
  jest.clearAllMocks();
  mockIsValidDomain.mockReturnValue(true);
});

describe('validateGroupData', () => {
  it('returns true when title and domains are non-empty', () => {
    expect(validateGroupData('Work', ['github.com'])).toBe(true);
  });

  it('returns false when title is empty', () => {
    expect(validateGroupData('', ['github.com'])).toBe(false);
  });

  it('returns false when domains array is empty', () => {
    expect(validateGroupData('Work', [])).toBe(false);
  });

  it('returns false when both title and domains are empty', () => {
    expect(validateGroupData('', [])).toBe(false);
  });

  it('returns false for whitespace-only title', () => {
    expect(validateGroupData('   ', ['github.com'])).toBe(false);
  });
});

describe('parseGroupFromInputs', () => {
  it('returns a group for valid inputs', () => {
    const result = parseGroupFromInputs('Work', 'blue', 'github.com\njira.com');
    expect(result).toEqual({ title: 'Work', color: 'blue', domains: ['github.com', 'jira.com'] });
  });

  it('trims whitespace from title', () => {
    const result = parseGroupFromInputs('  Work  ', 'blue', 'github.com');
    expect(result?.title).toBe('Work');
  });

  it('filters out blank domain lines', () => {
    const result = parseGroupFromInputs('Work', 'blue', 'github.com\n\n  \njira.com');
    expect(result?.domains).toEqual(['github.com', 'jira.com']);
  });

  it('filters out invalid domains', () => {
    mockIsValidDomain.mockImplementation((d) => d === 'github.com');
    const result = parseGroupFromInputs('Work', 'blue', 'github.com\nnot-a-domain');
    expect(result?.domains).toEqual(['github.com']);
  });

  it('returns null when title is empty', () => {
    expect(parseGroupFromInputs('', 'blue', 'github.com')).toBeNull();
  });

  it('returns null when all domains are invalid', () => {
    mockIsValidDomain.mockReturnValue(false);
    expect(parseGroupFromInputs('Work', 'blue', 'not-valid')).toBeNull();
  });

  it('defaults color to grey when colorValue is empty', () => {
    const result = parseGroupFromInputs('Work', '', 'github.com');
    expect(result?.color).toBe('grey');
  });
});

describe('parseImportedConfig', () => {
  it('parses valid JSON config', () => {
    const config = { groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }], enabled: true };
    const result = parseImportedConfig(JSON.stringify(config));
    expect(result.groups).toHaveLength(1);
    expect(result.enabled).toBe(true);
  });

  it('defaults enabled to true when not set', () => {
    const config = { groups: [] };
    const result = parseImportedConfig(JSON.stringify(config));
    expect(result.enabled).toBe(true);
  });

  it('preserves enabled: false', () => {
    const config = { groups: [], enabled: false };
    const result = parseImportedConfig(JSON.stringify(config));
    expect(result.enabled).toBe(false);
  });

  it('throws on invalid JSON', () => {
    expect(() => parseImportedConfig('not json')).toThrow();
  });

  it('throws when groups field is missing', () => {
    expect(() => parseImportedConfig(JSON.stringify({ enabled: true }))).toThrow('Invalid configuration format');
  });

  it('throws when groups is not an array', () => {
    expect(() => parseImportedConfig(JSON.stringify({ groups: 'bad' }))).toThrow('Invalid configuration format');
  });

  it('throws when a group is missing title', () => {
    const config = { groups: [{ color: 'blue', domains: ['github.com'] }] };
    expect(() => parseImportedConfig(JSON.stringify(config))).toThrow('Invalid group structure');
  });

  it('throws when a group is missing domains', () => {
    const config = { groups: [{ title: 'Work', color: 'blue' }] };
    expect(() => parseImportedConfig(JSON.stringify(config))).toThrow('Invalid group structure');
  });

  it('throws when a group has non-array domains', () => {
    const config = { groups: [{ title: 'Work', color: 'blue', domains: 'github.com' }] };
    expect(() => parseImportedConfig(JSON.stringify(config))).toThrow('Invalid group structure');
  });

  it('throws when a group has an invalid color', () => {
    const config = { groups: [{ title: 'Work', color: 'invalid-color', domains: ['github.com'] }] };
    expect(() => parseImportedConfig(JSON.stringify(config))).toThrow('Invalid group color: invalid-color');
  });
});
