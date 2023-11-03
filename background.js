
const specialCasesIdToApk = {
  '8368': 100,
  '52361': 98,
  '53122': 98,
  '73227': 98,
  '76500': 98,
  '57487': 98,
  '88': 93,
  '39': 89,
  '86952': 86,
  '86811': 86,
  '86758': 86,
  '438': 86,
  '86009': 85,
  '52925': 84,
  '86879': 82,
  '74437': 81,
  '56403': 81,
  '78840': 81,
  '86137': 80,
  '73326': 80,
  '52146': 78,
  '86603': 78,
  '86315': 78,
  '50509': 77,
  '70104': 76,
  '70646': 76,
  '83213': 76,
  '59293': 74,
  '10953': 74,
  '1306': 73,
  '498': 73,
  '52089': 72,
  '79392': 72,
  '18': 72,
  '1063': 71,
  '89736': 71,
  '180': 70,
  '54836': 70,
  '58965': 70,
  '268': 70,
  '23': 69,
  '141': 68,
  '85808': 68,
  '59205': 68,
  '50843': 67,
  '184': 67,
  '53201': 67,
  '70104': 67,
  '10011': 67,
  '57687': 66,
  '51513': 65,
  '82907': 65,
  '59688': 65,
  '71065': 65,
  '59085': 65,
  '80104': 64,
  '80287': 64,
  '58431': 64,
  '84947': 64,
  '58328': 64,
  '51595': 64,
  '75226': 63,
  '75521': 62,
  '82452': 62,
  '53358': 62,
  '74843': 61,
  '50530': 61,
  '82199': 61,
  '58064': 61,
  '79713': 61,
  '86102': 61,
  '53912': 60,
  '79954': 60,
  '40270': 60,
  '53926': 60,
  '53010': 59,
  '58495': 59,
  '74864': 59,
  '70644': 59,
  '54852': 59,
  '55228': 59,
  '74452': 58,
  '87507': 58,
  '57024': 58,
  '51921': 57,
  '59394': 57,
  '87003': 57,
  '50070': 57,
  '74354': 56,
  '36353': 56,
  '58685': 56,
  '59519': 56,
  '59520': 56,
  '50941': 55,
  '53506': 55,
  '83565': 55,
  '70677': 55,
  '57151': 53,
  '58686': 53,
  '79646': 53,
  '56666': 53,
  '53417': 52,
  '76244': 52,
  '79935': 52,
  '74922': 51,
  '56148': 51,
  '72119': 51,
  '73344': 51,
  '432': 51,
  '57190': 51,
  '59966': 51,
  '58242': 51,
  '72436': 50,
  '74375': 50,
  '51318': 50,
  '8065': 50,
  '76300': 50,
  '55986': 50,
  '11426': 49,
  '56849': 49,
  '749': 49,
  '54439': 49,
  '59312': 48,
  '59224': 48,
  '59320': 48,
  '54056': 48,
  '85533': 48,
  '77429': 48,
  '52514': 48,
  '57077': 48,
  '58207': 48,
  '77599': 47,
  '72551': 47,
  '34668': 47,
  '53566': 47,
  '53516': 46,
  '74149': 46,
  '59055': 46,
  '75977': 46,
  '387': 46,
  '70676': 46,
  '72867': 46,
  '54849': 46,
  '55501': 46,
  '75174': 45,
  '57518': 45,
  '50793': 45,
  '55370': 45,
  '58869': 45,
  '71606': 45,
  '59584': 44,
  '58967': 44,
  '58253': 44,
  '55440': 44,
  '50357': 44,
  '51732': 44,
  '58930': 44,
  '56145': 44,
  '70424': 44,
  '57473': 44,
  '82275': 44,
  '80631': 44,
  '76669': 43,
  '80470': 43,
  '55195': 43,
  '58561': 43,
  '59026': 43,
  '75678': 43,
  '734': 43,
  '58252': 43,
  '53528': 42,
  '58719': 42,
  '58842': 42,
  '54266': 42,
  '57166': 42,
  '57098': 42,
  '54356': 42,
  '51647': 42,
  '59290': 42,
  '58922': 42,
  '58611': 42,
  '59088': 42,
  '59334': 42,
  '52979': 42,
  '56868': 42,
  '73137': 42,
  '58446': 42,
  '57023': 42,
  '52454': 41,
  '56268': 41,
  '72333': 41,
  '89690': 41,
  '52752': 41,
  '53751': 41,
  '56560': 41,
  '59162': 41,
  '54544': 41,
  '56473': 41,
  '59275': 41,
  '70158': 40,
  '56359': 40,
  '86251': 40,
  '54409': 40,
  '82289': 40,
  '77956': 40,
  '52938': 40,
  '56105': 40,
  '53643': 40,
  '70239': 40,
  '70642': 40,
  '55763': 40,
  '59242': 39,
  '52688': 39,
  '52684': 39,
  '54408': 39,
  '56540': 39,
  '57778': 39,
  '58254': 39,
  '57550': 39,
  '50210': 39,
  '54274': 39,
  '72369': 39,
  '51014': 39,
  '51914': 39,
  '58635': 39,
  '55017': 38,
  '50340': 38,
  '51878': 38,
  '82271': 38,
  '55902': 38,
  '52122': 38,
  '54182': 38,
  '81411': 38,
  '51890': 38,
  '54073': 38,
  '58084': 38,
  '58925': 38,
  '51317': 38,
  '59412': 38,
  '88312': 37,
  '56358': 37,
  '363': 37,
  '55336': 37,
  '53388': 37,
  '76019': 37,
  '56575': 37,
  '51822': 37,
  '53253': 37,
  '50016': 37,
  '59285': 37,
  '58442': 37,
  '59067': 37,
  '70737': 36,
  '59339': 36,
  '81337': 36,
  '57973': 36,
  '58224': 36,
  '57420': 36,
  '86444': 36,
  '54593': 36,
  '59145': 36,
  '52217': 36,
  '356': 36,
  '73848': 36,
  '57059': 36,
  '54840': 36,
  '52160': 36,
  '51241': 36,
  '52528': 36,
  '59403': 36,
  '54566': 36,
  '58634': 36,
  '56570': 36,
  '71350': 36,
  '83393': 36,
  '50409': 36,
  '59244': 36,
  '57067': 35,
  '57211': 35,
  '52622': 35,
  '53380': 35,
  '57107': 35,
  '54486': 35,
  '71191': 35,
  '86328': 35,
  '80150': 35,
  '59337': 35,
  '75582': 35,
  '51624': 35,
  '55910': 35,
  '58037': 35,
  '51481': 35,
  '52408': 35,
  '54168': 35,
  '55116': 35,
  '71292': 35,
  '58042': 35,
  '59386': 35,
  '51448': 34,
  '55640': 34,
  '58687': 34,
  '53888': 34,
  '50908': 34,
  '56140': 34,
  '57270': 34,
  '50451': 34,
  '52409': 34,
  '80038': 34,
  '51670': 34,
  '86662': 34,
  '59303': 34,
  '51580': 34,
  '50823': 34,
  '72681': 34,
  '54794': 34,
  '54599': 34,
  '34758': 34,
  '57478': 34,
  '51240': 34,
  '56119': 34,
  '58349': 34,
  '71905': 34,
  '51717': 34,
  '51804': 34,
  '58689': 33,
  '51440': 33,
  '53891': 33,
  '57410': 33,
  '58608': 33,
  '76403': 33,
  '76393': 33,
  '52435': 33,
  '50545': 33,
  '81374': 33,
  '81449': 33,
  '59122': 33,
  '58767': 33,
  '53153': 33,
  '58769': 33,
  '55273': 33,
  '57099': 33,
  '58761': 33,
  '59803': 33,
  '57025': 32,
  '59877': 32,
  '50997': 32,
  '58363': 32,
  '58276': 32,
  '58621': 32,
  '52580': 32,
  '56323': 32,
  '73095': 32,
  '51644': 32,
  '50549': 32,
  '70865': 32,
  '50501': 32,
  '53030': 32,
  '82262': 32,
  '57680': 32,
  '54455': 32,
  '75468': 32,
  '53641': 32,
  '336': 32,
  '41192': 32,
  '52645': 32,
  '56878': 32,
  '57984': 32,
  '58301': 31,
  '57413': 31,
  '57985': 31,
  '57636': 31,
  '59152': 31,
  '58874': 31,
  '58005': 31,
  '58067': 30,
  '53540': 30,
  '50864': 30,
  '34082': 30,
  '56893': 30,
  '57972': 30,
  '50745': 30,
  '51983': 30,
  '56472': 30,
  '76541': 30,
  '57822': 30,
  '57086': 29,
  '59489': 29,
  '59398': 29,
  '53403': 29,
  '57884': 29,
  '81770': 29,
  '52539': 29,
  '59497': 29,
  '51395': 29,
  '53523': 29,
  '58399': 28,
  '56412': 28,
  '56545': 28,
  '83316': 28,
  '50343': 28,
  '57047': 28,
  '53886': 28,
  '56985': 28,
  '75209': 28,
  '59789': 28,
  '59125': 28,
  '51267': 27,
  '59915': 27,
  '56913': 27,
  '59818': 27,
  '57522': 27,
  '53394': 27,
  '87377': 27,
  '59465': 27,
  '52852': 27,
  '53289': 27,
  '52395': 27,
  '52157': 27,
  '53130': 27,
  '51916': 27,
  '52887': 27,
  '93500': 26,
  '58744': 26,
  '58817': 26,
  '58745': 26,
  '59200': 26,
  '59506': 26,
  '56285': 26,
  '57347': 26,
  '58325': 26,
  '59025': 26,
  '51545': 26,
  '10210': 26,
  '59043': 26,
  '55290': 25,
  '54606': 25,
  '53542': 25,
  '53231': 25,
  '54460': 25,
  '52120': 24,
  '52561': 24,
  '59484': 24,
  '82533': 24,
  '59315': 24,
  '84206': 24,
  '53495': 23,
  '77121': 23,
  '78962': 23,
  '55099': 23,
  '57124': 23,
  '54625': 23,
  '52962': 23,
  '56142': 23,
  '77626': 23,
  '79324': 23,
  '58603': 23,
  '59765': 23,
  '50094': 23,
  '58277': 22,
  '72869': 22,
  '78973': 22,
  '51769': 22,
  '73609': 22,
  '50010': 21,
  '54863': 21,
  '54001': 21,
  '59126': 21,
  '53706': 21,
  '58002': 21,
  '58555': 21,
  '51754': 21,
  '57832': 21,
  '55234': 21,
  '53759': 21,
  '52286': 21,
  '59673': 20,
  '54990': 20,
  '51431': 20,
  '57176': 20,
  '72980': 20,
  '52506': 20,
  '58428': 20,
  '59843': 20,
  '79151': 20,
  '59192': 20,
  '58711': 20,
  '54564': 20,
  '56342': 20,
  '76386': 19,
  '55135': 19,
  '54977': 19,
  '79092': 19,
  '53737': 19,
  '54957': 19,
  '58302': 19,
  '50126': 19,
  '75820': 19,
  '56101': 19,
  '55522': 18,
  '54683': 18,
  '51640': 18,
  '58709': 18,
  '58797': 18,
  '13083': 18,
  '53491': 18,
  '58245': 18,
  '58240': 18,
  '51886': 18,
  '58239': 18,
  '59635': 18,
  '59131': 17,
  '82434': 17,
  '73547': 17,
  '58178': 17,
  '53365': 16,
  '59189': 16,
  '82992': 16,
  '58710': 16,
  '79757': 16,
  '82005': 16,
  '50430': 16,
  '56396': 16,
  '52327': 16,
  '56759': 16,
  '54760': 16,
  '56420': 16,
  '57671': 15,
  '59405': 15,
  '50497': 14,
  '57326': 14,
  '52629': 14,
  '55353': 14,
  '52939': 14,
  '57602': 13,
  '74813': 13,
  '53110': 13,
  '77218': 13,
  '59464': 12,
  '54351': 11,
  '52555': 11,
  '58032': 11,
  '59560': 10,
  '94530': 3,
  '1999': 2,
  '11937': 1,
}

