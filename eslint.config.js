import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
// Assuming 'eslint/config' provides necessary utilities like 'defineConfig'
// If 'defineConfig' isn't needed, you can export the array directly
// import { defineConfig } from "eslint/config"; 

// The easiest fix is to include the jsx-runtime configuration
const reactRecommendedWithRuntime = {
  ...pluginReact.configs.flat.recommended,
  rules: {
    ...pluginReact.configs.flat.recommended.rules,
    // Explicitly turn these rules off as 'jsx-runtime' handles them
    "react/react-in-jsx-scope": "off",
    "react/jsx-uses-react": "off",
    "react/prop-types": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};

// Export the configuration array
export default [
  // Apply standard JS recommended rules
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    languageOptions: {
      globals: globals.browser
    },
  },
  {
    // Apply React settings to files that need them
    files: ["**/*.{js,mjs,cjs,jsx}"],
    ...reactRecommendedWithRuntime,
  },
  // OR, if you just want to use the official runtime extension:
  // Note: The 'recommended' config might already pull in the 'jsx-runtime' if configured correctly,
  // but overriding rules explicitly is often clearer.
  // ...pluginReact.configs.flat.all, // use 'all' for verbose configs if you like
];

