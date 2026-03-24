/// <reference types="chrome" />
import { loadConfig, saveConfig } from '../shared/config';
import { Config, TabGroupConfig } from '../shared/types';
import './popup.css';

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
    if (currentConfig.enabled === false) {
      statusEl.textContent = 'Extension is disabled';
      statusEl.className = 'status disabled';
    } else {
      const activeGroups = currentConfig.groups.filter(
        (g) => g.domains && g.domains.length > 0,
      ).length;
      statusEl.textContent = `Active: ${activeGroups} group${activeGroups !== 1 ? 's' : ''}`;
      statusEl.className = 'status';
    }
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

  groupsList.innerHTML = currentConfig.groups
    .map((group: TabGroupConfig) => {
      const domainCount = group.domains ? group.domains.length : 0;
      return `
        <div class="group-item">
          <div class="group-info">
            <div class="group-color color-${group.color}"></div>
            <div>
              <div class="group-title">${escapeHtml(group.title)}</div>
              <div class="group-domains">${domainCount} domain${domainCount !== 1 ? 's' : ''}</div>
            </div>
          </div>
        </div>
      `;
    })
    .join('');
}

/**
 * Escapes HTML to prevent XSS
 */
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
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
