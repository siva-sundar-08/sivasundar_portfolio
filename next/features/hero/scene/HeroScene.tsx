"use client";

import { PerformanceMonitor } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Bloom,
  ChromaticAberration,
  EffectComposer,
  Noise,
  Vignette,
} from "@react-three/postprocessing";
import { BlendFunction, type ChromaticAberrationEffect } from "postprocessing";
import { useMemo, useRef, useState } from "react";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Vector2,
  Vector3,
  type Group,
  type Mesh,
  type PerspectiveCamera,
  type ShaderMaterial,
} from "three";
import type { Mode } from "@/components/providers/ModeProvider";
import { qualitySettings } from "@/lib/quality";
import { phasesAt, type LiveState, type Phases } from "../timeline";
import {
  coreFragment,
  coreVertex,
  nebulaFragment,
  nebulaVertex,
  particlesFragment,
  particlesVertex,
  portalFragment,
  portalVertex,
} from "./shaders";

type Tier = "high" | "low";

export type HeroSceneProps = {
  live: LiveState;
  quality: Tier;
  active: boolean;
  mode: Mode;
};

const PALETTES: Record<
  Mode,
  { a: string; b: string; c: string; v0: string; v1: string }
> = {
  void: { a: "#3ef0ff", b: "#8b5cff", c: "#ff3dc0", v0: "#030309", v1: "#141a4a" },
  aurora: { a: "#c8ff3d", b: "#3ef0ff", c: "#8b5cff", v0: "#02080b", v1: "#0d3040" },
};

const damp = (current: number, target: number, lambda: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * dt));

type Palette = { a: Color; b: Color; c: Color; v0: Color; v1: Color };

const toPalette = (mode: Mode): Palette => {
  const p = PALETTES[mode];
  return {
    a: new Color(p.a),
    b: new Color(p.b),
    c: new Color(p.c),
    v0: new Color(p.v0),
    v1: new Color(p.v1),
  };
};

/**
 * Values every material reads each frame. Colour objects are shared by
 * reference, so easing them here recolours every uniform at once.
 */
class Shared {
  time = 0;
  smooth: number;
  phases: Phases;
  colA: Color;
  colB: Color;
  colC: Color;
  void0: Color;
  void1: Color;

  constructor(progress: number, mode: Mode) {
    const p = toPalette(mode);
    this.smooth = progress;
    this.phases = phasesAt(progress);
    this.colA = p.a;
    this.colB = p.b;
    this.colC = p.c;
    this.void0 = p.v0;
    this.void1 = p.v1;
  }

  step(progress: number, target: Palette, dt: number) {
    this.time += dt;
    this.smooth = damp(this.smooth, progress, 3.2, dt);
    this.phases = phasesAt(this.smooth);
    const k = 1 - Math.exp(-2.5 * dt);
    this.colA.lerp(target.a, k);
    this.colB.lerp(target.b, k);
    this.colC.lerp(target.c, k);
    this.void0.lerp(target.v0, k);
    this.void1.lerp(target.v1, k);
  }
}

/* ───────────── Director: smooths scroll and palette once per frame ───────────── */

function Director({
  live,
  shared,
  mode,
}: {
  live: LiveState;
  shared: Shared;
  mode: Mode;
}) {
  const targets = useMemo(() => toPalette(mode), [mode]);

  useFrame((_, dt) => {
    shared.step(live.progress, targets, Math.min(dt, 1 / 20));
  }, -2);

  return null;
}

/* ───────────── Particles ───────────── */

function buildParticles(count: number): BufferGeometry {
  const target = new Float32Array(count * 3);
  const start = new Float32Array(count * 3);
  const tunnel = new Float32Array(count * 3);
  const seed = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const onRing = i % 5 === 0;
    if (onRing) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.1 + (Math.random() - 0.5) * 0.25;
      target[i3] = Math.cos(a) * r;
      target[i3 + 1] = (Math.random() - 0.5) * 0.12;
      target[i3 + 2] = Math.sin(a) * r;
    } else {
      // Fibonacci sphere: even coverage of the core's shell.
      const y = 1 - (i / (count - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const r = 1.95 + (Math.random() - 0.5) * 0.18;
      target[i3] = Math.cos(theta) * radius * r;
      target[i3 + 1] = y * r;
      target[i3 + 2] = Math.sin(theta) * radius * r;
    }

    const dir = new Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5)
      .normalize()
      .multiplyScalar(14 + Math.random() * 26);
    start[i3] = dir.x;
    start[i3 + 1] = dir.y * 0.7;
    start[i3 + 2] = dir.z - 6;

    const a = Math.random() * Math.PI * 2;
    const tr = 1.6 + Math.random() * 5.5;
    tunnel[i3] = Math.cos(a) * tr;
    tunnel[i3 + 1] = Math.sin(a) * tr;
    tunnel[i3 + 2] = Math.random() * 42;

    seed[i] = Math.random();
  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(target, 3));
  geometry.setAttribute("aStart", new BufferAttribute(start, 3));
  geometry.setAttribute("aTunnel", new BufferAttribute(tunnel, 3));
  geometry.setAttribute("aSeed", new BufferAttribute(seed, 1));
  return geometry;
}

