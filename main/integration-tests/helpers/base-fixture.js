/*
 *  Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */

const _ = require('lodash');
const axios = require('axios').default;
const { getProjectParams } = require('./api-param-generator');
const { validResponse } = require('../utils/studies');
const { listUsers } = require('../utils/users');
const { getTestAdminToken } = require('../utils/auth-tokens');
const TestConfig = require('../config/test-config.json');

// Base Fixture
/**
 * This class is designed to generate resources that would be required for any integration test to work
 * For example, if the user provided invalid test admin credentials, none of the test resources would be created in the tests
 *
 * The verification of such critical components are performed only once at the start of every integration test cycle
 */
class BaseFixture {
  constructor() {
    this.testConfig = TestConfig;

    // We initially assume the Base Fixture is not verified
    // For this to turn true, we need to confirm the test admin credentials and provided test project ID are valid
    BaseFixture.ready = false;
  }

  async setupBasePreRequisites() {
    try {
      const testAdminVerified = await this.verifyTestAdmin();
      const projectVerified = await this.verifyTestProject();

      if (projectVerified && testAdminVerified) BaseFixture.ready = true;
    } catch (err) {
      throw new Error(`There was a problem verifying base fixture resources: ${err}`);
    }
  }

  // Check if TestAdmin is actually admin
  async verifyTestAdmin() {
    const bearerToken = await getTestAdminToken(this.testConfig);
    const allUsers = await listUsers(bearerToken);
    const userOfInterest = _.find(allUsers, user => user.username === this.testConfig.username);
    return userOfInterest.isAdmin;
  }

  async verifyTestProject() {
    const params = getProjectParams(this.testConfig.projectId);
    const bearerToken = await getTestAdminToken(this.testConfig);
    const headers = { 'Authorization': bearerToken, 'Content-Type': 'application/json' };
    const response = await axios.get(params.api, { headers });
    if (validResponse(response)) return true;

    throw new Error(response);
  }
}

module.exports = BaseFixture;