function findDivs() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          const divs = document.querySelectorAll('div[class^="css-"]');
          for (const div of divs) {
            //console.log(div)
            console.log("wow: ", div.classList[0]); // Return the first class name
            
          }

        }
      });
    }
  });
}


function searchPage(reorder, specialCasesIdToApk) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (reorder, specialCasesIdToApk) => {
          const container = document.querySelector('.css-176nwz9');
          const productDivs = Array.from(container.querySelectorAll('.css-1lc3wed'));

          
          // Remove "Vad passar med detta" divs
          const elementsToRemove = document.querySelectorAll('.css-jwxeh2.e18roaja0');
          elementsToRemove.forEach((element) => {
            element.remove();
          });
          

          function calcApk(productDiv) {
            const productShortNrText = productDiv.querySelector('.css-yf7p47');
            const productShortNr = productShortNrText.textContent.replace("Nr ", "");

            if (productShortNr in specialCasesIdToApk) {
              const apk = specialCasesIdToApk[productShortNr];
              return apk;
            }

            const volumeElement = productDiv.querySelectorAll('.css-1r1n3du');
            const mlVolume = parseFloat(volumeElement[1].textContent.replace(" ","").replace("ml", ""));
            const alcoholPercentage = parseFloat(volumeElement[2].textContent.replace(",", "."));

            const priceElement = productDiv.querySelectorAll('.css-134u9m6');
            const price = parseFloat(priceElement[0].textContent.replace(":", ".").replace(" ",""));

            const apk = parseInt(Math.round(mlVolume * alcoholPercentage / price));
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
            const priceElement = productDiv.querySelectorAll('.css-134u9m6');
            const price = parseFloat(priceElement[0].textContent.replace(":", "."));

            productDiv.querySelectorAll('.css-134u9m6')[0].innerHTML  = price + "kr <br> APK:" + apk/100;

            if (apk > 300) {
              productDiv.querySelectorAll('.css-134u9m6')[0].innerHTML  = price + "kr <br> APK: error";
            }
            container.appendChild(productDiv);

          });
          // Resolve the promise when the task is complete
          return Promise.resolve("Divs reordered successfully");
        },
        args: [reorder, specialCasesIdToApk]
      }).then((result) => {
      }).catch(() => {
        console.log("Systembolaget-APK-Extension Error");
      });
    }
  });
}



