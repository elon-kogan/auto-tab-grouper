jest.mock('../shared/config');
jest.mock('../shared/utils');

import { loadConfig, saveConfig } from '../shared/config';
import { isValidDomain } from '../shared/utils';
import './options';

import { flushPromises } from '../test-utils/flushPromises';

const mockLoadConfig = loadConfig as jest.MockedFunction<typeof loadConfig>;
const mockSaveConfig = saveConfig as jest.MockedFunction<typeof saveConfig>;
const mockIsValidDomain = isValidDomain as jest.MockedFunction<typeof isValidDomain>;

function setupDOM() {
  document.body.innerHTML = `
    <div id="groupsContainer"></div>
    <div id="emptyState" style="display:none"></div>
    <template id="groupTemplate">
      <div class="group-card">
        <input class="group-title-input" />
        <select class="group-color-select"><option value="blue">blue</option></select>
        <textarea class="domains-input"></textarea>
        <button class="delete-group"></button>
        <span class="domain-count"></span>
      </div>
    </template>
    <button id="addGroup"></button>
    <button id="saveBtn"></button>
    <button id="exportBtn"></button>
    <button id="importBtn"></button>
    <input id="importFile" type="file" />
    <div id="saveStatus"></div>
  `;
}

describe('options page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsValidDomain.mockReturnValue(true);
    setupDOM();
  });

  it('loads config on DOMContentLoaded', async () => {
    mockLoadConfig.mockResolvedValue({ groups: [], enabled: true });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    expect(mockLoadConfig).toHaveBeenCalled();
  });

  it('renders groups when config has groups', async () => {
    mockLoadConfig.mockResolvedValue({
      groups: [{ title: 'Work', color: 'blue', domains: ['github.com'] }],
      enabled: true,
    });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    const container = document.getElementById('groupsContainer');
    expect(container?.querySelector('.group-card')).not.toBeNull();
  });

  it('shows empty state when no groups', async () => {
    mockLoadConfig.mockResolvedValue({ groups: [], enabled: true });
    document.dispatchEvent(new Event('DOMContentLoaded'));
    await flushPromises();

    const emptyState = document.getElementById('emptyState');
    expect(emptyState?.style.display).toBe('block');
  });
});
