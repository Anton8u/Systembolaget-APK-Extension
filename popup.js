document.getElementById('reorderButton').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    // Send a message to the content script
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: () => {
        const container = document.querySelector('.css-176nwz9.e18roaja0');
        const productDivs = Array.from(container.querySelectorAll('.css-1lc3wed.enuzix00'));

        productDivs.sort((a, b) => {
          // Find the relevant <p> elements within each productDiv
          const volumeElementsA = a.querySelectorAll('.css-mzek0q.e1yhfiwj0');
          const volumeElementsB = b.querySelectorAll('.css-mzek0q.e1yhfiwj0');

          const priceElementsA = a.querySelectorAll('.css-3yr2fs.e1hb4h4s0');
          const priceElementsB = b.querySelectorAll('.css-3yr2fs.e1hb4h4s0');

          const mlVolumeA = parseFloat(volumeElementsA[1].textContent.trim());
          const mlVolumeB = parseFloat(volumeElementsB[1].textContent.trim());
          const alcoholVolumeA = parseFloat(volumeElementsA[2].textContent.replace(",","."));
          const alcoholVolumeB = parseFloat(volumeElementsB[2].textContent.replace(",","."));
          const priceA = parseFloat(priceElementsA[0].textContent.replace(":","."));
          const priceB = parseFloat(priceElementsB[0].textContent.replace(":","."));

          const apkA = parseInt(Math.round(mlVolumeA * alcoholVolumeA / priceA));
          const apkB = parseInt(Math.round(mlVolumeB * alcoholVolumeB / priceB));
          return apkB - apkA;
        });

        productDivs.forEach((productDiv) => {
          const volumeElements = productDiv.querySelectorAll('.css-mzek0q.e1yhfiwj0');
          const priceElements = productDiv.querySelectorAll('.css-3yr2fs.e1hb4h4s0');
          const mlVolume = parseFloat(volumeElements[1].textContent.trim());
          const alcoholVolume = parseFloat(volumeElements[2].textContent.replace(",","."));
          const price = parseFloat(priceElements[0].textContent.replace(":","."));
          const apk = parseInt(Math.round(mlVolume * alcoholVolume / price));

          productDiv.querySelectorAll('.css-3yr2fs.e1hb4h4s0')[0].textContent = price + "kr, APK:" + apk;
          console.log(apk);
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