function productPage(specialCasesIdToApk) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tabs.length > 0) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: (specialCasesIdToApk) => {
          const divs = document.querySelectorAll('div[class^="css-"]');
          let mainPageClass;
          for (const div of divs) {
            if (div.textContent.includes("HemSortiment")) {
              mainPageClass = "."+div.classList[0];
              break;
            }
          }

          let matchingDivs = [];
          for (const div of divs) {
            if (div.textContent.includes("kr/l")) {
              matchingDivs.push(div);
            }
          }
          const priceElementClass = "."+matchingDivs[matchingDivs.length-2].classList[0];
          console.log(priceElementClass)

          documentElem = document.querySelector(mainPageClass);
          docInnerText = documentElem.innerText.split("\n");

          let alcoholPercentageI;
          for (let i = 0; i < 40; i++) {
            if (docInnerText[i].includes("% vol.")) {
              alcoholPercentageI = i;
            }
          }
          
          const volume = parseFloat(docInnerText[alcoholPercentageI-4]);
          const alcoholPercentage = parseFloat(docInnerText[alcoholPercentageI].replace(",", "."));
          const price = parseFloat(docInnerText[alcoholPercentageI+6].replace(":", "."));

          const productShortNr = docInnerText[alcoholPercentageI+4].split("\n")[0].replace("Nr ", "");
          if (productShortNr in specialCasesIdToApk) {
            const apk = specialCasesIdToApk[productShortNr];
            document.querySelector('.css-149y42u.e1hb4h4s0').textContent = price + "kr <br> APK:" + apk/100;
            return;
          }

          // Parse the extracted information as needed
          
          // Calculate APK using the extracted data
          const apk = parseInt(Math.round(volume * alcoholPercentage / price));
          console.log(apk);

          if (apk != undefined) {
            if (apk > 250) {
              document.querySelector('.css-149y42u.e1hb4h4s0').textContent = price + "kr, APK: error";
            }
            else {
              document.querySelector('.css-149y42u.e1hb4h4s0').textContent = price + "kr, APK:" + apk / 100;
            }
          }
      
        },
        args: [specialCasesIdToApk]
      }).then((result) => {
      }).catch(() => {
        console.log("Systembolaget-APK-Extension Error"); // Handle any errors
      });
    }
  });
}

chrome.tabs.onUpdated.addListener((details, changeInfo, tab) => {
  if (tab.url && tab.url.startsWith("https://www.systembolaget.se/produkt")) {
    // Wait for the page to fully load (complete status) before running productPage
    if (changeInfo.status === "complete") {
      let timeout = 100;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          try {
            productPage(specialCasesIdToApk);
          } catch {
            console.log("Systemet-APK.Extension: Page not loaded yet");
          }
        }, timeout);
        timeout *= 2;
      }
    }
  }
  if (tab.url && tab.url.startsWith("https://www.systembolaget.se/sortiment")) {
    // Wait for the page to fully load (complete status) before running productPage
    if (changeInfo.status === "complete") {
      let timeout = 500;
      for (let i = 0; i < 3; i++) {
        setTimeout(() => {
          searchPage(0, specialCasesIdToApk);
        }, timeout);
        timeout *= 2;
      }
    }
  }
});



chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message === "sort") {
    // Run the searchPage function when the "Sort" button is clicked
    //searchPage(1, specialCasesIdToApk);
    findDivs();
  }
  if (request.message === "loadProductsAgain") {
    searchPage(0, specialCasesIdToApk);
  }
});





