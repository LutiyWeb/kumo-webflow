import Swiper from "swiper";
import { Navigation } from "swiper/modules";
// ?inline — Vite отдаёт CSS не файлом, а строкой: вставим её сами, чтобы сборка была одним JS-файлом
import swiperCss from "swiper/css?inline";

// Все элементы ищем по data-атрибутам, которые ставим в Webflow
const root = document.querySelector<HTMLElement>("[data-solutions-slider]");

if (root) {
  // базовые стили Swiper + приглушение неактивных слайдов
  const style = document.createElement("style");
  style.textContent =
    swiperCss +
    `
    [data-solutions-slider] .swiper-slide { transition: opacity 0.5s; }
    [data-solutions-slider] .swiper-slide-next,
    [data-solutions-slider] .swiper-slide-next ~ .swiper-slide { opacity: 0.1; }  /* следующие — бледные, как в Figma */
    [data-solutions-slider] .swiper-slide-prev,
    [data-solutions-slider] .swiper-slide:has(~ .swiper-slide-prev) { opacity: 0; } /* прошедшие — скрыты */
  `;
  // в начало head: стили Webflow идут позже и перебивают дефолты Swiper (ширину слайда и т.п.)
  document.head.prepend(style);

  const counter = document.querySelector<HTMLElement>(
    "[data-solutions-counter]",
  );
  const progress = document.querySelector<HTMLElement>(
    "[data-solutions-progress]",
  );
  const pad = (n: number) => String(n).padStart(2, "0"); // 1 → "01"

  // Хвост после последнего слайда: без него Swiper упирается в конец ленты,
  // и последние слайды никогда не становятся активными (счётчик не дойдёт до 06)
  const tail = () =>
    root.clientWidth -
    (root.querySelector<HTMLElement>(".swiper-slide")?.offsetWidth ?? 0);

  new Swiper(root, {
    modules: [Navigation],
    slidesPerView: "auto", // ширину слайда задаём в Webflow, Swiper её не трогает
    spaceBetween: 20, // отступ между слайдами на мобилке (Figma: ~20px)
    breakpoints: {
      768: { spaceBetween: 65 }, // от 768px — как в десктопном макете
    },
    speed: 700,
    slidesOffsetAfter: tail(),
    // кнопки могут стоять где угодно на странице — это и было нужно
    navigation: {
      prevEl: "[data-solutions-prev]",
      nextEl: "[data-solutions-next]",
    },
    on: {
      // счётчик «01 / 06» и линия прогресса — обновляем при смене слайда
      init(swiper) {
        update(swiper);
      },
      slideChange(swiper) {
        update(swiper);
      },
      // при смене ширины окна пересчитываем хвост
      resize(swiper) {
        swiper.params.slidesOffsetAfter = tail();
        swiper.update();
      },
    },
  });

  function update(swiper: Swiper) {
    const total = swiper.slides.length;
    const current = swiper.activeIndex + 1;
    if (counter) counter.textContent = `${pad(current)} / ${pad(total)}`;
    // заливка линии: scaleX от 1/6 до 6/6 (transform-origin: left задаём в Webflow)
    if (progress) progress.style.transform = `scaleX(${current / total})`;
  }
}
