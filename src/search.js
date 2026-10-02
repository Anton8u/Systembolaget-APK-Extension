/**
 * Search page (/sortiment): adds an APK badge to every product tile and, when
 * enabled, sorts the tiles by APK.
 *
 * Sorting uses the CSS `order` property of the grid items instead of moving
 * DOM nodes. The page is rendered by a framework that owns those nodes, so we
 * never reorder or delete them: we only add our own badge, set `order`, and
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
    badge: ".sbapk-badge",
  };
  const BADGE_CLASS = "sbapk-badge sbapk-badge--tile";
  const HIDDEN_ATTR = "data-sbapk-hidden";
  const SORTED_ATTR = "data-sbapk-sorted";

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
        ...apk.parseMetadata(metadata.textContent),
        priceKr,
      }),
    };
  }

  /** Makes the badge inside `tile` match `value`; removes it if there is none. */
  function syncBadge(tile, metadata, value) {
    let badge = tile.querySelector(SELECTORS.badge);

    if (value === null) {
      if (badge) badge.remove();
      return;
    }

    if (!badge) {
      badge = tile.ownerDocument.createElement("div");
      badge.className = BADGE_CLASS;
      metadata.after(badge);
    }
    const text = apk.formatApk(value);
    if (badge.textContent !== text) {
      badge.textContent = text;
      badge.style.background = apk.colorForApk(value);
    }
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
        const isProduct = child.matches(SELECTORS.tile) || child.querySelector(SELECTORS.tile);
        if (isProduct) child.removeAttribute(HIDDEN_ATTR);
        else child.setAttribute(HIDDEN_ATTR, "");
      }
    }
  }

  /**
   * Brings the page in line with the wanted state. Idempotent: calling it again
   * without any page change touches nothing.
   */
  function update(doc, { sort }) {
    const tiles = Array.from(doc.querySelectorAll(SELECTORS.tile));
    if (tiles.length === 0) return;

    const entries = tiles.map((tile) => {
      const { metadata, apk: value } = readTile(tile);
      if (metadata) syncBadge(tile, metadata, value);
      return { item: tile.closest("li") || tile, apk: value };
    });

    hideNonProducts(entries.map((entry) => entry.item));

    if (sort) {
      entries.slice().sort(byApkDescending).forEach((entry, i) => setOrder(entry.item, i + 1));
    } else {
      entries.forEach((entry) => clearOrder(entry.item));
    }
  }

  return { update, readTile, byApkDescending };
});
