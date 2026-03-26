import { getStatusInfo, escapeHtml, renderGroupItem } from './popup-logic';
import { Config, TabGroupConfig } from '../shared/types';

describe('getStatusInfo', () => {
  it('returns disabled status when enabled is false', () => {
    const config: Config = { groups: [], enabled: false };
    const result = getStatusInfo(config);
    expect(result.text).toBe('Extension is disabled');
    expect(result.className).toBe('status disabled');
  });

  it('returns active count when enabled', () => {
    const config: Config = {
      groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
      enabled: true,
    };
    const result = getStatusInfo(config);
    expect(result.text).toBe('Active: 1 group');
    expect(result.className).toBe('status');
  });

  it('uses plural for multiple groups', () => {
    const config: Config = {
      groups: [
        { title: 'Work', color: 'blue', domains: ['github.com'] },
        { title: 'Social', color: 'red', domains: ['twitter.com'] },
      ],
      enabled: true,
    };
    expect(getStatusInfo(config).text).toBe('Active: 2 groups');
  });

  it('returns 0 groups when no groups configured', () => {
    const config: Config = { groups: [], enabled: true };
    expect(getStatusInfo(config).text).toBe('Active: 0 groups');
  });

  it('does not count groups with empty domains', () => {
    const config: Config = {
      groups: [{ title: 'Empty', color: 'grey', domains: [] }],
      enabled: true,
    };
    expect(getStatusInfo(config).text).toBe('Active: 0 groups');
  });
});

describe('escapeHtml', () => {
  it('returns plain text unchanged', () => {
    expect(escapeHtml('hello world')).toBe('hello world');
  });

  it('escapes < and > to prevent XSS', () => {
    expect(escapeHtml('<script>alert(1)</script>')).toBe('&lt;script&gt;alert(1)&lt;/script&gt;');
  });

  it('escapes & character', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
  });

  it('escapes double quotes', () => {
    expect(escapeHtml('"quoted"')).toBe('&quot;quoted&quot;');
  });

  it('escapes single quotes', () => {
    expect(escapeHtml("it's")).toBe('it&#039;s');
  });

  it('handles empty string', () => {
    expect(escapeHtml('')).toBe('');
  });
});

describe('renderGroupItem', () => {
  const group: TabGroupConfig = { title: 'Work', color: 'blue', domains: ['github.com', 'jira.com'] };

  it('includes the group title', () => {
    expect(renderGroupItem(group)).toContain('Work');
  });

  it('includes the color class', () => {
    expect(renderGroupItem(group)).toContain('color-blue');
  });

  it('shows correct domain count', () => {
    expect(renderGroupItem(group)).toContain('2 domains');
  });

  it('uses singular for 1 domain', () => {
    const g: TabGroupConfig = { title: 'Solo', color: 'red', domains: ['example.com'] };
    expect(renderGroupItem(g)).toContain('1 domain');
    expect(renderGroupItem(g)).not.toContain('1 domains');
  });

  it('escapes HTML in title to prevent XSS', () => {
    const malicious: TabGroupConfig = { title: '<img src=x onerror=alert(1)>', color: 'grey', domains: [] };
    const html = renderGroupItem(malicious);
    expect(html).not.toContain('<img');
    expect(html).toContain('&lt;img');
  });

  it('escapes HTML in color to prevent injection', () => {
    const malicious = { title: 'X', color: '" onmouseover="alert(1)', domains: [] } as unknown as TabGroupConfig;
    const html = renderGroupItem(malicious);
    // Raw unescaped quote must not appear — it would break the attribute boundary
    expect(html).not.toContain('color-"');
    // The quote is safely escaped as &quot;
    expect(html).toContain('color-&quot;');
  });
});
