jest.mock('../shared/config');
jest.mock('../shared/utils');

import { loadConfig, initializeConfig } from '../shared/config';
import { extractDomain, isValidHttpUrl } from '../shared/utils';

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockInitializeConfig = initializeConfig as jest.MockedFunction<typeof initializeConfig>;
const mockIsValidHttpUrl = isValidHttpUrl as jest.MockedFunction<typeof isValidHttpUrl>;
const mockExtractDomain = extractDomain as jest.MockedFunction<typeof extractDomain>;

// Import background module — registers event listeners as a side effect
import './background';

// Helper: flush the microtask queue so fire-and-forget async functions complete
const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe('background', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockInitializeConfig.mockResolvedValue(undefined);
    mockLoadConfig.mockResolvedValue({ groups: [], enabled: true });
    mockIsValidHttpUrl.mockReturnValue(true);
    mockExtractDomain.mockReturnValue('example.com');
    (chrome.tabGroups.query as jest.Mock).mockResolvedValue([]);
    (chrome.tabs.group as jest.Mock).mockResolvedValue(1);
    (chrome.tabGroups.update as jest.Mock).mockResolvedValue({});
    (chrome.action.setBadgeText as jest.Mock).mockResolvedValue(undefined);
  });

  // ── Listener registration ──────────────────────────────────────────────────

  describe('listener registration', () => {
    it('registers onInstalled listener', () => {
      expect((chrome.runtime.onInstalled as any).hasListeners()).toBe(true);
    });

    it('registers onUpdated listener', () => {
      expect((chrome.tabs.onUpdated as any).hasListeners()).toBe(true);
    });

    it('registers onCreated listener', () => {
      expect((chrome.tabs.onCreated as any).hasListeners()).toBe(true);
    });

    it('registers storage onChanged listener', () => {
      expect((chrome.storage.onChanged as any).hasListeners()).toBe(true);
    });

    it('registers onStartup listener', () => {
      expect((chrome.runtime.onStartup as any).hasListeners()).toBe(true);
    });
  });

  // ── onInstalled ────────────────────────────────────────────────────────────

  describe('onInstalled', () => {
    it('calls initializeConfig', async () => {
      const [listener] = (chrome.runtime.onInstalled as any).getListeners() as Set<() => Promise<void>>;
      await listener();
      expect(mockInitializeConfig).toHaveBeenCalled();
    });
  });

  // ── onStartup ──────────────────────────────────────────────────────────────

  describe('onStartup', () => {
    it('sets badge text based on active groups', async () => {
      mockLoadConfig.mockResolvedValue({
        groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
        enabled: true,
      });
      const [listener] = (chrome.runtime.onStartup as any).getListeners() as Set<() => Promise<void>>;
      await listener();
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '1' });
    });

    it('clears badge when no groups have domains', async () => {
      mockLoadConfig.mockResolvedValue({ groups: [], enabled: true });
      const [listener] = (chrome.runtime.onStartup as any).getListeners() as Set<() => Promise<void>>;
      await listener();
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '' });
    });

    it('does nothing when config.groups is undefined', async () => {
      mockLoadConfig.mockResolvedValue({ enabled: true } as any);
      const [listener] = (chrome.runtime.onStartup as any).getListeners() as Set<() => Promise<void>>;
      await listener();
      expect(chrome.action.setBadgeText).not.toHaveBeenCalled();
    });
  });

  // ── onUpdated ──────────────────────────────────────────────────────────────

  describe('onUpdated', () => {
    it('calls groupTabByDomain when status is complete', async () => {
      const tab = { id: 1, url: 'https://example.com', pinned: false } as chrome.tabs.Tab;
      (chrome.tabs.onUpdated as any).callListeners(1, { status: 'complete' }, tab);
      await flushPromises();
      expect(mockLoadConfig).toHaveBeenCalled();
    });

    it('does nothing when status is not complete', async () => {
      const tab = { id: 1, url: 'https://example.com', pinned: false } as chrome.tabs.Tab;
      (chrome.tabs.onUpdated as any).callListeners(1, { status: 'loading' }, tab);
      await flushPromises();
      expect(mockLoadConfig).not.toHaveBeenCalled();
    });
  });

  // ── onCreated ──────────────────────────────────────────────────────────────

  describe('onCreated', () => {
    it('calls groupTabByDomain for new tabs', async () => {
      const tab = { id: 1, url: 'https://example.com', pinned: false } as chrome.tabs.Tab;
      (chrome.tabs.onCreated as any).callListeners(tab);
      await flushPromises();
      expect(mockLoadConfig).toHaveBeenCalled();
    });
  });

  // ── storage onChanged ──────────────────────────────────────────────────────

  describe('storage onChanged', () => {
    it('updates badge when tabGrouperConfig changes in sync area', async () => {
      const changes = {
        tabGrouperConfig: {
          newValue: {
            groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
          },
        },
      };
      (chrome.storage.onChanged as any).callListeners(changes, 'sync');
      await flushPromises();
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '1' });
    });

    it('clears badge when no groups have domains', async () => {
      const changes = {
        tabGrouperConfig: { newValue: { groups: [] } },
      };
      (chrome.storage.onChanged as any).callListeners(changes, 'sync');
      await flushPromises();
      expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: '' });
    });

    it('does nothing for non-sync area', async () => {
      (chrome.storage.onChanged as any).callListeners({}, 'local');
      await flushPromises();
      expect(chrome.action.setBadgeText).not.toHaveBeenCalled();
    });

    it('does nothing when tabGrouperConfig is not in changes', async () => {
      (chrome.storage.onChanged as any).callListeners({ otherKey: {} }, 'sync');
      await flushPromises();
      expect(chrome.action.setBadgeText).not.toHaveBeenCalled();
    });

    it('does nothing when newValue is null', async () => {
      const changes = { tabGrouperConfig: { newValue: null } };
      (chrome.storage.onChanged as any).callListeners(changes, 'sync');
      await flushPromises();
      expect(chrome.action.setBadgeText).not.toHaveBeenCalled();
    });
  });

  // ── groupTabByDomain (via onCreated) ───────────────────────────────────────

  describe('groupTabByDomain', () => {
    const triggerTab = async (tab: Partial<chrome.tabs.Tab>) => {
      (chrome.tabs.onCreated as any).callListeners(tab as chrome.tabs.Tab);
      await flushPromises();
    };

    it('does nothing for tab without URL', async () => {
      await triggerTab({ id: 1, pinned: false });
      expect(mockLoadConfig).not.toHaveBeenCalled();
    });

    it('does nothing for tab without ID', async () => {
      await triggerTab({ url: 'https://example.com', pinned: false } as any);
      expect(mockLoadConfig).not.toHaveBeenCalled();
    });

    it('does nothing for pinned tab', async () => {
      await triggerTab({ id: 1, url: 'https://example.com', pinned: true });
      expect(mockLoadConfig).not.toHaveBeenCalled();
    });

    it('does nothing for non-http URL', async () => {
      mockIsValidHttpUrl.mockReturnValue(false);
      await triggerTab({ id: 1, url: 'chrome://newtab', pinned: false });
      expect(mockLoadConfig).not.toHaveBeenCalled();
    });

    it('does nothing when extension is disabled', async () => {
      mockLoadConfig.mockResolvedValue({ groups: [], enabled: false });
      await triggerTab({ id: 1, url: 'https://example.com', pinned: false });
      expect(mockExtractDomain).not.toHaveBeenCalled();
    });

    it('does nothing when extractDomain returns empty string', async () => {
      mockExtractDomain.mockReturnValue('');
      await triggerTab({ id: 1, url: 'https://example.com', pinned: false });
      expect(chrome.tabGroups.query).not.toHaveBeenCalled();
    });

    it('does nothing when no matching group for domain', async () => {
      mockLoadConfig.mockResolvedValue({
        groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
        enabled: true,
      });
      mockExtractDomain.mockReturnValue('example.com');
      await triggerTab({ id: 1, url: 'https://example.com', pinned: false });
      expect(chrome.tabGroups.query).not.toHaveBeenCalled();
    });

    it('groups tab when domain matches a configured group', async () => {
      mockLoadConfig.mockResolvedValue({
        groups: [{ title: 'Work', color: 'blue', domains: ['example.com'] }],
        enabled: true,
      });
      mockExtractDomain.mockReturnValue('example.com');
      await triggerTab({ id: 1, url: 'https://example.com', pinned: false });
      expect(chrome.tabGroups.query).toHaveBeenCalled();
    });

    it('handles error in groupTabByDomain gracefully', async () => {
      mockLoadConfig.mockRejectedValue(new Error('load error'));
      await expect(
        triggerTab({ id: 1, url: 'https://example.com', pinned: false }),
      ).resolves.toBeUndefined();
    });
  });

  // ── getOrCreateGroup (via onCreated with matching domain) ──────────────────

  describe('getOrCreateGroup', () => {
    const triggerMatchingTab = async () => {
      mockLoadConfig.mockResolvedValue({
        groups: [{ title: 'Work', color: 'blue', domains: ['example.com'] }],
        enabled: true,
      });
      mockExtractDomain.mockReturnValue('example.com');
      (chrome.tabs.onCreated as any).callListeners({
        id: 1,
        url: 'https://example.com',
        pinned: false,
      } as chrome.tabs.Tab);
      await flushPromises();
    };

    it('creates new group when no existing group matches', async () => {
      (chrome.tabGroups.query as jest.Mock).mockResolvedValue([]);
      (chrome.tabs.group as jest.Mock).mockResolvedValue(42);
      await triggerMatchingTab();
      expect(chrome.tabs.group).toHaveBeenCalledWith({ tabIds: 1 });
      expect(chrome.tabGroups.update).toHaveBeenCalledWith(42, { title: 'Work', color: 'blue' });
    });

    it('adds tab to existing group when title matches', async () => {
      (chrome.tabGroups.query as jest.Mock).mockResolvedValue([{ id: 10, title: 'Work' }]);
      (chrome.tabs.get as jest.Mock).mockResolvedValue({ id: 1, groupId: -1 });
      await triggerMatchingTab();
      expect(chrome.tabs.group).toHaveBeenCalledWith({ groupId: 10, tabIds: 1 });
    });

    it('does nothing when tab is already in the correct group', async () => {
      (chrome.tabGroups.query as jest.Mock).mockResolvedValue([{ id: 10, title: 'Work' }]);
      (chrome.tabs.get as jest.Mock).mockResolvedValue({ id: 1, groupId: 10 });
      await triggerMatchingTab();
      expect(chrome.tabs.group).not.toHaveBeenCalled();
    });

    it('handles error in getOrCreateGroup gracefully', async () => {
      (chrome.tabGroups.query as jest.Mock).mockRejectedValue(new Error('API error'));
      await expect(triggerMatchingTab()).resolves.toBeUndefined();
    });
  });
});
