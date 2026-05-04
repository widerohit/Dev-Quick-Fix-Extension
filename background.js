/**
 * @typedef {'clearStorage' | 'removeOverlays' | 'hardReload' | 'fixPage'} Action
 */

function isInjectableUrl(url) {
  if (typeof url !== "string") return false;
  try {
    const u = new URL(url);
    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * @returns {Promise<{ tabId: number, url: string }>}
 */
async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) {
    throw new Error("No active tab.");
  }
  if (tab.id === chrome.tabs.TAB_ID_NONE) {
    throw new Error("Invalid tab.");
  }
  const url = tab.url ?? tab.pendingUrl ?? "";
  return { tabId: tab.id, url };
}

async function clearWebStorages(tabId) {
  await chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      try {
        localStorage.clear();
      } catch {
        /* ignore */
      }
      try {
        sessionStorage.clear();
      } catch {
        /* ignore */
      }
    },
  });
}

async function removeCookiesForUrl(pageUrl) {
  const cookies = await chrome.cookies.getAll({ url: pageUrl });

  for (const cookie of cookies) {
    const protocol = cookie.secure ? "https:" : "http:";
    let domain = cookie.domain || "";
    if (domain.startsWith(".")) {
      domain = domain.slice(1);
    }
    const path = cookie.path || "/";
    const cookieUrl = `${protocol}//${domain}${path}`;
    try {
      await chrome.cookies.remove({ url: cookieUrl, name: cookie.name });
    } catch {
      /* ignore */
    }
  }
}

async function clearOriginCache(origin) {
  await new Promise((resolve, reject) => {
    chrome.browsingData.remove(
      { origins: [origin] },
      { cache: true },
      () => {
        const err = chrome.runtime.lastError;
        if (err) reject(new Error(err.message));
        else resolve();
      }
    );
  });
}

function injectRemoveOverlays(tabId) {
  return chrome.scripting.executeScript({
    target: { tabId },
    func: () => {
      const fixed = document.querySelectorAll("*");
      fixed.forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        try {
          const s = window.getComputedStyle(el);
          if (s.position === "fixed") {
            el.remove();
          }
        } catch {
          /* ignore */
        }
      });
      if (document.body) {
        document.body.style.removeProperty("overflow");
      }
      document.documentElement.style.removeProperty("overflow");
    },
  });
}

/**
 * @param {Action} action
 * @returns {Promise<string>}
 */
async function runAction(action) {
  const { tabId, url } = await getActiveTab();

  const needsWebOrigin =
    action === "clearStorage" ||
    action === "removeOverlays" ||
    action === "fixPage";

  if (needsWebOrigin && !isInjectableUrl(url)) {
    throw new Error("This page does not support scripts (use http/https pages).");
  }

  if (action === "hardReload") {
    await chrome.tabs.reload(tabId, { bypassCache: true });
    return "Hard reload started.";
  }

  const origin = new URL(url).origin;

  switch (action) {
    case "clearStorage": {
      await clearWebStorages(tabId);
      await removeCookiesForUrl(url);
      await clearOriginCache(origin);
      return "Storage, cookies, and cache cleared for this origin.";
    }
    case "removeOverlays": {
      await injectRemoveOverlays(tabId);
      return "Fixed elements removed; scroll restored.";
    }
    case "fixPage": {
      await clearWebStorages(tabId);
      await removeCookiesForUrl(url);
      await clearOriginCache(origin);
      await injectRemoveOverlays(tabId);
      await chrome.tabs.reload(tabId, { bypassCache: true });
      return "Fix applied: cleared storage, removed overlays, hard reload.";
    }
    default:
      throw new Error("Unknown action.");
  }
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "DQF_RUN") return false;
  const action = /** @type {Action} */ (message.action);

  runAction(action)
    .then((text) => sendResponse({ ok: true, text }))
    .catch((err) =>
      sendResponse({
        ok: false,
        text: err instanceof Error ? err.message : String(err),
      })
    );

  return true;
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== "fix-page") return;
  runAction("fixPage").catch(() => {
    /* optional: could set badge */
  });
});
