// Detect the browser's preferred language
const userLanguage = navigator.language;

// Define the text content in both Swedish and English
const languageText = {
  SWE: {
    title: "APK till Systembolaget",
    button: "Sortera!",
    credit: "av",
  },
  ENG: {
    title: "APK for Systembolaget",
    button: "Sort!",
    credit: "by",
  },
};

const text = userLanguage.startsWith("sv") ? languageText.SWE : languageText.ENG;

// Update the popup's content
document.querySelector('.title').textContent = text.title;
document.querySelector('#reorderButton').textContent = text.button;
document.querySelector('.credit').innerHTML = text.credit + ' <a href="https://github.com/anton8u" style="color: #FCD205;" target="_blank">Anton8u</a>';

chrome.runtime.sendMessage({ message: "loadProductsAgain" });

document.getElementById('reorderButton').addEventListener('click', () => {
  // Send a message to background.js to trigger the sorting function
  chrome.runtime.sendMessage({ message: "sort" });
});



