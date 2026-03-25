/// <reference types="chrome" />
import { loadConfig, saveConfig } from '../shared/config';
import { Config, TabGroupConfig } from '../shared/types';
import './options.css';
import { validateGroupData, parseGroupFromInputs, parseImportedConfig } from './options-logic';

let currentConfig: Config | null = null;
let hasUnsavedChanges = false;

/**
 * Renders all groups in the UI
 */
function renderGroups(): void {
  const container = document.getElementById('groupsContainer');
  const emptyState = document.getElementById('emptyState');
  const template = document.getElementById('groupTemplate') as HTMLTemplateElement;

  if (!container || !template) {
    return;
  }

  container.innerHTML = '';

  if (!currentConfig || currentConfig.groups.length === 0) {
    if (emptyState) {
      emptyState.style.display = 'block';
    }
    return;
  }

  if (emptyState) {
    emptyState.style.display = 'none';
  }

  currentConfig.groups.forEach((group, index) => {
    const clone = template.content.cloneNode(true) as DocumentFragment;
    const card = clone.querySelector('.group-card') as HTMLElement;
    const titleInput = clone.querySelector('.group-title-input') as HTMLInputElement;
    const colorSelect = clone.querySelector('.group-color-select') as HTMLSelectElement;
    const domainsInput = clone.querySelector('.domains-input') as HTMLTextAreaElement;
    const deleteBtn = clone.querySelector('.delete-group') as HTMLButtonElement;
    const domainCount = clone.querySelector('.domain-count') as HTMLElement;

    if (card) {
      card.setAttribute('data-group-index', String(index));
    }

    if (titleInput) {
      titleInput.value = group.title;
      titleInput.addEventListener('input', () => {
        markUnsavedChanges();
        validateGroup(card);
      });
    }

    if (colorSelect) {
      colorSelect.value = group.color;
      colorSelect.addEventListener('change', () => {
        markUnsavedChanges();
      });
    }

    if (domainsInput) {
      const domains = group.domains ? group.domains.join('\n') : '';
      domainsInput.value = domains;
      updateDomainCount(domainsInput, domainCount);
      domainsInput.addEventListener('input', () => {
        markUnsavedChanges();
        updateDomainCount(domainsInput, domainCount);
        validateGroup(card);
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        deleteGroup(index);
      });
    }

    container.appendChild(clone);
    validateGroup(card);
  });
}

/**
 * Updates the domain count display
 */
function updateDomainCount(textarea: HTMLTextAreaElement, countEl: HTMLElement): void {
  const domains = textarea.value
    .split('\n')
    .map((d) => d.trim())
    .filter((d) => d.length > 0);
  countEl.textContent = `${domains.length} domain${domains.length !== 1 ? 's' : ''}`;
}

/**
 * Validates a group card
 */
function validateGroup(card: HTMLElement): void {
  const titleInput = card.querySelector('.group-title-input') as HTMLInputElement;
  const domainsInput = card.querySelector('.domains-input') as HTMLTextAreaElement;

  const title = titleInput?.value.trim() || '';
  const domains = domainsInput?.value
    .split('\n')
    .map((d) => d.trim())
    .filter((d) => d.length > 0) || [];

  if (validateGroupData(title, domains)) {
    card.classList.remove('invalid');
  } else {
    card.classList.add('invalid');
  }
}

/**
 * Collects data from all group cards
 */
function collectGroupsFromUI(): TabGroupConfig[] {
  const cards = document.querySelectorAll('.group-card');
  const groups: TabGroupConfig[] = [];

  cards.forEach((card) => {
    const titleInput = card.querySelector('.group-title-input') as HTMLInputElement;
    const colorSelect = card.querySelector('.group-color-select') as HTMLSelectElement;
    const domainsInput = card.querySelector('.domains-input') as HTMLTextAreaElement;

    const group = parseGroupFromInputs(
      titleInput?.value || '',
      colorSelect?.value || 'grey',
      domainsInput?.value || '',
    );
    if (group) groups.push(group);
  });

  return groups;
}

/**
 * Adds a new group
 */
