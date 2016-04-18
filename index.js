/*!
 * GravityForms API
 *
 * Copyright(c) 2015 SiteOptimo
 */

/*jshint node: true */
'use strict';
require('dotenv').load();

var gravityForms = require('./gravityforms')(process.env.ENDPOINT, process.env.PUBLIC_KEY, process.env.PRIVATE_KEY);

// gravityForms.getForms(function(err, forms) {
//   console.log(forms);
// });
// gravityForms.getForm(5, function(err, forms) {
//   console.log(forms);
// });
gravityForms.submitForm(5, {
  'input_2': 'Koen',
  'input_1': 'https://www.siteoptimo.com',
  'input_3': 'koen@siteoptimo.com',
  'input_4': 'Blaat'
}, function(err, result) {
  console.log(err, result);
});