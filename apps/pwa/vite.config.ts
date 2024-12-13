import { serwist } from "@serwist/vite";
import react from "@vitejs/plugin-react-swc";
import basicSsl from "@vitejs/plugin-basic-ssl";
import { defineConfig, AliasOptions } from "vite";
import path from "path";
import { nodePolyfills } from 'vite-plugin-node-polyfills';
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
      domains: ["*.localhost"],
      /** custom certification directory */
      certDir: "/Users/kidneyweakx/.devServer/cert",
    }),
    nodePolyfills({
      // To add only specific polyfills, add them here. If no option is passed, adds all polyfills
      include: ["crypto"],
    }),
  ],
  resolve: {
    alias: {
    "@": path.resolve(__dirname, "./src"),
    } as AliasOptions,
  },
});
