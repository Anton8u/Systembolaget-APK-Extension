/**
 * Product page (/produkt/...): adds an APK badge below the volume / alcohol row.
 *
 * The page has no stable hooks like the search tiles do, so the values are
 * found by what they look like ("13 % vol.", "3 000 ml", "249:-"), taking the
 * first match in the main content that is not part of a product tile
 * (e.g. a "similar products" list further down).
 */
(function (root, factory) {
  const apk =
    typeof require === "function" ? require("./apk") : root.SBAPK.apk;
  const api = factory(apk);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).product = api;
  }
})(globalThis, function (apk) {
  "use strict";

  const BADGE_CLASS = "sbapk-badge sbapk-badge--product";
  const BADGE_SELECTOR = ".sbapk-badge--product";
  const TILE_SELECTOR = '[data-slot="product-tile"]';

  const ALCOHOL_TEXT = /^\d+(?:[.,]\d+)?\s*%\s*vol\.?$/i;
  const VOLUME_TEXT = /^\d[\d\s]*ml$/i;

  /** First element without child elements whose trimmed text passes `matches`. */
  function findLeaf(main, matches) {
    const candidates = main.querySelectorAll("span, div, p");
    for (const el of candidates) {
      if (el.children.length > 0 || el.closest(TILE_SELECTOR)) continue;
      if (matches(el.textContent.trim())) return el;
    }
    return null;
  }

  /** Smallest ancestor of `a` that also contains `b`. */
  function commonAncestor(a, b) {
    for (let el = a.parentElement; el; el = el.parentElement) {
      if (el.contains(b)) return el;
    }
    return null;
  }

  function update(doc) {
    const main = doc.querySelector("main");
    if (!main) return;

    const alcoholEl = findLeaf(main, (text) => ALCOHOL_TEXT.test(text));
    const volumeEl = findLeaf(main, (text) => VOLUME_TEXT.test(text));
    const priceEl = findLeaf(main, (text) => apk.parsePrice(text) !== null);
    const existing = main.querySelector(BADGE_SELECTOR);

    const value =
      alcoholEl && volumeEl && priceEl
        ? apk.computeApk({
            volumeMl: apk.parseVolumeMl(volumeEl.textContent),
            alcoholPercent: apk.parseAlcoholPercent(alcoholEl.textContent),
            priceKr: apk.parsePrice(priceEl.textContent.trim()),
          })
        : null;

    // The row holding "Box · 3 000 ml · 13 % vol." plus the product number sits
    // one level above the element that contains both volume and alcohol.
    const row = value !== null ? commonAncestor(alcoholEl, volumeEl)?.parentElement : null;

    if (value === null || !row) {
      if (existing) existing.remove();
      return;
    }

    const text = apk.formatApk(value);
    if (existing && existing.previousElementSibling === row) {
      if (existing.textContent !== text) {
        existing.textContent = text;
        existing.style.background = apk.colorForApk(value);
      }
      return;
    }

    // Missing or in the wrong place (the page re-rendered): start over.
    if (existing) existing.remove();
    const badge = doc.createElement("div");
    badge.className = BADGE_CLASS;
    badge.textContent = text;
    badge.style.background = apk.colorForApk(value);
    row.after(badge);
  }

  return { update };
});
