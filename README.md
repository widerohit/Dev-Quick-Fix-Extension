# Dev Quick Fix

Chrome extension (Manifest V3) for one-click fixes during frontend debugging: clear storage and cache, strip blocking overlays, and hard reload.

## Install

1. Open Chrome and go to `chrome://extensions`.
2. Turn on **Developer mode**.
3. Click **Load unpacked** and select this folder (`Dev Quick Fix`).

## Usage

Click the toolbar icon to open the popup:

| Action | What it does |
|--------|----------------|
| **Clear All Storage** | Clears `localStorage`, `sessionStorage`, cookies for the current site, and cached data for that origin |
| **Remove Overlays** | Removes `position: fixed` elements and restores scrolling (`overflow` on `html`/`body`) |
| **Hard Reload** | Reloads the active tab bypassing cache |
| **Fix Page** | Runs clear storage + remove overlays + hard reload |

### Keyboard shortcut

**Fix Page:** `Ctrl+Shift+Y` (Windows/Linux) · `⌘⇧Y` (macOS)

Change it under `chrome://extensions/shortcuts` if it conflicts with another extension.

## Limitations

- **Clear / overlays / Fix Page** need a normal web page (`http` or `https`). They do not run on `chrome://`, the Chrome Web Store, PDF viewers, and other restricted URLs.
- **Hard reload** works on most tab types that Chrome can reload.
- Removing every `position: fixed` node can hide intentional UI; use when a modal or backdrop is stuck.

## Project layout

```
├── manifest.json   # MV3 manifest, permissions, commands
├── background.js   # Actions: scripting, cookies, browsingData, tabs
├── popup.html      # Popup UI
├── popup.js        # Sends messages to the service worker
├── icons/
│   └── icon128.png # Toolbar / extension icons
└── README.md
```

## Permissions

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access the tab you triggered the action on |
| `scripting` | Inject scripts to clear storage and remove overlays |
| `cookies` | Delete cookies for the current site |
| `browsingData` | Clear cached data for the current origin |
| `tabs` | Resolve the active tab |
| `<all_urls>` | Match pages where cookies/cache APIs apply to the active URL |

## License

Use and modify as you like for your own projects.