function Particles({ shared, count }: { shared: Shared; count: number }) {
  const material = useRef<ShaderMaterial>(null);
  const dpr = useThree((state) => state.viewport.dpr);
  const geometry = useMemo(() => buildParticles(count), [count]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uConverge: { value: 0 },
      uForm: { value: 0 },
      uDive: { value: 0 },
      uPortal: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 9 },
      uColA: { value: shared.colA },
      uColB: { value: shared.colB },
      uColC: { value: shared.colC },
    }),
    [shared],
  );

  useFrame(() => {
    const m = material.current;
    if (!m) return;
    const u = m.uniforms;
    u.uTime.value = shared.time;
    u.uConverge.value = shared.phases.converge;
    u.uForm.value = shared.phases.form;
    u.uDive.value = shared.phases.dive;
    u.uPortal.value = shared.phases.portal;
    u.uPixelRatio.value = dpr;
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={particlesVertex}
        fragmentShader={particlesFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}

/* ───────────── Core + orbital rings ───────────── */

function Core({ shared, detail }: { shared: Shared; detail: number }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uForm: { value: 0 },
      uDissolve: { value: 0 },
      uColA: { value: shared.colA },
      uColB: { value: shared.colB },
      uColC: { value: shared.colC },
    }),
    [shared],
  );

  useFrame(() => {
    const m = material.current;
    const body = mesh.current;
    if (!m || !body) return;
    const { form, dive } = shared.phases;
    body.visible = form > 0.001 && dive < 0.995;
    m.uniforms.uTime.value = shared.time;
    m.uniforms.uForm.value = form;
    // The shell dissolves just before the camera reaches it.
    m.uniforms.uDissolve.value = Math.min(1, Math.max(0, (dive - 0.2) / 0.45));
    body.rotation.y = shared.time * 0.12;
    body.rotation.x = Math.sin(shared.time * 0.2) * 0.2;
  });

  return (
    <mesh ref={mesh} visible={false}>
      <icosahedronGeometry args={[1.6, detail]} />
      <shaderMaterial
        ref={material}
        vertexShader={coreVertex}
        fragmentShader={coreFragment}
        uniforms={uniforms}
        transparent
        side={DoubleSide}
      />
    </mesh>
  );
}

function Rings({ shared }: { shared: Shared }) {
  const group = useRef<Group>(null);
  const rings = [
    { radius: 2.9, tube: 0.012, tilt: [1.2, 0.2, 0], speed: 0.25, color: "a" },
    { radius: 3.4, tube: 0.008, tilt: [1.45, -0.3, 0.4], speed: -0.18, color: "b" },
    { radius: 4.3, tube: 0.006, tilt: [1.62, 0.1, -0.2], speed: 0.1, color: "c" },
  ] as const;

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const { form, dive, portal } = shared.phases;
    const s = Math.max(0.0001, form) * (1 + dive * 0.6);
    g.scale.setScalar(s);
    g.visible = form > 0.001 && portal < 0.99;
    g.children.forEach((child, i) => {
      child.rotation.z = shared.time * rings[i].speed;
    });
  });

  return (
    <group ref={group} visible={false}>
      {rings.map((ring) => (
        <mesh key={ring.radius} rotation={[...ring.tilt]}>
          <torusGeometry args={[ring.radius, ring.tube, 8, 200]} />
          <meshBasicMaterial
            color={
              ring.color === "a"
                ? shared.colA
                : ring.color === "b"
                  ? shared.colB
                  : shared.colC
            }
            toneMapped={false}
            transparent
            opacity={0.9}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ───────────── Portal + nebula ───────────── */

function Portal({ shared }: { shared: Shared }) {
  const mesh = useRef<Mesh>(null);
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uReveal: { value: 0 },
      uColA: { value: shared.colA },
      uColB: { value: shared.colB },
      uColC: { value: shared.colC },
    }),
    [shared],
  );

  useFrame(() => {
    const m = material.current;
    const body = mesh.current;
    if (!m || !body) return;
    const { dive, portal, exit } = shared.phases;
    const reveal = Math.max(dive * 0.35, portal) * (1 - exit);
    body.visible = reveal > 0.001;
    m.uniforms.uTime.value = shared.time;
    m.uniforms.uReveal.value = reveal;
  });

  return (
    <mesh ref={mesh} position={[0, 0, -18]} visible={false}>
      <planeGeometry args={[34, 34]} />
      <shaderMaterial
        ref={material}
        vertexShader={portalVertex}
        fragmentShader={portalFragment}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

function Nebula({ shared }: { shared: Shared }) {
  const material = useRef<ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.3 },
      uVoid0: { value: shared.void0 },
      uVoid1: { value: shared.void1 },
      uColA: { value: shared.colA },
      uColB: { value: shared.colB },
    }),
    [shared],
  );

  useFrame(() => {
    const m = material.current;
    if (!m) return;
    const { converge, exit } = shared.phases;
    m.uniforms.uTime.value = shared.time;
    m.uniforms.uIntensity.value = (0.3 + converge * 0.9) * (1 - exit * 0.8);
  });

  return (
    <mesh renderOrder={-1}>
      <sphereGeometry args={[90, 32, 32]} />
      <shaderMaterial
        ref={material}
        vertexShader={nebulaVertex}
        fragmentShader={nebulaFragment}
        uniforms={uniforms}
        side={BackSide}
        depthWrite={false}
      />
    </mesh>
  );
}

