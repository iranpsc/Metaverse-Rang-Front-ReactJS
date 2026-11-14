import { defineConfig } from "eslint/config";
import globals from "globals";
import react from "eslint-plugin-react";
import unusedImports from "eslint-plugin-unused-imports";

export default defineConfig([
  {
    ignores: ["node_modules", "dist"],
  },

  {
    files: ["**/*.{js,jsx}"],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",

      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    plugins: {
      react,
      "unused-imports": unusedImports,
      
    },

    rules: {
      // گزارش متغیرهای استفاده نشده؛ lint:fix suggestion حذف آن‌ها را اعمال می‌کند
      "no-unused-vars": ["warn", { "vars": "all", "args": "after-used" }],
      "unused-imports/no-unused-vars": "off",
      "react/jsx-uses-vars": "error",

      // فقط import های استفاده نشده
      "unused-imports/no-unused-imports": "warn",

      // فقط شرط‌های ثابت و بی‌فایده
      "no-constant-condition": "warn",
      "no-constant-binary-expression": "warn",
    },
  },
]);