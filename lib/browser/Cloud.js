'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.run = run;
exports.getJobsData = getJobsData;
exports.startJob = startJob;
exports.getJobStatus = getJobStatus;

var _CoreManager = require('./CoreManager');

var _CoreManager2 = _interopRequireDefault(_CoreManager);

var _decode = require('./decode');

var _decode2 = _interopRequireDefault(_decode);

var _encode = require('./encode');

var _encode2 = _interopRequireDefault(_encode);

var _ParseError = require('./ParseError');

var _ParseError2 = _interopRequireDefault(_ParseError);

var _ParsePromise = require('./ParsePromise');

var _ParsePromise2 = _interopRequireDefault(_ParsePromise);

var _ParseQuery = require('./ParseQuery');

var _ParseQuery2 = _interopRequireDefault(_ParseQuery);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * Contains functions for calling and declaring
 * <a href="/docs/cloud_code_guide#functions">cloud functions</a>.
 * <p><strong><em>
 *   Some functions are only available from Cloud Code.
 * </em></strong></p>
 *
 * @class Parse.Cloud
 * @static
 * @hideconstructor
 */

/**
 * Makes a call to a cloud function.
 * @method run
 * @name Parse.Cloud.run
 * @param {String} name The function name.
 * @param {Object} data The parameters to send to the cloud function.
 * @param {Object} options A Backbone-style options object
 * options.success, if set, should be a function to handle a successful
 * call to a cloud function.  options.error should be a function that
 * handles an error running the cloud function.  Both functions are
 * optional.  Both functions take a single argument.
 * @return {Parse.Promise} A promise that will be resolved with the result
 * of the function.
 */
/**
 * Copyright (c) 2015-present, Parse, LLC.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function run(name, data, options) {
  options = options || {};

  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Cloud function name must be a string.');
  }

  var requestOptions = {};
  if (options.useMasterKey) {
    requestOptions.useMasterKey = options.useMasterKey;
  }
  if (options.sessionToken) {
    requestOptions.sessionToken = options.sessionToken;
  }

  return _CoreManager2.default.getCloudController().run(name, data, requestOptions)._thenRunCallbacks(options);
}

/**
 * Gets data for the current set of cloud jobs.
 * @method getJobsData
 * @name Parse.Cloud.getJobsData
 * @param {Object} options A Backbone-style options object
 * options.success, if set, should be a function to handle a successful
 * call to a cloud function.  options.error should be a function that
 * handles an error running the cloud function.  Both functions are
 * optional.  Both functions take a single argument.
 * @return {Parse.Promise} A promise that will be resolved with the result
 * of the function.
 */
function getJobsData(options) {
  options = options || {};

  return _CoreManager2.default.getCloudController().getJobsData({
    useMasterKey: true
  })._thenRunCallbacks(options);
}

/**
 * Starts a given cloud job, which will process asynchronously.
 * @method startJob
 * @name Parse.Cloud.startJob
 * @param {String} name The function name.
 * @param {Object} data The parameters to send to the cloud function.
 * @param {Object} options A Backbone-style options object
 * options.success, if set, should be a function to handle a successful
 * call to a cloud function.  options.error should be a function that
 * handles an error running the cloud function.  Both functions are
 * optional.  Both functions take a single argument.
 * @return {Parse.Promise} A promise that will be resolved with the result
 * of the function.
 */
function startJob(name, data, options) {
  options = options || {};

  if (typeof name !== 'string' || name.length === 0) {
    throw new TypeError('Cloud job name must be a string.');
  }

  return _CoreManager2.default.getCloudController().startJob(name, data, {
    useMasterKey: true
  })._thenRunCallbacks(options);
}

/**
 * Gets job status by Id
 * @method getJobStatus
 * @name Parse.Cloud.getJobStatus
 * @param {String} jobStatusId The Id of Job Status.
 * @return {Parse.Object} Status of Job.
 */
function getJobStatus(jobStatusId) {
  var query = new _ParseQuery2.default('_JobStatus');
  return query.get(jobStatusId, { useMasterKey: true });
}

var DefaultController = {
  run: function (name, data, options) {
    var RESTController = _CoreManager2.default.getRESTController();

    var payload = (0, _encode2.default)(data, true);

    var request = RESTController.request('POST', 'functions/' + name, payload, options);

    return request.then(function (res) {
      var decoded = (0, _decode2.default)(res);
      if (decoded && decoded.hasOwnProperty('result')) {
        return _ParsePromise2.default.as(decoded.result);
      }
      return _ParsePromise2.default.error(new _ParseError2.default(_ParseError2.default.INVALID_JSON, 'The server returned an invalid response.'));
    });
  },
  getJobsData: function (options) {
    var RESTController = _CoreManager2.default.getRESTController();

    var request = RESTController.request('GET', 'cloud_code/jobs/data', null, options);

    return request;
  },
  startJob: function (name, data, options) {
    var RESTController = _CoreManager2.default.getRESTController();

    var payload = (0, _encode2.default)(data, true);

    var request = RESTController.request('POST', 'jobs/' + name, payload, options);

    return request;
  }
};

_CoreManager2.default.setCloudController(DefaultController);