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

const { runSetup } = require('../../../support/setup');
const errorCode = require('../../../support/utils/error-code');

describe('Create Account scenarios', () => {
  let setup;
  let adminSession;

  beforeAll(async () => {
    setup = await runSetup();
    adminSession = await setup.defaultAdminSession();
  });

  afterAll(async () => {
    await setup.cleanup();
  });

  describe('Creating an Account', () => {
    it('should fail if admin is inactive', async () => {
      const testAwsAccountId = setup.gen.string({ prefix: `create-account-test-inactive-admin` });
      const admin2Session = await setup.createAdminSession();
      await adminSession.resources.users.deactivateUser(admin2Session.user);

      await expect(admin2Session.resources.accounts.create(testAwsAccountId)).rejects.toMatchObject({
        code: errorCode.http.code.unauthorized,
      });
    });

    it('should fail if non-admin user is trying to create Account', async () => {
      const testAwsAccountId = setup.gen.string({ prefix: `create-account-test-non-admin` });
      const researcherSession = await setup.createResearcherSession();

      await expect(researcherSession.resources.accounts.create(testAwsAccountId)).rejects.toMatchObject({
        code: errorCode.http.code.forbidden,
      });
    });

    it('should fail if the body does not contain required fields', async () => {
      const admin2Session = await setup.createAdminSession();
      const prefix = 'create-account-test-req-fields';
      const requestBody = {
        accountName: setup.gen.string({ prefix }),
        accountEmail: setup.gen.username({ prefix }),

        // Other required params are:
        // masterRoleArn, externalId
      };

      await expect(admin2Session.resources.accounts.create(requestBody)).rejects.toMatchObject({
        code: errorCode.http.code.badRequest,
      });
    });

    it('should fail for anonymous user', async () => {
      const testAwsAccountId = setup.gen.string({ prefix: `create-account-test-anon-user` });
      const anonymousSession = await setup.createAnonymousSession();
      await expect(anonymousSession.resources.accounts.create(testAwsAccountId)).rejects.toMatchObject({
        code: errorCode.http.code.badImplementation,
      });
    });
  });
});
