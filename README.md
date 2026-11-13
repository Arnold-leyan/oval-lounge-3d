# OVAL / A room to gather

An interactive single-photo conceptual reconstruction of an interior lounge. **Not a measured survey or digital twin.** Inferred room envelope: approximately 7.6 × 9.6 × 3.4 m. Hidden details and courtyard are interpretive.

The scene preserves the reference's grey tiled floor, grey panel wall and display, orange-red curved island benches, metal side tables, laptops, broad glazing, right counter and high stools, dark ceiling, elliptical real-time mirror, warm linear lights and suspended ring.

## Explore

- **Orbit**: drag to rotate; wheel or pinch to zoom; right-drag / two-finger drag to pan.
- **Walk**: drag to look; WASD / arrow keys or on-screen directional pad to move. Walls and furniture block walking. Entry remains open.
- **Overview**: a roof-off architectural view; press again to restore the previous viewpoint.
- **Evening / Daylight**: switch lighting.
- **01–03**: jump between arrival, islands and window views.
- **今日料理**: click/tap the label or plate on the arrival-side silver round table to open the supplied dish photograph. Close with ✕, Escape or the backdrop; keyboard focus returns to the opener.
- **Reset**: return to the initial orbit view. **ⓘ**: interpretation notes.

Touch controls and compact layout support mobile. WebGL and JavaScript are required. Reflection resolution is fixed at 1024; device pixel ratio capped at 1.75 for performance. No motion autoplay, analytics, remote fonts, people, private text, or external runtime assets. The original interior photograph is not published. The explicitly authorized dish photo is included at `assets/dish.jpg`, resized and re-encoded without EXIF metadata.

## Run and check

Serve this directory over HTTP, e.g. `python3 -m http.server 8000`, then open `http://localhost:8000`. This ES-module source is not intended to launch from `file://`.

`npm test` runs structural QA against the real Three.js scene graph (renderer and DOM textures excluded), checking finite geometry, three clear viewpoint spawns, doorway opening, wall / bench / table / counter blocking, and lighting state. It is not a WebGL rendering test.

## Source and licensing

Generated implementation and procedural assets: MIT, see LICENSE. The user-supplied dish photograph is published with explicit permission for this site; it is excluded from the MIT license and does not grant third-party reuse rights. Vendored Three.js **0.170.0**, including OrbitControls, Reflector, RoomEnvironment and upstream MIT license in `vendor/LICENSE-three.txt`. No CDN connection is needed at runtime. BufferGeometryUtils is also vendored at the same version for static mesh batching.

See [acceptance evidence and screenshots](evidence/ACCEPTANCE.md) for live browser checks and limitations.
