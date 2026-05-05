# Dev Quick Fix

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-green.svg)](https://developer.chrome.com/docs/extensions/mv3/)

> Chrome extension for streamlined frontend debugging. One-click fixes for storage, overlays, and cache issues—no configuration needed.

## Features

✨ **One-Click Fixes** — Combine multiple debugging actions in a single click  
🚀 **Lightning Fast** — Instant storage cleanup and page reload  
🎯 **Precision Actions** — Target individual fixes or use the comprehensive "Fix Page" action  
⌨️ **Keyboard Shortcut** — `Ctrl+Shift+Y` (Windows/Linux) or `Cmd+Shift+Y` (macOS)  
🔒 **Secure** — Works only on `http://` and `https://` pages  
🎨 **Minimal UI** — Clean, intuitive interface with real-time feedback  

## Installation

1. **Clone or download** this repository
2. Open Chrome and navigate to `chrome://extensions`
3. Enable **Developer mode** (toggle in top-right corner)
4. Click **Load unpacked** and select the `Dev Quick Fix` folder
5. Pin the extension to your toolbar for quick access

The extension will update automatically as you edit files (refresh the popup to see changes).

## Usage

Click the extension icon in your Chrome toolbar to open the popup menu.

### Available Actions

| Action | Description | Works On |
|--------|-------------|----------|
| **🔧 Fix Page** | Clears storage + removes overlays + hard reload (all-in-one) | HTTP/HTTPS pages |
| **🗑️ Clear All Storage** | Clears `localStorage`, `sessionStorage`, cookies, and origin cache | HTTP/HTTPS pages |
| **✖️ Remove Overlays** | Removes fixed-position elements (modals, paywalls, sticky bars) and restores scroll | HTTP/HTTPS pages |
| **⟳ Hard Reload** | Reloads page with cache bypass (`Ctrl+Shift+R`-equivalent) | All standard tabs |

### Keyboard Shortcuts

**Fix Page:** Instantly applies all fixes with a keyboard shortcut
- **Windows/Linux:** `Ctrl + Shift + Y`
- **macOS:** `Cmd + Shift + Y`

**Change the shortcut:**
1. Go to `chrome://extensions/shortcuts`
2. Find "Dev Quick Fix"
3. Click the edit icon next to "Fix Page"
4. Enter your preferred key combination

## Use Cases

### During Development
- **Module hot reload failures** → Clear storage + hard reload to reset state
- **Stuck modal/overlay** → Remove overlays to access the page
- **Stale cached content** → Hard reload to fetch fresh assets
- **Storage-based bugs** → Clear localStorage/sessionStorage for clean testing

### QA/Testing
- **Reproducible state** → Use Fix Page to reset everything between test cases
- **Cache-related issues** → Isolate real bugs from cached data
- **Third-party scripts** → Remove sticky overlays/trackers for clearer testing

### Production Support
- **User debugging** → Give users the shortcut to try: "Press Ctrl+Shift+Y"
- **Cookie-related issues** → Clear cookies for the current domain only
- **Browser cache problems** → Fast hard reload without clearing entire browser cache

## Technical Details

### Permissions & Safety

This extension requests these permissions:

| Permission | Purpose | Risk Level |
|------------|---------|-----------|
| `activeTab` | Access current tab metadata (URL, tab ID) | ✅ Safe |
| `scripting` | Inject code to clear storage & remove overlays | ⚠️ Limited to current page |
| `cookies` | Delete cookies for current origin only | ⚠️ Site-specific |
| `browsingData` | Clear cache for current origin only | ⚠️ Origin-specific |
| `tabs` | Resolve active tab for actions | ✅ Safe |
| `<all_urls>` | Apply to any HTTP/HTTPS page | ⚠️ Limited by above scopes |

**Privacy:** No data is collected, sent, or stored. All actions happen locally on your machine.

### Architecture

```
Dev Quick Fix/
├── manifest.json              # Extension configuration (MV3)
├── background.js              # Service worker: executes fixes
├── popup.html                 # UI: buttons & shortcut display
├── popup.js                   # UI logic & shortcuts
├── icons/
│   └── icon128.png            # Toolbar & menu icons
└── README.md                  # This file
```

**Flow:**
1. User clicks button or presses `Ctrl+Shift+Y`
2. `popup.js` or `background.js` sends message to service worker
3. `background.js` validates the URL and executes the action
4. Page state is cleaned (storage cleared, overlays removed, page reloaded)
5. User feedback is displayed in the popup

### Browser Compatibility

- ✅ **Chrome** 88+ (Manifest V3)
- ✅ **Edge** 88+
- ✅ **Brave** 1.0+
- ✅ **Opera** 74+
- ❌ **Firefox** (Manifest V2 only, requires port)
- ❌ **Safari** (requires separate development)

## Limitations

### What It Can't Do

- **Can't access restricted pages** — Chrome doesn't allow scripts on `chrome://`, `about://`, extension pages, or the Chrome Web Store
- **Can't modify PDF viewers** — PDF pages are protected from scripting
- **Can't remove all overlays** — Only removes elements with `position: fixed` (some overlays use absolute positioning or iframes)
- **Can't clear third-party cookies on HTTPS** — Browser security restrictions
- **Can't reload without full page refresh** — No way to reload with preserved state

### Recovery Tips

If something goes wrong:
1. **Page looks broken after "Remove Overlays"** — Hard reload the page (`Ctrl+Shift+R`)
2. **Action seems to do nothing** — Ensure you're on an HTTP/HTTPS page (not `chrome://`, file://, or restricted URL)
3. **Keyboard shortcut doesn't work** — Another extension may be using it; change it in `chrome://extensions/shortcuts`
4. **Cache still seems stale** — Some services cache on the server-side; clear cookies too

## Configuration

No configuration needed! The extension works out-of-the-box. 

**Optional:** Customize the keyboard shortcut in `chrome://extensions/shortcuts`

## Troubleshooting

### Common Issues

**Q: Nothing happens when I click the button**
- A: Check that you're on an HTTP/HTTPS page (not `chrome://`, `file://`, etc.)
- Verify the extension has permissions: Go to `chrome://extensions` → Details → Site access → set to "On all sites"

**Q: "Remove Overlays" hides page content**
- A: This happens when intentional UI uses `position: fixed`. Hard reload the page to restore it.

**Q: Keyboard shortcut shows in popup but doesn't work**
- A: The shortcut may conflict with another extension. Change it in `chrome://extensions/shortcuts`

**Q: "This page does not support scripts"**
- A: The extension can't run on protected pages (chrome://, file://, PDFs, etc.)

## Development



### Future Enhancements

Potential improvements for future versions:
- [ ] Settings panel for selective actions
- [ ] History log of applied fixes
- [ ] Custom overlay selectors (user-defined removals)
- [ ] Integration with DevTools
- [ ] Export/import configuration

### Contributing

Found a bug? Have a feature idea? 

1. Test on the latest Chrome version
2. Create an issue with clear reproduction steps
3. Submit a pull request with your fix

## Security & Privacy

🔒 **No Tracking** — Zero analytics or telemetry  
🔒 **No Data Collection** — Everything runs locally  
🔒 **No Network Requests** — Extension is 100% offline  
🔒 **Open Source** — Full transparency (code available for review)  
🔒 **Minimal Permissions** — Only requests what's necessary  

## License

Use and modify as you like for personal or commercial projects.

## Support

- 📧 **Bug Reports** — [Create an issue on GitHub](https://github.com/widerohit/Dev-Quick-Fix-Extension/issues)
- 💬 **Feature Requests** — [Open a discussion](https://github.com/widerohit/Dev-Quick-Fix-Extension/discussions)
- 🔗 **GitHub** — [View on GitHub](https://github.com/widerohit/Dev-Quick-Fix-Extension)

## Changelog

### v1.0.0 (2026-05-05)
- ✅ Initial release
- ✅ Fix Page (combined action)
- ✅ Individual actions (storage, overlays, reload)
- ✅ Keyboard shortcut with OS detection
- ✅ Minimal, clean UI
- ✅ Production-ready

---

<div align="center">

**Made with ❤️ for frontend developers everywhere**

[GitHub](https://github.com/widerohit/Dev-Quick-Fix-Extension) · [Report Bug](https://github.com/widerohit/Dev-Quick-Fix-Extension/issues)

</div>
