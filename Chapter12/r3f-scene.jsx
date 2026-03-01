import React from 'react';
import { createRoot } from 'react-dom/client';
import { Canvas, useThree } from '@react-three/fiber';
import { useMemo, useEffect, useState, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import Helicopter from './Components/HelicopterR3F.jsx';
import NavigationR3F from './Components/NavigationR3F.jsx';
import PanelR3F from './Components/PanelR3F.jsx';
import * as THREE from 'three';

const backgrounds = [
  '/static_assets/360_world.jpg',
  '/static_assets/beach.jpg',
  '/static_assets/landscape.jpg',
  '/static_assets/mountain.jpg',
  '/static_assets/winter.jpg',
];

function BackgroundSetter({ index }) {
  const { scene } = useThree();
  const textures = useMemo(() => {
    return backgrounds.map((src) => {
      const tex = new THREE.TextureLoader().load(src);
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.encoding = THREE.sRGBEncoding;
      return tex;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tex = textures[index];
    if (tex) scene.background = tex;
    // no cleanup to keep background until changed
  }, [index, scene, textures]);

  return null;
}

function App() {
  const [current, setCurrent] = useState(0);
  const [xrModule, setXrModule] = useState(null);
  const [usingXR, setUsingXR] = useState(false);
  const [xrLoading, setXrLoading] = useState(false);
  const [xrSupported, setXrSupported] = useState(null);

  function changeBackground(delta) {
    setCurrent((c) => {
      const next = c + delta;
      if (next > backgrounds.length - 1) return 0;
      if (next < 0) return backgrounds.length - 1;
      return next;
    });
  }

  async function enableXR() {
    if (xrModule) {
      setUsingXR((v) => !v);
      return;
    }
    try {
      setXrLoading(true);
      const mod = await import('@react-three/xr');
      setXrModule(mod);
      setUsingXR(true);
    } catch (e) {
      // import failed; keep usingXR false
      // console.error('Failed to load XR module', e);
    } finally {
      setXrLoading(false);
    }
  }

  async function handleSessionStart(active) {
    if (active && !xrModule) {
      try {
        setXrLoading(true);
        const mod = await import('@react-three/xr');
        setXrModule(mod);
      } catch (e) {
        // ignore
      } finally {
        setXrLoading(false);
      }
    }
    setUsingXR(active);
  }

  useEffect(() => {
    if (navigator.xr && navigator.xr.isSessionSupported) {
      navigator.xr.isSessionSupported('immersive-vr').then((supported) => {
        setXrSupported(!!supported);
      }).catch(() => setXrSupported(false));
    } else {
      setXrSupported(false);
    }
  }, []);

  function requestXRSession() {
    window.dispatchEvent(new Event('xr-request'));
  }

  return (
    <>
      <Canvas camera={{ position: [0, 1.5, 5] }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        {xrModule && usingXR ? (
          // wrap scene content in XR when module loaded and enabled
          <xrModule.XR>
            <Helicopter />
            <BackgroundSetter index={current} />
            <OrbitControls />
            <VRButtonManager onSessionStart={handleSessionStart} xrSupported={xrSupported} />
          </xrModule.XR>
        ) : (
          <>
            <Helicopter />
            <BackgroundSetter index={current} />
            <OrbitControls />
            <VRButtonManager onSessionStart={handleSessionStart} xrSupported={xrSupported} />
          </>
        )}
      </Canvas>
      <NavigationR3F changeBackground={changeBackground} current={current} />
      <PanelR3F />

      <div style={{ position: 'absolute', left: 16, top: 16, zIndex: 20, display: 'flex', gap: 8 }}>
        <button onClick={enableXR} style={{ padding: '8px 12px' }}>
          {xrLoading ? 'Loading XR…' : xrModule ? (usingXR ? 'Exit XR' : 'Enter XR') : 'Enter XR'}
        </button>
        <button onClick={requestXRSession} style={{ padding: '8px 12px' }}>
          Request XR Session
        </button>
        <div style={{ padding: '8px 12px', background: '#fff', borderRadius: 4 }}>
          {xrSupported === null ? 'Checking XR…' : xrSupported ? 'XR Supported' : 'XR Not Supported'}
          {usingXR ? ' · Session Active' : ''}
        </div>
      </div>
    </>
  );
}

function VRButtonManager({ onSessionStart, xrSupported }) {
  const { gl } = useThree();
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    let btnEl = null;
    if (xrSupported) {
      (async () => {
        try {
          const mod = await import('three/examples/jsm/webxr/VRButton.js');
          const containerId = 'xr-button-root';
          let container = document.getElementById(containerId);
          if (!container) {
            container = document.createElement('div');
            container.id = containerId;
            container.style.position = 'absolute';
            container.style.left = '16px';
            container.style.top = '96px';
            container.style.zIndex = '40';
            document.body.appendChild(container);
          }
          btnEl = mod.VRButton.createButton(gl);
          container.appendChild(btnEl);
        } catch (e) {
          // ignore
        }
      })();
    }

    async function handleRequest() {
      if (!navigator.xr) return;
      try {
        const session = await navigator.xr.requestSession('immersive-vr');
        await gl.xr.setSession(session);
        if (onSessionStart) onSessionStart(true);
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('xr-request', handleRequest);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('xr-request', handleRequest);
      if (btnEl && btnEl.parentNode) btnEl.parentNode.removeChild(btnEl);
    };
  }, [gl, onSessionStart]);

  return null;
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
