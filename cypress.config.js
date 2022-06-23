const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    viewportWidth: 1480,
    baseUrl: 'https://filmweb.pl',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
