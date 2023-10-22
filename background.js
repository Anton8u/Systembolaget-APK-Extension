chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "reorderDivs") {
    // Handle the message here, or you can even ignore it
  }
});
