/**
 * Valid Chrome tab group colors
 */
export type TabGroupColor =
  | 'grey'
  | 'blue'
  | 'red'
  | 'yellow'
  | 'green'
  | 'pink'
  | 'purple'
  | 'cyan';

/**
 * Configuration for a single tab group
 */
export interface TabGroupConfig {
  title: string;
  color: TabGroupColor;
  domains: string[];
}

/**
 * Main configuration structure
 */
export interface Config {
  groups: TabGroupConfig[];
  enabled?: boolean;
}

/**
 * Default configuration
 */
export const DEFAULT_CONFIG: Config = {
  groups: [],
  enabled: true,
};
