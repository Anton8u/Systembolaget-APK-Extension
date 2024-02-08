// Detect the browser's preferred language
const userLanguage = navigator.language;
console.log("User language: " + userLanguage);

// Define the text content in both Swedish and English
const languageText = {
  SWE: {
    title: "APK till Systembolaget",
    button: "Sortera!",
    buttonTitle: "Sorterar resultat på sortiment sidan utifrån APK", 
    viewMoreButton: "Visa mer resultat x10!",
    viewMoreButtonTitle: "Laddar in 10 sidor av produkter på sortiment sidan",
    credit: "av",
  },
  ENG: {
    title: "APK for Systembolaget",
    button: "Sort!",
    buttonTitle: "Sorts results on the search page based on APK", 
    viewMoreButton: "View more results x10!",
    viewMoreButtonTitle: "Loads 10 pages of products on the search page", 
    credit: "by",
  },
};

// Determine the language based on user's browser preference
const text = (userLanguage.startsWith("sv")) ? languageText.SWE : languageText.ENG;

// Update HTML content with language-specific text
document.querySelector('.title').textContent = text.title;
document.querySelector('#reorderButton').textContent = text.button;
document.getElementById('reorderButton').title = text.buttonTitle; // Button title based on language
document.querySelector('#viewMoreResultsButton').textContent = text.viewMoreButton;
document.getElementById('viewMoreResultsButton').title = text.viewMoreButtonTitle; // Button title based on language
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
