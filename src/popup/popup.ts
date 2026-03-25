/// <reference types="chrome" />
import { loadConfig, saveConfig } from '../shared/config';
import { Config } from '../shared/types';
import './popup.css';
import { getStatusInfo, renderGroupItem } from './popup-logic';

let currentConfig: Config | null = null;

/**
 * Updates the UI with current configuration
 */
async function updateUI(): Promise<void> {
  currentConfig = await loadConfig();

  // Update toggle
  const enabledToggle = document.getElementById('enabledToggle') as HTMLInputElement;
  if (enabledToggle) {
    enabledToggle.checked = currentConfig.enabled !== false;
  }

  // Update status
  const statusEl = document.getElementById('status');
  if (statusEl) {
    const { text, className } = getStatusInfo(currentConfig);
    statusEl.textContent = text;
    statusEl.className = className;
  }

  // Update groups list
  updateGroupsList();
}

/**
 * Updates the groups list display
 */
function updateGroupsList(): void {
  const groupsList = document.getElementById('groupsList');
  if (!groupsList || !currentConfig) {
    return;
  }

  if (currentConfig.groups.length === 0) {
    groupsList.innerHTML = '<div class="empty-state">No groups configured. Open Settings to add groups.</div>';
    return;
  }

  groupsList.innerHTML = currentConfig.groups.map(renderGroupItem).join('');
}

/**
 * Handles toggle change
 */
async function handleToggleChange(enabled: boolean): Promise<void> {
  if (!currentConfig) {
    return;
  }

  currentConfig.enabled = enabled;
  await saveConfig(currentConfig);
  await updateUI();
}

// Initialize UI
document.addEventListener('DOMContentLoaded', async () => {
  await updateUI();

  // Setup toggle
  const enabledToggle = document.getElementById('enabledToggle') as HTMLInputElement;
  if (enabledToggle) {
    enabledToggle.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      handleToggleChange(target.checked);
    });
  }

  // Setup settings button
  const openOptions = document.getElementById('openOptions');
  if (openOptions) {
    openOptions.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
    });
  }

  // Listen for config changes
  chrome.storage.onChanged.addListener((changes: { [key: string]: chrome.storage.StorageChange }, areaName: chrome.storage.AreaName) => {
    if (areaName === 'sync' && changes.tabGrouperConfig) {
      updateUI();
    }
  });
});
