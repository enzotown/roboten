# Roboten — design

Ett programmeringsspel för barn 4–7 år. Barnet lägger pilar i en programrad och trycker på den gröna
knappen. Roboten utför kommandona exakt som de står — även när det blir tokigt. Inget går sönder:
roboten tutar förvånat, skakar på huvudet och programmet finns kvar så att barnet kan ändra och köra igen.

## Målgrupp

- 4–7 år, iPad (liggande och stående) och dator med mus.
- Barnet behöver inte kunna läsa. Allt viktigt är ikoner, färg och ljud; texten är stöd för en vuxen.
- Spelas gärna tillsammans med en vuxen som läser hjälprutan första gången.

## Lärandemål

1. **Sekvens** — kommandon utförs i den ordning de läggs i raden.
2. **Planering före handling** — prickarna på brädan visar vägen innan roboten går.
3. **Riktning och sväng** — pil upp går framåt, vänster/höger svänger roboten 90 grader.
4. **Orsak och verkan** — ett felplacerat kommando syns direkt; man ändrar och provar igen.
5. **Rumsuppfattning** — rutnät, hinder, avstånd och att hoppa över något som är i vägen.
6. **Nyckel före frukt** — ordning spelar roll (sista nivån).

## Designyta och skalning

Allt ritas i en fast designyta 1000 × 700 px på en canvas. `resize()` räknar
`SC = min(vw/1000, vh/700)`, centrerar ytan (`OX`, `OY`) och sätter canvasens transform till
`DPR * SC`. Pekkoordinater räknas tillbaka med `toDesign()`, så träffytorna stämmer på iPad i både
porträtt och landskap. Rutnätet är 8 × 6 rutor om 84 px (672 × 504 px).

## Palett och typografi

| Namn | Färg |
| --- | --- |
| cream | `#fffaf3` |
| brown | `#4a3f39` |
| brown2 | `#6b5d54` |
| mint | `#7bcbb6` |
| mintDark | `#4fae94` |
| coral | `#ef8064` |
| yellow | `#ffe08a` |
| sand | `#f3ddb4` |

Completterande: gräsmatta `#dcefc8` / `#cfe8bb`, sten `#b9b3ad`, vatten `#4fb4e0`.
Typsnitt: `"Trebuchet MS", Verdana, sans-serif`. Ljud göras med WebAudio (`tone()`, `chime()`,
`bonk()`, `pip()`) — inga externa ljudfiler.

## Objektlista

| Objekt | Beskrivning | Fil |
| --- | --- | --- |
| Robot | rund plåtrobot, mint kropp, mörka ögon som blinkar, antenn med gul lampa, hjul | `art2.js` → `drawRobot(x, y, heading, t, mood, skala)` |
| Bräda | grön/creme-rutig matta med rundade hörn och tydligt rutnät | `art.js` → `drawBoard()` |
| Sten | grå rund sten med hög kant | `art.js` → `drawStone()` |
| Damm | blå vattenpöl med vågor, går inte att gå på | `art.js` → `drawWater()` |
| Äpple | rött äpple med blad | `art2.js` → `drawApple()` |
| Banan | gul banan | `art2.js` → `drawBanana()` |
| Jordgubbe | röd jordgubbe med frön | `art2.js` → `drawStrawberry()` |
| Nyckel | gul nyckel som måste plockas före frukten | `art2.js` → `drawKey()` |
| Förhandsvisning | prickar (och rött kryss vid krock) längs den tänkta vägen | `art3.js` → `drawPreview()` |
| Programrad | 12 platser med brickor, aktuell bricka lyser under körning | `art3.js` → `drawStrip()` |
| Knappar | Fram (mint), Vänster/Höger (gul), Hoppa (coral), SPELA (grön), RENSA (liten) | `art3.js` → `drawButtons()` |
| Hjälpruta | svensk korttext, stängs med ett tryck var som helst | `art3.js` → `drawHelp()` |
| Stjärnor | partiklar vid frukt, nyckel och firande | `art3.js` → `drawParts()` |

## Motor och regler

