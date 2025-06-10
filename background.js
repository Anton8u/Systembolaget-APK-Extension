function searchPage(reorder) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tabs.length > 0) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          function: (reorder) => {
            const existingApkDiv = document.querySelector(".search-apk-div");
            if (existingApkDiv && reorder === 0) {
              console.log(
                "APKs div already exists && Not sorting. Cancelling function."
              );
              return; // Stop further execution if the div already exists
            }

            function extractProductIdFromUrl(url) {
              // Remove trailing slash if present
              if (url.endsWith("/")) {
                url = url.slice(0, -1);
              }

              // Use a regular expression to capture all digits after the last '/'
              const match = url.match(/(\d+)\/?$/);

              // Return the productId (the matched digits)
              return match ? match[1] : null;
            }

            function getBackgroundColorForAPK(apk) {
              if (!apk || apk > 280 || apk <= 0) {
                return `rgb(200, 200, 200)`; // Default color for out-of-range APK values
              }

              // Normalize the APK value to a range between 0 and 1
              const normalizedAPK = apk / 280;

              // Define colors for interpolation
              const green = [0, 128, 0];
              const yellow = [255, 255, 0];
              const red = [255, 0, 0];
              const colors = [red, yellow, green];

              // Interpolate color based on normalized APK
              const numColors = colors.length - 1;
              const index = normalizedAPK * numColors;
              const startIndex = Math.floor(index);
              const endIndex = Math.ceil(index);
              const t = index - startIndex;
              const startColor = colors[startIndex];
              const endColor = colors[endIndex];

              const interpolatedColor = [
                Math.round(startColor[0] + t * (endColor[0] - startColor[0])),
                Math.round(startColor[1] + t * (endColor[1] - startColor[1])),
                Math.round(startColor[2] + t * (endColor[2] - startColor[2])),
              ];

              return `rgb(${interpolatedColor.join(",")})`;
            }

            const elementsWithProductHref = Array.from(
              document.querySelectorAll('a[href^="/produkt/"]')
            );

            if (elementsWithProductHref.length === 0) {
              console.log("No product divs found on the page.");
              return;
            }

            let productGrid = elementsWithProductHref[0].parentElement;

            const productDivs = elementsWithProductHref.filter(div => div.parentElement === productGrid);

            function calcApk(productDiv) {

              const productDivOuterText = productDiv.innerText.split("\n");
              let alcoholPercentageI;
              for (let i = 0; i < productDivOuterText.length; i++) {
                if (productDivOuterText[i].includes("% vol.")) {
                  alcoholPercentageI = i;
                }
              }

              const mlVolume = parseFloat(
                productDivOuterText[alcoholPercentageI - 2]
                  .replace(" ", "")
                  .replace("ml", "")
              );
              const alcoholPercentage = parseFloat(
                productDivOuterText[alcoholPercentageI].replace(",", ".")
              );

              const price = parseFloat(
                productDivOuterText[alcoholPercentageI + 2]
                  .replace(":", ".")
                  .replace(" ", "")
              );

              const apk = parseInt(
                Math.round((mlVolume * alcoholPercentage) / price)
              );
              return apk;
            }

            function sortByApk(a, b) {
              const apkA = calcApk(a);
              const apkB = calcApk(b);
              return apkB - apkA;
            }

            function sortByDefault(a, b) {
              return 0; // No sorting, maintain the original order
            }
            // Conditionally select the sorting function based on reorder value
            const sortingFunction = reorder === 1 ? sortByApk : sortByDefault;

            productDivs.sort(sortingFunction);
            productDivs.forEach((productDiv) => {
              const apk = calcApk(productDiv);
              const apkDiv = productDiv.querySelector(".search-apk-div");

              if (!apkDiv) {
                // Create a new div for APK information
                const newApkDiv = document.createElement("div");
                newApkDiv.textContent = `APK: ${apk / 100} ml/kr`;
                newApkDiv.classList.add("search-apk-div"); // Add a class to identify the APK div

                const backgroundColor = getBackgroundColorForAPK(apk);
                // Apply styles to the apkDiv
                newApkDiv.style.cssText = `
                font-size: 18px;
                font-weight: bold;
                margin: 5px;
                color: rgb(55, 51, 48);
                background: ${backgroundColor};
                line-height: 19px;
                letter-spacing: 0.16em;
                text-transform: uppercase;
                padding: 1px;
              `;

                const firstChildDiv =
                  productDiv.querySelector("div:first-child");
                const childDivs = firstChildDiv.querySelectorAll("div");

                if (childDivs[0].textContent == "Nyhet") {
                  insertAfter(newApkDiv, childDivs[2]);
                } else {
                  insertAfter(newApkDiv, childDivs[0]);
                }
              }

              // Append the modified productDiv to the gridContainer
              productGrid.appendChild(productDiv);
              //gridwithinGridContainer.appendChild(productDiv);
            });

            // Custom function to insert an element after another element
            function insertAfter(newElement, referenceElement) {
              if (referenceElement.nextSibling) {
                referenceElement.parentNode.insertBefore(
                  newElement,
                  referenceElement.nextSibling
                );
              } else {
                referenceElement.parentNode.appendChild(newElement); // If there is no nextSibling, append to the end
              }
            }


            // Remove annyoing divs
            const childrenToRemove = [];
            Array.from(productGrid.children).forEach(child => {
              if (child.tagName.toLowerCase() === 'div' && !child.classList.contains('a')) {
                childrenToRemove.push(child);
              }
            });
            childrenToRemove.forEach(child => child.remove());

            // Resolve the promise when the task is complete
            return Promise.resolve("Divs reordered successfully");
          },
          args: [reorder],
        })
        .then((result) => { })
        .catch(() => {
          console.log("Systembolaget-APK-Extension Error");
        });
    }
  });
}

