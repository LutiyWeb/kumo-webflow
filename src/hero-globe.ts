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
  // Уже 1024px глобус не помещается → там только сетка (см. «МОБИЛЬНЫЙ РЕЖИМ»).
  // matchMedia — тот же медиазапрос, что в CSS.
  const mobileQuery = window.matchMedia("(max-width: 1023px)");

  // TILT — наклон оси. В референсе ось почти вертикальная.
  const tilt = new THREE.Group();
  const parallax = new THREE.Group();
  tilt.rotation.z = THREE.MathUtils.degToRad(6);
  // южный полюс чуть к нам: в референсе видна Антарктида, а северный очаг сидит на краю
  tilt.rotation.x = THREE.MathUtils.degToRad(-28);
  parallax.add(tilt);
  scene.add(parallax);

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
      uMorph: { value: 0 }, // 0 — глобус, 1 — сетка. ВРЕМЕННО 1, чтобы увидеть сетку
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
      attribute vec3 aPosGrid;     // адрес частицы в сетке (мировые координаты)
      attribute float aGridBright; // яркость частицы в сетке
      attribute float aFly;        // 1 — летит на камеру, 0 — стоит (облачко в точке схода)
      uniform float uMorph;
      varying float vBlur;         // насколько точка размыта (боке): 0 — резкая, 1 — диск
      const float FOCUS = 16.0;    // расстояние до плоскости фокуса
      const float Z_FAR = -30.0;   // дальний край сетки (как в JS)
      const float SPAN = 38.0;     // глубина сетки: от Z_FAR до ближнего края (8.0)
      const float SPEED = 1.2;     // скорость полёта, единиц сцены в секунду
 
      void main() {
        vec4 worldGlobe = modelMatrix * vec4(position, 1.0); // где частица в глобусе, с учётом всех вращений
        vec3 grid = aPosGrid;
        // ПОЛЁТ: сетка едет на камеру; пролетевшее мимо камеры mod() переносит в дальний конец
        grid.z = Z_FAR + mod(grid.z - Z_FAR + uTime * SPEED * aFly, SPAN);
        grid.x += sin(uTime * 0.17) * 0.4;   // лёгкое покачивание вбок — ощущение плывущей камеры
        // ---------- РАСПАД ----------
        // У каждой точки свой отрезок внутри общего uMorph: стартует с задержкой 0…0.5
        const float SPREAD = 0.8;                          // разброс старта: 0 — все разом, 0.9 — по одной
        float delay = aPhase / 6.2832 * SPREAD;            // aPhase случайна в [0, 2π) → задержка 0…SPREAD
        float t = clamp((uMorph - delay) / (1.0 - SPREAD), 0.0, 1.0); // личный прогресс 0…1; делим на остаток, иначе поздние точки не долетают
        t = t * t * (3.0 - 2.0 * t);                       // мягкий старт и мягкая посадка
        // случайное направление разлёта (из aPhase, чтобы не заводить новый атрибут)
        vec3 scatter = normalize(vec3(sin(aPhase * 12.9), cos(aPhase * 7.3), sin(aPhase * 3.7) - 0.3));
        // sin(π·t): 0 на старте, максимум в середине пути, 0 на финише → полёт дугой
        vec3 world = mix(worldGlobe.xyz, grid, t) + scatter * 1.5 * sin(3.14159 * t);  // смешиваем два адреса
        vec4 mv = viewMatrix * vec4(world, 1.0);             // дальше как раньше: относительно камеры
        vec3 n = normalize(normalMatrix * normalize(position)); // куда «смотрит» поверхность
        vec3 toCam = normalize(-mv.xyz);
 
        float facing = dot(n, toCam);                         // 1 — в центре диска, 0 — на краю, <0 — сзади
        float rim = pow(1.0 - clamp(facing, 0.0, 1.0), 3.0);  // яркость растёт к краю
        float lit = clamp(dot(n, normalize(vec3(0.75, 0.6, 0.35))), 0.0, 1.0); // свет справа-сверху
        float front = smoothstep(-0.15, 0.2, facing);         // обратную сторону гасим
 
        float center = 0.3 + 0.7 * clamp(facing, 0.0, 1.0); // к центру диска ярче, к краю тусклее
        vAlpha = aBright * front * (2.2 * center + 0.3 * lit + 1.2 * rim * lit); // лицом к зрителю — ярче всего
        vAlpha = mix(vAlpha, aGridBright, t); // яркость тоже перетекает
        float breath = 1.0 + 0.15 * sin(uTime * 1.6 + aPhase);
        float flash = pow(0.5 + 0.5 * sin(uTime * 0.7 + aPhase * 7.0), 30.0);
        vAlpha *= 1.0 + 2.0 * flash;                 // во время вспышки точка втрое ярче
        gl_PointSize = uSize * aSize * uPixelRatio * breath * (1.0 + 0.5 * flash) * (0.8 + 0.4 * center); // спереди чуть крупнее

        // ---------- БОКЕ (глубина резкости), работает только в сетке ----------
        float dist = -mv.z;                                      // расстояние до камеры
        float persp = clamp(FOCUS / dist, 0.4, 1.8);             // ближе — крупнее, дальше — мельче
        float blur = pow(clamp((FOCUS - dist) / 10.0, 0.0, 1.0), 2.0); // ближе фокуса → сильнее размыто; квадрат держит средний план резким
        vBlur = blur * t;
        // ЗАТУХАНИЕ ПО ГЛУБИНЕ: у камеры точка гаснет, вдали проявляется → перенос по Z не виден
        float depthFade = smoothstep(1.5, 5.0, dist) * (1.0 - smoothstep(24.0, 39.0, dist)); // дальние гаснут раньше → чище центр
        vAlpha *= mix(1.0, depthFade, t);
        gl_PointSize *= mix(1.0, persp * (1.0 + 1.5 * blur), t);      // размытая точка — большой диск
        vAlpha *= mix(1.0, min(persp, 1.0) * (1.0 - 0.9 * blur), t); // дальние тусклее, диск не слепит
        gl_Position = projectionMatrix * mv;
      }
    `,
    // FRAGMENT SHADER — выполняется для каждого пикселя точки: делает её круглой и мягкой
    fragmentShader: /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vBlur;
  void main() {
    float d = length(gl_PointCoord - 0.5);  // расстояние от центра квадратика точки
    float core = smoothstep(0.16, 0.0, d);    // маленькое плотное ядро
    float halo = exp(-d * 10.0) * 0.55;       // ореол: яркость гаснет экспоненциально от центра
    float edge = smoothstep(0.5, 0.42, d);    // обрезаем у края квадрата, чтобы не было «квадратиков»
    float disc = smoothstep(0.5, 0.3, d) * 0.45;  // боке: ровный диск с мягким краем
    float shape = mix(core + halo, disc, vBlur);  // резкая точка → размытый диск
    vec3 color = mix(uColor, vec3(1.0, 0.97, 0.85), core * 0.35 * (1.0 - vBlur)); // белое ядро только у резких
    gl_FragColor = vec4(color, vAlpha * shape * edge);
  }
`,
  });

  const globe = new THREE.Points(new THREE.BufferGeometry(), material);
  // Не отсекать по рамке камеры: three.js проверяет «попадает ли объект в кадр» по сфере глобуса,
  // а в режиме сетки точки разлетаются далеко за неё → на узком экране сетка пропадала целиком.
  globe.frustumCulled = false;
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
      uFade: { value: 1 }, // 1 — видна, 0 — погашена (управляет морф)
      uColor: { value: new THREE.Color(0xffcc00) },
      uSize: { value: 34.0 }, // размер пятна в пикселях
      uOpacity: { value: 0.08 }, // прозрачность одного пятна — главная ручка яркости дымки
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
      uniform float uFade;
      void main() {
        float d = length(gl_PointCoord - 0.5); // расстояние от центра квадратика
        float blob = exp(-d * d * 18.0) * smoothstep(0.5, 0.3, d); // размытое пятно (гауссиана)
        gl_FragColor = vec4(uColor, blob * vAlpha * uOpacity * uFade);
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
  rim.scale.setScalar((silhouette * 2 * 1.02) / 0.83);
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
  north.position.set(-silhouette * 0.12, silhouette * 0.985, 0); // верхняя кромка, чуть левее центра
  north.material.rotation = THREE.MathUtils.degToRad(6); // наклон как у оси, чтобы лёг вдоль кромки
  const south = hotspot();
  south.position.set(0, -RADIUS, 0);
  south.scale.setScalar(0.7);
  tilt.add(south);
  scene.add(north); // не в tilt: держим его на верхней кромке диска в экранных координатах

  // ---------- ОВЕРЛЕИ СЕТКИ: «+», куски кода, числа ----------
  // Каждый оверлей — спрайт с картинкой, нарисованной на canvas (как ободок и очаги).
  // Летят на камеру вместе с сеткой: каждый кадр двигаем по Z и переносим в дальний конец (в цикле).
  const overlay = new THREE.Group();
  scene.add(overlay);
  const flyers: { sprite: THREE.Sprite; z: number }[] = []; // z — стартовая глубина спрайта

  // Рисуем на canvas и делаем спрайт. height — высота спрайта в единицах сцены, ширина — по пропорции canvas.
  const makeSprite = (
    w: number,
    h: number,
    height: number,
    pos: [number, number, number],
    draw: (ctx: CanvasRenderingContext2D) => void,
  ) => {
    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    draw(canvas.getContext("2d")!);
    const sprite = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: new THREE.CanvasTexture(canvas),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0, // появятся только в режиме сетки
      }),
    );
    sprite.scale.set((height * w) / h, height, 1);
    sprite.position.set(...pos);
    overlay.add(sprite);
    flyers.push({ sprite, z: pos[2] });
    return sprite;
  };

  const AMBER = "#ffb21e"; // оранжевее жёлтого глобуса, как в video2
  const rand = (min: number, max: number) => min + Math.random() * (max - min);

  // а) «+» — регулярными «рамками» 3 × 3 на нескольких глубинах
  for (const z of [4, -6, -16, -26]) {
    for (const x of [-1.6, 0, 1.6]) {
      for (const y of [-0.9, 0, 0.9]) {
        makeSprite(64, 64, 0.09, [x, y, z], (ctx) => {
          ctx.strokeStyle = AMBER;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(32, 8);
          ctx.lineTo(32, 56);
          ctx.moveTo(8, 32);
          ctx.lineTo(56, 32);
          ctx.stroke();
        });
      }
    }
  }

  // б) куски кода, разбросаны по всей глубине
  const CODE = [
    [
      "function showError(error) {",
      "  switch (error.code) {",
      "    case error.PERMISSION_DENIED:",
      "      x.innerHTML = 'User denied the request';",
      "      break;",
    ],
    ["const node = graph.get(id);", "node.weight += delta;"],
    ["if (signal > THRESHOLD) {", "  emit('peak', signal);", "}"],
    ["stream.on('data', (chunk) => {", "  buffer.push(chunk);", "});"],
    ["x.innerHTML = 'Location unavailable';"],
    ["await sync(edge, { retry: 3 });"],
  ];
  for (let i = 0; i < 12; i++) {
    const lines = CODE[i % CODE.length];
    const label = makeSprite(
      640,
      32 * lines.length + 8,
      0.09 * lines.length,
      [rand(-3.5, 3.5), rand(-1.2, 1.2), -30 + (i + Math.random()) * (38 / 12)], // равномерно по глубине
      (ctx) => {
        ctx.font = "bold 22px monospace";
        ctx.fillStyle = AMBER;
        ctx.shadowColor = AMBER; // лёгкое свечение текста
        ctx.shadowBlur = 6;
        lines.forEach((line, n) => ctx.fillText(line, 4, 26 + n * 32));
      },
    );
    label.center.set(0, 0.5); // якорь слева: текст «растёт» вправо от точки
  }

  // в) крупные светящиеся числа
  for (const [text, x, y, z] of [
    [".619", -0.4, 1.0, -4],
    [".508", 1.8, 0.7, -17],
    [".808", -1.6, -0.8, -27],
  ] as const) {
    makeSprite(256, 96, 0.3, [x, y, z], (ctx) => {
      ctx.font = "bold 72px monospace";
      ctx.fillStyle = "#ffd36a";
      ctx.shadowColor = AMBER;
      ctx.shadowBlur = 18;
      ctx.fillText(text, 12, 74);
    });
  }

  // ---------- ТОЧКИ ПО КАРТЕ ----------
  const img = new Image();
  // В dev-режиме карта грузится с localhost, а страница открыта с webflow.io.
  // Без этого браузер запретит читать пиксели «чужой» картинки через getImageData.
  img.crossOrigin = "anonymous";
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
      if (Math.random() < 0.35)
        hazePositions.push(x * RADIUS, y * RADIUS, z * RADIUS);
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

    // 3) ВТОРАЯ ФОРМА — «пространство данных» (слайд 2), как в video2.
    // Объём почти на весь экран по высоте, глубокий по Z. Камера летит сквозь него (полёт — в шейдере).
    // Координаты мировые: сетка не крутится вместе с глобусом.
    // Сначала собираем список «мест» в сетке, потом раздаём их частицам.
    const spots: number[] = []; // x, y, z подряд
    const spotBright: number[] = [];
    const spotFly: number[] = []; // 1 — летит, 0 — стоит на месте
    const addSpot = (x: number, y: number, z: number, b: number, fly = 1) => {
      spots.push(x, y, z);
      spotBright.push(b);
      spotFly.push(fly);
    };

    const LEVELS = [-1.8, -1.2, -0.6, 0, 0.6, 1.2, 1.8]; // высоты горизонтальных «этажей»
    const Z_NEAR = 8; // ближний край (камера на z = 9.3)
    const Z_FAR = -30; // дальний край; Z_NEAR − Z_FAR = 38 = SPAN в шейдере
    const ROW_STEP = 1.9; // расстояние между строками вглубь
    const DOT_STEP = 0.5; // шаг точек внутри строки → редкий ровный пунктир
    const HALF_W = 9; // полуширина по X

    // а) редкие пунктирные строки вдоль X на каждом этаже
    for (const y of LEVELS) {
      for (let z = Z_NEAR; z > Z_FAR; z -= ROW_STEP) {
        // у каждой строки свой сдвиг по X: иначе точки строк выстроятся в «лучи» к точке схода
        const shift = Math.random() * DOT_STEP;
        for (let x = -HALF_W + shift; x <= HALF_W; x += DOT_STEP) {
          // базово выбиваем 28% точек; вдали (z < −5) всё сильнее — до ~78%:
          // дальние строки сходятся в точку схода, и без этого центр «забивается»
          const far = Math.max(0, (-z - 5) / 25);
          if (Math.random() < 0.28 + 0.5 * far) continue;
          addSpot(x, y, z, 0.5 + Math.random() * 0.5);
        }
      }
    }

    // б) редкие вертикальные пунктирные столбики
    for (let i = 0; i < 60; i++) {
      const x = (Math.random() * 2 - 1) * HALF_W;
      const z = Z_FAR + Math.random() * (Z_NEAR - Z_FAR);
      const b = 0.25 + Math.random() * 0.3;
      for (let y = LEVELS[0]; y <= LEVELS[LEVELS.length - 1]; y += 0.12) {
        if (Math.random() < 0.3) continue;
        addSpot(x, y, z, b);
      }
    }

    // в) маленькая «звёздочка» в точке схода — стоит на месте (fly = 0)
    for (let i = 0; i < 300; i++) {
      addSpot(
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.5,
        -20 - Math.random() * 10,
        0.3 + Math.random() * 0.5,
        0,
      );
    }

    // Раздаём места частицам. Частиц больше, чем мест → лишние гасим (яркость 0)
    // и прячем вдаль: при морфе они просто растворяются.
    const count = positions.length / 3;
    const gridPositions: number[] = [];
    const gridBright: number[] = [];
    const gridFly: number[] = [];
    const spotCount = spotBright.length;
    for (let i = 0; i < count; i++) {
      if (i < spotCount) {
        gridPositions.push(spots[i * 3], spots[i * 3 + 1], spots[i * 3 + 2]);
        gridBright.push(spotBright[i]);
        gridFly.push(spotFly[i]);
      } else {
        gridPositions.push(
          (Math.random() - 0.5) * 6,
          (Math.random() - 0.5) * 2,
          Z_FAR,
        );
        gridBright.push(0);
        gridFly.push(0);
      }
    }

    const g = globe.geometry;
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    g.setAttribute("aBright", new THREE.Float32BufferAttribute(bright, 1));
    g.setAttribute("aSize", new THREE.Float32BufferAttribute(sizes, 1));
    g.setAttribute("aPhase", new THREE.Float32BufferAttribute(phases, 1));
    g.setAttribute(
      "aPosGrid",
      new THREE.Float32BufferAttribute(gridPositions, 3),
    );
    g.setAttribute("aFly", new THREE.Float32BufferAttribute(gridFly, 1));
    g.setAttribute(
      "aGridBright",
      new THREE.Float32BufferAttribute(gridBright, 1),
    );
    haze.geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(hazePositions, 3),
    );
  };

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = container;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    // «Сдвиг объектива»: глобус стоит в центре сцены, где нет перспективных искажений,
    // а вправо сдвигаем сам кадр. setViewOffset(полная ширина, полная высота, сдвиг X, сдвиг Y, ширина, высота):
    // отрицательный X смещает картинку вправо на 20.7% ширины, как в Figma.
    // Метод сам вызывает updateProjectionMatrix().
    // на мобилке глобуса нет → точку схода сетки ставим по центру
    const offset = mobileQuery.matches ? 0 : OFFSET_X;
    camera.setViewOffset(w, h, -w * offset, 0, w, h);
  };
  new ResizeObserver(resize).observe(container);
  const MAX_TILT = THREE.MathUtils.degToRad(60); // максимальный поворот за курсором
  const target = { x: 0, y: 0 }; // куда глобус хочет повернуться; догонять будем в цикле

  let hovering = false; // курсор над hero?
  let spin = 0.0015; // текущая скорость автовращения

  // Слушаем window, а не canvas: поверх canvas лежит текст слайдера и перехватывает мышь
  window.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return; // на тач-устройствах не наклоняем
    const r = container.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1; // −1 слева … 1 справа
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1; // −1 сверху … 1 снизу
    target.y = nx * MAX_TILT; // мышь вправо → поворот вокруг вертикальной оси
    target.x = ny * MAX_TILT; // мышь вниз → поворот вокруг горизонтальной оси
    hovering = Math.abs(nx) <= 1 && Math.abs(ny) <= 1;
  });
  document.addEventListener("mouseleave", () => {
    hovering = false;
    target.x = target.y = 0;
  });
  // ---------- МОРФ ----------
  // Кто угодно (кнопка в песочнице, позже слайдер Webflow) шлёт событие kumo:morph с числом 0 или 1
  let slideMorph = 0; // что просит слайдер
  let morphTarget = 0; // куда реально едем

  // ---------- МОБИЛЬНЫЙ РЕЖИМ (уже 1024px) ----------
  // Глобус на узком экране не помещается → там всегда только сетка, слайдер её не переключает.
  // change срабатывает при повороте телефона или сужении окна.
  const applyMode = () => {
    morphTarget = mobileQuery.matches ? 1 : slideMorph;
  };
  mobileQuery.addEventListener("change", applyMode);
  applyMode();
  // на мобилке стартуем сразу с сетки, без морфа при загрузке
  if (mobileQuery.matches) material.uniforms.uMorph.value = 1;

  window.addEventListener("kumo:morph", (e) => {
    slideMorph = (e as CustomEvent<number>).detail;
    applyMode();
  });
  resize();

  renderer.setAnimationLoop((time) => {
    material.uniforms.uTime.value = time / 1000; // в секундах
    spin += ((hovering ? 0 : 0.0015) - spin) * 0.05;
    globe.rotation.y += spin;
    parallax.rotation.x += (target.x - parallax.rotation.x) * 0.05;
    parallax.rotation.y += (target.y - parallax.rotation.y) * 0.05;
    // uMorph плавно догоняет цель — тот же lerp, что у курсора
    const m = material.uniforms.uMorph;
    m.value += (morphTarget - m.value) * 0.03;
    // всё, что есть только у глобуса, гаснет вместе с морфом
    const fade = 1 - m.value;
    hazeMaterial.uniforms.uFade.value = fade;
    rim.material.opacity =
      north.material.opacity =
      south.material.opacity =
        fade;

    // оверлеи проявляются в самом конце морфа (последние 30%), когда сетка уже собралась
    const show = Math.max(0, (m.value - 0.7) / 0.3);
    const sec = time / 1000;
    overlay.position.x = Math.sin(sec * 0.17) * 0.4; // то же покачивание, что у точек
    for (const f of flyers) {
      // тот же полёт, что в шейдере: Z_FAR + mod(z − Z_FAR + время · скорость, глубина)
      const z = -30 + ((((f.z + 30 + sec * 1.2) % 38) + 38) % 38);
      f.sprite.position.z = z;
      // то же затухание по глубине: у камеры гаснет, вдали проявляется
      const dist = camera.position.z - z;
      const fade =
        THREE.MathUtils.smoothstep(dist, 1.5, 5) *
        (1 - THREE.MathUtils.smoothstep(dist, 14, 24)); // оверлеи проявляются ближе: вдали они только мусорят в центре
      (f.sprite.material as THREE.SpriteMaterial).opacity = show * fade;
    }
    renderer.render(scene, camera);
  });
}
