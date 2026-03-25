import { Config, TabGroupConfig } from '../shared/types';

export interface StatusInfo {
  text: string;
  className: string;
}

/**
 * Returns status text and CSS class derived from config.
 */
export function getStatusInfo(config: Config): StatusInfo {
  if (config.enabled === false) {
    return { text: 'Extension is disabled', className: 'status disabled' };
  }
  const activeGroups = config.groups.filter((g) => g.domains && g.domains.length > 0).length;
  return {
    text: `Active: ${activeGroups} group${activeGroups !== 1 ? 's' : ''}`,
    className: 'status',
  };
}

/**
 * Escapes HTML special characters to prevent XSS.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Renders a single group item as an HTML string.
 */
export function renderGroupItem(group: TabGroupConfig): string {
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
}
