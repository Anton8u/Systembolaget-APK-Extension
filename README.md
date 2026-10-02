# Systembolaget-APK-Extension

Ett tillägg till chromium baserade webbläsare (Chrome, Edge, m.m.) som visar APK (ml alkohol / kr) på Systembolagets webbplats och kan sortera produkterna baserat på det. 

Chrome Web Store: https://chromewebstore.google.com/detail/gpphiolpmlfocafaibnjjioimlkbcbnf?utm_source=item-share-cb

## Användning:

Man söker efter produkter som vanligt på systembolaget.se. APK-värden visas automatiskt på produkterna i sökresultatet och på produktsidorna.

För att sortera produkterna efter APK, öppna tilläggets popup i webbläsaren och klicka på "Sortera!". Sorteringen ligger kvar när du byter sida eller ändrar filter, tills du klickar på knappen igen. Sorteringen gäller produkterna på den sida du står på (30 st).

## För utvecklare

Inget byggsteg: tillägget laddas direkt från mappen (`chrome://extensions` → Läs in okomprimerat).

| Fil | Uppgift |
| --- | --- |
| `src/apk.js` | Ren logik: tolkar pris/volym/alkoholhalt, räknar ut APK och färg. Ingen DOM. |
| `src/search.js` | Sökresultatet (`/sortiment`): märken på varje produktkort, sortering via CSS `order`. |
| `src/product.js` | Produktsidan (`/produkt/...`): ett märke under volym/alkoholrad. |
| `src/content.js` | Startpunkt. Övervakar sidan med en `MutationObserver` och kör om när den ändras. |
| `popup/` | Popupen med sorteringsknappen (sparas i `chrome.storage.local`). |

Sidan är en single-page-app, så tillägget reagerar på ändringar i DOM:en i stället för på sidladdningar. Sökresultatets produktkort hittas via `data-slot`-attributen (`product-tile`, `product-summary-metadata`, `product-summary-price`). Om Systembolaget ändrar dem igen är det `SELECTORS` i `src/search.js` som ska uppdateras.

### Tester

Kräver Node.js.

```
npm install --save-dev jsdom
npm test
```

### Paketera för Chrome Web Store

```
npm run package
```

Skapar `dist/systembolaget-apk-extension-<version>.zip` med bara de filer tillägget behöver (inga tester, `node_modules` eller `logo1500.png`).

Testerna använder sparade utdrag av Systembolagets riktiga HTML i `tests/fixtures/`.
