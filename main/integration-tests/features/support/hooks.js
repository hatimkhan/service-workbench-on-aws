/* eslint-disable func-names */
const { Before } = require('@cucumber/cucumber');

async function wait() {
  return new Promise(resolve => {
    setTimeout(resolve, 2000);
  });
}

Before(async function() {
  // We initialize the world before each scenario
  // However, the world.init() method is smart to only do the initialization logic once
  await this.init();
});
