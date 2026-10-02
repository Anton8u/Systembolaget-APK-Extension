/**
 * Pure APK logic: parsing the strings systembolaget.se shows, the APK
 * calculation and the colour scale. No DOM access, so it can be unit-tested
 * in Node and shared by the search-page and product-page scripts.
 *
 * APK = millilitres of pure alcohol per krona.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).apk = api;
  }
})(globalThis, function () {
  "use strict";

  // Anything above this is a parsing mistake, not a real product.
  const MAX_PLAUSIBLE_APK = 10;
  // APK at (and above) which the badge is fully green.
  const APK_FOR_BEST_COLOR = 2.8;
  const COLOR_STOPS = [
    [255, 0, 0], // worst
    [255, 255, 0],
    [0, 128, 0], // best
  ];
  const NO_DATA_COLOR = "rgb(200, 200, 200)";

  // `\s` also covers the (narrow) no-break spaces used as thousand separators.
  function toInt(digitsWithSpaces) {
    return parseInt(digitsWithSpaces.replace(/\s/g, ""), 10);
  }

  /** "3000 ml", "3 000 ml" -> 3000. Returns null if there is no volume. */
  function parseVolumeMl(text) {
    const match = /(\d[\d\s]*)\s*ml\b/i.exec(text);
    return match ? toInt(match[1]) : null;
  }

  /** "13,5 % vol." -> 13.5. Returns null for e.g. "Alkoholfri". */
  function parseAlcoholPercent(text) {
    const match = /(\d+(?:[.,]\d+)?)\s*%\s*vol/i.exec(text);
    return match ? parseFloat(match[1].replace(",", ".")) : null;
  }

  /**
   * Parses a whole price string, either as displayed ("249:-", "18:90",
   * "11:90*") or as read out for screen readers ("11 kronor och 90 öre,
   * pant tillkommer"). Returns kronor as a number, or null.
   */
  function parsePrice(text) {
    let match = /^\s*(\d[\d\s]*):(\d{2}|-)\s*\*?\s*$/.exec(text);
    if (match) {
      return toInt(match[1]) + (match[2] === "-" ? 0 : parseInt(match[2], 10) / 100);
    }
    match = /^\s*(\d[\d\s]*)\s+kronor(?:\s+och\s+(\d+)\s+öre)?(?:,\s*pant tillkommer)?\s*$/.exec(text);
    if (match) {
      return toInt(match[1]) + (match[2] ? parseInt(match[2], 10) / 100 : 0);
    }
    return null;
  }

  /** "3000 ml · 13 % vol. · Nr 262708" -> { volumeMl: 3000, alcoholPercent: 13 } */
  function parseMetadata(text) {
    return {
      volumeMl: parseVolumeMl(text),
      alcoholPercent: parseAlcoholPercent(text),
    };
  }

  /** ml alcohol per krona, or null when any input is missing or implausible. */
  function computeApk({ volumeMl, alcoholPercent, priceKr }) {
    const inputs = [volumeMl, alcoholPercent, priceKr];
    if (!inputs.every((n) => Number.isFinite(n) && n > 0)) return null;
    const apk = (volumeMl * alcoholPercent) / 100 / priceKr;
    return apk <= MAX_PLAUSIBLE_APK ? apk : null;
  }

  /** 1.5666 -> "APK: 1.57 ml/kr" */
  function formatApk(apk) {
    return `APK: ${apk.toFixed(2)} ml/kr`;
  }

  /** Red -> yellow -> green background for a badge. Grey when there is no APK. */
  function colorForApk(apk) {
    if (!Number.isFinite(apk) || apk <= 0) return NO_DATA_COLOR;
    const position = Math.min(apk / APK_FOR_BEST_COLOR, 1) * (COLOR_STOPS.length - 1);
    const lower = Math.floor(position);
    const upper = Math.ceil(position);
    const fraction = position - lower;
    const channels = COLOR_STOPS[lower].map((from, i) =>
      Math.round(from + fraction * (COLOR_STOPS[upper][i] - from))
    );
    return `rgb(${channels.join(", ")})`;
  }

  return {
    parseVolumeMl,
    parseAlcoholPercent,
    parsePrice,
    parseMetadata,
    computeApk,
    formatApk,
    colorForApk,
  };
});
