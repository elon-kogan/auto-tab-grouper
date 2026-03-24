import { loadConfig, saveConfig, getDefaultConfig, initializeConfig } from './config';
import { DEFAULT_CONFIG } from './types';

describe('loadConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns DEFAULT_CONFIG when storage has no key', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({});
    expect(await loadConfig()).toEqual(DEFAULT_CONFIG);
  });

  it('returns DEFAULT_CONFIG when storage throws', async () => {
    (chrome.storage.sync.get as jest.Mock).mockRejectedValue(new Error('storage error'));
    expect(await loadConfig()).toEqual(DEFAULT_CONFIG);
  });

  it('returns DEFAULT_CONFIG for malformed data (missing groups)', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({
      tabGrouperConfig: { enabled: true },
    });
    expect(await loadConfig()).toEqual(DEFAULT_CONFIG);
  });

  it('returns DEFAULT_CONFIG for malformed data (groups not array)', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({
      tabGrouperConfig: { groups: 'bad', enabled: true },
    });
    expect(await loadConfig()).toEqual(DEFAULT_CONFIG);
  });

  it('returns stored config when valid', async () => {
    const stored = {
      groups: [{ title: 'Work', color: 'blue' as const, domains: ['github.com'] }],
      enabled: true,
    };
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({ tabGrouperConfig: stored });
    expect(await loadConfig()).toEqual(stored);
  });

  it('sets enabled=true when missing from stored config', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({
      tabGrouperConfig: { groups: [] },
    });
    const config = await loadConfig();
    expect(config.enabled).toBe(true);
  });
});

describe('saveConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('saves config to chrome.storage.sync', async () => {
    (chrome.storage.sync.set as jest.Mock).mockResolvedValue(undefined);
    const config = { groups: [], enabled: true };
    await saveConfig(config);
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({ tabGrouperConfig: config });
  });

  it('throws when storage write fails', async () => {
    (chrome.storage.sync.set as jest.Mock).mockRejectedValue(new Error('write error'));
    await expect(saveConfig({ groups: [], enabled: true })).rejects.toThrow('write error');
  });
});

describe('getDefaultConfig', () => {
  it('returns config with empty groups and enabled=true', () => {
    const config = getDefaultConfig();
    expect(config.groups).toEqual([]);
    expect(config.enabled).toBe(true);
  });
});

describe('initializeConfig', () => {
  beforeEach(() => {
    jest.clearAllMocks();
(globalThis as any).fetch = jest.fn();
    (chrome.runtime.getURL as jest.Mock).mockReturnValue('chrome-extension://id/config.json');
  });

  it('does nothing if config already exists', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({
      tabGrouperConfig: { groups: [], enabled: true },
    });
    await initializeConfig();
    expect(chrome.storage.sync.set).not.toHaveBeenCalled();
  });

  it('migrates config from config.json if it exists', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({});
    (globalThis as any).fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
      }),
    });
    (chrome.storage.sync.set as jest.Mock).mockResolvedValue(undefined);
    await initializeConfig();
    expect(chrome.storage.sync.set).toHaveBeenCalled();
  });

  it('initializes with empty config when config.json has no groups', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({});
    (globalThis as any).fetch.mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ notGroups: [] }),
    });
    (chrome.storage.sync.set as jest.Mock).mockResolvedValue(undefined);
    await initializeConfig();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      tabGrouperConfig: { groups: [], enabled: true },
    });
  });

  it('initializes with empty config when config.json returns not ok', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({});
    (globalThis as any).fetch.mockResolvedValue({ ok: false });
    (chrome.storage.sync.set as jest.Mock).mockResolvedValue(undefined);
    await initializeConfig();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      tabGrouperConfig: { groups: [], enabled: true },
    });
  });

  it('initializes with empty config when fetch throws', async () => {
    (chrome.storage.sync.get as jest.Mock).mockResolvedValue({});
    (globalThis as any).fetch.mockRejectedValue(new Error('network'));
    (chrome.storage.sync.set as jest.Mock).mockResolvedValue(undefined);
    await initializeConfig();
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      tabGrouperConfig: { groups: [], enabled: true },
    });
  });

  it('handles outer catch when storage.get throws', async () => {
    (chrome.storage.sync.get as jest.Mock).mockRejectedValue(new Error('get error'));
    (chrome.storage.sync.set as jest.Mock).mockResolvedValue(undefined);
    await initializeConfig();
    // Should attempt to save default config as fallback
    expect(chrome.storage.sync.set).toHaveBeenCalledWith({
      tabGrouperConfig: { groups: [], enabled: true },
    });
  });

  it('handles error when fallback saveConfig also throws', async () => {
    (chrome.storage.sync.get as jest.Mock).mockRejectedValue(new Error('get error'));
    (chrome.storage.sync.set as jest.Mock).mockRejectedValue(new Error('set error'));
    // Should not throw, just log the error
    await expect(initializeConfig()).resolves.toBeUndefined();
  });
});
