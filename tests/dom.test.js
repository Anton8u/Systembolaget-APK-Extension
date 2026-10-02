const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

// search.js / product.js resolve ./apk via require when running under Node.
const search = require("../src/search");
const product = require("../src/product");

function load(fixture) {
  const html = fs.readFileSync(path.join(__dirname, "fixtures", fixture), "utf8");
  return new JSDOM(html).window.document;
}

/** The "APK 1.57" part of each tile's text line, or null when a tile has none. */
const badgeTexts = (doc) =>
  [...doc.querySelectorAll('[data-slot="product-tile"]')].map(
    (tile) => /APK \d+\.\d{2}/.exec(tile.querySelector('[data-slot="product-summary-metadata"]').textContent)?.[0] ?? null
  );

test("search: APK on alcoholic tiles only, banner hidden", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });

  assert.deepEqual(badgeTexts(doc), [
    "APK 1.57",
    "APK 1.39", // pant price "11:90*" parses
    null, // alcohol-free: no APK, and no crash
    "APK 1.41",
  ]);
  const banner = doc.querySelector("li[aria-label]");
  assert.ok(banner.hasAttribute("data-sbapk-hidden"));
});

test("search: update is idempotent", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: true });
  const once = doc.body.innerHTML;
  search.update(doc, { sort: true });
  assert.equal(doc.body.innerHTML, once);
});

test("search: sorting sets CSS order, best first, without moving nodes", () => {
  const doc = load("search-grid.html");
  const domOrderBefore = [...doc.querySelectorAll("h3 a")].map((a) => a.href);
  search.update(doc, { sort: true });

  const orderByHref = Object.fromEntries(
    [...doc.querySelectorAll('[data-slot="product-tile"]')].map((tile) => [
      tile.querySelector("h3 a").getAttribute("href"),
      Number(tile.closest("li").style.order),
    ])
  );
  assert.equal(orderByHref["/produkt/vin/crudo-262708/"], 1); // 1.57
  assert.equal(orderByHref["/produkt/sprit/exempel-15941/"], 2); // 1.41
  assert.equal(orderByHref["/produkt/ol/bryggmastarens-8875235/"], 3); // 1.39
  assert.equal(orderByHref["/produkt/alkoholfritt/kopparberg-cider-kir-ish-1190535/"], 4); // no APK last

  const domOrderAfter = [...doc.querySelectorAll("h3 a")].map((a) => a.href);
  assert.deepEqual(domOrderAfter, domOrderBefore);
});

test("search: turning sorting off removes our ordering", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: true });
  search.update(doc, { sort: false });
  assert.equal(doc.querySelectorAll("[data-sbapk-sorted]").length, 0);
  assert.equal(doc.querySelectorAll('li[style*="order"]').length, 0);
});

test("search: reused tile node with new content gets a fresh APK", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  const tile = doc.querySelector('[data-slot="product-tile"]');
  tile.querySelector('[data-slot="product-summary-price"] p').textContent = "100:-";
  search.update(doc, { sort: false });
  assert.equal(
    tile.querySelector('[data-slot="product-summary-metadata"]').textContent,
    "3000 ml · 13 % vol. · APK 3.90 · Nr 262708" // one APK only, the old one replaced
  );
});

test("product: one badge below the volume row, ignoring similar-product tiles", () => {
  const doc = load("product-page.html");
  product.update(doc);
  product.update(doc);

  const badges = doc.querySelectorAll(".sbapk-badge");
  assert.equal(badges.length, 1);
  assert.equal(badges[0].textContent, "APK: 1.57 ml/kr");
  assert.match(badges[0].previousElementSibling.textContent, /13 % vol\./);
});

test("product: values from unrelated parts of the page are never combined", () => {
  const doc = load("product-page-mixed.html");
  product.update(doc);
  product.update(doc);
  product.update(doc);

  assert.equal(doc.querySelectorAll(".sbapk-badge").length, 0);
});

