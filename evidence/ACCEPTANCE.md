# Acceptance evidence — 2026-11-13

Public site: https://arnold-leyan.github.io/oval-lounge-3d/

Tested scene implementation: `093c8ae`. Later changes only add this report, screenshots and the instance-matrix assertion to structural QA.

## Structural checks

`node --check app.js`, `node --check scene.js`, `npm test`: passed.

Real Three.js scene graph, with DOM textures and planar reflector renderer boundary excluded: 64 meshes, 100,731 stored vertex positions after static batching. Position values and GPU instance matrices finite. Three spawn locations clear. Open front doorway. Wall, bench, table and counter block walking. Evening and daylight sun / lamp states checked. These are structural checks, not WebGL tests.

## Live Chromium / WebGL checks

Two fresh browser contexts connected to the managed Chromium browser, opening the **public Pages URL**, not localhost. Captured images show the rendered scene, not the reference photograph.

| Check | Desktop 1440 × 900 | Mobile 390 × 844 |
|---|---|---|
| WebGL rendered scene | Pass | Pass |
| Initial render draw calls | 58 | 44 |
| Actual forward input held ~1.2 seconds | Keyboard: 2.16036 m | CDP touchscreen: 2.19078 m |
| Actual pointer drag changes look direction | Pass | Pass |
| Roof-off overview | Pass | Pass |
| Return restores prior camera position | Pass | Pass |
| Wall blocks attempted movement | Pass | Pass |
| Evening / daylight state | Pass | Pass |
| Reset restores arrival orbit | Pass | Pass |
| Toolbar contained within viewport | Pass | Pass |
| Horizontal document overflow | None | None |
| Unhandled page errors during final acceptance | None | None |

Screenshots: [Desktop](desktop.png), [Mobile](mobile.png).

A first browser attempt at a localhost preview was refused by navigation policy. No bypass was attempted; visual and input acceptance were performed on the authorized public GitHub Pages deployment instead.

## Deployment / privacy

GitHub Pages reported `built` for scene commit `093c8ae`. HTTP 200 and byte-for-byte matching verified for index, CSS, application, scene and all runtime vendored JS / upstream license. Imports resolve locally. No original photo, private people, credentials or private source text appear in the publication. Display artwork is procedural and generic.

## Limits

Single-photo concept only: proportions and unseen details are inferred; not suitable for measurement, construction or fabrication. The courtyard is interpretive. This is a procedural architectural visualization, not a photogrammetry mesh. Mobile acceptance uses browser device emulation and touch input, not a physical phone. Other browser engines and constrained physical GPUs have not been tested. There is no real-device integration. Source is an HTTP-served ES-module application, not a single-file offline HTML attachment.
