import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), svgr()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
    emptyOutDir: true,
    sourcemap: "hidden",
    rollupOptions: {
      onwarn(warning, warn) {
        // هشدار کامنت /*#__PURE__*/ در کتابخانه‌های node_modules (مثل ox) بی‌خطر است
        if (
          warning.code === "INVALID_ANNOTATION" &&
          warning.id?.includes("node_modules")
        ) {
          return;
        }
        warn(warning);
      },
      output: {
        sourcemapPathTransform: (relativeSourcePath) => `~/${relativeSourcePath}`,
      },
    },
  },
});