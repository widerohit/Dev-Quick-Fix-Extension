const statusEl = document.getElementById("status");
const statusRow = document.getElementById("status-row");

function setStatus(text, kind) {
  if (!statusEl || !statusRow) return; // Exit gracefully if elements don't exist
  statusEl.textContent = text || "";
  statusEl.className = kind === "ok" ? "ok" : kind === "err" ? "err" : "muted";
  statusRow.className = `status-row ${statusEl.className}`;
}

/**
 * @param {'clearStorage' | 'removeOverlays' | 'hardReload' | 'fixPage'} action
 * @returns {Promise<void>}
 */
function run(action) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({ type: "DQF_RUN", action }, (response) => {
      const err = chrome.runtime.lastError;
      if (err) {
        reject(new Error(err.message));
        return;
      }
      if (!response) {
        reject(new Error("No response from background."));
        return;
      }
      if (response.ok) {
        resolve(response.text);
      } else {
        reject(new Error(response.text || "Unknown error."));
      }
    });
  });
}

async function handle(action, busyControl) {
  setStatus("Working...", "muted");
  busyControl(true);
  try {
    const msg = await run(action);
    setStatus(msg, "ok");
  } catch (e) {
    setStatus(e instanceof Error ? e.message : String(e), "err");
  } finally {
    busyControl(false);
  }
}

function wire(id, action) {
  const btn = document.getElementById(id);
  const buttons = Array.from(document.querySelectorAll("main button"));
  const label = btn.querySelector(".action-label, .primary-label");
  const readyLabel = btn.dataset.readyLabel || label?.textContent || "";
  const busyLabel = btn.dataset.busyLabel || "Working";

  btn.addEventListener("click", () => {
    handle(action, (disabled) => {
      buttons.forEach((b) => {
        b.disabled = disabled;
      });
      if (label) {
        label.textContent = disabled ? `${busyLabel}...` : readyLabel;
      }
    });
  });
}

wire("btn-clear", "clearStorage");
wire("btn-overlays", "removeOverlays");
wire("btn-reload", "hardReload");
wire("btn-fix", "fixPage");

// Detect OS and update shortcut display
function initShortcutDisplay() {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0 || 
                navigator.userAgent.toLowerCase().indexOf("macintosh") >= 0;
  const ctrlKey = document.getElementById("shortcut-ctrl");
  if (ctrlKey) {
    if (isMac) {
      ctrlKey.textContent = "Cmd";
      ctrlKey.title = "Command";
    } else {
      ctrlKey.textContent = "Ctrl";
      ctrlKey.title = "Control";
    }
  }
}

initShortcutDisplay();
