/**
 * Entry point, injected on every www.systembolaget.se page. The site is a
 * single-page app (navigation does not reload the page), so instead of
 * hooking navigation events we watch the DOM and re-apply our changes whenever
 * it changes. Everything we do is idempotent, so extra runs are harmless.
 */
(function () {
  "use strict";

  const { search, product, card, settings, texts } = globalThis.SBAPK;
  const RUN_DELAY_MS = 100;
  const pageTexts = texts.forLanguage(navigator.language);

  let sortByApk = false;
  let timer = null;
  let errorLogged = false;

  const isSearchPage = (path) => path === "/sortiment" || path.startsWith("/sortiment/");
  const isProductPage = (path) => path.startsWith("/produkt/");

  function toggleSort() {
    sortByApk = !sortByApk;
    settings.setSortEnabled(sortByApk);
    scheduleRun();
  }

  function run() {
    timer = null;
    try {
      const path = location.pathname;
      if (isSearchPage(path)) {
        const grid = search.update(document, { sort: sortByApk });
        if (grid) card.update(grid, { sort: sortByApk, texts: pageTexts, onToggle: toggleSort });
      } else if (isProductPage(path)) {
        product.update(document);
      }
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

  // characterData: the site updates a tile's text line in place (no element is added
  // or removed), and our APK in that text must be put back when it does.
  new MutationObserver(scheduleRun).observe(document.documentElement, {
    childList: true,
    characterData: true,
    subtree: true,
  });
  settings.getSortEnabled().then((enabled) => {
    sortByApk = enabled;
    scheduleRun();
  });
  settings.onSortChanged((enabled) => {
    sortByApk = enabled;
    scheduleRun();
  });
  scheduleRun();
})();
