const statusEl = document.getElementById("status");

function setStatus(text, kind) {
  statusEl.textContent = text || "";
  statusEl.className = kind === "ok" ? "ok" : kind === "err" ? "err" : "muted";
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
  setStatus("Working…", "muted");
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

  btn.addEventListener("click", () => {
    handle(action, (disabled) => {
      buttons.forEach((b) => {
        b.disabled = disabled;
      });
    });
  });
}

wire("btn-clear", "clearStorage");
wire("btn-overlays", "removeOverlays");
wire("btn-reload", "hardReload");
wire("btn-fix", "fixPage");
