const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { JSDOM } = require("jsdom");

const read = (...parts) => fs.readFileSync(path.join(__dirname, "..", ...parts), "utf8");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** In-memory stand-in for chrome.storage, shareable between several "pages". */
function fakeStorage(initial = {}) {
  const data = { ...initial };
  const listeners = [];
  return {
    local: {
      async get(defaults) {
        return Object.fromEntries(
          Object.entries(defaults).map(([key, fallback]) => [key, key in data ? data[key] : fallback])
        );
      },
      async set(items) {
        const changes = {};
        for (const [key, value] of Object.entries(items)) {
          changes[key] = { oldValue: data[key], newValue: value };
          data[key] = value;
        }
        listeners.forEach((listener) => listener(changes, "local"));
      },
    },
    onChanged: { addListener: (listener) => listeners.push(listener) },
  };
}

function openPopup(storage, language = "sv-SE") {
  const dom = new JSDOM(read("popup", "popup.html"), { runScripts: "outside-only" });
  const { window } = dom;
  Object.defineProperty(window.navigator, "language", { value: language });
  window.chrome = { storage };
  window.eval(read("src", "settings.js"));
  window.eval(read("popup", "popup.js"));
  return window;
}

function openSearchPage(storage) {
  const dom = new JSDOM(read("tests", "fixtures", "search-grid.html"), {
    url: "https://www.systembolaget.se/sortiment/",
    runScripts: "outside-only",
  });
  const { window } = dom;
  window.chrome = { storage };
  for (const file of ["settings.js", "apk.js", "search.js", "product.js", "content.js"]) {
    window.eval(read("src", file));
  }
  return window;
}

test("popup: Swedish texts and the toggle starts off", async () => {
  const window = openPopup(fakeStorage());
  await sleep(20);
  const button = window.document.getElementById("sortButton");

  assert.equal(window.document.getElementById("title").textContent, "APK till Systembolaget");
  assert.equal(button.textContent, "Sortera!");
  assert.equal(button.getAttribute("aria-pressed"), "false");
  window.close();
});

test("popup: falls back to English", async () => {
  const window = openPopup(fakeStorage(), "en-GB");
  await sleep(20);
  assert.equal(window.document.getElementById("sortButton").textContent, "Sort!");
  window.close();
});

test("popup: click toggles the stored setting and the label", async () => {
  const storage = fakeStorage();
  const window = openPopup(storage);
  const button = window.document.getElementById("sortButton");
  await sleep(20);

  button.click();
  await sleep(20);
  assert.equal((await storage.local.get({ sortByApk: false })).sortByApk, true);
  assert.equal(button.textContent, "Sorterar ✓");
  assert.equal(button.getAttribute("aria-pressed"), "true");

  button.click();
  await sleep(20);
  assert.equal((await storage.local.get({ sortByApk: false })).sortByApk, false);
  assert.equal(button.textContent, "Sortera!");
  window.close();
});

test("popup: shows 'on' when sorting was already enabled", async () => {
  const window = openPopup(fakeStorage({ sortByApk: true }));
  await sleep(20);
  assert.equal(window.document.getElementById("sortButton").textContent, "Sorterar ✓");
  window.close();
});

test("popup click makes an open search page sort, and click again unsorts it", async () => {
  const storage = fakeStorage();
  const page = openSearchPage(storage);
  const popup = openPopup(storage);
  await sleep(300); // content script's first run

  const orders = () =>
    [...page.document.querySelectorAll('[data-slot="product-tile"]')].map((tile) => tile.closest("li").style.order);
  assert.deepEqual(orders(), ["", "", "", ""]);

  popup.document.getElementById("sortButton").click();
  await sleep(300);
  // fixture order: Crudo 1.57, beer 1.39, alcohol-free (none), spirit 1.41
  assert.deepEqual(orders(), ["1", "3", "4", "2"]);

  popup.document.getElementById("sortButton").click();
  await sleep(300);
  assert.deepEqual(orders(), ["", "", "", ""]);

  page.close();
  popup.close();
});

test("a page opened while sorting is enabled starts sorted", async () => {
  const page = openSearchPage(fakeStorage({ sortByApk: true }));
  await sleep(300);
  const orders = [...page.document.querySelectorAll('[data-slot="product-tile"]')].map((tile) => tile.closest("li").style.order);
  assert.deepEqual(orders, ["1", "3", "4", "2"]);
  page.close();
});
