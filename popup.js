// popup.js

document.addEventListener("DOMContentLoaded", function () {
  const button = document.getElementById("addApk");

  button.addEventListener("click", () => {
    // Send a message to the background script when the button is pressed
    chrome.runtime.sendMessage({ action: "addApk" });
  });

});
