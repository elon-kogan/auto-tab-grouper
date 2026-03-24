jest.mock('../shared/config');

import { loadConfig } from '../shared/config';

import { flushPromises } from '../test-utils/flushPromises';

let mockLoadConfig: jest.MockedFunction<typeof loadConfig>;

function setupDOM() {
  document.body.innerHTML = `
    <input id="enabledToggle" type="checkbox" />
    <div id="status"></div>
    <div id="groupsList"></div>
    <button id="openOptions"></button>
  `;
}

describe('popup page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setupDOM();
    jest.isolateModules(() => {
      jest.mock('../shared/config');
      const { loadConfig: lc } = require('../shared/config');
      mockLoadConfig = lc as jest.MockedFunction<typeof loadConfig>;
      require('./popup');
    });
  });

  it('calls loadConfig on DOMContentLoaded', async () => {
    mockLoadConfig.mockResolvedValue({ groups: [], enabled: true });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    expect(mockLoadConfig).toHaveBeenCalled();
  });

  it('shows active group count when enabled', async () => {
    mockLoadConfig.mockResolvedValue({
      groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
      enabled: true,
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    expect(document.getElementById('status')?.textContent).toContain('1 group');
  });

  it('shows disabled status when extension is disabled', async () => {
    mockLoadConfig.mockResolvedValue({ groups: [], enabled: false });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    expect(document.getElementById('status')?.textContent).toContain('disabled');
  });

  it('shows empty state when no groups', async () => {
    mockLoadConfig.mockResolvedValue({ groups: [], enabled: true });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    expect(document.getElementById('groupsList')?.innerHTML).toContain('No groups');
  });
});
