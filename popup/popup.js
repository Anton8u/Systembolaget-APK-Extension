const { settings, texts } = globalThis.SBAPK;

const text = texts.forLanguage(navigator.language);
const button = document.getElementById("sortButton");

function renderSortState(enabled) {
  button.textContent = enabled ? text.sortOn : text.sortOff;
  button.title = enabled ? text.sortOnTitle : text.sortOffTitle;
  button.setAttribute("aria-pressed", String(enabled));
}

document.getElementById("title").textContent = text.title;
document.getElementById("creditBy").textContent = text.credit;

settings.getSortEnabled().then(renderSortState);
settings.onSortChanged(renderSortState);

button.addEventListener("click", async () => {
  await settings.setSortEnabled(!(await settings.getSortEnabled()));
});
