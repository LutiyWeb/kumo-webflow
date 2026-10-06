import { defineConfig } from "vite";

export default defineConfig({
  server: {
    cors: true, // разрешить опубликованному сайту грузить файлы с localhost
    origin: "http://localhost:5173", // картинки и прочие ассеты получают полный адрес localhost,
    // иначе браузер искал бы их на webflow.io
  },
  build: {
    // режим библиотеки: на выходе не сайт с index.html, а JS-файлы для подключения на чужую страницу
    lib: {
      // объект, а не одна строка: сюда потом добавим вторую сцену и React-виджет,
      // каждый соберётся в свой файл
      entry: {
        "hero-globe": "src/hero-globe.ts",
        "solutions-slider": "src/solutions-slider.ts",
      },
      formats: ["es"], // ES-модуль, подключается через <script type="module">
      fileName: (_format, name) => `${name}.js`, // dist/hero-globe.js без хешей
    },
    outDir: "dist",
    copyPublicDir: false, // public/ нужен только для песочницы
  },
});
