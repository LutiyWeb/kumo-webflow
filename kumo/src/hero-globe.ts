import * as THREE from "three";
import maskUrl from "./earth-mask.png";

const container = document.querySelector<HTMLElement>("[data-hero-globe]");

if (container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  // Узкий угол обзора + камера дальше → меньше перспективных искажений,
  // иначе сдвинутый вправо глобус растягивается в овал
  const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 100);
  camera.position.z = 9.3;

  const RADIUS = 1.62; // диаметр ≈ 81% высоты hero, как в Figma
  const OFFSET_X = 0.207; // центр глобуса на 70.7% ширины hero
  const LAND_SAMPLES = 120000; // случайных точек на сфере; на суше останется ~38 000
  const DUST_COUNT = 14000; // «пыль» над всей сферой: видна только у края → живой ободок

  // TILT — наклон оси. В референсе ось почти вертикальная.
  const tilt = new THREE.Group();
  tilt.rotation.z = THREE.MathUtils.degToRad(6);
  // южный полюс чуть к нам: в референсе видна Антарктида, а северный очаг сидит на краю
  tilt.rotation.x = THREE.MathUtils.degToRad(-28);
  scene.add(tilt);

  // ---------- ШЕЙДЕР ТОЧЕК ----------
  // PointsMaterial рисует все точки одинаково. Нам нужно, чтобы яркость точки
  // зависела от того, где она сейчас на экране: у края ярче (эффект атмосферы),
  // справа-сверху светлее (там «солнце»), обратная сторона почти не видна.
  // Это считается на видеокарте для каждой точки каждый кадр — в шейдере.
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(0xffcc00) },
      uSize: { value: 5.0 }, // базовый размер точки в пикселях
      uPixelRatio: { value: renderer.getPixelRatio() },
      uTime: { value: 0 },
    },
    // VERTEX SHADER — выполняется для каждой точки: считает её позицию на экране и яркость
    vertexShader: /* glsl */ `
      attribute float aBright;   // случайная яркость точки (задаём в JS)
      attribute float aSize;     // случайный размер точки
      attribute float aPhase;    // случайная фаза: у каждой точки свой «ритм»
      uniform float uTime;
      uniform float uSize;
      uniform float uPixelRatio;
      varying float vAlpha;      // передаём яркость во fragment shader
 
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);     // позиция относительно камеры
        vec3 n = normalize(normalMatrix * normalize(position)); // куда «смотрит» поверхность
        vec3 toCam = normalize(-mv.xyz);
 
        float facing = dot(n, toCam);                         // 1 — в центре диска, 0 — на краю, <0 — сзади
        float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 3.0);  // яркость растёт к краю
        float lit = clamp(dot(n, normalize(vec3(0.75, 0.6, 0.35))), 0.0, 1.0); // свет справа-сверху
        float front = smoothstep(-0.15, 0.2, facing);         // обратную сторону гасим
 
        float center = 0.3 + 0.7 * clamp(facing, 0.0, 1.0); // к центру диска ярче, к краю тусклее
        vAlpha = aBright * front * (2.2 * center + 0.3 * lit + 1.2 * rim * lit); // лицом к зрителю — ярче всего
        float breath = 1.0 + 0.15 * sin(uTime * 1.6 + aPhase);
        float flash = pow(0.5 + 0.5 * sin(uTime * 0.7 + aPhase * 7.0), 30.0);
        vAlpha *= 1.0 + 2.0 * flash;                 // во время вспышки точка втрое ярче
        gl_PointSize = uSize * aSize * uPixelRatio * breath * (1.0 + 0.5 * flash) * (0.8 + 0.4 * center); // спереди чуть крупнее
        gl_Position = projectionMatrix * mv;
      }
    `,
    // FRAGMENT SHADER — выполняется для каждого пикселя точки: делает её круглой и мягкой
    fragmentShader: /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);  // расстояние от центра квадратика точки
    float core = smoothstep(0.16, 0.0, d);    // маленькое плотное ядро
    float halo = exp(-d * 10.0) * 0.55;       // ореол: яркость гаснет экспоненциально от центра
    float edge = smoothstep(0.5, 0.42, d);    // обрезаем у края квадрата, чтобы не было «квадратиков»
    vec3 color = mix(uColor, vec3(1.0, 0.97, 0.85), core * 0.35); // ядро чуть светлее, почти белое
    gl_FragColor = vec4(color, vAlpha * (core + halo) * edge);
  }
