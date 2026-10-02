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
  // The real row is about 40 characters; anything much bigger is not that row.
  const MAX_ROW_TEXT_LENGTH = 200;

  const ALCOHOL_TEXT = /^\d+(?:[.,]\d+)?\s*%\s*vol\.?$/i;
  // "3 000 ml", or "Burk · 330 ml" when the product has a package-type selector.
  const VOLUME_TEXT = /(?:^|·\s*)\d[\d\s]*ml$/i;

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

  /**
   * The row holding "Box · 3 000 ml · 13 % vol." plus the product number: the
   * badge goes right below it. Returns null unless the page clearly looks like
   * a complete product header, so that a half-rendered page, or values that
   * come from unrelated sections, never puts a badge somewhere strange (like
   * below the whole page).
   */
  function findAnchorRow(main, alcoholEl, volumeEl, priceEl) {
    const details = commonAncestor(alcoholEl, volumeEl);
    const row = details?.parentElement;
    if (!details || !row) return null;
    if (row === main || !main.contains(row)) return null;
    // Volume and alcohol share one small row; the price lives in its own row.
    if (details.contains(priceEl) || row.contains(priceEl)) return null;
    if (row.textContent.length > MAX_ROW_TEXT_LENGTH) return null;
    return row;
  }

  function update(doc) {
    // All badges of ours, wherever they ended up, so none can pile up unseen.
    const [existing, ...duplicates] = doc.querySelectorAll(BADGE_SELECTOR);
    duplicates.forEach((badge) => badge.remove());

    const main = doc.querySelector("main");
    const alcoholEl = main && findLeaf(main, (text) => ALCOHOL_TEXT.test(text));
    const volumeEl = main && findLeaf(main, (text) => VOLUME_TEXT.test(text));
    const priceEl = main && findLeaf(main, (text) => apk.parsePrice(text) !== null);

    const value =
      alcoholEl && volumeEl && priceEl
        ? apk.computeApk({
            volumeMl: apk.parseVolumeMl(volumeEl.textContent),
            alcoholPercent: apk.parseAlcoholPercent(alcoholEl.textContent),
            priceKr: apk.parsePrice(priceEl.textContent.trim()),
          })
        : null;
    const row = value !== null ? findAnchorRow(main, alcoholEl, volumeEl, priceEl) : null;

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
