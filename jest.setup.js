const { chrome } = require('jest-chrome');

Object.assign(global, { chrome });

// jest-chrome doesn't include tabGroups, action, tabs.group, or tabs.get — add them manually
chrome.tabGroups = {
  query: jest.fn(),
  update: jest.fn(),
};

chrome.action = {
  setBadgeText: jest.fn(),
  setBadgeBackgroundColor: jest.fn(),
};

chrome.tabs.group = jest.fn();
chrome.tabs.get = jest.fn();

// jsdom does not implement window.confirm — mock it so tests that exercise
// code paths guarded by confirm() get predictable behaviour.
// Guard for non-jsdom environments (e.g. background.test.ts uses @jest-environment node).
if (typeof window !== 'undefined') {
  window.confirm = jest.fn();
}

// Suppress console output in tests to keep the output clean.
// Tests that need to assert on console calls can spy on these in their own beforeEach.
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(console, 'warn').mockImplementation(() => {});
jest.spyOn(console, 'error').mockImplementation(() => {});
