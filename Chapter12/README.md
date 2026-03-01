# Chapter12 — Virtual Reality (React → react-three-fiber)

This repo is a small interactive VR demo originally built with `react-360` and migrated to a modern React + three.js stack using `@react-three/fiber` (R3F). The goal is a hands-on project that demonstrates: loading 3D models, switching 360 backgrounds, rendering UI overlays, and wiring WebXR (entering VR) in a progressive-enhancement way.

Contents
- `r3f.html` — minimal HTML entry for the R3F demo (dev/testing).
- `r3f-scene.jsx` — main entry module. Mounts the R3F `Canvas`, handles background switching, panel overlay, XR UX, and wires dynamic XR imports and the VR button.
- `r3f-scene.js` — (removed) previous non-JSX entry; current entry is `.jsx`.
- `index.js`, `client.js`, `index.html` — original `react-360` app files kept for reference (`start-360` script still present).
- `Components/HelicopterR3F.jsx` — migrated helicopter component (OBJ loader, animated scale & rotation, fallback geometry).
- `Components/NavigationR3F.jsx` — migrated navigation controls (DOM overlay) to switch equirectangular backgrounds.
- `Components/PanelR3F.jsx` — migrated panel overlay (DOM overlay) that mimics the original `Panel` UI.
- `static_assets/` — assets folder (provide your `helicopter.obj`, `360_world.jpg`, and other images here).
- `package.json` — upgraded dependencies and dev scripts to run a Vite dev server and R3F dependencies.


- Node.js (LTS recommended, e.g. 18+). npm comes with Node.
- A modern browser (Chrome, Edge) for testing; WebXR requires a compatible browser/device and usually HTTPS or `localhost`.

Getting started (development)

1. From the `Chapter12` folder install dependencies:

```bash
npm install --legacy-peer-deps
```

Notes: Some legacy packages (or the original `react-360`) may have peer dependency constraints. Using `--legacy-peer-deps` avoids install-time conflicts when experimenting locally. If you prefer to resolve peers strictly, you can remove `react-360` entries from `package.json` first.

2. Start the development server (Vite):

```bash
npm start
```

3. Open the local URL printed by Vite (e.g. `http://localhost:5174/r3f.html`).

What to expect in the demo
- A three.js / R3F canvas renders a simple scene with a Helicopter model (loaded from `static_assets/helicopter.obj` when available). If the OBJ cannot be found or fails to load, the app shows a placeholder geometry automatically.
- A DOM overlay at the bottom provides Prev / Next buttons to switch background 360 images (Equirectangular panoramas served from `static_assets/`).
- A top-left XR status area shows whether your browser/device advertises WebXR support.
- An `Enter XR` button dynamically imports `@react-three/xr` (keeps the initial bundle light). A `Request XR Session` button dispatches a session request which the renderer will attempt to set via `gl.xr.setSession(...)`.
- When XR is available a standard `VRButton` (from `three/examples/jsm/webxr/VRButton.js`) is appended to a custom-styled container; it's only added when XR is advertised by the browser.

Key implementation details

- Model loading (Helicopter)
  - `Components/HelicopterR3F.jsx` uses `three`'s `OBJLoader` to load `/static_assets/helicopter.obj`.
  - Loading is performed in a `useEffect` hook. On success we add the model as a `primitive` to the scene. On failure a simple placeholder (box/cylinder) is rendered instead — this demonstrates graceful degradation.
  - The component keeps the original animation semantics (initial small scale & 90° yaw rotating to 0°, then scale up), but implemented with `useFrame` and lerp steps.

- Background switching
  - `r3f-scene.jsx` contains `BackgroundSetter`, which runs inside the R3F `Canvas` and uses `useThree()` to set `scene.background` with a loaded `Texture` using `EquirectangularReflectionMapping`.
  - `NavigationR3F.jsx` is a DOM overlay that calls a `changeBackground(delta)` prop; the backgrounds array maps to files in `static_assets/`.

- XR integration strategy
  - Progressive enhancement: `@react-three/xr` is not eagerly bundled. Clicking `Enter XR` dynamically imports the module and sets `usingXR` to `true`, causing the app to render the scene wrapped by `<XR>` (when available).
  - The `Request XR Session` button dispatches a global `xr-request` event. Inside the Canvas a `VRButtonManager` (which can access the renderer via `useThree()`) listens for this event and calls `navigator.xr.requestSession('immersive-vr')`, then sets the session onto the renderer with `gl.xr.setSession(session)`.
  - A `VRButton` (from three.js examples) is appended to a custom container only when `navigator.xr.isSessionSupported('immersive-vr')` reports support.

Troubleshooting tips 

- `ESBuild/JSX` parsing errors when running Vite:
  - If you see errors about JSX parsing, ensure entry files are `.jsx` (the project uses `r3f-scene.jsx` and component files ending in `.jsx`).

- `npm install` ERESOLVE peer dependency problems:
  - If npm refuses to install due to peer dependency conflicts (often from old `react-360` packages), run:

```bash
npm install --legacy-peer-deps
```

  - Alternatively, remove `react-360` and `react-360-web` entries from `package.json` before installing if you don't need to preserve the old runtime.

- Model not showing up:
  - Confirm `static_assets/helicopter.obj` exists. The Helicopter component will log an error to the browser console if loading fails and will display a fallback placeholder.

- XR doesn't work on desktop/laptop:
  - WebXR requires a compatible browser and device (e.g. WebXR-enabled Chrome on an XR-capable headset, or emulator). You can still test the non-XR scene and the UI overlays on desktop.

Commands summary

- Install:
```bash
npm install --legacy-peer-deps
```
- Start dev server:
```bash
npm start
# open the printed Vite URL and navigate to /r3f.html
```
- Start the original react-360 packager (if you want to run the legacy app):
```bash
npm run start-360
```
