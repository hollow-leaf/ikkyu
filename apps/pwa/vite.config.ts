import { serwist } from "@serwist/vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, AliasOptions } from "vite";
import path from "path";
const root = path.resolve(__dirname, "src");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    serwist({
      swSrc: "src/sw.ts",
      swDest: "sw.js",
      globDirectory: "dist",
      injectionPoint: "self.__SW_MANIFEST",
      rollupFormat: "iife",
    }),
    basicSsl({
      /** name of certification */
      name: "test",
      /** custom trust domains */
      domains: ["*.custom.com"],
      /** custom certification directory */
      certDir: "/Users/kidneyweakx/.devServer/cert",
    }),
  ],
  resolve: {
    alias: {
    "@": path.resolve(__dirname, "./src"),
    } as AliasOptions,
  },
});
