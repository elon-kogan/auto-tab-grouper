/// <reference types="chrome" />
import { loadConfig, initializeConfig } from '../shared/config';
import { extractDomain, isValidHttpUrl } from '../shared/utils';
import { TabGroupColor } from '../shared/types';

/**
 * Gets an existing group by title or creates a new one
 * @param title - Group title
 * @param color - Group color
 * @param tabId - Tab ID to add to the group
 * @returns Promise with the group ID
 */
async function getOrCreateGroup(
  title: string,
  color: TabGroupColor,
  tabId: number,
): Promise<number> {
  try {
    const groups = await chrome.tabGroups.query({});
    const existingGroup = groups.find((g: chrome.tabGroups.TabGroup) => g.title === title);

    if (existingGroup) {
      // Check if tab is already in the correct group
      const tab = await chrome.tabs.get(tabId);
      if (tab.groupId === existingGroup.id) {
        return existingGroup.id;
      }

      await chrome.tabs.group({ groupId: existingGroup.id, tabIds: tabId });
      return existingGroup.id;
    }

    // Create new group
    const newGroupId = await chrome.tabs.group({ tabIds: tabId });
    await chrome.tabGroups.update(newGroupId, { title, color });
    return newGroupId;
  } catch (error) {
    console.error(`Error managing group "${title}":`, error);
    throw error;
  }
}

/**
 * Groups a tab based on its domain according to configuration rules
 * @param tab - The tab to group
 */
async function groupTabByDomain(tab: chrome.tabs.Tab): Promise<void> {
  if (!tab.url || !tab.id || tab.pinned) {
    return;
  }

  // Skip chrome://, chrome-extension://, and other special URLs
  if (!isValidHttpUrl(tab.url)) {
    return;
  }

  try {
    const config = await loadConfig();

    // Check if extension is enabled
    if (config.enabled === false) {
      return;
    }

    const domain = extractDomain(tab.url);

    if (!domain) {
      return;
    }

    // Find matching group
    for (const group of config.groups) {
      if (group.domains && group.domains.includes(domain)) {
        await getOrCreateGroup(group.title, group.color, tab.id!);
        break;
      }
    }
  } catch (error) {
    console.error('Error grouping tab by domain:', error);
  }
}

// Initialize config on install/update
chrome.runtime.onInstalled.addListener(async () => {
  await initializeConfig();
});

// Group tab when it finishes loading
chrome.tabs.onUpdated.addListener((tabId: number, changeInfo: chrome.tabs.TabChangeInfo, tab: chrome.tabs.Tab) => {
  if (changeInfo.status === 'complete') {
    groupTabByDomain(tab);
  }
});

// Group tab when it's created
chrome.tabs.onCreated.addListener((tab: chrome.tabs.Tab) => {
  groupTabByDomain(tab);
});

// Listen for config changes to update badge
chrome.storage.onChanged.addListener(async (changes: { [key: string]: chrome.storage.StorageChange }, areaName: chrome.storage.AreaName) => {
  if (areaName === 'sync' && changes.tabGrouperConfig) {
    const config = changes.tabGrouperConfig.newValue;
    if (config && config.groups) {
      const activeGroups = config.groups.filter(
        (g: { domains: string[] }) => g.domains && g.domains.length > 0,
      ).length;
      chrome.action.setBadgeText({
        text: activeGroups > 0 ? String(activeGroups) : '',
      });
    }
  }
});

// Initialize badge on startup
chrome.runtime.onStartup.addListener(async () => {
  const config = await loadConfig();
  if (config.groups) {
    const activeGroups = config.groups.filter(
      (g) => g.domains && g.domains.length > 0,
    ).length;
    chrome.action.setBadgeText({
      text: activeGroups > 0 ? String(activeGroups) : '',
    });
  }
});
