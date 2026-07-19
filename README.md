# Höhenmeter

Täglicher Regel-Tracker mit nach Wirksamkeit gewichteter Bewertung.
Statische Web-App ohne Server, ohne Konto, ohne Tracking.

## Veröffentlichen

1. Dateien in ein Repository legen (alle im Wurzelverzeichnis).
2. Settings → Pages → Source: `Deploy from a branch`, Branch: `main`, Ordner `/ (root)`.
3. Nach ein bis zwei Minuten ist die Seite unter `https://BENUTZERNAME.github.io/REPO/` erreichbar.

## Auf dem iPhone installieren

Seite in **Safari** öffnen → Teilen-Symbol → **Zum Home-Bildschirm**.

Die Installation ist nicht optional: Nur als Home-Bildschirm-App sind die Daten
von Safaris Sieben-Tage-Löschregel für Website-Daten ausgenommen.

## Datenhaltung

Alle Einträge liegen im `localStorage` des Geräts, gebunden an die Herkunft der Seite.
Es findet keine Übertragung statt. Der Server liefert ausschließlich die App-Dateien aus.

- **Sicherung teilen** – vollständiger Datenstand als JSON, über das Teilen-Menü in „Dateien" oder iCloud ablegen.
- **Sicherung einlesen** – stellt einen Stand wieder her, auch auf einem anderen Gerät.
- **Verlauf als CSV** – eine Zeile je Tag mit allen Einzelregeln, Semikolon-getrennt, Excel-tauglich.

Vor einem Wechsel der URL, des Repository-Namens oder auf eine eigene Domain
unbedingt exportieren: Mit der Herkunft ändert sich auch der Speicher.

## Aufbau

| Datei | Zweck |
|---|---|
| `index.html` | Vollständige App: Regeln, Bewertung, Speicherung, Export |
| `manifest.webmanifest` | Name, Icons, Vollbildmodus |
| `sw.js` | Service Worker für Offline-Betrieb |
| `icon-*.png`, `apple-touch-icon.png` | Icons |

Regeln und Gewichtungen stehen als Arrays `KERN`, `BONUS` und `NEG` am Anfang des Skriptblocks
in `index.html`. Gewichte lassen sich auch zur Laufzeit in der App ändern.

## Bewertung

**Schlaf** wird über zwei Regler erfasst, nicht als Häkchen. Ab sieben Stunden gibt es die volle
Punktzahl, darunter sinkt sie linear bis auf null bei vier Stunden – sechs Stunden ergeben also
zwei Drittel. Die Regler dürfen sich nicht kreuzen; der jeweils andere schiebt nach.

**Negativpunkte** stammen aus `Checklist.xlsx` – die dort als Verzicht geführten Zeilen (Alkohol,
Süßigkeiten, Zwischenmahlzeiten, Weißmehl, Wurst). Sie werden je Tag als Einheiten gezählt und
erst *nach* der Normierung abgezogen. Ein Tag kann dadurch ins Minus rutschen, was beabsichtigt
ist: 60 % mit sechs Bier sollen nicht wie 60 % ohne aussehen.

**Die Wochenwertung ist fortlaufend** – der Mittelwert der erfassten Tage im gleitenden
Sieben-Tage-Fenster, nicht der Kalenderwoche. Sie wandert also täglich mit und kann ebenfalls
negativ werden.
