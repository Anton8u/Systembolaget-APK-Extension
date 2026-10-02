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

const badgeTexts = (doc) =>
  [...doc.querySelectorAll('[data-slot="product-tile"]')].map(
    (tile) => tile.querySelector(".sbapk-badge")?.textContent ?? null
  );

test("search: badges on alcoholic tiles only, banner hidden", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });

  assert.deepEqual(badgeTexts(doc), [
    "APK: 1.57 ml/kr",
    "APK: 1.39 ml/kr", // pant price "11:90*" parses
    null, // alcohol-free: no APK, and no crash
    "APK: 1.41 ml/kr",
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

test("search: reused tile node with new content gets a fresh badge", () => {
  const doc = load("search-grid.html");
  search.update(doc, { sort: false });
  const tile = doc.querySelector('[data-slot="product-tile"]');
  tile.querySelector('[data-slot="product-summary-price"] p').textContent = "100:-";
  search.update(doc, { sort: false });
  assert.equal(tile.querySelector(".sbapk-badge").textContent, "APK: 3.90 ml/kr");
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