function productPage() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tabs.length > 0) {
      chrome.scripting
        .executeScript({
          target: { tabId: tab.id },
          function: () => {
            // Get the current URL
            const url = window.location.href;

            function getBackgroundColorForAPK(apk) {
              if (!apk || apk > 280 || apk <= 0) {
                return `rgb(200, 200, 200)`; // Default color for out-of-range APK values
              }

              // Normalize the APK value to a range between 0 and 1
              const normalizedAPK = apk / 280;

              // Define colors for interpolation
              const green = [0, 128, 0];
              const yellow = [255, 255, 0];
              const red = [255, 0, 0];
              const colors = [red, yellow, green];

              // Interpolate color based on normalized APK
              const numColors = colors.length - 1;
              const index = normalizedAPK * numColors;
              const startIndex = Math.floor(index);
              const endIndex = Math.ceil(index);
              const t = index - startIndex;
              const startColor = colors[startIndex];
              const endColor = colors[endIndex];

              const interpolatedColor = [
                Math.round(startColor[0] + t * (endColor[0] - startColor[0])),
                Math.round(startColor[1] + t * (endColor[1] - startColor[1])),
                Math.round(startColor[2] + t * (endColor[2] - startColor[2])),
              ];

              return `rgb(${interpolatedColor.join(",")})`;
            }
            let apk;

            const mainElement = document.querySelector("main");
            if (!mainElement) {
              console.error("Main element not found!");
              return;
            }

            const mainText = mainElement.innerText;
            const lines = mainText.split("\n");

            // Initialize variables to track our findings
            let procentLine = null;
            let pricePerLiterLine = null;

            // Scan through the array linearly
            try {
              for (let i = 0; i < Math.min(lines.length, 50); i++) {
                const line = lines[i].trim();

                // Find the line with volume information (contains " ml")
                if (line.includes(" % vol")) {
                  procentLine = line;
                  procent = parseFloat(procentLine.replace(",", "."));
                }

                // Find the line with price per liter (contains "kr/l")
                if (line.includes(" kr/l")) {
                  pricePerLiterLine = line;
                  pricePerLiter = parseFloat(
                    pricePerLiterLine.replace(":", ".").replace(" ", "")
                  );
                }
              }

              apk = Math.round((1000 * procent) / pricePerLiter); // 1000ml in a liter
              if (apk < 0 || apk > 300) {
                throw EvalError;
              }
            } catch {
              console.log(
                "Something went wrong trying to extract the APK values..."
              );
              return;
            }
          

            // Check if the APK div already exists
          const existingApkDiv = document.querySelector(".product-apk-div");

          // If APK div exists, check if the value has changed
          if(existingApkDiv) {
            const existingApkText = existingApkDiv.textContent;
            const existingApkValue = parseFloat(
              existingApkText.replace("APK: ", "")
            );
            const newApkValue = apk / 100;

            console.log(
              "Existing APK:",
              existingApkValue,
              "New APK:",
              newApkValue
            );

            // If the APK value is the same, no need to update
            if (existingApkValue === newApkValue) {
              console.log("APK value unchanged. No update needed.");
              return;
            }

            // If APK has changed, remove the existing div
            console.log("APK value changed. Updating...");
            existingApkDiv.remove();
          }

            // Find the container with "% vol." text
            const volContainer = Array.from(
            document.querySelectorAll("div")
          ).find((div) => div.textContent.trim().endsWith(" % vol."));

          if(volContainer) {
            // Create the APK div
            const apkDiv = document.createElement("div");
            apkDiv.textContent = `APK: ${apk / 100} ml/kr`;
            apkDiv.classList.add("product-apk-div");

            // Apply styles to the apkDiv
            const backgroundColor = getBackgroundColorForAPK(apk);
            apkDiv.style.cssText = `
              font-size: 16px;
              font-weight: bold;
              margin: 5px;
              color: rgb(55, 51, 48);
              background: ${backgroundColor};
              line-height: 19px;
              letter-spacing: 0.16em;
              text-transform: uppercase;
              display: inline-block; 
              align-items: center; 
              justify-content: center;
              padding: 1px;
            `;

            // Insert the APK div next to the volContainer
            volContainer.parentNode.insertBefore(
              apkDiv,
              volContainer.nextSibling
            );
            console.log("APK div updated/created successfully.");
          } else {
            console.error('Container with "% vol." not found');
          }
        },
          args: [],
        })
    .catch((error) => {
      console.log("Systembolaget-APK-Extension Error", error);
    });
}
  });
}

let previousUrl = "";

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.url) {
    const currentUrl = changeInfo.url;

    // Check if the URL has changed and matches the search page pattern
    if (
      currentUrl.startsWith("https://www.systembolaget.se/sortiment") &&
      currentUrl !== previousUrl
    ) {
      previousUrl = currentUrl; // Update the previous URL

      // Reload the tab
      chrome.tabs.reload(tabId, () => {
        console.log("Systembolaget page reloaded after URL change.");
      });
      return; // Ensure no further code runs after reload
    }
  }

  if (tab.url && tab.url.startsWith("https://www.systembolaget.se/produkt")) {
    // Wait for the page to fully load (complete status) before running productPage
    let timeout = 100;

    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        try {
          productPage();
        } catch {
          console.log("Systemet-APK.Extension: Page not loaded yet");
        }
      }, timeout);
      timeout *= 2;
    }
  }

  if (tab.url && tab.url.startsWith("https://www.systembolaget.se/sortiment")) {
    let timeout = 250;
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        searchPage(0);
      }, timeout);
      timeout *= 2;
    }
  }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "sort") {
    // Run the searchPage function when the "Sort" button is clicked
    searchPage(1);
  }
  if (request.message === "loadProductsAgain") {
    searchPage(0);
  }
});
