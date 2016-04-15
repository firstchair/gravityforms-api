/*!
 * GravityForms API
 *
 * Copyright(c) 2015 SiteOptimo
 */

/*jshint node: true */
'use strict';

var crypto = require('crypto');
var request = require('request');
var url = require('url');
var util = require('util');
var querystring = require('querystring');

/**
 * Sign an input-string with a key using sha1 and return base64 encoded version.
 *
 * @param input
 * @param key
 * @returns {*}
 */
function sign(input, key) {
  return crypto.createHmac('sha1', key).update(input).digest('base64');
}

/**
 * Gravity forms object.
 * @constructor
 */
var GravityForms = function() {
  this.DEFAULT_EXPIRATION = 360; //60; // 60 seconds
};

GravityForms.prototype = {
  endpoint: '',
  publicKey: '',
  privateKey: '',
  /**
   * Initializes the API.
   * @param endpoint
   * @param publicKey
   * @param privateKey
   */
  init: function(endpoint, publicKey, privateKey) {
    if (!endpoint || !endpoint.length) {
      throw new Error('No endpoint given.');
    }
    if (!publicKey || !publicKey.length) {
      throw new Error('No publicKey given.');
    }
    if (!privateKey || !privateKey.length) {
      throw new Error('No privateKey given.');
    }

    // Check if the URL is valid.
    var parsedUrl = url.parse(endpoint);

    if (!parsedUrl || !parsedUrl.host) {
      throw new Error('Please provide a valid API URL.');
    }

    this.endpoint = this.cleanEndPoint(endpoint);
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  },
  /**
   * Clean an endpoint (slashes etc).
   * @param endpoint
   * @returns {string}
   */
  cleanEndPoint: function(endpoint) {
    return endpoint.replace(/\/$/, '') + '/';
  },
  /**
   * Perform a request.
   * @param options
   * @param callback
   */
  request: function(options, callback) {
    var _this = this;
    // method, route, query, body
    if (typeof options === "string") {
      options = {
        method: 'GET',
        route: options,
        query: {},
        body: {},
      }
    }

    if (!options.expires) {
      options.expires = parseInt(new Date().getTime() / 1000) + this.DEFAULT_EXPIRATION;
    }

    // Ensure method is uppercase.
    options.method = options.method.toUpperCase();
    options.query = options.query || {};
    options.query.api_key = this.publicKey;
    // Get the signature required.
    options.query.signature = this.getSignature(options.method, options.route, options.expires);
    options.query.expires = options.expires;

    // Set request options
    var requestOptions = {
      method: options.method,
      // Get the URL.
      uri: this.getUrl(options.route, options.query),
      json: true
    };

    // Set JSON body.
    if((options.method === 'POST' || options.method === 'PUT')) {
      requestOptions.body = options.body;
    }

    // Perform the actual request.
    request(requestOptions, function(error, response, body) {
      // Error handling.
      if (error) {
        return callback(error, null);
      }

      if (response.statusCode < 200 || response.statusCode >= 300) {
        var err = new Error(response.statusText);
        error.statusCode = response.statusCode;

        callback(err, null);
      }

      if (body.status > 202) {
        callback(_this.getErrorFromBody(body), body.response);
      }

      // Return the response.
      return callback(null, body.response);
    });
  },
  /**
   * Create an error object from an API response.
   * @param body
   * @returns {Error}
   */
  getErrorFromBody: function(body) {
    var message = body.status;

    if (!body.response) {
      return new Error('Error ' + message);
    }

    if (body.response.message) {
      message += body.response.message;
    }

    if(typeof body.response === "string") {
      message += ' ' + body.response;
    }

    var error = new Error(message);

    if (body.response.code && body.response.code.length) {
      error.code = body.response.code;
    }

    if (body.response.data && body.response.data.length) {
      error.data = body.response.data;
    }

    return error;
  },
  /**
   * Get the URL based on the route and the querystring.
   * @param route
   * @param query
   * @returns {string}
   */
  getUrl: function(route, query) {
    return this.endpoint + route + '?' + querystring.stringify(query);
  },
  /**
   * Get the signature required for the request.
   * @param method
   * @param route
   * @param expires
   * @returns {*}
   */
  getSignature: function(method, route, expires) {
    var toSign = util.format('%s:%s:%s:%d', this.publicKey, method, route, expires);

    return sign(toSign, this.privateKey);
  }
};

// Expose GravityForms API.
module.exports = new GravityForms();