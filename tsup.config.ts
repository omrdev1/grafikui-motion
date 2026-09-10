import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    marketing: "src/marketing.ts",
    "tokens/motion": "src/tokens/motion.ts",
    "tokens/colours": "src/tokens/colours.ts",
    "tokens/typography": "src/tokens/typography.ts",
  },
  format: ["esm"],
  dts: true,
  sourcemap: true,
  clean: true,
  outDir: "build",
  // React/Framer Motion/GSAP stay peer deps a consumer's own bundle
  // resolves — bundling them in would duplicate React across the
  // consuming app and break hooks.
  external: ["react", "react-dom", "framer-motion", "gsap", "lenis"],
});
