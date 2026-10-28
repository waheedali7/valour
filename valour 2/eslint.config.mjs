import nextVitals from "eslint-config-next/core-web-vitals";

const eslintConfig = [
  ...nextVitals,
  { ignores: [".next/**", "node_modules/**", "assets/**", "public/**"] },
  // Media is pre-optimized by scripts/prepare-assets.mjs and served unoptimized.
  { rules: { "@next/next/no-img-element": "off" } },
];

export default eslintConfig;
