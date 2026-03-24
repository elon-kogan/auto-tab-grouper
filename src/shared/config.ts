/// <reference types="chrome" />
import { Config, DEFAULT_CONFIG, TabGroupConfig } from './types';

const CONFIG_STORAGE_KEY = 'tabGrouperConfig';

/**
 * Loads configuration from chrome.storage
 * @returns Promise with the configuration object
 */
export async function loadConfig(): Promise<Config> {
  try {
    const result = await chrome.storage.sync.get(CONFIG_STORAGE_KEY);
    const config = result[CONFIG_STORAGE_KEY] as Config | undefined;

    if (!config) {
      // If no config exists, return default
      return DEFAULT_CONFIG;
    }

    // Validate config structure
    if (!config.groups || !Array.isArray(config.groups)) {
      console.warn('Invalid config structure, using default');
      return DEFAULT_CONFIG;
    }

    // Ensure enabled is set
    if (config.enabled === undefined) {
      config.enabled = true;
    }

    return config;
  } catch (error) {
    console.error('Error loading config:', error);
    return DEFAULT_CONFIG;
  }
}

/**
 * Saves configuration to chrome.storage
 * @param config - The configuration to save
 * @returns Promise that resolves when saved
 */
export async function saveConfig(config: Config): Promise<void> {
  try {
    await chrome.storage.sync.set({ [CONFIG_STORAGE_KEY]: config });
  } catch (error) {
    console.error('Error saving config:', error);
    throw error;
  }
}

/**
 * Gets an empty default configuration
 * @returns Empty configuration with no groups
 */
export function getDefaultConfig(): Config {
  return {
    groups: [],
    enabled: true,
  };
}

/**
 * Initializes configuration on first install
 * Migrates from old config.json if it exists, otherwise creates empty config
 */
export async function initializeConfig(): Promise<void> {
  try {
    const existing = await chrome.storage.sync.get(CONFIG_STORAGE_KEY);
    if (existing[CONFIG_STORAGE_KEY]) {
      // Config already exists
      return;
    }

    // Try to load from old config.json (for backward compatibility)
    try {
      const response = await fetch(chrome.runtime.getURL('config.json'));
      if (response.ok) {
        const oldConfig = await response.json();
        if (oldConfig.groups && Array.isArray(oldConfig.groups)) {
          await saveConfig({
            groups: oldConfig.groups as TabGroupConfig[],
            enabled: true,
          });
          console.log('Migrated config from config.json');
          return;
        }
      }
    } catch {
      // config.json doesn't exist or is invalid, continue with empty config
    }

    // Initialize with empty config
    await saveConfig(getDefaultConfig());
    console.log('Initialized with empty configuration');
  } catch (error) {
    console.error('Error during initialization:', error);
    // Ensure we have at least empty config
    try {
      await saveConfig(getDefaultConfig());
    } catch (saveError) {
      console.error('Failed to save default config:', saveError);
    }
  }
}