function addGroup(): void {
  if (!currentConfig) {
    currentConfig = { groups: [], enabled: true };
  }

  currentConfig.groups.push({
    title: '',
    color: 'blue',
    domains: [],
  });

  renderGroups();
  markUnsavedChanges();

  // Focus on the new group's title input
  const cards = document.querySelectorAll('.group-card');
  const lastCard = cards[cards.length - 1] as HTMLElement;
  const titleInput = lastCard?.querySelector('.group-title-input') as HTMLInputElement;
  if (titleInput) {
    titleInput.focus();
  }
}

/**
 * Deletes a group
 */
function deleteGroup(index: number): void {
  if (!currentConfig || !confirm('Are you sure you want to delete this group?')) {
    return;
  }

  currentConfig.groups.splice(index, 1);
  renderGroups();
  markUnsavedChanges();
}

/**
 * Saves the configuration
 */
async function saveConfiguration(): Promise<void> {
  const groups = collectGroupsFromUI();

  // Validate all groups
  const invalidCards = document.querySelectorAll('.group-card.invalid');
  if (invalidCards.length > 0) {
    showSaveStatus('Please fix invalid groups before saving', 'error');
    return;
  }

  if (!currentConfig) {
    currentConfig = { groups: [], enabled: true };
  }

  currentConfig.groups = groups;
  currentConfig.enabled = currentConfig.enabled !== false;

  try {
    await saveConfig(currentConfig);
    hasUnsavedChanges = false;
    showSaveStatus('Settings saved successfully!', 'success');
    setTimeout(() => {
      showSaveStatus('');
    }, 2000);
  } catch (error) {
    console.error('Error saving config:', error);
    showSaveStatus('Error saving settings. Please try again.', 'error');
  }
}

/**
 * Exports configuration to JSON file
 */
function exportConfig(): void {
  if (!currentConfig) {
    return;
  }

  const dataStr = JSON.stringify(currentConfig, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'tab-grouper-config.json';
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Imports configuration from JSON file
 */
async function importConfig(file: File): Promise<void> {
  try {
    const text = await file.text();
    currentConfig = parseImportedConfig(text);
    renderGroups();
    markUnsavedChanges();
    showSaveStatus('Configuration imported. Click "Save Changes" to apply.', 'success');
    setTimeout(() => {
      showSaveStatus('');
    }, 3000);
  } catch (error) {
    console.error('Error importing config:', error);
    showSaveStatus('Error importing configuration. Please check the file format.', 'error');
    setTimeout(() => {
      showSaveStatus('');
    }, 3000);
  }
}

/**
 * Shows save status message
 */
function showSaveStatus(message: string, type: 'success' | 'error' | '' = ''): void {
  const statusEl = document.getElementById('saveStatus');
  if (statusEl) {
    statusEl.textContent = message;
    statusEl.className = `save-status ${type}`;
  }
}

/**
 * Marks that there are unsaved changes
 */
function markUnsavedChanges(): void {
  hasUnsavedChanges = true;
}

// Warn before leaving with unsaved changes
window.addEventListener('beforeunload', (e) => {
  if (hasUnsavedChanges) {
    e.preventDefault();
    e.returnValue = '';
  }
});

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
  currentConfig = await loadConfig();

  // Ensure config exists
  if (!currentConfig) {
    currentConfig = { groups: [], enabled: true };
  }

  renderGroups();

  // Setup event listeners
  const addGroupBtn = document.getElementById('addGroup');
  if (addGroupBtn) {
    addGroupBtn.addEventListener('click', addGroup);
  }

  const saveBtn = document.getElementById('saveBtn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveConfiguration);
  }

  const exportBtn = document.getElementById('exportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', exportConfig);
  }

  const importBtn = document.getElementById('importBtn');
  const importFile = document.getElementById('importFile') as HTMLInputElement;
  if (importBtn && importFile) {
    importBtn.addEventListener('click', () => {
      importFile.click();
    });
    importFile.addEventListener('change', (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        importConfig(file);
        importFile.value = ''; // Reset input
      }
    });
  }
});
