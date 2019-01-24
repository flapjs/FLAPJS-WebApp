module.exports = {
  //clear mock calls every test
  clearMocks: true,
  //glob patterns for coverage info
  collectCoverageFrom: ['src/**/*.{js,jsx,mjs}'],
  //coverage output directory
  coverageDirectory: 'coverage',
  //setup testing environment with enzyme
  setupFiles: ['<rootDir>/enzyme.config.js'],
  //Load css modules
  moduleNameMapper: {
    "\\.css$": "identity-obj-proxy"
  },
  moduleDirectories: ["node_modules", "src/app", "res", "src/test"],
};
