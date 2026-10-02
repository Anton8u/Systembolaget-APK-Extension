const { SORT_KEY } = globalThis.SBAPK.settings;

const TEXTS = {
  sv: {
    title: "APK till Systembolaget",
    sortOff: "Sortera!",
    sortOn: "Sorterar ✓",
    sortOffTitle: "Sortera resultaten på sortimentsidan efter APK",
    sortOnTitle: "Sorterar efter APK. Klicka för att stänga av",
    credit: "av",
  },
  en: {
    title: "APK for Systembolaget",
    sortOff: "Sort!",
    sortOn: "Sorting ✓",
    sortOffTitle: "Sort the results on the search page by APK",
    sortOnTitle: "Sorting by APK. Click to turn off",
    credit: "by",
  },
};

const text = navigator.language.startsWith("sv") ? TEXTS.sv : TEXTS.en;
const button = document.getElementById("sortButton");

function renderSortState(enabled) {
  button.textContent = enabled ? text.sortOn : text.sortOff;
  button.title = enabled ? text.sortOnTitle : text.sortOffTitle;
  button.setAttribute("aria-pressed", String(enabled));
}

async function readSortState() {
  const stored = await chrome.storage.local.get({ [SORT_KEY]: false });
  return Boolean(stored[SORT_KEY]);
}

document.getElementById("title").textContent = text.title;
document.getElementById("creditBy").textContent = text.credit;

readSortState().then(renderSortState);

button.addEventListener("click", async () => {
  const enabled = !(await readSortState());
  await chrome.storage.local.set({ [SORT_KEY]: enabled });
  renderSortState(enabled);
});
