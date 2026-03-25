import { Config, TabGroupConfig, TabGroupColor } from '../shared/types';
import { isValidDomain } from '../shared/utils';

/**
 * Returns true if the given title and domains form a valid group.
 */
export function validateGroupData(title: string, domains: string[]): boolean {
  return title.trim().length > 0 && domains.length > 0;
}

/**
 * Converts raw input field values into a TabGroupConfig.
 * Returns null if the resulting group would be invalid.
 */
export function parseGroupFromInputs(
  titleValue: string,
  colorValue: string,
  domainsValue: string,
): TabGroupConfig | null {
  const title = titleValue.trim();
  const color = (colorValue as TabGroupColor) || 'grey';
  const domains = domainsValue
    .split('\n')
    .map((d) => d.trim())
    .filter((d) => d.length > 0)
    .filter((d) => isValidDomain(d));

  if (title.length > 0 && domains.length > 0) {
    return { title, color, domains };
  }
  return null;
}

/**
 * Parses and validates a JSON string as a Config.
 * Throws if the JSON is invalid or the structure does not match.
 */
export function parseImportedConfig(text: string): Config {
  const imported = JSON.parse(text) as Config;

  if (!imported.groups || !Array.isArray(imported.groups)) {
    throw new Error('Invalid configuration format');
  }

  const validColors: TabGroupColor[] = ['grey', 'blue', 'red', 'yellow', 'green', 'pink', 'purple', 'cyan'];

  for (const group of imported.groups) {
    if (!group.title || !group.color || !group.domains || !Array.isArray(group.domains)) {
      throw new Error('Invalid group structure');
    }
    if (!validColors.includes(group.color)) {
      throw new Error(`Invalid group color: ${group.color}`);
    }
  }

  return {
    groups: imported.groups,
    enabled: imported.enabled !== false,
  };
}
