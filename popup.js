// Detect the browser's preferred language
const userLanguage = navigator.language;
console.log("User language: " + userLanguage);

// Define the text content in both Swedish and English
const languageText = {
  SWE: {
    title: "APK till Systembolaget",
    button: "Sortera!",
    viewMoreButton: "Visa mer resultat x10!", // New button text in Swedish
    credit: "av",
  },
  ENG: {
    title: "APK for Systembolaget",
    button: "Sort!",
    viewMoreButton: "View more results x10!", // New button text in English
    credit: "by",
  },
};

const text = (userLanguage.startsWith("sv")) ? languageText.SWE : languageText.ENG;

document.querySelector('.title').textContent = text.title;
document.querySelector('#reorderButton').textContent = text.button;

document.querySelector('.credit').innerHTML = text.credit + ' <a href="https://github.com/anton8u" style="color: #FCD205;" target="_blank">Anton8u</a>';

chrome.runtime.sendMessage({ message: "loadProductsAgain" });

document.getElementById('reorderButton').addEventListener('click', () => {
  // Send a message to background.js to trigger the sorting function
  chrome.runtime.sendMessage({ message: "sort" });
});



document.getElementById('viewMoreResultsButton').addEventListener('click', () => {
  // Get the URL of the current tab
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const currentUrl = tabs[0].url;

    // Add "?p=10" to the current URL
    const newUrl = currentUrl + "?p=10";

    // Update the URL of the current tab
    chrome.tabs.update(tabs[0].id, { url: newUrl });
  });
});
