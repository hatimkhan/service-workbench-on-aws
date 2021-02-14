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

function normalize(value) {
  if (_.isNil(value) || _.isString(value)) return value;
  return JSON.stringify(value);
}

class Settings {
  constructor(yamlObject = {}) {
    this.normalized = {};
    this.originals = {};
    const add = (key, value) => {
      const v = normalize(value);
      this.normalized[key.toLowerCase()] = v;
      this.originals[key] = v;
    };

    _.forEach(yamlObject, (value, key) => {
      add(key, value);
    });
  }

  get entries() {
    return this.originals;
  }

  set(key, value) {
    const v = normalize(value);
    this.normalized[key.toLowerCase()] = v;
    this.originals[key] = v;
  }

  get(rawKey) {
    const key = rawKey.toLowerCase();
    const value = this.normalized[key];
    if (_.isEmpty(value))
      throw new Error(
        `The "${key}" setting value is required but it is either empty or not provided via yaml configuration file.`,
      );

    return value;
  }

  getObject(key) {
    const value = this.get(key);
    try {
      return JSON.parse(value);
    } catch (e) {
      throw new Error(`The "${key}" setting value (${value}) is not a valid JSON object.`);
    }
  }

  getBoolean(rawKey) {
    const key = rawKey.toLowerCase();
    const raw = this.normalized[key];
    const error = () => new Error(`The "${key}" setting value (${raw}) is not a valid boolean.`);
    if (_.isNil(raw)) throw error();

    let value;
    try {
      value = JSON.parse(raw);
    } catch (e) {
      throw error();
    }

    if (!_.isBoolean(value)) throw error();

    return value;
  }

  getNumber(rawKey) {
    const key = rawKey.toLowerCase();
    const raw = this.normalized[key];
    const error = () => new Error(`The "${key}" setting value (${raw}) is not a valid number.`);
    if (_.isNil(raw)) throw error();

    let value;
    try {
      value = JSON.parse(raw);
    } catch (e) {
      throw error();
    }

    if (!_.isNumber(value)) throw error();

    return value;
  }

  optional(rawKey, defaultValue) {
    const key = rawKey.toLowerCase();
    const value = this.normalized[key];
    if (_.isEmpty(value)) return defaultValue;

    return value;
  }

  optionalObject(rawKey, defaultValue) {
    const key = rawKey.toLowerCase();
    let value = this.normalized[key];
    if (_.isEmpty(value)) return defaultValue;
    const error = () => new Error(`The "${key}" setting value (${value}) is not a valid object.`);

    try {
      value = JSON.parse(value);
    } catch (e) {
      throw error();
    }

    if (_.isEmpty(value)) return defaultValue;
    if (!_.isObject(value)) throw error();

    return value;
  }

  optionalNumber(rawKey, defaultValue) {
    const key = rawKey.toLowerCase();
    let value = this.normalized[key];
    if (_.isNil(value)) return defaultValue;
    const error = () => new Error(`The "${key}" setting value (${value}) is not a valid number.`);

    try {
      value = JSON.parse(value);
    } catch (e) {
      throw error();
    }

    if (!_.isNumber(value)) throw error();

    return value;
  }

  optionalBoolean(rawKey, defaultValue) {
    const key = rawKey.toLowerCase();
    let value = this.normalized[key];
    if (_.isNil(value) || value === '') return defaultValue;
    const error = () => new Error(`The "${key}" setting value (${value}) is not a valid boolean.`);

    try {
      value = JSON.parse(value);
    } catch (e) {
      throw error();
    }

    if (!_.isBoolean(value)) throw error();

    return value;
  }
}

module.exports = Settings;
