import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { PrimeVueResolver } from "@primevue/auto-import-resolver";
import { VitePWA } from "vite-plugin-pwa";
import viteImageMin from "vite-plugin-imagemin";
import Icons from "unplugin-icons/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({
      imports: ["vue", "vue-router", "pinia", "@vueuse/core"],
      dirs: ["src/stores", "src/composables", "src/components"],
      dts: "src/auto-imports.d.ts",
      vueTemplate: true,
    }),
    Icons({
      autoInstall: true,
      compiler: "vue3",
    }),
    Components({
      resolvers: [
        PrimeVueResolver(),
        IconsResolver({
          prefix: "i",
          enabledCollections: ["lucide"],
        }),
      ],
    }),
    viteImageMin({
      gifsicle: { optimizationLevel: 7, interlaced: false },
      optipng: { optimizationLevel: 7 },
      mozjpeg: { quality: 20 },
      pngquant: { quality: [0.8, 0.9], speed: 4 },
      svgo: {
        plugins: [
          { name: "removeViewBox" },
          { name: "removeEmptyAttrs", active: false },
        ],
      },
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.png"],
      manifest: {
        name: "Petualangan Pythagoras",
        short_name: "Pythagoras",
        theme_color: "#10b981",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
