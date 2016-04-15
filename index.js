/*!
 * GravityForms API
 *
 * Copyright(c) 2015 SiteOptimo
 */

/*jshint node: true */
'use strict';

var gravityForms = require('./gravityforms')('https://www.siteoptimo.com/gravityformsapi/', '21ee943183', 'a5084a06e7a34c3');

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