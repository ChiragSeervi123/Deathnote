import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ryukArmShapes, ryukBodyShapes, ryukHeadShapes, RYUK_PIVOTS } from './ryukShapes';

export interface RyukSilhouetteHandle {
  root: THREE.Group;
  /** Animate: breath (time, s), head tilt (rad), arm lift (rad), eye glow (0..1). */
  pose: (time: number, headTilt: number, armLift: number, eyes: number) => void;
  /** World position of the reaching hand. */
  handWorld: (out: THREE.Vector3) => THREE.Vector3;
}

/**
 * Backlit silhouette of Ryuk for wide/atmospheric shots (prologue). A pale
 * rim copy sits just behind the black figure so the sun catches its edges.
 * This is a silhouette treatment by design (SCENE_SPECIFICATIONS §00); the
 * full character presentation is a separate system (characters/, M5).
 */
export const RyukSilhouette = forwardRef<RyukSilhouetteHandle, { rimColor?: string }>(function RyukSilhouette(
  { rimColor = '#9c968a' },
  ref,
) {
  const rootRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const armRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Object3D>(null);

  const a = useMemo(() => {
    const body = new THREE.ShapeGeometry(ryukBodyShapes(), 6);
    const head = new THREE.ShapeGeometry(ryukHeadShapes(), 6);
    const arm = new THREE.ShapeGeometry(ryukArmShapes(), 6);
    const ink = new THREE.MeshBasicMaterial({ color: '#040404', side: THREE.DoubleSide });
    const rim = new THREE.MeshBasicMaterial({ color: rimColor, side: THREE.DoubleSide, fog: true });
    const eye = new THREE.MeshBasicMaterial({ color: new THREE.Color(5.5, 3.6, 0.35), toneMapped: false, fog: false });
    const pupil = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.02, 0.02), toneMapped: false });
    const eyeGeo = new THREE.CircleGeometry(0.034, 20);
    const pupilGeo = new THREE.CircleGeometry(0.009, 10);
    return { body, head, arm, ink, rim, eye, pupil, eyeGeo, pupilGeo };
  }, [rimColor]);

  useEffect(
    () => () => {
      Object.values(a).forEach((v) => (v as { dispose: () => void }).dispose());
    },
    [a],
  );

  useImperativeHandle(
    ref,
    () => ({
      get root() {
        return rootRef.current!;
      },
      pose(time, headTilt, armLift, eyes) {
        const breath = Math.sin(time * 1.1) * 0.012;
        if (rootRef.current) rootRef.current.scale.y = 1 + breath;
        if (headRef.current) headRef.current.rotation.z = headTilt + Math.sin(time * 0.6) * 0.02;
        if (armRef.current) armRef.current.rotation.z = armLift + Math.sin(time * 0.9 + 1) * 0.01;
        a.eye.color.setRGB(5.5 * eyes, 3.6 * eyes, 0.35 * eyes);
      },
      handWorld(out) {
        return handRef.current ? handRef.current.getWorldPosition(out) : out;
      },
    }),
    [a],
  );

  const parts = (geo: THREE.ShapeGeometry) => (
    <>
      {/* Rim copy, nudged up and back so the light catches the top edges. */}
      <mesh geometry={geo} material={a.rim} position={[-0.012, 0.014, -0.02]} scale={1.012} />
      <mesh geometry={geo} material={a.ink} />
    </>
  );

  const [nx, ny] = RYUK_PIVOTS.neck;
  const [sx, sy] = RYUK_PIVOTS.shoulder;
  const [hx, hy] = RYUK_PIVOTS.hand;

  return (
    <group ref={rootRef}>
      {parts(a.body)}
      <group ref={armRef} position={[sx, sy, 0.03]}>
        {parts(a.arm)}
        <object3D ref={handRef} position={[hx - sx, hy - sy - 0.05, 0]} />
      </group>
      <group ref={headRef} position={[nx, ny, 0.01]}>
        {parts(a.head)}
        {RYUK_PIVOTS.eyes.map(([ex, ey], i) => (
          <group key={i} position={[ex - nx, ey - ny, 0.02]}>
            <mesh geometry={a.eyeGeo} material={a.eye} />
            <mesh geometry={a.pupilGeo} material={a.pupil} position={[0.006, -0.002, 0.002]} />
          </group>
        ))}
      </group>
    </group>
  );
});
