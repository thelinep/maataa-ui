# Shot lists and call sheets from Maataa Workstation

Maataa Workstation (`nova-console` in the brahmini repo, `thelinep/nova`) drafts shot lists and call sheets with a local model. Its skills are `skills/shotlist.js` and `skills/callsheet.js`. `@maataa/ui/data` shows and reuses what they produce:

| Piece                                 | What it does                                                                                                                                                                                                                                                                                                                         |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `readNovaOutput(input)`               | Recognises a shot list or call sheet. It accepts four forms, as an object or as JSON text: a saved output from the workstation, the `.json` recipe Maataa Library writes beside each `.md`, a skill run result, or the bare data. Anything else gets a plain message, and a pasted `.md` copy gets told to open the `.json` instead. |
| `fromNovaCallSheet(data)`             | Props for `CallSheetPrintView`. Day _n_ of _m_, the earliest crew call, the shooting call, weather, hospital and base camp. Schedule rows become scene rows, with the time in the notes. Cast notes stay with the role.                                                                                                              |
| `fromNovaShotList(data)` / `ShotList` | The shot list by scene. Sizes are spelled out (CU becomes "close-up"), with totals per scene and overall. Shots without a duration are counted and flagged. It prints on A4.                                                                                                                                                         |
| `sceneRowsFromShotList(data)`         | Starts a call sheet from a shot list: one scene row per scene. Set and day/night come from the heading, including Hindi headings such as "आंतरिक. माँ की रसोई - रात".                                                                                                                                                                |
| `fetchNovaOutputs(base)`              | The workstation's saved shot lists and call sheets, newest first.                                                                                                                                                                                                                                                                    |
| `WorkstationOutputs`                  | All of the above in one panel: load, open a `.json` file or paste; switch between outputs; "Start a call sheet from these scenes".                                                                                                                                                                                                   |

The workstation writes "TBC" for anything not in its source. Those cells stay "TBC" and are shown muted, so nobody mistakes a guess for a fact. The panel also names the model that drafted the output.

## Loading straight from the workstation

The workstation listens on `127.0.0.1:8787` and sends no CORS headers, so a page on another port can't call it directly. That is right for a local tool. In development, proxy it from Vite:

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: { "/nova": { target: "http://127.0.0.1:8787", rewrite: (p) => p.replace(/^\/nova/, "") } },
  },
});
```

Then use `<WorkstationOutputs base="/nova" />`. Without the proxy, open the `.json` files from Maataa Library (by default `~/Documents/Maataa Library/<day>/`) or paste JSON.

## How the shapes were checked

`src/data/nova.fixture.ts` was not hand-written. It is the actual return value of the workstation's `shotlist.js` and `callsheet.js` (brahmini commit `10547e0`), run with a stand-in model reply, and both passed the skills' own validators without repair. The test suite reads those results. If the workstation changes its shapes, regenerate the fixture the same way.
