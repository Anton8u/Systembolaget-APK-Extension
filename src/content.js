/**
 * Entry point, injected on every www.systembolaget.se page. The site is a
 * single-page app (navigation does not reload the page), so instead of
 * hooking navigation events we watch the DOM and re-apply our changes whenever
 * it changes. Everything we do is idempotent, so extra runs are harmless.
 */
(function () {
  "use strict";

  const { search, product, settings } = globalThis.SBAPK;
  const RUN_DELAY_MS = 100;

  let sortByApk = false;
  let timer = null;
  let errorLogged = false;

  const isSearchPage = (path) => path === "/sortiment" || path.startsWith("/sortiment/");
  const isProductPage = (path) => path.startsWith("/produkt/");

  function run() {
    timer = null;
    try {
      const path = location.pathname;
      if (isSearchPage(path)) search.update(document, { sort: sortByApk });
      else if (isProductPage(path)) product.update(document);
    } catch (error) {
      // Most likely the site changed its markup. Say so once, then keep quiet.
      if (!errorLogged) {
        errorLogged = true;
        console.warn("[Systembolaget APK-Extension] Could not update the page:", error);
      }
    }
  }

  // Coalesce bursts of DOM changes into a single run.
  function scheduleRun() {
    if (timer === null) timer = setTimeout(run, RUN_DELAY_MS);
  }

  function loadSettings() {
    chrome.storage.local.get({ [settings.SORT_KEY]: false }).then((stored) => {
      sortByApk = Boolean(stored[settings.SORT_KEY]);
      scheduleRun();
    });
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !(settings.SORT_KEY in changes)) return;
      sortByApk = Boolean(changes[settings.SORT_KEY].newValue);
      scheduleRun();
    });
  }

  new MutationObserver(scheduleRun).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
  loadSettings();
  scheduleRun();
})();
