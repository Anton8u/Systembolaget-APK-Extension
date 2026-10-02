/** UI texts (Swedish / English), shared by the popup and the in-page card. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).texts = api;
  }
})(globalThis, function () {
  "use strict";

  const TEXTS = {
    sv: {
      title: "APK till Systembolaget",
      sortOff: "Sortera!",
      sortOn: "Sorterar ✓",
      sortOffTitle: "Sortera resultaten på sortimentsidan efter APK",
      sortOnTitle: "Sorterar efter APK. Klicka för att stänga av",
      credit: "av",
    },
    en: {
      title: "APK for Systembolaget",
      sortOff: "Sort!",
      sortOn: "Sorting ✓",
      sortOffTitle: "Sort the results on the search page by APK",
      sortOnTitle: "Sorting by APK. Click to turn off",
      credit: "by",
    },
  };

  /** Swedish for Swedish browsers, English for everything else. */
  function forLanguage(language) {
    return String(language).startsWith("sv") ? TEXTS.sv : TEXTS.en;
  }

  return { forLanguage };
});