/* ───────────── Camera flight ───────────── */

function CameraRig({ shared, live }: { shared: Shared; live: LiveState }) {
  const target = useMemo(() => new Vector3(), []);
  const look = useMemo(() => new Vector3(), []);
  const lookTarget = useMemo(() => new Vector3(), []);

  useFrame((state, dt) => {
    const camera = state.camera as PerspectiveCamera;
    const delta = Math.min(dt, 1 / 20);
    const { converge, form, dive, portal } = shared.phases;
    const orbit = shared.smooth * Math.PI * 1.4;
    const calm = 1 - dive;

    // void → approach the forming core → fly through it → coast toward the portal.
    const z = (16 - converge * 5 - form * 2) * calm + (-5 - portal * 4) * dive;
    target.set(
      Math.sin(orbit) * 1.6 * calm + live.pointer.x * 0.5 * (1 - portal * 0.6),
      0.5 * calm + live.pointer.y * 0.35 * (1 - portal * 0.6),
      z,
    );
    camera.position.x = damp(camera.position.x, target.x, 3, delta);
    camera.position.y = damp(camera.position.y, target.y, 3, delta);
    camera.position.z = damp(camera.position.z, target.z, 4, delta);

    lookTarget.set(0, 0, -18 * dive);
    look.lerp(lookTarget, 1 - Math.exp(-4 * delta));
    camera.lookAt(look);
    camera.rotateZ(Math.sin(dive * Math.PI) * 0.35);

    const fov = 42 + Math.sin(dive * Math.PI) * 34 + portal * 4;
    if (Math.abs(camera.fov - fov) > 0.01) {
      camera.fov = damp(camera.fov, fov, 5, delta);
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

/* ───────────── Post-processing ───────────── */

function Effects({ shared, live }: { shared: Shared; live: LiveState }) {
  const aberration = useRef<ChromaticAberrationEffect>(null);
  const offset = useMemo(() => new Vector2(0.0006, 0.0006), []);

  useFrame(() => {
    const effect = aberration.current;
    if (!effect) return;
    const speed = Math.min(Math.abs(live.velocity) / 4000, 1);
    const amount =
      0.0006 + speed * 0.004 + Math.sin(shared.phases.dive * Math.PI) * 0.004;
    effect.offset.set(amount, amount * 0.6);
  });

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        intensity={1.15}
        luminanceThreshold={0.18}
        luminanceSmoothing={0.3}
      />
      <ChromaticAberration
        ref={aberration}
        offset={offset}
        radialModulation
        modulationOffset={0.25}
        blendFunction={BlendFunction.NORMAL}
      />
      <Noise premultiply opacity={0.35} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.22} darkness={0.85} />
    </EffectComposer>
  );
}

/* ───────────── Canvas ───────────── */

export default function HeroScene({ live, quality, active, mode }: HeroSceneProps) {
  const settings = qualitySettings[quality];
  const [dpr, setDpr] = useState<number>(settings.dpr[1]);
  const [post, setPost] = useState<boolean>(settings.post);

  // Palette changes are eased by <Director>, so the shared state is created once.
  const [shared] = useState(() => new Shared(live.progress, mode));

  return (
    <Canvas
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0.5, 16], fov: 42, near: 0.1, far: 200 }}
      gl={{ antialias: false, alpha: false, powerPreference: "high-performance" }}
      aria-hidden
    >
      <PerformanceMonitor
        flipflops={2}
        onDecline={() => {
          setDpr(1);
          setPost(false);
        }}
      />
      <color attach="background" args={[PALETTES[mode].v0]} />
      <Director live={live} shared={shared} mode={mode} />
      <CameraRig shared={shared} live={live} />
      <Nebula shared={shared} />
      <Portal shared={shared} />
      <Rings shared={shared} />
      <Core shared={shared} detail={quality === "high" ? 40 : 18} />
      <Particles shared={shared} count={settings.particles} />
      {post ? <Effects shared={shared} live={live} /> : null}
    </Canvas>
  );
}