`,
  });

  const globe = new THREE.Points(new THREE.BufferGeometry(), material);
  tilt.add(globe);

  // ---------- ДЫМКА (HAZE) ----------
  // Второй слой под точками: редкие, очень крупные и почти прозрачные пятна только на суше.
  // Перекрываясь, они дают ровное свечение по форме материка, чуть выходящее за его край —
  // эффект «свечения», как drop-shadow, и контраст с чёрным океаном.
  const hazeMaterial = new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: {
      uColor: { value: new THREE.Color(0xffcc00) },
      uSize: { value: 48.0 },     // размер пятна в пикселях
      uOpacity: { value: 0.12 },  // прозрачность одного пятна — главная ручка яркости дымки
      uPixelRatio: { value: renderer.getPixelRatio() },
    },
    vertexShader: /* glsl */ `
      uniform float uSize;
      uniform float uPixelRatio;
      varying float vAlpha;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vec3 n = normalize(normalMatrix * normalize(position));
        float facing = dot(n, normalize(-mv.xyz));
        float center = clamp(facing, 0.0, 1.0);          // как у точек: спереди ярче
        vAlpha = smoothstep(0.0, 0.35, facing) * center;  // у края и сзади дымки нет
        gl_PointSize = uSize * uPixelRatio * (0.7 + 0.3 * center);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uOpacity;
      varying float vAlpha;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float blob = exp(-d * d * 18.0) * smoothstep(0.5, 0.3, d); // размытое пятно (гауссиана)
        gl_FragColor = vec4(uColor, blob * vAlpha * uOpacity);
      }
    `,
  });
  const haze = new THREE.Points(new THREE.BufferGeometry(), hazeMaterial);
  globe.add(haze); // ребёнок глобуса: вращается вместе с ним

  // ---------- СВЕЧЕНИЯ (спрайты с градиентом) ----------
  // Sprite — плоская картинка, всегда повёрнутая к камере. Картинку рисуем на canvas.
  const makeGlow = (
    draw: (ctx: CanvasRenderingContext2D, s: number) => void,
  ) => {
    const s = 512;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = s;
    draw(canvas.getContext("2d")!, s);
    return new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    );
  };

  // RIM — тонкая линия по краю: яркая справа, едва заметная слева
  const rim = makeGlow((ctx, s) => {
    const c = s / 2;
    const ring = ctx.createRadialGradient(c, c, 0, c, c, c);
    ring.addColorStop(0.818, "rgba(255,204,0,0)");
    ring.addColorStop(0.83, "rgba(255,204,0,0.5)");
    ring.addColorStop(0.842, "rgba(255,204,0,0)");
    ctx.fillStyle = ring;
    ctx.fillRect(0, 0, s, s);
    // маска «освещения»: destination-in оставляет кольцо только там, где маска непрозрачна
    ctx.globalCompositeOperation = "destination-in";
    const light = ctx.createLinearGradient(0, s, s, 0);
    light.addColorStop(0, "rgba(0,0,0,0.3)"); // тень (слева снизу): контур тусклый, но читается
    light.addColorStop(0.55, "rgba(0,0,0,0.4)");
    light.addColorStop(1, "rgba(0,0,0,1)");
    ctx.fillStyle = light;
    ctx.fillRect(0, 0, s, s);
  });
  // видимый радиус сферы чуть больше RADIUS из-за перспективы: R·d / √(d² − R²)
  const camDist = camera.position.z;
  const silhouette =
    (RADIUS * camDist) / Math.sqrt(camDist * camDist - RADIUS * RADIUS);
  rim.scale.setScalar((silhouette * 2) / 0.83);
  scene.add(rim); // не в tilt: освещение фиксировано относительно экрана

  // HOTSPOTS — мягкие оранжевые очаги у полюсов (как в референсе)
  const hotspot = () =>
    makeGlow((ctx, s) => {
      const c = s / 2;
      const g = ctx.createRadialGradient(c, c, 0, c, c, c);
      g.addColorStop(0, "rgba(255,220,90,0.8)");
      g.addColorStop(0.12, "rgba(255,204,0,0.35)");
      g.addColorStop(0.5, "rgba(255,204,0,0.06)");
      g.addColorStop(1, "rgba(255,204,0,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, s, s);
    });
  const north = hotspot();
  north.scale.set(1.5, 0.28, 1); // вытянутый вдоль края, а не круглое пятно
  north.material.rotation = THREE.MathUtils.degToRad(6); // наклон как у оси, чтобы лёг вдоль кромки
  const south = hotspot();
  south.position.set(0, -RADIUS, 0);
  south.scale.setScalar(0.7);
  tilt.add(south);
  scene.add(north); // не в tilt: держим его на верхней кромке диска в экранных координатах

  // ---------- ТОЧКИ ПО КАРТЕ ----------
  const img = new Image();
  img.src = maskUrl;
  img.onload = () => {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0);
    const { data, width, height } = ctx.getImageData(
      0,
      0,
      img.width,
      img.height,
    );

    const isLand = (lat: number, lon: number) => {
      const u = (lon + Math.PI) / (2 * Math.PI);
      const v = (Math.PI / 2 - lat) / Math.PI;
      const px = Math.floor(u * (width - 1));
      const py = Math.floor(v * (height - 1));
      return data[(py * width + px) * 4] < 128;
    };

    // На карте лёд Антарктиды белый, как океан, поэтому рисуем её сами.
    // Граница — не ровная параллель, а «волнистая»: сумма синусов разной частоты
    // даёт случайный на вид контур вокруг ~−62°.
    const antarcticEdge = (lon: number) =>
      -1.08 +
      0.07 * Math.sin(lon * 3 + 1.3) +
      0.04 * Math.sin(lon * 7 + 0.4) +
      0.025 * Math.sin(lon * 13 + 2.1);

    const isAntarctica = (lat: number, lon: number) => {
      const edge = antarcticEdge(lon);
      if (lat < edge) return true;
      // полоса ~7° за границей: точки редеют к краю → рваный, «пыльный» край
      const t = (lat - edge) / 0.12;
      return t < 1 && Math.random() < (1 - t) ** 2 * 0.6;
    };

    const positions: number[] = [];
    const bright: number[] = [];
    const sizes: number[] = [];
    const phases: number[] = [];
    const hazePositions: number[] = [];

    // Случайная точка на сфере (равномерно): y — равномерно от -1 до 1, угол — от 0 до 2π.
    // Случайные точки вместо спирали Фибоначчи: в референсе «шум», а не ровная сетка.
    const randomOnSphere = () => {
      const y = Math.random() * 2 - 1;
      const r = Math.sqrt(1 - y * y);
      const a = Math.random() * Math.PI * 2;
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    };

    // 1) суша
    for (let i = 0; i < LAND_SAMPLES; i++) {
      const [x, y, z] = randomOnSphere();
      const lat = Math.asin(y);
      const lon = Math.atan2(-z, x);

      if (!isLand(lat, lon) && !isAntarctica(lat, lon)) continue;
      const d = RADIUS * (1 + Math.random() ** 4 * 0.03); // редкие точки чуть выше поверхности
      positions.push(x * d, y * d, z * d);
      bright.push(0.5 + Math.random() * 0.5);
      sizes.push(Math.random() < 0.08 ? 2.0 : 0.8 + Math.random() * 0.8);
      phases.push(Math.random() * Math.PI * 2);
      // каждую ~3-ю точку суши дублируем в слой дымки (без «пыли» над поверхностью)
      if (Math.random() < 0.35) hazePositions.push(x * RADIUS, y * RADIUS, z * RADIUS);
    }

    // 2) пыль над всей сферой — шейдер покажет её только у освещённого края
    for (let i = 0; i < DUST_COUNT; i++) {
      const [x, y, z] = randomOnSphere();
      const d = RADIUS * (1.005 + Math.random() ** 2 * 0.06);
      positions.push(x * d, y * d, z * d);
      bright.push(0.04 + Math.random() * 0.12);
      sizes.push(0.6 + Math.random() * 0.8);
      phases.push(Math.random() * Math.PI * 2);
    }

    const g = globe.geometry;
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));
    g.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    haze.geometry.setAttribute("position", new THREE.Float32BufferAttribute(hazePositions, 3));
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    // Видимая высота сцены в плоскости z = 0: 2 · расстояние до камеры · tan(половины угла обзора).
    // Через неё переводим «20.7% ширины» из Figma в единицы Three.js.
    const visibleH =
      2 *
      camera.position.z *
      Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    tilt.position.x = rim.position.x = visibleH * camera.aspect * OFFSET_X;
    // северный очаг — на верхней кромке диска, чуть левее центра (как в референсе)
    north.position.set(tilt.position.x - silhouette * 0.12, silhouette * 0.985, 0);
  };
  new ResizeObserver(resize).observe(container);
  resize();

  renderer.setAnimationLoop((time) => {
    material.uniforms.uTime.value = time / 1000; // в секундах
    globe.rotation.y += 0.0015;
    renderer.render(scene, camera);
  });
}
