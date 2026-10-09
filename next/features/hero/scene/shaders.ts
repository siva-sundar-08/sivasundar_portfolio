import { simplex3 } from "./glsl";

/* ───────────── Particles: void → converge → tunnel stream ───────────── */

export const particlesVertex = /* glsl */ `
${simplex3}
uniform float uTime;
uniform float uConverge;
uniform float uForm;
uniform float uDive;
uniform float uPortal;
uniform float uPixelRatio;
uniform float uSize;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
attribute vec3 aStart;
attribute vec3 aTunnel;
attribute float aSeed;
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Each particle starts converging at a slightly different moment.
  float local = clamp((uConverge - aSeed * 0.4) / 0.6, 0.0, 1.0);
  float e = local * local * (3.0 - 2.0 * local);

  vec3 drift = aStart + 0.8 * vec3(
    sin(uTime * 0.13 + aSeed * 31.0),
    cos(uTime * 0.11 + aSeed * 17.0),
    sin(uTime * 0.09 + aSeed * 7.0)
  );

  // The shell breathes with noise once it has formed.
  vec3 target = position * (1.0 + 0.1 * snoise(position * 1.3 + uTime * 0.35));
  target *= mix(1.0, 1.18, uForm);

  vec3 pos = mix(drift, target, e);

  // Spiral inward while converging.
  float angle = (1.0 - e) * 7.0 * (aSeed - 0.5);
  float c = cos(angle);
  float s = sin(angle);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Dive: particles peel off into a tunnel that streams past the camera.
  vec3 tunnel = aTunnel;
  tunnel.z = mod(aTunnel.z + uTime * (5.0 + aSeed * 9.0), 42.0) - 34.0;
  pos = mix(pos, tunnel, smoothstep(0.05, 0.7, uDive));

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float size = uSize * (0.35 + aSeed * 0.9) * (1.0 + uDive * 1.4);
  gl_PointSize = min(size * uPixelRatio * (10.0 / -mv.z), 48.0);
  gl_Position = projectionMatrix * mv;

  vec3 col = mix(uColA, uColB, aSeed);
  col = mix(col, uColC, smoothstep(0.82, 1.0, aSeed));
  vColor = col * (0.55 + 1.5 * max(e, uDive));
  vAlpha = (0.12 + 0.88 * max(e, uDive)) * (1.0 - uPortal * 0.75);
}
`;

export const particlesFragment = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = pow(smoothstep(0.5, 0.0, d), 1.7);
  gl_FragColor = vec4(vColor * a, a * vAlpha);
}
`;

/* ───────────── Core: liquid-metal, iridescent, dissolvable ───────────── */

export const coreVertex = /* glsl */ `
${simplex3}
uniform float uTime;
uniform float uForm;
varying vec3 vNormalV;
varying vec3 vViewV;
varying vec3 vObj;
varying float vNoise;

void main() {
  float n = snoise(normal * 1.4 + vec3(0.0, uTime * 0.22, 0.0));
  float n2 = snoise(normal * 3.1 - uTime * 0.15) * 0.35;
  float disp = (n + n2) * 0.24 * uForm;
  vec3 p = position * uForm + normal * disp;
  vNoise = n;
  vObj = position;
  vNormalV = normalize(normalMatrix * normal);
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vViewV = -mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

export const coreFragment = /* glsl */ `
${simplex3}
uniform float uTime;
uniform float uForm;
uniform float uDissolve;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
varying vec3 vNormalV;
varying vec3 vViewV;
varying vec3 vObj;
varying float vNoise;

void main() {
  float pattern = snoise(vObj * 2.2 + uTime * 0.1) * 0.5 + 0.5;
  if (pattern < uDissolve) discard;
  float edge = 1.0 - smoothstep(0.0, 0.07, pattern - uDissolve);

  vec3 V = normalize(vViewV);
  vec3 facet = normalize(cross(dFdx(vViewV), dFdy(vViewV)));
  vec3 N = normalize(mix(vNormalV, facet, 0.4));
  if (!gl_FrontFacing) N = -N;

  float fres = pow(1.0 - abs(dot(N, V)), 2.2);
  vec3 irid = 0.5 + 0.5 * cos(6.28318 * (fres * 1.3 + vNoise * 0.4 + uTime * 0.04 + vec3(0.0, 0.33, 0.67)));
  irid = mix(irid, mix(uColA, uColB, fres), 0.5);

  vec3 R = reflect(-V, N);
  float env = smoothstep(-0.2, 1.0, R.y) * 0.55 + pow(max(R.x, 0.0), 10.0) * 1.6;

  vec3 col = vec3(0.012, 0.014, 0.03);
  col += irid * fres * 1.9;
  col += env * vec3(0.55, 0.6, 0.78) * (0.25 + fres);
  col += edge * uColC * 5.0 * step(0.001, uDissolve);

  gl_FragColor = vec4(col, clamp(uForm * 1.4, 0.0, 1.0));
}
`;

/* ───────────── Portal disc ───────────── */

export const portalVertex = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const portalFragment = /* glsl */ `
${simplex3}
uniform float uTime;
uniform float uReveal;
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uColC;
varying vec2 vUv;

void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  float a = atan(p.y, p.x);
  float swirl = fbm(vec3(cos(a) * 1.4, sin(a) * 1.4, r * 3.0 - uTime * 0.55) + vec3(0.0, 0.0, a * 0.5));
  float rings = sin(r * 30.0 - uTime * 2.6 + swirl * 5.0) * 0.5 + 0.5;
  float glow = smoothstep(0.75, 0.0, r);

  vec3 col = mix(uColB, uColA, swirl * 0.5 + 0.5);
  col = mix(col, uColC, rings * 0.35);
  col *= glow * 1.8 + rings * 0.22 * smoothstep(1.0, 0.2, r);

  // A calm, darker eye where the name sits.
  col *= mix(0.18, 1.0, smoothstep(0.06, 0.32, r));

  float alpha = uReveal * smoothstep(1.0, 0.35, r);
  gl_FragColor = vec4(col * alpha, alpha);
}
`;

/* ───────────── Background nebula field ───────────── */

export const nebulaVertex = /* glsl */ `
varying vec3 vDir;
void main() {
  vDir = normalize(position);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const nebulaFragment = /* glsl */ `
${simplex3}
uniform float uTime;
uniform float uIntensity;
uniform vec3 uVoid0;
uniform vec3 uVoid1;
uniform vec3 uColB;
uniform vec3 uColA;
varying vec3 vDir;

void main() {
  float n = fbm(vDir * 2.2 + vec3(0.0, 0.0, uTime * 0.02));
  float m = fbm(vDir * 4.5 - vec3(uTime * 0.015));
  vec3 col = mix(uVoid0, uVoid1, smoothstep(-0.45, 0.65, n));
  col += uColB * pow(max(n, 0.0), 3.0) * 0.45 * uIntensity;
  col += uColA * pow(max(m, 0.0), 5.0) * 0.25 * uIntensity;
  gl_FragColor = vec4(col, 1.0);
}
`;
