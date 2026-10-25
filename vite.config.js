import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

const CHUNK_GROUPS = {
  three: /node_modules\/(three|@react-three|react-three-map)\//,
  maps: /node_modules\/(maplibre-gl|mapbox-gl|leaflet|react-map-gl|@vis\.gl)\//,
  turf: /node_modules\/@turf\//,
  wallet: /node_modules\/(@walletconnect|@reown|viem|ox|abitype)\//,
  editors: /node_modules\/(slate|slate-react|slate-history|quill|react-quill-new)\//,
};

const manualChunks = (id) => {
  if (!id.includes("node_modules")) return;
  return Object.keys(CHUNK_GROUPS).find((name) => CHUNK_GROUPS[name].test(id));
};

// https://vitejs.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react(), svgr()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".json"],
  },
  build: {
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
        manualChunks,
        sourcemapPathTransform: (relativeSourcePath) => `~/${relativeSourcePath}`,
      },
    },
  },
});