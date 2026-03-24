const { chrome } = require('jest-chrome');

Object.assign(global, { chrome });

// jest-chrome doesn't include tabGroups, action, or tabs.group — add them manually
chrome.tabGroups = {
  query: jest.fn(),
  update: jest.fn(),
};

chrome.action = {
  setBadgeText: jest.fn(),
  setBadgeBackgroundColor: jest.fn(),
};

chrome.tabs.group = jest.fn();
