/**
 * The green "popup" box shown as the first item of the search grid, so the
 * sort toggle is one click away without opening the extension popup.
 *
 * Like the badges it is our own element added next to the site's tiles; it
 * stays first because the sorting only gives tiles an `order` of 1 or more.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    (root.SBAPK = root.SBAPK || {}).card = api;
  }
})(globalThis, function () {
  "use strict";

  const CARD_ATTR = "data-sbapk-card";

  function build(doc, onToggle) {
    const card = doc.createElement("li");
    card.className = "sbapk-card";
    card.setAttribute(CARD_ATTR, "");

    const box = doc.createElement("div");
    box.className = "sbapk-card__box";

    const title = doc.createElement("p");
    title.className = "sbapk-card__title";

    const button = doc.createElement("button");
    button.type = "button";
    button.className = "sbapk-card__button";
    button.addEventListener("click", onToggle);

    box.append(title, button);
    card.append(box);
    return card;
  }

  function setText(el, text) {
    if (el.textContent !== text) el.textContent = text;
  }

  function render(card, { sort, texts }) {
    const button = card.querySelector("button");
    setText(card.querySelector(".sbapk-card__title"), texts.title);
    setText(button, sort ? texts.sortOn : texts.sortOff);
    button.title = sort ? texts.sortOnTitle : texts.sortOffTitle;
    button.setAttribute("aria-pressed", String(sort));
  }

  /** Makes sure `grid` starts with exactly one up-to-date card. */
  function update(grid, { sort, texts, onToggle }) {
    const doc = grid.ownerDocument;
    let card = grid.querySelector(`:scope > [${CARD_ATTR}]`);
    if (!card) card = build(doc, onToggle);
    if (grid.firstElementChild !== card) grid.prepend(card);
    render(card, { sort, texts });
  }

  return { update, CARD_ATTR };
});
