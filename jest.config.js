module.exports = {
  roots: ["<rootDir>/src"],
  transform: {
    ".*.tsx?$": "ts-jest",
  },
  testMatch: ["<rootDir>/src/**/?(*.)test.{ts,tsx}"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  setupFilesAfterEnv: [
    "react-testing-library/cleanup-after-each",
    "jest-dom/extend-expect",
  ],
};
