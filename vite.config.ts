import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    dedupe: ["react", "react-dom"],
  },
  build: {
    outDir: "dist/public",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        game: path.resolve(__dirname, "game.html"),
        about: path.resolve(__dirname, "about.html"),
        howtoplay: path.resolve(__dirname, "howtoplay.html"),
        creator: path.resolve(__dirname, "creator.html"),
      },
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
});
