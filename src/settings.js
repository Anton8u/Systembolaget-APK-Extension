/** The "sort by APK" setting, stored in chrome.storage.local. Shared by the content scripts and the popup. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).settings = api;
  }
})(globalThis, function () {
  "use strict";

  const SORT_KEY = "sortByApk";

  async function getSortEnabled() {
    const stored = await chrome.storage.local.get({ [SORT_KEY]: false });
    return Boolean(stored[SORT_KEY]);
  }

  function setSortEnabled(enabled) {
    return chrome.storage.local.set({ [SORT_KEY]: enabled });
  }

  /** Calls `callback(enabled)` whenever the setting changes, from any page or the popup. */
  function onSortChanged(callback) {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === "local" && SORT_KEY in changes) {
        callback(Boolean(changes[SORT_KEY].newValue));
      }
    });
  }

  return { getSortEnabled, setSortEnabled, onSortChanged };
});