test("product: never leaves a badge outside <main>, and removes any that is", () => {
  const doc = load("product-page.html");
  const stray = doc.createElement("div");
  stray.className = "sbapk-badge sbapk-badge--product";
  doc.body.append(stray);

  product.update(doc);
  product.update(doc);

  const badges = [...doc.querySelectorAll(".sbapk-badge")];
  assert.equal(badges.length, 1);
  assert.ok(doc.querySelector("main").contains(badges[0]));
});

test("product: badge also shows when the volume is inside a package-type selector", () => {
  const doc = load("product-page-package-selector.html");
  product.update(doc);
  product.update(doc);

  const badges = doc.querySelectorAll(".sbapk-badge");
  assert.equal(badges.length, 1);
  assert.equal(badges[0].textContent, "APK: 1.57 ml/kr"); // 330 ml * 5.2 % / 10:90
  assert.match(badges[0].previousElementSibling.textContent, /5,2 % vol\./);
});

test("search: tiles with an APK get a pale tint, others are left white", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });

  const tiles = [...doc.querySelectorAll('[data-slot="product-tile"]')];
  const tints = tiles.map((tile) => tile.style.getPropertyValue("--sbapk-tint") || null);
  assert.ok(tints[0] && tints[1] && tints[3]);
  assert.equal(tints[2], null); // alcohol-free
  assert.equal(tiles[2].hasAttribute("data-sbapk-tint"), false);
  assert.notEqual(tints[0], tints[1]); // different APK, different tint
});

test("search: a reused tile gets its tint updated, and loses it when it has no APK", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  const tile = doc.querySelector('[data-slot="product-tile"]');
  const before = tile.style.getPropertyValue("--sbapk-tint");

  tile.querySelector('[data-slot="product-summary-price"] p').textContent = "1000:-";
  search.update(doc, { sort: false });
  assert.notEqual(tile.style.getPropertyValue("--sbapk-tint"), before);

  tile.querySelector('[data-slot="product-summary-metadata"]').textContent = "330 ml · Alkoholfri · Nr 1";
  search.update(doc, { sort: false });
  assert.equal(tile.hasAttribute("data-sbapk-tint"), false);
  assert.equal(tile.style.getPropertyValue("--sbapk-tint"), "");
});

test("search: the APK goes into the site's own text line, as plain text before 'Nr'", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  search.update(doc, { sort: false });
  search.update(doc, { sort: false });

  const tile = doc.querySelector('[data-slot="product-tile"]');
  const metadata = tile.querySelector('[data-slot="product-summary-metadata"]');
  assert.equal(metadata.textContent, "3000 ml · 13 % vol. · APK 1.57 · Nr 262708");
  assert.equal(metadata.childNodes.length, 1); // still just the one text node: same element, same font
  assert.equal(tile.querySelectorAll(".sbapk-badge").length, 0); // no separate box
});

test("search: the APK comes back after the site rewrites the text line", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  const metadata = doc.querySelector('[data-slot="product-summary-metadata"]');

  // What a framework update of the same text node does.
  metadata.firstChild.nodeValue = "750 ml · 14 % vol. · Nr 213801";
  assert.doesNotMatch(metadata.textContent, /APK/);

  search.update(doc, { sort: false });
  assert.equal(metadata.textContent, "750 ml · 14 % vol. · APK 0.42 · Nr 213801"); // 750 ml * 14 % / 249 kr
});

test("search: alcohol-free tiles keep the site's text exactly as it is", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  const alcoholFree = doc.querySelectorAll('[data-slot="product-summary-metadata"]')[2];
  assert.equal(alcoholFree.textContent, "330 ml · Alkoholfri · Nr 1190535");
});

test("search: the APK is removed again if a tile stops having one", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  const metadata = doc.querySelector('[data-slot="product-summary-metadata"]');

  metadata.firstChild.nodeValue = "3000 ml · Alkoholfri · APK 1.57 · Nr 262708"; // stale APK left on a reused node
  search.update(doc, { sort: false });
  assert.equal(metadata.textContent, "3000 ml · Alkoholfri · Nr 262708");
});
