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

const CollectionResource = require('../base/collection-resource');
const StepTemplateVersions = require('./step-template-versions');

class StepTemplates extends CollectionResource {
  constructor({ clientSession }) {
    super({
      clientSession,
      type: 'stepTemplates',
      childType: 'stepTemplateVersions',
    });

    this.api = '/api/step-templates';
  }

  versions(id) {
    return new StepTemplateVersions({ clientSession: this.clientSession, id, parent: this });
  }

  async latest() {
    return this.get({}, { api: `${this.api}/latest` });
  }

  // ************************ Helpers methods ************************
}

module.exports = StepTemplates;
