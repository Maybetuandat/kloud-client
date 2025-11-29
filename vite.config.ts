import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
      "@/components": path.resolve(__dirname, "./components"),
      "@/types": path.resolve(__dirname, "./types"),
      "@/services": path.resolve(__dirname, "./services"),
      "@/hooks": path.resolve(__dirname, "./hooks"),
      "@/lib": path.resolve(__dirname, "./lib"),
      "@/pages": path.resolve(__dirname, "./pages"),
      "@/utils": path.resolve(__dirname, "./utils"),
    },
  },
  server: {
    port: 3000,
  },
});
