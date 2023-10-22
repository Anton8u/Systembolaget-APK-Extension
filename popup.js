document.getElementById('reorderButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    // Send a message to the content script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        // Code to reorder divs
        const container = document.querySelector('.css-176nwz9.e18roaja0');
        const productDivs = Array.from(container.querySelectorAll('.css-1lc3wed.enuzix00'));

        productDivs.sort((a, b) => {
          const idA = a.id.split(':')[1];
          const idB = b.id.split(':')[1];
          return idA - idB;
        });

        productDivs.forEach((productDiv) => {
          container.appendChild(productDiv);
        });

        // Resolve the promise when the task is complete
        return Promise.resolve("Divs reordered successfully");
      },
    }).then((result) => {
      console.log(result); // Display a success message
    }).catch((error) => {
      console.error(error); // Handle any errors
    });
  });
});





// popup.js
//
//document.addEventListener("DOMContentLoaded", function () {
//  const button = document.getElementById("storePathnames");
//
//  button.addEventListener("click", () => {
//    // Send a message to the background script when the button is pressed
//    chrome.runtime.sendMessage({ action: "storePathnames" });
//  });
//
//});

