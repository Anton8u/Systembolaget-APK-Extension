/** Settings shared by the content scripts and the popup. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).settings = api;
  }
})(globalThis, function () {
  "use strict";

  // chrome.storage.local key holding the "sort search results by APK" toggle.
  return { SORT_KEY: "sortByApk" };
});
