const noMatchIconPath = {
  16: "images/icon16.png",
  48: "images/icon48.png",
  128: "images/icon128.png",
};
chrome.action.setIcon({ path: noMatchIconPath });

const newMatchIconPath = {
  16: "images/icon16_newmatch.png",
  48: "images/icon48_newmatch.png",
  128: "images/icon128_newmatch.png",
};

function scrapeData() {
  // Open the "https://ifkgoteborg.ebiljett.nu/" URL in a new tab
  chrome.tabs.create({ url: "https://ifkgoteborg.ebiljett.nu/" }, (newTab) => {
    // Add an event listener to execute code once the tab is loaded
    chrome.tabs.onUpdated.addListener(function tabListener(tabId, changeInfo, tab) {
      if (tabId === newTab.id && changeInfo.status === "complete") {
        // The tab has finished loading, so fetch the data
        chrome.scripting.executeScript(
          {
            target: { tabId: newTab.id },
            function: () => {
              const fixtures = document.querySelector(".fixtures");
              if (fixtures) {
                return fixtures.innerText; // Extract and return only the innerText
              }
              return null;
            },
          },
          (result) => {
            // Close the tab
            chrome.tabs.remove(newTab.id);

            if (result) {
              const fixtureText = result[0].result;

              // Log the data to the console
              console.log("Data retrieved:", fixtureText);

              // Check if there is previously stored data
              chrome.storage.local.get(["lastFixture"], (data) => {
                if (data.lastFixture) {
                  // Compare the new fixtureText with the last stored data
                  if (fixtureText !== data.lastFixture) {
                    console.log("Data has been updated!");
                    chrome.action.setIcon({ path: newMatchIconPath });
                    chrome.tabs.create({ url: "https://ifkgoteborg.ebiljett.nu/" });
                  } else {
                    console.log("Data has not changed.");
                    chrome.action.setIcon({ path: noMatchIconPath });
                  }
                } else {
                  console.log("No previous data found.");
                  chrome.action.setIcon({ path: noMatchIconPath });
                }

                // Store the current innerText as the lastFixture
                chrome.storage.local.set({ lastFixture: fixtureText });
                chrome.storage.local.set({ lastScrapeTime: new Date().toString() });
              });
            }

            // Remove the tab listener
            chrome.tabs.onUpdated.removeListener(tabListener);
          }
        );
      }
    });
  })
}


chrome.runtime.onInstalled.addListener(function () {
  scrapeData();
});

chrome.runtime.onMessage.addListener(async (message) => {
  if (message.action === "scrapeData") {
    scrapeData();
  }
});

chrome.runtime.onStartup.addListener(function () {
  chrome.storage.local.get(["lastScrapeTime"], (data) => {
    if (data.lastScrapeTime) {
      const lastScrapeTime = new Date(data.lastScrapeTime);
      const now = new Date();
      const diffInMs = now - lastScrapeTime;
      //1000*60*60*1ms = 1 hour
      if (diffInMs < 6 * (1000 * 60 * 60)) {
        console.log("Scrape was run in the past 6 hours. Skipping...");
        return;
      }
    }
    scrapeData();
  });

});



