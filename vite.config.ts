import { defineConfig } from "vite";

export default defineConfig({
  build: {
    // режим библиотеки: на выходе не сайт с index.html, а JS-файлы для подключения на чужую страницу
    lib: {
      // объект, а не одна строка: сюда потом добавим вторую сцену и React-виджет,
      // каждый соберётся в свой файл
      entry: { "hero-globe": "src/hero-globe.ts" },
      formats: ["es"], // ES-модуль, подключается через <script type="module">
      fileName: (_format, name) => `${name}.js`, // dist/hero-globe.js без хешей
    },
    outDir: "dist",
    copyPublicDir: false, // public/ нужен только для песочницы
  },
});
