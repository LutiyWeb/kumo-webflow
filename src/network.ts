import * as THREE from "three";
import envelopeUrl from "./assets/envelope.svg";
import atUrl from "./assets/at.svg";

const section = document.querySelector<HTMLElement>("[data-network]");
if (!section) throw new Error("[data-network] not found");

const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
});

section.prepend(renderer.domElement);
renderer.setSize(section.clientWidth, section.clientHeight);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  50,
  section.clientWidth / section.clientHeight,
  0.1,
  100,
);
camera.position.z = 10;

const depthFade = (z: number) => THREE.MathUtils.mapLinear(z, -15, 4, 0.05, 1);
const COUNT = 140;
const positions = new Float32Array(COUNT * 3);
const nodeColors = new Float32Array(COUNT * 3);

const BANDS = [
  { slope: -0.35, offset: 3.5 },
  { slope: 0.25, offset: -0.5 },
  { slope: -0.3, offset: -4.5 },
];

for (let i = 0; i < COUNT; i++) {
  const band = BANDS[Math.floor(Math.random() * BANDS.length)];
  const x = (Math.random() - 0.5) * 24;
  positions[i * 3] = x;
  positions[i * 3 + 1] =
    band.slope * x + band.offset + (Math.random() - 0.5) * 3;
  positions[i * 3 + 2] = Math.random() * 19 - 15;

  const b = depthFade(positions[i * 3 + 2]);
  nodeColors[i * 3] = b;
  nodeColors[i * 3 + 1] = b;
  nodeColors[i * 3 + 2] = b;
}

const dotCanvas = document.createElement("canvas");
dotCanvas.width = dotCanvas.height = 64;
const ctx = dotCanvas.getContext("2d")!;
const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
g.addColorStop(0, "#fff");
g.addColorStop(0.3, "#fff");
g.addColorStop(0.45, "rgba(255,255,255,0.35)");
g.addColorStop(1, "rgba(255,255,255,0)");
ctx.fillStyle = g;
ctx.fillRect(0, 0, 64, 64);
const dotTexture = new THREE.CanvasTexture(dotCanvas);

const bokehCanvas = document.createElement("canvas");
bokehCanvas.width = bokehCanvas.height = 64;
const bctx = bokehCanvas.getContext("2d")!;
const bg = bctx.createRadialGradient(32, 32, 0, 32, 32, 32);
bg.addColorStop(0, "rgba(255,255,255,0.8)");
bg.addColorStop(0.6, "rgba(255,255,255,0.5)");
bg.addColorStop(1, "rgba(255,255,255,0)");
bctx.fillStyle = bg;
bctx.fillRect(0, 0, 64, 64);
const bokehTexture = new THREE.CanvasTexture(bokehCanvas);
const loader = new THREE.TextureLoader();
const envelopeTexture = loader.load(envelopeUrl);
const atTexture = loader.load(atUrl);

for (let i = 0; i < COUNT; i += 3) {
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: i % 2 ? atTexture : envelopeTexture,
      opacity: depthFade(positions[i * 3 + 2]),
      transparent: true,
      depthWrite: false,
    }),
  );
  sprite.position.set(
    positions[i * 3],
    positions[i * 3 + 1],
    positions[i * 3 + 2],
  );
  sprite.scale.set(0.35, 0.35, 1);
  scene.add(sprite);
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(nodeColors, 3));

const nodes = new THREE.Points(
  geometry,
  new THREE.PointsMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    size: 0.3,
    map: dotTexture,
    depthWrite: false,
  }),
);
scene.add(nodes);

const linePositions: number[] = [];
const lineColors: number[] = [];

for (let i = 0; i < COUNT; i++) {
  // для каждого узла i
  const near: { j: number; dist: number }[] = []; // список его соседей с расстояниями

  for (let j = 0; j < COUNT; j++) {
    // перебираем все остальные узлы j
    if (j === i) continue; // сам с собой не сравниваем
    const dx = positions[i * 3] - positions[j * 3]; // разница по x
    const dy = positions[i * 3 + 1] - positions[j * 3 + 1]; // разница по y
    const dz = positions[i * 3 + 2] - positions[j * 3 + 2]; // разница по z
    near.push({ j, dist: Math.hypot(dx, dy, dz) }); // запоминаем соседа и расстояние
  }

  near.sort((a, b) => a.dist - b.dist); // сортируем: ближние первыми

  for (const { j } of near.slice(0, 3)) {
    // берём 3 ближайших
    linePositions.push(
      // добавляем отрезок i → j
      positions[i * 3],
      positions[i * 3 + 1],
      positions[i * 3 + 2], // начало: узел i
      positions[j * 3],
      positions[j * 3 + 1],
      positions[j * 3 + 2], // конец: узел j
    );

    const bi = depthFade(positions[i * 3 + 2]);
    const bj = depthFade(positions[j * 3 + 2]);
    lineColors.push(bi, bi, bi, bj, bj, bj);
  }
}

const lineGeometry = new THREE.BufferGeometry();

lineGeometry.setAttribute(
  "position",
  new THREE.Float32BufferAttribute(linePositions, 3),
);

lineGeometry.setAttribute(
  "color",
  new THREE.Float32BufferAttribute(lineColors, 3),
);

const lines = new THREE.LineSegments(
  lineGeometry,
  new THREE.LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    opacity: 0.6,
  }),
);
scene.add(lines);

function addBokeh(
  count: number,
  size: number,
  zMin: number,
  zMax: number,
  opacity: number,
  spreadX: number,
  spreadY: number,
) {
  const pos = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (Math.random() - 0.5) * spreadX;
    pos[i * 3 + 1] = (Math.random() - 0.5) * spreadY;
    pos[i * 3 + 2] = zMin + Math.random() * (zMax - zMin);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  scene.add(
    new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        map: bokehTexture,
        size,
        opacity,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    ),
  );
}

addBokeh(40, 0.8, -20, -8, 0.15, 30, 18);
addBokeh(15, 2.5, 2, 6, 0.12, 10, 6);

renderer.setAnimationLoop((t) => {
  camera.position.x = Math.sin(t * 0.00006) * 2;
  camera.position.y = Math.cos(t * 0.00004) * 1;
  camera.lookAt(0, 0, -5);
  renderer.render(scene, camera);
});
