import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as THREE from 'three';

function lerp(a, b, t) {
  return a + (b - a) * t;
}

export default function HelicopterR3F(props) {
  const group = useRef();
  const [started, setStarted] = useState(false);
  const [model, setModel] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loader = new OBJLoader();
    let mounted = true;
    loader.load(
      '/static_assets/helicopter.obj',
      (obj) => {
        if (!mounted) return;
        // center/scale model a bit if needed
        const root = new THREE.Group();
        root.add(obj);
        setModel(root);
      },
      undefined,
      (err) => {
        console.error('Failed to load OBJ:', err);
        if (mounted) setLoadError(true);
      },
    );
    return () => {
      mounted = false;
    };
  }, []);

  // initial values matching original timing intent
  const rotationRef = useRef(Math.PI / 2); // 90deg
  const scaleRef = useRef(0.02);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), 1000);
    return () => clearTimeout(t);
  }, []);

  useFrame((_, delta) => {
    if (!started) return;
    // interpolate slowly toward targets; use small step based on delta
    const step = Math.min(1, delta / 8); // scale toward target over seconds
    rotationRef.current = lerp(rotationRef.current, 0, step);
    scaleRef.current = lerp(scaleRef.current, 1, step);
    if (group.current) {
      group.current.rotation.y = rotationRef.current;
      group.current.scale.setScalar(scaleRef.current);
    }
  });

  return (
    <group ref={group} position={[0, 0.5, 0]}>
      {model ? (
        <primitive object={model} />
      ) : loadError ? (
        // Fallback: simple placeholder geometry when OBJ fails to load
        <mesh>
          <boxGeometry args={[1.5, 0.6, 3]} />
          <meshStandardMaterial color="orange" />
        </mesh>
      ) : (
        // Loading placeholder
        <mesh>
          <cylinderGeometry args={[0.6, 0.6, 1.8, 12]} />
          <meshStandardMaterial color="#999" />
        </mesh>
      )}
    </group>
  );
}