- **Kommandon:** `fram` (ett steg i riktningen), `vanster`/`hoger` (90° sväng), `hoppa`
  (hoppar två rutor och landar bortom hindret). Hopp tillåts bara när rutan i mitten är sten eller
  damm och landningsrutan är fri. Damm är alltså ett hinder man måste gå runt eller hoppa över.
- **Körning:** ett kommando per 0,42 s (`STEP`), mjuk sväng, liten studs vid gång, hoppbåge vid hopp,
  ett pip per steg med stigande tonhöjd.
- **Krock:** låg "bonk", roboten skakar på huvudet och en liten pratbubbla visas. Programmet töms
  aldrig; barnet får ändra och köra igen.
- **Frukt:** glad jingle, stjärnor, frukten plockas och nästa nivå laddas efter 1,6 s.
- **Nyckel:** måste plockas (robotens ruta) innan frukten kan tas. Utan nyckel stannar roboten vid
  frukten med budskapet "Nyckeln först!".
- **Förhandsvisning:** varje tillägg/ändring simulerar hela programmet och ritar prickar. Vid krock
  ritas ett rött kryss vid hindret och resten av vägen visas inte.
- **Max 12 kommandon.** Är raden full piper det till och en bubbla säger "Raden är full!".
- **Ta bort:** tryck på en bricka i raden. **RENSA** tömmer hela raden.

## Nivåer

Alla nivåer är handdesignade. Kortaste lösning är kontrollerad med BFS i webbläsartestet och är
exakt 2, 3, 4, 5, 6, 7 respektive 8 kommandon.

| Nivå | Frukt | Kommandon | Hindertyper | Exempel på lösning |
| --- | --- | --- | --- | --- |
| 1 | äpple | 2 | stenar vid sidan | Fram, Fram |
| 2 | banan | 3 | stenar, damm vid sidan | Vänster, Fram, Fram |
| 3 | jordgubbe | 4 | sten i vägen (hoppa) | Fram, Hoppa, Fram, Fram |
| 4 | äpple | 5 | damm i vägen (hoppa) | Fram, Hoppa, Fram, Fram, Fram |
| 5 | banan | 6 | 3 rutor damm som måste rundas | Vänster, Fram, Fram, Höger, Fram, Fram |
| 6 | jordgubbe | 7 | sten vid kanten (hoppa) | Vänster, Fram, Fram, Hoppa, Höger, Fram, Fram |
| 7 | äpple + nyckel | 8 | sten i vägen, nyckel först | Vänster, Fram, Fram, Höger, Fram, Hoppa, Vänster, Fram |

## Filer

- `index.html` — canvas, meta-taggar, scriptordning.
- `engine.js` — designyta, `resize()`, pekmappning, palett, ljud.
- `art.js` — bakgrund, bräda, sten, damm.
- `art2.js` — robot, frukter, nyckel, startplatta.
- `art3.js` — HUD, hylla, knappar, programrad, förhandsvisning, hjälp, firande, partiklar.
- `app.js` — nivådata, spelläge, inmatning, körning, kollisioner, test-API (`window.__game`).
- `loop.js` — `update()` / `draw()` / `requestAnimationFrame`.
- `test.html` — automatiska tester som körs i webbläsaren.
- `icon-180.png`, `icon-192.png`, `icon-512.png` — appikoner.

## Testning

`test.html` körs headless i Chromium och skriver resultatet som text. Det kontrollerar bland annat:
nivådata och att alla nivåer går att lösa, kortaste lösningens längd, att lösningarna vinner i spelets
egen logik, förhandsvisningens sista prick, att krock inte tömmer programmet, nyckelregeln, att alla
7 nivåer kan spelas klart med animerade steg, pekträffar i porträtt/landskap samt att hela scenen
ritas utan fel.

## Kvarvarande brister / att tänka på

- Nivåerna är små och ganska lätta; efter nivå 7 finns ingen fortsättning (bara "Spela igen").
- Hjälprutan är på svenska och kräver att en vuxen läser den första gången.
- Ljudet startar först vid första tryck (webbläsarens autoplay-regel).
- Två knapptryck mycket snabbt i följd på SPELA ignoreras medvetet under körning.