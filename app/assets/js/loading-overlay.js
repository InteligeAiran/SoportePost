(() => {
  const overlayId = "loadingOverlay";
  const overlayMessageId = "loadingOverlayMessage";
  let autoRequestCount = 0;

  const getOverlay = () => document.getElementById(overlayId);
  const getMessageEl = () => document.getElementById(overlayMessageId);

  function showOverlay(message = "Procesando...") {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.style.display = "flex";
    const messageEl = getMessageEl();
    if (messageEl) messageEl.textContent = message;
    document.body.classList.add("loading-overlay-open");
  }

  let tableCheckInterval = null;
  let tableCheckTimeout = null;
  const overlayState = { forced: false };

  const PLACEHOLDER_TEXTS = [
    "no hay datos",
    "sin datos",
    "selecciona un ticket",
    "seleccione un ticket",
    "cargando",
    "esperando datos",
  ];

  const rowIsRealData = (row) => {
    if (row.dataset && row.dataset.overlayPlaceholder === "true") return false;
    if (row.classList.contains("dataTables_empty")) return false;
    const cells = Array.from(row.cells || []);
    if (!cells.length) return false;
    const text = row.textContent ? row.textContent.trim().toLowerCase() : "";

    if (
      PLACEHOLDER_TEXTS.some((phrase) => text.includes(phrase)) ||
      (cells.length === 1 && cells[0].colSpan > 1)
    ) {
      return false;
    }

    return cells.some((cell) => cell.textContent && cell.textContent.trim() !== "");
  };

  function tablesNeedMoreTime() {
    const tables = document.querySelectorAll(
      "table[data-overlay-watch], table.overlay-watch, table.dataTable, table.table"
    );
    if (!tables.length) return false;

    return Array.from(tables).some((table) => {
      if (!table.offsetParent) return false; // not visible
      const tbody = table.tBodies ? table.tBodies[0] : table.querySelector("tbody");
      if (!tbody) return false;
      const rows = Array.from(tbody.rows);
      if (!rows.length) return true;
      return !rows.some(rowIsRealData);
    });
  }

  function clearTableCheckTimers() {
    if (tableCheckInterval) {
      clearInterval(tableCheckInterval);
      tableCheckInterval = null;
    }
    if (tableCheckTimeout) {
      clearTimeout(tableCheckTimeout);
      tableCheckTimeout = null;
    }
  }

  function performHideOverlay() {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.style.display = "none";
    document.body.classList.remove("loading-overlay-open");
    overlayState.forced = false;
    clearTableCheckTimers();
  }

  function hideOverlay(force = false) {
    const overlay = getOverlay();
    if (!overlay) return;

    if (!force && tablesNeedMoreTime()) {
      if (!tableCheckInterval) {
        tableCheckInterval = setInterval(() => {
          if (!tablesNeedMoreTime()) {
            performHideOverlay();
          }
        }, 150);
        tableCheckTimeout = setTimeout(() => {
          performHideOverlay();
        }, 8000);
      }
      return;
    }
    performHideOverlay();
  }

  window.showLoadingOverlay = showOverlay;
  window.hideLoadingOverlay = hideOverlay;

  const shouldTrackRequest = (url) => {
    if (!url) return false;
    try {
      const absoluteUrl = new URL(url, window.location.href);
      if (absoluteUrl.origin !== window.location.origin) return false;
      const pathname = absoluteUrl.pathname.toLowerCase();
      if (pathname.includes("/app/assets/") || pathname.includes("/app/plugins/")) {
        return false;
      }
      return pathname.includes("/api/");
    } catch (error) {
      return false;
    }
  };

  const beginAutoOverlay = () => {
    autoRequestCount += 1;
    if (autoRequestCount === 1) {
      showOverlay("Procesando datos...");
    }
  };

  const endAutoOverlay = () => {
    autoRequestCount = Math.max(autoRequestCount - 1, 0);
    if (autoRequestCount === 0) {
      hideOverlay();
    }
  };

  const isSidebarNavigation = () => !!document.activeElement?.closest("#sidenav-main");

  const originalOpen = XMLHttpRequest.prototype.open;
  const originalSend = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
    this.__shouldTrackOverlay = shouldTrackRequest(url) && !isSidebarNavigation();
    return originalOpen.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function (body) {
    if (this.__shouldTrackOverlay) {
      beginAutoOverlay();
      this.addEventListener("loadend", endAutoOverlay, { once: true });
    }
    return originalSend.apply(this, arguments);
  };

  if (window.fetch) {
    const originalFetch = window.fetch;
    window.fetch = function (input, init) {
      const url = typeof input === "string" ? input : input.url;
      const track = shouldTrackRequest(url) && !isSidebarNavigation();
      if (track) beginAutoOverlay();
      return originalFetch(input, init).finally(() => {
        if (track) endAutoOverlay();
      });
    };
  }

  document.addEventListener("DOMContentLoaded", () => {
    let overlayAlreadyShown = false;
    const maybeShowInitialOverlay = () => {
      if (!overlayAlreadyShown) {
        overlayAlreadyShown = true;
        showOverlay("Preparando datos...");
      }
    };
    maybeShowInitialOverlay();
    setTimeout(() => {
      if (autoRequestCount === 0) {
        hideOverlay();
      }
    }, 1200);
  });
})();

