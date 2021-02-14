/* eslint-disable func-names */
const _ = require('lodash');
const { defineStep } = require('@cucumber/cucumber');
const assert = require('assert').strict;

const getAPIClient = require('../support/http-client');
const { listStudies } = require('../../utils/studies');

defineStep('an open data study with id {string}', async function(studyId) {
  const adminAPIClient = await getAPIClient(this.adminIdToken);
  const openDataStudies = await listStudies(adminAPIClient, 'Open Data');
  const studyOfInterest = _.find(openDataStudies, study => study.id === studyId);
  assert.strictEqual(_.isEmpty(studyOfInterest), false);
});
