# Auto Tab Grouper

A Chrome extension that automatically groups browser tabs by domain using configurable rules.

## Features

- **Automatic Tab Grouping**: Automatically groups tabs based on their domain
- **Customizable Groups**: Create and manage multiple groups with custom colors
- **Domain-based Rules**: Configure which domains belong to which groups
- **Easy Configuration**: User-friendly UI for managing groups and domains
- **Enable/Disable Toggle**: Quickly enable or disable the extension
- **Import/Export**: Backup and restore your configuration

## Installation

### Development Installation

1. Clone this repository:
```bash
git clone <repository-url>
cd auto-tab-grouper
```

2. Install dependencies:
```bash
npm install
```

3. Build the extension:
```bash
npm run build
```

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" (toggle in the top right)
   - Click "Load unpacked"
   - Select the `dist` directory from this project

### Production Installation

1. Build the extension:
```bash
npm run build
```

2. Create a ZIP file of the `dist` directory
3. Submit to Chrome Web Store (or distribute the ZIP file)

## Development

### Project Structure

```
auto-tab-grouper/
├── src/
│   ├── background/     # Service worker (background.ts)
│   ├── popup/          # Popup UI (popup.html, popup.ts, popup.css)
│   ├── options/        # Options page (options.html, options.ts, options.css)
│   └── shared/         # Shared utilities and types
│       ├── types.ts    # TypeScript type definitions
│       ├── config.ts   # Configuration management
│       └── utils.ts    # Utility functions
├── icons/              # Extension icons
├── dist/               # Built extension (generated)
├── manifest.json       # Chrome extension manifest
├── package.json        # NPM dependencies
├── tsconfig.json       # TypeScript configuration
└── webpack.config.js   # Webpack build configuration
```

### Available Scripts

- `npm run build` - Build the extension for production
- `npm run dev` - Build in development mode with watch
- `npm run clean` - Remove the dist directory

### Building

The extension uses Webpack to bundle TypeScript files. The build process:

1. Compiles TypeScript to JavaScript
2. Bundles CSS files
3. Copies manifest.json and icons to dist/
4. Generates HTML files for popup and options pages

## Usage

### Initial Setup

1. After installing the extension, click the extension icon in Chrome
2. Click "Settings" to open the options page
3. Add your first group:
   - Click "+ Add Group"
   - Enter a group name (e.g., "Work", "Personal")
   - Select a color for the group
   - Add domains (one per line, without http:// or https://)
   - Example: `example.com`, `www.example.com`, `api.example.com`
4. Add more groups as needed
5. Click "Save Changes"

### Managing Groups

- **Add Group**: Click "+ Add Group" in the options page
- **Edit Group**: Modify the group name, color, or domains directly
- **Delete Group**: Click the "×" button on a group card
- **Import/Export**: Use the Import/Export buttons to backup your configuration

### Popup Features

The popup (click the extension icon) provides:
- Quick enable/disable toggle
- Status display showing number of active groups
- List of all configured groups
- Quick access to settings

## Configuration

Configuration is stored in Chrome's sync storage, which means:
- Settings sync across your Chrome browsers (if sync is enabled)
- Configuration persists across extension updates
- No need to manually edit JSON files

### Configuration Format

The configuration is stored as JSON with the following structure:

```json
{
  "groups": [
    {
      "title": "Work",
      "color": "blue",
      "domains": ["company.com", "app.company.com", "api.company.com"]
    },
    {
      "title": "Personal",
      "color": "green",
      "domains": ["example.com", "mail.example.com"]
    }
  ],
  "enabled": true
}
```

### Available Colors

- `grey`
- `blue`
- `red`
- `yellow`
- `green`
- `pink`
- `purple`
- `cyan`

## How It Works

1. The extension listens for tab creation and updates
2. When a tab loads, it extracts the domain from the URL
3. It checks the domain against configured groups
4. If a match is found, the tab is automatically added to the corresponding group
5. Groups are created automatically if they don't exist

## Permissions

The extension requires the following permissions:

- `tabs`: To access tab information and group tabs
- `tabGroups`: To create and manage tab groups
- `storage`: To save configuration (syncs across devices)
- `<all_urls>`: To extract domains from all websites

## Troubleshooting

### Tabs Not Grouping

1. Check that the extension is enabled (toggle in popup)
2. Verify that domains are correctly configured in settings
3. Ensure domains match exactly (including subdomains)
4. Check the browser console for errors (chrome://extensions/ → Details → Inspect views: background page)

### Configuration Not Saving

1. Check Chrome sync status
2. Try disabling and re-enabling the extension
3. Export your configuration as backup
4. Clear storage and reconfigure

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
