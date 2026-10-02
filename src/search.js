/**
 * Search page (/sortiment): shows the APK in every product tile (in its text line
 * and as a pale tint of the whole tile) and, when enabled, sorts the tiles by APK.
 *
 * Sorting uses the CSS `order` property of the grid items instead of moving
 * DOM nodes. The page is rendered by a framework that owns those nodes, so we
 * never reorder or delete them: we only edit one text line, set `order`, and
 * hide the non-product items (e.g. inspiration banners) with an attribute.
 */
(function (root, factory) {
  const apk =
    typeof require === "function" ? require("./apk") : root.SBAPK.apk;
  const api = factory(apk);
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).search = api;
  }
})(globalThis, function (apk) {
  "use strict";

  const SELECTORS = {
    tile: '[data-slot="product-tile"]',
    metadata: '[data-slot="product-summary-metadata"]',
    price: '[data-slot="product-summary-price"]',
  };
  const HIDDEN_ATTR = "data-sbapk-hidden";
  const SORTED_ATTR = "data-sbapk-sorted";
  const TINT_ATTR = "data-sbapk-tint";
  const TINT_PROPERTY = "--sbapk-tint";

  // The APK we put into the tile's "750 ml · 14 % vol. · Nr 213801" line, as it
  // looks either before the "Nr ..." part or (if there is none) at the end.
  const APK_IN_TEXT = [/APK \d+\.\d{2} · /, / · APK \d+\.\d{2}$/];

  /** The line as the site wrote it, with any APK we added removed again. */
  function withoutApk(text) {
    return APK_IN_TEXT.reduce((result, pattern) => result.replace(pattern, ""), text);
  }

  /** "750 ml · 14 % vol. · Nr 213801" -> "750 ml · 14 % vol. · APK 1.57 · Nr 213801" */
  function withApk(text, value) {
    const label = apk.formatApkShort(value);
    const match = /^(.*?)(Nr \S+)$/.exec(text);
    return match ? `${match[1]}${label} · ${match[2]}` : `${text} · ${label}`;
  }

  /** Reads volume, alcohol and price off a tile. Returns the APK or null. */
  function readTile(tile) {
    const metadata = tile.querySelector(SELECTORS.metadata);
    const price = tile.querySelector(SELECTORS.price);
    if (!metadata || !price) return { metadata, apk: null };

    // The visible price (aria-hidden) comes first; the spoken one is a fallback.
    const priceTexts = [...price.children].map((el) => el.textContent);
    const priceKr =
      priceTexts.map(apk.parsePrice).find((value) => value !== null) ?? null;

    return {
      metadata,
      apk: apk.computeApk({
        ...apk.parseMetadata(withoutApk(metadata.textContent)),
        priceKr,
      }),
    };
  }

  /**
   * Puts the APK into the tile's own text line, so it looks exactly like the
   * rest of it ("750 ml · 14 % vol. · APK 1.57 · Nr 213801"), or removes it when
   * there is none. The site rewrites this text whenever the tile shows another
   * product, which is why this is re-applied on every run.
   */
  function syncMetadataText(metadata, value) {
    const node = [...metadata.childNodes].find((child) => child.nodeType === 3);
    if (!node) return;
    const original = withoutApk(node.nodeValue);
    const wanted = value === null ? original : withApk(original, value);
    if (node.nodeValue !== wanted) node.nodeValue = wanted;
  }

  /**
   * Tints the whole tile with a pale version of the badge colour. Done with an
   * attribute and a custom property (see content.css) so the site's own
   * classes and styles are never touched.
   */
  function syncTint(tile, value) {
    const tint = apk.tintForApk(value);
    if (tint === null) {
      tile.removeAttribute(TINT_ATTR);
      tile.style.removeProperty(TINT_PROPERTY);
      return;
    }
    if (tile.style.getPropertyValue(TINT_PROPERTY) !== tint) tile.style.setProperty(TINT_PROPERTY, tint);
    tile.setAttribute(TINT_ATTR, "");
  }

  /** Highest APK first; tiles without an APK last; ties keep page order. */
  function byApkDescending(a, b) {
    if (a.apk === b.apk) return 0;
    if (a.apk === null) return 1;
    if (b.apk === null) return -1;
    return b.apk - a.apk;
  }

  function setOrder(item, position) {
    const value = String(position);
    if (item.style.order !== value) item.style.order = value;
    item.setAttribute(SORTED_ATTR, "");
  }

  function clearOrder(item) {
    if (!item.hasAttribute(SORTED_ATTR)) return;
    item.style.removeProperty("order");
    item.removeAttribute(SORTED_ATTR);
  }

  /** Hides grid children that are not product tiles; shows the ones that are. */
  function hideNonProducts(items) {
    const grids = new Set(items.map((item) => item.parentElement));
    for (const grid of grids) {
      for (const child of grid.children) {
        if (child.hasAttribute("data-sbapk-card")) continue; // our own card, see card.js
        const isProduct = child.matches(SELECTORS.tile) || child.querySelector(SELECTORS.tile);
        if (isProduct) child.removeAttribute(HIDDEN_ATTR);
        else child.setAttribute(HIDDEN_ATTR, "");
      }
    }
  }

  /**
   * Brings the page in line with the wanted state. Idempotent: calling it again
   * without any page change touches nothing. Returns the product grid element,
   * or null when the page has no products (yet).
   */
  function update(doc, { sort }) {
    const tiles = Array.from(doc.querySelectorAll(SELECTORS.tile));
    if (tiles.length === 0) return null;

    const entries = tiles.map((tile) => {
      const { metadata, apk: value } = readTile(tile);
      if (metadata) syncMetadataText(metadata, value);
      syncTint(tile, value);
      return { item: tile.closest("li") || tile, apk: value };
    });

    hideNonProducts(entries.map((entry) => entry.item));

    if (sort) {
      entries.slice().sort(byApkDescending).forEach((entry, i) => setOrder(entry.item, i + 1));
    } else {
      entries.forEach((entry) => clearOrder(entry.item));
    }
    return entries[0].item.parentElement;
  }

  return { update, readTile, byApkDescending };
});
