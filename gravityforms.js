/*!
 * GravityForms API
 *
 * Copyright(c) 2015 SiteOptimo
 */

/*jshint node: true */
'use strict';

var gravityForms = require('./lib/gravityforms');

/**
 * NodeJs GravityForms API Wrapper Client
 * @param endpoint
 * @param publicKey
 * @param privateKey
 * @constructor
 */
var Client = function(endpoint, publicKey, privateKey) {
  gravityForms.init(endpoint, publicKey, privateKey);
};

Client.prototype = {
  /**
   * Get a list of forms.
   *
   * @param callback
   */
  getForms: function(callback) {
    var _this = this;

    gravityForms.request('forms', function(error, forms) {
      callback(error, forms);
    });
  },
  /**
   * Get a specific form.
   *
   * @param formId
   * @param callback
   */
  getForm: function(formId, callback) {
    var _this = this;

    gravityForms.request('forms/' + encodeURIComponent(formId), function(error, forms) {
      callback(error, forms);
    });
  },
  /**
   * Submit a form.
   *
   * @param formId
   * @param inputValues
   * @param callback
   */
  submitForm: function(formId, inputValues, callback) {
    var _this = this;

    gravityForms.request({
      method: 'POST',
      route: 'forms/' + encodeURIComponent(formId) + '/submissions',
      body: {
        input_values: inputValues
      },
    }, function(error, forms) {
      callback(error, forms);
    });
  }
};

module.exports = function(endpoint, publicKey, privateKey) {
  return new Client(endpoint, publicKey, privateKey);
};