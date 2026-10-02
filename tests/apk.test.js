const test = require("node:test");
const assert = require("node:assert/strict");
const apk = require("../src/apk");

test("parseVolumeMl handles plain, spaced and no-break-space thousands", () => {
  assert.equal(apk.parseVolumeMl("750 ml"), 750);
  assert.equal(apk.parseVolumeMl("3 000 ml"), 3000);
  assert.equal(apk.parseVolumeMl("3 000 ml"), 3000);
  assert.equal(apk.parseVolumeMl("3000 ml · 13 % vol. · Nr 262708"), 3000);
  assert.equal(apk.parseVolumeMl("13 % vol."), null);
});

test("parseAlcoholPercent handles decimal comma and alcohol-free", () => {
  assert.equal(apk.parseAlcoholPercent("13 % vol."), 13);
  assert.equal(apk.parseAlcoholPercent("4,5 % vol."), 4.5);
  assert.equal(apk.parseAlcoholPercent("330 ml · Alkoholfri · Nr 1190535"), null);
});

test("parsePrice handles every price format seen on the site", () => {
  assert.equal(apk.parsePrice("249:-"), 249);
  assert.equal(apk.parsePrice("18:90"), 18.9);
  assert.equal(apk.parsePrice("11:90*"), 11.9);
  assert.equal(apk.parsePrice("1 249:-"), 1249);
  assert.equal(apk.parsePrice("249 kronor"), 249);
  assert.equal(apk.parsePrice("11 kronor och 90 öre, pant tillkommer"), 11.9);
});

test("parsePrice rejects things that are not a price", () => {
  assert.equal(apk.parsePrice("83 kronor per liter"), null);
  assert.equal(apk.parsePrice("83 kr/l"), null);
  assert.equal(apk.parsePrice("Nr 262708"), null);
  assert.equal(apk.parsePrice(""), null);
});

test("computeApk is ml alcohol per krona", () => {
  const value = apk.computeApk({ volumeMl: 3000, alcoholPercent: 13, priceKr: 249 });
  assert.ok(Math.abs(value - 1.5663) < 0.001);
  assert.equal(apk.formatApk(value), "APK: 1.57 ml/kr");
});

test("computeApk returns null instead of garbage", () => {
  assert.equal(apk.computeApk({ volumeMl: 330, alcoholPercent: null, priceKr: 9.9 }), null);
  assert.equal(apk.computeApk({ volumeMl: null, alcoholPercent: 5, priceKr: 9.9 }), null);
  assert.equal(apk.computeApk({ volumeMl: 330, alcoholPercent: 5, priceKr: 0 }), null);
  assert.equal(apk.computeApk({ volumeMl: 330, alcoholPercent: 5, priceKr: 0.01 }), null);
});

test("colorForApk runs red -> yellow -> green and is grey without data", () => {
  // The scale is shifted 7.5 % towards green: the worst APK is an orange-red, not pure red.
  assert.equal(apk.colorForApk(0.0001), "rgb(255, 38, 0)");
  assert.equal(apk.colorForApk(1.19), "rgb(255, 255, 0)"); // yellow is now reached at 1.19, not 1.4
  assert.equal(apk.colorForApk(2.8), "rgb(0, 128, 0)");
  assert.equal(apk.colorForApk(5), "rgb(0, 128, 0)");
  assert.equal(apk.colorForApk(null), "rgb(200, 200, 200)");
});

test("tintForApk is the badge colour mixed with white, and null without data", () => {
  assert.equal(apk.tintForApk(0.0001, 0.5), "rgb(255, 147, 128)"); // the worst colour, halfway to white
  assert.equal(apk.tintForApk(2.8, 0), "rgb(255, 255, 255)"); // strength 0 = white
  assert.equal(apk.tintForApk(2.8, 1), apk.colorForApk(2.8)); // strength 1 = full colour
  assert.equal(apk.tintForApk(null), null);
  // The default is much paler than the badge itself.
  const [r, g, b] = apk.tintForApk(1.4).match(/\d+/g).map(Number);
  assert.ok(r >= 200 && g >= 200 && b >= 200);
});
