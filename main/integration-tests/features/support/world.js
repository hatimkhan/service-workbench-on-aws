/* eslint-disable dot-notation */
const _ = require('lodash');
const path = require('path');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const { setWorldConstructor } = require('@cucumber/cucumber');
const axios = require('axios').default;

const Settings = require('./settings');

const internalGlobalStore = {};

class World {
  // constructor(args) {}

  async init() {
    await this.populateSettings();
    await this.populateAdminIdToken();
  }

  async populateSettings() {
    let settings = internalGlobalStore['settings'];
    // If we already populated the settings, then don't bother
    if (settings) {
      this.settings = settings;
      return;
    }

    const yamlFile = path.join(__dirname, `../../config/settings/${process.env.ENV_NAME}.yml`);
    const yamlObject = yaml.load(await fs.readFile(yamlFile, 'utf8'));

    const envName = process.env.ENV_NAME;
    const apiEndpoint = yamlObject.isLocal ? yamlObject.localApiEndpoint : process.env.API_ENDPOINT;

    if (_.isEmpty(apiEndpoint)) throw Error(`Please provide API_ENDPOINT as an environment variable`);
    settings = new Settings({ ...yamlObject, envName, apiEndpoint });
    internalGlobalStore['settings'] = settings;

    this.settings = settings;
  }

  async populateAdminIdToken() {
    let adminIdToken = internalGlobalStore['adminIdToken'];
    if (adminIdToken) {
      this.adminIdToken = adminIdToken;
    }

    adminIdToken = await this.obtainAdminIdToken();
    this.adminIdToken = adminIdToken;
  }

  async obtainAdminIdToken() {
    const username = this.settings.get('username');
    const password = this.settings.get('password');
    const apiEndpoint = this.settings.get('apiEndpoint');
    const payload = {
      username,
      password,
      authenticationProviderId: 'internal',
    };
    const response = await axios.post(`${apiEndpoint}/api/authentication/id-tokens`, payload);

    return response.data.idToken;
  }

  async populateRestResources() {}
}

setWorldConstructor(World);
