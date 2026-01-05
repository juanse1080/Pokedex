import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@/pages": path.resolve(__dirname, "./src/components/pages"),
      "@/atoms": path.resolve(__dirname, "./src/components/atoms"),
      "@/molecules": path.resolve(__dirname, "./src/components/molecules"),
      "@/organisms": path.resolve(__dirname, "./src/components/organisms"),
      "@/templates": path.resolve(__dirname, "./src/components/templates"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/graphql": path.resolve(__dirname, "./src/graphql"),
      "@/apollo": path.resolve(__dirname, "./src/apollo"),
      "@/styles": path.resolve(__dirname, "./src/styles"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
      "@/const": path.resolve(__dirname, "./src/const"),
      "@/contexts": path.resolve(__dirname, "./src/contexts"),
      "@/test": path.resolve(__dirname, "./src/test"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
});
